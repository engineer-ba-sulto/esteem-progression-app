import { DATABASE } from "@/db/client";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const BACKUP_DIR = `${FileSystem.documentDirectory}Backups/`;

// バックアップディレクトリの作成
const ensureBackupDirectory = async () => {
  const dirInfo = await FileSystem.getInfoAsync(BACKUP_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(BACKUP_DIR, { intermediates: true });
  }
};

// バックアップファイル名の生成
const generateBackupFileName = (): string => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `esteem-backup-${timestamp}.db`;
};

// DBファイルのバックアップ
export const createBackup = async (): Promise<{
  success: boolean;
  path?: string;
  error?: string;
}> => {
  try {
    await ensureBackupDirectory();

    const sourcePath = `${FileSystem.documentDirectory}${DATABASE}`;
    const fileName = generateBackupFileName();
    const destinationPath = `${BACKUP_DIR}${fileName}`;

    // ソースファイルの存在確認
    const sourceInfo = await FileSystem.getInfoAsync(sourcePath);
    if (!sourceInfo.exists) {
      return { success: false, error: "Database file not found" };
    }

    // ファイルのコピー
    await FileSystem.copyAsync({
      from: sourcePath,
      to: destinationPath,
    });

    return { success: true, path: destinationPath };
  } catch (error) {
    console.error("Backup failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// バックアップファイルの選択と復元
export const restoreBackup = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // ファイル選択
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/x-sqlite3",
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.[0]) {
      return { success: false, error: "No file selected" };
    }

    const selectedFile = result.assets[0];

    // ファイルサイズチェック（例: 100MB制限）
    if (selectedFile.size && selectedFile.size > 100 * 1024 * 1024) {
      return { success: false, error: "File too large" };
    }

    // アプリを一時停止（DB操作中）
    const sourcePath = selectedFile.uri;
    const destinationPath = `${FileSystem.documentDirectory}${DATABASE}`;

    // 既存DBのバックアップ（安全のため）
    const backupPath = `${FileSystem.documentDirectory}${DATABASE}.backup`;
    await FileSystem.moveAsync({
      from: destinationPath,
      to: backupPath,
    });

    try {
      // 新しいDBファイルのコピー
      await FileSystem.copyAsync({
        from: sourcePath,
        to: destinationPath,
      });

      // バックアップファイルの削除
      await FileSystem.deleteAsync(backupPath);

      return { success: true };
    } catch (error) {
      // 復元失敗時は元のDBを復旧
      await FileSystem.moveAsync({
        from: backupPath,
        to: destinationPath,
      });
      throw error;
    }
  } catch (error) {
    console.error("Restore failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// バックアップ履歴の取得
export const getBackupHistory = async (): Promise<{
  success: boolean;
  backups?: { name: string; size: number; modified: Date }[];
  error?: string;
}> => {
  try {
    await ensureBackupDirectory();

    const files = await FileSystem.readDirectoryAsync(BACKUP_DIR);
    const backupFiles = files.filter((file) => file.endsWith(".db"));

    const backups = await Promise.all(
      backupFiles.map(async (fileName) => {
        const filePath = `${BACKUP_DIR}${fileName}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);

        return {
          name: fileName,
          size:
            fileInfo.exists && !fileInfo.isDirectory ? fileInfo.size || 0 : 0,
          modified: new Date(
            fileInfo.exists && !fileInfo.isDirectory
              ? fileInfo.modificationTime || Date.now()
              : Date.now()
          ),
        };
      })
    );

    // 日付順にソート（新しい順）
    backups.sort((a, b) => b.modified.getTime() - a.modified.getTime());

    return { success: true, backups };
  } catch (error) {
    console.error("Failed to get backup history:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// 古いバックアップファイルの削除
export const cleanupOldBackups = async (
  keepCount: number = 10
): Promise<{
  success: boolean;
  deletedCount?: number;
  error?: string;
}> => {
  try {
    const historyResult = await getBackupHistory();
    if (!historyResult.success || !historyResult.backups) {
      return { success: false, error: "Failed to get backup history" };
    }

    const backups = historyResult.backups;
    if (backups.length <= keepCount) {
      return { success: true, deletedCount: 0 };
    }

    const backupsToDelete = backups.slice(keepCount);
    let deletedCount = 0;

    for (const backup of backupsToDelete) {
      try {
        await FileSystem.deleteAsync(`${BACKUP_DIR}${backup.name}`);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete backup ${backup.name}:`, error);
      }
    }

    return { success: true, deletedCount };
  } catch (error) {
    console.error("Failed to cleanup old backups:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
