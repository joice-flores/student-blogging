import i18n from '@shared/i18n/i18n.config';

const DEFAULT_LANGUAGE = 'en-US';
type Lang = 'en-US';

export const translate = (key: string, lng: Lang = DEFAULT_LANGUAGE) => {
  return i18n.t(key, { lng });
};

export const changeLanguage = (lng: string) => {
  return i18n.changeLanguage(lng);
};

export default i18n;
