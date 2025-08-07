import i18n from "@/locales";
import { Day } from "@/types/day";

export const getFormattedDate = (day: Day): string => {
  const date = new Date();
  if (day === "yesterday") {
    date.setDate(date.getDate() - 1);
  } else if (day === "tomorrow") {
    date.setDate(date.getDate() + 1);
  }

  // 現在のロケール設定を取得
  const currentLocale = i18n.locale;

  // ロケールに応じて適切なオプションを設定
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // 日本語の場合は日本語ロケールを使用
  const locale = currentLocale === "ja" ? "ja-JP" : "en-US";

  return date.toLocaleDateString(locale, options);
};

export const getFormattedDateFromString = (dateString: string): string => {
  const date = new Date(dateString);

  // 現在のロケール設定を取得
  const currentLocale = i18n.locale;

  // ロケールに応じて適切なオプションを設定
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // 日本語の場合は日本語ロケールを使用
  const locale = currentLocale === "ja" ? "ja-JP" : "en-US";

  return date.toLocaleDateString(locale, options);
};
