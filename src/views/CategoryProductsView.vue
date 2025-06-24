<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  totalStock: number
}

interface Category {
  id: number
  name: string
}

const route = useRoute()
const products = ref<Product[]>([])
const category = ref<Category | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const categoryId = route.params.categoryId as string
  
  try {
    // Obtener productos de la categoría
    const productsResponse = await axios.get(`http://localhost:8080/api/categories/${categoryId}/products`)
    products.value = productsResponse.data._embedded ? productsResponse.data._embedded.products : productsResponse.data
    
    // Obtener información de la categoría
    const categoryResponse = await axios.get(`http://localhost:8080/api/categories/${categoryId}`)
    category.value = categoryResponse.data
  } catch (err) {
    console.error('Error fetching category products:', err)
    error.value = 'Error al cargar los productos de la categoría'
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
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ category?.name || 'Categoría' }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Productos disponibles en esta categoría
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
          No hay productos disponibles en esta categoría
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
            </div>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-12 text-center">
        <button
          @click="$router.go(-1)"
          class="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
        >
          <span class="mr-2">←</span>
          Volver a categorías
        </button>
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