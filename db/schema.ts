import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  content: text("content").notNull(), // タスクの内容
  summary: text("summary"), // タスクの概要
  isCompleted: integer("isCompleted", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updatedAt")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type Task = typeof tasks.$inferSelect;
export type CreateTask = typeof tasks.$inferInsert;
