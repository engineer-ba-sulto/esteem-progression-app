### チケット: P2-002 バックアップ/復元機能

#### 背景 / 目的

- **背景**: 現在の `app/settings/backup.tsx` はUIのみのスタブで、実際のデータバックアップ/復元機能が動作しない。
- **目的**: DBファイル（`DATABASE_NAME`）のエクスポート/インポート機能を実装し、ユーザーがデータを安全にバックアップ・復元できるようにする。

#### スコープ（このチケットでやること）

- バックアップ機能の実装
  - `expo-file-system` を使用したDBファイルのエクスポート
  - バックアップファイルの命名規則（日時を含む）
  - バックアップ先ディレクトリの指定（Documents/Backups/）
- 復元機能の実装
  - `expo-document-picker` を使用したバックアップファイル選択
  - 選択されたファイルのDBファイルへの復元
  - 復元前の確認ダイアログ
- エラーハンドリング
  - バックアップ/復元失敗時のユーザー通知
  - ファイルサイズ制限の考慮
  - 復元時のデータ整合性チェック
- UI/UX改善
  - バックアップ/復元の進行状況表示
  - 成功/失敗のフィードバック
  - バックアップ履歴の表示（オプション）

#### やらないこと（Out of Scope）

- 通知設定の永続化（P2-001で対応）
- 言語切替機能（P2-003で対応）
- データ全削除機能（P2-004で対応）
- クラウドバックアップ（ローカルファイルのみ）
- 自動バックアップ（手動操作のみ）
- バックアップの暗号化（平文での保存）

#### 受入条件（Acceptance Criteria）

- バックアップボタンでDBファイルがエクスポートされる
- バックアップファイルは日時を含む名前で保存される
- 復元ボタンでバックアップファイルを選択できる
- 復元前に確認ダイアログが表示される
- 復元後、アプリ内のデータが正しく反映される
- バックアップ/復元失敗時に適切なエラーメッセージが表示される
- バックアップ/復元の進行状況がユーザーに表示される
- 復元後、アプリの再起動なしでデータが反映される

#### 影響/変更ファイル

- **変更**: `app/settings/backup.tsx`（バックアップ/復元機能実装）
- **変更**: `package.json`（`expo-file-system`, `expo-document-picker` 依存関係追加）
- **参照**: `app/_layout.tsx`（`DATABASE_NAME` 定数）

#### 依存関係 / ブロッカー

- **依存**: P0-001 DBクライアントの単一インスタンス化（済）
- **依存**: P0-002 ホームDB化（基本的なアプリ動作の確認が前提）
- **依存**: P0-004 カレンダーのDB化（同一アプリ内での整合性確認）

#### 実装メモ（参考）

##### expo-file-system でのバックアップ例:

```ts
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { DATABASE_NAME } from "@/app/_layout";

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
const createBackup = async (): Promise<{
  success: boolean;
  path?: string;
  error?: string;
}> => {
  try {
    await ensureBackupDirectory();

    const sourcePath = `${FileSystem.documentDirectory}${DATABASE_NAME}`;
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
    return { success: false, error: error.message };
  }
};
```

##### expo-document-picker での復元例:

```ts
// バックアップファイルの選択と復元
const restoreBackup = async (): Promise<{
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
    const destinationPath = `${FileSystem.documentDirectory}${DATABASE_NAME}`;

    // 既存DBのバックアップ（安全のため）
    const backupPath = `${FileSystem.documentDirectory}${DATABASE_NAME}.backup`;
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
    return { success: false, error: error.message };
  }
};
```

##### バックアップ設定コンポーネントの実装例:

```ts
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BackupSettings = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const result = await createBackup();
      if (result.success) {
        Alert.alert(
          t('backup.success.title'),
          t('backup.success.message'),
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          t('backup.error.title'),
          result.error || t('backup.error.unknown'),
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        t('backup.error.title'),
        error.message,
        [{ text: 'OK' }]
      );
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    Alert.alert(
      t('backup.restore.confirm.title'),
      t('backup.restore.confirm.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('backup.restore.confirm.ok'),
          style: 'destructive',
          onPress: async () => {
            setIsRestoring(true);
            try {
              const result = await restoreBackup();
              if (result.success) {
                Alert.alert(
                  t('backup.restore.success.title'),
                  t('backup.restore.success.message'),
                  [{ text: 'OK' }]
                );
                // アプリの再起動またはデータの再読み込み
              } else {
                Alert.alert(
                  t('backup.restore.error.title'),
                  result.error || t('backup.restore.error.unknown'),
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              Alert.alert(
                t('backup.restore.error.title'),
                error.message,
                [{ text: 'OK' }]
              );
            } finally {
              setIsRestoring(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="p-4 space-y-4">
      <TouchableOpacity
        className="flex-row items-center justify-between p-4 bg-blue-100 rounded-lg"
        onPress={handleBackup}
        disabled={isBackingUp}
      >
        <View className="flex-row items-center space-x-3">
          <Ionicons name="cloud-upload" size={24} color="#3b82f6" />
          <Text className="text-lg font-medium">
            {isBackingUp ? t('backup.creating') : t('backup.create')}
          </Text>
        </View>
        {isBackingUp && <ActivityIndicator color="#3b82f6" />}
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center justify-between p-4 bg-green-100 rounded-lg"
        onPress={handleRestore}
        disabled={isRestoring}
      >
        <View className="flex-row items-center space-x-3">
          <Ionicons name="cloud-download" size={24} color="#10b981" />
          <Text className="text-lg font-medium">
            {isRestoring ? t('backup.restoring') : t('backup.restore')}
          </Text>
        </View>
        {isRestoring && <ActivityIndicator color="#10b981" />}
      </TouchableOpacity>
    </View>
  );
};
```

#### リスク / 留意点

- 復元時のデータ損失リスク（既存DBのバックアップ必須）
- 大きなDBファイルの処理時間
- ファイルシステムの権限問題
- 復元後のアプリ状態の整合性確保
- バックアップファイルの検証機能の必要性
- ストレージ容量の制限

#### 見積り

- expo-file-system, expo-document-picker 導入: 0.5日
- バックアップ機能実装: 1日
- 復元機能実装: 1日
- エラーハンドリング・UI改善: 0.5日
- **合計: 3日**
