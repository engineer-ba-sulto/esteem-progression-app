import { completedDates } from "@/constants/mock-cal";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateLongPress = (day: number) => {
    const selectedDate = new Date(year, month, day);
    console.log(
      `長押しされた日付: ${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`
    );
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayLabels = ["日", "月", "火", "水", "木", "金", "土"];

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <View className="flex flex-row justify-between items-center mb-4">
        <TouchableOpacity
          onPress={handlePrevMonth}
          className="p-2 rounded-full"
        >
          <ChevronLeftIcon />
        </TouchableOpacity>
        <Text className="font-bold text-lg">{`${year}年 ${month + 1}月`}</Text>
        <TouchableOpacity
          onPress={handleNextMonth}
          className="p-2 rounded-full"
        >
          <ChevronRightIcon />
        </TouchableOpacity>
      </View>
      <View className="flex flex-row text-center text-xs text-gray-500 font-semibold mb-2">
        {dayLabels.map((label) => (
          <Text
            key={label}
            className="flex-1 text-center text-xs text-gray-500 font-semibold"
          >
            {label}
          </Text>
        ))}
      </View>
      <View className="flex flex-row flex-wrap">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <View key={`pad-${index}`} className="w-[14.28%] h-10" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayDate = new Date(year, month, day);
          const today = new Date();
          const isToday = isSameDay(dayDate, today);
          const isCompleted = completedDates.some((d) => isSameDay(d, dayDate));

          return (
            <TouchableOpacity
              key={day}
              className="w-[14.28%] h-10 flex items-center justify-center"
              onLongPress={() => handleDateLongPress(day)}
              delayLongPress={500}
            >
              <View
                className={`flex items-center justify-center w-9 h-9 rounded-full relative ${isToday ? "border-2 border-blue-500" : ""}`}
              >
                {isCompleted && (
                  <View className="absolute w-8 h-8 bg-blue-100 rounded-full" />
                )}
                <Text className="relative z-10 text-gray-700">
                  {day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
