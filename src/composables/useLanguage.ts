import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/plugins/i18n'
import { availableLocales } from '@/locales'

/**
 * Language management composable for Vue 3 applications
 *
 * Provides reactive language switching functionality using Vue I18n.
 * Manages locale state, language changes, and translation utilities.
 *
 * @returns {Object} Language management utilities
 *
 * @example
 * ```typescript
 * // In a Vue component
 * import { useLanguage } from '@/composables/useLanguage'
 *
 * export default {
 *   setup() {
 *     const {
 *       currentLocale,
 *       changeLanguage,
 *       isCurrentLocale,
 *       t
 *     } = useLanguage()
 *
 *     // Change to Spanish
 *     changeLanguage('es')
 *
 *     // Check if current locale is English
 *     const isEnglish = isCurrentLocale('en')
 *
 *     return { currentLocale, changeLanguage, isCurrentLocale, t }
 *   }
 * }
 * ```
 */
export function useLanguage(): object {
  const { locale, t } = useI18n()

  /**
   * Computed property that returns the current locale object
   *
   * @returns {Object} Current locale object with code, name, and other properties
   * @description Falls back to the first available locale if current locale is not found
   */
  const currentLocale = computed(() => {
    return availableLocales.find((l) => l.code === locale.value) || availableLocales[0]
  })

  /**
   * Changes the application language
   *
   * @param {string} newLocale - The locale code to switch to (e.g., 'en', 'es', 'fr')
   * @throws {Error} May throw if the locale is not supported
   *
   * @example
   * ```typescript
   * changeLanguage('es') // Switch to Spanish
   * changeLanguage('en') // Switch to English
   * ```
   */
  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale)
  }

  /**
   * Checks if the given locale code matches the current active locale
   *
   * @param {string} localeCode - The locale code to compare against current locale
   * @returns {boolean} True if the locale code matches the current locale
   *
   * @example
   * ```typescript
   * const isSpanish = isCurrentLocale('es')
   * const isEnglish = isCurrentLocale('en')
   * ```
   */
  const isCurrentLocale = (localeCode: string): boolean => {
    return locale.value === localeCode
  }

  return {
    /**
     * Reactive reference to the current locale code
     * @type {Ref<string>}
     */
    locale,

    /**
     * Computed current locale object with metadata
     * @type {ComputedRef<Object>}
     */
    currentLocale,

    /**
     * Array of all available locales in the application
     * @type {Array<Object>}
     */
    availableLocales,

    /**
     * Function to change the application language
     * @type {Function}
     */
    changeLanguage,

    /**
     * Function to check if a locale is currently active
     * @type {Function}
     */
    isCurrentLocale,

    /**
     * Translation function from vue-i18n
     * @type {Function}
     */
    t,
  }
}
