<template>
  <section
    :id="sectionId"
    :class="['transition-colors duration-200', sectionContainerClasses]"
  >
    <h2 :class="['mb-6 text-xl font-semibold font-srProDisplay', textClasses]">
      <span :class="sectionHeaderClasses">{{ $t('account.settings.title') }}</span>
    </h2>
    <div class="space-y-6">
      <!-- Language Setting -->
      <div :class="reviewContentClasses">
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-3">
            <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconContainerClasses]">
              <v-icon name="hi-globe" scale="1.2" :class="iconInContainerClasses" />
            </div>
            <div>
              <h4 :class="['font-medium font-srProDisplay', textClasses]">
                {{ $t('account.settings.language.title') }}
                <WipTag variant="compact" :show-icon="false" text="WIP" tooltip="Theme system is still under development" />
              </h4>
              <p :class="['text-sm font-srProDisplay', textSecondaryClasses]">
                {{ $t('account.settings.language.description') }}
              </p>
            </div>
          </div>
          <select
            :value="currentLocale.code"
            @change="$emit('language-change', ($event.target as HTMLSelectElement).value)"
            class="px-3 py-2 text-sm transition-all duration-200 rounded-lg font-srProDisplay theme-input theme-text focus:shadow-lg"
          >
            <option v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
              {{ locale.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- App Theme Setting -->
      <div :class="reviewContentClasses">
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-3">
            <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconContainerClasses]">
              <v-icon name="hi-color-swatch" scale="1.2" :class="iconInContainerClasses" />
            </div>
            <div>
              <h4 :class="['font-medium font-srProDisplay', textClasses]">
                {{ $t('account.settings.theme.title') }}
                <WipTag variant="compact" :show-icon="false" text="WIP" tooltip="Theme system is still under development" />
              </h4>
              <p :class="['text-sm font-srProDisplay', textSecondaryClasses]">
                {{ $t('account.settings.theme.description') }}
              </p>
              <!-- Current theme indicator -->
              <p class="mt-1 text-xs font-medium theme-text">
                Current: {{ selectedTheme === 'system' ? `System (${effectiveTheme})` : selectedTheme }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="relative group">
              <button
                @click="$emit('theme-change', 'light')"
                :class="[
                  themeButtonBaseClasses,
                  selectedTheme === 'light' ? themeButtonActiveClasses : themeButtonInactiveClasses
                ]"
                aria-label="Tema claro"
                tabindex="0"
              >
                <v-icon name="hi-sun" class="w-4 h-4" />
              </button>
              <!-- Tooltip -->
              <div class="absolute z-10 px-2 py-1 mb-2 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-gray-900 rounded opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
                Light theme
              </div>
            </div>

            <div class="relative group">
              <button
                @click="$emit('theme-change', 'dark')"
                :class="[
                  themeButtonBaseClasses,
                  selectedTheme === 'dark' ? themeButtonActiveClasses : themeButtonInactiveClasses
                ]"
                aria-label="Tema oscuro"
                tabindex="0"
              >
                <v-icon name="hi-moon" class="w-4 h-4" />
              </button>
              <!-- Tooltip -->
              <div class="absolute z-10 px-2 py-1 mb-2 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-gray-900 rounded opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
                Dark theme
              </div>
            </div>

            <div class="relative group">
              <button
                @click="$emit('theme-change', 'system')"
                :class="[
                  themeButtonBaseClasses,
                  selectedTheme === 'system' ? themeButtonActiveClasses : themeButtonInactiveClasses
                ]"
                aria-label="Tema del sistema"
                tabindex="0"
              >
                <v-icon name="hi-desktop-computer" class="w-4 h-4" />
              </button>
              <!-- Tooltip -->
              <div class="absolute z-10 px-2 py-1 mb-2 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-gray-900 rounded opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
                Follow system preference
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Setting -->
      <div :class="reviewContentClasses">
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-3">
            <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconContainerClasses]">
              <v-icon name="hi-key" scale="1.2" :class="iconInContainerClasses" />
            </div>
            <div>
              <h4 :class="['font-medium font-srProDisplay', textClasses]">
                {{ $t('account.settings.security.title') }}
              </h4>
              <p :class="['text-sm font-srProDisplay', textSecondaryClasses]">
                {{ $t('account.settings.security.description') }}
              </p>
            </div>
          </div>
          <Button
            :class="['px-4 text-sm transition-all duration-200', buttonOutlineClasses]"
            text-color="currentColor"
            bg-color="transparent"
            border-width="1px"
            width="auto"
            height="36px"
            @click="$emit('open-change-password')"
          >
            <span :class="buttonTextClasses">{{ $t('account.settings.security.changePasswordButton') }}</span>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '@/components/shared/Button.vue'
import WipTag from '../shared/WipTag.vue'

interface Locale {
  code: string
  name: string
}

interface Props {
  sectionId: string
  currentLocale: Locale
  availableLocales: Locale[]
  selectedTheme: string
  effectiveTheme: string
  sectionContainerClasses: string
  textClasses: string
  sectionHeaderClasses: string
  textSecondaryClasses: string
  reviewContentClasses: string
  iconContainerClasses: string
  iconInContainerClasses: string
  themeButtonBaseClasses: string
  themeButtonActiveClasses: string
  themeButtonInactiveClasses: string
  buttonOutlineClasses: string
  buttonTextClasses: string
}

interface Emits {
  (e: 'language-change', locale: string): void
  (e: 'theme-change', theme: 'light' | 'dark' | 'system'): void
  (e: 'open-change-password'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
