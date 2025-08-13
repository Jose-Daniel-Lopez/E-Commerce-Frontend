<script setup lang="ts">
// =======================
// 📦 IMPORTS
// =======================
import { onMounted, ref, computed, watch } from 'vue'
import { useProductStore } from '@/stores/products'
import { useCategoriesStore } from '@/stores/categories'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import DualRangeSlider from '@/components/shared/DualRangeSlider.vue'
import { storeToRefs } from 'pinia'

// =======================
// 🧩 PROPS
// =======================
interface Props {
  categoryName: string
}
const props = defineProps<Props>()

// =======================
// 🏦 STORES & REFS
// =======================
const router = useRouter()
const productStore = useProductStore()
const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()

const { user } = storeToRefs(authStore)
const { wishlistProducts, wishlistLoading } = storeToRefs(wishlistStore)

// =======================
// 🧩 STATE
// =======================
// UI Controls
const showDebug = ref(false)
const currentPage = ref(1)
const sortBy = ref('name')
const brandSearchQuery = ref('')

// Mobile-specific state
const showMobileFilters = ref(false)
const showMobileSorting = ref(false)

// Filters
const collapsedFilters = ref({
  price: false,
  brand: false,
})

// Category Display
const categoryDisplayName = ref('')
const actualCategoryName = ref('')

// Price Range (consolidated)
const minValue = 0
const maxValue = 5000
const priceRange = ref<[number, number]>([0, 5000])

// =======================
// 🧮 COMPUTED PROPERTIES
// =======================
const itemsPerPage = 9

const filteredProducts = computed(() => {
  let filtered = [...productStore.products]

  // Price filter
  if (priceRange.value[0] > 0 || priceRange.value[1] < 5000) {
    filtered = filtered.filter(
      (product) =>
        product.basePrice >= priceRange.value[0] && product.basePrice <= priceRange.value[1]
    )
  }

  // Brand filter
  const selectedBrands = productStore.brands
    .filter((brand) => brand.checked)
    .map((brand) => brand.name)
  if (selectedBrands.length > 0) {
    filtered = filtered.filter((product) => selectedBrands.includes(product.brand))
  }

  // Sort
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
      filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
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
  if (!query || query.length < 2) return productStore.brands

  return productStore.brands
    .map((brand) => {
      const brandName = brand.name.toLowerCase()
      let score = 0
      if (brandName === query) score = 1000
      else if (brandName.startsWith(query)) score = 500 + (100 - query.length)
      else if (brandName.split(/\s+/).some((word) => word.startsWith(query))) score = 300 + (100 - query.length)
      else if (brandName.includes(query)) score = 100 + (100 - brandName.indexOf(query))
      return { brand, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ brand }) => brand)
})

const breadcrumbs = computed(() => [
  { label: 'catalog.title', to: '/catalog' },
  { label: categoryDisplayName.value },
])

// =======================
// 🛠️ UTILITY FUNCTIONS
// =======================
const getCategoryNameFromUrl = (urlName: string): string => {
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

// =======================
// ⚙️ METHODS
// =======================
const formatPrice = (price: number) => {
  return `$${price}`
}

const toggleFavorite = async (productId: number) => {
  console.log('🔵 [CATALOG] toggleFavorite called for product:', productId)

  if (!user.value || !user.value.id) {
    console.error('🔴 [CATALOG] User not authenticated')
    alert('Please log in to add products to your wishlist')
    return
  }

  const product = productStore.products.find(p => p.id === productId)
  if (!product) {
    console.error('🔴 [CATALOG] Product not found:', productId)
    alert('Product not found')
    return
  }

  try {
    if (!wishlistStore.wishlistId) {
      console.log('🟡 [CATALOG] Loading user wishlist...')
      await wishlistStore.fetchUserWishlist(user.value.id)
    }

    const isCurrentlyInWishlist = wishlistStore.isProductInWishlist(productId)
    console.log('🟡 [CATALOG] Product in wishlist before action:', isCurrentlyInWishlist)

    if (!isCurrentlyInWishlist) {
      console.log('🟡 [CATALOG] Adding product to wishlist...')
      const productData = {
        name: product.name,
        description: product.description || product.name,
        brand: product.brand || 'Unknown',
        isFeatured: product.isFeatured,
        basePrice: product.basePrice,
        totalStock: product.totalStock,
        imageUrl: product.imageUrl || undefined,
      }
      await wishlistStore.addProductToWishlist(productId, productData)
      console.log('✅ [CATALOG] Product added to wishlist')
    } else {
      console.log('🟡 [CATALOG] Removing product from wishlist...')
      await wishlistStore.removeProductFromWishlist(productId)
      console.log('✅ [CATALOG] Product removed from wishlist')
    }

    const isInWishlistAfter = wishlistStore.isProductInWishlist(productId)
    console.log('🟡 [CATALOG] Product in wishlist after action:', isInWishlistAfter)

  } catch (error) {
    console.error('🔴 [CATALOG] Error toggling favorite:', error)
    alert('Error updating wishlist: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

const goToProductDetails = (productId: number) => {
  console.log('🟢 [CATALOG] goToProductDetails called with productId:', productId)
  router
    .push({
      name: 'productDetails',
      params: {
        categoryName: props.categoryName,
        productId: productId.toString(),
      },
    })
    .then(() => {
      console.log('🟢 [CATALOG] Navigation successful')
    })
    .catch((error) => {
      console.error('🔴 [CATALOG] Navigation error:', error)
    })
}

const buyNow = (productId: number) => {
  goToProductDetails(productId)
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll to top on mobile for better UX
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const toggleFilter = (filterName: keyof typeof collapsedFilters.value) => {
  collapsedFilters.value[filterName] = !collapsedFilters.value[filterName]
}

const hasActiveFilters = () => {
  const priceFilterActive = priceRange.value[0] > 0 || priceRange.value[1] < 5000
  const brandFilterActive = productStore.brands.some((brand) => brand.checked)
  return priceFilterActive || brandFilterActive
}

const clearAllFilters = () => {
  priceRange.value = [0, 5000]
  productStore.brands.forEach((brand) => (brand.checked = false))
  currentPage.value = 1
  showMobileFilters.value = false // Close mobile filters after clearing
}

const clearBrandFilters = () => {
  productStore.brands.forEach((brand) => (brand.checked = false))
  currentPage.value = 1
}

// Mobile-specific methods
const openMobileFilters = () => {
  showMobileFilters.value = true
  document.body.style.overflow = 'hidden' // Prevent background scrolling
}

const closeMobileFilters = () => {
  showMobileFilters.value = false
  document.body.style.overflow = ''
}

const applyMobileFilters = () => {
  currentPage.value = 1
  closeMobileFilters()
}

// =======================
// 🔁 WATCHERS
// =======================
watch(
  () => props.categoryName,
  async (newCategoryName) => {
    if (newCategoryName) {
      actualCategoryName.value = getCategoryNameFromUrl(newCategoryName)
      categoryDisplayName.value = actualCategoryName.value
      currentPage.value = 1
      await productStore.fetchProductsByCategoryName(actualCategoryName.value, 0, itemsPerPage)
    }
  }
)

// =======================
// 🧪 LIFECYCLE HOOKS
// =======================
onMounted(async () => {
  if (categoriesStore.categories.length === 0) {
    await categoriesStore.fetchCategories()
  }

  actualCategoryName.value = getCategoryNameFromUrl(props.categoryName)
  categoryDisplayName.value = actualCategoryName.value

  await Promise.all([
    productStore.fetchProductsByCategoryName(actualCategoryName.value, currentPage.value - 1, itemsPerPage),
    productStore.fetchBrands(),
  ])

  if (authStore.user?.id) {
    try {
      await wishlistStore.fetchUserWishlist(authStore.user.id)
      console.log('🟢 [CATALOG] Wishlist loaded successfully')
    } catch (error) {
      console.error('🔴 [CATALOG] Error loading wishlist:', error)
    }
  }
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Breadcrumb -->
    <div class="pt-[85px] lg:pt-0 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      </div>
    </div>

    <!-- Debug Panel - Mobile optimized -->
    <div class="fixed bottom-4 right-4 z-50 max-w-[300px] sm:max-w-[420px] w-full">
      <div class="bg-yellow-50 border border-yellow-300 rounded-lg shadow-lg p-3 sm:p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="font-bold text-yellow-800 text-xs sm:text-sm">🛠️ Debug Panel</span>
          <button @click="showDebug = !showDebug" class="text-xs text-yellow-700 underline focus:outline-none">
            {{ showDebug ? 'Hide' : 'Show' }}
          </button>
        </div>
        <transition name="fade-debug">
          <div v-show="showDebug" class="text-xs text-yellow-900 space-y-2 max-h-40 overflow-y-auto">
            <div><b>User:</b> {{ user }}</div>
            <div><b>Wishlist ID:</b> {{ wishlistStore.wishlistId }}</div>
            <div><b>Wishlist Count:</b> {{ wishlistProducts.length }}</div>
            <div><b>Wishlist Product IDs:</b> {{ wishlistProducts.map(p => p.id).join(', ') }}</div>
            <div><b>Current Page:</b> {{ currentPage }} / {{ totalPages }}</div>
            <div><b>Items Per Page:</b> {{ itemsPerPage }}</div>
            <div><b>Filtered Products:</b> {{ filteredProducts.length }}</div>
            <div><b>Brands (checked):</b> {{ productStore.brands.filter(b => b.checked).map(b => b.name).join(', ') }}</div>
            <div><b>Price Range:</b> ${{ priceRange[0] }} - ${{ priceRange[1] }}</div>
            <div><b>Sort By:</b> {{ sortBy }}</div>
            <div><b>Category:</b> {{ actualCategoryName }}</div>
            <div><b>Category Display:</b> {{ categoryDisplayName }}</div>
            <button
              @click="console.log('🧪 [TEST] Debug button clicked!'); goToProductDetails(76)"
              class="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Test Navigation (ID: 76)
            </button>
          </div>
        </transition>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
      <!-- Mobile Header with Filter/Sort buttons -->
      <div class="lg:hidden mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="font-srProDisplay text-lg sm:text-xl font-semibold text-black">{{ categoryDisplayName }}</h1>
            <p class="font-srProDisplay text-sm text-gray-600">{{ filteredProducts.length }} products found</p>
          </div>
        </div>

        <!-- Mobile Filter/Sort Controls -->
        <div class="flex gap-3">
          <button
            @click="openMobileFilters"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[48px]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            <span v-if="hasActiveFilters()" class="ml-1 bg-black text-white text-xs rounded-full px-2 py-0.5">
              Active
            </span>
          </button>

          <button
            @click="showMobileSorting = !showMobileSorting"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[48px]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5v6m0 0V9a2 2 0 012-2h4a2 2 0 012 2v2M8 11l4 4 4-4" />
            </svg>
            Sort
          </button>
        </div>

        <!-- Mobile Sort Dropdown -->
        <div v-if="showMobileSorting" class="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <button
            v-for="option in [
              { value: 'name', label: 'Name A-Z' },
              { value: 'name-desc', label: 'Name Z-A' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'rating', label: 'By rating' }
            ]"
            :key="option.value"
            @click="sortBy = option.value; showMobileSorting = false"
            :class="[
              'w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors min-h-[48px] flex items-center',
              sortBy === option.value ? 'bg-gray-100 font-medium' : ''
            ]"
          >
            {{ option.label }}
            <svg v-if="sortBy === option.value" class="w-5 h-5 ml-auto text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Desktop and Mobile Layout -->
      <div class="flex gap-8">
        <!-- Desktop Sidebar Filters -->
        <div class="hidden lg:block w-64 flex-shrink-0">
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
            <div v-show="!collapsedFilters.price" class="flex flex-col space-y-4 transition-all duration-200">
              <!-- Dual Range Slider Component -->
              <DualRangeSlider
                :min="minValue"
                :max="maxValue"
                :step="50"
                v-model="priceRange"
                :format-value="(value) => `$${value}`"
              />
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="mb-6">
            <div class="flex items-center justify-between border-b border-[#EBEBEB] mb-4 pb-3">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Brand</h3>
              <div class="flex items-center space-x-2">
                <button
                  v-if="productStore.brands.some(brand => brand.checked)"
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
                  <label :for="'brand-' + brand.name" class="ml-3 flex-1 flex items-center justify-between">
                    <span class="text-sm font-srProDisplay text-gray-1000">{{ brand.name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Filters Summary -->
          <div v-if="hasActiveFilters()" class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-srProDisplay text-sm font-semibold text-gray-800 mb-3">Active Filters</h4>
            <div class="space-y-2">
              <div v-if="priceRange[0] > 0 || priceRange[1] < 5000" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Price:</span>
                <span class="font-medium">${{ priceRange[0] }} - ${{ priceRange[1] }}</span>
              </div>
              <div v-if="productStore.brands.some(brand => brand.checked)" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Brands:</span>
                <span class="font-medium">{{ productStore.brands.filter(brand => brand.checked).map(brand => brand.name).join(', ') }}</span>
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
                <span class="font-medium">{{ productStore.products.length }}</span>
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
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Desktop Header -->
          <div class="hidden lg:flex items-center justify-between mb-6">
            <div>
              <h1 class="font-srProDisplay text-xl font-semibold text-black">{{ categoryDisplayName }}</h1>
              <p class="font-srProDisplay text-gray-600">{{ filteredProducts.length }} products found</p>
            </div>
            <div class="flex items-center space-x-4">
              <button
                v-if="hasActiveFilters()"
                @click="clearAllFilters"
                class="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
                type="button"
              >
                Clear All Filters
              </button>
              <select v-model="sortBy" class="font-srProDisplay border border-[#EBEBEB] rounded-md w-70 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500">
                <option value="name">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">By rating</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="productStore.loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            <span class="ml-3 text-gray-600">Loading products...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="productStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2 mb-8">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ productStore.error }}</span>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
            <div class="flex justify-center mb-4">
              <div class="bg-gray-100 p-6 rounded-full">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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

          <!-- Products Grid - Mobile optimized -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              class="relative h-auto rounded-lg bg-[#f6f6f6] px-4 py-4 duration-300 hover:scale-[1.01] hover:shadow-md md:h-[410px] lg:px-4"
            >
              <div class="absolute top-3 right-3 z-10">
                <button
                  @click="toggleFavorite(product.id)"
                  :disabled="wishlistLoading"
                  class="w-8 h-8 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                  type="button"
                  aria-label="Toggle favorite"
                >
                  <svg
                    v-if="!wishlistStore.isProductInWishlist(product.id)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    class="w-6 h-6"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <svg
                    v-else
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    class="w-6 h-6 text-red-600"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div class="flex flex-col h-full">
                <div class="flex items-center justify-center mb-3">
                  <div class="h-[140px] w-full">
                    <img
                      :src="product.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp'"
                      :alt="product.name"
                      class="w-full h-full object-cover rounded-md"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div class="flex flex-col flex-1 gap-3">
                  <div class="flex flex-col gap-2">
                    <div class="h-[48px]">
                      <a href="#" @click.prevent="goToProductDetails(product.id)" class="block cursor-pointer">
                        <h3 class="text-center font-srProDisplay text-base font-medium hover:text-indigo-600 transition-colors line-clamp-2">
                          {{ product.name }}
                        </h3>
                      </a>
                    </div>
                    <div class="flex justify-center items-center gap-2 mb-1">
                      <span class="flex items-center">
                        <template v-for="i in 5" :key="i">
                          <svg
                            class="w-4 h-4"
                            :class="i <= Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 0 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                        </template>
                        <span class="ml-2 text-xs text-gray-500">{{ (product.rating ?? 0).toFixed(1) }}</span>
                      </span>
                    </div>
                    <div class="flex justify-center items-center gap-2">
                      <span class="font-figtree text-lg font-semibold">{{ formatPrice(product.basePrice) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-center mt-6 pt-2">
                    <button
                      @click="buyNow(product.id)"
                      class="w-full max-w-[160px] h-[40px] bg-black text-white text-sm font-medium rounded hover:bg-[#1a1a1a] transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile-optimized Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center space-x-1 lg:space-x-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="p-2 lg:p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <!-- Show fewer page numbers on mobile -->
            <template v-if="totalPages <= 5">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium min-w-[44px] min-h-[44px] flex items-center justify-center',
                  page === currentPage ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                {{ page }}
              </button>
            </template>

            <template v-else>
              <button
                v-if="currentPage > 2"
                @click="goToPage(1)"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                1
              </button>
              <span v-if="currentPage > 3" class="px-2 py-2 text-gray-500">...</span>

              <button
                v-for="page in [currentPage - 1, currentPage, currentPage + 1].filter(p => p > 0 && p <= totalPages)"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium min-w-[44px] min-h-[44px] flex items-center justify-center',
                  page === currentPage ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                {{ page }}
              </button>

              <span v-if="currentPage < totalPages - 2" class="px-2 py-2 text-gray-500">...</span>
              <button
                v-if="currentPage < totalPages - 1"
                @click="goToPage(totalPages)"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                {{ totalPages }}
              </button>
            </template>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="p-2 lg:p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filters Modal -->
    <div
      v-if="showMobileFilters"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
      @click="closeMobileFilters"
    >
      <div
        class="bg-white h-full w-full max-w-sm ml-auto flex flex-col overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            @click="closeMobileFilters"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Filters Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <!-- Price Filter -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Price</h3>
              <button
                @click="toggleFilter('price')"
                class="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
              >
                <svg
                  class="w-4 h-4 text-gray-600 transition-transform duration-200"
                  :class="{ 'rotate-180': collapsedFilters.price }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div v-show="!collapsedFilters.price" class="flex flex-col space-y-4">
              <DualRangeSlider
                :min="minValue"
                :max="maxValue"
                :step="50"
                v-model="priceRange"
                :format-value="(value) => `$${value}`"
              />
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Brand</h3>
              <div class="flex items-center space-x-2">
                <button
                  v-if="productStore.brands.some(brand => brand.checked)"
                  @click="clearBrandFilters"
                  class="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  type="button"
                >
                  Clear
                </button>
                <button
                  @click="toggleFilter('brand')"
                  class="p-1 hover:bg-gray-100 rounded transition-colors"
                  type="button"
                >
                  <svg
                    class="w-4 h-4 text-gray-600 transition-transform duration-200"
                    :class="{ 'rotate-180': collapsedFilters.brand }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            <div v-show="!collapsedFilters.brand">
              <div class="flex items-center justify-start gap-2 bg-[#f5f5f5] p-3 rounded-lg mb-4">
                <v-icon name="fa-search" scale="1.2" class="text-gray-400" />
                <input
                  v-model="brandSearchQuery"
                  class="w-full bg-[#f5f5f5] p-0.5 font-srProDisplay text-sm font-medium text-black outline-none"
                  type="search"
                  placeholder="Search brands"
                />
              </div>
              <div class="space-y-4 max-h-64 overflow-y-auto">
                <div v-for="brand in filteredBrands" :key="brand.name" class="flex items-center">
                  <input
                    :id="'mobile-brand-' + brand.name"
                    type="checkbox"
                    v-model="brand.checked"
                    class="w-5 h-5 accent-black rounded"
                  />
                  <label :for="'mobile-brand-' + brand.name" class="ml-3 flex-1 text-sm font-srProDisplay text-gray-900 py-2">
                    {{ brand.name }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Filters -->
          <div v-if="hasActiveFilters()" class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-srProDisplay text-sm font-semibold text-gray-800 mb-3">Active Filters</h4>
            <div class="space-y-2">
              <div v-if="priceRange[0] > 0 || priceRange[1] < 5000" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Price:</span>
                <span class="font-medium">${{ priceRange[0] }} - ${{ priceRange[1] }}</span>
              </div>
              <div v-if="productStore.brands.some(brand => brand.checked)" class="text-sm">
                <span class="text-gray-600">Brands:</span>
                <div class="mt-1 flex flex-wrap gap-1">
                  <span
                    v-for="brand in productStore.brands.filter(brand => brand.checked)"
                    :key="brand.name"
                    class="inline-block bg-black text-white text-xs px-2 py-1 rounded"
                  >
                    {{ brand.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-gray-200 space-y-3">
          <button
            v-if="hasActiveFilters()"
            @click="clearAllFilters"
            class="w-full py-3 text-center text-sm text-red-600 hover:text-red-800 transition-colors border border-red-200 rounded-lg hover:bg-red-50"
          >
            Clear All Filters
          </button>
          <button
            @click="applyMobileFilters"
            class="w-full py-4 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Show {{ filteredProducts.length }} Results
          </button>
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

.fade-debug-enter-active,
.fade-debug-leave-active {
  transition: opacity 0.2s;
}
.fade-debug-enter-from,
.fade-debug-leave-to {
  opacity: 0;
}

button:focus {
  outline: none;
  box-shadow: none;
}

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

.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background-color: white;
  cursor: pointer;
  position: relative;
}
.custom-checkbox:hover {
  border-color: #9ca3af;
}
.custom-checkbox:checked {
  background-color: #000;
  border-color: #000;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M13.854 3.646L6.354 11.146a.5.5 0 01-.708 0L2.146 7.646a.5.5 0 11.708-.708L6 10.293l7.146-7.147a.5.5 0 01.708.708z'/%3e%3c/svg%3e");
  background-size: 8px 8px;
  background-position: center;
  background-repeat: no-repeat;
}

/* Mobile overlay scroll prevention */
body.modal-open {
  overflow: hidden;
}
</style>
