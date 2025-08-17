import { Task } from "@/db/schema";
import {
  getTodayISODate,
  isConsecutiveDay,
  subtractDaysFromDate,
} from "./date";

// 現在の連続日数を計算
export const calculateCurrentStreak = (tasks: Task[]): number => {
  const today = getTodayISODate();
  let streak = 0;
  let currentDate = today;

  while (true) {
    const task = tasks.find((t) => t.date === currentDate && t.isCompleted);
    if (task) {
      streak++;
      currentDate = subtractDaysFromDate(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
};

// 最高連続日数を計算
export const calculateBestStreak = (tasks: Task[]): number => {
  const completedTasks = tasks.filter((t) => t.isCompleted);
  let bestStreak = 0;
  let currentStreak = 0;

  // 日付順にソート
  const sortedTasks = completedTasks.sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  for (let i = 0; i < sortedTasks.length; i++) {
    if (
      i === 0 ||
      isConsecutiveDay(sortedTasks[i - 1].date, sortedTasks[i].date)
    ) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    bestStreak = Math.max(bestStreak, currentStreak);
  }

  return bestStreak;
};

// 合計達成数を計算
export const calculateTotalCompleted = (tasks: Task[]): number => {
  return tasks.filter((t) => t.isCompleted).length;
};
