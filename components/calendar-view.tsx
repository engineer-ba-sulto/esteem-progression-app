import { mockTasks } from "@/constants/mock-tasks";
import { useLocalization } from "@/utils/localization-context";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState("");
  const { t, locale, updateCalendarLocale } = useLocalization();

  useEffect(() => {
    // カレンダーのロケール設定を更新
    updateCalendarLocale(locale);
  }, [locale, updateCalendarLocale]);

  // 完了したタスクの日付を取得してマーク用のオブジェクトに変換
  const completedDates = mockTasks
    .filter((task) => task.isCompleted)
    .map((task) => task.date);

  // すべてのタスクの日付を取得
  const allTaskDates = mockTasks.map((task) => task.date);

  const markedDates = allTaskDates.reduce(
    (acc, date) => {
      const isCompleted = completedDates.includes(date);
      acc[date] = {
        marked: true, // ドットを表示
        dotColor: isCompleted ? "#10B981" : "#EF4444", // 完了は緑、未完了は赤（色を逆に）
        selected: false,
      };
      return acc;
    },
    {} as { [key: string]: any }
  );

  // 今日の日付をマーク
  const today = new Date().toISOString().split("T")[0];
  if (markedDates[today]) {
    markedDates[today].selected = true;
    markedDates[today].selectedColor = "#3B82F6";
  } else {
    markedDates[today] = {
      selected: true,
      selectedColor: "#3B82F6",
    };
  }

  const handleDayPress = (day: any) => {
    const selectedDateText = t("calendar.selectedDate");
    const yearText = locale === "en" ? `${day.year}` : `${day.year}年`;
    const monthText = locale === "en" ? `${day.month}` : `${day.month}月`;
    const dayText = locale === "en" ? `${day.day}` : `${day.day}日`;
    console.log(`${selectedDateText}: ${yearText}${monthText}${dayText}`);
    setSelectedDate(day.dateString);
  };

  // 年月表示を取得する関数
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
        key={locale} // ロケール変更時にカレンダーを再レンダリング
        current="2025-08-07" // 2024年8月に設定してマークが表示されるようにする
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
        renderHeader={(date) => {
          return (
            <View className="py-4">
              <Text className="text-center text-lg font-bold text-gray-900">
                {getHeaderText(date)}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
