<template>
  <section class="flex h-fit w-full items-center py-[80px] md:h-[352px] bg-background transition-colors duration-200">
    <Wrapper class="relative h-fit md:h-[192px]">
      <!-- ENCABEZADO Y NAVEGACIÓN -->
      <div class="relative flex h-9 w-full items-center justify-between mb-8">
  <h3 class="font-srProDisplay text-2xl font-medium theme-text transition-colors duration-200">
          {{ t('nav.categories') }}
        </h3>
        <div class="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2 z-20">
          <button
            class="custom-swiper-button-prev-browse-category flex items-center justify-center bg-transparent p-0 transition disabled:opacity-40 disabled:cursor-not-allowed text-muted hover:text-foreground transition-colors duration-200"
            type="button"
            aria-label="Previous slide"
            :disabled="categoriesStore.loading || !carouselRef?.canGoPrev"
            style="transform: scaleX(-1)"
            @click="carouselRef?.goToPrev()"
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
            class="custom-swiper-button-next-browse-category flex items-center justify-center bg-transparent p-0 transition disabled:opacity-40 disabled:cursor-not-allowed text-muted hover:text-foreground transition-colors duration-200"
            type="button"
            aria-label="Next slide"
            :disabled="categoriesStore.loading || !carouselRef?.canGoNext"
            @click="carouselRef?.goToNext()"
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

      <!-- CAROUSEL -->
      <div class="w-full">
        <!-- Loading State -->
        <div v-if="categoriesStore.loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-border"></div>
          <span class="ml-3 text-muted transition-colors duration-200">{{ t('common.loading') }}</span>
        </div>

        <!-- Error State -->
        <div v-else-if="categoriesStore.error" class="text-center py-8">
          <p class="theme-error-text mb-4 transition-colors duration-200">{{ t('common.error') }}: {{ categoriesStore.error }}</p>
          <button
            @click="categoriesStore.fetchCategories()"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors duration-200"
          >
            {{ t('common.confirm') }}
          </button>
        </div>

        <!-- Carousel with Categories -->
        <CarouselWithNavigation
          v-else-if="data.length > 0"
          ref="carouselRef"
          :categories="data"
          :slides-per-view="6"
        />

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <p class="text-muted transition-colors duration-200">{{ t('shop.empty.title') }}</p>
        </div>
      </div>
    </Wrapper>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Wrapper from '../shared/Wrapper.vue'
import CarouselWithNavigation from '../shared/CarouselWithNavigation.vue'
import { useCategoriesStore } from '@/stores/categories'
import { useLanguage } from '@/composables/useLanguage'

// Carousel ref interface
interface CarouselRef {
  goToPrev: () => void
  goToNext: () => void
  canGoPrev: boolean
  canGoNext: boolean
}

// Store
const categoriesStore = useCategoriesStore()
const { t } = useLanguage()

// Carousel ref
const carouselRef = ref<CarouselRef | null>(null)

// Transform backend categories to match the component's expected format
const data = computed(() => {
  return categoriesStore.categories.map((category) => ({
    id: category.id,
    name: translateCategoryName(category.name),
    slug: category.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[áàäâã]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöôõ]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9-]/g, ''),
    icon: category.icon,
  }))
})

// Translate category names
const translateCategoryName = (categoryName: string): string => {
  const normalizedName = categoryName.toLowerCase()

  // Try to find a direct translation
  const translationKey = `shop.categories.${normalizedName}`
  const translated = t(translationKey)

  // If translation exists and is different from the key, return it
  if (translated !== translationKey) {
    return translated
  }

  // Fallback: return the original name
  return categoryName
}

// Fetch categories on component mount
onMounted(async () => {
  if (!categoriesStore.hasCategories) {
    await categoriesStore.fetchCategories()
  }
})
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
