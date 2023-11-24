import { createI18n } from 'vue-i18n';

import enData from '@/locales/en.json';
import idData from '@/locales/id.json';

const getLanguage = sessionStorage.getItem('Main')
    ? JSON.parse(sessionStorage.getItem('Main'))
    : null;
const instance = createI18n({
    legacy: false,
    locale: getLanguage ? getLanguage.language : 'id',
    fallbackLocale: getLanguage ? getLanguage.language : 'id',
    messages: {
        en: enData,
        id: idData
    }
});

export default instance;

export const i18n = instance.global;
