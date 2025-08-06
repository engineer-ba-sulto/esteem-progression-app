import { Achievement } from "@/types/achievement";
import { useLocalization } from "@/utils/localization-context";

// 国際化されたachievementsを取得するフック
export const useAchievements = () => {
  const { t } = useLocalization();

  return [
    {
      id: "first-step",
      icon: "🚀",
      title: t("achievements.firstStep"),
      achieved: true,
    },
    {
      id: "five-day-streak",
      icon: "🔥",
      title: t("achievements.fiveDayStreak"),
      achieved: true,
    },
    {
      id: "perfect-month",
      icon: "🏆",
      title: t("achievements.perfectMonth"),
      achieved: false,
    },
    {
      id: "ten-day-streak",
      icon: "⚡",
      title: t("achievements.tenDayStreak"),
      achieved: false,
    },
    {
      id: "hundred-tasks",
      icon: "💎",
      title: t("achievements.hundredTasks"),
      achieved: false,
    },
    {
      id: "weekly-master",
      icon: "🌟",
      title: t("achievements.weeklyMaster"),
      achieved: false,
    },
  ] as Achievement[];
};

// 後方互換性のためのデフォルト値
export const achievements: Achievement[] = [
  {
    id: "first-step",
    icon: "🚀",
    title: "はじめの一歩：最初のタスクを完了",
    achieved: true,
  },
  {
    id: "five-day-streak",
    icon: "🔥",
    title: "5日連続達成",
    achieved: true,
  },
  {
    id: "perfect-month",
    icon: "🏆",
    title: "パーフェクトマンス：1ヶ月継続",
    achieved: false,
  },
  {
    id: "ten-day-streak",
    icon: "⚡",
    title: "10日連続達成",
    achieved: false,
  },
  {
    id: "hundred-tasks",
    icon: "💎",
    title: "100タスク達成",
    achieved: false,
  },
  {
    id: "weekly-master",
    icon: "🌟",
    title: "週間マスター：1週間毎日達成",
    achieved: false,
  },
];
