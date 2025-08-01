import { tasks } from "@/db/schema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

export default async function addDummyData(db: ExpoSQLiteDatabase) {
  const count = await db.select().from(tasks);
  if (count.length > 0) return;

  await db.insert(tasks).values([
    {
      date: "2024-01-15",
      content: "React Nativeの学習を開始する",
      isCompleted: false,
    },
    {
      date: "2024-01-16",
      content: "Drizzle ORMの設定を完了する",
      isCompleted: true,
    },
    {
      date: "2024-01-17",
      content: "タスク管理アプリのUIを実装する",
      isCompleted: false,
    },
  ]);
}
