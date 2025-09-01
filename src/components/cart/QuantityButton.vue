<template>
  <div class="flex items-center gap-3 mt-2">
    <button
      :class="[
        'w-8 h-8 flex items-center justify-center border rounded transition-colors cursor-pointer',
        'theme-border hover:theme-surface',
        textClasses,
        { 'opacity-50 cursor-not-allowed': quantity <= 1 }
      ]"
      @click="$emit('decrement')"
      :disabled="quantity <= 1"
    >
      -
    </button>
    <span :class="[
      'font-srProDisplay text-base',
      textClasses
    ]">{{ quantity }}</span>
    <button
      :class="[
        'w-8 h-8 flex items-center justify-center border rounded transition-colors cursor-pointer',
        'theme-border hover:theme-surface',
        textClasses
      ]"
      @click="$emit('increment')"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'

// Theme classes
const { textClasses } = useThemeClasses()

defineProps<{
  quantity: number
}>()

defineEmits<{
  increment: []
  decrement: []
}>()
</script>
