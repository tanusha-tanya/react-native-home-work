import { getLocales } from "expo-localization";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { SUPPORTED_LANGUAGES, translations, type AppLanguage } from "../locales/translations";

type LanguagePreference = AppLanguage | "system";

type I18nContextValue = {
  language: AppLanguage;
  languagePreference: LanguagePreference;
  setLanguagePreference: (language: LanguagePreference) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function resolveSystemLanguage(): AppLanguage {
  const deviceLanguageCode = getLocales()[0]?.languageCode?.toLowerCase();
  if (deviceLanguageCode && SUPPORTED_LANGUAGES.includes(deviceLanguageCode as AppLanguage)) {
    return deviceLanguageCode as AppLanguage;
  }
  return "ru";
}

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;

  return Object.entries(vars).reduce((acc, [key, value]) => {
    return acc.replaceAll(`{{${key}}}`, String(value));
  }, template);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [languagePreference, setLanguagePreference] = useState<LanguagePreference>("system");

  const language = languagePreference === "system" ? resolveSystemLanguage() : languagePreference;

  const t = useMemo<I18nContextValue["t"]>(() => {
    return (key, vars) => {
      const localizedValue = translations[language][key] ?? translations.ru[key] ?? key;
      return interpolate(localizedValue, vars);
    };
  }, [language]);

  const value = useMemo(
    () => ({ language, languagePreference, setLanguagePreference, t }),
    [language, languagePreference, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
