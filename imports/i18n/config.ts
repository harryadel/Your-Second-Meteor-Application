import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import productsEn from './en/products.json';

export const resources = {
  en: {
    products: productsEn,
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
    defaultNS: 'products',
  });

export default i18n;
