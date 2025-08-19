<template>
  <div class="rounded-xl p-6 flex flex-col shadow-sm hover:shadow-lg transition cursor-pointer animate-fadeInUp theme-card theme-border" @click="$emit('goToProduct', product.id)">
  <img :src="product.image || '/images/Favorites.png'" :alt="product.name" class="w-full h-48 object-contain mb-4 rounded-lg" />
    <h3 class="font-srProDisplay text-lg font-semibold mb-2">{{ product.name }}</h3>
    <p class="font-srProDisplay theme-muted-text text-sm mb-4">{{ product.description }}</p>
    <div class="flex items-center justify-between mt-auto">
      <span class="font-srProDisplay theme-text text-lg font-bold">{{ formatPrice(product.price) }}</span>
      <button @click.stop="$emit('remove', product.id)" class="px-4 py-2 rounded-lg font-srProDisplay transition flex items-center justify-center theme-error-bg theme-error-text hover:opacity-90">
        <OhVueIcon name="bi-trash" :scale="1.2" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OhVueIcon } from 'oh-vue-icons'

interface WishlistProduct {
  id: number
  name: string
  description: string
  price: number
  image: string
}

defineProps<{
  product: WishlistProduct
}>()

defineEmits<{
  goToProduct: [productId: number]
  remove: [productId: number]
}>()

/**
 * Format price with proper currency formatting
 * For now using dollars, but can be easily changed to euros
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}
</script>
