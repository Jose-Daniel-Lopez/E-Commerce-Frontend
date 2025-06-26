<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()
const router = useRouter()

onMounted(async () => {
  await productsStore.fetchProducts()
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
        <div class="flex justify-center mb-4">
          <div class="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
            <v-icon name="hi-shopping-bag" scale="2.5" class="text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Product Catalog</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Explore our selection of available products
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="productsStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Loading products...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="productsStore.error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2"
      >
        <v-icon name="hi-exclamation-circle" scale="1.2" />
        <span>{{ productsStore.error }}</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="productsStore.products.length === 0" class="text-center py-12">
        <div class="flex justify-center mb-4">
          <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
            <v-icon name="hi-shopping-bag" scale="3" class="text-gray-400 dark:text-gray-600" />
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
        <p class="text-gray-600 dark:text-gray-300">No products were found in the catalog</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in productsStore.products"
          :key="product.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- Product Image Placeholder -->
          <div
            class="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center"
          >
            <v-icon name="hi-shopping-bag" scale="3" class="text-gray-400 dark:text-gray-500" />
          </div>

          <div class="p-6">
            <!-- Product Name -->
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {{ product.name }}
            </h3>

            <!-- Product Description -->
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {{ product.description }}
            </p>

            <!-- Product Info Grid -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <!-- Price -->
              <div class="text-center">
                <div class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {{ formatPrice(product.basePrice) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Base price</div>
              </div>

              <!-- Stock -->
              <div class="text-center">
                <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {{ product.totalStock }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">In stock</div>
              </div>
            </div>

            <!-- Category Badge -->
            <div v-if="product.category" class="mb-4">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
              >
                {{ product.category.name }}
              </span>
            </div>

            <!-- Product Actions -->
            <div class="space-y-2">
              <button
                @click="viewProductDetails(product.id)"
                class="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <v-icon name="hi-eye" scale="1" />
                <span>View details</span>
              </button>
              <div class="flex space-x-2">
                <button
                  class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <v-icon name="hi-pencil" scale="0.9" />
                  <span>Edit</span>
                </button>
                <button
                  class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                >
                  <v-icon name="hi-trash" scale="0.9" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            <!-- Product ID -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span class="text-xs text-gray-500 dark:text-gray-400"> ID: {{ product.id }} </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Product Button -->
      <div class="mt-12 text-center">
        <button
          class="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
          <v-icon name="hi-plus" scale="1.1" />
          <span>Add new product</span>
        </button>
      </div>

      <!-- Products Count -->
      <div v-if="productsStore.products.length > 0" class="mt-8 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
        >
          <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
            Total: {{ productsStore.productCount }} product{{
              productsStore.productCount !== 1 ? 's' : ''
            }}
          </span>
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}
</style>
