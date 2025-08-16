import * as schema from "@/db/schema";
import i18n from "@/locales";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

export const DATABASE = process.env.EXPO_PUBLIC_DATABASE || "test.db";
const expoDb = openDatabaseSync(DATABASE, {
  enableChangeListener: true,
});
export const db = drizzle(expoDb, { schema });
export { schema };

// データ削除機能
export const deleteAllData = async () => {
  try {
    // すべてのタスクを削除
    await db.delete(schema.taskTable);
    return { success: true };
  } catch (error) {
    console.error("データ削除エラー:", error);
    return { success: false, message: i18n.t("settings.dataDeletionError") };
  }
};

// 特定の日付のデータを削除
export const deleteDataByDate = async (date: string) => {
  try {
    await db.delete(schema.taskTable).where(eq(schema.taskTable.date, date));
    return { success: true, message: i18n.t("settings.dataDeletionSuccess") };
  } catch (error) {
    console.error("データ削除エラー:", error);
    return { success: false, message: i18n.t("settings.dataDeletionError") };
  }
};

// データベースの統計情報を取得
export const getDatabaseStats = async () => {
  try {
    const allTasks = await db.select().from(schema.taskTable);
    const completedTasks = allTasks.filter((task) => task.isCompleted);
    const pendingTasks = allTasks.filter((task) => !task.isCompleted);

    return {
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      success: true,
    };
  } catch (error) {
    console.error("統計情報取得エラー:", error);
    return { success: false, message: i18n.t("settings.statsError") };
  }
};
