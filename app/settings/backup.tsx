import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BackupScreen() {
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(
    "2024/01/15 10:30"
  );

  const handleBack = () => {
    router.back();
  };

  const handleCreateBackup = () => {
    Alert.alert("バックアップ作成", "データのバックアップを作成しますか？", [
      {
        text: "キャンセル",
        style: "cancel",
      },
      {
        text: "作成",
        onPress: () => {
          // ここでバックアップ処理を実装
          console.log("バックアップを作成しました");
          setLastBackupDate(new Date().toLocaleString("ja-JP"));
          Alert.alert("完了", "バックアップが正常に作成されました");
        },
      },
    ]);
  };

  const handleRestoreBackup = () => {
    Alert.alert(
      "バックアップ復元",
      "バックアップファイルを選択して復元しますか？\n\n注意: 現在のデータは上書きされます",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "復元",
          onPress: () => {
            // ここでファイル選択と復元処理を実装
            console.log("バックアップを復元しました");
            Alert.alert("完了", "バックアップが正常に復元されました");
          },
        },
      ]
    );
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
          バックアップ
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        <View className="mt-6 gap-y-6">
          {/* データをバックアップ */}
          <View className="bg-white rounded-lg border border-gray-200 p-6">
            <View className="flex flex-row items-center mb-4">
              <View className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Ionicons name="cloud-upload" size={20} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  データをバックアップ
                </Text>
                <Text className="text-sm text-gray-500">
                  設定とタスク履歴を安全に保存できます
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleCreateBackup}
              className="bg-blue-500 rounded-lg py-4 px-6"
            >
              <Text className="text-white text-center font-semibold text-lg">
                バックアップ作成
              </Text>
            </TouchableOpacity>
          </View>

          {/* 区切り線 */}
          <View className="flex flex-row items-center">
            <View className="flex-1 h-px bg-gray-300" />
            <View className="mx-4">
              <Ionicons name="ellipsis-horizontal" size={20} color="#9ca3af" />
            </View>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* バックアップから復元 */}
          <View className="bg-white rounded-lg border border-gray-200 p-6">
            <View className="flex flex-row items-center mb-4">
              <View className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Ionicons name="cloud-download" size={20} color="#10b981" />
              </View>
            </View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              バックアップから復元
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              以前のデータを復元できます
            </Text>
            <TouchableOpacity
              onPress={handleRestoreBackup}
              className="bg-green-500 rounded-lg py-4 px-6"
            >
              <Text className="text-white text-center font-semibold text-lg">
                ファイルを選択
              </Text>
            </TouchableOpacity>
          </View>

          {/* 最終バックアップ情報 */}
          {lastBackupDate && (
            <View className="bg-white rounded-lg border border-gray-200 p-4">
              <Text className="text-sm font-medium text-gray-600 mb-1">
                最終バックアップ:
              </Text>
              <Text className="text-lg font-semibold text-gray-800">
                {lastBackupDate}
              </Text>
            </View>
          )}
        </View>

        {/* 注意事項 */}
        <View className="mt-6 mb-6">
          <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <View className="flex flex-row items-start">
              <Ionicons
                name="information-circle"
                size={20}
                color="#f59e0b"
                style={{ marginTop: 2, marginRight: 8 }}
              />
              <View className="flex-1">
                <Text className="text-sm font-medium text-yellow-800 mb-1">
                  注意事項
                </Text>
                <Text className="text-sm text-yellow-700">
                  • バックアップには設定とタスク履歴が含まれます
                </Text>
                <Text className="text-sm text-yellow-700">
                  • 復元時は現在のデータが上書きされます
                </Text>
                <Text className="text-sm text-yellow-700">
                  • 定期的なバックアップを推奨します
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
