export interface LocalizationContextType {
  locale: string;
  changeLocale: (newLocale: string) => void;
  t: (key: string, params?: any) => string;
  getCurrentLocale: () => string;
  getAvailableLocales: () => string[];
  updateCalendarLocale: (currentLocale: string) => void;
}
