import { db } from "@/db/client";
import { taskTable } from "@/db/schema";
import { getFormattedDateFromString } from "@/utils/date";
import { useLocalization } from "@/utils/localization-context";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useInterstitialAd } from "./interstitial-ad";

export default function TaskFormDialog({
  visible,
  onClose,
  date,
}: {
  visible: boolean;
  onClose: () => void;
  date: string;
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
    formState: { errors, isSubmitting, isValid },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: { content: "", summary: "" },
    mode: "onChange",
  });

  // ダイアログが閉じられた時にフォームをリセット
  useEffect(() => {
    if (!visible) {
      reset();
      clearErrors();
    }
  }, [visible, reset, clearErrors]);

  const onSubmit = async (values: TaskFormValues) => {
    try {
      console.log("CREATE_TASK", { date, ...values });
      await db.insert(taskTable).values({ date, ...values });
      // フォームをリセット
      reset();
      onClose();

      // タスク登録後にインタースティシャル広告を表示
      setTimeout(() => {
        showAd();
      }, 1000); // ダイアログが閉じるのを待ってから広告を表示
    } catch (error) {
      console.error("CREATE_TASK_FAILED", error);
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
                {t("tasks.addTask")}
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
                className="h-11 px-4 rounded-xl bg-gray-100 items-center justify-center"
              >
                <Text className="text-gray-800 font-semibold">
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting || !isValid}
                className={`w-20 h-11 px-4 rounded-xl items-center justify-center ${
                  isSubmitting || !isValid ? "bg-blue-300" : "bg-blue-600"
                }`}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-bold">
                    {t("common.save")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
