<script setup lang="ts">
// Debug panel state
const showDebug = ref(false)
import { onMounted, ref, computed, watch } from 'vue'
import { useProductStore } from '@/stores/products'
import { useCategoriesStore } from '@/stores/categories'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import DualRangeSlider from '@/components/shared/DualRangeSlider.vue'
import { storeToRefs } from 'pinia'
import api from '@/lib/axios'
import { useThemeClasses } from '@/composables/useThemeClasses'

const router = useRouter()
const productStore = useProductStore()
const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const { user } = storeToRefs(authStore)
const { wishlistLoading } = storeToRefs(wishlistStore)

// Theme classes
const {
  pageBackgroundClasses,
  textClasses,
  textSecondaryClasses,
  catalogFilterTitleClasses,
  catalogMobileFilterClasses,
  catalogSortSelectClasses,
  catalogDebugPanelClasses,
  catalogDebugTextClasses,
  catalogPaginationButtonClasses,
  catalogCheckboxClasses,
  catalogFilterLabelClasses,
  catalogClearFilterClasses,
  catalogFilterSummaryClasses,
} = useThemeClasses()

// =======================
// 📦 State
// =======================

/**
 * Current page number for server-side pagination.
 * 1-indexed for better UX (vs. 0-indexed).
 */
const currentPage = ref(1)

/**
 * Sort order for products.
 * Options: name, name-desc, price-low, price-high, rating.
 */
const sortBy = ref('name')

// Mobile-specific state
const showMobileFilters = ref(false)
const showMobileSorting = ref(false)

// =======================
// 🔍 Search States
// =======================

/**
 * Search query for filtering brand options in the sidebar.
 * Triggers fuzzy search when ≥2 characters.
 */
const brandSearchQuery = ref('')

// =======================
// 🧱 Filter Collapse States
// =======================

/**
 * Tracks which filter sections are collapsed.
 * Improves UX by allowing users to hide unused filters.
 */
const collapsedFilters = ref({
  price: false,
  brand: false,
  category: false,
})

// Price Range (consolidated)
const minValue = 0
const maxValue = 5000
const priceRange = ref<[number, number]>([0, 5000])

// =======================
// 🧮 Computed Properties
// =======================

/**
 * Number of items to display per page.
 * Matches the backend page size used in `fetchAllProducts`.
 */
const itemsPerPage = 20

/**
 * Available categories for the category filter.
 * Populated from the full catalog categories, not just current page products.
 */
const availableCategories = ref<{ name: string; checked: boolean }[]>([])

/**
 * Fetches all categories from the backend catalog.
 * This populates the category filter with all available categories.
 */
const fetchAllCategories = async () => {
  try {
    const response = await api.get('/categories')
    const categories = response.data._embedded?.categories || response.data || []

    console.log('🔍 [ALL PRODUCTS] Fetched categories from /categories endpoint:', categories.length)

    availableCategories.value = categories.map((category: { name?: string; id?: number }) => ({
      name: category.name || 'Unknown',
      checked: false
    }))

    console.log('🔍 [ALL PRODUCTS] Available categories for filter:', availableCategories.value.map(c => c.name))
  } catch (error) {
    console.error('🔴 [ALL PRODUCTS] Error fetching categories:', error)
    // Fallback: get categories from current products if API fails
    const categories = new Set<string>()
    productStore.products.forEach(product => {
      if (product.categoryName && product.categoryName !== 'Unknown') {
        categories.add(product.categoryName)
      }
    })
    availableCategories.value = Array.from(categories).map(name => ({
      name,
      checked: false
    }))
  }
}

/**
 * Returns products filtered by:
 * - Price range
 * - Selected brands
 * - Selected categories
 * Then sorts them based on `sortBy`.
 */
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

  // Category filter
  const selectedCategories = availableCategories.value
    .filter((category) => category.checked)
    .map((category) => category.name)
  if (selectedCategories.length > 0) {
    filtered = filtered.filter((product) =>
      product.categoryName && selectedCategories.includes(product.categoryName)
    )
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
      // Note: Rating data may be missing in initial fetch
      // Sorting by rating requires full product details
      filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      break
  }

  return filtered
})

/**
 * Paginates the filtered product list using server-side pagination
 * Returns only the items for the current page.
 */
const paginatedProducts = computed(() => {
  // For server-side pagination, we show the products as they come from the server
  return filteredProducts.value
})

/**
 * Total number of pages based on server pagination info.
 */
const totalPages = computed(() => productStore.pagination.totalPages || 1)

/**
 * Filters brand list based on search query with fuzzy matching.
 * Scores matches by relevance (exact > startsWith > contains).
 */
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

/**
 * Breadcrumb navigation path.
 * Shows the path to all products view.
 */
const breadcrumbs = computed(() => [
  { label: 'catalog.title', to: '/catalog' },
  { label: 'All Products' },
])

// =======================
// 🧪 Lifecycle & Effects
// =======================

onMounted(async () => {
  // Fetch all catalog categories for the filter (independent of current products)
  await fetchAllCategories()

  // Ensure categories are loaded for category filter
  if (categoriesStore.categories.length === 0) {
    await categoriesStore.fetchCategories()
  }

  // Load initial data: all products, brands, and wishlist
  await Promise.all([
    productStore.fetchAllProducts(currentPage.value, itemsPerPage), // Use 1-indexed page
    productStore.fetchBrands(),
  ])

  // Load user wishlist if authenticated
  if (authStore.user?.id) {
    try {
      await wishlistStore.fetchUserWishlist(authStore.user.id)
      console.log('🟢 [ALL PRODUCTS] Wishlist loaded successfully')
    } catch (error) {
      console.error('🔴 [ALL PRODUCTS] Error loading wishlist:', error)
    }
  }
})

// =======================
// ⚙️ Methods
// =======================

/**
 * Formats a price number into a localized currency string.
 * Currently uses a placeholder "$" — consider using `Intl.NumberFormat`.
 */
const formatPrice = (price: number) => {
  return `$${price}`
}

/**
 * Toggles product favorite status using the wishlist API.
 * Handles authentication, adds/removes from wishlist, and shows feedback.
 */
const toggleFavorite = async (productId: number) => {
  console.log('🔵 [ALL PRODUCTS] toggleFavorite called for product:', productId)

  // Check if user is authenticated
  if (!user.value || !user.value.id) {
    console.error('🔴 [ALL PRODUCTS] User not authenticated')
    alert('Please log in to add products to your wishlist')
    return
  }

  // Find the product to get its data
  const product = productStore.products.find(p => p.id === productId)
  if (!product) {
    console.error('🔴 [ALL PRODUCTS] Product not found:', productId)
    alert('Product not found')
    return
  }

  try {
    // Ensure wishlist is loaded
    if (!wishlistStore.wishlistId) {
      console.log('🟡 [ALL PRODUCTS] Loading user wishlist...')
      await wishlistStore.fetchUserWishlist(user.value.id)
    }

    const isCurrentlyInWishlist = wishlistStore.isProductInWishlist(productId)
    console.log('🟡 [ALL PRODUCTS] Product in wishlist before action:', isCurrentlyInWishlist)

    if (!isCurrentlyInWishlist) {
      console.log('🟡 [ALL PRODUCTS] Adding product to wishlist...')

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
      console.log('✅ [ALL PRODUCTS] Product added to wishlist')
    } else {
      console.log('🟡 [ALL PRODUCTS] Removing product from wishlist...')
      await wishlistStore.removeProductFromWishlist(productId)
      console.log('✅ [ALL PRODUCTS] Product removed from wishlist')
    }

    // Verify the state change
    const isInWishlistAfter = wishlistStore.isProductInWishlist(productId)
    console.log('🟡 [ALL PRODUCTS] Product in wishlist after action:', isInWishlistAfter)

  } catch (error) {
    console.error('🔴 [ALL PRODUCTS] Error toggling favorite:', error)
    alert('Error updating wishlist: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

/**
 * Navigates to the product details page.
 * Scrolls to top after navigation.
 */
const goToProductDetails = (productId: number) => {
  console.log('🟢 [ALL PRODUCTS] goToProductDetails called with productId:', productId)

  // Find the product to get its category for the route
  const product = productStore.products.find(p => p.id === productId)
  const categoryName = product?.categoryName?.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') || 'unknown'

  router
    .push({
      name: 'productDetails',
      params: {
        categoryName,
        productId: productId.toString()
      },
    })
    .then(() => {
      console.log('🟢 [ALL PRODUCTS] Navigation successful')
    })
    .catch((error) => {
      console.error('🔴 [ALL PRODUCTS] Navigation error:', error)
    })
}

/**
 * Shortcut to go directly to product details when "Buy Now" is clicked.
 */
const buyNow = (productId: number) => {
  goToProductDetails(productId)
}

/**
 * Navigates to a specific page with server-side pagination.
 * Fetches new data from the backend for that page.
 * Backend expects 1-indexed pages (page=1, page=2, etc.)
 */
const goToPage = async (page: number) => {
  console.log('🔵 [ALL PRODUCTS] goToPage called with page:', page, 'totalPages:', totalPages.value)

  if (page >= 1 && page <= totalPages.value) {
    console.log('🔵 [ALL PRODUCTS] Setting currentPage to:', page, 'and fetching data...')
    currentPage.value = page
    // Backend expects 1-indexed pagination, so pass the page as-is
    await productStore.fetchAllProducts(currentPage.value, itemsPerPage)

    // Ensure currentPage is synced with backend response
    // Backend returns 1-indexed page numbers, so use as-is
    const backendPage = productStore.pagination.page
    if (typeof backendPage === 'number') {
      currentPage.value = backendPage
    }
    console.log('🔵 [ALL PRODUCTS] Page navigation complete. Backend page:', backendPage, 'Frontend currentPage:', currentPage.value)

    // Scroll to top on mobile for better UX
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } else {
    console.warn('🔴 [ALL PRODUCTS] Invalid page requested:', page, 'valid range: 1 -', totalPages.value)
  }
}

/**
 * Toggles the visibility of a filter section.
 */
const toggleFilter = (filterName: keyof typeof collapsedFilters.value) => {
  collapsedFilters.value[filterName] = !collapsedFilters.value[filterName]
}

/**
 * Checks if any filters are currently active.
 * Used to show/hide "Clear All" buttons.
 */
const hasActiveFilters = () => {
  const priceFilterActive = priceRange.value[0] > 0 || priceRange.value[1] < 5000
  const brandFilterActive = productStore.brands.some((brand) => brand.checked)
  const categoryFilterActive = availableCategories.value.some((category) => category.checked)
  return priceFilterActive || brandFilterActive || categoryFilterActive
}

/**
 * Clears all applied filters and resets pagination.
 */
const clearAllFilters = () => {
  priceRange.value = [0, 5000]
  productStore.brands.forEach((brand) => (brand.checked = false))
  availableCategories.value.forEach((category) => (category.checked = false))
  currentPage.value = 1
  showMobileFilters.value = false // Close mobile filters after clearing
}

/**
 * Clears only brand filters.
 */
const clearBrandFilters = () => {
  productStore.brands.forEach((brand) => (brand.checked = false))
  currentPage.value = 1
}

/**
 * Clears only category filters.
 */
const clearCategoryFilters = () => {
  availableCategories.value.forEach((category) => (category.checked = false))
  currentPage.value = 1
}

// Reset to page 1 only when user actively changes filters
watch(sortBy, () => {
  currentPage.value = 1
})

// Watch for changes in brand filter selections (not the array itself)
watch(() => productStore.brands.map(b => b.checked), () => {
  currentPage.value = 1
}, { deep: true })

// Watch for changes in category filter selections (not the array itself)
watch(() => availableCategories.value.map(c => c.checked), () => {
  currentPage.value = 1
}, { deep: true })

// Watch for changes in price range
watch(priceRange, () => {
  currentPage.value = 1
}, { deep: true })

// Sync currentPage with backend pagination state
// This ensures the UI pagination buttons show the correct active state
watch(() => productStore.pagination.page, (newBackendPage) => {
  if (typeof newBackendPage === 'number') {
    // Backend returns 1-indexed page numbers, so use as-is
    if (newBackendPage !== currentPage.value) {
      console.log('🔵 [ALL PRODUCTS] Syncing currentPage from backend. Backend page:', newBackendPage)
      currentPage.value = newBackendPage
    }
  }
})
</script>

<template>
  <div :class="['min-h-screen', pageBackgroundClasses]">
    <!-- Breadcrumb -->
    <div :class="['pt-[85px] lg:pt-0', pageBackgroundClasses]">
      <div class="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      </div>
    </div>

    <!-- Debug Panel - Mobile optimized -->
    <div class="fixed bottom-4 right-4 z-50 max-w-[300px] sm:max-w-[420px] w-full">
      <div :class="catalogDebugPanelClasses">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-yellow-800 dark:text-yellow-200 sm:text-sm">🛠️ All Products Debug</span>
          <button @click="showDebug = !showDebug" class="text-xs text-yellow-700 underline dark:text-yellow-300 focus:outline-none">
            {{ showDebug ? 'Hide' : 'Show' }}
          </button>
        </div>
        <transition name="fade-debug">
          <div v-show="showDebug" :class="catalogDebugTextClasses">
            <div><b>User:</b> {{ user?.username || 'Not logged in' }}</div>
            <div><b>Total Products:</b> {{ productStore.products.length }}</div>
            <div><b>Filtered Products:</b> {{ filteredProducts.length }}</div>
            <div><b>Server Pagination:</b> {{ productStore.pagination.page + 1 }} / {{ productStore.pagination.totalPages }}</div>
            <div><b>Total Elements:</b> {{ productStore.pagination.totalElements }}</div>
            <div><b>Available Categories:</b> {{ availableCategories.map(c => c.name).join(', ') }}</div>
            <div><b>Active Brands:</b> {{ productStore.brands.filter(b => b.checked).length }}</div>
            <div><b>Active Categories:</b> {{ availableCategories.filter(c => c.checked).length }}</div>
            <div><b>Current Page:</b> {{ currentPage }} / {{ totalPages }}</div>
          </div>
        </transition>
      </div>
    </div>

    <div class="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-8">
      <!-- Mobile: Single Column Layout -->
      <div class="lg:hidden">
        <!-- Mobile Header -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 :class="['font-srProDisplay text-lg sm:text-xl font-semibold', textClasses]">All Products</h1>
              <p :class="['font-srProDisplay text-sm', textSecondaryClasses]">{{ productStore.pagination.totalElements || filteredProducts.length }} products found</p>
            </div>
          </div>

          <!-- Mobile Filter/Sort Controls -->
          <div class="flex gap-3 mb-4">
            <button
              @click="showMobileFilters = !showMobileFilters"
              :class="[
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-lg text-sm font-medium transition-colors min-h-[48px]',
                showMobileFilters ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              <span v-if="hasActiveFilters()" class="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                Active
              </span>
            </button>

            <button
              @click="showMobileSorting = !showMobileSorting"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[48px] transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5v6m0 0V9a2 2 0 012-2h4a2 2 0 012 2v2M8 11l4 4 4-4" />
              </svg>
              Sort
            </button>
          </div>

          <!-- Mobile Collapsible Filters -->
          <div v-if="showMobileFilters" :class="catalogMobileFilterClasses">
            <!-- Price Filter -->
            <div>
              <h3 :class="['font-srProDisplay text-base font-semibold mb-3', textClasses]">Price Range</h3>
              <DualRangeSlider
                :min="minValue"
                :max="maxValue"
                :step="50"
                v-model="priceRange"
                :format-value="(value) => `$${value}`"
              />
            </div>

            <!-- Category Filter -->
            <div v-if="availableCategories.length > 0">
              <h3 :class="['font-srProDisplay text-base font-semibold mb-3', textClasses]">Categories</h3>
              <div class="grid grid-cols-2 gap-3 overflow-y-auto max-h-48">
                <label
                  v-for="category in availableCategories.slice(0, 12)"
                  :key="category.name"
                  class="flex items-center gap-2 p-2 text-sm transition-colors bg-white border border-gray-200 rounded cursor-pointer dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                >
                  <input
                    type="checkbox"
                    v-model="category.checked"
                    :class="catalogCheckboxClasses"
                  />
                  <span :class="['truncate', catalogFilterLabelClasses]">{{ category.name }}</span>
                </label>
              </div>
            </div>

            <!-- Brand Filter -->
            <div>
              <h3 :class="['font-srProDisplay text-base font-semibold mb-3', textClasses]">Brands</h3>
              <div class="flex items-center gap-2 p-3 mb-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                <v-icon name="fa-search" scale="1" :class="['text-gray-400 dark:text-gray-300']" />
                <input
                  v-model="brandSearchQuery"
                  :class="['flex-1 bg-transparent text-sm outline-none', textClasses, 'placeholder-gray-500 dark:placeholder-gray-300']"
                  type="search"
                  placeholder="Search brands"
                />
              </div>
              <div class="grid grid-cols-2 gap-3 overflow-y-auto max-h-48">
                <label
                  v-for="brand in filteredBrands.slice(0, 10)"
                  :key="brand.name"
                  class="flex items-center gap-2 p-2 text-sm transition-colors bg-white border border-gray-200 rounded cursor-pointer dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                >
                  <input
                    type="checkbox"
                    v-model="brand.checked"
                    :class="catalogCheckboxClasses"
                  />
                  <span :class="['truncate', catalogFilterLabelClasses]">{{ brand.name }}</span>
                </label>
              </div>
            </div>

            <!-- Clear Filters -->
            <div v-if="hasActiveFilters()" class="flex gap-3">
              <button
                @click="clearAllFilters"
                class="flex-1 py-2 text-sm text-red-600 transition-colors border border-red-200 rounded-lg hover:bg-red-50"
              >
                Clear All
              </button>
              <button
                @click="showMobileFilters = false"
                class="flex-1 py-2 text-sm text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
              >
                Apply Filters
              </button>
            </div>
          </div>

          <!-- Mobile Sort Dropdown -->
          <div v-if="showMobileSorting" class="mb-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600">
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
                'w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[48px] flex items-center',
                sortBy === option.value ? 'bg-gray-100 dark:bg-gray-700 font-medium' : '',
                textClasses
              ]"
            >
              {{ option.label }}
              <svg v-if="sortBy === option.value" class="w-5 h-5 ml-auto text-black dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Products Grid -->
        <div class="w-full">
          <!-- Loading State -->
          <div v-if="productStore.loading" class="flex items-center justify-center py-12">
            <div class="w-12 h-12 border-b-2 rounded-full animate-spin border-emerald-500"></div>
            <span :class="['ml-3', textSecondaryClasses]">Loading products...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="productStore.error" :class="['border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2 mb-8 bg-red-100 dark:bg-red-900/20']">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ productStore.error }}</span>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="py-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="p-6 bg-gray-100 rounded-full dark:bg-gray-800">
                <svg :class="['w-12 h-12 text-gray-400 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h3 :class="['text-xl font-semibold mb-2', textClasses]">No products found</h3>
            <p :class="['mb-4', textSecondaryClasses]">
              {{ hasActiveFilters() ? 'No products match your current filters' : 'No products found in this category' }}
            </p>
            <button
              v-if="hasActiveFilters()"
              @click="clearAllFilters"
              class="px-4 py-2 text-sm font-medium text-white transition-colors bg-black rounded-md dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Clear All Filters
            </button>
          </div>

          <!-- Products Grid -->
          <div v-else class="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-3">
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              :class="['relative rounded-lg p-3 hover:shadow-md transition-shadow', 'bg-gray-100 dark:bg-gray-800']"
            >
              <!-- Category Badge -->
              <div
                v-if="product.categoryName && product.categoryName !== 'Unknown'"
                class="absolute top-2 left-2 bg-black dark:bg-white text-white dark:text-black text-xs px-2 py-1 rounded-full z-10 max-w-[80px] truncate"
              >
                {{ product.categoryName }}
              </div>

              <div class="absolute z-10 top-2 right-2">
                <button
                  @click="toggleFavorite(product.id)"
                  :disabled="wishlistLoading"
                  class="flex items-center justify-center w-8 h-8 text-gray-600 transition-colors hover:text-red-600 disabled:opacity-50"
                  type="button"
                >
                  <svg
                    v-if="!wishlistStore.isProductInWishlist(product.id)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    class="w-5 h-5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <svg
                    v-else
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    class="w-5 h-5 text-red-600"
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
                      class="object-cover w-full h-full rounded-md"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div class="flex flex-col flex-1 gap-3">
                  <div class="flex flex-col gap-2">
                    <div class="h-[48px]">
                      <a href="#" @click.prevent="goToProductDetails(product.id)" class="block cursor-pointer">
                        <h3 class="text-base font-medium text-center transition-colors font-srProDisplay hover:text-indigo-600 line-clamp-2">
                          {{ product.name }}
                        </h3>
                      </a>
                    </div>
                    <div class="flex items-center justify-center gap-2 mb-1">
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
                    <div class="flex items-center justify-center gap-2">
                      <span class="text-lg font-semibold font-figtree">{{ formatPrice(product.basePrice) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-center pt-2 mt-auto">
                    <button
                      @click="buyNow(product.id)"
                      class="w-full max-w-[160px] h-[40px] bg-primary text-primary-foreground text-sm font-medium rounded hover:opacity-95 transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center space-x-1">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <span class="px-4 py-2 text-sm text-gray-600">
              {{ currentPage }} of {{ totalPages }}
            </span>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop: Two Column Layout -->
      <div class="hidden gap-8 lg:flex">
        <!-- Desktop Sidebar Filters -->
        <div class="flex-shrink-0 w-64">
          <!-- Price Filter -->
          <div class="mb-6">
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 dark:border-gray-600">
              <h3 :class="catalogFilterTitleClasses">Price</h3>
              <button
                @click="toggleFilter('price')"
                class="p-1 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                type="button"
                aria-label="Toggle price filter"
              >
                <svg
                  class="w-4 h-4 text-gray-600 transition-transform duration-200 dark:text-gray-300"
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
          </div>

          <!-- Category Filter -->
          <div class="mb-6" v-if="availableCategories.length > 0">
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 dark:border-gray-600">
              <h3 :class="catalogFilterTitleClasses">Categories</h3>
              <div class="flex items-center space-x-2">
                <button
                  v-if="availableCategories.some(category => category.checked)"
                  @click="clearCategoryFilters"
                  :class="catalogClearFilterClasses"
                  type="button"
                  title="Clear category filters"
                >
                  Clear
                </button>
                <button
                  @click="toggleFilter('category')"
                  class="p-1 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  type="button"
                  aria-label="Toggle category filter"
                >
                  <svg
                    class="w-4 h-4 text-gray-600 transition-transform duration-200 dark:text-gray-300"
                    :class="{ 'rotate-180': collapsedFilters.category }"
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
            <div v-show="!collapsedFilters.category" class="transition-all duration-200">
              <div class="space-y-3 overflow-y-auto max-h-64">
                <div v-for="category in availableCategories" :key="category.name" class="flex items-center">
                  <input
                    :id="'category-' + category.name"
                    type="checkbox"
                    v-model="category.checked"
                    :class="catalogCheckboxClasses"
                  />
                  <label :for="'category-' + category.name" class="flex items-center justify-between flex-1 ml-3">
                    <span :class="catalogFilterLabelClasses">{{ category.name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="mb-6">
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 dark:border-gray-600">
              <h3 :class="catalogFilterTitleClasses">Brand</h3>
              <div class="flex items-center space-x-2">
                <button
                  v-if="productStore.brands.some(brand => brand.checked)"
                  @click="clearBrandFilters"
                  :class="catalogClearFilterClasses"
                  type="button"
                  title="Clear brand filters"
                >
                  Clear
                </button>
                <button
                  @click="toggleFilter('brand')"
                  class="p-1 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  type="button"
                  aria-label="Toggle brand filter"
                >
                  <svg
                    class="w-4 h-4 text-gray-600 transition-transform duration-200 dark:text-gray-300"
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
              <div class="flex items-center justify-start gap-2 p-3 mb-4 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                <v-icon name="fa-search" scale="1.2" class="text-gray-400 dark:text-gray-300" />
                <input
                  v-model="brandSearchQuery"
                  :class="['w-full p-0.5 font-srProDisplay text-sm font-medium outline-none bg-transparent', textClasses, 'placeholder-gray-500 dark:placeholder-gray-300']"
                  type="search"
                  placeholder="Search"
                />
              </div>
              <div class="space-y-3 overflow-y-auto max-h-64">
                <div v-for="brand in filteredBrands" :key="brand.name" class="flex items-center">
                  <input
                    :id="'brand-' + brand.name"
                    type="checkbox"
                    v-model="brand.checked"
                    :class="catalogCheckboxClasses"
                  />
                  <label :for="'brand-' + brand.name" class="flex items-center justify-between flex-1 ml-3">
                    <span :class="catalogFilterLabelClasses">{{ brand.name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Filters Summary -->
          <div v-if="hasActiveFilters()" :class="['mb-6', catalogFilterSummaryClasses]">
            <h4 :class="['font-srProDisplay text-sm font-semibold mb-3', textClasses]">Active Filters</h4>
            <div class="space-y-2">
              <div v-if="priceRange[0] > 0 || priceRange[1] < 5000" class="flex items-center justify-between text-sm">
                <span :class="textSecondaryClasses">Price:</span>
                <span :class="['font-medium', textClasses]">${{ priceRange[0] }} - ${{ priceRange[1] }}</span>
              </div>
              <div v-if="productStore.brands.some(brand => brand.checked)" class="flex items-center justify-between text-sm">
                <span :class="textSecondaryClasses">Brands:</span>
                <span :class="['font-medium', textClasses]">{{ productStore.brands.filter(brand => brand.checked).map(brand => brand.name).join(', ') }}</span>
              </div>
              <div v-if="availableCategories.some(category => category.checked)" class="flex items-center justify-between text-sm">
                <span :class="textSecondaryClasses">Categories:</span>
                <span :class="['font-medium', textClasses]">{{ availableCategories.filter(category => category.checked).map(category => category.name).join(', ') }}</span>
              </div>
            </div>
            <button
              @click="clearAllFilters"
              class="mt-3 text-xs text-red-600 underline transition-colors dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              type="button"
            >
              Clear All Filters
            </button>
          </div>

          <!-- Quick Stats -->
          <div :class="['mb-6', catalogFilterSummaryClasses]">
            <h4 :class="['font-srProDisplay text-sm font-semibold mb-2', textClasses]">Summary</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span :class="textSecondaryClasses">Total Products:</span>
                <span :class="['font-medium', textClasses]">{{ productStore.pagination.totalElements || productStore.products.length }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="textSecondaryClasses">Filtered Results:</span>
                <span :class="['font-medium', textClasses]">{{ filteredProducts.length }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="textSecondaryClasses">Current Page:</span>
                <span :class="['font-medium', textClasses]">{{ currentPage }} of {{ totalPages }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Main Content -->
        <div class="flex-1">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 :class="['font-srProDisplay text-xl font-semibold', textClasses]">All Products</h1>
              <p :class="['font-srProDisplay', textSecondaryClasses]">{{ productStore.pagination.totalElements || filteredProducts.length }} products found</p>
            </div>
            <div class="flex items-center space-x-4">
              <button
                v-if="hasActiveFilters()"
                @click="clearAllFilters"
                :class="['text-sm transition-colors underline', textSecondaryClasses]"
                type="button"
              >
                Clear All Filters
              </button>
              <select v-model="sortBy" :class="catalogSortSelectClasses">
                <option value="name">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">By rating</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="productStore.loading" class="flex items-center justify-center py-12">
            <div class="w-12 h-12 border-b-2 rounded-full animate-spin border-emerald-500"></div>
            <span :class="['ml-3', textSecondaryClasses]">Loading products...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="productStore.error" :class="['border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2 mb-8 bg-red-100 dark:bg-red-900/20']">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ productStore.error }}</span>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="py-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="p-6 bg-gray-100 rounded-full dark:bg-gray-800">
                <svg :class="['w-12 h-12 text-gray-400 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h3 :class="['text-xl font-semibold mb-2', textClasses]">No products found</h3>
            <p :class="textSecondaryClasses">
              {{ hasActiveFilters() ? 'No products match your current filters' : 'No products found in this category' }}
            </p>
            <button
              v-if="hasActiveFilters()"
              @click="clearAllFilters"
              class="px-4 py-2 mt-4 text-sm font-medium text-white transition-colors bg-black rounded-md dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Clear All Filters
            </button>
          </div>

          <!-- Products Grid -->
          <div v-else class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              :class="['relative h-auto rounded-lg px-3 py-6 duration-500 hover:scale-[1.02] hover:shadow-md dark:hover:shadow-gray-900/30 md:h-[435px] md:px-4 transition-all', 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600']"
            >
              <!-- Category Badge -->
              <div
                v-if="product.categoryName && product.categoryName !== 'Unknown'"
                class="absolute z-10 px-2 py-1 text-xs text-white bg-black rounded-full top-2 left-2 dark:bg-white dark:text-black"
              >
                {{ product.categoryName }}
              </div>
              <div class="absolute z-10 top-4 right-4">
                <button
                  @click="toggleFavorite(product.id)"
                  :disabled="wishlistLoading"
                  class="w-6 h-6 text-gray-600 transition-colors hover:text-red-600 disabled:opacity-50"
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
                <div class="flex items-center justify-center mb-6">
                  <div class="h-[104px] w-[104px] md:h-[160px] md:w-[160px]">
                    <img
                      :src="product.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp'"
                      :alt="product.name"
                      class="object-contain w-full h-full"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div class="flex flex-col flex-1 gap-6">
                  <div class="flex flex-col gap-4">
                    <div class="h-[75px] sm:h-[50px]">
                      <a href="#" @click.prevent="goToProductDetails(product.id)" class="block cursor-pointer">
                        <h3 :class="['text-center font-srProDisplay text-base font-medium hover:text-indigo-600 transition-colors line-clamp-2', textClasses]">
                          {{ product.name }}
                        </h3>
                      </a>
                    </div>
                    <div class="flex items-center justify-center gap-2 mb-1">
                      <span class="flex items-center">
                        <template v-for="i in 5" :key="i">
                          <svg
                            class="w-5 h-5"
                            :class="i <= Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                        </template>
                        <span :class="['ml-2 text-xs', textSecondaryClasses]">{{ (product.rating ?? 0).toFixed(1) }}</span>
                      </span>
                    </div>
                    <div class="flex items-center justify-center gap-2">
                      <span :class="['font-figtree text-xl font-semibold', textClasses]">{{ formatPrice(product.basePrice) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-center mt-auto">
                    <button
                      @click="buyNow(product.id)"
                      class="w-[183px] h-[48px] bg-primary text-primary-foreground text-sm font-medium rounded hover:opacity-95 transition-colors"
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
              class="p-2 transition-colors duration-200 bg-white border border-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800"
            >
              <svg :class="['w-5 h-5', textSecondaryClasses]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              v-for="page in Math.min(totalPages, 5)"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                page === currentPage ? 'bg-black dark:bg-white text-white dark:text-black' : catalogPaginationButtonClasses,
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="p-2 transition-colors duration-200 bg-white border border-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800"
            >
              <svg :class="['w-5 h-5', textSecondaryClasses]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
/* Truncate text after 2 lines */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

/* Debug panel fade */
.fade-debug-enter-active, .fade-debug-leave-active {
  transition: opacity 0.2s;
}
.fade-debug-enter-from, .fade-debug-leave-to {
  opacity: 0;
}

/* Remove default button focus styles */
button:focus {
  outline: none;
  box-shadow: none;
}

/* Custom scrollbar */
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

</style>
