<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductVariantsStore } from '@/stores/productVariants'
import api from '@/lib/axios'

interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  totalStock: number
  _links?: {
    productReviews?: {
      href: string
    }
    productVariants?: {
      href: string
    }
    category?: {
      href: string
    }
  }
}

interface ProductReview {
  id: number
  rating: number
  comment: string
  user?: {
    name: string
  }
}

interface Category {
  id: number
  name: string
}

const route = useRoute()
const product = ref<Product | null>(null)
const reviews = ref<ProductReview[]>([])
const category = ref<Category | null>(null)
const productVariantsStore = useProductVariantsStore()
const loading = ref(true)
const error = ref('')
const activeTab = ref('details')

onMounted(async () => {
  const productId = route.params.productId as string
  await fetchProductDetails(productId)
})

const fetchProductDetails = async (productId: string) => {
  try {
    loading.value = true
    error.value = ''

    // Fetch product details
    const productResponse = await api.get(`/products/${productId}`)
    product.value = productResponse.data

    // Fetch product reviews
    try {
      const reviewsResponse = await api.get(`/products/${productId}/productReviews`)
      reviews.value = reviewsResponse.data._embedded
        ? reviewsResponse.data._embedded.productReviews
        : reviewsResponse.data
    } catch {
      console.log('No reviews found for this product')
      reviews.value = []
    }

    // Fetch product variants using the store
    await productVariantsStore.fetchVariantsByProduct(parseInt(productId))

    // Fetch category
    try {
      const categoryResponse = await api.get(`/products/${productId}/category`)
      category.value = categoryResponse.data
    } catch {
      console.log('No category found for this product')
      category.value = null
    }

  } catch (err) {
    console.error('Error fetching product details:', err)
    error.value = 'Error loading product details'
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

const getStockStatus = (stock: number) => {
  if (stock === 0) return { text: 'Out of stock', color: 'text-red-600', bgColor: 'bg-red-100' }
  if (stock <= 10) return { text: 'Low stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
  return { text: 'In stock', color: 'text-green-600', bgColor: 'bg-green-100' }
}

const getAverageRating = () => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return Math.round((sum / reviews.value.length) * 10) / 10
}

const getRatingStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => i < rating)
}
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Loading product details...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2"
      >
        <v-icon name="hi-exclamation-circle" scale="1.2" />
        <span>{{ error }}</span>
      </div>

      <!-- Product Details -->
      <div v-else-if="product" class="space-y-8">
        <!-- Product Header -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Product Image Placeholder -->
              <div class="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl h-96 flex items-center justify-center">
                <v-icon name="hi-shopping-cart" scale="6" class="text-emerald-600 dark:text-emerald-400" />
              </div>

              <!-- Product Info -->
              <div class="space-y-6">
                <div>
                  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ product.name }}
                  </h1>
                  <p class="text-lg text-gray-600 dark:text-gray-300">
                    {{ product.description }}
                  </p>
                </div>

                <!-- Price -->
                <div class="flex items-center space-x-4">
                  <span class="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {{ formatPrice(product.basePrice) }}
                  </span>
                  <div
                    :class="`px-3 py-1 rounded-full text-sm font-medium ${getStockStatus(product.totalStock).bgColor} ${getStockStatus(product.totalStock).color}`"
                  >
                    {{ getStockStatus(product.totalStock).text }}
                  </div>
                </div>

                <!-- Stock Info -->
                <div class="flex items-center space-x-2">
                  <v-icon name="hi-cube" scale="1.2" class="text-gray-500" />
                  <span class="text-gray-600 dark:text-gray-300">
                    {{ product.totalStock }} units available
                  </span>
                </div>

                <!-- Category -->
                <div v-if="category" class="flex items-center space-x-2">
                  <v-icon name="hi-tag" scale="1.2" class="text-gray-500" />
                  <span class="text-gray-600 dark:text-gray-300">Category:</span>
                  <span class="font-semibold text-blue-600 dark:text-blue-400">
                    {{ category.name }}
                  </span>
                </div>

                <!-- Rating -->
                <div v-if="reviews.length > 0" class="flex items-center space-x-2">
                  <div class="flex items-center space-x-1">
                    <span
                      v-for="(filled, index) in getRatingStars(Math.floor(getAverageRating()))"
                      :key="index"
                      :class="filled ? 'text-yellow-400' : 'text-gray-300'"
                    >
                      ★
                    </span>
                  </div>
                  <span class="text-gray-600 dark:text-gray-300">
                    {{ getAverageRating() }} ({{ reviews.length }} reviews)
                  </span>
                </div>

                <!-- Actions -->
                <div class="flex space-x-4">
                  <button
                    :disabled="product.totalStock === 0"
                    :class="[
                      'flex-1 py-3 px-6 rounded-lg font-medium transition-colors',
                      product.totalStock > 0
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed',
                    ]"
                  >
                    {{ product.totalStock > 0 ? 'Add to Cart' : 'Out of Stock' }}
                  </button>
                  <button
                    class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <v-icon name="hi-heart" scale="1.2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <!-- Tab Headers -->
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex space-x-8 px-8 pt-6">
              <button
                @click="activeTab = 'details'"
                :class="[
                  'pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'details'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Details
              </button>
              <button
                @click="activeTab = 'variants'"
                :class="[
                  'pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'variants'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Variants ({{ productVariantsStore.variantCount }})
              </button>
              <button
                @click="activeTab = 'reviews'"
                :class="[
                  'pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'reviews'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Reviews ({{ reviews.length }})
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-8">
            <!-- Details Tab -->
            <div v-if="activeTab === 'details'" class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Product ID</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ product.id }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Base Price</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatPrice(product.basePrice) }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Stock</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ product.totalStock }} units</dd>
                  </div>
                  <div v-if="category">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ category.name }}</dd>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-md font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                <p class="text-gray-600 dark:text-gray-300">{{ product.description }}</p>
              </div>

              <!-- Variants Summary -->
              <div v-if="productVariantsStore.hasVariants">
                <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Variants Summary</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                    <div class="flex items-center space-x-2">
                      <v-icon name="hi-cube" scale="1.2" class="text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p class="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Variants</p>
                        <p class="text-lg font-bold text-emerald-700 dark:text-emerald-300">{{ productVariantsStore.variantCount }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div class="flex items-center space-x-2">
                      <v-icon name="hi-collection" scale="1.2" class="text-blue-600 dark:text-blue-400" />
                      <div>
                        <p class="text-sm font-medium text-blue-600 dark:text-blue-400">Total Stock</p>
                        <p class="text-lg font-bold text-blue-700 dark:text-blue-300">{{ productVariantsStore.totalVariantStock }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div class="flex items-center space-x-2">
                      <v-icon name="hi-exclamation-circle" scale="1.2" class="text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <p class="text-sm font-medium text-yellow-600 dark:text-yellow-400">Low Stock</p>
                        <p class="text-lg font-bold text-yellow-700 dark:text-yellow-300">{{ productVariantsStore.lowStockVariants.length }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Colors and Sizes -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Available Colors</h5>
                    <div class="flex flex-wrap gap-2">
                      <div
                        v-for="color in productVariantsStore.uniqueColors"
                        :key="color"
                        class="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
                      >
                        <div :class="`w-3 h-3 rounded-full border border-gray-300 ${productVariantsStore.getColorClass(color)}`"></div>
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ color }}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Available Sizes</h5>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="size in productVariantsStore.uniqueSizes"
                        :key="size"
                        class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        {{ size }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Variants Tab -->
            <div v-else-if="activeTab === 'variants'">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Variants</h3>
              <div v-if="!productVariantsStore.hasVariants" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">No variants available for this product</p>
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="variant in productVariantsStore.variants"
                  :key="variant.id"
                  class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <!-- Variant Header -->
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      <v-icon name="hi-cube" scale="1.1" class="text-emerald-600 dark:text-emerald-400" />
                      <span class="font-semibold text-gray-900 dark:text-white">{{ variant.sku }}</span>
                    </div>
                    <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${productVariantsStore.getStockStatus(variant.stock).bgColor} ${productVariantsStore.getStockStatus(variant.stock).color}`">
                      {{ productVariantsStore.getStockStatus(variant.stock).text }}
                    </span>
                  </div>

                  <!-- Size & Color -->
                  <div class="space-y-3 mb-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Size:</span>
                      <div class="flex items-center space-x-1">
                        <v-icon :name="productVariantsStore.getSizeIcon(variant.size)" scale="0.9" class="text-gray-500" />
                        <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ variant.size }}</span>
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Color:</span>
                      <div class="flex items-center space-x-2">
                        <div :class="`w-4 h-4 rounded-full border border-gray-300 ${productVariantsStore.getColorClass(variant.color)}`"></div>
                        <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ variant.color }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Stock -->
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-300">Stock available:</span>
                    <span class="font-bold text-gray-900 dark:text-white">{{ variant.stock }} units</span>
                  </div>

                  <!-- Variant ID -->
                  <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span class="text-xs text-gray-500 dark:text-gray-400">ID: {{ variant.id }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews Tab -->
            <div v-else-if="activeTab === 'reviews'">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Reviews</h3>
              <div v-if="reviews.length === 0" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">No reviews available for this product</p>
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-2">
                      <span class="font-medium text-gray-900 dark:text-white">
                        {{ review.user?.name || 'Anonymous' }}
                      </span>
                      <div class="flex items-center">
                        <span
                          v-for="(filled, index) in getRatingStars(review.rating)"
                          :key="index"
                          :class="filled ? 'text-yellow-400' : 'text-gray-300'"
                          class="text-sm"
                        >
                          ★
                        </span>
                      </div>
                    </div>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ review.rating }}/5
                    </span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-300">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Back Button -->
        <div class="text-center">
          <button
            @click="$router.go(-1)"
            class="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            <v-icon name="hi-arrow-left" scale="1.1" />
            <span>Back to products</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
