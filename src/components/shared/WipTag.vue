<template>
  <span
    :class="`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-all duration-200 ${variant === 'default' ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' : ''} ${variant === 'compact' ? 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800' : ''} ${variant === 'subtle' ? 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' : ''}`"
    :title="tooltipText">
    <svg
      v-if="showIcon"
      class="w-3 h-3 mr-1"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clip-rule="evenodd" />
    </svg>
  {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  text?: string
  variant?: 'default' | 'compact' | 'subtle'
  showIcon?: boolean
  tooltip?: string
}

// Use a translation key as the default tooltip so i18n is used by default.
// If a literal tooltip string is passed (not a translation key), we fallback to it.
const props = withDefaults(defineProps<Props>(), {
  text: 'WIP',
  variant: 'default',
  showIcon: true,
  tooltip: 'wip.tooltip'
})

const { text, variant, showIcon } = toRefs(props)

const { t, te } = useI18n()

const tooltipText = computed(() => {
  const tip = props.tooltip as string | undefined
  if (!tip) return ''
  // If `tip` exists as a translation key, return the translated value.
  // Otherwise assume it's a literal string and return it directly.
  return te(tip) ? (t(tip) as string) : tip
})
</script>

<style scoped>
/* Additional hover effects */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Pulse animation for extra attention */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
