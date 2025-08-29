import { db, schema } from "@/db/client";
import { Task } from "@/db/schema";
import {
  getDatabaseVersion,
  subscribeDatabaseVersion,
} from "@/utils/db-events";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useEffect, useState } from "react";

/**
 * 全てのタスクをLive購読する共通フック
 * @returns タスクデータとローディング状態
 */
export const useTasks = () => {
  // 変更通知 version を導入し、変化時に再サブスクさせる
  const [version, setVersion] = useState(getDatabaseVersion());
  useEffect(() => {
    const unsub = subscribeDatabaseVersion(setVersion);
    return unsub;
  }, []);

  const { data: tasks, error } = useLiveQuery(
    db.select().from(schema.taskTable),
    [version]
  );

  return {
    tasks: (tasks || []) as Task[],
    isLoading: tasks === undefined,
    error,
  };
};
