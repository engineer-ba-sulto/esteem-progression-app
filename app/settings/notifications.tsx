import TabHeader from "@/components/screen-header";
import { useNotificationSettings } from "@/hooks/use-notification-settings";
import { useLocalization } from "@/utils/localization-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const { t } = useLocalization();
  const {
    settings,
    isLoading,
    error,
    updateSettings,
    updateEnabled,
    updateTime,
    updateMessage,
  } = useNotificationSettings();

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("20:00");
  const [notificationMessage, setNotificationMessage] =
    useState("今日のタスクは決まりましたか？");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);

  // 保存された設定を読み込んで状態を更新
  useEffect(() => {
    if (settings) {
      setIsNotificationEnabled(settings.enabled);
      setNotificationTime(settings.time);
      setNotificationMessage(settings.message);
    }
  }, [settings]);

  const handleBack = () => {
    router.back();
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setSelectedTime(selectedDate);
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      const newTime = `${hours}:${minutes}`;
      setNotificationTime(newTime);
      // 即座に保存
      await updateTime(newTime);
    }
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  return (
    <SafeAreaView className="flex flex-col h-full bg-blue-50" edges={["top"]}>
      {/* Header */}
      <TabHeader
        title={t("notifications.title")}
        leftComponent={
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
        }
      />

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        {isLoading ? (
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-gray-500 text-lg">{t("common.loading")}</Text>
          </View>
        ) : (
          <View className="mt-6 gap-y-2">
            {/* 通知を有効にする */}
            <View className="bg-white rounded-lg border border-gray-200 p-4">
              <View className="flex flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-medium text-gray-800 mb-1">
                    {t("notifications.enableNotifications")}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {t("notifications.enableNotificationsDescription")}
                  </Text>
                </View>
                <Switch
                  value={isNotificationEnabled}
                  onValueChange={async (value) => {
                    setIsNotificationEnabled(value);
                    // 即座に保存
                    const result = await updateEnabled(value);

                    if (!result.success) {
                      // エラーが発生した場合は状態を元に戻す
                      setIsNotificationEnabled(!value);
                      Alert.alert(
                        "エラー",
                        result.error || "通知設定の更新に失敗しました"
                      );
                    }
                  }}
                  trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
                  thumbColor={isNotificationEnabled ? "#ffffff" : "#f3f4f6"}
                />
              </View>
            </View>

            {/* 通知時刻 */}
            <View className="bg-white rounded-lg border border-gray-200 p-4">
              <Text className="text-lg font-medium text-gray-800 mb-3">
                {t("notifications.notificationTime")}
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
                {t("notifications.notificationTimeDescription")}
              </Text>
            </View>

            {/* 通知メッセージ */}
            <View className="bg-white rounded-lg border border-gray-200 p-4">
              <Text className="text-lg font-medium text-gray-800 mb-3">
                {t("notifications.notificationMessage")}
              </Text>
              <TextInput
                value={notificationMessage}
                onChangeText={async (text) => {
                  setNotificationMessage(text);
                  // 即座に保存
                  await updateMessage(text);
                }}
                className="border border-gray-300 rounded-lg p-3 text-gray-800"
                multiline
                numberOfLines={3}
                placeholder={t("notifications.notificationMessagePlaceholder")}
                placeholderTextColor="#9ca3af"
              />
              <Text className="text-sm text-gray-500 mt-2">
                {t("notifications.notificationMessageDescription")}
              </Text>
            </View>
          </View>
        )}
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
              {t("notifications.selectTime")}
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
              <Text className="text-white text-center font-semibold">
                {t("notifications.confirm")}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
