<template>
  <div :class="infoCardClasses">
    <h2 :class="['font-srProDisplay text-xl font-semibold mb-6 transition-colors duration-200', textClasses]">
      {{ t('contact.information.title') }}
    </h2>
    <div class="space-y-0">
      <!-- Email Block -->
      <div :class="['flex items-start gap-4 py-8 border-b', dividerClasses]">
        <div :class="iconBackgroundClasses">
          <v-icon name="hi-mail" :class="['w-6 h-6', interactiveIconClasses]" />
        </div>
        <div>
          <h3 :class="['font-srProDisplay text-lg font-medium mb-1 transition-colors duration-200', textClasses]">
            {{ t('contact.information.email.title') }}
          </h3>
          <p :class="['font-srProDisplay text-sm mb-1 transition-colors duration-200', textSecondaryClasses]">
            {{ t('contact.information.email.info') }}
          </p>
          <p :class="['font-srProDisplay text-sm transition-colors duration-200', textSecondaryClasses]">
            {{ t('contact.information.email.support') }}
          </p>
        </div>
      </div>
      <!-- Phone Block -->
      <div :class="['flex items-start gap-4 py-12 border-b', dividerClasses]">
        <div :class="iconBackgroundClasses">
          <v-icon name="hi-phone" :class="['w-6 h-6', interactiveIconClasses]" />
        </div>
        <div>
          <h3 :class="['font-srProDisplay text-lg font-medium mb-1 transition-colors duration-200', textClasses]">
            {{ t('contact.information.phone.title') }}
          </h3>
          <p :class="['font-srProDisplay text-sm mb-1 transition-colors duration-200', textSecondaryClasses]">
            {{ t('contact.information.phone.number') }}
          </p>
          <p :class="['font-srProDisplay text-xs transition-colors duration-200', textSecondaryClasses]">
            {{ t('contact.information.phone.hours') }}
          </p>
        </div>
      </div>
      <!-- Location Block -->
      <div :class="['flex items-start gap-4 py-12 border-b', dividerClasses]">
        <div :class="iconBackgroundClasses">
          <v-icon name="hi-location-marker" :class="['w-6 h-6', interactiveIconClasses]" />
        </div>
        <div>
          <h3 :class="['font-srProDisplay text-lg font-medium mb-1 transition-colors duration-200', textClasses]">
            {{ t('contact.information.location.title') }}
          </h3>
          <p :class="['font-srProDisplay text-sm mb-1 transition-colors duration-200', textSecondaryClasses]">
            {{ t('contact.information.location.address') }}
          </p>
          <p :class="['font-srProDisplay text-sm transition-colors duration-200', textSecondaryClasses]">
            {{ t('contact.information.location.city') }}
          </p>
        </div>
      </div>
      <!-- Response Time Block -->
      <div class="flex items-start gap-4 py-12">
        <div :class="iconBackgroundClasses">
          <v-icon name="hi-clock" :class="['w-6 h-6', interactiveIconClasses]" />
        </div>
        <div>
          <h3 :class="['font-srProDisplay text-lg font-medium mb-1 transition-colors duration-200', textClasses]">
            {{ t('contact.information.responseTime.title') }}
          </h3>
          <p :class="['font-srProDisplay text-sm mb-1 transition-colors duration-200', textSecondaryClasses]">
            {{ t('contact.information.responseTime.description') }}
          </p>
          <p :class="['font-srProDisplay text-xs transition-colors duration-200', textSecondaryClasses]">
            {{ t('contact.information.responseTime.businessHours') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useThemeClasses } from '@/composables/useThemeClasses'
const { t } = useI18n()
const {
  infoCardClasses,
  textClasses,
  textSecondaryClasses,
  iconBackgroundClasses,
  interactiveIconClasses,
  dividerClasses
} = useThemeClasses()
</script>
