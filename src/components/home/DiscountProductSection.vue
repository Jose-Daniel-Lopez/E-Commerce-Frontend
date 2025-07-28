<template>
  <section class="h-auto w-full">
    <Wrapper class="flex h-fit w-full flex-col gap-8 py-[80px]">
      <div class="relative flex h-9 w-full items-center justify-between">
        <h3 class="font-srProDisplay text-2xl font-medium">{{ $t('discountProducts.title') }}</h3>
        <!-- Navigation buttons -->
        <div class="absolute right-0 top-1/2 z-20 flex -translate-y-1/2 items-center gap-2">
          <button
            @click="goToPrev()"
            :disabled="!canGoPrev"
            class="custom-swiper-button-prev-discount flex items-center justify-center bg-transparent p-0 transition disabled:cursor-not-allowed disabled:opacity-40"
            style="transform: scaleX(-1)"
          >
            <svg
              :width="'1.2em'"
              :height="'1.2em'"
              viewBox="0 0 512 512"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"
              ></path>
            </svg>
          </button>
          <button
            @click="goToNext()"
            :disabled="!canGoNext"
            class="custom-swiper-button-next-discount flex items-center justify-center bg-transparent p-0 transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              :width="'1.2em'"
              :height="'1.2em'"
              viewBox="0 0 512 512"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Main container - CUSTOM CAROUSEL LIKE CATEGORIES -->
      <div class="relative w-full overflow-hidden mt-4">
        <div
          class="flex transition-transform duration-300 ease-in-out"
          :style="{ transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)` }"
          ref="carouselContainer"
        >
          <div
            v-for="product in formattedProducts"
            :key="product.id"
            class="flex-shrink-0 px-2"
            :style="{ width: `${100 / itemsPerView}%` }"
          >
            <div class="px-1 py-2">
              <ProductCard :product="product" />
            </div>
          </div>

          <!-- View More Card -->
          <div
            v-if="formattedProducts.length >= 16"
            class="flex-shrink-0 px-2"
            :style="{ width: `${100 / itemsPerView}%` }"
          >
            <div class="px-1 py-2">
              <ViewMoreCard />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProductStore } from '@/stores/products'
import Wrapper from '../shared/Wrapper.vue'
import ProductCard from '../shared/ProductCard.vue'
import ViewMoreCard from '../shared/ViewMoreCard.vue'

const productStore = useProductStore()

onMounted(() => {
  productStore.fetchFeaturedProducts()
  updateContainerWidth()
  window.addEventListener('resize', updateContainerWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerWidth)
})

// State
const currentIndex = ref(0)
const containerWidth = ref(0)
const carouselContainer = ref<HTMLElement | null>(null)

// Computed
const formattedProducts = computed(() => {
  return productStore.featuredProducts.map((product) => ({
    id: product.id,
    name: product.name,
    originalPrice: product.basePrice,
    discountPrice: product.basePrice,
    image: {
      url:
        product.imageUrl ||
        'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
      altText: product.name
    }
  }))
})

const itemsPerView = computed(() => {
  if (containerWidth.value <= 640) return 1
  if (containerWidth.value <= 768) return 2
  if (containerWidth.value <= 1024) return 3
  return 4 // 4 items for larger screens
})

const maxIndex = computed(() => Math.max(0, formattedProducts.value.length - itemsPerView.value))
const canGoPrev = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < maxIndex.value)

// Methods
const goToPrev = () => {
  if (canGoPrev.value) {
    currentIndex.value = Math.max(0, currentIndex.value - itemsPerView.value)
  }
}

const goToNext = () => {
  if (canGoNext.value) {
    currentIndex.value = Math.min(maxIndex.value, currentIndex.value + itemsPerView.value)
  }
}

const updateContainerWidth = () => {
  const parent = carouselContainer.value?.parentElement as HTMLElement | null
  if (parent) {
    containerWidth.value = parent.clientWidth
  }
}

// Expose methods for parent components if needed
defineExpose({ goToPrev, goToNext, canGoPrev, canGoNext })
</script>

<style scoped>
/* Navigation buttons */
.custom-swiper-button-prev-discount,
.custom-swiper-button-next-discount {
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
</style>
