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
