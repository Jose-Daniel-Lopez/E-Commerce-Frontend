<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import ProductPagination from '@/components/products/ProductPagination.vue'
import api from '@/lib/axios'

interface Category {
  id: number
  name: string
}

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const category = ref<Category | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const categoryId = route.params.categoryId as string

  try {
    // Obtener información de la categoría
    const categoryResponse = await api.get(`/categories/${categoryId}`)
    category.value = categoryResponse.data

    // Obtener productos de la categoría usando el store
    await productsStore.fetchProductsByCategory(Number(categoryId))
  } catch (err) {
    console.error('Error fetching category products:', err)
    error.value = 'Error loading category products'
  } finally {
    loading.value = false
  }
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

const viewProductDetails = (productId: number) => {
  router.push({ name: 'productDetails', params: { productId: productId.toString() } })
}
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ category?.name || 'Category' }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Products available in this category
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading || productsStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Loading products...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error || productsStore.error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2"
      >
        <v-icon name="hi-exclamation-circle" scale="1.2" />
        <span>{{ error || productsStore.error }}</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="productsStore.products.length === 0" class="text-center py-12">
        <div class="flex justify-center mb-4">
          <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
            <v-icon name="hi-shopping-bag" scale="3" class="text-gray-400 dark:text-gray-600" />
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
        <p class="text-gray-600 dark:text-gray-300">
          No products are available in this category
        </p>
      </div>

      <!-- Products Grid -->
      <div v-else class="space-y-6">
        <!-- Pagination - Top -->
        <ProductPagination />

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="product in productsStore.products"
            :key="product.id"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <!-- Product Image Placeholder -->
            <div
              class="h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center"
            >
              <v-icon
                name="hi-shopping-cart"
                scale="3"
                class="text-emerald-600 dark:text-emerald-400"
              />
            </div>

            <div class="p-6">
              <!-- Product Name -->
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {{ product.name }}
              </h3>

              <!-- Product Description -->
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {{ product.description }}
              </p>

              <!-- Price and Stock -->
              <div class="flex items-center justify-between mb-4">
                <span class="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {{ formatPrice(product.basePrice) }}
                </span>
                <div class="flex items-center space-x-2">
                  <div
                    :class="[
                      'w-2 h-2 rounded-full',
                      product.totalStock > 10
                        ? 'bg-green-500'
                        : product.totalStock > 0
                          ? 'bg-yellow-500'
                          : 'bg-red-500',
                    ]"
                  ></div>
                  <span class="text-sm text-gray-600 dark:text-gray-300">
                    {{ product.totalStock }} in stock
                  </span>
                </div>
              </div>

              <!-- Product Actions -->
              <div class="space-y-2">
                <button
                  @click="viewProductDetails(product.id)"
                  class="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  <v-icon name="hi-eye" scale="1" />
                  <span>View details</span>
                </button>
                <button
                  :disabled="product.totalStock === 0"
                  :class="[
                    'w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors',
                    product.totalStock > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed',
                  ]"
                >
                  {{ product.totalStock > 0 ? 'Add to cart' : 'Out of stock' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination - Bottom -->
        <ProductPagination />
      </div>

      <!-- Back Button -->
      <div class="mt-12 text-center">
        <button
          @click="$router.go(-1)"
          class="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
        >
          <v-icon name="hi-arrow-left" scale="1.1" />
          <span>Back to categories</span>
        </button>
      </div>

      <!-- Products Count -->
      <div v-if="productsStore.products.length > 0" class="mt-8 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
        >
          <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
            Showing {{ productsStore.products.length }} of {{ productsStore.pagination.totalElements }} products
            (Page {{ productsStore.pagination.page + 1 }} of {{ productsStore.pagination.totalPages }})
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
