<template>
  <div
    class="bg-white border border-[#EBEBEB] rounded-xl p-6 flex flex-col shadow-sm hover:shadow-lg transition cursor-pointer animate-fadeInUp"
    @click="$emit('goToProduct', product.id)"
  >
    <img
      :src="product.image || '/public/images/Favorites.png'"
      :alt="product.name"
      class="w-full h-48 object-contain mb-4 rounded-lg bg-gray-50"
    />
    <h3 class="font-srProDisplay text-lg font-semibold mb-2">{{ product.name }}</h3>
    <p class="font-srProDisplay text-[#666] text-sm mb-4">{{ product.description }}</p>
    <div class="flex items-center justify-between mt-auto">
      <span class="font-srProDisplay text-black text-lg font-bold">{{ formatPrice(product.price) }}</span>
      <button
        @click.stop="$emit('remove', product.id)"
        class="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-srProDisplay hover:bg-red-200 transition flex items-center justify-center"
      >
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
