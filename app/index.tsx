import * as schema from "@/db/schema";
import { Task } from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useEffect(() => {
    const load = async () => {
      const tasks = await drizzleDb.query.tasks.findMany();
      setTasks(tasks);
    };
    load();
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <Text>{JSON.stringify(tasks, null, 2)}</Text>
    </View>
  );
}
