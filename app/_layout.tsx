import addDummyData from "@/db/addDummyData";
import i18n from "@/locales";
import { LocalizationProvider } from "@/utils/localization-context";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as Localization from "expo-localization";
import { Stack } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { LocaleConfig } from "react-native-calendars";
import migrations from "../drizzle/migrations";
import "../global.css";

export const DATABASE_NAME = "test.db";

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success) {
      addDummyData(db);
    }
  }, [success, db]);

  useEffect(() => {
    // ローカライゼーションの初期化
    const deviceLocale = Localization.getLocales()[0]?.languageCode || "ja";
    i18n.locale = deviceLocale;
    console.log(`アプリの言語が設定されました: ${deviceLocale}`);

    // カレンダーのロケール初期化
    initializeCalendarLocale(deviceLocale);
  }, []);

  const initializeCalendarLocale = (locale: string) => {
    const monthNames =
      locale === "en"
        ? [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ]
        : [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ];

    const monthNamesShort =
      locale === "en"
        ? [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ]
        : [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ];

    const dayNames =
      locale === "en"
        ? [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ]
        : [
            "日曜日",
            "月曜日",
            "火曜日",
            "水曜日",
            "木曜日",
            "金曜日",
            "土曜日",
          ];

    const dayNamesShort =
      locale === "en"
        ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        : ["日", "月", "火", "水", "木", "金", "土"];

    LocaleConfig.locales[locale] = {
      monthNames,
      monthNamesShort,
      dayNames,
      dayNamesShort,
      today: locale === "en" ? "Today" : "今日",
    };

    LocaleConfig.defaultLocale = locale;
    console.log(`カレンダーのロケールが初期化されました: ${locale}`);
  };

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider databaseName={DATABASE_NAME} useSuspense>
        <LocalizationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
          </Stack>
        </LocalizationProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
