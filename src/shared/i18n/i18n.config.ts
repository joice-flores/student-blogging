import i18next from 'i18next';
import { enUS } from '@shared/i18n/locales/en-US';
import { ptBR } from '@shared/i18n/locales/pt-BR';

i18next.init({
  lng: process.env.DEFAULT_LANGUAGE || 'en-US',
  fallbackLng: 'en-US',
  resources: {
    'en-US': { translation: enUS },
    'pt-BR': { translation: ptBR }
  }
});

export default i18next;
