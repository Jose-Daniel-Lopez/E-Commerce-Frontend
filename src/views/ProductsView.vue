<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  totalStock: number
  category?: {
    id: number
    name: string
  }
  productVariants?: Array<any>
  productReviews?: Array<any>
}

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/products')
    // Si usas Spring Data REST, los productos están en response.data._embedded.products
    products.value = response.data._embedded ? response.data._embedded.products : response.data
  } catch (err) {
    console.error('Error fetching products:', err)
    error.value = 'Error al cargar los productos'
  } finally {
    loading.value = false
  }
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Catálogo de Productos</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Explora nuestra selección de productos disponibles
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Cargando productos...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center"
      >
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay productos</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Aún no hay productos disponibles en el catálogo
        </p>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- Product Image Placeholder -->
          <div class="h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center">
            <div class="text-4xl">🛍️</div>
          </div>

          <div class="p-6">
            <!-- Category Badge -->
            <div class="mb-3">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
              >
                {{ product.category?.name || 'Sin categoría' }}
              </span>
            </div>

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
                    product.totalStock > 10 ? 'bg-green-500' : 
                    product.totalStock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                  ]"
                ></div>
                <span class="text-sm text-gray-600 dark:text-gray-300">
                  {{ product.totalStock }} en stock
                </span>
              </div>
            </div>

            <!-- Product Actions -->
            <div class="flex space-x-2">
              <button
                :disabled="product.totalStock === 0"
                :class="[
                  'flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors',
                  product.totalStock > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                ]"
              >
                {{ product.totalStock > 0 ? 'Agregar al carrito' : 'Agotado' }}
              </button>
              <button
                class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                👁️
              </button>
            </div>

            <!-- Product ID -->
            <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                ID: {{ product.id }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Count -->
      <div v-if="products.length > 0" class="mt-12 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
        >
          <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
            Total: {{ products.length }} producto{{ products.length !== 1 ? 's' : '' }}
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>