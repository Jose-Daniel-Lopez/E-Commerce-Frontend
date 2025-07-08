<script setup lang="ts">
import { useProductsStore } from '@/stores/products'
import { computed } from 'vue'

const productsStore = useProductsStore()

// Use global stats if available, otherwise use pagination info
const totalProducts = computed(() =>
  productsStore.stats.totalProducts || productsStore.pagination.totalElements
)

const inStockProductsCount = computed(() =>
  productsStore.stats.inStockProducts || productsStore.inStockProducts.length
)

const outOfStockProductsCount = computed(() =>
  productsStore.stats.outOfStockProducts || productsStore.outOfStockProducts.length
)

const averagePrice = computed(() =>
  productsStore.stats.averagePrice || productsStore.averagePrice
)
</script>

<template>
  <!-- Statistics Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <!-- Total Products -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Products</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalProducts }}</p>
        </div>
        <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
          <v-icon name="hi-shopping-bag" scale="1.5" class="text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>

    <!-- In Stock Products -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">In Stock</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ inStockProductsCount }}
          </p>
        </div>
        <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
          <v-icon name="hi-check-circle" scale="1.5" class="text-green-600 dark:text-green-400" />
        </div>
      </div>
    </div>

    <!-- Out of Stock Products -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Out of Stock</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">
            {{ outOfStockProductsCount }}
          </p>
        </div>
        <div class="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
          <v-icon name="hi-x-circle" scale="1.5" class="text-red-600 dark:text-red-400" />
        </div>
      </div>
    </div>

    <!-- Average Price -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Average Price</p>
          <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            €{{ averagePrice.toFixed(2) }}
          </p>
        </div>
        <div class="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
          <v-icon name="hi-currency-euro" scale="1.5" class="text-yellow-600 dark:text-yellow-400" />
        </div>
      </div>
    </div>
  </div>
</template>
