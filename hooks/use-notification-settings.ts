import {
  loadNotificationSettings,
  NotificationSettings,
  saveNotificationSettings,
} from "@/utils/notification-settings";
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
    return await updateSettings(newSettings);
  };

  const updateTime = async (time: string) => {
    if (!settings) return { success: false, error: "No settings loaded" };

    const newSettings = { ...settings, time };
    return await updateSettings(newSettings);
  };

  const updateMessage = async (message: string) => {
    if (!settings) return { success: false, error: "No settings loaded" };

    const newSettings = { ...settings, message };
    return await updateSettings(newSettings);
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
