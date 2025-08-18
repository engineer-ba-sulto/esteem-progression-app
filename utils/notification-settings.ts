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
 * @returns 保存された通知設定、またはnull
 */
export const loadNotificationSettings =
  async (): Promise<NotificationSettings | null> => {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to load notification settings:", error);
      return null;
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
