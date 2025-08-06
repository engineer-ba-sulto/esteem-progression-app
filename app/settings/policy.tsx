import {
  ArrowLeftIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
} from "@/components/icons";
import SettingCard from "@/components/setting-card";
import { useLocalization } from "@/utils/localization-context";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PolicyScreen() {
  const { t } = useLocalization();

  const handlePrivacyPolicyPress = () => {
    // プライバシーポリシーの詳細画面に遷移
    console.log("プライバシーポリシーがタップされました");
  };

  const handleTermsOfServicePress = () => {
    // 利用規約の詳細画面に遷移
    console.log("利用規約がタップされました");
  };

  const handleBusinessRegistrationPress = () => {
    // 利用規約の詳細画面に遷移
    console.log("特定商取引法などに基づく表示がタップされました");
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex flex-col h-full bg-blue-50" edges={["top"]}>
      {/* Header */}
      <View className="p-4 flex-shrink-0 bg-white rounded-3xl shadow-sm h-24 flex items-center justify-center">
        <View className="flex-row items-center justify-between w-full">
          <TouchableOpacity onPress={handleBackPress} className="p-2">
            <ArrowLeftIcon />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">
            {t("policy.title")}
          </Text>
          <View className="w-10" />
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        <View className="mt-6">
          {/* ポリシーセクション */}
          <SettingCard
            icon={<DocumentTextIcon />}
            label={t("policy.privacyPolicy")}
            onPress={handlePrivacyPolicyPress}
          />
          <SettingCard
            icon={<DocumentTextIcon />}
            label={t("policy.termsOfService")}
            onPress={handleTermsOfServicePress}
          />
          <SettingCard
            icon={<DocumentTextIcon />}
            label={t("policy.businessRegistration")}
            onPress={handleBusinessRegistrationPress}
          />

          {/* 情報セクション */}
          <View className="mt-6 p-4 bg-blue-50 rounded-xl">
            <View className="flex-row items-start">
              <ShieldCheckIcon />
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-semibold mb-2">
                  {t("policy.privacyProtection")}
                </Text>
                <Text className="text-gray-600 text-sm leading-5">
                  {t("policy.privacyDescription")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
