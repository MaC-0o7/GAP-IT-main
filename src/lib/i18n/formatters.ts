import type { Language } from "@/lib/i18n/types";

const locales: Record<Language, string> = {
  en: "en-IN-u-nu-latn",
  ta: "ta-IN-u-nu-latn",
  hi: "hi-IN-u-nu-latn",
  te: "te-IN-u-nu-latn",
  kn: "kn-IN-u-nu-latn",
  ml: "ml-IN-u-nu-latn",
};

export function formatNumber(
  value: number,
  language: Language,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(locales[language], {
    ...options,
    numberingSystem: "latn",
  }).format(value);
}

export function formatDate(
  value: Date | number,
  language: Language,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  },
) {
  return new Intl.DateTimeFormat(locales[language], {
    ...options,
    numberingSystem: "latn",
  }).format(value);
}
