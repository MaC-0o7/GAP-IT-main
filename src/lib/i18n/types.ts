import type { Dictionary } from "@/lib/i18n/en";

export type Language = "en" | "ta" | "hi" | "te" | "kn" | "ml";
export type LanguageOption = {
  code: Language;
  label: string;
  native: string;
};

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
] as const satisfies readonly LanguageOption[];

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && LANGUAGES.some(({ code }) => code === value);
}

export type TranslationKey = {
  [Group in keyof Dictionary & string]: {
    [Key in keyof Dictionary[Group] & string]: `${Group}.${Key}`;
  }[keyof Dictionary[Group] & string];
}[keyof Dictionary & string];
export type TranslationValues = Record<string, string | number>;
