import { Day } from "@/types/day";

export const getFormattedDate = (day: Day): string => {
  const date = new Date();
  if (day === "yesterday") {
    date.setDate(date.getDate() - 1);
  } else if (day === "tomorrow") {
    date.setDate(date.getDate() + 1);
  }
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
