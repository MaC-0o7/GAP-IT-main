import type { Dictionary } from "@/lib/i18n/en";

export type Language = "en" | "ta" | "hi" | "te" | "kn" | "ml";
export type TranslationKey = {
  [Group in keyof Dictionary & string]: {
    [Key in keyof Dictionary[Group] & string]: `${Group}.${Key}`;
  }[keyof Dictionary[Group] & string];
}[keyof Dictionary & string];
export type TranslationValues = Record<string, string | number>;
