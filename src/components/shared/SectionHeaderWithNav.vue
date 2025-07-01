<template>
  <div class="flex items-center justify-between w-full">
    <!-- Título a la izquierda -->
    <h3 class="font-srProDisplay text-2xl font-medium text-black leading-none">
      {{ title }}
    </h3>

    <!-- Botones de navegación a la derecha -->
    <div class="flex items-center nav-container">
      <MinimalNavButtons
        :can-go-prev="canGoPrev"
        :can-go-next="canGoNext"
        @prev="$emit('prev')"
        @next="$emit('next')"
      />
    </div>
  </div>
</template>

<script setup>
import MinimalNavButtons from './MinimalNavButtons.vue'

// Props
defineProps({
  title: {
    type: String,
    required: true
  },
  canGoPrev: {
    type: Boolean,
    default: false
  },
  canGoNext: {
    type: Boolean,
    default: false
  }
})

// Emits
defineEmits(['prev', 'next'])
</script>
