import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATION_SETTINGS_KEY = "notification_settings";

export interface NotificationSettings {
  enabled: boolean;
  time: string; // "HH:mm" format
  message: string;
}

/**
 * 通知設定を保存する
 * @param settings 保存する通知設定
 * @returns 保存結果
 */
export const saveNotificationSettings = async (
  settings: NotificationSettings
): Promise<{ success: boolean; error?: string }> => {
  try {
    await AsyncStorage.setItem(
      NOTIFICATION_SETTINGS_KEY,
      JSON.stringify(settings)
    );
    return { success: true };
  } catch (error) {
    console.error("Failed to save notification settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * 通知設定を読み込む
 * @returns 保存された通知設定、またはデフォルト設定
 */
export const loadNotificationSettings =
  async (): Promise<NotificationSettings> => {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (data) {
        return JSON.parse(data);
      }

      // デフォルト設定を返す
      const defaultSettings: NotificationSettings = {
        enabled: false,
        time: "20:00",
        message: "今日のタスクは決まりましたか？",
      };

      // デフォルト設定を保存
      await AsyncStorage.setItem(
        NOTIFICATION_SETTINGS_KEY,
        JSON.stringify(defaultSettings)
      );

      return defaultSettings;
    } catch (error) {
      console.error("Failed to load notification settings:", error);
      // エラーの場合もデフォルト設定を返す
      return {
        enabled: false,
        time: "20:00",
        message: "今日のタスクは決まりましたか？",
      };
    }
  };

/**
 * 通知設定を削除する
 * @returns 削除結果
 */
export const clearNotificationSettings = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await AsyncStorage.removeItem(NOTIFICATION_SETTINGS_KEY);
    return { success: true };
  } catch (error) {
    console.error("Failed to clear notification settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
