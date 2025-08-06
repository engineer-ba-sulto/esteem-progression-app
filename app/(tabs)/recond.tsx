import AdBanner from "@/components/adbanner";
import CalendarView from "@/components/calendar-view";
import { PencilIcon, UserCircleIcon } from "@/components/icons";
import StatCard from "@/components/stat-card";
import { useLocalization } from "@/utils/localization-context";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AchievementCard from "../../components/achievement-card";
import { useAchievements } from "../../constants/achievements";

export default function RecordScreen() {
  const { t } = useLocalization();
  const achievements = useAchievements();

  return (
    <SafeAreaView className="flex flex-col h-full bg-blue-50" edges={["top"]}>
      {/* Header */}
      <View className="p-4 flex flex-row items-center justify-between flex-shrink-0 bg-white rounded-3xl shadow-sm h-24">
        <View className="w-8" />
        <Text className="text-2xl font-bold">{t("achievements.title")}</Text>
        <TouchableOpacity className="p-2 rounded-full">
          <PencilIcon />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        <View className="flex flex-col items-center text-center my-4">
          <UserCircleIcon />
          <Text className="text-2xl font-bold mt-3 text-gray-900">
            田中 太郎
          </Text>
          <Text className="text-gray-500">taro.tanaka@example.com</Text>
        </View>

        <View className="my-8">
          <Text className="px-2 text-sm font-semibold text-gray-500 mb-2">
            {t("achievements.title")}
          </Text>
          <View className="flex flex-row gap-4">
            <StatCard
              value="15"
              unit={t("achievements.streakDays")}
              label={t("achievements.currentStreak")}
              color="text-yellow-500"
            />
            <StatCard
              value="25"
              unit={t("achievements.streakDays")}
              label={t("achievements.bestStreak")}
              color="text-blue-500"
            />
            <StatCard
              value="76"
              unit={t("achievements.achievementsCount")}
              label={t("achievements.totalAchievements")}
              color="text-green-500"
            />
          </View>
        </View>

        <View className="my-8">
          <Text className="px-2 text-sm font-semibold text-gray-500 mb-2">
            {t("achievements.monthlyCalendar")}
          </Text>
          <CalendarView />
        </View>

        <View className="my-8">
          <Text className="px-2 text-sm font-semibold text-gray-500 mb-2">
            {t("achievements.title")}
          </Text>
          <View>
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                icon={achievement.icon}
                title={achievement.title}
                achieved={achievement.achieved}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}
