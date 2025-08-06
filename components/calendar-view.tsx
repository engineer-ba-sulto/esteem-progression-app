import { completedDates } from "@/constants/mock-cal";
import { useLocalization } from "@/utils/localization-context";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState("");
  const { t, locale } = useLocalization();

  useEffect(() => {
    // カレンダーのロケール設定を更新
    updateCalendarLocale(locale);
  }, [locale]);

  const updateCalendarLocale = (currentLocale: string) => {
    // 翻訳を直接取得
    const monthNames =
      currentLocale === "en"
        ? [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ]
        : [
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
          ];

    const monthNamesShort =
      currentLocale === "en"
        ? [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ]
        : [
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
          ];

    const dayNames =
      currentLocale === "en"
        ? [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ]
        : [
            "日曜日",
            "月曜日",
            "火曜日",
            "水曜日",
            "木曜日",
            "金曜日",
            "土曜日",
          ];

    const dayNamesShort =
      currentLocale === "en"
        ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        : ["日", "月", "火", "水", "木", "金", "土"];

    const translations = {
      monthNames,
      monthNamesShort,
      dayNames,
      dayNamesShort,
      today: currentLocale === "en" ? "Today" : "今日",
    };

    LocaleConfig.locales[currentLocale] = translations;
    LocaleConfig.defaultLocale = currentLocale;
  };

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
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return `${monthNames[month - 1]} ${year}`;
    } else {
      return `${year}年${month}月`;
    }
  };

  return (
    <View className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <Calendar
        key={locale} // ロケール変更時にカレンダーを再レンダリング
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
