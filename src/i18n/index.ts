import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from './locales/en';
import { rw } from './locales/rw';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      rw: { translation: rw },
    },
    fallbackLng: 'rw',
    supportedLngs: ['rw', 'en'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'app_lang',
    },
    interpolation: { escapeValue: false },
  });

// Default to Kinyarwanda if nothing chosen
if (!localStorage.getItem('app_lang')) {
  i18n.changeLanguage('rw');
}

export default i18n;
