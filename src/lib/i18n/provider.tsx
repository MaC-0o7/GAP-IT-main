"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import en from "@/lib/i18n/en";
import hi from "@/lib/i18n/hi";
import ta from "@/lib/i18n/ta";
import te from "@/lib/i18n/te";
import kn from "@/lib/i18n/kn";
import ml from "@/lib/i18n/ml";
import type {
  Language,
  TranslationKey,
  TranslationValues,
} from "@/lib/i18n/types";

const dictionaries = { en, ta, hi, te, kn, ml };
const storageKey = "lang";
const legacyStorageKey = "gap-it-language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

function isLanguage(value: string | null): value is Language {
  return value === "en" || value === "ta" || value === "hi" || value === "te" || value === "kn" || value === "ml";
}

function getBrowserLanguage(): Language {
  const browserLanguage = window.navigator.language.toLowerCase();
  if (browserLanguage.startsWith("ta")) return "ta";
  if (browserLanguage.startsWith("hi")) return "hi";
  if (browserLanguage.startsWith("te")) return "te";
  if (browserLanguage.startsWith("kn")) return "kn";
  if (browserLanguage.startsWith("ml")) return "ml";
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const savedLanguage = window.localStorage.getItem(storageKey)
        ?? window.localStorage.getItem(legacyStorageKey);
      setLanguageState(isLanguage(savedLanguage) ? savedLanguage : getBrowserLanguage());
    } catch (error) {
      console.warn("Unable to read the saved language from browser storage.", error);
      setLanguageState(getBrowserLanguage());
    }
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    try {
      window.localStorage.setItem(storageKey, nextLanguage);
    } catch (error) {
      console.warn("Unable to save the selected language to browser storage.", error);
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, values: TranslationValues = {}) => {
      const translation = key
        .split(".")
        .reduce<unknown>(
          (current, part) =>
            current !== null && typeof current === "object"
              ? (current as Record<string, unknown>)[part]
              : undefined,
          dictionaries[language],
        );

      if (typeof translation !== "string") {
        throw new Error(`Missing ${language} translation for "${key}".`);
      }

      return translation.replace(/\{(\w+)\}/g, (placeholder, name: string) => {
        if (!(name in values)) {
          throw new Error(`Missing value "${name}" for translation "${key}".`);
        }
        return String(values[name]);
      });
    },
    [language],
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t("app.title");
  }, [language, t]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useT must be used within a LanguageProvider");
  }
  return context;
}
