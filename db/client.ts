import { DATABASE } from "@/db/config";
import * as schema from "@/db/schema";
import i18n from "@/locales";
import { bumpDatabaseVersion } from "@/utils/db-events";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

let expoDb = openDatabaseSync(DATABASE, {
  enableChangeListener: true,
});
export let db = drizzle(expoDb, { schema });
export { schema };

// DB接続の再初期化（復元後などに使用）
export const resetDbConnection = () => {
  expoDb = openDatabaseSync(DATABASE, { enableChangeListener: true });
  db = drizzle(expoDb, { schema });
  bumpDatabaseVersion();
};

// DB接続を同期的にクローズ（可能なら）
export const closeDbConnectionSync = () => {
  try {
    // 型定義にないが環境によっては存在することがある
    const anyDb: any = expoDb as any;
    if (anyDb && typeof anyDb.closeSync === "function") {
      anyDb.closeSync();
    }
  } catch {
    // no-op
  }
};

// データ削除機能
export const deleteAllData = async () => {
  try {
    // すべてのタスクを削除
    await db.delete(schema.taskTable);
    bumpDatabaseVersion();
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
