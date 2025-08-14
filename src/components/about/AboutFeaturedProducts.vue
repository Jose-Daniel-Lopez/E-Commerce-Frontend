<template>
  <section class="max-w-6xl mx-auto mb-16">
    <h2 :class="sectionTitleClasses">
      {{ $t('about.featuredProducts.title') }}
    </h2>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div v-for="product in products" :key="product.img" :class="featuredProductCardClasses">
        <div class="flex items-center justify-center w-full h-32 mb-6">
          <img :src="product.img" :alt="product.alt" class="object-contain h-full" />
        </div>
        <h3 :class="featuredProductTitleClasses">
          {{ $t(product.title) }}
        </h3>
        <p :class="featuredProductDescriptionClasses">
          {{ $t(product.description) }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'
const {
  sectionTitleClasses,
  featuredProductCardClasses,
  featuredProductTitleClasses,
  featuredProductDescriptionClasses,
} = useThemeClasses()

const products = [
  {
    img: '/images/Apple-phone.png',
    alt: 'iPhone',
    title: 'about.featuredProducts.iphone.title',
    description: 'about.featuredProducts.iphone.description',
  },
  {
    img: '/images/Macbook.png',
    alt: 'MacBook',
    title: 'about.featuredProducts.macbook.title',
    description: 'about.featuredProducts.macbook.description',
  },
  {
    img: '/images/Apple-airPods.png',
    alt: 'AirPods',
    title: 'about.featuredProducts.airpods.title',
    description: 'about.featuredProducts.airpods.description',
  },
]
</script>
