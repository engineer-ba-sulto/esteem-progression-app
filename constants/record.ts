import { Record } from "@/types/record";
import { checkAchievements } from "@/utils/achievements";
import { useLocalization } from "@/utils/localization-context";
import { useMemo } from "react";

// 国際化されたrecordを取得するフック（動的判定版）
export const useRecords = (tasks: any[] = []) => {
  const { t } = useLocalization();

  // 実績の動的判定（メモ化でパフォーマンス最適化）
  const achievements = useMemo(() => checkAchievements(tasks), [tasks]);

  // 実績データの生成
  const records = useMemo(
    () =>
      [
        {
          id: "first-step",
          icon: "🚀",
          title: t("records.firstStep"),
          achieved: achievements["first-step"],
        },
        {
          id: "five-day-streak",
          icon: "🔥",
          title: t("records.fiveDayStreak"),
          achieved: achievements["five-day-streak"],
        },
        {
          id: "perfect-month",
          icon: "🏆",
          title: t("records.perfectMonth"),
          achieved: achievements["perfect-month"],
        },
        {
          id: "ten-day-streak",
          icon: "⚡",
          title: t("records.tenDayStreak"),
          achieved: achievements["ten-day-streak"],
        },
        {
          id: "hundred-tasks",
          icon: "💎",
          title: t("records.hundredTasks"),
          achieved: achievements["hundred-tasks"],
        },
        {
          id: "weekly-master",
          icon: "🌟",
          title: t("records.weeklyMaster"),
          achieved: achievements["weekly-master"],
        },
      ] as Record[],
    [achievements, t]
  );

  return records;
};
