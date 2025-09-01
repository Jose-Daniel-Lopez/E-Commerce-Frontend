<script setup lang="ts">
import { useProductStore } from '@/stores/products'
import { computed } from 'vue'

const productStore = useProductStore()

// Use global stats if available, otherwise use pagination info
const totalProducts = computed(
  () => productStore.stats.totalProducts || productStore.pagination.totalElements,
)

const inStockProductsCount = computed(
  () => productStore.stats.inStockProducts || productStore.inStockProducts.length,
)

const outOfStockProductsCount = computed(
  () => productStore.stats.outOfStockProducts || productStore.outOfStockProducts.length,
)

const averagePrice = computed(() => productStore.stats.averagePrice || productStore.averagePrice)
</script>

<template>
  <!-- Statistics Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <!-- Total Products -->
  <div class="rounded-xl shadow-lg border theme-border theme-card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium theme-muted-text">Total Products</p>
          <p class="text-2xl font-bold theme-text">{{ totalProducts }}</p>
        </div>
        <div class="p-3 rounded-full" :style="{ background: 'var(--color-primary-100)' }">
          <v-icon name="hi-shopping-bag" scale="1.5" :style="{ color: 'var(--color-primary)' }" />
        </div>
      </div>
    </div>

    <!-- In Stock Products -->
  <div class="rounded-xl shadow-lg border theme-border theme-card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium theme-muted-text">In Stock</p>
          <p class="text-2xl font-bold" :style="{ color: 'var(--color-success)' }">
            {{ inStockProductsCount }}
          </p>
        </div>
        <div class="p-3 rounded-full" :style="{ background: 'var(--color-success-bg)' }">
          <v-icon name="hi-check-circle" scale="1.5" :style="{ color: 'var(--color-success)' }" />
        </div>
      </div>
    </div>

    <!-- Out of Stock Products -->
  <div class="rounded-xl shadow-lg border theme-border theme-card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium theme-muted-text">Out of Stock</p>
          <p class="text-2xl font-bold" :style="{ color: 'var(--color-error)' }">
            {{ outOfStockProductsCount }}
          </p>
        </div>
        <div class="p-3 rounded-full" :style="{ background: 'var(--color-error-bg)' }">
          <v-icon name="hi-x-circle" scale="1.5" :style="{ color: 'var(--color-error)' }" />
        </div>
      </div>
    </div>

    <!-- Average Price -->
  <div class="rounded-xl shadow-lg border theme-border theme-card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium theme-muted-text">Average Price</p>
          <p class="text-2xl font-bold" :style="{ color: 'var(--color-warning)' }">
            €{{ averagePrice.toFixed(2) }}
          </p>
        </div>
        <div class="p-3 rounded-full" :style="{ background: 'var(--color-warning-bg)' }">
          <v-icon
            name="hi-currency-euro"
            scale="1.5"
            :style="{ color: 'var(--color-warning)' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
