// src/i18n.js
import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import fr from './locales/fr.json'
import es from './locales/sp.json'

const messages = {
  en,
  fr,
  es,
}

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

export default i18n
