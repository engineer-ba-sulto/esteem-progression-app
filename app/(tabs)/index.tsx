import AdBanner from "@/components/adbanner";
import ArrowButton from "@/components/arrow-button";
import { useDayLabels } from "@/constants/day-labels";
import { mockTasks } from "@/constants/mock-tasks";
import { Day } from "@/types/day";
import { getFormattedDate } from "@/utils/date";
import { useLocalization } from "@/utils/localization-context";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [tasks, setTasks] = useState(mockTasks);
  const [currentDay, setCurrentDay] = useState<Day>("today");
  const { t } = useLocalization();

  // ローカライゼーションされたday-labelsを取得
  const dayLabels = useDayLabels();

  const task = tasks[currentDay];

  const handleComplete = () => {
    if (task) {
      const updatedTasks = {
        ...tasks,
        [currentDay]: { ...task, completed: true },
      };
      setTasks(updatedTasks);
    }
  };

  const handleReset = () => {
    setTasks(mockTasks);
    setCurrentDay("today");
  };

  const handlePrevDay = () => {
    if (currentDay === "tomorrow") setCurrentDay("today");
    else if (currentDay === "today") setCurrentDay("yesterday");
  };

  const handleNextDay = () => {
    if (currentDay === "yesterday") setCurrentDay("today");
    else if (currentDay === "today") setCurrentDay("tomorrow");
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50" edges={["top"]}>
      {/* Header with Date Navigation */}
      <View className="flex-shrink-0 text-center mb-8 px-4 pt-6 bg-white pb-4 rounded-3xl shadow-sm h-24">
        <View className="flex-row items-center justify-between">
          <ArrowButton
            onPress={handlePrevDay}
            disabled={currentDay === "yesterday"}
            iconName="chevron-back"
          />
          <View className="text-center">
            <Text className="text-2xl font-bold text-center">
              {dayLabels[currentDay]}
              {t("tasks.title")}
            </Text>
            <Text className="text-gray-500 text-sm text-center">
              {getFormattedDate(currentDay)}
            </Text>
          </View>
          <ArrowButton
            onPress={handleNextDay}
            disabled={currentDay === "tomorrow"}
            iconName="chevron-forward"
          />
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 flex flex-col items-center justify-center px-6">
        {task && !task.completed ? (
          <View className="w-full text-center flex flex-col items-center">
            <View className="w-full p-6 bg-white rounded-2xl border border-gray-200 shadow-md">
              <Text className="text-2xl font-bold text-center">
                {task.text}
              </Text>
              {task.description && (
                <Text className="text-gray-600 mt-2 text-center">
                  {task.description}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleComplete}
              className="mt-8 w-full max-w-xs py-4 bg-blue-600 rounded-xl shadow-lg"
            >
              <Text className="text-white font-bold text-center">
                {t("tasks.completed")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : task && task.completed ? (
          <View className="text-center">
            <Text className="text-7xl text-center mb-6">🎉</Text>
            <Text className="text-3xl font-bold text-gray-900 text-center">
              {t("home.congratulations")}
            </Text>
            <Text className="text-gray-600 mt-2 text-center">
              {t("home.greatDay")}
            </Text>
            <TouchableOpacity onPress={handleReset}>
              <Text className="mt-6 text-blue-500 text-center">
                {t("home.resetDemo")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <EmptyStateScreenInternal day={currentDay} dayLabels={dayLabels} />
        )}
      </View>
      <AdBanner />
    </SafeAreaView>
  );
}

const EmptyStateScreenInternal: React.FC<{
  day: Day;
  dayLabels: Record<Day, string>;
}> = ({ day, dayLabels }) => {
  const { t } = useLocalization();

  return (
    <View className="flex flex-col items-center justify-center text-center p-8">
      <View className="w-40 h-40 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-full mb-6 border-2 border-gray-200">
        <Ionicons name="document-outline" size={80} color="#60A5FA" />
      </View>
      <Text className="text-2xl font-bold text-gray-800 text-center">
        {t("home.readyMessage")}
      </Text>
      <Text className="text-gray-600 mt-2 max-w-xs text-center">
        {t("home.motivationMessage", { day: dayLabels[day] })}
      </Text>

      <TouchableOpacity className="mt-8 flex-row items-center justify-center h-12 w-auto px-8 bg-blue-600 rounded-xl shadow-lg">
        <Ionicons name="add" size={24} color="white" />
        <Text className="font-semibold text-white ml-2">
          {t("home.setTaskButton", { day: dayLabels[day] })}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
