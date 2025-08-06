import AdBanner from "@/components/adbanner";
import {
  ArrowLeftOnRectangleIcon,
  ArrowUpTrayIcon,
  BellIcon,
  LanguageIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  TrashIcon,
} from "@/components/icons";
import SettingCard from "@/components/setting-card";
import { useLocalization } from "@/utils/localization-context";
import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { t, locale, changeLocale, getAvailableLocales } = useLocalization();

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

    Alert.alert(
      t("settings.languageChanged"),
      `${t("settings.currentLanguage")}: ${newLocale === "ja" ? "日本語" : "English"}`,
      [{ text: t("common.confirm"), style: "default" }]
    );
  };

  const handleDataDeletionPress = () => {
    Alert.alert(
      t("settings.dataDeletionTitle"),
      t("settings.dataDeletionMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => {
            console.log("データ削除が実行されました");
            // 実際のデータ削除処理をここに実装
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex flex-col h-full bg-blue-50" edges={["top"]}>
      {/* Header */}
      <View className="p-4 flex-shrink-0 bg-white rounded-3xl shadow-sm h-24 flex items-center justify-center">
        <Text className="text-2xl font-bold text-gray-800 text-center">
          {t("settings.title")}
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        <View className="mt-6">
          <Text className="px-4 text-sm font-semibold text-gray-500 mb-2">
            {t("settings.general")}
          </Text>
          <SettingCard
            icon={<LanguageIcon />}
            label={`${t("settings.language")} (${locale === "ja" ? "日本語" : "English"})`}
            onPress={handleLanguagePress}
          />
          <SettingCard
            icon={<StarIcon />}
            label={t("settings.subscription")}
            onPress={() => router.push("/settings/subscription")}
          />
          <SettingCard
            icon={<BellIcon />}
            label={t("settings.notifications")}
            onPress={() => router.push("/settings/notifications")}
          />
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
            label={t("settings.deleteData")}
            onPress={handleDataDeletionPress}
          />
          <Text className="px-4 mt-6 text-sm font-semibold text-gray-500 mb-2">
            {t("settings.support")}
          </Text>
          <SettingCard
            icon={<ShieldCheckIcon />}
            label={t("settings.privacy")}
            onPress={() => router.push("/settings/privacy")}
          />
          <SettingCard
            icon={<QuestionMarkCircleIcon />}
            label={t("settings.helpAndFeedback")}
            onPress={handleHelpPress}
          />
        </View>

        <View className="text-center mt-8">
          <TouchableOpacity
            className="flex flex-row items-center justify-center w-full max-w-xs mx-auto py-3 px-6 bg-white rounded-lg border border-gray-200"
            onPress={handleLogoutPress}
          >
            <ArrowLeftOnRectangleIcon />
            <Text className="text-red-500 font-semibold ml-2">
              {t("settings.logout")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}
