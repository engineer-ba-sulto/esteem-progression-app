import { PlanType } from "@/types/plan";
import { useLocalization } from "@/utils/localization-context";

export const usePlans = () => {
  const { t } = useLocalization();

  return [
    {
      id: "monthly" as PlanType,
      title: t("subscription.plans.monthly.title"),
      price: t("subscription.plans.monthly.price"),
      period: t("subscription.plans.monthly.period"),
      description: t("subscription.plans.monthly.description"),
      popular: false,
    },
    {
      id: "yearly" as PlanType,
      title: t("subscription.plans.yearly.title"),
      price: t("subscription.plans.yearly.price"),
      period: t("subscription.plans.yearly.period"),
      description: t("subscription.plans.yearly.description"),
      popular: true,
    },
  ];
};
