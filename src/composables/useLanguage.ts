import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/plugins/i18n'
import { availableLocales } from '@/locales'

export function useLanguage() {
  const { locale, t } = useI18n()

  const currentLocale = computed(() => {
    return availableLocales.find(l => l.code === locale.value) || availableLocales[0]
  })

  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale)
  }

  const isCurrentLocale = (localeCode: string) => {
    return locale.value === localeCode
  }

  return {
    locale,
    currentLocale,
    availableLocales,
    changeLanguage,
    isCurrentLocale,
    t
  }
}
