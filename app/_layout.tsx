import { DATABASE, db } from "@/db/client";
import i18n, { initializeCalendarLocale } from "@/locales";
import { LocalizationProvider } from "@/utils/localization-context";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as Localization from "expo-localization";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import mobileAds, { MaxAdContentRating } from "react-native-google-mobile-ads";
import migrations from "../drizzle/migrations";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    // 通知の基本設定
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // ローカライゼーションの初期化
    const deviceLocale = Localization.getLocales()[0]?.languageCode || "ja";
    i18n.locale = deviceLocale;
    // console.log(`アプリの言語が設定されました: ${deviceLocale}`);

    // カレンダーのロケール初期化
    initializeCalendarLocale(deviceLocale);

    // Google Mobile Ads SDKの初期化
    initializeMobileAds();
  }, []);

  const initializeMobileAds = async () => {
    try {
      // 広告リクエストの設定
      await mobileAds().setRequestConfiguration({
        // すべての広告リクエストに適したコンテンツ評価を設定
        maxAdContentRating: MaxAdContentRating.PG,
        // COPPAの目的でコンテンツを児童向けとして扱うことを示す
        tagForChildDirectedTreatment: false,
        // 同意年齢未満のユーザーに適した方法で広告リクエストを処理することを示す
        tagForUnderAgeOfConsent: false,
        // テストデバイスIDを設定
        testDeviceIdentifiers: ["EMULATOR"],
      });

      // Google Mobile Ads SDKを初期化
      const adapterStatuses = await mobileAds().initialize();
      console.log("Google Mobile Ads SDK initialized:", adapterStatuses);
    } catch (error) {
      console.error("Failed to initialize Google Mobile Ads SDK:", error);
    }
  };

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <MigrationGate />
    </Suspense>
  );
}

function MigrationGate() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SQLiteProvider databaseName={DATABASE} useSuspense>
      <LocalizationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
        </Stack>
      </LocalizationProvider>
    </SQLiteProvider>
  );
}
