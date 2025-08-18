import { Task } from "@/db/schema";
import { getMonthRange, getTodayISODate, subtractDaysFromDate } from "./date";
import {
  calculateBestStreak,
  calculateCurrentStreak,
  calculateTotalCompleted,
} from "./statistics";

// 月間完璧の判定
export const checkPerfectMonth = (tasks: Task[]): boolean => {
  const { start: monthStart, end: monthEnd } = getMonthRange();

  const monthTasks = tasks.filter(
    (t) => t.date >= monthStart && t.date <= monthEnd && t.isCompleted
  );

  // 月の日数を計算
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1
  ).getDate();

  return monthTasks.length === daysInMonth;
};

// 週間マスターの判定（過去7日間）
export const checkWeeklyMaster = (tasks: Task[]): boolean => {
  const today = getTodayISODate();
  const weekAgo = subtractDaysFromDate(today, 6);

  const weekTasks = tasks.filter(
    (t) => t.date >= weekAgo && t.date <= today && t.isCompleted
  );

  // 7日間連続でタスク完了しているかチェック
  const completedDates = weekTasks.map((t) => t.date);
  const expectedDates = [];

  for (let i = 0; i < 7; i++) {
    expectedDates.push(subtractDaysFromDate(today, 6 - i));
  }

  return expectedDates.every((date) => completedDates.includes(date));
};

// 全実績の動的判定
export const checkAchievements = (tasks: Task[]): Record<string, boolean> => {
  const completedTasks = tasks.filter((t) => t.isCompleted);
  const currentStreak = calculateCurrentStreak(tasks);
  const bestStreak = calculateBestStreak(tasks);
  const totalCompleted = calculateTotalCompleted(tasks);

  return {
    "first-step": completedTasks.length > 0,
    "five-day-streak": currentStreak >= 5,
    "ten-day-streak": bestStreak >= 10,
    "perfect-month": checkPerfectMonth(tasks),
    "hundred-tasks": totalCompleted >= 100,
    "weekly-master": checkWeeklyMaster(tasks),
  };
};
