<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useToast } from '@/composables/useToast'
import api from '@/lib/axios'

// === Interfaces ===
interface RelatedProduct {
  name: string
  imageUrl: string
  basePrice: number
}

interface Props {
  productId: number
  limit?: number
  collapsible?: boolean
  showTitle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  limit: 3,
  collapsible: true,
  showTitle: true
})

// === Composables ===
const { t } = useI18n()
const toast = useToast()

// === Theme Classes ===
const {
  cardClasses,
  textClasses,
  textMutedClasses,
  buttonPrimaryClasses,
  hoverClasses
} = useThemeClasses()

// === State ===
const relatedProducts = ref<RelatedProduct[]>([])
const loading = ref(false)
const error = ref('')
const collapsed = ref(false)

// === Computed ===
const hasRelatedProducts = computed(() => relatedProducts.value.length > 0)

// === Methods ===
const formatPrice = (price: number) => `$${price.toLocaleString()}`

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

const handleProductClick = (product: RelatedProduct) => {
  // For now, we'll show a toast since we don't have product slugs or IDs
  // In a real implementation, you'd navigate to the product details page
  toast.info(`Viewing ${product.name}`, {
    duration: 2000
  })

  // Example of how you might navigate if you had product IDs:
  // router.push(`/catalog/products/${productId}`)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp'
  }
}

const fetchRelatedProducts = async () => {
  if (!props.productId) {
    console.warn('No product ID provided for related products')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await api.get(`/products/${props.productId}/related`, {
      params: {
        limit: Math.min(props.limit, 10) // Ensure we don't exceed max of 10
      }
    })

    relatedProducts.value = response.data || []

    console.log(`Fetched ${relatedProducts.value.length} related products for product ${props.productId}`)
  } catch (err) {
    console.error('Error fetching related products:', err)
    error.value = 'Failed to load related products'

    // Optional: Show error toast
    toast.error('Failed to load related products', {
      duration: 3000
    })
  } finally {
    loading.value = false
  }
}

// === Lifecycle ===
onMounted(() => {
  fetchRelatedProducts()
})
</script>

<template>
  <section v-if="hasRelatedProducts || loading" :class="['w-full flex justify-center py-32', 'theme-surface']">
    <div class="w-full max-w-[1640px] px-8">
      <!-- Header with optional collapse button -->
      <div v-if="showTitle" class="flex items-center justify-between mb-2">
        <h2 :class="['text-2xl font-semibold text-left mb-8', textClasses]">
          {{ t('catalog.relatedProducts', 'Related Products') }}
        </h2>
        <button
          v-if="collapsible"
          @click="toggleCollapse"
          :class="['p-1 transition-colors rounded', hoverClasses]"
          type="button"
          :aria-label="t('catalog.toggleRelatedProducts', 'Toggle related products section')"
        >
          <v-icon
            name="hi-chevron-down"
            :class="['w-5 h-5 transition-transform duration-200', textClasses, { 'rotate-180': collapsed }]"
            scale="1.2"
          />
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span :class="['ml-3', textClasses]">{{ t('common.loading', 'Loading...') }}</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error && !hasRelatedProducts" :class="['text-center py-16', textMutedClasses]">
        <p>{{ t('catalog.relatedProductsError', 'Unable to load related products') }}</p>
      </div>

      <!-- Related Products Grid -->
      <transition name="fade-details">
        <div v-show="!collapsed && hasRelatedProducts">
          <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div
              v-for="(product, index) in relatedProducts"
              :key="`${product.name}-${index}`"
              :class="[
                'rounded-[15px] p-8 text-center hover:shadow-lg transition-all duration-300 cursor-pointer',
                cardClasses,
                hoverClasses
              ]"
              @click="handleProductClick(product)"
              role="button"
              :tabindex="0"
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

              <!-- View Details Button -->
              <button :class="['w-full py-2 px-4 rounded-lg transition-colors', buttonPrimaryClasses]">
                {{ t('catalog.viewDetails', 'View Details') }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Empty State (when no related products found) -->
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
/* Collapsible section animations */
.fade-details-enter-active,
.fade-details-leave-active {
  transition: all 0.3s ease;
}

.fade-details-enter-from,
.fade-details-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Product card hover effects */
.product-card:hover {
  transform: translateY(-2px);
}

/* Image hover effect */
.product-image-hover {
  transition: transform 0.3s ease;
}

.product-image-hover:hover {
  transform: scale(1.05);
}
</style>
