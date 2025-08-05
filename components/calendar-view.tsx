import { completedDates } from "@/constants/mock-cal";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

// 日本語ロケールの設定
LocaleConfig.locales["ja"] = {
  monthNames: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  monthNamesShort: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  dayNames: [
    "日曜日",
    "月曜日",
    "火曜日",
    "水曜日",
    "木曜日",
    "金曜日",
    "土曜日",
  ],
  dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
  today: "今日",
};

// デフォルトロケールを日本語に設定
LocaleConfig.defaultLocale = "ja";

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState("");

  // 完了した日付をマーク用のオブジェクトに変換
  const markedDates = completedDates.reduce(
    (acc, date) => {
      const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD形式
      acc[dateString] = {
        marked: true,
        dotColor: "#3B82F6", // blue-500
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
    console.log(`選択された日付: ${day.year}年${day.month}月${day.day}日`);
    setSelectedDate(day.dateString);
  };

  return (
    <View className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <Calendar
        current={new Date().toISOString().split("T")[0]}
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
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          return (
            <View className="py-4">
              <Text className="text-center text-lg font-bold text-gray-900">
                {year}年{month}月
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
