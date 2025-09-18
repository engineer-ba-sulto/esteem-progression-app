import AdBanner from "@/components/adbanner";
import { Fireworks } from "@/components/animations/Fireworks";
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
import {
  getDatabaseVersion,
  subscribeDatabaseVersion,
} from "@/utils/db-events";
import { useLocalization } from "@/utils/localization-context";
import { Ionicons } from "@expo/vector-icons";
import { eq, inArray } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskDialogVisible, setIsTaskDialogVisible] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    return getTodayISODate(); // YYYY-MM-DD形式で日本時間
  });
  const { t } = useLocalization();

  // アニメーション用のSharedValue
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  // DBの差し替え/削除直後に再購読させるためのversion
  const [dbVersion, setDbVersion] = useState(getDatabaseVersion());
  useEffect(() => {
    const unsub = subscribeDatabaseVersion(setDbVersion);
    return unsub;
  }, []);

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
      .where(inArray(taskTable.date, [yesterdayStr, todayStr, tomorrowStr])),
    [dbVersion]
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

      // タスク完了時に花火アニメーションを開始
      setShowFireworks(true);
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

      // リセット時に花火アニメーションを停止
      setShowFireworks(false);
    } catch (error) {
      console.error("UPDATE_TASK_FAILED", error);
    }
  };

  // 花火アニメーション終了時のコールバック
  const handleFireworksEnd = () => {
    setShowFireworks(false);
  };

  // アニメーション関数を共通化（反動なし）
  const animateToNext = useCallback(() => {
    translateX.value = withTiming(-300, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 });
  }, [translateX, opacity]);

  const animateToPrev = useCallback(() => {
    translateX.value = withTiming(300, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 });
  }, [translateX, opacity]);

  const resetAnimation = useCallback(() => {
    translateX.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(1, { duration: 200 });
  }, [translateX, opacity]);

  const handlePrevDay = useCallback(() => {
    const newDate = subtractDaysFromDate(currentDate, 1);

    // 昨日より前には行けない
    if (newDate >= yesterdayStr) {
      animateToPrev();
      setCurrentDate(newDate);
    }
  }, [currentDate, yesterdayStr, animateToPrev]);

  const handleNextDay = useCallback(() => {
    const newDate = addDaysToDate(currentDate, 1);

    // 明日より後には行けない
    if (newDate <= tomorrowStr) {
      animateToNext();
      setCurrentDate(newDate);
    }
  }, [currentDate, tomorrowStr, animateToNext]);

  // 前日・翌日ボタンの無効化条件
  const canGoPrev = currentDate > yesterdayStr;
  const canGoNext = currentDate < tomorrowStr;

  // アニメーションスタイル
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  // 日付変更時にアニメーションをリセット
  useEffect(() => {
    resetAnimation();
  }, [currentDate, resetAnimation]);

  // アニメーション付きスワイプジェスチャーハンドラー
  const panGesture = Gesture.Pan()
    .enabled(!showFireworks) // 花火アニメーション中はスワイプを無効化
    .onStart(() => {
      // ジェスチャー開始時は何もしない
    })
    .onUpdate((event) => {
      // スワイプ中はリアルタイムでアニメーション
      translateX.value = event.translationX;
      opacity.value = Math.max(0.3, 1 - Math.abs(event.translationX) / 200);
    })
    .onEnd((event) => {
      const threshold = 50; // スワイプの最小距離
      const { translationX } = event;

      if (translationX > threshold && canGoPrev) {
        // 右スワイプ（前日へ）- 反動なしのアニメーション
        runOnJS(animateToPrev)();
        runOnJS(handlePrevDay)();
      } else if (translationX < -threshold && canGoNext) {
        // 左スワイプ（翌日へ）- 反動なしのアニメーション
        runOnJS(animateToNext)();
        runOnJS(handleNextDay)();
      } else {
        // スワイプが不十分な場合は元の位置に戻る
        runOnJS(resetAnimation)();
      }
    });

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
            disabled={!canGoPrev || showFireworks}
            iconName="chevron-back"
          />
        }
        rightComponent={
          <ArrowButton
            onPress={handleNextDay}
            disabled={!canGoNext || showFireworks}
            iconName="chevron-forward"
          />
        }
        className="mb-8"
      />

      {/* Main Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle]} className="flex-1 px-6">
          {task && !task.isCompleted ? (
            <View className="text-center flex-1 flex-col items-center justify-center">
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
            <View className="text-center flex-1 flex-col items-center justify-center">
              <Text className="text-7xl text-center mb-6">🎉</Text>
              <Text className="text-3xl font-bold text-gray-900 text-center">
                {t("home.congratulations")}
              </Text>
              <Text className="text-gray-600 mt-2 text-center">
                {t("home.greatDay")}
              </Text>
              <TouchableOpacity onPress={handleReset} disabled={showFireworks}>
                <Text
                  className={`mt-6 text-center ${
                    showFireworks ? "text-gray-400" : "text-blue-500"
                  }`}
                >
                  {showFireworks ? "花火中..." : t("home.resetDemo")}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              <EmptyStateScreenInternal
                date={currentDate}
                dayLabels={dayLabels}
                onOpenDialog={() => setIsTaskDialogVisible(true)}
              />
            </View>
          )}
        </Animated.View>
      </GestureDetector>
      <TaskFormDialog
        visible={isTaskDialogVisible}
        onClose={() => setIsTaskDialogVisible(false)}
        date={currentDate}
      />
      <AdBanner />

      {/* 花火アニメーション */}
      {showFireworks && <Fireworks onAnimationEnd={handleFireworksEnd} />}

      {/* 花火アニメーション中の操作無効化オーバーレイ */}
      {showFireworks && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "transparent",
            zIndex: 40, // 花火より下、他の要素より上
          }}
          pointerEvents="box-none" // タッチイベントを通過させるが、子要素は無効化
        />
      )}
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
