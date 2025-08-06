import { Day } from "@/types/day";
import { useLocalization } from "@/utils/localization-context";

// ローカライゼーションを使用したday-labels
export const useDayLabels = () => {
  const { t } = useLocalization();
  
  return {
    yesterday: t("days.yesterday"),
    today: t("days.today"),
    tomorrow: t("days.tomorrow"),
  } as Record<Day, string>;
};

// 後方互換性のためのデフォルト値
export const dayLabels: Record<Day, string> = {
  yesterday: "昨日",
  today: "今日",
  tomorrow: "明日",
};
