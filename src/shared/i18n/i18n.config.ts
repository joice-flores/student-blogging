import i18next from 'i18next';
import { enUS } from '@shared/i18n/locales/en-US';

i18next.init({
  lng: process.env.DEFAULT_LANGUAGE || 'en-US',
  fallbackLng: 'en-US',
  resources: {
    'en-US': { translation: enUS }
  }
});

export default i18next;
