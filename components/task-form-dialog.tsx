import { db } from "@/db/client";
import { Task, taskTable } from "@/db/schema";
import { getFormattedDateFromString } from "@/utils/date";
import { useLocalization } from "@/utils/localization-context";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { useInterstitialAd } from "../hooks/use-interstitial-ad";

export default function TaskFormDialog({
  visible,
  onClose,
  date,
  editingTask,
}: {
  visible: boolean;
  onClose: () => void;
  date: string;
  editingTask?: Task | null;
}) {
  const { t } = useLocalization();
  const { showAd } = useInterstitialAd();
  // ロケールに応じてメッセージを切り替えるため、スキーマはコンポーネント内で生成
  const TaskSchema = z.object({
    content: z
      .string()
      .trim()
      .min(1, { message: t("tasks.errors.required") })
      .max(100, { message: t("tasks.errors.maxContent", { count: 100 }) }),
    summary: z
      .string()
      .trim()
      .max(200, { message: t("tasks.errors.maxSummary", { count: 200 }) }),
  });

  type TaskFormValues = z.infer<typeof TaskSchema>;

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: { content: "", summary: "" },
    mode: "onChange",
  });

  // ダイアログが開かれた時に編集データを設定
  useEffect(() => {
    if (visible && editingTask && editingTask.id) {
      // 即座に値を設定
      setValue("content", editingTask.content);
      setValue("summary", editingTask.summary || "");
    } else if (!visible) {
      // ダイアログが閉じられた時にリセット
      reset();
      clearErrors();
    }
  }, [
    visible,
    editingTask?.id,
    editingTask?.content,
    editingTask?.summary,
    setValue,
    reset,
    clearErrors,
  ]);

  const onSubmit = async (values: TaskFormValues) => {
    try {
      if (editingTask && editingTask.id) {
        // 編集モード
        console.log("UPDATE_TASK", { id: editingTask.id, ...values });
        await db
          .update(taskTable)
          .set({
            content: values.content,
            summary: values.summary,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(taskTable.id, editingTask.id));
      } else {
        // 新規作成モード
        console.log("CREATE_TASK", { date, ...values });
        await db.insert(taskTable).values({ date, ...values });
      }

      // フォームをリセット
      reset();
      onClose();

      // タスク登録・編集後にインタースティシャル広告を表示
      setTimeout(() => {
        showAd();
      }, 1000); // ダイアログが閉じるのを待ってから広告を表示
    } catch (error) {
      console.error(
        editingTask && editingTask.id
          ? "UPDATE_TASK_FAILED"
          : "CREATE_TASK_FAILED",
        error
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-bold text-gray-900">
                {editingTask && editingTask.id
                  ? t("tasks.editTask")
                  : t("tasks.addTask")}
              </Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Ionicons name="close" size={22} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Date */}
            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-1">
                {getFormattedDateFromString(date)}
              </Text>
            </View>

            {/* content */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">
                {t("tasks.contentLabel")}
              </Text>
              <Controller
                control={control}
                name="content"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      className={`bg-white border rounded-xl px-4 py-3 text-gray-900 ${
                        errors.content ? "border-red-400" : "border-gray-200"
                      }`}
                      placeholder={t("tasks.contentPlaceholder")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={100}
                      autoFocus
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                    <View className="flex-row justify-end">
                      <Text className="text-xs text-gray-400 mt-1">
                        {value?.length ?? 0}/100
                      </Text>
                    </View>
                  </View>
                )}
              />
              {errors.content && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.content.message}
                </Text>
              )}
            </View>

            {/* summary */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">
                {t("tasks.summaryLabel")}
              </Text>
              <Controller
                control={control}
                name="summary"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      className={`bg-white border rounded-xl px-4 py-3 text-gray-900 h-32 ${
                        errors.summary ? "border-red-400" : "border-gray-200"
                      }`}
                      placeholder={t("tasks.summaryPlaceholder")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={200}
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                    />
                    <View className="flex-row justify-end">
                      <Text className="text-xs text-gray-400 mt-1">
                        {value?.length ?? 0}/200
                      </Text>
                    </View>
                  </View>
                )}
              />
              {errors.summary && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.summary.message}
                </Text>
              )}
            </View>

            {/* Actions */}
            <View className="flex-row justify-end gap-3 mt-2">
              <TouchableOpacity
                onPress={onClose}
                className="h-11 px-4 rounded-xl bg-gray-100 items-center justify-center flex-row"
              >
                <Ionicons name="close-outline" size={18} color="#374151" />
                <Text className="text-gray-800 font-semibold ml-2">
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting || !isValid}
                className={`h-11 px-4 rounded-xl items-center justify-center flex-row ${
                  isSubmitting || !isValid ? "bg-blue-300" : "bg-blue-600"
                }`}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons
                      name={
                        editingTask && editingTask.id
                          ? "checkmark-outline"
                          : "add-outline"
                      }
                      size={18}
                      color="white"
                    />
                    <Text className="text-white font-bold ml-2">
                      {editingTask && editingTask.id
                        ? t("common.update")
                        : t("common.save")}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
