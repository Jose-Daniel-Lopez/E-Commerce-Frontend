/**
 * Internationalization (i18n) Locale Configuration
 *
 * This module centralizes all locale-related configurations for the application.
 * It imports translation messages and defines locale settings used throughout
 * the i18n system.
 *
 * @module locales
 */

import es from './es.json'
import en from './en.json'

/**
 * Translation messages object containing all supported locales
 *
 * @description
 * Contains all translation files organized by locale code.
 * Each locale should have a corresponding JSON file with translations.
 *
 * @type {Record<string, any>}
 *
 * @example
 * ```typescript
 * // Access Spanish translations
 * const spanishMessages = messages.es
 *
 * // Access English translations
 * const englishMessages = messages.en
 * ```
 */
export const messages = {
  es,
  en,
}

/**
 * Default locale code for the application
 *
 * @description
 * The primary language that will be used when:
 * - No user preference is stored
 * - Browser language detection fails
 * - Requested locale is not supported
 *
 * @type {string}
 * @default 'es'
 */
export const defaultLocale: string = 'es'

/**
 * Fallback locale code for missing translations
 *
 * @description
 * When a translation key is missing in the current locale,
 * the system will attempt to use this locale instead.
 * Should be the most complete translation set available.
 *
 * @type {string}
 * @default 'en'
 */
export const fallbackLocale: string = 'en'

/**
 * Array of available locales with metadata
 *
 * @description
 * Contains all supported locales with their display information.
 * Used for generating language selectors and validation.
 *
 * @type {Array<{code: string, name: string}>}
 *
 * @example
 * ```typescript
 * // Generate language selector options
 * availableLocales.map(locale => ({
 *   value: locale.code,
 *   label: locale.name
 * }))
 *
 * // Check if locale is supported
 * const isSupported = availableLocales.some(l => l.code === 'fr')
 * ```
 */
export const availableLocales: Array<{ code: string; name: string }> = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
]
