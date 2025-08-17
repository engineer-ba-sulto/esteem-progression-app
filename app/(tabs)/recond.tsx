// import AchievementCard from "@/components/achievement-card";
import AdBanner from "@/components/adbanner";
import CalendarView from "@/components/calendar-view";
// import { UserCircleIcon } from "@/components/icons";
import TabHeader from "@/components/screen-header";
// import StatCard from "@/components/stat-card";
// import { useRecords } from "@/constants/record";
import { useLocalization } from "@/utils/localization-context";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecordScreen() {
  const { t } = useLocalization();
  // const records = useRecords();

  return (
    <SafeAreaView className="flex flex-col h-full bg-blue-50" edges={["top"]}>
      {/* Header */}
      <TabHeader title={t("records.title")} />

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        {/* <View className="flex flex-col items-center text-center my-4">
          <UserCircleIcon />
          <Text className="text-2xl font-bold mt-3 text-gray-900">
            田中 太郎
          </Text>
          <Text className="text-gray-500">taro.tanaka@example.com</Text>
        </View> */}

        {/* <View className="my-8">
          <Text className="px-2 text-sm font-semibold text-gray-500 mb-2">
            {t("records.title")}
          </Text>
          <View className="flex flex-row gap-4">
            <StatCard
              value="15"
              unit={t("records.streakDays")}
              label={t("records.currentStreak")}
              color="text-yellow-500"
            />
            <StatCard
              value="25"
              unit={t("records.streakDays")}
              label={t("records.bestStreak")}
              color="text-blue-500"
            />
            <StatCard
              value="76"
              unit={t("records.recordsCount")}
              label={t("records.totalRecords")}
              color="text-green-500"
            />
          </View>
        </View> */}

        <View className="my-8">
          {/* <Text className="px-2 text-sm font-semibold text-gray-500 mb-2">
            {t("records.monthlyCalendar")}
          </Text> */}
          <CalendarView />
        </View>

        {/* <View className="my-8">
          <Text className="px-2 text-sm font-semibold text-gray-500 mb-2">
            {t("records.title")}
          </Text>
          <View>
            {records.map((record) => (
              <AchievementCard
                key={record.id}
                icon={record.icon}
                title={record.title}
                achieved={record.achieved}
              />
            ))}
          </View>
        </View> */}
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}
