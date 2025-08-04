import addDummyData from "@/db/addDummyData";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import migrations from "../drizzle/migrations";
import "../global.css";

export const DATABASE_NAME = "test.db";

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success) {
      addDummyData(db);
    }
  }, [success, db]);

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider databaseName={DATABASE_NAME} useSuspense>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}
