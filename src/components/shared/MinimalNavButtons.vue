<template>
  <div class="flex items-center gap-1">
    <button
      @click="$emit('prev')"
      :disabled="!canGoPrev"
      :class="[
        'w-9 h-9 flex items-center justify-center transition-colors duration-200',
        canGoPrev
          ? 'text-black hover:text-gray-600 cursor-pointer'
          : 'text-gray-300 cursor-not-allowed'
      ]"
    >
      <!-- Flecha izquierda (rotada 180 grados) -->
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 512 512"
        height="1.2em"
        width="1.2em"
        xmlns="http://www.w3.org/2000/svg"
        class="transform rotate-180"
      >
        <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
      </svg>
    </button>

    <button
      @click="$emit('next')"
      :disabled="!canGoNext"
      :class="[
        'w-9 h-9 flex items-center justify-center transition-colors duration-200',
        canGoNext
          ? 'text-black hover:text-gray-600 cursor-pointer'
          : 'text-gray-300 cursor-not-allowed'
      ]"
    >
      <!-- Flecha derecha -->
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 512 512"
        height="1.2em"
        width="1.2em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
// Props
defineProps({
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
