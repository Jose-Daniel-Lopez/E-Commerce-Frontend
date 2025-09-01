/**
 * Vue I18n Internationalization Plugin Configuration
 *
 * This module sets up Vue I18n for multi-language support in the application.
 * It handles locale detection, persistence, and provides utilities for language switching.
 *
 * Features:
 * - Automatic browser language detection
 * - Locale persistence in localStorage
 * - Fallback locale support
 * - Document language attribute synchronization
 *
 * @module i18n
 */

import { createI18n } from 'vue-i18n'
import { messages, defaultLocale, fallbackLocale } from '@/locales'

/**
 * Type definition for supported locales based on available message keys
 */
type SupportedLocale = keyof typeof messages

/**
 * Detects the user's preferred language from browser settings
 *
 * @returns {string} The detected locale code or default locale if none found
 *
 * @description
 * - Checks navigator.language and navigator.userLanguage
 * - Extracts the primary language code (before '-' or '_')
 * - Validates against available messages
 * - Falls back to defaultLocale if no match found
 *
 * @example
 * ```typescript
 * // Browser set to 'en-US' -> returns 'en'
 * // Browser set to 'es-ES' -> returns 'es'
 * // Browser set to 'fr-FR' but not supported -> returns defaultLocale
 * ```
 */
function getBrowserLocale(): string {
  const navigatorLocale =
    navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage

  if (navigatorLocale) {
    const trimmedLocale = navigatorLocale.trim().split(/-|_/)[0]
    return Object.keys(messages).includes(trimmedLocale) ? trimmedLocale : defaultLocale
  }

  return defaultLocale
}

/**
 * Retrieves the stored locale preference from localStorage
 *
 * @returns {string | null} The stored locale code or null if not found
 *
 * @description
 * Safely retrieves the user's previously selected language preference
 * from browser's localStorage. Returns null if no preference is stored.
 */
function getStoredLocale(): string | null {
  return localStorage.getItem('locale')
}

/**
 * Persists the locale preference to localStorage
 *
 * @param {string} locale - The locale code to store (e.g., 'en', 'es')
 *
 * @description
 * Saves the user's language preference to localStorage for persistence
 * across browser sessions. This ensures the user's language choice is
 * remembered when they return to the application.
 *
 * @example
 * ```typescript
 * setStoredLocale('es') // Saves Spanish as preferred language
 * setStoredLocale('en') // Saves English as preferred language
 * ```
 */
export function setStoredLocale(locale: string): void {
  localStorage.setItem('locale', locale)
}

/**
 * Determines the initial locale for the application
 *
 * @returns {string} The locale code to use for initialization
 *
 * @description
 * Priority order for locale selection:
 * 1. Stored locale preference (if valid)
 * 2. Browser detected locale
 * 3. Default locale (fallback)
 *
 * This ensures a smooth user experience by respecting user preferences
 * while providing sensible defaults.
 */
function getInitialLocale(): string {
  const storedLocale = getStoredLocale()
  if (storedLocale && Object.keys(messages).includes(storedLocale)) {
    return storedLocale
  }
  return getBrowserLocale()
}

/**
 * Vue I18n instance configuration
 *
 * @description
 * Creates and configures the main i18n instance with:
 * - Composition API mode (legacy: false)
 * - Automatic locale detection and initialization
 * - Fallback locale for missing translations
 * - Global injection for template usage ($t)
 *
 * @example
 * ```typescript
 * // In main.ts
 * import { i18n } from '@/plugins/i18n'
 * app.use(i18n)
 * ```
 */
export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getInitialLocale(),
  fallbackLocale,
  messages,
  globalInjection: true, // Allow $t usage in templates
})

/**
 * Changes the application locale dynamically
 *
 * @param {string} locale - The target locale code to switch to
 *
 * @description
 * Performs a complete locale change including:
 * - Validates the locale is supported
 * - Updates the Vue I18n instance
 * - Persists the choice to localStorage
 * - Updates the document's lang attribute for accessibility
 *
 * @throws {void} Silently ignores invalid locale codes
 *
 * @example
 * ```typescript
 * setLocale('es') // Switch to Spanish
 * setLocale('en') // Switch to English
 * setLocale('invalid') // Ignored, no change occurs
 * ```
 */
export function setLocale(locale: string): void {
  if (Object.keys(messages).includes(locale)) {
    i18n.global.locale.value = locale as SupportedLocale
    setStoredLocale(locale)
    document.documentElement.lang = locale
  }
}

/**
 * Initialize document language attribute
 *
 * @description
 * Sets the initial language attribute on the document element for:
 * - Better accessibility support
 * - SEO optimization
 * - Screen reader compatibility
 * - Browser translation features
 */
document.documentElement.lang = getInitialLocale()
