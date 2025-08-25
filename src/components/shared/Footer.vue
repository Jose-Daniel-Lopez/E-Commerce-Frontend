<template>
  <footer class="mb-[66px] h-auto w-full theme-surface theme-text sm:mb-0 lg:h-[464px] transition-colors duration-200">
    <Wrapper class="flex h-auto flex-col gap-8 py-12 md:gap-6 md:px-[64px] lg:py-[104px]">
      <div
        class="flex h-auto w-full flex-col items-center justify-start gap-8 md:flex-row md:items-start lg:h-[216px] lg:justify-between">
        <div class="basis-auto text-center md:text-left lg:basis-[384px]">
          <router-link to="/" class="flex justify-center md:justify-start">
            <img :src="logoSrc" alt="logo" class="w-20 h-auto mb-4 transition-transform duration-200 hover:scale-105" />
          </router-link>
          <div class="w-[295px] xl:w-full">
            <p class="text-base font-semibold font-srProDisplay theme-text">{{ $t('footer.location') }}</p>
            <address class="h-[48px] font-srProDisplay text-sm font-light theme-muted-text">
              {{ $t('footer.headOffice') }}
            </address>
            <h4 class="text-base font-medium font-srProDisplay theme-text">{{ $t('footer.emailLabel') }}</h4>
            <a :href="`mailto:${$t('footer.emailAddress')}`"
              class="font-normal theme-primary transition-colors font-srProDisplay hover:theme-accent">{{ $t('footer.emailAddress') }}</a>
          </div>
        </div>
        <div
          class="flex basis-auto flex-col justify-between gap-8 text-center md:text-left lg:basis-[623px] lg:flex-row">
          <div class="max-w-[295px]">
      <h4 class="text-base font-medium font-srProDisplay text-foreground">{{ $t('footer.about') }}</h4>
            <ul class="mt-2 font-srProDisplay text-sm font-light *:pb-2">
              <li>
        <router-link :to="{ name: 'terms' }" :class="footerLinkClasses">{{ $t('footer.terms') }}</router-link>
              </li>
              <li>
        <router-link :to="{ name: 'privacy' }" :class="footerLinkClasses">{{ $t('footer.privacy') }}</router-link>
              </li>
              <li>
        <router-link :to="{ name: 'refund' }" :class="footerLinkClasses">{{ $t('footer.refund') }}</router-link>
              </li>
              <li>
        <router-link :to="{ name: 'about' }" :class="footerLinkClasses">{{ $t('footer.about') }}</router-link>
              </li>
              <li>
        <router-link :to="{ name: 'contact' }" :class="footerLinkClasses">{{ $t('footer.contact') }}</router-link>
              </li>
            </ul>
          </div>
          <div class="max-w-[295px]">
            <h4 class="text-base font-medium font-srProDisplay text-foreground">{{ $t('footer.support') }}</h4>
            <div class="flex items-center justify-start p-2 mt-2 border border-border rounded-2xl bg-surface">
              <div class="px-3 border-r border-border">
                <svg class="w-8 h-8 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div class="px-3">
                <p class="text-sm font-thin text-muted-foreground font-srProDisplay">{{ $t('footer.supportHours') }}</p>
                <p class="font-semibold text-primary font-srProDisplay">{{ $t('footer.supportPhone') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- footer social icon section start -->
      <div class="mx-auto mt-2 flex w-[173px] items-center justify-between md:mx-0 lg:h-[16px]">
          <SocialIcons :links="links" :link-class="footerLinkClasses" />
      </div>
      <!-- footer social icon section end -->
    </Wrapper>
  </footer>
</template>

<script setup lang="ts">
import Wrapper from './Wrapper.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { getLogoImage } from '@/composables/useCloudinaryImages'
import SocialIcons from './SocialIcons.vue'

const links = [
  { href: 'https://x.com/', label: 'X', target: '_blank' as const },
  { href: 'https://facebook.com/', label: 'Facebook', target: '_blank' as const },
  { href: 'https://github.com/', label: 'GitHub', target: '_blank' as const },
]

// Define component name
defineOptions({
  name: 'AppFooter'
})

// Theme classes
const {
  footerLinkClasses
} = useThemeClasses()

// Theme-aware logo for footer
const themeStore = useThemeStore()
const { selectedTheme } = storeToRefs(themeStore)
const logoSrc = computed(() => {
  const theme = selectedTheme?.value ?? 'light'
  const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const darkActive = document.documentElement.classList.contains('dark') || theme === 'dark' || (theme === 'system' && systemPrefersDark)
  return getLogoImage(darkActive, { width: 80, quality: 'auto' })
})
</script>

<style scoped>
button:focus {
  outline: none;
  box-shadow: none;
}

a:focus {
  outline: none;
  box-shadow: none;
}

svg:focus {
  outline: none;
  box-shadow: none;
}
</style>
