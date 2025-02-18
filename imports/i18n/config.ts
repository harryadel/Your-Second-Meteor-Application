import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEn from './en/translations.json';

export const resources = {
  en: {
    translations: translationEn,
  },
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'translations',
  });

export default i18n;
