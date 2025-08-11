import { db } from "@/db/client";
import { Task, taskTable } from "@/db/schema";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function DummyJsonData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const load = async () => {
      const tasks = await db.select().from(taskTable);
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
