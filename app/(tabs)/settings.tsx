import AdBanner from "@/components/adbanner";
import {
  ArrowUpTrayIcon,
  BellIcon,
  LanguageIcon,
  TrashIcon,
} from "@/components/icons";
import TabHeader from "@/components/screen-header";
import SettingCard from "@/components/setting-card";
import { deleteAllData, getDatabaseStats } from "@/db/client";
import { dummyDataManager } from "@/utils/dummy-data-manager";
import { useLocalization } from "@/utils/localization-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { t, locale, changeLocale, getAvailableLocales } = useLocalization();
  const [isLoading, setIsLoading] = useState(false);
  const [isDummyDataEnabled, setIsDummyDataEnabled] = useState(false);

  // データベース統計を取得
  const loadDatabaseStats = async () => {
    try {
      await getDatabaseStats();
    } catch (error) {
      console.error("統計情報の取得に失敗:", error);
    }
  };

  // ダミーデータの状態を取得
  const loadDummyDataStatus = async () => {
    try {
      const enabled = await dummyDataManager.isDummyDataEnabled();
      setIsDummyDataEnabled(enabled);
    } catch (error) {
      console.error("ダミーデータ状態の取得に失敗:", error);
    }
  };

  useEffect(() => {
    loadDatabaseStats();
    loadDummyDataStatus();
  }, []);

  const handleLanguagePress = () => {
    const availableLocales = getAvailableLocales();
    const currentLocale = locale;

    // 現在の言語の次の言語に切り替え
    const currentIndex = availableLocales.indexOf(currentLocale);
    const nextIndex = (currentIndex + 1) % availableLocales.length;
    const newLocale = availableLocales[nextIndex];

    changeLocale(newLocale);
  };

  const handleDataDeletionPress = () => {
    Alert.alert(
      t("settings.dataDeletionTitle"),
      t("settings.dataDeletionWarning"),
      [
        {
          text: t("settings.dataDeletionCancel"),
          style: "cancel",
        },
        {
          text: t("settings.dataDeletionConfirm"),
          style: "destructive",
          onPress: async () => {
            await executeDataDeletion();
          },
        },
      ]
    );
  };

  const executeDataDeletion = async () => {
    setIsLoading(true);
    try {
      const result = await deleteAllData();

      if (result.success) {
        Alert.alert(t("settings.dataDeletionSuccess"), result.message, [
          {
            text: t("common.confirm"),
            onPress: () => {
              // 統計情報を更新
              loadDatabaseStats();
            },
          },
        ]);
      } else {
        Alert.alert(t("settings.dataDeletionError"), result.message, [
          { text: t("common.confirm") },
        ]);
      }
    } catch (error) {
      console.error("データ削除エラー:", error);
      Alert.alert(
        t("settings.dataDeletionError"),
        "予期しないエラーが発生しました",
        [{ text: t("common.confirm") }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDummyDataToggle = async () => {
    const action = isDummyDataEnabled ? "無効" : "有効";
    const currentLanguage = locale === "ja" ? "日本語" : "English";

    Alert.alert(
      `ダミーデータを${action}にしますか？`,
      isDummyDataEnabled
        ? "現在のデータが削除され、空の状態になります。"
        : `現在のデータが削除され、${currentLanguage}のサンプルデータが追加されます。`,
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: action,
          onPress: async () => {
            setIsLoading(true);
            try {
              const success = await dummyDataManager.toggleDummyData(locale);

              if (success) {
                setIsDummyDataEnabled(!isDummyDataEnabled);
                await loadDatabaseStats();
                Alert.alert("完了", `ダミーデータが${action}になりました。`, [
                  { text: "OK" },
                ]);
              } else {
                Alert.alert(
                  "エラー",
                  "ダミーデータの切り替えに失敗しました。",
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              console.error("ダミーデータ切り替えエラー:", error);
              Alert.alert("エラー", "予期しないエラーが発生しました。", [
                { text: "OK" },
              ]);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex flex-col h-full bg-blue-50" edges={["top"]}>
      {/* Header */}
      <TabHeader title={t("settings.title")} />

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        <View className="mt-6">
          <View>
            <Text className="px-4 text-sm font-semibold text-gray-500 mb-2">
              {t("settings.general")}
            </Text>
            <SettingCard
              icon={<LanguageIcon />}
              label={`${t("settings.language")} (${locale === "ja" ? "日本語" : "English"} → ${locale === "ja" ? "English" : "日本語"})`}
              onPress={handleLanguagePress}
            />
            {/* <SettingCard
              icon={<StarIcon />}
              label={t("settings.subscription")}
              onPress={() => router.push("/settings/subscription")}
            /> */}
            <SettingCard
              icon={<BellIcon />}
              label={t("settings.notifications")}
              onPress={() => router.push("/settings/notifications")}
            />
          </View>
          <View>
            <Text className="px-4 mt-6 text-sm font-semibold text-gray-500 mb-2">
              {t("settings.dataManagement")}
            </Text>
            <SettingCard
              icon={<ArrowUpTrayIcon />}
              label={t("settings.backup")}
              onPress={() => router.push("/settings/backup")}
            />
            <SettingCard
              icon={<TrashIcon />}
              label={`${t("settings.deleteData")}${isLoading ? " (処理中...)" : ""}`}
              onPress={handleDataDeletionPress}
              disabled={isLoading}
            />
          </View>
          {__DEV__ && (
            <View>
              <Text className="px-4 mt-6 text-sm font-semibold text-gray-500 mb-2">
                開発・テスト
              </Text>
              <SettingCard
                icon={<Ionicons name="flask" size={20} color="#6B7280" />}
                label={`ダミーデータ ${isDummyDataEnabled ? "無効化" : "有効化"}${isLoading ? " (処理中...)" : ""}`}
                onPress={handleDummyDataToggle}
                disabled={isLoading}
              />
            </View>
          )}
          {/* <View>
            <Text className="px-4 mt-6 text-sm font-semibold text-gray-500 mb-2">
              {t("settings.support")}
            </Text>
            <SettingCard
              icon={<ShieldCheckIcon />}
              label={t("settings.policy")}
              onPress={() => router.push("/settings/policy")}
            />
            <SettingCard
              icon={<QuestionMarkCircleIcon />}
              label={t("settings.helpAndFeedback")}
              onPress={handleHelpPress}
            />
          </View> */}
        </View>

        {/* <View className="text-center mt-8">
          <TouchableOpacity
            className="flex flex-row items-center justify-center w-full max-w-xs mx-auto py-3 px-6 bg-white rounded-lg border border-gray-200"
            onPress={handleLogoutPress}
          >
            <ArrowLeftOnRectangleIcon />
            <Text className="text-red-500 font-semibold ml-2">
              {t("settings.logout")}
            </Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}
