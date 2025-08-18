import { db, schema } from "@/db/client";
import { Task } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

/**
 * 全てのタスクをLive購読する共通フック
 * @returns タスクデータとローディング状態
 */
export const useTasks = () => {
  const { data: tasks, error } = useLiveQuery(
    db.select().from(schema.taskTable)
  );

  return {
    tasks: (tasks || []) as Task[],
    isLoading: tasks === undefined,
    error,
  };
};
