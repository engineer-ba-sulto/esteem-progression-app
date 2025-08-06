import { useLocalization } from "@/utils/localization-context";

export const useBenefits = () => {
  const { t } = useLocalization();

  return [
    {
      icon: "🚫",
      title: t("subscription.benefits.noAds.title"),
      description: t("subscription.benefits.noAds.description"),
    },
    {
      icon: "⏰",
      title: t("subscription.benefits.reminders.title"),
      description: t("subscription.benefits.reminders.description"),
    },
    {
      icon: "🔄",
      title: t("subscription.benefits.backup.title"),
      description: t("subscription.benefits.backup.description"),
    },
  ];
};
