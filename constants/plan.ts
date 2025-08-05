import { PlanType } from "@/types/plan";

export const plans = [
  {
    id: "monthly" as PlanType,
    title: "月額プラン",
    price: "¥300",
    period: "/月",
    description: "月額でプレミアム機能を利用",
    popular: false,
  },
  {
    id: "yearly" as PlanType,
    title: "年額プラン",
    price: "¥3,000",
    period: "/年",
    description: "¥600お得！月額¥250相当",
    popular: true,
  },
];
