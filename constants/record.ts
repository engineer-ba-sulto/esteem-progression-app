import { Record } from "@/types/record";
import { useLocalization } from "@/utils/localization-context";

// 国際化されたrecordを取得するフック
export const useRecords = () => {
  const { t } = useLocalization();
  return [
    {
      id: "first-step",
      icon: "🚀",
      title: t("records.firstStep"),
      achieved: true,
    },
    {
      id: "five-day-streak",
      icon: "🔥",
      title: t("records.fiveDayStreak"),
      achieved: true,
    },
    {
      id: "perfect-month",
      icon: "🏆",
      title: t("records.perfectMonth"),
      achieved: false,
    },
    {
      id: "ten-day-streak",
      icon: "⚡",
      title: t("records.tenDayStreak"),
      achieved: false,
    },
    {
      id: "hundred-tasks",
      icon: "💎",
      title: t("records.hundredTasks"),
      achieved: false,
    },
    {
      id: "weekly-master",
      icon: "🌟",
      title: t("records.weeklyMaster"),
      achieved: false,
    },
  ] as Record[];
};
