<template>
  <div :class="pageBackgroundClasses" class="min-h-screen">
    <!-- Breadcrumb -->
    <div :class="['pt-[85px] lg:pt-0', cardClasses]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
      <!-- Search Header -->
      <div class="mb-6">
  <h1 :class="['text-2xl lg:text-3xl font-bold mb-2', textClasses]">Search Results</h1>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="text-gray-600">
            <span v-if="searchQuery">
              Showing results for "<span class="font-semibold text-gray-900">{{ searchQuery }}</span>"
            </span>
            <span class="ml-2">
              ({{ pagination.totalElements }} {{ pagination.totalElements === 1 ? 'product' : 'products' }} found)
            </span>
          </div>

          <!-- Sort Controls -->
      <div class="flex items-center gap-4">
            <label for="sort-select" class="text-sm font-medium text-gray-700 whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-select"
              v-model="sortBy"
              @change="handleSortChange"
        :class="['px-3 py-2 text-sm rounded-lg', catalogSortSelectClasses]"
            >
              <option value="name,asc">Name A-Z</option>
              <option value="name,desc">Name Z-A</option>
              <option value="basePrice,asc">Price: Low to High</option>
              <option value="basePrice,desc">Price: High to Low</option>
              <option value="rating,desc">Rating: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>

      <!-- No Results -->
  <div v-else-if="!loading && products.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div class="flex justify-center mb-4">
            <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-600 mb-6">
            <span v-if="searchQuery">
              Sorry, we couldn't find any products matching "<strong>{{ searchQuery }}</strong>".
            </span>
            <span v-else>
              Try adjusting your search terms or browse our categories.
            </span>
          </p>
          <div class="space-y-2 text-sm text-gray-500">
            <p>• Check your spelling</p>
            <p>• Try more general keywords</p>
            <p>• Browse our product categories</p>
          </div>
          <router-link
            to="/catalog"
            :class="['inline-block mt-6 px-6 py-2 rounded-lg transition-colors', buttonPrimaryClasses]"
          >
            Browse Categories
          </router-link>
        </div>
      </div>

      <!-- Search Results Grid -->
      <div v-else class="space-y-6">
        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="product in products"
            :key="product.id"
            class="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow h-[420px] flex flex-col"
          >
            <!-- Product Image -->
            <div class="relative overflow-hidden rounded-t-lg bg-gray-100 aspect-square">
              <img
                :src="product.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp'"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                @error="handleImageError"
              />

              <!-- Wishlist Button -->
              <button
                @click="toggleFavorite(product.id)"
                :disabled="wishlistLoading"
                class="absolute top-3 right-3 w-6 h-6 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                type="button"
                aria-label="Toggle favorite"
              >
                <svg
                  v-if="!isProductInWishlist(product.id)"
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

              <!-- Stock Badge -->
              <div
                v-if="product.totalStock === 0"
                class="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded"
              >
                Out of Stock
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-4 flex flex-col flex-1 justify-center">
              <!-- Title and Brand (fixed height area) -->
              <div class="mb-3 h-[70px] flex flex-col justify-center">
                <h3
                  @click="goToProductDetails(product.id)"
                  class="font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-black transition-colors text-center"
                >
                  {{ product.name }}
                </h3>
                <p class="text-sm text-gray-500 text-center truncate mt-1">{{ product.brand }}</p>
              </div>

              <!-- Price -->
              <div class="mb-3 text-center">
                <span class="text-lg font-bold text-gray-900">
                  {{ formatPrice(product.basePrice) }}
                </span>
              </div>

              <!-- Rating -->
              <div v-if="product.rating && product.rating > 0" class="flex items-center justify-center mb-3">
                <div class="flex items-center">
                  <template v-for="i in 5" :key="i">
                    <svg
                      class="w-4 h-4"
                      :class="i <= Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  </template>
                  <span class="ml-2 text-sm text-gray-500">{{ (product.rating ?? 0).toFixed(1) }}</span>
                </div>
              </div>
              <!-- Placeholder for products without rating to maintain layout -->
              <div v-else class="mb-3 h-[20px]"></div>

              <!-- Action Buttons (centered) -->
              <div class="flex justify-center">
                <button
                  @click="goToProductDetails(product.id)"
                  class="w-full py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-medium rounded hover:opacity-95 transition-colors mt-auto"
                  :disabled="product.totalStock === 0"
                >
                  {{ product.totalStock === 0 ? 'Out of Stock' : 'View Details' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="flex justify-center mt-8">
          <nav class="flex items-center gap-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg',
                  page === currentPage
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage >= pagination.totalPages"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()

const { products, loading, pagination } = storeToRefs(productStore)
const { user } = storeToRefs(authStore)
const { wishlistLoading } = storeToRefs(wishlistStore)

// Theme classes
const { pageBackgroundClasses, cardClasses, textClasses, catalogSortSelectClasses, buttonPrimaryClasses } = useThemeClasses()

// =======================
// 📦 State
// =======================

const currentPage = ref(1)
const sortBy = ref('name,asc')
const searchQuery = ref('')

// =======================
// 🧮 Computed Properties
// =======================

const breadcrumbs = computed(() => [
  { label: 'catalog.title', to: '/catalog' },
  { label: `Search Results${searchQuery.value ? ` for "${searchQuery.value}"` : ''}` },
])

// Calculate visible page numbers for pagination
const visiblePages = computed(() => {
  const totalPages = pagination.value.totalPages
  const current = currentPage.value
  const pages: number[] = []

  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Show smart pagination
    pages.push(1)

    if (current > 4) {
      pages.push(-1) // Represents "..."
    }

    const start = Math.max(2, current - 2)
    const end = Math.min(totalPages - 1, current + 2)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (current < totalPages - 3) {
      pages.push(-1) // Represents "..."
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }
  }

  return pages.filter(p => p > 0) // Remove ellipsis markers for this simple implementation
})

// =======================
// 🧪 Lifecycle & Effects
// =======================

onMounted(async () => {
  // Get search query from route
  const query = route.query.q as string
  if (query) {
    searchQuery.value = query
    const page = parseInt(route.query.page as string) || 1
    const sort = route.query.sort as string || 'name,asc'

    currentPage.value = page
    sortBy.value = sort

    // Perform search
    await performSearch(query, page - 1, 20, sort) // Convert to 0-indexed for API
  }

  // Load user wishlist if authenticated
  if (authStore.user?.id) {
    try {
      await wishlistStore.fetchUserWishlist(authStore.user.id)
      console.log('🟢 [SEARCH] Wishlist loaded successfully')
    } catch (error) {
      console.error('🔴 [SEARCH] Error loading wishlist:', error)
    }
  }
})

// =======================
// ⚙️ Methods
// =======================

const performSearch = async (query: string, page = 0, size = 20, sort = 'name,asc') => {
  try {
    await productStore.searchProductsAPI(query, page, size, sort)

    // Update current page to match backend response (convert back to 1-indexed)
    if (productStore.pagination.page !== undefined) {
      currentPage.value = productStore.pagination.page + 1
    }
  } catch (error) {
    console.error('🔴 [SEARCH] Error performing search:', error)
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp'
}

const isProductInWishlist = (productId: number) => {
  return wishlistStore.isProductInWishlist(productId)
}

const toggleFavorite = async (productId: number) => {
  console.log('🔵 [SEARCH] toggleFavorite called for product:', productId)

  // Check if user is authenticated
  if (!user.value || !user.value.id) {
    console.error('🔴 [SEARCH] User not authenticated')
    alert('Please log in to add products to your wishlist')
    return
  }

  // Find the product to get its data
  const product = productStore.products.find(p => p.id === productId)
  if (!product) {
    console.error('🔴 [SEARCH] Product not found:', productId)
    alert('Product not found')
    return
  }

  try {
    // Ensure wishlist is loaded
    if (!wishlistStore.wishlistId) {
      console.log('🟡 [SEARCH] Loading user wishlist...')
      await wishlistStore.fetchUserWishlist(user.value.id)
    }

    const isCurrentlyInWishlist = wishlistStore.isProductInWishlist(productId)
    console.log('🟡 [SEARCH] Product in wishlist before action:', isCurrentlyInWishlist)

    if (!isCurrentlyInWishlist) {
      console.log('🟡 [SEARCH] Adding product to wishlist...')

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
      console.log('✅ [SEARCH] Product added to wishlist')
    } else {
      console.log('🟡 [SEARCH] Removing product from wishlist...')
      await wishlistStore.removeProductFromWishlist(productId)
      console.log('✅ [SEARCH] Product removed from wishlist')
    }

    // Verify the state change
    const isInWishlistAfter = wishlistStore.isProductInWishlist(productId)
    console.log('🟡 [SEARCH] Product in wishlist after action:', isInWishlistAfter)

  } catch (error) {
    console.error('🔴 [SEARCH] Error toggling favorite:', error)
    alert('Error updating wishlist: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

const goToProductDetails = (productId: number) => {
  console.log('🟢 [SEARCH] goToProductDetails called with productId:', productId)

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
      console.log('🟢 [SEARCH] Navigation successful')
    })
    .catch((error) => {
      console.error('🔴 [SEARCH] Navigation error:', error)
    })
}

const goToPage = async (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    currentPage.value = page

    // Update URL with new page
    await router.push({
      query: {
        ...route.query,
        page: page.toString()
      }
    })

    // Perform search with new page (convert to 0-indexed for API)
    await performSearch(searchQuery.value, page - 1, 20, sortBy.value)

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleSortChange = async () => {
  currentPage.value = 1

  // Update URL with new sort and reset page
  await router.push({
    query: {
      ...route.query,
      sort: sortBy.value,
      page: '1'
    }
  })

  // Perform search with new sort
  await performSearch(searchQuery.value, 0, 20, sortBy.value)
}

// Watch for route changes (e.g., when user uses browser back/forward)
watch(() => route.query, async (newQuery) => {
  const query = newQuery.q as string
  const page = parseInt(newQuery.page as string) || 1
  const sort = newQuery.sort as string || 'name,asc'

  if (query && query !== searchQuery.value) {
    searchQuery.value = query
    currentPage.value = page
    sortBy.value = sort
    await performSearch(query, page - 1, 20, sort)
  }
})
</script>

<style scoped>
/* Truncate text after 2 lines */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

/* Remove default button focus styles */
button:focus {
  outline: none;
  box-shadow: none;
}
</style>
