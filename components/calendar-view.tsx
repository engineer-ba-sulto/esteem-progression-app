import { db } from "@/db/client";
import { Task, taskTable } from "@/db/schema";
import { useLocalization } from "@/utils/localization-context";
import { and, gte, lte } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function CalendarView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const { t, locale, updateCalendarLocale } = useLocalization();

  // 今日と当月範囲（ローカルタイムで算出してYYYY-MM-DD化）
  const { todayYMD, monthStart, monthEnd } = useMemo(() => {
    const now = new Date();
    const today = toYMD(now);
    const start = toYMD(new Date(now.getFullYear(), now.getMonth(), 1));
    const end = toYMD(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    return { todayYMD: today, monthStart: start, monthEnd: end };
  }, []);

  // 当月のタスクのみをLive購読
  const { data: liveTasks } = useLiveQuery(
    db
      .select()
      .from(taskTable)
      .where(
        and(gte(taskTable.date, monthStart), lte(taskTable.date, monthEnd))
      )
  );

  // 初回/範囲変更時のフェッチ（エラーログ用の保険）
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await db
          .select()
          .from(taskTable)
          .where(
            and(gte(taskTable.date, monthStart), lte(taskTable.date, monthEnd))
          );
        if (mounted) setTasks(list as Task[]);
      } catch (e) {
        console.error("[CalendarView] DB fetch error:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [monthStart, monthEnd]);

  // Liveデータ反映
  useEffect(() => {
    if (liveTasks) setTasks(liveTasks as Task[]);
  }, [liveTasks]);

  // カレンダーのロケール設定を更新
  useEffect(() => {
    updateCalendarLocale(locale);
  }, [locale, updateCalendarLocale]);

  // markedDates 生成
  const completedDates = tasks.filter((t) => t.isCompleted).map((t) => t.date);
  const allTaskDates = tasks.map((t) => t.date);

  const markedDates = allTaskDates.reduce(
    (acc, date) => {
      const isCompleted = completedDates.includes(date);
      acc[date] = {
        marked: true,
        dotColor: isCompleted ? "#10B981" : "#EF4444",
        selected: false,
      };
      return acc;
    },
    {} as Record<string, any>
  );

  // 今日を選択状態で強調表示
  if (markedDates[todayYMD]) {
    markedDates[todayYMD].selected = true;
    markedDates[todayYMD].selectedColor = "#3B82F6";
  } else {
    markedDates[todayYMD] = { selected: true, selectedColor: "#3B82F6" };
  }

  const handleDayPress = (day: any) => {
    const selectedDateText = t("calendar.selectedDate");
    const yearText = locale === "en" ? `${day.year}` : `${day.year}年`;
    const monthText = locale === "en" ? `${day.month}` : `${day.month}月`;
    const dayText = locale === "en" ? `${day.day}` : `${day.day}日`;
    console.log(`${selectedDateText}: ${yearText}${monthText}${dayText}`);
    setSelectedDate(day.dateString);
  };

  const getHeaderText = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    if (locale === "en") {
      const monthNames = t("calendar.monthNames");
      return `${monthNames[month - 1]} ${year}`;
    } else {
      return `${year}年${month}月`;
    }
  };

  return (
    <View className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <Calendar
        key={locale}
        current={todayYMD}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#374151",
          selectedDayBackgroundColor: "#3B82F6",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#3B82F6",
          dayTextColor: "#374151",
          textDisabledColor: "#D1D5DB",
          dotColor: "#3B82F6",
          selectedDotColor: "#ffffff",
          arrowColor: "#3B82F6",
          monthTextColor: "#374151",
          indicatorColor: "#3B82F6",
        }}
        enableSwipeMonths={true}
        firstDay={0}
        hideExtraDays={true}
        renderHeader={(date) => (
          <View className="py-4">
            <Text className="text-center text-lg font-bold text-gray-900">
              {getHeaderText(date)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
