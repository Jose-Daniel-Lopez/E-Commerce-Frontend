<template>
  <div class="relative">
    <!-- Carousel Container con overflow controlado -->
    <div class="overflow-hidden mt-4">
      <div
        class="flex transition-transform duration-300 ease-in-out"
        :style="{ transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)` }"
        ref="carouselContainer"
      >
        <div
          v-for="category in categories"
          :key="category.id"
          class="flex-shrink-0 px-2"
          :style="{ width: `${100 / itemsPerView}%` }"
        >
          <CategoryCard :category="category" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CategoryCard from './CategoryCard.vue'

interface Category {
  id: number
  name: string
  slug: string
  image: { url: string; altText: string }
}

const props = defineProps<{ categories: Category[] }>()

// State
const currentIndex = ref(0)
const containerWidth = ref(0)
const carouselContainer = ref<HTMLElement | null>(null)

// Computed
const itemsPerView = computed(() => {
  if (containerWidth.value <= 640) return 2
  if (containerWidth.value <= 768) return 3
  if (containerWidth.value <= 1024) return 4
  if (containerWidth.value <= 1100) return 5
  return 6
})

const maxIndex = computed(() => Math.max(0, props.categories.length - itemsPerView.value))
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

// Lifecycle
onMounted(() => {
  updateContainerWidth()
  window.addEventListener('resize', updateContainerWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerWidth)
})

defineExpose({ goToPrev, goToNext, canGoPrev, canGoNext })
</script>
