<script setup lang="ts">
// ============================================================================
// IMPORTS
// ============================================================================

// Core Vue utilities
import { ref, onMounted, computed } from 'vue'

// Routing and i18n
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

// UI & Theme utilities
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useToast } from '@/composables/useToast'

// API client
import api from '@/lib/axios'

// ============================================================================
// INTERFACES & PROPS
// ============================================================================

/**
 * Represents a related product with minimal essential data.
 * This structure matches the API response exactly.
 */
interface RelatedProduct {
  id: number // Required — API always returns this
  name: string
  imageUrl: string
  basePrice: number
  category: {
    id: number
    name: string
    icon: string
  }
}

/**
 * Component configuration options.
 */
interface Props {
  productId: number // Required — used to fetch related items
  limit?: number // Optional — max number of products to show (default: 3)
  collapsible?: boolean // Optional — whether section can be collapsed (default: true)
  showTitle?: boolean // Optional — whether to display the title (default: true)
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  limit: 3,
  collapsible: true,
  showTitle: true
})

// ============================================================================
// COMPOSABLES & STORES
// ============================================================================

// Internationalization for multilingual support
const { t } = useI18n()

// User feedback system
const toast = useToast()

// Navigation
const router = useRouter()

// Dynamic theme classes for consistent UI
const {
  cardClasses,
  textClasses,
  textMutedClasses,
  buttonPrimaryClasses,
  hoverClasses
} = useThemeClasses()

// =============================================================================
// REACTIVE STATE
// =============================================================================

// List of related products fetched from API
const relatedProducts = ref<RelatedProduct[]>([])

// Loading state to manage UX during fetch
const loading = ref(false)

// Error message if fetch fails
const error = ref('')

// Whether the section is collapsed (if collapsible)
const collapsed = ref(false)

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================

/**
 * Determines if there are any related products to display.
 * Used to conditionally render content or fallbacks.
 */
const hasRelatedProducts = computed(() => relatedProducts.value.length > 0)

// =============================================================================
// 🛠️ UTILITY FUNCTIONS
// =============================================================================

/**
 * Formats a price number into a localized currency string.
 * Uses toLocaleString for better formatting (e.g., 1,000 instead of 1000).
 */
const formatPrice = (price: number): string => {
  return `$${price.toLocaleString()}`
}

/**
 * Toggles the visibility of the related products section.
 * Only active if `collapsible` prop is true.
 */
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

/**
 * Handles click on a related product.
 * Safely navigates to product details with scroll-to-top behavior.
 */
const handleProductClick = (product: RelatedProduct) => {
  try {
    if (!product) {
      console.warn('RelatedProducts: handleProductClick received falsy product')
      return
    }

    if (!product.id) {
      console.warn('RelatedProducts: Product missing ID', product)
      toast.info(product.name || 'Product', { duration: 2000 })
      return
    }

    // Normalize category name for routing
    const rawCategory = product.category?.name
    const categoryName = rawCategory ? String(rawCategory).toLowerCase() : 'all-products'

    const to = {
      name: 'productDetails',
      params: { categoryName, productId: String(product.id) }
    }

    // Perform navigation
    router.push(to).then(() => {
      // Smooth scroll to top after navigation
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch {
        window.scrollTo(0, 0) // Fallback for older browsers
      }
    }).catch((navErr) => {
      console.error('RelatedProducts: Navigation failed:', navErr)
      toast.error('Could not navigate to product details', { duration: 3000 })
    })
  } catch (err) {
    console.error('RelatedProducts: Unexpected error in handleProductClick:', err)
    toast.error('An unexpected error occurred', { duration: 3000 })
  }
}

/**
 * Fallback handler for broken image URLs.
 * Replaces broken image with a default placeholder.
 */
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp'
  }
}

// ============================================================================
// DATA FETCHING
// ============================================================================

/**
 * Fetches related products from the backend API.
 * Respects the `limit` prop (capped at 10 for performance).
 */
const fetchRelatedProducts = async () => {
  if (!props.productId) {
    console.warn('RelatedProducts: No productId provided, skipping fetch')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await api.get(`/products/${props.productId}/related`, {
      params: {
        limit: Math.min(props.limit, 10) // Prevent excessive requests
      }
    })

    relatedProducts.value = response.data || []

    console.log(`RelatedProducts: Fetched ${relatedProducts.value.length} items for product ID ${props.productId}`)
  } catch (err) {
    console.error('RelatedProducts: Failed to fetch related products:', err)
    error.value = 'Failed to load related products'

    // Notify user of failure
    toast.error('Failed to load related products', { duration: 3000 })
  } finally {
    loading.value = false
  }
}

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================

// On mount: fetch related products
onMounted(() => {
  fetchRelatedProducts()
})
</script>

<template>
  <!-- Main Section: Only shown if loading or has products -->
  <section
    v-if="hasRelatedProducts || loading"
    :class="['w-full flex justify-center py-32', 'theme-surface']"
  >
    <div class="w-full max-w-[1640px] px-8">
      <!-- Header with Title and Collapse Toggle -->
      <div v-if="showTitle" class="flex items-center justify-between mb-2">
        <h2 :class="['text-2xl font-semibold text-left mb-8', textClasses]">
          {{ t('catalog.relatedProducts', 'Related Products') }}
        </h2>

        <!-- Collapse Button (only if collapsible) -->
        <button
          v-if="collapsible"
          @click="toggleCollapse"
          :class="['p-1 transition-colors rounded', hoverClasses]"
          type="button"
          :aria-label="t('catalog.toggleRelatedProducts', 'Toggle related products section')"
        >
          <v-icon
            name="hi-chevron-down"
            :class="[
              'w-5 h-5 transition-transform duration-200',
              textClasses,
              { 'rotate-180': collapsed }
            ]"
            scale="1.2"
          />
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span :class="['ml-3', textClasses]">{{ t('common.loading', 'Loading...') }}</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error && !hasRelatedProducts"
        :class="['text-center py-16', textMutedClasses]"
      >
        <p>{{ t('catalog.relatedProductsError', 'Unable to load related products') }}</p>
      </div>

      <!-- Related Products Grid (with collapse animation) -->
      <transition name="fade-details">
        <div v-show="!collapsed && hasRelatedProducts">
          <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div
              v-for="product in relatedProducts"
              :key="product.id"
              :class="[
                'rounded-[15px] p-8 text-center hover:shadow-lg transition-all duration-300 cursor-pointer',
                cardClasses,
                hoverClasses
              ]"
              @click="handleProductClick(product)"
              role="button"
              tabindex="0"
              @keydown.enter="handleProductClick(product)"
              @keydown.space.prevent="handleProductClick(product)"
            >
              <!-- Product Image -->
              <div class="flex items-center justify-center w-full h-32 mb-6">
                <img
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="object-contain h-full w-full max-w-[120px] transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  @error="handleImageError"
                />
              </div>

              <!-- Product Info -->
              <h3 :class="['font-srProDisplay text-lg font-medium mb-2', textClasses]">
                {{ product.name }}
              </h3>
              <p :class="['font-srProDisplay text-sm mb-4', textMutedClasses]">
                {{ t('catalog.startingAt', 'Starting at') }} {{ formatPrice(product.basePrice) }}
              </p>

              <!-- Action Button -->
              <button
                :class="['w-full py-2 px-4 rounded-lg transition-colors', buttonPrimaryClasses]"
              >
                {{ t('catalog.viewDetails', 'View Details') }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Empty State: No products found -->
      <div
        v-if="!loading && !hasRelatedProducts && !error"
        :class="['text-center py-16', textMutedClasses]"
      >
        <p>{{ t('catalog.noRelatedProducts', 'No related products found') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================================================
   ANIMATIONS
   ============================================================================
*/

/* Fade in/out animation for related products section */
.fade-details-enter-active,
.fade-details-leave-active {
  transition: all 0.3s ease;
}

.fade-details-enter-from,
.fade-details-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ============================================================================
   HOVER EFFECTS
   ============================================================================
*/

/* Subtle lift effect on hover */
.product-card:hover {
  transform: translateY(-2px);
}

/* Image scale on hover */
.product-image-hover {
  transition: transform 0.3s ease;
}

.product-image-hover:hover {
  transform: scale(1.05);
}
</style>
