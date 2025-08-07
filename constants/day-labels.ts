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
