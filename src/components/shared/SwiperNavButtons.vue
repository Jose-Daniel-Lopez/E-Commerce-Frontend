<!-- src/components/shared/SwiperNavButtons.vue -->
<template>
  <div class="flex items-center gap-2">
    <!-- Botón Izquierdo -->
    <button
      @click="swiper.slidePrev()"
      class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="isBeginning"
    >
      <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Botón Derecho -->
    <button
      @click="swiper.slideNext()"
      class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="isEnd"
    >
      <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { useSwiper } from 'swiper/vue'
import { ref, onMounted } from 'vue'

const swiper = useSwiper()
const isBeginning = ref(true)
const isEnd = ref(false)

onMounted(() => {
  // Escuchar los eventos de Swiper para saber si estamos al principio o al final
  swiper.value.on('reachBeginning', () => {
    isBeginning.value = true
  })
  swiper.value.on('fromEdge', () => {
    isBeginning.value = swiper.value.isBeginning
    isEnd.value = swiper.value.isEnd
  })
  swiper.value.on('reachEnd', () => {
    isEnd.value = true
  })

  // Establecer el estado inicial
  isBeginning.value = swiper.value.isBeginning
  isEnd.value = swiper.value.isEnd
})
</script>
