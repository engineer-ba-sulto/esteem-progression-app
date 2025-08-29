import TabHeader from "@/components/screen-header";
import {
  createBackup,
  getBackupHistory,
  restoreBackup,
} from "@/utils/backup-restore";
import { formatDate } from "@/utils/date";
import { useLocalization } from "@/utils/localization-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BackupScreen() {
  const { t } = useLocalization();
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupHistory, setBackupHistory] = useState<
    { name: string; size: number; modified: Date }[]
  >([]);
  const [showHistory, setShowHistory] = useState(false);

  // バックアップ履歴を取得して最新のバックアップ日時を設定
  useEffect(() => {
    const loadBackupHistory = async () => {
      try {
        const result = await getBackupHistory();
        if (result.success && result.backups) {
          setBackupHistory(result.backups);
          if (result.backups.length > 0) {
            const latestBackup = result.backups[0];
            setLastBackupDate(
              formatDate(latestBackup.modified, "yyyy/MM/dd HH:mm")
            );
          }
        }
      } catch (error) {
        console.error("Failed to load backup history:", error);
      }
    };

    loadBackupHistory();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleCreateBackup = async () => {
    Alert.alert(
      t("backup.createBackupAlert"),
      t("backup.createBackupMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("backup.createBackupButton"),
          onPress: async () => {
            setIsBackingUp(true);
            try {
              const result = await createBackup();
              if (result.success) {
                setLastBackupDate(formatDate(new Date(), "yyyy/MM/dd HH:mm"));
                Alert.alert(
                  t("backup.backupCompleted"),
                  t("backup.backupCreatedMessage")
                );
              } else {
                Alert.alert(
                  "バックアップエラー",
                  result.error || "バックアップの作成に失敗しました",
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              Alert.alert(
                "バックアップエラー",
                "バックアップの作成中にエラーが発生しました",
                [{ text: "OK" }]
              );
            } finally {
              setIsBackingUp(false);
            }
          },
        },
      ]
    );
  };

  const handleRestoreBackup = async () => {
    Alert.alert(
      t("backup.restoreBackupAlert"),
      t("backup.restoreBackupMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("backup.selectFileButton"),
          onPress: async () => {
            setIsRestoring(true);
            try {
              const result = await restoreBackup();
              if (result.success) {
                Alert.alert(
                  t("backup.backupCompleted"),
                  t("backup.backupRestoredMessage"),
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        // 復元後、アプリを再起動するか、データを再読み込みする
                        // ここでは単純にアラートを表示
                      },
                    },
                  ]
                );
              } else {
                Alert.alert(
                  "復元エラー",
                  result.error || "バックアップの復元に失敗しました",
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              Alert.alert(
                "復元エラー",
                "バックアップの復元中にエラーが発生しました",
                [{ text: "OK" }]
              );
            } finally {
              setIsRestoring(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex flex-col h-full bg-blue-50" edges={["top"]}>
      {/* Header */}
      <TabHeader
        title={t("backup.title")}
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
        <View className="mt-6 gap-y-6">
          {/* データをバックアップ */}
          <View className="bg-white rounded-lg border border-gray-200 p-6">
            <View className="flex flex-row items-center mb-4">
              <View className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Ionicons name="cloud-upload" size={20} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  {t("backup.createBackup")}
                </Text>
                <Text className="text-sm text-gray-500">
                  {t("backup.createBackupDescription")}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleCreateBackup}
              disabled={isBackingUp}
              className={`rounded-lg py-4 px-6 ${
                isBackingUp ? "bg-blue-300" : "bg-blue-500"
              }`}
            >
              <View className="flex-row items-center justify-center">
                {isBackingUp && (
                  <ActivityIndicator color="white" className="mr-2" />
                )}
                <Text className="text-white text-center font-semibold text-lg">
                  {isBackingUp
                    ? "バックアップ中..."
                    : t("backup.createBackupButton")}
                </Text>
              </View>
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
              {t("backup.restoreBackup")}
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              {t("backup.restoreBackupDescription")}
            </Text>
            <TouchableOpacity
              onPress={handleRestoreBackup}
              disabled={isRestoring}
              className={`rounded-lg py-4 px-6 ${
                isRestoring ? "bg-green-300" : "bg-green-500"
              }`}
            >
              <View className="flex-row items-center justify-center">
                {isRestoring && (
                  <ActivityIndicator color="white" className="mr-2" />
                )}
                <Text className="text-white text-center font-semibold text-lg">
                  {isRestoring ? "復元中..." : t("backup.selectFileButton")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* 最終バックアップ情報 */}
          <View className="bg-white rounded-lg border border-gray-200 p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium text-gray-600">
                {t("backup.lastBackup")}
              </Text>
              {backupHistory.length > 0 && (
                <TouchableOpacity
                  onPress={() => setShowHistory(!showHistory)}
                  className="flex-row items-center"
                >
                  <Text className="text-blue-500 text-sm mr-1">
                    {showHistory ? "非表示" : "履歴表示"}
                  </Text>
                  <Ionicons
                    name={showHistory ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#3b82f6"
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              {lastBackupDate || "バックアップがありません"}
            </Text>
            {backupHistory.length > 0 && (
              <Text className="text-sm text-gray-500">
                バックアップファイル数: {backupHistory.length}個
              </Text>
            )}

            {/* バックアップ履歴 */}
            {showHistory && backupHistory.length > 0 && (
              <View className="mt-3 pt-3 border-t border-gray-200">
                <Text className="text-sm font-medium text-gray-600 mb-2">
                  バックアップ履歴
                </Text>
                {backupHistory.slice(0, 5).map((backup, index) => (
                  <View
                    key={index}
                    className="flex-row items-center justify-between py-2"
                  >
                    <View className="flex-1">
                      <Text className="text-sm text-gray-800 font-medium">
                        {backup.name}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {formatDate(backup.modified, "yyyy/MM/dd HH:mm")} •{" "}
                        {(backup.size / 1024 / 1024).toFixed(2)}MB
                      </Text>
                    </View>
                  </View>
                ))}
                {backupHistory.length > 5 && (
                  <Text className="text-xs text-gray-400 text-center mt-2">
                    他 {backupHistory.length - 5} 個のバックアップ
                  </Text>
                )}
              </View>
            )}
          </View>
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
                <Text className="text-sm font-medium text-yellow-800 mb-2">
                  {t("backup.notes")}
                </Text>
                <Text className="text-sm text-yellow-700 mb-2">
                  • バックアップファイルは端末のローカルストレージに保存されます
                </Text>
                <Text className="text-sm text-yellow-700 mb-2">
                  • 復元時は既存のデータが上書きされます
                </Text>
                <Text className="text-sm text-yellow-700 mb-2">
                  • 復元後はアプリの再起動を推奨します
                </Text>
                <Text className="text-sm text-yellow-700">
                  • バックアップファイルは手動で管理してください
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
