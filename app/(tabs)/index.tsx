// import AdBanner from "@/components/adbanner";
import ArrowButton from "@/components/arrow-button";
import TabHeader from "@/components/screen-header";
import TaskFormDialog from "@/components/task-form-dialog";
import { useDayLabels } from "@/constants/day-labels";
import { db } from "@/db/client";
import { Task, taskTable } from "@/db/schema";
import {
  addDaysToDate,
  getDayType,
  getFormattedDateFromString,
  getTodayISODate,
  getTomorrowISODate,
  getYesterdayISODate,
  subtractDaysFromDate,
} from "@/utils/date";
import { useLocalization } from "@/utils/localization-context";
import { Ionicons } from "@expo/vector-icons";
import { eq, inArray } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskDialogVisible, setIsTaskDialogVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    return getTodayISODate(); // YYYY-MM-DD形式で日本時間
  });
  const { t } = useLocalization();

  // ローカライゼーションされたday-labelsを取得
  const dayLabels = useDayLabels();

  // 今日/昨日/明日の日付を先に算出（日本時間）
  const todayStr = getTodayISODate(); // YYYY-MM-DD形式で日本時間
  const yesterdayStr = getYesterdayISODate();
  const tomorrowStr = getTomorrowISODate();

  // tasks を live に購読
  const { data: liveTasks } = useLiveQuery(
    db
      .select()
      .from(taskTable)
      .where(inArray(taskTable.date, [yesterdayStr, todayStr, tomorrowStr]))
  );

  useEffect(() => {
    if (liveTasks) setTasks(liveTasks as Task[]);
  }, [liveTasks]);

  // 有効な日付範囲かどうかをチェック
  const isValidDate = useCallback(
    (date: string) => {
      return date === yesterdayStr || date === todayStr || date === tomorrowStr;
    },
    [yesterdayStr, todayStr, tomorrowStr]
  );

  // 現在の日付が有効範囲外の場合は今日にリセット
  useEffect(() => {
    if (!isValidDate(currentDate)) {
      setCurrentDate(todayStr);
    }
  }, [currentDate, todayStr, isValidDate]);

  // 現在の日付に対応するタスクを取得
  const getTaskForDate = (date: string) => {
    // 指定された日付に対応するタスクを直接検索
    const foundTask = tasks.find((task) => task.date === date);
    return foundTask;
  };

  const task = getTaskForDate(currentDate);

  // 現在の日付が今日、明日、昨日のどれかを判断
  const getDayLabel = (date: string) => {
    const dayType = getDayType(date);
    switch (dayType) {
      case "today":
        return dayLabels.today;
      case "tomorrow":
        return dayLabels.tomorrow;
      case "yesterday":
        return dayLabels.yesterday;
      default:
        return getFormattedDateFromString(date);
    }
  };

  const handleComplete = async () => {
    if (!task) return;
    try {
      await db
        .update(taskTable)
        .set({ isCompleted: true, updatedAt: new Date().toISOString() })
        .where(eq(taskTable.id, task.id));
    } catch (error) {
      console.error("UPDATE_TASK_FAILED", error);
    }
  };

  const handleReset = async () => {
    if (!task) return;
    try {
      await db
        .update(taskTable)
        .set({ isCompleted: false, updatedAt: new Date().toISOString() })
        .where(eq(taskTable.id, task.id));
    } catch (error) {
      console.error("UPDATE_TASK_FAILED", error);
    }
  };

  const handlePrevDay = () => {
    const newDate = subtractDaysFromDate(currentDate, 1);

    // 昨日より前には行けない
    if (newDate >= yesterdayStr) {
      setCurrentDate(newDate);
    }
  };

  const handleNextDay = () => {
    const newDate = addDaysToDate(currentDate, 1);

    // 明日より後には行けない
    if (newDate <= tomorrowStr) {
      setCurrentDate(newDate);
    }
  };

  // 前日・翌日ボタンの無効化条件
  const canGoPrev = currentDate > yesterdayStr;
  const canGoNext = currentDate < tomorrowStr;

  // 今日以外の日付の場合は空の状態を表示（未使用のため削除）
  return (
    <SafeAreaView className="flex-1 bg-blue-50" edges={["top"]}>
      {/* Header with Date Navigation */}
      <TabHeader
        title={`${getDayLabel(currentDate)}${t("tasks.title")}`}
        subtitle={getFormattedDateFromString(currentDate)}
        leftComponent={
          <ArrowButton
            onPress={handlePrevDay}
            disabled={!canGoPrev}
            iconName="chevron-back"
          />
        }
        rightComponent={
          <ArrowButton
            onPress={handleNextDay}
            disabled={!canGoNext}
            iconName="chevron-forward"
          />
        }
        className="mb-8"
      />

      {/* Main Content */}
      <View className="flex-1 flex flex-col items-center justify-center px-6">
        {task && !task.isCompleted ? (
          <View className="w-full text-center flex flex-col items-center">
            <View className="w-full p-6 bg-white rounded-2xl border border-gray-200 shadow-md">
              <Text className="text-2xl font-bold text-center">
                {task.content}
              </Text>
              {task.summary && (
                <Text className="text-gray-600 mt-2 text-center">
                  {task.summary}
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
        ) : task && task.isCompleted ? (
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
          <EmptyStateScreenInternal
            date={currentDate}
            dayLabels={dayLabels}
            onOpenDialog={() => setIsTaskDialogVisible(true)}
          />
        )}
      </View>
      <TaskFormDialog
        visible={isTaskDialogVisible}
        onClose={() => setIsTaskDialogVisible(false)}
        date={currentDate}
      />
      {/* <AdBanner /> */}
    </SafeAreaView>
  );
}

const EmptyStateScreenInternal: React.FC<{
  date: string;
  dayLabels: Record<string, string>;
  onOpenDialog: () => void;
}> = ({ date, dayLabels, onOpenDialog }) => {
  const { t } = useLocalization();

  // 現在の日付が今日、明日、昨日のどれかを判断
  const getDayLabel = (date: string) => {
    const dayType = getDayType(date);
    switch (dayType) {
      case "today":
        return dayLabels.today;
      case "tomorrow":
        return dayLabels.tomorrow;
      case "yesterday":
        return dayLabels.yesterday;
      default:
        return getFormattedDateFromString(date);
    }
  };

  return (
    <View className="flex flex-col items-center justify-center text-center p-8">
      <View className="w-40 h-40 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-full mb-6 border-2 border-gray-200">
        <Ionicons name="document-outline" size={80} color="#60A5FA" />
      </View>
      <Text className="text-2xl font-bold text-gray-800 text-center">
        {t("home.readyMessage")}
      </Text>
      <Text className="text-gray-600 mt-2 max-w-xs text-center">
        {t("home.motivationMessage", { day: getDayLabel(date) })}
      </Text>

      {/* タスク設定ボタン（ダイアログを開く） */}
      <TouchableOpacity
        className="mt-8 flex-row items-center justify-center h-12 w-auto px-8 bg-blue-600 rounded-xl shadow-lg"
        onPress={onOpenDialog}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text className="font-semibold text-white ml-2">
          {t("home.setTaskButton", { day: getDayLabel(date) })}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
