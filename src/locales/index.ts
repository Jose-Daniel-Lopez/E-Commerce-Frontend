import es from './es.json'
import en from './en.json'

export const messages = {
  es,
  en
}

export const defaultLocale = 'es'
export const fallbackLocale = 'en'
export const availableLocales = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' }
]
