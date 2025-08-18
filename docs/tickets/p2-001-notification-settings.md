### チケット: P2-001 通知設定の永続化 + ローカル通知

#### 背景 / 目的

- **背景**: 現在の `app/settings/notifications.tsx` はUIのみのスタブで、設定値が永続化されず、実際の通知機能が動作しない。
- **目的**: 通知設定を永続化し、`expo-notifications` を使用して毎日指定時刻の繰り返し通知をスケジュール/キャンセルする機能を実装する。

#### スコープ（このチケットでやること）

- 通知設定の永続化
  - 設定値を `AsyncStorage` に保存（通知ON/OFF、時刻設定）
  - アプリ起動時に設定値を復元
- ローカル通知の実装
  - `expo-notifications` の導入と設定
  - 毎日指定時刻の繰り返し通知をスケジュール
  - 通知設定変更時のスケジュール更新/キャンセル
  - 通知権限の要求と確認
- 通知設定UIの機能化
  - 設定変更時の即座な永続化
  - 通知ON/OFF切り替えの即座な反映
  - 時刻設定変更の即座な反映

#### やらないこと（Out of Scope）

- バックアップ/復元機能（P2-002で対応）
- 言語切替機能（P2-003で対応）
- データ全削除機能（P2-004で対応）
- サブスクリプション機能（P3で対応）
- プッシュ通知（サーバーサイド実装は含まない）

#### 受入条件（Acceptance Criteria）

- 通知設定（ON/OFF、時刻）が `AsyncStorage` に永続化される
- アプリ再起動後も通知設定が保持される
- 通知ONに設定した場合、毎日指定時刻にローカル通知が送信される
- 通知OFFに設定した場合、スケジュールされた通知がキャンセルされる
- 時刻設定を変更した場合、既存のスケジュールが更新される
- 通知権限が拒否された場合、適切なエラーメッセージが表示される
- 通知設定変更が即座に反映される（再起動不要）

#### 影響/変更ファイル

- **変更**: `app/settings/notifications.tsx`（永続化 + 通知機能実装）
- **変更**: `package.json`（`expo-notifications` 依存関係追加）
- **参照**: `utils/localization-context.tsx`（多言語対応）

#### 依存関係 / ブロッカー

- **依存**: P0-001 DBクライアントの単一インスタンス化（済）
- **依存**: P0-002 ホームDB化（基本的なアプリ動作の確認が前提）
- **依存**: P0-004 カレンダーのDB化（同一アプリ内での整合性確認）

#### 実装メモ（参考）

##### AsyncStorage での設定保存例:

```ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATION_SETTINGS_KEY = "notification_settings";

interface NotificationSettings {
  enabled: boolean;
  time: string; // "HH:mm" format
}

const saveNotificationSettings = async (settings: NotificationSettings) => {
  try {
    await AsyncStorage.setItem(
      NOTIFICATION_SETTINGS_KEY,
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error("Failed to save notification settings:", error);
  }
};

const loadNotificationSettings =
  async (): Promise<NotificationSettings | null> => {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to load notification settings:", error);
      return null;
    }
  };
```

##### expo-notifications の設定例:

```ts
import * as Notifications from "expo-notifications";

// 通知の設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 通知権限の要求
const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

// 毎日の繰り返し通知をスケジュール
const scheduleDailyNotification = async (time: string) => {
  const [hour, minute] = time.split(":").map(Number);

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: t("notifications.dailyReminder.title"),
      body: t("notifications.dailyReminder.body"),
      data: { type: "daily_reminder" },
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
};

// 通知をキャンセル
const cancelNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
```

##### 通知設定コンポーネントの実装例:

```ts
import { useState, useEffect } from 'react';
import { Switch, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const NotificationSettings = () => {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('09:00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await loadNotificationSettings();
    if (settings) {
      setEnabled(settings.enabled);
      setTime(settings.time);
    }
    setLoading(false);
  };

  const handleToggle = async (value: boolean) => {
    setEnabled(value);
    await saveNotificationSettings({ enabled: value, time });

    if (value) {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await scheduleDailyNotification(time);
      } else {
        // 権限が拒否された場合の処理
        setEnabled(false);
        await saveNotificationSettings({ enabled: false, time });
      }
    } else {
      await cancelNotifications();
    }
  };

  const handleTimeChange = async (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      const timeString = selectedTime.toTimeString().slice(0, 5);
      setTime(timeString);
      await saveNotificationSettings({ enabled, time: timeString });

      if (enabled) {
        await scheduleDailyNotification(timeString);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View>
      <View className="flex-row justify-between items-center p-4">
        <Text>{t('notifications.enable')}</Text>
        <Switch value={enabled} onValueChange={handleToggle} />
      </View>

      {enabled && (
        <View className="p-4">
          <Text>{t('notifications.time')}</Text>
          <DateTimePicker
            value={new Date(`2000-01-01T${time}`)}
            mode="time"
            onChange={handleTimeChange}
          />
        </View>
      )}
    </View>
  );
};
```

#### リスク / 留意点

- 通知権限が拒否された場合の適切なエラーハンドリング
- アプリがバックグラウンドにある場合の通知動作確認
- タイムゾーンの考慮（デバイスのローカル時間での通知）
- 通知の重複スケジュール防止
- `expo-notifications` の依存関係追加によるビルドサイズ増加

#### 見積り

- expo-notifications 導入・設定: 0.5日
- AsyncStorage での永続化実装: 0.5日
- 通知スケジュール機能実装: 1日
- UI連携・動作確認: 0.5日
- **合計: 2.5日**
