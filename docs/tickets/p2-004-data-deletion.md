### チケット: P2-004 データ全削除機能

#### 背景 / 目的

- **背景**: 現在のアプリにはデータ全削除機能がなく、ユーザーがアプリのデータを完全にリセットしたい場合の手段がない。
- **目的**: 設定画面にデータ全削除機能を追加し、確認ダイアログを経て `DELETE FROM tasks` を実行し、アプリのデータを完全にリセットできるようにする。

#### スコープ（このチケットでやること）

- データ全削除UIの実装
  - 設定画面にデータ削除セクションを追加
  - 削除ボタンの実装（危険性を示すデザイン）
  - 削除前の確認ダイアログ
  - 削除後の完了通知
- データ削除機能の実装
  - `DELETE FROM tasks` の実行
  - 削除処理の進行状況表示
  - 削除失敗時のエラーハンドリング
  - 削除後のアプリ状態の更新
- 安全機能の実装
  - 削除前の最終確認（2段階確認）
  - 削除処理のキャンセル機能
  - 削除後の復元不可能性の明示

#### やらないこと（Out of Scope）

- 通知設定の永続化（P2-001で対応）
- バックアップ/復元機能（P2-002で対応）
- 言語切替機能（P2-003で対応）
- 部分的なデータ削除（全削除のみ）
- 削除データの復元機能
- 削除履歴の保持

#### 受入条件（Acceptance Criteria）

- 設定画面にデータ削除セクションが表示される
- 削除ボタンが危険性を示すデザイン（赤色等）で表示される
- 削除ボタン押下時に確認ダイアログが表示される
- 確認ダイアログで「削除」を選択した場合、データが完全に削除される
- 削除処理中に進行状況が表示される
- 削除完了後に完了通知が表示される
- 削除後、アプリ内のデータが即座に反映される（空の状態）
- 削除失敗時に適切なエラーメッセージが表示される
- 削除処理のキャンセルが可能である

#### 影響/変更ファイル

- **変更**: `app/(tabs)/settings.tsx`（データ削除UI追加）
- **参照**: `db/client.ts`（DB操作）
- **参照**: `db/schema.ts`（テーブル定義）

#### 依存関係 / ブロッカー

- **依存**: P0-001 DBクライアントの単一インスタンス化（済）
- **依存**: P0-002 ホームDB化（基本的なアプリ動作の確認が前提）
- **依存**: P0-004 カレンダーのDB化（同一アプリ内での整合性確認）

#### 実装メモ（参考）

##### データ削除機能の実装例:

```ts
import { db, taskTable } from "@/db/client";
import { eq } from "drizzle-orm";

// 全タスクデータの削除
const deleteAllTasks = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // 全タスクを削除
    await db.delete(taskTable);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete all tasks:", error);
    return { success: false, error: error.message };
  }
};

// タスク数の取得（削除前の確認用）
const getTaskCount = async (): Promise<number> => {
  try {
    const result = await db.select({ count: sql`count(*)` }).from(taskTable);
    return result[0]?.count || 0;
  } catch (error) {
    console.error("Failed to get task count:", error);
    return 0;
  }
};
```

##### データ削除コンポーネントの実装例:

```ts
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteAllTasks, getTaskCount } from '@/utils/data-management';

const DataDeletionSection = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [taskCount, setTaskCount] = useState<number | null>(null);

  // タスク数の取得
  const loadTaskCount = async () => {
    const count = await getTaskCount();
    setTaskCount(count);
  };

  useEffect(() => {
    loadTaskCount();
  }, []);

  const handleDeleteAllData = async () => {
    // 第1段階確認
    Alert.alert(
      t('settings.dataDeletion.warning.title'),
      t('settings.dataDeletion.warning.message', { count: taskCount }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.dataDeletion.warning.continue'),
          style: 'destructive',
          onPress: () => {
            // 第2段階確認
            Alert.alert(
              t('settings.dataDeletion.final.title'),
              t('settings.dataDeletion.final.message'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('settings.dataDeletion.final.delete'),
                  style: 'destructive',
                  onPress: performDeletion,
                },
              ]
            );
          },
        },
      ]
    );
  };

  const performDeletion = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAllTasks();

      if (result.success) {
        Alert.alert(
          t('settings.dataDeletion.success.title'),
          t('settings.dataDeletion.success.message'),
          [{ text: 'OK' }]
        );

        // タスク数を更新
        setTaskCount(0);

        // 必要に応じてアプリの状態を更新
        // 例: ホーム画面のデータ再読み込み
      } else {
        Alert.alert(
          t('settings.dataDeletion.error.title'),
          result.error || t('settings.dataDeletion.error.unknown'),
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        t('settings.dataDeletion.error.title'),
        error.message,
        [{ text: 'OK' }]
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View className="p-4 bg-red-50 rounded-lg border border-red-200">
      <View className="flex-row items-center space-x-2 mb-2">
        <Ionicons name="warning" size={20} color="#dc2626" />
        <Text className="text-lg font-semibold text-red-800">
          {t('settings.dataDeletion.title')}
        </Text>
      </View>

      <Text className="text-sm text-red-700 mb-4">
        {t('settings.dataDeletion.description')}
      </Text>

      {taskCount !== null && (
        <Text className="text-sm text-red-600 mb-4">
          {t('settings.dataDeletion.currentData', { count: taskCount })}
        </Text>
      )}

      <TouchableOpacity
        className={`flex-row items-center justify-center p-3 rounded-lg ${
          isDeleting ? 'bg-red-300' : 'bg-red-600'
        }`}
        onPress={handleDeleteAllData}
        disabled={isDeleting}
      >
        <Ionicons
          name="trash"
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text className="text-white font-medium">
          {isDeleting
            ? t('settings.dataDeletion.deleting')
            : t('settings.dataDeletion.deleteButton')
          }
        </Text>
        {isDeleting && <ActivityIndicator color="white" style={{ marginLeft: 8 }} />}
      </TouchableOpacity>

      <Text className="text-xs text-red-500 mt-2 text-center">
        {t('settings.dataDeletion.irreversible')}
      </Text>
    </View>
  );
};
```

##### 設定画面への統合例:

```ts
// app/(tabs)/settings.tsx
import { ScrollView, View } from 'react-native';
import { DataDeletionSection } from '@/components/data-deletion-section';
import { SettingCard } from '@/components/setting-card';

const SettingsScreen = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 space-y-4">
        {/* 既存の設定カード */}
        <SettingCard
          title={t('settings.notifications.title')}
          subtitle={t('settings.notifications.subtitle')}
          icon="notifications"
          onPress={() => router.push('/settings/notifications')}
        />

        <SettingCard
          title={t('settings.backup.title')}
          subtitle={t('settings.backup.subtitle')}
          icon="cloud-upload"
          onPress={() => router.push('/settings/backup')}
        />

        {/* 言語選択セクション */}
        <View className="bg-white rounded-lg shadow-sm">
          <LanguageSelector />
        </View>

        {/* データ削除セクション */}
        <DataDeletionSection />
      </View>
    </ScrollView>
  );
};
```

##### 多言語対応の翻訳例:

```ts
// locales/ja.ts
export const ja = {
  settings: {
    dataDeletion: {
      title: "データ全削除",
      description:
        "アプリ内のすべてのタスクデータを完全に削除します。この操作は取り消せません。",
      currentData: "現在のデータ: {count}件のタスク",
      deleteButton: "すべてのデータを削除",
      deleting: "削除中...",
      irreversible: "※この操作は取り消せません",
      warning: {
        title: "データ削除の確認",
        message: "{count}件のタスクデータを削除しますか？",
        continue: "削除を続行",
      },
      final: {
        title: "最終確認",
        message:
          "本当にすべてのデータを削除しますか？この操作は取り消せません。",
        delete: "削除する",
      },
      success: {
        title: "削除完了",
        message: "すべてのデータが削除されました。",
      },
      error: {
        title: "削除エラー",
        unknown: "データの削除に失敗しました。",
      },
    },
  },
};
```

#### リスク / 留意点

- 誤操作によるデータ損失のリスク（2段階確認で軽減）
- 削除処理中のアプリ状態の整合性確保
- 削除後のアプリ再起動の必要性検討
- 削除処理のパフォーマンス（大量データの場合）
- 削除失敗時のデータ整合性確保

#### 見積り

- データ削除機能実装: 0.5日
- 削除UI実装: 0.5日
- 確認ダイアログ・エラーハンドリング: 0.5日
- 設定画面統合・動作確認: 0.5日
- **合計: 2日**
