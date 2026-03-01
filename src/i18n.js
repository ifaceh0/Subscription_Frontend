import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";

const resources = {
  en: { translation: en },
  es: { translation: es },
};

i18n
  .use(LanguageDetector)           // detects browser language
  .use(initReactI18next)           // passes i18n to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "es"],
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;