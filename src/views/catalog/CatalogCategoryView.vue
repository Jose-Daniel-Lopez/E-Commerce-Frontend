<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCategoriesStore } from '@/stores/categories'
import { useRouter } from 'vue-router'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'

// Define props
interface Props {
  categoryName: string
}

const props = defineProps<Props>()
const router = useRouter()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

// State
const currentPage = ref(1)
const priceRange = ref({ min: 0, max: 5000 })
const sortBy = ref('name')
const favoriteProducts = ref(new Map<number, boolean>())
const categoryDisplayName = ref('')
const actualCategoryName = ref('')

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
  batteryCapacity: false,
})

// Watch for price range changes to ensure correct logic
watch(
  () => priceRange.value.min,
  (newMin: number) => {
    if (newMin > priceRange.value.max) {
      priceRange.value.min = priceRange.value.max
    } else if (newMin < 0) {
      priceRange.value.min = 0
    }
  },
)
watch(
  () => priceRange.value.max,
  (newMax: number) => {
    if (newMax < priceRange.value.min) {
      priceRange.value.max = priceRange.value.min
    } else if (newMax > 5000) {
      priceRange.value.max = 5000
    }
  },
)

// Computed
const itemsPerPage = 9

// Filter and sort products based on current filter selections
const filteredProducts = computed(() => {
  let filtered = [...productsStore.products]

  // Price filter
  if (priceRange.value.min > 0 || priceRange.value.max < 5000) {
    filtered = filtered.filter((product) =>
      product.basePrice >= priceRange.value.min && product.basePrice <= priceRange.value.max
    )
  }

  // Brand filter - only show products from checked brands
  const selectedBrands = productsStore.brands
    .filter((brand) => brand.checked)
    .map((brand) => brand.name)
  if (selectedBrands.length > 0) {
    filtered = filtered.filter((product) => selectedBrands.includes(product.brand))
  }

  // Memory filter - only show products with checked memory options
  const selectedMemories = productsStore.memories
    .filter((memory) => memory.checked)
    .map((memory) => memory.value)
  if (selectedMemories.length > 0) {
    filtered = filtered.filter((product) => selectedMemories.includes(product.memory))
  }

  // Sort products
  switch (sortBy.value) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'price-low':
      filtered.sort((a, b) => a.basePrice - b.basePrice)
      break
    case 'price-high':
      filtered.sort((a, b) => b.basePrice - a.basePrice)
      break
    case 'rating':
      // For now, maintain original order as we don't have rating data
      break
  }

  return filtered
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const filteredBrands = computed(() => {
  const query = brandSearchQuery.value?.trim().toLowerCase()

  // Return all brands if query is empty or too short
  if (!query || query.length < 2) return productsStore.brands

  return productsStore.brands
    .map((brand) => {
      const brandName = brand.name.toLowerCase()
      let score = 0

      // Exact match (highest score)
      if (brandName === query) score = 1000
      // Starts with query
      else if (brandName.startsWith(query)) score = 500 + (100 - query.length)
      // Word starts with query
      else if (brandName.split(/\s+/).some((word) => word.startsWith(query)))
        score = 300 + (100 - query.length)
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
    .map((memory) => {
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

// Breadcrumb config - reactive
const breadcrumbs = computed(() => [
  { label: 'catalog.title', to: '/catalog' },
  { label: categoryDisplayName.value },
])

// Convert URL category name back to original category name
const getCategoryNameFromUrl = (urlName: string): string => {
  // Find the category in the store that matches the URL pattern
  const category = categoriesStore.categories.find((cat) => {
    const normalizedCatName = cat.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
    return normalizedCatName === urlName
  })

  return category ? category.name : urlName.replace(/-/g, ' ')
}

onMounted(async () => {
  // First ensure categories are loaded
  if (categoriesStore.categories.length === 0) {
    await categoriesStore.fetchCategories()
  }

  // Get the actual category name from the URL parameter
  actualCategoryName.value = getCategoryNameFromUrl(props.categoryName)
  categoryDisplayName.value = actualCategoryName.value

  // Load products, brands and memories
  await Promise.all([
    productsStore.fetchProductsByCategoryName(actualCategoryName.value, currentPage.value - 1, itemsPerPage),
    productsStore.fetchBrands(),
    productsStore.fetchMemories(),
  ])
})

// Watch for route changes
watch(() => props.categoryName, async (newCategoryName) => {
  if (newCategoryName) {
    actualCategoryName.value = getCategoryNameFromUrl(newCategoryName)
    categoryDisplayName.value = actualCategoryName.value
    currentPage.value = 1
    await productsStore.fetchProductsByCategoryName(actualCategoryName.value, 0, itemsPerPage)
  }
})

// Methods
const formatPrice = (price: number) => {
  return `$${price}`
}

const toggleFavorite = (productId: number) => {
  const isFavorite = favoriteProducts.value.get(productId) || false
  favoriteProducts.value.set(productId, !isFavorite)
}

const goToProductDetails = (productId: number) => {
  router
    .push({
      name: 'productDetails',
      params: {
        categoryName: props.categoryName,
        productId: productId.toString()
      }
    })
    .then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
    .catch((error) => {
      console.error('Navigation error:', error)
    })
}

const buyNow = (productId: number) => {
  goToProductDetails(productId)
}

const goToPage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Only fetch from API if we're on the first page and no filters are applied
    if (page === 1 && !hasActiveFilters()) {
      await productsStore.fetchProductsByCategoryName(actualCategoryName.value, 0, itemsPerPage)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const toggleFilter = (filterName: keyof typeof collapsedFilters.value) => {
  collapsedFilters.value[filterName] = !collapsedFilters.value[filterName]
}

// Helper function to check if any filters are active
const hasActiveFilters = () => {
  const priceFilterActive = priceRange.value.min > 0 || priceRange.value.max < 5000
  const brandFilterActive = productsStore.brands.some(brand => brand.checked)
  const memoryFilterActive = productsStore.memories.some(memory => memory.checked)

  return priceFilterActive || brandFilterActive || memoryFilterActive
}

// Clear all filters
const clearAllFilters = () => {
  priceRange.value = { min: 0, max: 5000 }
  productsStore.brands.forEach(brand => brand.checked = false)
  productsStore.memories.forEach(memory => memory.checked = false)
  currentPage.value = 1
}

// Clear brand filters
const clearBrandFilters = () => {
  productsStore.brands.forEach(brand => brand.checked = false)
  currentPage.value = 1
}

// Clear memory filters
const clearMemoryFilters = () => {
  productsStore.memories.forEach(memory => memory.checked = false)
  currentPage.value = 1
}

// Watch for filter changes to reset pagination
watch([priceRange, () => productsStore.brands, () => productsStore.memories, sortBy], () => {
  currentPage.value = 1
}, { deep: true })
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
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              v-show="!collapsedFilters.price"
              class="flex flex-col space-y-4 transition-all duration-200"
            >
              <div class="flex items-center space-x-4">
                <div class="flex-1">
                  <label class="text-xs font-srProDisplay text-gray-500 mt-1 block mb-2"
                    >From</label
                  >
                  <input
                    type="number"
                    v-model="priceRange.min"
                    placeholder="0"
                    class="w-full px-2 py-2 text-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <span class="text-gray-200 font-srProDisplay mt-6"> — </span>
                <div class="flex-1">
                  <label class="text-xs text-right font-srProDisplay text-gray-500 mt-1 block mb-2"
                    >To</label
                  >
                  <input
                    type="number"
                    v-model="priceRange.max"
                    placeholder="5000"
                    class="w-full py-2 text-right text-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Dual Range Slider -->
              <div class="relative px-2">
                <div class="relative h-1 bg-gray-300 rounded-full">
                  <!-- Progress bar -->
                  <div
                    class="absolute h-1 bg-black rounded-full"
                    :style="{
                      left: (priceRange.min / 5000) * 100 + '%',
                      width: ((priceRange.max - priceRange.min) / 5000) * 100 + '%',
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
                  />

                  <!-- Max range input -->
                  <input
                    type="range"
                    v-model="priceRange.max"
                    :min="0"
                    :max="5000"
                    step="50"
                    class="absolute w-full h-1 appearance-none bg-transparent pointer-events-none slider-thumb-max"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="mb-6">
            <div class="flex items-center justify-between border-b border-[#EBEBEB] mb-4 pb-3">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Brand</h3>
              <div class="flex items-center space-x-2">
                <button
                  v-if="productsStore.brands.some(brand => brand.checked)"
                  @click="clearBrandFilters"
                  class="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  type="button"
                  title="Clear brand filters"
                >
                  Clear
                </button>
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
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </div>
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
                  <input
                    :id="'brand-' + brand.name"
                    type="checkbox"
                    v-model="brand.checked"
                    class="custom-checkbox focus:ring-1 focus:ring-gray-400"
                  />
                  <label
                    :for="'brand-' + brand.name"
                    class="ml-3 flex-1 flex items-center justify-between"
                  >
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
              <div class="flex items-center space-x-2">
                <button
                  v-if="productsStore.memories.some(memory => memory.checked)"
                  @click="clearMemoryFilters"
                  class="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  type="button"
                  title="Clear memory filters"
                >
                  Clear
                </button>
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
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </div>
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
                <div
                  v-for="memory in filteredMemoryOptions"
                  :key="memory.value"
                  class="flex items-center"
                >
                  <input
                    :id="'memory-' + memory.value"
                    type="checkbox"
                    v-model="memory.checked"
                    class="custom-checkbox focus:ring-1 focus:ring-gray-400"
                  />
                  <label
                    :for="'memory-' + memory.value"
                    class="ml-3 flex-1 flex items-center justify-between"
                  >
                    <span class="text-sm font-srProDisplay text-gray-1000">{{ memory.value }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Filters Summary -->
          <div v-if="hasActiveFilters()" class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-srProDisplay text-sm font-semibold text-gray-800 mb-3">Active Filters</h4>
            <div class="space-y-2">
              <!-- Price Filter -->
              <div v-if="priceRange.min > 0 || priceRange.max < 5000" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Price:</span>
                <span class="font-medium">${{ priceRange.min }} - ${{ priceRange.max }}</span>
              </div>
              <!-- Brand Filters -->
              <div v-if="productsStore.brands.some(brand => brand.checked)" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Brands:</span>
                <span class="font-medium">{{ productsStore.brands.filter(brand => brand.checked).map(brand => brand.name).join(', ') }}</span>
              </div>
              <!-- Memory Filters -->
              <div v-if="productsStore.memories.some(memory => memory.checked)" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Memory:</span>
                <span class="font-medium">{{ productsStore.memories.filter(memory => memory.checked).map(memory => memory.value).join(', ') }}</span>
              </div>
            </div>
            <button
              @click="clearAllFilters"
              class="mt-3 text-xs text-red-600 hover:text-red-800 transition-colors underline"
              type="button"
            >
              Clear All Filters
            </button>
          </div>

          <!-- Quick Stats -->
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-srProDisplay text-sm font-semibold text-gray-800 mb-2">Summary</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Products:</span>
                <span class="font-medium">{{ productsStore.products.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Filtered Results:</span>
                <span class="font-medium">{{ filteredProducts.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Current Page:</span>
                <span class="font-medium">{{ currentPage }} of {{ totalPages }}</span>
              </div>
            </div>
          </div>
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
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
            <div v-show="!collapsedFilters.protectionClass" class="transition-all duration-200">
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
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
            <div v-show="!collapsedFilters.screenDiagonal" class="transition-all duration-200">
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
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
            <div v-show="!collapsedFilters.screenType" class="transition-all duration-200">
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
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
            <div v-show="!collapsedFilters.batteryCapacity" class="transition-all duration-200">
              <div class="text-sm font-srProDisplay text-gray-500">No options available</div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Header with product count and sorting -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="font-srProDisplay text-xl font-semibold text-black">{{ categoryDisplayName }}</h1>
              <p class="font-srProDisplay text-gray-600">
                {{ filteredProducts.length }} products found
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <!-- Clear Filters Button -->
              <button
                v-if="hasActiveFilters()"
                @click="clearAllFilters"
                class="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
                type="button"
              >
                Clear All Filters
              </button>
              <select
                v-model="sortBy"
                class="font-srProDisplay border border-[#EBEBEB] rounded-md w-70 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                <option value="name">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">By rating</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="productsStore.loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            <span class="ml-3 text-gray-600">Loading products...</span>
          </div>

          <!-- Error State -->
          <div
            v-else-if="productsStore.error"
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2 mb-8"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ productsStore.error }}</span>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
            <div class="flex justify-center mb-4">
              <div class="bg-gray-100 p-6 rounded-full">
                <svg
                  class="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p class="text-gray-600">
              {{ hasActiveFilters() ? 'No products match your current filters' : 'No products found in this category' }}
            </p>
            <button
              v-if="hasActiveFilters()"
              @click="clearAllFilters"
              class="mt-4 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>

          <!-- Products Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div
              v-for="product in paginatedProducts"
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
                  <svg v-else class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              <div class="flex flex-col h-full">
                <!-- Product Image -->
                <div class="flex items-center justify-center mb-6">
                  <div class="h-[104px] w-[104px] md:h-[160px] md:w-[160px]">
                    <img
                      :src="product.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp'"
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
                        <h3
                          class="text-center font-srProDisplay text-base font-medium hover:text-indigo-600 transition-colors line-clamp-2"
                        >
                          {{ product.name }}
                        </h3>
                      </a>
                    </div>

                    <!-- Product Price -->
                    <div class="flex justify-center items-center gap-2">
                      <span class="font-figtree text-xl font-semibold">
                        {{ formatPrice(product.basePrice) }}
                      </span>
                    </div>
                  </div>

                  <!-- Buy Button -->
                  <div class="flex items-center justify-center mt-auto">
                    <button
                      @click="buyNow(product.id)"
                      class="w-[183px] h-[48px] bg-black text-white text-sm font-medium rounded hover:bg-[#1a1a1a] transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center space-x-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>

            <button
              v-for="page in Math.min(totalPages, 5)"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                page === currentPage ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
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
