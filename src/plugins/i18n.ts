import { createI18n } from 'vue-i18n'
import { messages, defaultLocale, fallbackLocale } from '@/locales'

type SupportedLocale = keyof typeof messages

// Función para detectar el idioma del navegador
function getBrowserLocale(): string {
  const navigatorLocale = navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage
  
  if (navigatorLocale) {
    const trimmedLocale = navigatorLocale.trim().split(/-|_/)[0]
    return Object.keys(messages).includes(trimmedLocale) ? trimmedLocale : defaultLocale
  }
  
  return defaultLocale
}

// Función para obtener el idioma guardado en localStorage
function getStoredLocale(): string | null {
  return localStorage.getItem('locale')
}

// Función para guardar el idioma en localStorage
export function setStoredLocale(locale: string): void {
  localStorage.setItem('locale', locale)
}

// Determinar el idioma inicial
function getInitialLocale(): string {
  const storedLocale = getStoredLocale()
  if (storedLocale && Object.keys(messages).includes(storedLocale)) {
    return storedLocale
  }
  return getBrowserLocale()
}

export const i18n = createI18n({
  legacy: false, // Usa Composition API
  locale: getInitialLocale(),
  fallbackLocale,
  messages,
  globalInjection: true // Permite usar $t en templates
})

// Función para cambiar idioma
export function setLocale(locale: string): void {
  if (Object.keys(messages).includes(locale)) {
    i18n.global.locale.value = locale as SupportedLocale
    setStoredLocale(locale)
    document.documentElement.lang = locale
  }
}

// Establecer el idioma inicial en el documento
document.documentElement.lang = getInitialLocale()
