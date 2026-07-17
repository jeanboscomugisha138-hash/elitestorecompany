import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { rw } from './locales/rw';

// Petane Shipping: Kinyarwanda-only
i18n.use(initReactI18next).init({
  resources: { rw: { translation: rw } },
  lng: 'rw',
  fallbackLng: 'rw',
  supportedLngs: ['rw'],
  interpolation: { escapeValue: false },
});

try { localStorage.setItem('app_lang', 'rw'); } catch {}

export default i18n;
