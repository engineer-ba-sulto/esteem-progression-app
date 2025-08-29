import TabHeader from "@/components/screen-header";
import {
  createBackup,
  getBackupHistory,
  getLastBackupDate,
  restoreLatestBackup,
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

  // 最終バックアップ日時を永続化から復元し、なければ履歴から推定
  useEffect(() => {
    const loadLastBackup = async () => {
      try {
        const saved = await getLastBackupDate();
        if (saved) {
          setLastBackupDate(formatDate(saved, "yyyy/MM/dd HH:mm"));
          return;
        }
        // フォールバック: バックアップディレクトリから推測
        const result = await getBackupHistory();
        if (result.success && result.backups && result.backups.length > 0) {
          const latestBackup = result.backups[0];
          setLastBackupDate(
            formatDate(latestBackup.modified, "yyyy/MM/dd HH:mm")
          );
        }
      } catch (error) {
        console.error("Failed to load backup history:", error);
      }
    };

    loadLastBackup();
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
            } catch {
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

  // 手動ファイル選択による復元は廃止

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
            <Text className="text-lg font-semibold text-gray-800">
              {t("backup.restoreBackup")}
            </Text>
            <Text className="text-sm text-gray-500">
              {t("backup.restoreBackupDescription")}
            </Text>

            {/* 最新バックアップから自動復元 */}
            <TouchableOpacity
              onPress={async () => {
                setIsRestoring(true);
                try {
                  const result = await restoreLatestBackup();
                  if (result.success) {
                    Alert.alert(
                      t("backup.backupCompleted"),
                      t("backup.backupRestoredMessage")
                    );
                  } else {
                    Alert.alert(
                      "復元エラー",
                      result.error || "バックアップが存在しません",
                      [{ text: "OK" }]
                    );
                  }
                } catch {
                  Alert.alert(
                    "復元エラー",
                    "バックアップの復元中にエラーが発生しました",
                    [{ text: "OK" }]
                  );
                } finally {
                  setIsRestoring(false);
                }
              }}
              disabled={isRestoring}
              className={`rounded-lg py-4 px-6 mt-3 ${
                isRestoring ? "bg-emerald-300" : "bg-emerald-600"
              }`}
            >
              <View className="flex-row items-center justify-center">
                {isRestoring && (
                  <ActivityIndicator color="white" className="mr-2" />
                )}
                <Text className="text-white text-center font-semibold text-lg">
                  {isRestoring ? "復元中..." : "最新バックアップから復元"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* 最終バックアップ情報（日時のみ表示） */}
          <View className="bg-white rounded-lg border border-gray-200 p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium text-gray-600">
                {t("backup.lastBackup")}
              </Text>
            </View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              {lastBackupDate || "バックアップがありません"}
            </Text>
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
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
