import AdBanner from "@/components/adbanner";
import {
  ArrowLeftOnRectangleIcon,
  ArrowUpTrayIcon,
  BellIcon,
  PaintBrushIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@/components/icons";
import SettingCard from "@/components/setting-card";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const handleReminderPress = () => {
    console.log("リマインダー設定がタップされました");
  };

  const handleAppearancePress = () => {
    console.log("外観設定がタップされました");
  };

  const handleSubscriptionPress = () => {
    console.log("サブスクリプション設定がタップされました");
  };

  const handleBackupPress = () => {
    console.log("バックアップ設定がタップされました");
  };

  const handlePrivacyPress = () => {
    console.log("プライバシー設定がタップされました");
  };

  const handleHelpPress = () => {
    console.log("ヘルプとフィードバックがタップされました");
  };

  const handleLogoutPress = () => {
    console.log("ログアウトがタップされました");
  };

  return (
    <SafeAreaView className="flex flex-col h-full bg-blue-50" edges={["top"]}>
      {/* Header */}
      <View className="p-4 flex-shrink-0 bg-white rounded-3xl shadow-sm h-24 flex items-center justify-center">
        <Text className="text-2xl font-bold text-gray-800 text-center">
          設定
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        <View className="mt-6">
          <Text className="px-4 text-sm font-semibold text-gray-500 mb-2">
            一般
          </Text>
          <SettingCard
            icon={<BellIcon />}
            label="リマインダー"
            onPress={handleReminderPress}
          />
          <SettingCard
            icon={<PaintBrushIcon />}
            label="外観"
            onPress={handleAppearancePress}
          />
          <SettingCard
            icon={<StarIcon />}
            label="サブスクリプション"
            onPress={handleSubscriptionPress}
          />

          <Text className="px-4 mt-6 text-sm font-semibold text-gray-500 mb-2">
            データ管理
          </Text>
          <SettingCard
            icon={<ArrowUpTrayIcon />}
            label="バックアップ"
            onPress={handleBackupPress}
          />

          <Text className="px-4 mt-6 text-sm font-semibold text-gray-500 mb-2">
            サポート
          </Text>
          <SettingCard
            icon={<ShieldCheckIcon />}
            label="プライバシー"
            onPress={handlePrivacyPress}
          />
          <SettingCard
            icon={<QuestionMarkCircleIcon />}
            label="ヘルプとフィードバック"
            onPress={handleHelpPress}
          />
        </View>

        <View className="text-center mt-8">
          <TouchableOpacity
            className="flex flex-row items-center justify-center w-full max-w-xs mx-auto py-3 px-6 bg-white rounded-lg border border-gray-200"
            onPress={handleLogoutPress}
          >
            <ArrowLeftOnRectangleIcon />
            <Text className="text-red-500 font-semibold ml-2">ログアウト</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}
