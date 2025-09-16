import { DATABASE } from "@/db/config";
// bumpDatabaseVersion は resetDbConnection 内で呼ばれるため未使用
import { closeDbConnectionSync, resetDbConnection } from "@/db/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const BACKUP_DIR = `${FileSystem.documentDirectory}Backups/`;
const SQLITE_DIR = `${FileSystem.documentDirectory}SQLite/`;

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

// 最終バックアップ日時の保存キー
const LAST_BACKUP_AT_KEY = "lastBackupAt";

export const setLastBackupDate = async (date: Date) => {
  try {
    await AsyncStorage.setItem(LAST_BACKUP_AT_KEY, date.toISOString());
  } catch {
    // no-op
  }
};

export const getLastBackupDate = async (): Promise<Date | null> => {
  try {
    const value = await AsyncStorage.getItem(LAST_BACKUP_AT_KEY);
    return value ? new Date(value) : null;
  } catch {
    return null;
  }
};

// DBファイルのバックアップ
export const createBackup = async (): Promise<{
  success: boolean;
  path?: string;
  error?: string;
}> => {
  try {
    await ensureBackupDirectory();

    const sourcePath = `${SQLITE_DIR}${DATABASE}`;
    const fileName = generateBackupFileName();
    const destinationPath = `${BACKUP_DIR}${fileName}`;

    // ソースファイルの存在確認
    const sourceInfo = await FileSystem.getInfoAsync(sourcePath);
    if (!sourceInfo.exists) {
      return { success: false, error: "データベースファイルが見つかりません" };
    }

    // ファイルサイズチェック
    if (
      sourceInfo.exists &&
      !sourceInfo.isDirectory &&
      sourceInfo.size &&
      sourceInfo.size > 100 * 1024 * 1024
    ) {
      return {
        success: false,
        error: "データベースファイルが大きすぎます（100MB制限）",
      };
    }

    // ストレージ容量チェック（簡易版）
    const storageInfo = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory || ""
    );
    if (
      storageInfo.exists &&
      !storageInfo.isDirectory &&
      storageInfo.size &&
      sourceInfo.exists &&
      !sourceInfo.isDirectory &&
      sourceInfo.size &&
      storageInfo.size < sourceInfo.size * 2
    ) {
      return { success: false, error: "ストレージ容量が不足しています" };
    }

    // ファイルのコピー
    await FileSystem.copyAsync({
      from: sourcePath,
      to: destinationPath,
    });

    // コピー後の検証
    const copiedInfo = await FileSystem.getInfoAsync(destinationPath);
    if (!copiedInfo.exists) {
      return {
        success: false,
        error: "バックアップファイルの作成に失敗しました",
      };
    }

    // 最終バックアップ日時を保存
    await setLastBackupDate(new Date());

    return { success: true, path: destinationPath };
  } catch (error) {
    console.error("Backup failed:", error);
    let errorMessage = "バックアップの作成に失敗しました";

    if (error instanceof Error) {
      if (error.message.includes("permission")) {
        errorMessage = "ファイルアクセス権限がありません";
      } else if (error.message.includes("storage")) {
        errorMessage = "ストレージ容量が不足しています";
      } else if (error.message.includes("not found")) {
        errorMessage = "データベースファイルが見つかりません";
      } else {
        errorMessage = error.message;
      }
    }

    return { success: false, error: errorMessage };
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
      return { success: false, error: "ファイルが選択されていません" };
    }

    const selectedFile = result.assets[0];

    // ファイルサイズチェック（例: 100MB制限）
    if (selectedFile.size && selectedFile.size > 100 * 1024 * 1024) {
      return {
        success: false,
        error: "ファイルサイズが大きすぎます（100MB制限）",
      };
    }

    // ファイル形式チェック
    if (!selectedFile.name?.endsWith(".db")) {
      return {
        success: false,
        error: "無効なファイル形式です（.dbファイルのみ対応）",
      };
    }

    // アプリを一時停止（DB操作中）
    const sourcePath = selectedFile.uri;
    const destinationPath = `${SQLITE_DIR}${DATABASE}`;

    // 既存DBのバックアップ（安全のため）
    const backupPath = `${SQLITE_DIR}${DATABASE}.backup`;

    // 既存DBがある場合のみバックアップを作成
    const existingDbInfo = await FileSystem.getInfoAsync(destinationPath);
    if (existingDbInfo.exists && !existingDbInfo.isDirectory) {
      await FileSystem.moveAsync({
        from: destinationPath,
        to: backupPath,
      });
    }

    try {
      // 新しいDBファイルのコピー（事前に接続を閉じる）
      closeDbConnectionSync();
      await FileSystem.copyAsync({
        from: sourcePath,
        to: destinationPath,
      });

      // バックアップファイルの削除（存在する場合）
      const backupInfo = await FileSystem.getInfoAsync(backupPath);
      if (backupInfo.exists && !backupInfo.isDirectory) {
        await FileSystem.deleteAsync(backupPath);
      }

      // 復元後に接続を張り直して購読を更新
      resetDbConnection();
      return { success: true };
    } catch (error) {
      // 復元失敗時は元のDBを復旧
      const backupInfo = await FileSystem.getInfoAsync(backupPath);
      if (backupInfo.exists && !backupInfo.isDirectory) {
        await FileSystem.moveAsync({
          from: backupPath,
          to: destinationPath,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Restore failed:", error);
    let errorMessage = "バックアップの復元に失敗しました";

    if (error instanceof Error) {
      if (error.message.includes("permission")) {
        errorMessage = "ファイルアクセス権限がありません";
      } else if (error.message.includes("storage")) {
        errorMessage = "ストレージ容量が不足しています";
      } else if (error.message.includes("not found")) {
        errorMessage = "バックアップファイルが見つかりません";
      } else if (error.message.includes("corrupt")) {
        errorMessage = "バックアップファイルが破損しています";
      } else {
        errorMessage = error.message;
      }
    }

    return { success: false, error: errorMessage };
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

// 最新のバックアップから復元（ファイル選択なし）
export const restoreLatestBackup = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await ensureBackupDirectory();
    const history = await getBackupHistory();
    if (!history.success || !history.backups || history.backups.length === 0) {
      return { success: false, error: "バックアップが存在しません" };
    }

    const latest = history.backups[0];
    const sourcePath = `${BACKUP_DIR}${latest.name}`;
    const destinationPath = `${SQLITE_DIR}${DATABASE}`;
    const backupPath = `${SQLITE_DIR}${DATABASE}.backup`;

    const sourceInfo = await FileSystem.getInfoAsync(sourcePath);
    if (!sourceInfo.exists || sourceInfo.isDirectory) {
      return { success: false, error: "バックアップファイルが見つかりません" };
    }

    const existingDbInfo = await FileSystem.getInfoAsync(destinationPath);
    if (existingDbInfo.exists && !existingDbInfo.isDirectory) {
      await FileSystem.moveAsync({ from: destinationPath, to: backupPath });
    }

    try {
      closeDbConnectionSync();
      await FileSystem.copyAsync({ from: sourcePath, to: destinationPath });
      const tmp = await FileSystem.getInfoAsync(backupPath);
      if (tmp.exists && !tmp.isDirectory) {
        await FileSystem.deleteAsync(backupPath);
      }
      resetDbConnection();
      return { success: true };
    } catch (error) {
      const tmp = await FileSystem.getInfoAsync(backupPath);
      if (tmp.exists && !tmp.isDirectory) {
        await FileSystem.moveAsync({ from: backupPath, to: destinationPath });
      }
      throw error;
    }
  } catch (error) {
    console.error("Restore latest failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
