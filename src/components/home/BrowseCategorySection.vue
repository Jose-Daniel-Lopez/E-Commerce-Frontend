<template>
  <section class="flex h-fit w-full items-center py-[80px] md:h-[352px]">
    <Wrapper class="relative h-fit md:h-[192px]">
      <!-- ENCABEZADO Y NAVEGACIÓN -->
      <div class="relative flex h-9 w-full items-center justify-between mb-8">
        <h3 class="font-srProDisplay text-2xl font-medium">
          Explorar por Categoría
        </h3>
        <div class="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2 z-20">
          <button
            class="custom-swiper-button-prev-browse-category flex items-center justify-center bg-transparent p-0 transition disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
            aria-label="Previous slide"
            :disabled="!(carouselRef?.canGoPrev)"
            style="transform: scaleX(-1);"
            @click="carouselRef?.goToPrev()"
          >
            <svg :width="'1.2em'" :height="'1.2em'" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
            </svg>
          </button>
          <button
            class="custom-swiper-button-next-browse-category flex items-center justify-center bg-transparent p-0 transition disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
            aria-label="Next slide"
            :disabled="!(carouselRef?.canGoNext)"
            @click="carouselRef?.goToNext()"
          >
            <svg :width="'1.2em'" :height="'1.2em'" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- CAROUSEL -->
      <div class="w-full">
        <CarouselWithNavigation
          ref="carouselRef"
          :categories="data"
          :slides-per-view="6"
        />
      </div>
    </Wrapper>
  </section>
  </template>

  <script setup lang="ts">
import { ref } from 'vue'
import Wrapper from '../shared/Wrapper.vue'
import CarouselWithNavigation from '../shared/CarouselWithNavigation.vue'

// Carousel ref interface
interface CarouselRef {
  goToPrev: () => void
  goToNext: () => void
  canGoPrev: boolean
  canGoNext: boolean
}

// Carousel ref
const carouselRef = ref<CarouselRef | null>(null)

// Category data
const data = [
  {
    id: 1,
    name: "Móviles",
    slug: "phones",
    icon: "gi-smartphone"
  },
  {
    id: 2,
    name: "Relojes Inteligentes",
    slug: "smart-watches",
    icon: "bi-smartwatch"
  },
  {
    id: 3,
    name: "Cámaras",
    slug: "cameras",
    icon: "bi-camera"
  },
  {
    id: 4,
    name: "Auriculares",
    slug: "headphones",
    icon: "la-headphones-solid"
  },
  {
    id: 5,
    name: "Ordenadores",
    slug: "computers",
    icon: "bi-laptop"
  },
  {
    id: 6,
    name: "Teclados",
    slug: "keyboards",
    icon: "bi-keyboard"
  },
  {
    id: 7,
    name: "Ratones",
    slug: "mice",
    icon: "bi-mouse"
  },
  {
    id: 8,
    name: "Gaming",
    slug: "gaming",
    icon: "gi-console-controller"
  },
  {
    id: 9,
    name: "Tablets",
    slug: "tablets",
    icon: "co-tablet"
  },
  {
    id: 10,
    name: "Hogar Inteligente",
    slug: "smart-home",
    icon: "ri-home-wifi-line"
  },
  {
    id: 11,
    name: "Audio",
    slug: "audio",
    icon: "hi-music-note"
  },
  {
    id: 12,
    name: "Accesorios",
    slug: "accessories",
    icon: "md-cable"
  },
]
</script>

<style scoped>
/* Navigation buttons style */
.custom-swiper-button-prev-browse-category,
.custom-swiper-button-next-browse-category {
  width: 1.2em;
  height: 1.2em;
  background: transparent;
  border: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: opacity 0.2s;
}
.custom-swiper-button-prev-browse-category:disabled,
.custom-swiper-button-next-browse-category:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
