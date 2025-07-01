<template>
  <section class="flex h-fit w-full items-center py-[80px] md:h-[352px]">
    <Wrapper class="relative h-fit md:h-[192px]">
      <!-- ENCABEZADO Y NAVEGACIÓN -->
      <SectionHeaderWithNav
        title="Browse By Category"
        :can-go-prev="carouselRef?.canGoPrev"
        :can-go-next="carouselRef?.canGoNext"
        @prev="carouselRef?.goToPrev()"
        @next="carouselRef?.goToNext()"
        class="mb-8"
      />

      <!-- CAROUSEL -->
      <div class="w-full">
        <CarouselWithNavigation
          ref="carouselRef"
          :categories="data"
        />
        <!-- Debug: Mostrar el número de categorías -->
        <p class="text-sm text-gray-500 mt-2">Mostrando {{ data.length }} categorías</p>
      </div>
    </Wrapper>
  </section>
  </template>

  <script setup lang="ts">
import { ref } from 'vue'
// Se importan los componentes y se usan directamente en el template
import Wrapper from '../shared/Wrapper.vue'
import CarouselWithNavigation from '../shared/CarouselWithNavigation.vue'
import SectionHeaderWithNav from '../shared/SectionHeaderWithNav.vue'

// Referencia al carousel para acceder a sus métodos
const carouselRef = ref(null)

// La data se define directamente como una constante.
const data = [
  {
    id: 1,
    name: "Phones",
    slug: "phones",
    image: {
      url: "/images/Phones.png",
      altText: "Phone icon",
    },
  },
  {
    id: 2,
    name: "Smart Watches",
    slug: "smart-watches",
    image: {
      url: "/images/Smart-watches.png",
      altText: "Smart Watch icon",
    },
  },
  {
    id: 3,
    name: "Cameras",
    slug: "cameras",
    image: {
      url: "/images/Cameras.png",
      altText: "Cameras icon",
    },
  },
  {
    id: 4,
    name: "Headphones",
    slug: "headphones",
    image: {
      url: "/images/Headphone.png",
      altText: "Headphone icon",
    },
  },
  {
    id: 5,
    name: "Computers",
    slug: "computers",
    image: {
      url: "/images/Computers.png",
      altText: "Computer icon",
    },
  },
  {
    id: 6,
    name: "Gaming",
    slug: "gaming",
    image: {
      url: "/images/Gaming.png",
      altText: "Gaming icon",
    },
  },
  {
    id: 7,
    name: "Tablets",
    slug: "tablets",
    image: {
      url: "/images/Apple-iPad.png",
      altText: "Tablet icon",
    },
  },
  {
    id: 8,
    name: "Smart Home",
    slug: "smart-home",
    image: {
      url: "/images/Smart-watch.png",
      altText: "Smart Home icon",
    },
  },
  {
    id: 9,
    name: "Audio",
    slug: "audio",
    image: {
      url: "/images/Apple-airPods.png",
      altText: "Audio icon",
    },
  },
  {
    id: 10,
    name: "Accessories",
    slug: "accessories",
    image: {
      url: "/images/Samsung-Watch.png",
      altText: "Accessories icon",
    },
  },
]
</script>

<style scoped>
/* Removed CSS that hid header navigation arrows */
</style>
