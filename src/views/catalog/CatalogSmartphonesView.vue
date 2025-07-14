<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useProductsStore } from '@/stores/products'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'


const productsStore = useProductsStore()

// State
const currentPage = ref(1)
const priceRange = ref({ min: 1200, max: 4000 })
const sortBy = ref('rating')
const favoriteProducts = ref(new Map<number, boolean>())

// Search states for filters
const brandSearchQuery = ref('')
const memorySearchQuery = ref('')

// Filter collapse states
const collapsedFilters = ref({
  price: false,
  brand: false,
  memory: false,
  protectionClass: false,
  screenDiagonal: false,
  screenType: false,
  batteryCapacity: false
})

// Watch for price range changes to ensure correct logic
watch(
  () => priceRange.value.min,
  (newMin: number) => {
    if (newMin > priceRange.value.max) {
      priceRange.value.min = priceRange.value.max;
    } else if (newMin < 0) {
      priceRange.value.min = 0;
    }
  }
)
watch(
  () => priceRange.value.max,
  (newMax: number) => {
    if (newMax < priceRange.value.min) {
      priceRange.value.max = priceRange.value.min;
    } else if (newMax > 5000) {
      priceRange.value.max = 5000;
    }
  }
)

// Computed
const totalPages = computed(() => Math.ceil(mockProducts.length / 9))

const filteredBrands = computed(() => {
  const query = brandSearchQuery.value?.trim().toLowerCase()

  // Return all brands if query is empty or too short
  if (!query || query.length < 2) return productsStore.brands

  return productsStore.brands
    .map(brand => {
      const brandName = brand.name.toLowerCase()
      let score = 0

      // Exact match (highest score)
      if (brandName === query) score = 1000
      // Starts with query
      else if (brandName.startsWith(query)) score = 500 + (100 - query.length)
      // Word starts with query
      else if (brandName.split(/\s+/).some(word => word.startsWith(query))) score = 300 + (100 - query.length)
      // Contains query
      else if (brandName.includes(query)) score = 100 + (100 - brandName.indexOf(query))

      return { brand, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ brand }) => brand)
})

// Filtered memory options based on search query
const filteredMemoryOptions = computed(() => {
  const query = memorySearchQuery.value?.trim().toLowerCase()

  // Return all memories if query is empty or too short
  if (!query || query.length < 2) return productsStore.memories

  return productsStore.memories
    .map(memory => {
      const memoryValue = memory.value.toLowerCase()
      let score = 0

      // Exact match (highest score)
      if (memoryValue === query) score = 1000
      // Starts with query
      else if (memoryValue.startsWith(query)) score = 500 + (100 - query.length)
      // Contains query
      else if (memoryValue.includes(query)) score = 100 + (100 - memoryValue.indexOf(query))

      return { memory, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ memory }) => memory)
})

// Breadcrumb config
const breadcrumbs = ref([
  { label: 'catalog.title', to: '/catalog' },
  { label: 'smartphones.title' }
])

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: 'Apple iPhone 14 Pro 512GB Gold (MQ233)',
    price: 1437,
    image: '/images/Iphone-14-pro-Gold.png',
    favorite: false
  },
  {
    id: 2,
    name: 'Apple iPhone 11 128GB White (MQ233)',
    price: 510,
    image: '/images/Apple-phone.png',
    favorite: false
  },
  {
    id: 3,
    name: 'Apple iPhone 11 128GB White (MQ233)',
    price: 550,
    image: '/images/Apple-phone.png',
    favorite: false
  },
  {
    id: 4,
    name: 'Apple iPhone 14 Pro 1TB Gold (MQ2YJ)',
    price: 1490,
    image: '/images/Iphone-14-pro-Gold.png',
    favorite: false
  },
  {
    id: 5,
    name: 'Apple iPhone 14 Pro 1TB Gold (MQ2YJ)',
    price: 1399,
    image: '/images/Iphone-14-pro-Gold.png',
    favorite: false
  },
  {
    id: 6,
    name: 'Apple iPhone 14 Pro 128GB Deep Purple (MQ0G3)',
    price: 1600,
    image: '/images/Iphone-14-pro-purple.png',
    favorite: false
  },
  {
    id: 7,
    name: 'Apple iPhone 13 mini 128GB Pink (MLK23)',
    price: 850,
    image: '/images/Iphone-14-pro-pink.png',
    favorite: false
  },
  {
    id: 8,
    name: 'Apple iPhone 14 Pro 256GB Space Black (MQ0T3)',
    price: 1399,
    image: '/images/Iphone-14-pro-black.png',
    favorite: false
  },
  {
    id: 9,
    name: 'Apple iPhone 14 Pro 256GB Silver (MQ103)',
    price: 1399,
    image: '/images/Iphone-14-pro-silver.png',
    favorite: false
  }
]

onMounted(async () => {
  // Load products, brands and memories when component mounts
  await Promise.all([
    productsStore.fetchProducts(),
    productsStore.fetchBrands(),
    productsStore.fetchMemories()
  ])
})

// Methods
const formatPrice = (price: number) => {
  return `$${price}`
}

const toggleFavorite = (productId: number) => {
  const isFavorite = favoriteProducts.value.get(productId) || false
  favoriteProducts.value.set(productId, !isFavorite)
}


import { useRouter } from 'vue-router'
const router = useRouter()

const goToProductDetails = (productId: number) => {
  router.push({ name: 'productDetails', params: { productId } }).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }).catch(error => {
    console.error('Navigation error:', error)
  })
}

const buyNow = (productId: number) => {
  goToProductDetails(productId)
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const toggleFilter = (filterName: keyof typeof collapsedFilters.value) => {
  collapsedFilters.value[filterName] = !collapsedFilters.value[filterName]
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Breadcrumb -->
    <div class="pt-[85px] lg:pt-0 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-8">
        <!-- Sidebar Filters -->
        <div class="w-64 flex-shrink-0">
          <!-- Price Filter -->
          <div class="mb-6">
            <div class="flex items-center justify-between border-b border-[#EBEBEB] mb-4 pb-3">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Price</h3>
              <button
                @click="toggleFilter('price')"
                class="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
                aria-label="Toggle price filter"
              >
                <svg
                  class="w-4 h-4 text-gray-600 transition-transform duration-200"
                  :class="{ 'rotate-180': collapsedFilters.price }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div v-show="!collapsedFilters.price" class="flex flex-col space-y-4 transition-all duration-200">
              <div class="flex items-center space-x-4">
                <div class="flex-1">
                  <label class="text-xs font-srProDisplay text-gray-500 mt-1 block mb-2">From</label>
                  <input type="number" v-model="priceRange.min" placeholder="1200"
                    class="w-full px-2 py-2 text-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <span class="text-gray-200 font-srProDisplay mt-6"> — </span>
                <div class="flex-1">
                  <label class="text-xs text-right font-srProDisplay text-gray-500 mt-1 block mb-2">To</label>
                  <input type="number" v-model="priceRange.max" placeholder="1200"
                    class="w-full py-2 text-right text-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>

              <!-- Dual Range Slider -->
              <div class="relative px-2">
                <div class="relative h-1 bg-gray-300 rounded-full">
                  <!-- Progress bar -->
                  <div
                    class="absolute h-1 bg-black rounded-full"
                    :style="{
                      left: ((priceRange.min / 5000) * 100) + '%',
                      width: (((priceRange.max - priceRange.min) / 5000) * 100) + '%'
                    }"
                  ></div>

                  <!-- Min range input -->
                  <input
                    type="range"
                    v-model="priceRange.min"
                    :min="0"
                    :max="5000"
                    step="50"
                    class="absolute w-full h-1 appearance-none bg-transparent pointer-events-none slider-thumb-min"
                  >

                  <!-- Max range input -->
                  <input
                    type="range"
                    v-model="priceRange.max"
                    :min="0"
                    :max="5000"
                    step="50"
                    class="absolute w-full h-1 appearance-none bg-transparent pointer-events-none slider-thumb-max"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="mb-6">
            <div class="flex items-center justify-between border-b border-[#EBEBEB] mb-4 pb-3">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Brand</h3>
              <button
                @click="toggleFilter('brand')"
                class="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
                aria-label="Toggle brand filter"
              >
                <svg
                  class="w-4 h-4 text-gray-600 transition-transform duration-200"
                  :class="{ 'rotate-180': collapsedFilters.brand }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div v-show="!collapsedFilters.brand" class="transition-all duration-200">
              <!-- Search bar for brands -->
              <div class="flex items-center justify-start gap-2 bg-[#f5f5f5] p-3 rounded-lg mb-4">
                <v-icon name="fa-search" scale="1.2" class="text-gray-400" />
                <input
                  v-model="brandSearchQuery"
                  class="w-full bg-[#f5f5f5] p-0.5 font-srProDisplay text-sm font-medium text-black outline-none"
                  type="search"
                  placeholder="Search"
                />
              </div>
              <div class="space-y-3 max-h-64 overflow-y-auto">
                <div v-for="brand in filteredBrands" :key="brand.name" class="flex items-center">
                  <input :id="'brand-' + brand.name" type="checkbox" v-model="brand.checked"
                    class="custom-checkbox focus:ring-1 focus:ring-gray-400">
                  <label :for="'brand-' + brand.name" class="ml-3 flex-1 flex items-center justify-between">
                    <span class="text-sm font-srProDisplay text-gray-1000">{{ brand.name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Built-in Memory Filter -->
          <div class="mb-6">
            <div class="flex items-center justify-between border-b border-[#EBEBEB] mb-4 pb-3">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Built-in Memory</h3>
              <button
                @click="toggleFilter('memory')"
                class="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
                aria-label="Toggle memory filter"
              >
                <svg
                  class="w-4 h-4 text-gray-600 transition-transform duration-200"
                  :class="{ 'rotate-180': collapsedFilters.memory }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div v-show="!collapsedFilters.memory" class="transition-all duration-200">
              <!-- Search bar for memory options -->
              <div class="flex items-center justify-start gap-2 bg-[#f5f5f5] p-3 rounded-lg mb-4">
                <v-icon name="fa-search" scale="1.2" class="text-gray-400" />
                <input
                  v-model="memorySearchQuery"
                  class="w-full bg-[#f5f5f5] p-0.5 font-srProDisplay text-sm font-medium text-black outline-none"
                  type="search"
                  placeholder="Search"
                />
              </div>
              <div class="space-y-3 max-h-48 overflow-y-auto">
                <div v-for="memory in filteredMemoryOptions" :key="memory.value" class="flex items-center">
                  <input :id="'memory-' + memory.value" type="checkbox" v-model="memory.checked"
                    class="custom-checkbox focus:ring-1 focus:ring-gray-400">
                  <label :for="'memory-' + memory.value" class="ml-3 flex-1 flex items-center justify-between">
                    <span class="text-sm font-srProDisplay text-gray-1000">{{ memory.value }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>


          <!-- Additional Filters -->
          <div class="mb-6">
            <div class="flex items-center justify-between border-b border-[#EBEBEB] mb-4 pb-3">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Protection class</h3>
              <button
                @click="toggleFilter('protectionClass')"
                class="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
                aria-label="Toggle protection class filter"
              >
                <svg
                  class="w-4 h-4 text-gray-600 transition-transform duration-200"
                  :class="{ 'rotate-180': collapsedFilters.protectionClass }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div
              v-show="!collapsedFilters.protectionClass"
              class="transition-all duration-200"
            >
              <div class="text-sm font-srProDisplay text-gray-500">No options available</div>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex items-center justify-between border-b border-[#EBEBEB] mb-4 pb-3">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Screen diagonal</h3>
              <button
                @click="toggleFilter('screenDiagonal')"
                class="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
                aria-label="Toggle screen diagonal filter"
              >
                <svg
                  class="w-4 h-4 text-gray-600 transition-transform duration-200"
                  :class="{ 'rotate-180': collapsedFilters.screenDiagonal }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div
              v-show="!collapsedFilters.screenDiagonal"
              class="transition-all duration-200"
            >
              <div class="text-sm font-srProDisplay text-gray-500">No options available</div>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex items-center justify-between border-b border-[#EBEBEB] mb-4 pb-3">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Screen type</h3>
              <button
                @click="toggleFilter('screenType')"
                class="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
                aria-label="Toggle screen type filter"
              >
                <svg
                  class="w-4 h-4 text-gray-600 transition-transform duration-200"
                  :class="{ 'rotate-180': collapsedFilters.screenType }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div
              v-show="!collapsedFilters.screenType"
              class="transition-all duration-200"
            >
              <div class="text-sm font-srProDisplay text-gray-500">No options available</div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between border-b border-[#EBEBEB] mb-4 pb-3">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Battery capacity</h3>
              <button
                @click="toggleFilter('batteryCapacity')"
                class="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
                aria-label="Toggle battery capacity filter"
              >
                <svg
                  class="w-4 h-4 text-gray-600 transition-transform duration-200"
                  :class="{ 'rotate-180': collapsedFilters.batteryCapacity }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div
              v-show="!collapsedFilters.batteryCapacity"
              class="transition-all duration-200"
            >
              <div class="text-sm font-srProDisplay text-gray-500">No options available</div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Header with product count and sorting -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="font-srProDisplay text-xl font-semibold text-black">Selected Products</h1>
              <p class="font-srProDisplay text-gray-600">{{ mockProducts.length }} products found</p>
            </div>
            <div class="flex items-center">
              <select v-model="sortBy" class="font-srProDisplay border border-[#EBEBEB] rounded-md w-70 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500">
                <option value="rating">By rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div
              v-for="product in mockProducts"
              :key="product.id"
              class="relative h-auto rounded-[9px] bg-[#f6f6f6] px-3 py-6 duration-500 hover:scale-[1.02] hover:shadow-md md:h-[435px] md:px-4"
            >
              <!-- Favorite Button -->
              <div class="absolute top-4 right-4 z-10">
                <button
                  @click="toggleFavorite(product.id)"
                  class="w-6 h-6 text-gray-600 hover:text-red-600 transition-colors"
                  type="button"
                  aria-label="Toggle favorite"
                >
                  <svg
                    v-if="!favoriteProducts.get(product.id)"
                    class="w-6 h-6 text-gray-600 hover:text-red-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-6 h-6 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div class="flex flex-col h-full">
                <!-- Product Image -->
                <div class="flex items-center justify-center mb-6">
                  <div class="h-[104px] w-[104px] md:h-[160px] md:w-[160px]">
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div class="flex flex-col flex-1 gap-6">
                  <div class="flex flex-col gap-4">
                    <!-- Product Name -->
                    <div class="h-[75px] sm:h-[50px]">
                    <a
                      href="#"
                      @click.prevent="goToProductDetails(product.id)"
                      class="block cursor-pointer"
                    >
                      <h3 class="text-center font-srProDisplay text-base font-medium hover:text-indigo-600 transition-colors line-clamp-2">
                        {{ product.name.length <= 40 ? product.name : `${product.name.slice(0, 40)}...` }}
                      </h3>
                    </a>
                    </div>

                    <!-- Product Price -->
                    <div class="flex justify-center items-center gap-2">
                      <span class="font-figtree text-xl font-semibold">
                        {{ formatPrice(product.price) }}
                      </span>
                    </div>
                  </div>

                  <!-- Buy Button -->
                  <div class="flex items-center justify-center mt-auto">
                    <button
                      @click="buyNow(product.id)"
                      class="w-[183px] h-[48px] bg-black text-white text-sm font-medium rounded hover:bg-[#1a1a1a] transition-colors"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-center space-x-2">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
              class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                page === currentPage
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              ]">
              {{ page }}
            </button>

            <span class="px-3 py-2 text-gray-500">...</span>
            <button class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">12</button>

            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
              class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

/* Avoid that annoying tailwind blue outline */
button:focus {
  outline: none;
  box-shadow: none;
}

/* Custom scrollbar for filter sections */
.overflow-y-auto::-webkit-scrollbar {
  width: 2px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #000;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #222;
}

/* Smooth transitions for interactive elements */
.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background-color: white;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
}

/* Hover state */
.custom-checkbox:hover {
  border-color: #9ca3af;
}

/* Checked state */
.custom-checkbox:checked {
  background-color: #000000;
  border-color: #000000;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M13.854 3.646L6.354 11.146a.5.5 0 01-.708 0L2.146 7.646a.5.5 0 11.708-.708L6 10.293l7.146-7.147a.5.5 0 01.708.708z'/%3e%3c/svg%3e");
  background-size: 8px 8px;
  background-position: center;
  background-repeat: no-repeat;
}

/* Product card hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Price range slider styles - smaller thumbs */
.slider-thumb-min::-webkit-slider-thumb,
.slider-thumb-max::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #000000;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  pointer-events: all;
  position: relative;
  z-index: 10;
}

.slider-thumb-min::-moz-range-thumb,
.slider-thumb-max::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #000000;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  pointer-events: all;
  border: none;
}

.slider-thumb-min::-webkit-slider-thumb:hover,
.slider-thumb-max::-webkit-slider-thumb:hover {
  background: #333333;
}

.slider-thumb-min::-moz-range-thumb:hover,
.slider-thumb-max::-moz-range-thumb:hover {
  background: #333333;
}

/* Enable pointer events for the thumbs */
.slider-thumb-min::-webkit-slider-thumb,
.slider-thumb-max::-webkit-slider-thumb {
  pointer-events: all;
}

.slider-thumb-min,
.slider-thumb-max {
  pointer-events: none;
}

.slider-thumb-min::-webkit-slider-thumb,
.slider-thumb-max::-webkit-slider-thumb {
  pointer-events: all;
}
</style>
