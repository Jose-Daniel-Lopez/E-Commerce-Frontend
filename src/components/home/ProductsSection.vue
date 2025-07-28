<template>
  <section class="h-auto w-full">
    <Wrapper class="flex h-fit w-full flex-col gap-8 py-14">
      <!-- Tabs Navigation -->
      <div class="relative flex h-9 w-full items-center justify-between">
        <div class="h-9 w-full max-w-[300px] sm:max-w-[440px]">
          <Swiper
            :modules="tabModules"
            :slides-per-view="3"
            :space-between="8"
            :speed="500"
            :loop="false"
            :initial-slide="0"
            :breakpoints="tabBreakpoints"
            class="productTag !grid !h-9 !w-full !items-center pl-1"
          >
            <SwiperSlide
              v-for="tab in tabs"
              :key="tab"
              class="cursor-pointer !w-auto !flex-shrink-0 font-srProDisplay text-base sm:text-lg font-medium outline-none"
              @click="handleTabClick(tab)"
            >
              <span class="tab whitespace-nowrap px-2 py-1" :class="{ activeTab: value === tab }">
                {{ tab }}
              </span>
            </SwiperSlide>
          </Swiper>
        </div>
        <!-- Custom Pagination Buttons (BrowseCategory style) -->
        <div class="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2 z-20">
          <button
            ref="prevBtnRef"
            class="custom-swiper-button-prev-products-browse flex items-center justify-center bg-transparent p-0 transition disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
            aria-label="Previous slide"
            :disabled="!canGoPrev"
            style="transform: scaleX(-1)"
          >
            <!-- SVG personalizado, tamaño 1.2em, flecha izquierda -->
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
            ref="nextBtnRef"
            class="custom-swiper-button-next-products-browse flex items-center justify-center bg-transparent p-0 transition disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
            aria-label="Next slide"
            :disabled="!canGoNext"
          >
            <!-- SVG personalizado, tamaño 1.2em, flecha derecha -->
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

      <!-- Products Carousel with Grid -->
      <div class="relative">
        <template v-if="!productStore.loading && filteredProducts.length > 0">
          <Swiper
            :modules="productModules"
            :slides-per-view="4"
            :slides-per-group="1"
            :space-between="16"
            :speed="500"
            :loop="false"
            :initial-slide="0"
            :navigation="{
              prevEl: '.custom-swiper-button-prev-products-browse',
              nextEl: '.custom-swiper-button-next-products-browse',
            }"
            :grid="gridSettings"
            :breakpoints="productBreakpoints"
            class="products flex !h-fit w-full items-center pt-3 md:h-[455px]"
            @swiper="onSwiperInit"
          >
            <!-- Products -->
            <SwiperSlide v-for="product in filteredProducts" :key="product.id">
              <ProductCard
                :product="product"
                class="mb-4 w-[163.5px] xs:w-[190px] sm:w-[298px] md:w-[240px] xl:w-[268px]"
              />
            </SwiperSlide>
            <!-- View More Card -->
            <SwiperSlide v-if="filteredProducts.length >= 16">
              <ViewMoreCard />
            </SwiperSlide>
          </Swiper>
        </template>
        <template v-else-if="productStore.loading">
          <!-- Loading State -->
          <SwiperSlide v-for="n in 8" :key="`loading-${n}`">
            <div class="mb-4 w-[163.5px] xs:w-[190px] sm:w-[298px] md:w-[240px] xl:w-[268px]">
              <div class="animate-pulse rounded-[9px] bg-gray-200 h-[355px] sm:h-[330px] md:h-[390px]"></div>
            </div>
          </SwiperSlide>
        </template>
        <template v-else>
          <!-- No Data State -->
          <div
            class="mb-4 ml-[2px] h-auto w-[163.5px] rounded-[9px] px-3 py-6 duration-500 hover:scale-[1.02] xs:w-[190px] sm:mb-0 sm:w-[298px] md:h-[435px] md:w-[240px] md:px-4 xl:w-[268px]"
          >
            <div
              class="flex h-[355px] w-full flex-col items-center justify-center gap-4 sm:h-[330px] md:h-[390px]"
            >
              <div
                class="flex items-center justify-center font-srProDisplay text-xl font-semibold"
              >
                {{ $t('productsSection.noData') }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </Wrapper>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Grid } from 'swiper/modules'
import Wrapper from '../shared/Wrapper.vue'
import ProductCard from '../shared/ProductCard.vue'
import ViewMoreCard from '../shared/ViewMoreCard.vue'
import { useProductStore } from '@/stores/products'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/grid'

// Reactive data
import { onBeforeUnmount } from 'vue'
import type { Product } from '@/types/Product'
import type { Swiper as SwiperType } from 'swiper'

const swiperInstance = ref<SwiperType | null>(null)
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const value = ref(t('productsSection.tabs.new'))
const canGoPrev = ref(false)
const canGoNext = ref(false)
const prevBtnRef = ref<HTMLButtonElement | null>(null)
const nextBtnRef = ref<HTMLButtonElement | null>(null)

// Store
const productStore = useProductStore()

// Products data - now from backend
const newProducts = ref<Product[]>([])
const popularProducts = ref<Product[]>([])
const upcomingProducts = ref<Product[]>([])

// Fetch products based on type
const fetchProductsByType = async (type: string) => {
  switch (type) {
    case t('productsSection.tabs.new'):
      newProducts.value = await productStore.fetchNewProducts()
      break
    case t('productsSection.tabs.popular'):
      // Functionality for popular products is not implemented yet.
      popularProducts.value = []
      break
    case t('productsSection.tabs.upcoming'):
      // For upcoming products, we'll filter products with no stock or future dates
      // This is a placeholder - you might want to add a specific backend endpoint
      await productStore.fetchProducts(0, 50)
      upcomingProducts.value = productStore.products.filter((product) => product.totalStock === 0)
      break
  }
}

// Modules
const tabModules: never[] = []
const productModules = [Navigation, Grid]

// Tabs
const tabs = [
  t('productsSection.tabs.new'),
  t('productsSection.tabs.popular'),
  t('productsSection.tabs.upcoming')
]

// Computed properties
const filteredProducts = computed(() => {
  let products: Product[] = []

  switch (value.value) {
    case t('productsSection.tabs.new'):
      products = newProducts.value
      break
    case t('productsSection.tabs.popular'):
      products = popularProducts.value
      break
    case t('productsSection.tabs.upcoming'):
      products = upcomingProducts.value
      break
    default:
      products = []
  }

  // Transform backend Product type to match ProductCard component expectations
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    originalPrice: product.basePrice,
    discountPrice: '', // Set to empty for now, you can add discount logic later
    featureType: value.value === t('productsSection.tabs.upcoming') ? 'Up Coming...' : 'New Arrival',
    image: {
      url: product.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
      altText: product.name
    }
  }))
})

const productLength = computed(() => filteredProducts.value.length)

// Grid settings (dinámico basado en cantidad de productos)
const gridSettings = computed(() => ({
  rows: filteredProducts.value.length > 6 ? 2 : 1,
  fill: 'row' as const,
}))

// Helper functions (exactas del original)
const tabletRowSize = (productLength: number) => {
  if (productLength >= 8) return 3
  if (productLength > 4 && productLength <= 7) return 2
  return 1
}

const mobileRowSize = (productLength: number) => {
  if (productLength >= 8) return 4
  if (productLength > 5 && productLength <= 7) return 3
  if (productLength > 3 && productLength <= 5) return 2
  return 1
}

// Breakpoints for tabs
const tabBreakpoints = {
  320: {
    slidesPerView: 2,
    spaceBetween: 4,
  },
  480: {
    slidesPerView: 3,
    spaceBetween: 8,
  },
  639: {
    slidesPerView: 3,
    spaceBetween: 12,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 16,
  },
}

const productBreakpoints = computed(() => ({
  359: {
    slidesPerView: 1,
    spaceBetween: 16,
    grid: {
      rows: 4,
      fill: 'row' as const,
    },
  },
  767: {
    slidesPerView: 2,
    spaceBetween: 16,
    grid: {
      rows: mobileRowSize(productLength.value),
      fill: 'row' as const,
    },
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 16,
    grid: {
      rows: tabletRowSize(productLength.value),
      fill: 'row' as const,
    },
  },
}))

// Methods
const updateNavState = () => {
  if (!swiperInstance.value) return
  canGoPrev.value = !swiperInstance.value.isBeginning
  canGoNext.value = !swiperInstance.value.isEnd
}

const onSwiperInit = (swiper: SwiperType) => {
  swiperInstance.value = swiper
  // Actualizar estado inicial
  updateNavState()
  // Escuchar eventos de cambio de slide
  swiper.on('slideChange', updateNavState)
  swiper.on('reachBeginning', updateNavState)
  swiper.on('reachEnd', updateNavState)
}

onMounted(async () => {
  // Si Swiper ya está montado, actualizar estado
  if (swiperInstance.value) updateNavState()

  // Fetch initial data for the default tab (new products)
  await fetchProductsByType(value.value)
})

onBeforeUnmount(() => {
  if (swiperInstance.value) {
    swiperInstance.value.off('slideChange', updateNavState)
    swiperInstance.value.off('reachBeginning', updateNavState)
    swiperInstance.value.off('reachEnd', updateNavState)
  }
})

const handleTabClick = async (tab: string) => {
  value.value = tab
  await fetchProductsByType(tab)
}
</script>

<style scoped>
/* Tab styles */

.activeTab {
  color: #000000;
  font-weight: 900;
}

.tab {
  color: #6b7280;
  padding-bottom: 0.5rem;
  transition: color 0.2s ease;
  display: block;
  text-align: center;
  min-width: fit-content;
}

.tab:hover {
  color: #000000;
}

/* BrowseCategory style navigation buttons for ProductsSection (sin círculo, solo icono, tamaño 1.2em) */
.custom-swiper-button-prev-products-browse,
.custom-swiper-button-next-products-browse {
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
.custom-swiper-button-prev-products-browse:disabled,
.custom-swiper-button-next-products-browse:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Ocultar botones predeterminados */
.swiper-button-next,
.swiper-button-prev {
  display: none !important;
}

/* Grid layout styles */
.products :deep(.swiper-wrapper) {
  height: auto !important;
}

.products :deep(.swiper-slide) {
  height: auto !important;
}

/* Responsive: Ocultar navegación en móvil */
@media (max-width: 768px) {
  .custom-swiper-button-prev-products-browse,
  .custom-swiper-button-next-products-browse {
    display: none !important;
  }
}
</style>
