import { db } from "@/db/client";
import { DATABASE } from "@/db/config";
import { migrateDbFileName } from "@/db/migrateDbFilename";
import i18n, { initializeCalendarLocale } from "@/locales";
import {
  getDatabaseVersion,
  subscribeDatabaseVersion,
} from "@/utils/db-events";
import { LocalizationProvider } from "@/utils/localization-context";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as Localization from "expo-localization";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
  const [dbVersion, setDbVersion] = useState(getDatabaseVersion());
  useEffect(() => {
    const unsub = subscribeDatabaseVersion(setDbVersion);
    return unsub;
  }, []);
  // DBを開く前に旧ファイル名から新ファイル名へワンタイム移行
  useEffect(() => {
    (async () => {
      try {
        await migrateDbFileName(
          [
            "test.db",
            "esteem-prod.db",
            "esteem-dev.db",
            "esteem-progression.db.bak",
          ],
          DATABASE
        );
      } catch (e) {
        console.warn("DB filename migration skipped:", e);
      }
    })();
  }, []);

  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View>
          <Text>Migration error: {error.message}</Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  if (!success) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ActivityIndicator size="large" />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider key={dbVersion} databaseName={DATABASE} useSuspense>
        <LocalizationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
          </Stack>
        </LocalizationProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
