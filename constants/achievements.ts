import { Achievement } from "@/types/achievement";

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
