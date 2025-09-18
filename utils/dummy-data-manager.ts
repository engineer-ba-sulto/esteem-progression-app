import { mockTasks, mockTasksEnglish } from "@/constants/mock-tasks";
import { db } from "@/db/client";
import { taskTable } from "@/db/schema";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DUMMY_DATA_KEY = "dummy_data_enabled";

export interface DummyDataManager {
  isDummyDataEnabled: () => Promise<boolean>;
  enableDummyData: (locale?: string) => Promise<boolean>;
  disableDummyData: () => Promise<boolean>;
  toggleDummyData: (locale?: string) => Promise<boolean>;
}

class DummyDataManagerImpl implements DummyDataManager {
  async isDummyDataEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(DUMMY_DATA_KEY);
      return value === "true";
    } catch (error) {
      console.error("ダミーデータ状態の取得に失敗:", error);
      return false;
    }
  }

  async enableDummyData(locale: string = "ja"): Promise<boolean> {
    try {
      // 既存のデータを削除
      await db.delete(taskTable);

      // 言語に応じてダミーデータを選択
      const tasks = locale === "en" ? mockTasksEnglish : mockTasks;

      // ダミーデータを挿入
      await db.insert(taskTable).values(tasks);

      // 設定を保存
      await AsyncStorage.setItem(DUMMY_DATA_KEY, "true");

      console.log(`ダミーデータが有効になりました (${locale})`);
      return true;
    } catch (error) {
      console.error("ダミーデータの有効化に失敗:", error);
      return false;
    }
  }

  async disableDummyData(): Promise<boolean> {
    try {
      // 既存のデータを削除
      await db.delete(taskTable);

      // 設定を保存
      await AsyncStorage.setItem(DUMMY_DATA_KEY, "false");

      console.log("ダミーデータが無効になりました");
      return true;
    } catch (error) {
      console.error("ダミーデータの無効化に失敗:", error);
      return false;
    }
  }

  async toggleDummyData(locale: string = "ja"): Promise<boolean> {
    const isEnabled = await this.isDummyDataEnabled();

    if (isEnabled) {
      return await this.disableDummyData();
    } else {
      return await this.enableDummyData(locale);
    }
  }
}

export const dummyDataManager = new DummyDataManagerImpl();
