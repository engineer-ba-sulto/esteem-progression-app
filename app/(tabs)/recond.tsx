import AdBanner from "@/components/adbanner";
import CalendarView from "@/components/calendar-view";
import { PencilIcon, UserCircleIcon } from "@/components/icons";
import StatCard from "@/components/stat-card";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AchievementCard from "../../components/achievement-card";
import { achievements } from "../../constants/achievements";

export default function RecordScreen() {
  return (
    <SafeAreaView className="flex flex-col h-full bg-blue-50" edges={["top"]}>
      {/* Header */}
      <View className="p-4 flex flex-row items-center justify-between flex-shrink-0 bg-white rounded-3xl shadow-sm h-24">
        <View className="w-8" />
        <Text className="text-2xl font-bold">継続の記録</Text>
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
            継続の記録
          </Text>
          <View className="flex flex-row gap-4">
            <StatCard
              value="15日"
              label="現在の継続日数"
              color="text-yellow-500"
            />
            <StatCard value="25日" label="最高継続記録" color="text-blue-500" />
            <StatCard value="76" label="合計達成数" color="text-green-500" />
          </View>
        </View>

        <View className="my-8">
          <Text className="px-2 text-sm font-semibold text-gray-500 mb-2">
            月間カレンダー
          </Text>
          <CalendarView />
        </View>

        <View className="my-8">
          <Text className="px-2 text-sm font-semibold text-gray-500 mb-2">
            実績
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
