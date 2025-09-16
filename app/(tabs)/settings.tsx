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
import { useLocalization } from "@/utils/localization-context";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DatabaseStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export default function SettingsScreen() {
  const { t, locale, changeLocale, getAvailableLocales } = useLocalization();
  const [databaseStats, setDatabaseStats] = useState<DatabaseStats | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // データベース統計を取得
  const loadDatabaseStats = async () => {
    try {
      const stats = await getDatabaseStats();
      if (stats.success && "totalTasks" in stats) {
        setDatabaseStats({
          totalTasks: stats.totalTasks!,
          completedTasks: stats.completedTasks!,
          pendingTasks: stats.pendingTasks!,
        });
      }
    } catch (error) {
      console.error("統計情報の取得に失敗:", error);
    }
  };

  useEffect(() => {
    loadDatabaseStats();
  }, []);

  const handleHelpPress = () => {
    console.log("ヘルプとフィードバックがタップされました");
  };

  const handleLogoutPress = () => {
    console.log("ログアウトがタップされました");
  };

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
