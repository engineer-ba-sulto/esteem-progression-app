import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_SETTINGS_KEY = "language_settings";

export interface LanguageSettings {
  locale: string;
}

/**
 * 言語設定を保存する
 * @param settings 保存する言語設定
 * @returns 保存結果
 */
export const saveLanguageSettings = async (
  settings: LanguageSettings
): Promise<{ success: boolean; error?: string }> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_SETTINGS_KEY, JSON.stringify(settings));
    return { success: true };
  } catch (error) {
    console.error("Failed to save language settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * 言語設定を読み込む
 * @returns 保存された言語設定、またはnull
 */
export const loadLanguageSettings =
  async (): Promise<LanguageSettings | null> => {
    try {
      const data = await AsyncStorage.getItem(LANGUAGE_SETTINGS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to load language settings:", error);
      return null;
    }
  };

/**
 * 言語設定を削除する
 * @returns 削除結果
 */
export const clearLanguageSettings = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await AsyncStorage.removeItem(LANGUAGE_SETTINGS_KEY);
    return { success: true };
  } catch (error) {
    console.error("Failed to clear language settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
