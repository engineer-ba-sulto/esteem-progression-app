import i18n from "@/locales";
import { LocalizationContextType } from "@/types/localization-context";
import {
  loadLanguageSettings,
  saveLanguageSettings,
} from "@/utils/language-settings";
import * as Localization from "expo-localization";
import React, { createContext, useContext, useEffect, useState } from "react";
import { LocaleConfig } from "react-native-calendars";

const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined
);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState("ja");
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    // 保存された言語設定を読み込む
    const loadSavedLanguage = async () => {
      try {
        const savedSettings = await loadLanguageSettings();
        if (savedSettings) {
          // 保存された言語設定がある場合はそれを使用
          setLocale(savedSettings.locale);
          i18n.locale = savedSettings.locale;
        } else {
          // 保存された設定がない場合はデバイスのロケールを使用
          const deviceLocale =
            Localization.getLocales()[0]?.languageCode || "ja";
          setLocale(deviceLocale);
          i18n.locale = deviceLocale;
        }
      } catch (error) {
        console.error("Failed to load language settings:", error);
        // エラー時はデバイスのロケールを使用
        const deviceLocale = Localization.getLocales()[0]?.languageCode || "ja";
        setLocale(deviceLocale);
        i18n.locale = deviceLocale;
      }
    };

    loadSavedLanguage();
  }, []);

  const changeLocale = async (newLocale: string) => {
    setLocale(newLocale);
    i18n.locale = newLocale;

    // カレンダーのロケールを更新
    updateCalendarLocale(newLocale);

    // 言語設定を永続化
    try {
      await saveLanguageSettings({ locale: newLocale });
    } catch (error) {
      console.error("Failed to save language settings:", error);
    }

    // 言語変更時にコンポーネントを再レンダリングするためのトリガー
    setUpdateTrigger((prev) => prev + 1);
  };

  const t = (key: string, params?: any) => {
    // updateTriggerを使用して、言語変更時に再レンダリングを強制
    const _ = updateTrigger;
    return i18n.t(key, params);
  };

  const getCurrentLocale = () => {
    return locale;
  };

  const getAvailableLocales = () => {
    return Object.keys(i18n.translations);
  };

  const updateCalendarLocale = (currentLocale: string) => {
    // useLocalizationのt関数を使用して翻訳を取得
    const monthNames = t("calendar.monthNames");
    const monthNamesShort = t("calendar.monthNamesShort");
    const dayNames = t("calendar.dayNames");
    const dayNamesShort = t("calendar.dayNamesShort");
    const today = t("calendar.today");

    const translations = {
      monthNames,
      monthNamesShort,
      dayNames,
      dayNamesShort,
      today,
    };

    LocaleConfig.locales[currentLocale] = translations;
    LocaleConfig.defaultLocale = currentLocale;
  };

  const value = {
    locale,
    changeLocale,
    t,
    getCurrentLocale,
    getAvailableLocales,
    updateCalendarLocale,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }
  return context;
};
