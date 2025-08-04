import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReminderScreen() {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("20:00");
  const [notificationMessage, setNotificationMessage] =
    useState("今日のタスクは決まりましたか？");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleSave = () => {
    // ここで設定を保存する処理を実装
    console.log("リマインダー設定を保存しました", {
      isNotificationEnabled,
      notificationTime,
      notificationMessage,
    });
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setSelectedTime(selectedDate);
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      setNotificationTime(`${hours}:${minutes}`);
    }
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  return (
    <SafeAreaView className="flex flex-col h-full bg-blue-50" edges={["top"]}>
      {/* Header */}
      <View className="p-4 flex-shrink-0 bg-white rounded-3xl shadow-sm h-24 flex flex-row items-center">
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 flex items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-bold text-gray-800 text-center mr-10">
          リマインダー設定
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        <View className="mt-6 gap-y-2">
          {/* 通知を有効にする */}
          <View className="bg-white rounded-lg border border-gray-200 p-4">
            <View className="flex flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-medium text-gray-800 mb-1">
                  通知を有効にする
                </Text>
                <Text className="text-sm text-gray-500">
                  毎日のタスク確認をリマインダーで通知します
                </Text>
              </View>
              <Switch
                value={isNotificationEnabled}
                onValueChange={setIsNotificationEnabled}
                trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
                thumbColor={isNotificationEnabled ? "#ffffff" : "#f3f4f6"}
              />
            </View>
          </View>

          {/* 通知時刻 */}
          <View className="bg-white rounded-lg border border-gray-200 p-4">
            <Text className="text-lg font-medium text-gray-800 mb-3">
              通知時刻
            </Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-lg p-3"
              onPress={showTimePickerModal}
            >
              <Text className="text-lg text-gray-800 text-center">
                {notificationTime}
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-500 mt-2">
              毎日この時刻に通知が送信されます
            </Text>
          </View>

          {/* 通知メッセージ */}
          <View className="bg-white rounded-lg border border-gray-200 p-4">
            <Text className="text-lg font-medium text-gray-800 mb-3">
              通知メッセージ
            </Text>
            <TextInput
              value={notificationMessage}
              onChangeText={setNotificationMessage}
              className="border border-gray-300 rounded-lg p-3 text-gray-800"
              multiline
              numberOfLines={3}
              placeholder="通知メッセージを入力してください"
              placeholderTextColor="#9ca3af"
            />
            <Text className="text-sm text-gray-500 mt-2">
              通知に表示されるメッセージをカスタマイズできます
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <View className="mt-8 mb-6">
          <TouchableOpacity
            onPress={handleSave}
            className="bg-blue-500 rounded-lg py-4 px-6"
          >
            <Text className="text-white text-center font-semibold text-lg">
              保存
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* DateTimePicker Modal */}
      {showTimePicker && (
        <TouchableOpacity
          className="absolute inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          activeOpacity={1}
          onPress={() => setShowTimePicker(false)}
        >
          <TouchableOpacity
            className="bg-white rounded-lg p-6 mx-4 w-80"
            activeOpacity={1}
            onPress={() => {}} // モーダル内のタップを無効化
          >
            <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
              通知時刻を選択
            </Text>
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleTimeChange}
              style={{ width: 200, alignSelf: "center" }}
            />
            <TouchableOpacity
              onPress={() => setShowTimePicker(false)}
              className="mt-4 bg-blue-500 rounded-lg py-3 px-6"
            >
              <Text className="text-white text-center font-semibold">確定</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
