<script setup lang="ts">
// =============================================================================
// IMPORTS
// =============================================================================
// Core Vue utilities
import { onMounted, ref, computed, watch } from 'vue'

// Pinia stores for state management
import { useProductStore } from '@/stores/products'
import { useCategoriesStore } from '@/stores/categories'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAuthStore } from '@/stores/auth'

// Router for navigation
import { useRouter } from 'vue-router'

// UI Components
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import DualRangeSlider from '@/components/shared/DualRangeSlider.vue'

// Utilities
import { storeToRefs } from 'pinia'
import { useThemeClasses } from '@/composables/useThemeClasses'

// ============================================================================
// PROPS
// ============================================================================
// Receives the category name from the route (e.g., 'smartphones', 'laptops')
interface Props {
  categoryName: string
}
const props = defineProps<Props>()

// ============================================================================
// STORES & REFS (State Management)
// ============================================================================
const router = useRouter()
const productStore = useProductStore()
const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()

// Reactive refs from stores (auto-updating)
const { user } = storeToRefs(authStore)
const { wishlistProducts, wishlistLoading } = storeToRefs(wishlistStore)

// ============================================================================
// THEME CLASSES (Dynamic UI Styling)
// ============================================================================
// Extract reusable theme classes for consistent design across the app
const {
  cardClasses,
  textClasses,
  textSecondaryClasses,
  textMutedClasses,
  buttonPrimaryClasses,
  buttonSecondaryClasses,
  hoverClasses,
  pageBackgroundClasses,
  catalogFilterSectionClasses,
  catalogFilterHeaderClasses,
  catalogFilterTitleClasses,
  catalogSearchInputClasses,
  catalogProductCardClasses,
  catalogMobileFilterClasses,
  catalogSortSelectClasses,
  catalogPaginationButtonClasses,
  catalogPaginationActiveClasses,
  catalogCheckboxClasses,
  catalogFilterLabelClasses,
  catalogClearFilterClasses,
  catalogFilterSummaryClasses
} = useThemeClasses()

// ============================================================================
// UI & FILTER STATE
// ============================================================================
// Debug mode for developers (toggle via UI)
const showDebug = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 9 // Fixed number of items per page

// Sorting
const sortBy = ref('name') // Default sort: A-Z by name

// Brand search filter
const brandSearchQuery = ref('')

// Mobile UI state
const showMobileFilters = ref(false)
const showMobileSorting = ref(false)

// Accordion-style filter collapse state
const collapsedFilters = ref({
  price: false,
  brand: false
})

// Category display names
const categoryDisplayName = ref('')
const actualCategoryName = ref('')

// Price range filter (shared between desktop and mobile)
const minValue = 0
const maxValue = 5000
const priceRange = ref<[number, number]>([0, 5000])

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

// Filter and sort products based on active criteria
const filteredProducts = computed(() => {
  let result = [...productStore.products]

  // Price Filter
  if (priceRange.value[0] > 0 || priceRange.value[1] < maxValue) {
    result = result.filter(
      product => product.basePrice >= priceRange.value[0] && product.basePrice <= priceRange.value[1]
    )
  }

  // Brand Filter
  const selectedBrands = productStore.brands
    .filter(brand => brand.checked)
    .map(brand => brand.name)
  if (selectedBrands.length > 0) {
    result = result.filter(product => selectedBrands.includes(product.brand))
  }

  // Sorting
  switch (sortBy.value) {
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'price-low':
      result.sort((a, b) => a.basePrice - b.basePrice)
      break
    case 'price-high':
      result.sort((a, b) => b.basePrice - a.basePrice)
      break
    case 'rating':
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      break
  }

  return result
})

// Paginated subset of filtered products
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// Total number of pages for pagination
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

// Filter brands by search query with basic scoring
const filteredBrands = computed(() => {
  const query = brandSearchQuery.value?.trim().toLowerCase()
  if (!query || query.length < 2) return productStore.brands

  return productStore.brands
    .map(brand => {
      const name = brand.name.toLowerCase()
      let score = 0
      if (name === query) score = 1000
      else if (name.startsWith(query)) score = 500 + (100 - query.length)
      else if (name.split(/\s+/).some(word => word.startsWith(query))) score = 300 + (100 - query.length)
      else if (name.includes(query)) score = 100 + (100 - name.indexOf(query))
      return { brand, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ brand }) => brand)
})

// Breadcrumb navigation trail
const breadcrumbs = computed(() => [
  { label: 'catalog.title', to: '/catalog' },
  { label: categoryDisplayName.value }
])

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Converts a URL-friendly category name (e.g., 'smart-phones') back to a readable name.
 * Matches against stored categories, or falls back to title-casing the URL.
 */
const getCategoryNameFromUrl = (urlName: string): string => {
  const normalizedUrl = urlName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')

  const category = categoriesStore.categories.find(cat => {
    const normalizedCat = cat.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
    return normalizedCat === normalizedUrl
  })

  return category ? category.name : urlName.replace(/-/g, ' ')
}

// ============================================================================
// EVENT HANDLERS & ACTIONS
// ============================================================================

/**
 * Formats a number into a price string (e.g., 999 → "$999")
 */
const formatPrice = (price: number): string => {
  return `$${price}`
}

/**
 * Toggles a product's presence in the user's wishlist.
 * Requires authentication and handles async operations with error feedback.
 */
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
    // Ensure wishlist is loaded
    if (!wishlistStore.wishlistId) {
      console.log('🟡 [CATALOG] Loading user wishlist...')
      await wishlistStore.fetchUserWishlist(user.value.id)
    }

    const isCurrentlyInWishlist = wishlistStore.isProductInWishlist(productId)
    console.log('🟡 [CATALOG] Product in wishlist before action:', isCurrentlyInWishlist)

    if (!isCurrentlyInWishlist) {
      console.log('🟡 [CATALOG] Adding product to wishlist...')
      await wishlistStore.addProductToWishlist(productId, {
        name: product.name,
        description: product.description || product.name,
        brand: product.brand || 'Unknown',
        isFeatured: product.isFeatured,
        basePrice: product.basePrice,
        totalStock: product.totalStock,
        imageUrl: product.imageUrl
      })
      console.log('✅ [CATALOG] Product added to wishlist')
    } else {
      console.log('🟡 [CATALOG] Removing product from wishlist...')
      await wishlistStore.removeProductFromWishlist(productId)
      console.log('✅ [CATALOG] Product removed from wishlist')
    }

    console.log('🟡 [CATALOG] Product in wishlist after action:', wishlistStore.isProductInWishlist(productId))
  } catch (error) {
    console.error('🔴 [CATALOG] Error toggling favorite:', error)
    alert('Error updating wishlist: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

/**
 * Navigates to the product details page.
 */
const goToProductDetails = (productId: number) => {
  console.log('🟢 [CATALOG] goToProductDetails called with productId:', productId)
  router
    .push({
      name: 'productDetails',
      params: {
        categoryName: props.categoryName,
        productId: productId.toString()
      }
    })
    .then(() => console.log('🟢 [CATALOG] Navigation successful'))
    .catch(error => console.error('🔴 [CATALOG] Navigation error:', error))
}

/**
 * "Buy Now" redirects to product details (placeholder for cart logic).
 */
const buyNow = (productId: number) => {
  goToProductDetails(productId)
}

/**
 * Updates current page with validation and smooth scroll on mobile.
 */
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

/**
 * Toggles visibility of a filter section (price, brand).
 */
const toggleFilter = (filterName: keyof typeof collapsedFilters.value) => {
  collapsedFilters.value[filterName] = !collapsedFilters.value[filterName]
}

/**
 * Checks if any filter is currently active (used to show "Clear" buttons).
 */
const hasActiveFilters = (): boolean => {
  const priceActive = priceRange.value[0] > 0 || priceRange.value[1] < 5000
  const brandActive = productStore.brands.some(brand => brand.checked)
  return priceActive || brandActive
}

/**
 * Resets all filters and returns to first page.
 */
const clearAllFilters = () => {
  priceRange.value = [0, 5000]
  productStore.brands.forEach(brand => (brand.checked = false))
  currentPage.value = 1
  showMobileFilters.value = false // Close mobile drawer
}

/**
 * Clears only brand filters.
 */
const clearBrandFilters = () => {
  productStore.brands.forEach(brand => (brand.checked = false))
  currentPage.value = 1
}

// ============================================================================
// MOBILE-SPECIFIC ACTIONS
// ============================================================================

/**
 * Opens mobile filter drawer and prevents background scroll.
 */
const openMobileFilters = () => {
  showMobileFilters.value = true
  document.body.style.overflow = 'hidden'
}

/**
 * Closes mobile filter drawer and restores scroll.
 */
const closeMobileFilters = () => {
  showMobileFilters.value = false
  document.body.style.overflow = ''
}

/**
 * Applies filters and closes mobile drawer.
 */
const applyMobileFilters = () => {
  currentPage.value = 1
  closeMobileFilters()
}

// ============================================================================
// WATCHERS
// ============================================================================
// When route category changes, update display name and fetch products
watch(
  () => props.categoryName,
  async (newCategoryName) => {
    if (newCategoryName) {
      actualCategoryName.value = getCategoryNameFromUrl(newCategoryName)
      categoryDisplayName.value = actualCategoryName.value
      currentPage.value = 1
      await productStore.fetchProductsByCategoryName(actualCategoryName.value, 0, itemsPerPage)
    }
  },
  { immediate: true }
)

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================
// On mount: fetch categories, products, brands, and user wishlist
onMounted(async () => {
  if (categoriesStore.categories.length === 0) {
    await categoriesStore.fetchCategories()
  }

  actualCategoryName.value = getCategoryNameFromUrl(props.categoryName)
  categoryDisplayName.value = actualCategoryName.value

  await Promise.all([
    productStore.fetchProductsByCategoryName(actualCategoryName.value, currentPage.value - 1, itemsPerPage),
    productStore.fetchBrands()
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
  <div :class="pageBackgroundClasses" class="min-h-screen">
    <!-- Breadcrumb Navigation -->
    <div :class="cardClasses" class="pt-[85px] lg:pt-0">
      <div class="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      </div>
    </div>

    <!-- Debug Panel (DEV ONLY) -->
    <div class="fixed bottom-4 right-4 z-50 max-w-[300px] sm:max-w-[420px] w-full">
      <div :class="['p-3 rounded-lg shadow-lg sm:p-4', 'theme-debug-bg']">
        <div class="flex items-center justify-between mb-2">
          <span :class="['text-xs font-bold sm:text-sm', 'theme-debug-text']">🛠️ Debug Panel</span>
          <button @click="showDebug = !showDebug" :class="['text-xs underline', 'theme-debug-text']">
            {{ showDebug ? 'Hide' : 'Show' }}
          </button>
        </div>
        <transition name="fade-debug">
          <div v-show="showDebug" :class="['space-y-2 overflow-y-auto text-xs max-h-40', 'theme-debug-text']">
            <div><b>User:</b> {{ user }}</div>
            <div><b>Wishlist ID:</b> {{ wishlistStore.wishlistId }}</div>
            <div><b>Wishlist Count:</b> {{ wishlistProducts.length }}</div>
            <div><b>Wishlist Product IDs:</b> {{ wishlistProducts.map(p => p.id).join(', ') }}</div>
            <div><b>Current Page:</b> {{ currentPage }} / {{ totalPages }}</div>
            <div><b>Items Per Page:</b> {{ itemsPerPage }}</div>
            <div><b>Filtered Products:</b> {{ filteredProducts.length }}</div>
            <div><b>Checked Brands:</b> {{ productStore.brands.filter(b => b.checked).map(b => b.name).join(', ') }}</div>
            <div><b>Price Range:</b> ${{ priceRange[0] }} - ${{ priceRange[1] }}</div>
            <div><b>Sort By:</b> {{ sortBy }}</div>
            <div><b>Category:</b> {{ actualCategoryName }}</div>
            <div><b>Display Name:</b> {{ categoryDisplayName }}</div>
            <button
              @click="console.log('🧪 [TEST] Debug button clicked!'); goToProductDetails(76)"
              class="px-2 py-1 mt-2 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Test Navigation (ID: 76)
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-8">
      <!-- Mobile Header & Controls -->
      <div class="mb-6 lg:hidden">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 :class="textClasses" class="text-lg font-semibold font-srProDisplay sm:text-xl">
              {{ categoryDisplayName }}
            </h1>
            <p :class="textSecondaryClasses" class="text-sm font-srProDisplay">
              {{ filteredProducts.length }} products found
            </p>
          </div>
        </div>

        <!-- Mobile Filter & Sort Buttons -->
        <div class="flex gap-3">
          <button
            @click="openMobileFilters"
            :class="[cardClasses, hoverClasses]"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium min-h-[48px]"
          >
            <svg :class="textSecondaryClasses" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span :class="textClasses">Filters</span>
            <span v-if="hasActiveFilters()" class="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
              Active
            </span>
          </button>

          <button
            @click="showMobileSorting = !showMobileSorting"
            :class="[cardClasses, hoverClasses]"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium min-h-[48px]"
          >
            <svg :class="textSecondaryClasses" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 5v6m0 0V9a2 2 0 012-2h4a2 2 0 012 2v2M8 11l4 4 4-4" />
            </svg>
            <span :class="textClasses">Sort</span>
          </button>
        </div>

        <!-- Mobile Sort Dropdown -->
        <div v-if="showMobileSorting" :class="cardClasses" class="mt-3 overflow-hidden rounded-lg shadow-lg">
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
              'w-full px-4 py-3 text-left text-sm transition-colors min-h-[48px] flex items-center',
              hoverClasses,
              sortBy === option.value ? 'font-medium' : '',
              textClasses
            ]"
          >
            {{ option.label }}
            <svg v-if="sortBy === option.value" :class="textClasses" class="w-5 h-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Layout: Filters (Desktop) + Main Content -->
      <div class="flex gap-8">
        <!-- Desktop Sidebar Filters -->
        <div class="flex-shrink-0 hidden w-64 lg:block">
          <!-- Price Filter -->
          <div :class="catalogFilterSectionClasses" class="mb-6">
            <div :class="catalogFilterHeaderClasses" class="flex items-center justify-between pb-3 mb-4">
              <h3 :class="catalogFilterTitleClasses" class="text-lg font-semibold font-srProDisplay">Price</h3>
              <button @click="toggleFilter('price')" :class="hoverClasses" class="p-1 transition-colors rounded">
                <svg
                  :class="[textSecondaryClasses, 'transition-transform duration-200', { 'rotate-180': collapsedFilters.price }]"
                  class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div v-show="!collapsedFilters.price" class="flex flex-col space-y-4 transition-all duration-200">
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
          <div :class="catalogFilterSectionClasses" class="mb-6">
            <div :class="catalogFilterHeaderClasses" class="flex items-center justify-between pb-3 mb-4">
              <h3 :class="catalogFilterTitleClasses" class="text-lg font-semibold font-srProDisplay">Brand</h3>
              <div class="flex items-center space-x-2">
                <button
                  v-if="productStore.brands.some(brand => brand.checked)"
                  @click="clearBrandFilters"
                  :class="[catalogClearFilterClasses, 'text-xs transition-colors']"
                  type="button"
                  title="Clear brand filters"
                >
                  Clear
                </button>
                <button @click="toggleFilter('brand')" :class="hoverClasses" class="p-1 transition-colors rounded">
                  <svg
                    :class="[textSecondaryClasses, 'transition-transform duration-200', { 'rotate-180': collapsedFilters.brand }]"
                    class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            <div v-show="!collapsedFilters.brand" class="transition-all duration-200">
              <div :class="catalogSearchInputClasses" class="flex items-center justify-start gap-2 p-3 mb-4 rounded-lg">
                <v-icon name="fa-search" scale="1.2" :class="textMutedClasses" />
                <input
                  v-model="brandSearchQuery"
                  :class="[textClasses, 'w-full p-0.5 font-srProDisplay text-sm font-medium outline-none bg-transparent']"
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
                    class="focus:ring-1 focus:ring-gray-400"
                  />
                  <label :for="'brand-' + brand.name" :class="catalogFilterLabelClasses" class="flex-1 ml-3">
                    <span class="text-sm font-srProDisplay">{{ brand.name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Filters Summary -->
          <div v-if="hasActiveFilters()" :class="catalogFilterSummaryClasses" class="p-4 mb-6 rounded-lg">
            <h4 :class="textClasses" class="mb-3 text-sm font-semibold font-srProDisplay">Active Filters</h4>
            <div class="space-y-2">
              <div v-if="priceRange[0] > 0 || priceRange[1] < 5000" class="flex items-center justify-between text-sm">
                <span :class="textSecondaryClasses">Price:</span>
                <span :class="textClasses" class="font-medium">${{ priceRange[0] }} - ${{ priceRange[1] }}</span>
              </div>
              <div v-if="productStore.brands.some(brand => brand.checked)" class="flex items-center justify-between text-sm">
                <span :class="textSecondaryClasses">Brands:</span>
                <span :class="textClasses" class="font-medium">
                  {{ productStore.brands.filter(brand => brand.checked).map(brand => brand.name).join(', ') }}
                </span>
              </div>
            </div>
            <button @click="clearAllFilters" :class="catalogClearFilterClasses" class="mt-3 text-xs underline transition-colors">
              Clear All Filters
            </button>
          </div>

          <!-- Quick Stats -->
          <div :class="catalogFilterSummaryClasses" class="p-4 mb-6 rounded-lg">
            <h4 :class="textClasses" class="mb-2 text-sm font-semibold font-srProDisplay">Summary</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span :class="textSecondaryClasses">Total Products:</span>
                <span :class="textClasses" class="font-medium">{{ productStore.products.length }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="textSecondaryClasses">Filtered Results:</span>
                <span :class="textClasses" class="font-medium">{{ filteredProducts.length }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="textSecondaryClasses">Current Page:</span>
                <span :class="textClasses" class="font-medium">{{ currentPage }} of {{ totalPages }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Product Grid -->
        <div class="flex-1">
          <!-- Desktop Header -->
          <div class="items-center justify-between hidden mb-6 lg:flex">
            <div>
              <h1 :class="textClasses" class="text-xl font-semibold font-srProDisplay">{{ categoryDisplayName }}</h1>
              <p :class="textSecondaryClasses" class="font-srProDisplay">{{ filteredProducts.length }} products found</p>
            </div>
            <div class="flex items-center space-x-4">
              <button
                v-if="hasActiveFilters()"
                @click="clearAllFilters"
                :class="catalogClearFilterClasses"
                class="text-sm underline transition-colors"
              >
                Clear All Filters
              </button>
              <select
                v-model="sortBy"
                :class="catalogSortSelectClasses"
                class="font-srProDisplay rounded-md w-70 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500"
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
          <div v-if="productStore.loading" class="flex items-center justify-center py-12">
            <div class="w-12 h-12 border-b-2 rounded-full animate-spin border-emerald-500"></div>
            <span :class="textSecondaryClasses" class="ml-3">Loading products...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="productStore.error" class="flex items-center justify-center px-4 py-3 mb-8 space-x-2 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900/20 dark:border-red-500 dark:text-red-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            <span>{{ productStore.error }}</span>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="py-12 text-center">
            <div class="flex justify-center mb-4">
              <div :class="cardClasses" class="p-6 rounded-full">
                <svg :class="textMutedClasses" class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h3 :class="textClasses" class="mb-2 text-xl font-semibold">No products found</h3>
            <p :class="textSecondaryClasses">
              {{ hasActiveFilters() ? 'No products match your current filters' : 'No products found in this category' }}
            </p>
            <button
              v-if="hasActiveFilters()"
              @click="clearAllFilters"
              :class="buttonPrimaryClasses"
              class="px-4 py-2 mt-4 text-sm font-medium transition-colors rounded-md"
            >
              Clear All Filters
            </button>
          </div>

          <!-- Product Grid -->
          <div v-else class="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              @click="goToProductDetails(product.id)"
              role="link"
              :aria-label="`View ${product.name}`"
              tabindex="0"
              @keyup.enter="goToProductDetails(product.id)"
              :class="`${catalogProductCardClasses} cursor-pointer`"
              class="relative h-auto rounded-lg px-4 py-4 duration-300 hover:scale-[1.01] hover:shadow-md md:h-[410px] lg:px-4"
            >
              <!-- Favorite Button -->
              <div class="absolute z-10 top-3 right-3">
                <button
                  @click.stop="toggleFavorite(product.id)"
                  :disabled="wishlistLoading"
                  :class="[textSecondaryClasses, 'hover:text-red-600 dark:hover:text-red-400']"
                  class="flex items-center justify-center w-8 h-8 transition-colors disabled:opacity-50"
                  type="button"
                  aria-label="Toggle favorite"
                >
                  <svg v-if="!wishlistStore.isProductInWishlist(product.id)" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <svg v-else fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6 text-red-600">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <!-- Product Content -->
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
                      <a href="#" @click.stop.prevent="goToProductDetails(product.id)" class="block cursor-pointer">
                        <h3 :class="textClasses"
                          class="text-base font-medium text-center transition-colors font-srProDisplay hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2">
                          {{ product.name }}
                        </h3>
                      </a>
                    </div>
                    <div class="flex items-center justify-center gap-2 mb-1">
                      <span class="flex items-center">
                        <template v-for="i in 5" :key="i">
                          <svg class="w-4 h-4"
                            :class="i <= Math.round(product.rating || 0) ? 'text-yellow-400' : textSecondaryClasses"
                            fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 0 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                        </template>
                        <span :class="['ml-2 text-xs', textMutedClasses]">{{ (product.rating ?? 0).toFixed(1) }}</span>
                      </span>
                    </div>
                    <div class="flex items-center justify-center gap-2">
                      <span :class="textClasses" class="text-lg font-semibold font-figtree">{{ formatPrice(product.basePrice) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-center pt-2 mt-6">
                    <button
                      @click.stop="buyNow(product.id)"
                      :class="buttonPrimaryClasses"
                      class="w-full max-w-[160px] h-[40px] text-sm font-medium rounded transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center space-x-1 lg:space-x-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              :class="catalogPaginationButtonClasses"
              class="p-2 lg:p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg :class="textClasses" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <template v-if="totalPages <= 5">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium min-w-[44px] min-h-[44px] flex items-center justify-center',
                  page === currentPage ? catalogPaginationActiveClasses : catalogPaginationButtonClasses,
                ]"
              >
                {{ page }}
              </button>
            </template>
            <template v-else>
              <button v-if="currentPage > 2" @click="goToPage(1)" :class="catalogPaginationButtonClasses" class="px-3 py-2 rounded-md text-sm font-medium min-w-[44px] min-h-[44px] flex items-center justify-center">1</button>
              <span v-if="currentPage > 3" :class="textMutedClasses" class="px-2 py-2">...</span>
              <button
                v-for="page in [currentPage - 1, currentPage, currentPage + 1].filter(p => p > 0 && p <= totalPages)"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium min-w-[44px] min-h-[44px] flex items-center justify-center',
                  page === currentPage ? catalogPaginationActiveClasses : catalogPaginationButtonClasses,
                ]"
              >
                {{ page }}
              </button>
              <span v-if="currentPage < totalPages - 2" :class="textMutedClasses" class="px-2 py-2">...</span>
              <button v-if="currentPage < totalPages - 1" @click="goToPage(totalPages)" :class="catalogPaginationButtonClasses" class="px-3 py-2 rounded-md text-sm font-medium min-w-[44px] min-h-[44px] flex items-center justify-center">{{ totalPages }}</button>
            </template>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="catalogPaginationButtonClasses"
              class="p-2 lg:p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg :class="textClasses" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filters Modal -->
    <div v-if="showMobileFilters" class="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden" @click="closeMobileFilters">
      <div :class="catalogMobileFilterClasses" class="flex flex-col w-full h-full max-w-sm ml-auto overflow-hidden" @click.stop>
        <div :class="[cardClasses, 'flex items-center justify-between p-4']">
          <h2 :class="textClasses" class="text-lg font-semibold">Filters</h2>
          <button @click="closeMobileFilters" :class="hoverClasses" class="p-2 transition-colors rounded-full">
            <svg :class="textClasses" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 p-4 overflow-y-auto">
          <!-- Price Filter -->
          <div :class="catalogFilterSectionClasses" class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 :class="catalogFilterTitleClasses" class="text-lg font-semibold font-srProDisplay">Price</h3>
              <button @click="toggleFilter('price')" :class="hoverClasses" class="p-1 transition-colors rounded">
                <svg
                  :class="[textSecondaryClasses, 'transition-transform duration-200', { 'rotate-180': collapsedFilters.price }]"
                  class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
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
          <div :class="catalogFilterSectionClasses" class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 :class="catalogFilterTitleClasses" class="text-lg font-semibold font-srProDisplay">Brand</h3>
              <div class="flex items-center space-x-2">
                <button
                  v-if="productStore.brands.some(brand => brand.checked)"
                  @click="clearBrandFilters"
                  :class="catalogClearFilterClasses"
                  class="text-xs transition-colors"
                >
                  Clear
                </button>
                <button @click="toggleFilter('brand')" :class="hoverClasses" class="p-1 transition-colors rounded">
                  <svg
                    :class="[textSecondaryClasses, 'transition-transform duration-200', { 'rotate-180': collapsedFilters.brand }]"
                    class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            <div v-show="!collapsedFilters.brand">
              <div :class="catalogSearchInputClasses" class="flex items-center justify-start gap-2 p-3 mb-4 rounded-lg">
                <v-icon name="fa-search" scale="1.2" :class="textMutedClasses" />
                <input
                  v-model="brandSearchQuery"
                  :class="[textClasses, 'w-full p-0.5 font-srProDisplay text-sm font-medium outline-none bg-transparent']"
                  type="search"
                  placeholder="Search brands"
                />
              </div>
              <div class="space-y-4 overflow-y-auto max-h-64">
                <div v-for="brand in filteredBrands" :key="brand.name" class="flex items-center">
                  <input
                    :id="'mobile-brand-' + brand.name"
                    type="checkbox"
                    v-model="brand.checked"
                    :class="catalogCheckboxClasses"
                    class="w-5 h-5 rounded"
                  />
                  <label :for="'mobile-brand-' + brand.name" :class="[catalogFilterLabelClasses, 'ml-3 flex-1 text-sm font-srProDisplay py-2']">
                    {{ brand.name }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Filters -->
          <div v-if="hasActiveFilters()" :class="catalogFilterSummaryClasses" class="p-4 mb-6 rounded-lg">
            <h4 :class="textClasses" class="mb-3 text-sm font-semibold font-srProDisplay">Active Filters</h4>
            <div class="space-y-2">
              <div v-if="priceRange[0] > 0 || priceRange[1] < 5000" class="flex items-center justify-between text-sm">
                <span :class="textSecondaryClasses">Price:</span>
                <span :class="textClasses" class="font-medium">${{ priceRange[0] }} - ${{ priceRange[1] }}</span>
              </div>
              <div v-if="productStore.brands.some(brand => brand.checked)" class="text-sm">
                <span :class="textSecondaryClasses">Brands:</span>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span
                    v-for="brand in productStore.brands.filter(brand => brand.checked)"
                    :key="brand.name"
                    class="inline-block px-2 py-1 text-xs text-white bg-black rounded dark:bg-white dark:text-black"
                  >
                    {{ brand.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :class="[cardClasses, 'p-4 space-y-3']">
          <button
            v-if="hasActiveFilters()"
            @click="clearAllFilters"
            :class="buttonSecondaryClasses"
            class="w-full py-3 text-sm text-center transition-colors border rounded-lg"
          >
            Clear All Filters
          </button>
          <button
            @click="applyMobileFilters"
            :class="buttonPrimaryClasses"
            class="w-full py-4 text-sm font-medium transition-colors rounded-lg"
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
body.modal-open {
  overflow: hidden;
}
</style>
