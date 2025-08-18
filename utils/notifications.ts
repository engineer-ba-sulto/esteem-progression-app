import * as Notifications from "expo-notifications";

/**
 * 通知権限を要求する
 * @returns 権限が許可された場合はtrue、拒否された場合はfalse
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Failed to request notification permissions:", error);
    return false;
  }
};

/**
 * 現在の通知権限を確認する
 * @returns 権限が許可されている場合はtrue、拒否されている場合はfalse
 */
export const checkNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Failed to check notification permissions:", error);
    return false;
  }
};

/**
 * 毎日の繰り返し通知をスケジュールする
 * @param time 通知時刻（"HH:mm" format）
 * @param message 通知メッセージ
 * @returns スケジュール結果
 */
export const scheduleDailyNotification = async (
  time: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // 既存の通知をキャンセル
    await Notifications.cancelAllScheduledNotificationsAsync();

    const [hour, minute] = time.split(":").map(Number);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "タスクリマインダー",
        body: message || "今日のタスクは決まりましたか？",
        data: { type: "daily_reminder" },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to schedule notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * すべての通知をキャンセルする
 * @returns キャンセル結果
 */
export const cancelNotifications = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return { success: true };
  } catch (error) {
    console.error("Failed to cancel notifications:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
