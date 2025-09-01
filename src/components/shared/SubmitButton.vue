<template>
  <button
    type="submit"
    :disabled="loading || disabled"
    :class="buttonClasses"
    :aria-describedby="ariaDescribedby"
  >
    <span
      v-if="loading"
      class="flex items-center justify-center"
      aria-label="Processing, please wait"
    >
      <v-icon name="hi-refresh" scale="1.2" class="animate-spin mr-3" aria-hidden="true" />
      {{ loadingText }}
    </span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  loading: boolean
  text?: string
  loadingText?: string
  ariaDescribedby?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Submit',
  loadingText: 'Processing...',
  variant: 'primary',
  size: 'md',
})

const buttonClasses = computed(() => [
  // Base classes
  'w-full font-srProDisplay font-medium rounded-xl transition-all duration-300 focus:outline-none',

  // Hover and active states (only when not disabled)
  {
    'transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg cursor-pointer': !props.disabled && !props.loading,
  },

  // Size variants
  {
    'px-4 py-2 text-sm': props.size === 'sm',
    'px-6 py-4 text-base': props.size === 'md',
    'px-8 py-5 text-lg': props.size === 'lg',
  },

  // Color variants
  {
    'bg-primary text-primary-foreground hover:bg-secondary focus:ring-2 focus:ring-primary/20 focus:ring-offset-2':
      props.variant === 'primary',
    'bg-secondary text-secondary-foreground hover:bg-accent focus:ring-2 focus:ring-secondary/20 focus:ring-offset-2':
      props.variant === 'secondary',
  },

  // Disabled state
  {
    'opacity-50 cursor-not-allowed': props.loading || props.disabled,
  },

  // Animation
  'animate-[fadeInUp_0.6s_ease-out_0.4s_both]',
])
</script>
