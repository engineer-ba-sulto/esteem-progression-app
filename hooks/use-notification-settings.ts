import {
  loadNotificationSettings,
  NotificationSettings,
  saveNotificationSettings,
} from "@/utils/notification-settings";
import {
  cancelNotifications,
  requestNotificationPermissions,
  scheduleDailyNotification,
} from "@/utils/notifications";
import { useEffect, useState } from "react";

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期設定の読み込み
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const savedSettings = await loadNotificationSettings();
      setSettings(savedSettings);

      // 保存された設定がある場合、通知が有効なら実際の通知をスケジュール
      if (savedSettings && savedSettings.enabled) {
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await scheduleDailyNotification(
            savedSettings.time,
            savedSettings.message
          );
        } else {
          // 権限がない場合は設定をOFFに更新
          await updateSettings({ ...savedSettings, enabled: false });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    try {
      setError(null);
      const result = await saveNotificationSettings(newSettings);

      if (result.success) {
        setSettings(newSettings);
        return { success: true };
      } else {
        setError(result.error || "Failed to save settings");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateEnabled = async (enabled: boolean) => {
    if (!settings) return { success: false, error: "No settings loaded" };

    const newSettings = { ...settings, enabled };
    const result = await updateSettings(newSettings);

    if (result.success) {
      // 通知設定に応じて実際の通知をスケジュール/キャンセル
      if (enabled) {
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await scheduleDailyNotification(
            newSettings.time,
            newSettings.message
          );
        } else {
          // 権限が拒否された場合は設定をOFFに戻す
          await updateSettings({ ...newSettings, enabled: false });
          return { success: false, error: "通知権限が拒否されました" };
        }
      } else {
        await cancelNotifications();
      }
    }

    return result;
  };

  const updateTime = async (time: string) => {
    if (!settings) return { success: false, error: "No settings loaded" };

    const newSettings = { ...settings, time };
    const result = await updateSettings(newSettings);

    if (result.success && newSettings.enabled) {
      // 通知が有効な場合は時刻を更新
      await scheduleDailyNotification(newSettings.time, newSettings.message);
    }

    return result;
  };

  const updateMessage = async (message: string) => {
    if (!settings) return { success: false, error: "No settings loaded" };

    const newSettings = { ...settings, message };
    const result = await updateSettings(newSettings);

    if (result.success && newSettings.enabled) {
      // 通知が有効な場合はメッセージを更新
      await scheduleDailyNotification(newSettings.time, newSettings.message);
    }

    return result;
  };

  return {
    settings,
    isLoading,
    error,
    loadSettings,
    updateSettings,
    updateEnabled,
    updateTime,
    updateMessage,
  };
};
