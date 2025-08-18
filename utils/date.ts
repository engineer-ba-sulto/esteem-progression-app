import i18n from "@/locales";
import { Day } from "@/types/day";
import {
  addDays,
  endOfMonth,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
  startOfMonth,
  subDays,
} from "date-fns";
import { enUS, ja } from "date-fns/locale";

// ロケール設定
const getLocale = () => {
  return i18n.locale === "ja" ? ja : enUS;
};

// デバイスのローカル時間でYYYY-MM-DD形式の日付を取得する関数
export const getLocalISODate = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

// 現在の日付をデバイスのローカル時間でYYYY-MM-DD形式で取得
export const getTodayISODate = (): string => {
  return getLocalISODate(new Date());
};

// 昨日の日付をデバイスのローカル時間でYYYY-MM-DD形式で取得
export const getYesterdayISODate = (): string => {
  return getLocalISODate(subDays(new Date(), 1));
};

// 明日の日付をデバイスのローカル時間でYYYY-MM-DD形式で取得
export const getTomorrowISODate = (): string => {
  return getLocalISODate(addDays(new Date(), 1));
};

// 指定された日付が今日、昨日、明日のどれかを判定
export const getDayType = (
  dateString: string
): "today" | "yesterday" | "tomorrow" | "other" => {
  const date = parseISO(dateString);
  if (isToday(date)) return "today";
  if (isYesterday(date)) return "yesterday";
  if (isTomorrow(date)) return "tomorrow";
  return "other";
};

// 日付文字列をロケール対応でフォーマット
export const getFormattedDateFromString = (dateString: string): string => {
  try {
    if (!dateString || dateString.trim() === "") {
      return "";
    }
    const date = parseISO(dateString);
    const locale = getLocale();

    if (locale === ja) {
      return format(date, "yyyy年M月d日", { locale });
    } else {
      return format(date, "MMMM d, yyyy", { locale });
    }
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "";
  }
};

// Day型に基づいてフォーマットされた日付を取得
export const getFormattedDate = (day: Day): string => {
  let date = new Date();

  if (day === "yesterday") {
    date = subDays(date, 1);
  } else if (day === "tomorrow") {
    date = addDays(date, 1);
  }

  const locale = getLocale();

  if (locale === ja) {
    return format(date, "yyyy年M月d日", { locale });
  } else {
    return format(date, "MMMM d, yyyy", { locale });
  }
};

// 月の開始日と終了日を取得
export const getMonthRange = (date: Date = new Date()) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return {
    start: getLocalISODate(start),
    end: getLocalISODate(end),
  };
};

// 日付文字列をDateオブジェクトに変換（安全な方法）
export const parseDateString = (dateString: string): Date => {
  try {
    return parseISO(dateString);
  } catch (error) {
    console.error("Invalid date string:", dateString);
    return new Date();
  }
};

// 日付が有効範囲内かチェック
export const isValidDateRange = (
  dateString: string,
  startDate: string,
  endDate: string
): boolean => {
  const date = parseDateString(dateString);
  const start = parseDateString(startDate);
  const end = parseDateString(endDate);

  return date >= start && date <= end;
};

// カレンダー用の日付情報を取得
export const getCalendarDateInfo = (date: Date) => {
  return {
    year: getYear(date),
    month: getMonth(date) + 1, // date-fnsは0ベースなので+1
    day: getDate(date),
    dayOfWeek: getDay(date),
    dateString: getLocalISODate(date),
  };
};

// 日付の差分を計算（日数）
export const getDaysDifference = (date1: string, date2: string): number => {
  const d1 = parseDateString(date1);
  const d2 = parseDateString(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 日付を指定日数分進める/戻す
export const addDaysToDate = (dateString: string, days: number): string => {
  const date = parseDateString(dateString);
  const newDate = addDays(date, days);
  return getLocalISODate(newDate);
};

// 日付を指定日数分戻す
export const subtractDaysFromDate = (
  dateString: string,
  days: number
): string => {
  return addDaysToDate(dateString, -days);
};

// date-fnsのformat関数をエクスポート（カスタムフォーマット用）
export const formatDate = (date: Date, formatString: string): string => {
  return format(date, formatString, { locale: getLocale() });
};

// 連続日判定関数（統計計算用）
export const isConsecutiveDay = (date1: string, date2: string): boolean => {
  const diff = getDaysDifference(date1, date2);
  return diff === 1;
};

// 後方互換性のため、古い関数名も残す
export const getJapaneseISODate = getLocalISODate;
