import i18n from "@/locales";
import { LocalizationContextType } from "@/types/localization-context";
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
    // デバイスのロケールを取得
    const deviceLocale = Localization.getLocales()[0]?.languageCode || "ja";
    setLocale(deviceLocale);
    i18n.locale = deviceLocale;
  }, []);

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    i18n.locale = newLocale;
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
