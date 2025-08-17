import { db } from "@/db/client";
import { Task, taskTable } from "@/db/schema";
import { getFormattedDateFromString } from "@/utils/date";
import { useLocalization } from "@/utils/localization-context";
import { Ionicons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TaskViewDialog({
  visible,
  onClose,
  date,
  onEdit,
}: {
  visible: boolean;
  onClose: () => void;
  date: string;
  onEdit: (task: Task) => void;
}) {
  const { t } = useLocalization();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 日付が変更された時にタスクを取得
  useEffect(() => {
    if (visible && date && date.trim() !== "") {
      fetchTask();
    }
  }, [visible, date]);

  const fetchTask = async () => {
    if (!date || date.trim() === "") {
      setTask(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await db
        .select()
        .from(taskTable)
        .where(eq(taskTable.date, date))
        .limit(1);

      if (result.length > 0) {
        setTask(result[0] as Task);
      } else {
        setTask(null);
      }
    } catch (error) {
      console.error("FETCH_TASK_FAILED", error);
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!task) return;

    Alert.alert(
      t("tasks.deleteConfirmTitle"),
      t("tasks.deleteConfirmMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: deleteTask,
        },
      ]
    );
  };

  const deleteTask = async () => {
    if (!task) return;

    setDeleting(true);
    try {
      await db.delete(taskTable).where(eq(taskTable.id, task.id));
      setTask(null);
      onClose();
    } catch (error) {
      console.error("DELETE_TASK_FAILED", error);
      Alert.alert(t("common.error"), t("tasks.deleteError"));
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    if (task) {
      onEdit(task);
      // onClose()を削除して、親コンポーネントで制御する
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 items-center justify-center bg-black/10 px-6"
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          className="w-full max-w-xl rounded-2xl bg-white p-4"
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              {t("tasks.taskDetails")}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Date */}
          <View className="mb-4">
            <Text className="text-gray-600 text-sm">
              {date && date.trim() !== ""
                ? getFormattedDateFromString(date)
                : t("common.loading")}
            </Text>
          </View>

          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-600 mt-2">{t("common.loading")}</Text>
            </View>
          ) : task ? (
            <>
              {/* Task Content */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  {t("tasks.contentLabel")}
                </Text>
                <View className="bg-gray-50 rounded-xl p-4">
                  <Text className="text-gray-900">{task.content}</Text>
                </View>
              </View>

              {/* Task Summary */}
              {task.summary && (
                <View className="mb-6">
                  <Text className="text-gray-700 font-semibold mb-2">
                    {t("tasks.summaryLabel")}
                  </Text>
                  <View className="bg-gray-50 rounded-xl p-4">
                    <Text className="text-gray-900">{task.summary}</Text>
                  </View>
                </View>
              )}

              {/* Task Status */}
              <View className="mb-6">
                <View className="flex-row items-center">
                  <View
                    className={`w-3 h-3 rounded-full mr-2 ${
                      task.isCompleted ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <Text className="text-gray-700">
                    {task.isCompleted
                      ? t("tasks.status.completed")
                      : t("tasks.status.pending")}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row justify-end gap-3">
                <TouchableOpacity
                  onPress={handleEdit}
                  activeOpacity={0.7}
                  className="h-11 px-4 rounded-xl bg-blue-600 items-center justify-center flex-row"
                >
                  <Ionicons name="create-outline" size={18} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    {t("common.edit")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDelete}
                  disabled={deleting}
                  className="h-11 px-4 rounded-xl bg-red-100 items-center justify-center flex-row"
                >
                  {deleting ? (
                    <ActivityIndicator size="small" color="#DC2626" />
                  ) : (
                    <>
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#DC2626"
                      />
                      <Text className="text-red-600 font-semibold ml-2">
                        {t("common.delete")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View className="py-8 items-center">
              <Ionicons name="document-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2 text-center">
                {t("tasks.noTaskForDate")}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
