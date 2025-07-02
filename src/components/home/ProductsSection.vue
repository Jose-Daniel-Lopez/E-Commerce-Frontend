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
              <span
                class="tab whitespace-nowrap px-2 py-1"
                :class="{ 'activeTab': value === tab }"
              >
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
            style="transform: scaleX(-1);"
          >
            <!-- SVG personalizado, tamaño 1.2em, flecha izquierda -->
            <svg :width="'1.2em'" :height="'1.2em'" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
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
            <svg :width="'1.2em'" :height="'1.2em'" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Products Carousel with Grid -->
      <div class="relative">
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
          <template v-if="filteredProducts.length > 0">
            <SwiperSlide
              v-for="product in filteredProducts"
              :key="product.id"
            >
              <ProductCard
                :product="product"
                class="mb-4 w-[163.5px] xs:w-[190px] sm:w-[298px] md:w-[240px] xl:w-[268px]"
              />
            </SwiperSlide>
          </template>

          <!-- No Data State -->
          <SwiperSlide v-else>
            <div class="mb-4 ml-[2px] h-auto w-[163.5px] rounded-[9px] px-3 py-6 duration-500 hover:scale-[1.02] xs:w-[190px] sm:mb-0 sm:w-[298px] md:h-[435px] md:w-[240px] md:px-4 xl:w-[268px]">
              <div class="flex h-[355px] w-full flex-col items-center justify-center gap-4 sm:h-[330px] md:h-[390px]">
                <div class="flex items-center justify-center font-srProDisplay text-xl font-semibold">
                  No hay datos
                </div>
              </div>
            </div>
          </SwiperSlide>

          <!-- View More Card -->
          <SwiperSlide v-if="filteredProducts.length >= 16">
            <ViewMoreCard />
          </SwiperSlide>
        </Swiper>


      </div>
    </Wrapper>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Grid } from 'swiper/modules'
import Wrapper from '../shared/Wrapper.vue'
import ProductCard from '../shared/ProductCard.vue'
import ViewMoreCard from '../shared/ViewMoreCard.vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/grid'

// Reactive data
import { onBeforeUnmount } from 'vue'
const swiperInstance = ref(null)
const value = ref('Nuevos')
const canGoPrev = ref(false)
const canGoNext = ref(false)
const prevBtnRef = ref(null)
const nextBtnRef = ref(null)

// Modules
const tabModules = []
const productModules = [Navigation, Grid]

// Tabs
const tabs = ['Nuevos', 'Populares', 'Próximamente']

// Products data
const products = [
  {
    id: 1,
    name: "Apple iPhone 14 Pro Max 128GB Deep Purple(MQ9T3RX/A)",
    featureType: "New Arrival",
    originalPrice: "900",
    discountPrice: "",
    image: {
      url: "/images/Iphone-14-pro-purple.png",
      altText: "Iphone-14-pro-purple",
    },
  },
  {
    id: 2,
    name: "Blackmagic Pocket Cinema Camera 6k",
    featureType: "New Arrival",
    originalPrice: "2535",
    discountPrice: "",
    image: {
      url: "/images/Camera.png",
      altText: "Camera",
    },
  },
  {
    id: 3,
    name: "Apple Watch Series 9 GPS 41mm Starlight Aluminum Case",
    featureType: "New Arrival",
    originalPrice: "399",
    discountPrice: "",
    image: {
      url: "/images/Apple-Watch.png",
      altText: "Apple-Watch",
    },
  },
  {
    id: 4,
    name: "AirPods Max Silver",
    featureType: "New Arrival",
    originalPrice: "549",
    discountPrice: "",
    image: {
      url: "/images/Apple-airPods.png",
      altText: "Apple-airPods",
    },
  },
  {
    id: 5,
    name: "Samsung Galaxy Watch6",
    featureType: "New Arrival",
    originalPrice: "369",
    discountPrice: "",
    image: {
      url: "/images/Samsung-Watch.png",
      altText: "Samsung-Watch",
    },
  },
  {
    id: 6,
    name: "Galaxy Z Fold5 Unlocked | 256GB | Phantom Black",
    featureType: "New Arrival",
    originalPrice: "1799",
    discountPrice: "",
    image: {
      url: "/images/Galaxy-Z-Mobile.png",
      altText: "Galaxy-Z-Mobile",
    },
  },
  {
    id: 7,
    name: "Galaxy Buds FE Graphite",
    featureType: "New Arrival",
    originalPrice: "99.99",
    discountPrice: "",
    image: {
      url: "/images/Galaxy-buds-FE.png",
      altText: "Galaxy-buds-FE",
    },
  },
  {
    id: 8,
    name: "Apple iPad 9 10.2'' 64GB Wi-Fi Silver (MK2L3) 2021",
    featureType: "New Arrival",
    originalPrice: "398",
    discountPrice: "",
    image: {
      url: "/images/Apple-iPad.png",
      altText: "Apple-iPad",
    },
  },
  {
    id: 9,
    name: "Apple iPhone 11 128GB White (MQ233)",
    featureType: "New Arrival",
    originalPrice: "550",
    discountPrice: "",
    image: {
      url: "/images/Iphone-14-pro-white.png",
      altText: "Iphone-14-pro-white",
    },
  },
  {
    id: 10,
    name: "Apple iPhone 13 mini 128GB Pink (MLK23)",
    featureType: "New Arrival",
    originalPrice: "850",
    discountPrice: "",
    image: {
      url: "/images/Iphone-14-pro-pink.png",
      altText: "Iphone-14-pro-pink",
    },
  },
  {
    id: 11,
    name: "Apple iPhone 14 Pro 256GB Space Black (MQ0T3)",
    featureType: "Up Coming...",
    originalPrice: "N/A",
    discountPrice: "",
    image: {
      url: "/images/Iphone-14-pro-black.png",
      altText: "Iphone-14-pro-black",
    },
  },
  {
    id: 12,
    name: "Apple iPhone 14 Pro 256GB Silver (MQ103)",
    featureType: "Up Coming...",
    originalPrice: "1399",
    discountPrice: "",
    image: {
      url: "/images/Iphone-14-pro-silver.png",
      altText: "Iphone-14-pro-silver",
    },
  },
  {
    id: 13,
    name: "Apple iPhone 14 Pro 1TB Gold (MQ2V3)",
    featureType: "Up Coming...",
    originalPrice: "1600",
    discountPrice: "",
    image: {
      url: "/images/Iphone-14-pro-gold.png",
      altText: "Iphone-14-pro-gold",
    },
  },
  {
    id: 14,
    name: "Samsung Headphone Red",
    featureType: "Up Coming...",
    originalPrice: "299",
    discountPrice: "",
    image: {
      url: "/images/Headphones.png",
      altText: "samsung headphones",
    },
  },
]

// Computed properties
const filteredProducts = computed(() => {
  // Map Spanish tabs to English featureType
  const featureTypeMap = {
    'Nuevos': 'New Arrival',
    'Populares': 'BestSeller',
    'Próximamente': 'Up Coming...'
  }
  const featureType = featureTypeMap[value.value] || value.value
  return products.filter(item => item.featureType === featureType)
})

const productLength = computed(() => filteredProducts.value.length)

// Grid settings (dinámico basado en cantidad de productos)
const gridSettings = computed(() => ({
  rows: filteredProducts.value.length > 6 ? 2 : 1,
  fill: 'row'
}))

// Helper functions (exactas del original)
const tabletRowSize = (productLength) => {
  if (productLength >= 8) return 3
  if (productLength > 4 && productLength <= 7) return 2
  return 1
}

const mobileRowSize = (productLength) => {
  if (productLength >= 8) return 4
  if (productLength > 5 && productLength <= 7) return 3
  if (productLength > 3 && productLength <= 5) return 2
  return 1
}

// Breakpoints for tabs
const tabBreakpoints = {
  320: {
    slidesPerView: 2,
    spaceBetween: 4
  },
  480: {
    slidesPerView: 3,
    spaceBetween: 8
  },
  639: {
    slidesPerView: 3,
    spaceBetween: 12
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 16
  }
}

const productBreakpoints = computed(() => ({
  359: {
    slidesPerView: 1,
    spaceBetween: 16,
    grid: {
      rows: 4,
      fill: 'row'
    }
  },
  767: {
    slidesPerView: 2,
    spaceBetween: 16,
    grid: {
      rows: mobileRowSize(productLength.value),
      fill: 'row'
    }
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 16,
    grid: {
      rows: tabletRowSize(productLength.value),
      fill: 'row'
    }
  }
}))

// Methods
const updateNavState = () => {
  if (!swiperInstance.value) return
  canGoPrev.value = !swiperInstance.value.isBeginning
  canGoNext.value = !swiperInstance.value.isEnd
}

const onSwiperInit = (swiper) => {
  swiperInstance.value = swiper
  // Actualizar estado inicial
  updateNavState()
  // Escuchar eventos de cambio de slide
  swiper.on('slideChange', updateNavState)
  swiper.on('reachBeginning', updateNavState)
  swiper.on('reachEnd', updateNavState)
}

onMounted(() => {
  // Si Swiper ya está montado, actualizar estado
  if (swiperInstance.value) updateNavState()
})

onBeforeUnmount(() => {
  if (swiperInstance.value) {
    swiperInstance.value.off('slideChange', updateNavState)
    swiperInstance.value.off('reachBeginning', updateNavState)
    swiperInstance.value.off('reachEnd', updateNavState)
  }
})

const handleTabClick = (tab) => {
  value.value = tab

  // Replicar el comportamiento de activeTab del original
  const tabs = document.querySelectorAll('.productTag .tab')
  tabs.forEach(item => {
    item.classList.remove('activeTab')
  })
  event.target.classList.add('activeTab')
}

// Lifecycle (replicar useEffect del original)
onMounted(() => {
  const slickSlide = document.querySelectorAll('.productTag .tab')
  slickSlide.forEach((item) => {
    item.addEventListener('click', () => {
      // Remove active class if already exist
      const activeTab = document.querySelector('.activeTab')
      if (activeTab) {
        activeTab.classList.remove('activeTab')
      }
      // Add active class on clicked nav item
      item.classList.add('activeTab')
    })
  })
})
</script>

<style scoped>
/* Tab styles */
.activeTab {
  color: #000000;
  border-bottom: 2px solid #000000;
  font-weight: 600;
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
