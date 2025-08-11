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
import { storeToRefs } from 'pinia'

const router = useRouter()
const productStore = useProductStore()
const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const { user } = storeToRefs(authStore)
const { wishlistLoading } = storeToRefs(wishlistStore)

// =======================
// 📦 State
// =======================

/**
 * Current page number for server-side pagination.
 * 1-indexed for better UX (vs. 0-indexed).
 */
const currentPage = ref(1)

/**
 * Price range filter bounds (in EUR or local currency).
 * Default: full range from 0 to 5000.
 */
const priceRange = ref({ min: 0, max: 5000 })

/**
 * Sort order for products.
 * Options: name, name-desc, price-low, price-high, rating.
 */
const sortBy = ref('name')

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

// =======================
// 🔁 Watchers
// =======================

// Ensure price range stays valid
watch(
  () => priceRange.value.min,
  (newMin: number) => {
    if (newMin > priceRange.value.max) {
      priceRange.value.min = priceRange.value.max
    } else if (newMin < 0) {
      priceRange.value.min = 0
    }
  }
)

watch(
  () => priceRange.value.max,
  (newMax: number) => {
    if (newMax < priceRange.value.min) {
      priceRange.value.max = priceRange.value.min
    } else if (newMax > 5000) {
      priceRange.value.max = 5000
    }
  }
)

// =======================
// 🧮 Computed Properties
// =======================

/**
 * Number of items to display per page.
 * Matches the backend page size used in `fetchAllProducts`.
 */
const itemsPerPage = 20

/**
 * Get unique categories from loaded products for category filter
 */
const availableCategories = computed(() => {
  const categories = new Set<string>()
  productStore.products.forEach(product => {
    if (product.categoryName && product.categoryName !== 'Unknown') {
      categories.add(product.categoryName)
    }
  })
  return Array.from(categories).map(name => ({
    name,
    checked: false
  }))
})

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
  if (priceRange.value.min > 0 || priceRange.value.max < 5000) {
    filtered = filtered.filter(
      (product) =>
        product.basePrice >= priceRange.value.min && product.basePrice <= priceRange.value.max
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
    console.log('🔵 [ALL PRODUCTS] Page navigation complete. New currentPage:', currentPage.value)
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
  const priceFilterActive = priceRange.value.min > 0 || priceRange.value.max < 5000
  const brandFilterActive = productStore.brands.some((brand) => brand.checked)
  const categoryFilterActive = availableCategories.value.some((category) => category.checked)
  return priceFilterActive || brandFilterActive || categoryFilterActive
}

/**
 * Clears all applied filters and resets pagination.
 */
const clearAllFilters = () => {
  priceRange.value = { min: 0, max: 5000 }
  productStore.brands.forEach((brand) => (brand.checked = false))
  availableCategories.value.forEach((category) => (category.checked = false))
  currentPage.value = 1
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
watch(priceRange, () => {
  currentPage.value = 1
}, { deep: true })

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
</script>

<template>
  <div class="min-h-screen">
    <!-- Breadcrumb -->
    <div class="pt-[85px] lg:pt-0 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      </div>
    </div>

    <!-- Debug Panel -->
    <div class="fixed bottom-4 right-4 z-50 max-w-[420px] w-full">
      <div class="bg-yellow-50 border border-yellow-300 rounded-lg shadow-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="font-bold text-yellow-800 text-sm">🛠️ All Products Debug</span>
          <button @click="showDebug = !showDebug" class="text-xs text-yellow-700 underline focus:outline-none">
            {{ showDebug ? 'Hide' : 'Show' }}
          </button>
        </div>
        <transition name="fade-debug">
          <div v-show="showDebug" class="text-xs text-yellow-900 space-y-2">
            <div><b>User:</b> {{ user?.username || 'Not logged in' }}</div>
            <div><b>Total Products:</b> {{ productStore.products.length }}</div>
            <div><b>Filtered Products:</b> {{ filteredProducts.length }}</div>
            <div><b>Server Pagination:</b> {{ productStore.pagination.page + 1 }} / {{ productStore.pagination.totalPages }}</div>
            <div><b>Total Elements:</b> {{ productStore.pagination.totalElements }}</div>
            <div><b>Available Categories:</b> {{ availableCategories.map(c => c.name).join(', ') }}</div>
            <div><b>Active Brands:</b> {{ productStore.brands.filter(b => b.checked).length }}</div>
            <div><b>Active Categories:</b> {{ availableCategories.filter(c => c.checked).length }}</div>
            <div><b>Current Page:</b> {{ currentPage }} / {{ totalPages }}</div>
            <div><b>Items Per Page:</b> {{ itemsPerPage }}</div>
            <div><b>Price Range:</b> ${{ priceRange.min }} - ${{ priceRange.max }}</div>
            <div><b>Sort By:</b> {{ sortBy }}</div>
          </div>
        </transition>
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
                  <label class="text-xs font-srProDisplay text-gray-500 mt-1 block mb-2">From</label>
                  <input
                    v-model.number="priceRange.min"
                    type="number"
                    placeholder="0"
                    class="w-full px-2 py-2 text-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <span class="text-gray-200 font-srProDisplay mt-6"> — </span>
                <div class="flex-1">
                  <label class="text-xs text-right font-srProDisplay text-gray-500 mt-1 block mb-2">To</label>
                  <input
                    v-model.number="priceRange.max"
                    type="number"
                    placeholder="5000"
                    class="w-full py-2 text-right text-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Dual Range Slider -->
              <div class="relative px-2">
                <div class="relative h-1 bg-gray-300 rounded-full">
                  <div
                    class="absolute h-1 bg-black rounded-full"
                    :style="{
                      left: (priceRange.min / 5000) * 100 + '%',
                      width: ((priceRange.max - priceRange.min) / 5000) * 100 + '%',
                    }"
                  ></div>
                  <input
                    v-model.number="priceRange.min"
                    type="range"
                    :min="0"
                    :max="5000"
                    step="50"
                    class="absolute w-full h-1 appearance-none bg-transparent pointer-events-none slider-thumb-min"
                  />
                  <input
                    v-model.number="priceRange.max"
                    type="range"
                    :min="0"
                    :max="5000"
                    step="50"
                    class="absolute w-full h-1 appearance-none bg-transparent pointer-events-none slider-thumb-max"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Category Filter -->
          <div class="mb-6" v-if="availableCategories.length > 0">
            <div class="flex items-center justify-between border-b border-[#EBEBEB] mb-4 pb-3">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Categories</h3>
              <div class="flex items-center space-x-2">
                <button
                  v-if="availableCategories.some(category => category.checked)"
                  @click="clearCategoryFilters"
                  class="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  type="button"
                  title="Clear category filters"
                >
                  Clear
                </button>
                <button
                  @click="toggleFilter('category')"
                  class="p-1 hover:bg-gray-100 rounded transition-colors"
                  type="button"
                  aria-label="Toggle category filter"
                >
                  <svg
                    class="w-4 h-4 text-gray-600 transition-transform duration-200"
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
              <div class="space-y-3 max-h-64 overflow-y-auto">
                <div v-for="category in availableCategories" :key="category.name" class="flex items-center">
                  <input
                    :id="'category-' + category.name"
                    type="checkbox"
                    v-model="category.checked"
                    class="custom-checkbox focus:ring-1 focus:ring-gray-400"
                  />
                  <label :for="'category-' + category.name" class="ml-3 flex-1 flex items-center justify-between">
                    <span class="text-sm font-srProDisplay text-gray-1000">{{ category.name }}</span>
                  </label>
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
              <div v-if="priceRange.min > 0 || priceRange.max < 5000" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Price:</span>
                <span class="font-medium">${{ priceRange.min }} - ${{ priceRange.max }}</span>
              </div>
              <div v-if="productStore.brands.some(brand => brand.checked)" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Brands:</span>
                <span class="font-medium">{{ productStore.brands.filter(brand => brand.checked).map(brand => brand.name).join(', ') }}</span>
              </div>
              <div v-if="availableCategories.some(category => category.checked)" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Categories:</span>
                <span class="font-medium">{{ availableCategories.filter(category => category.checked).map(category => category.name).join(', ') }}</span>
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
                <span class="font-medium">{{ productStore.pagination.totalElements || productStore.products.length }}</span>
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
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="font-srProDisplay text-xl font-semibold text-black">All Products</h1>
              <p class="font-srProDisplay text-gray-600">{{ productStore.pagination.totalElements || filteredProducts.length }} products found</p>
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

          <!-- Products Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              class="relative h-auto rounded-[9px] bg-[#f6f6f6] px-3 py-6 duration-500 hover:scale-[1.02] hover:shadow-md md:h-[435px] md:px-4"
            >
              <!-- Category Badge -->
              <div
                v-if="product.categoryName && product.categoryName !== 'Unknown'"
                class="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full z-10"
              >
                {{ product.categoryName }}
              </div>
              <div class="absolute top-4 right-4 z-10">
                <button
                  @click="toggleFavorite(product.id)"
                  :disabled="wishlistLoading"
                  class="w-6 h-6 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
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
                      class="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div class="flex flex-col flex-1 gap-6">
                  <div class="flex flex-col gap-4">
                    <div class="h-[75px] sm:h-[50px]">
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
                            class="w-5 h-5"
                            :class="i <= Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                        </template>
                        <span class="ml-2 text-xs text-gray-500">{{ (product.rating ?? 0).toFixed(1) }}</span>
                      </span>
                    </div>
                    <div class="flex justify-center items-center gap-2">
                      <span class="font-figtree text-xl font-semibold">{{ formatPrice(product.basePrice) }}</span>
                    </div>
                  </div>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
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

/* Custom checkbox styling */
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
</style>
