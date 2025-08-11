import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

export const DATABASE = process.env.EXPO_PUBLIC_DATABASE || "test.db";
const expoDb = openDatabaseSync(DATABASE, {
  enableChangeListener: true,
});
export const db = drizzle(expoDb, { schema });
export { schema };
