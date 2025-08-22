<template>
  <div class="flex items-center gap-6 py-8">
  <img
      :src="item.product?.imageUrl || getProductImage(item.product?.name)"
      :alt="item.product?.name"
      :class="[
        'w-24 h-24 object-contain rounded-lg',
    'theme-surface'
      ]"
    />
    <div class="flex-1">
      <h3 :class="[
        'font-srProDisplay text-lg font-medium mb-1',
        textClasses
      ]">
        {{ item.product?.name }}
      </h3>
      <p :class="[
        'text-sm mb-1',
        textSecondaryClasses
      ]">#{{ item.productVariant?.sku }}</p>
      <QuantityButton
        :quantity="item.quantity"
        @increment="$emit('increment', item.id, item.quantity)"
        @decrement="$emit('decrement', item.id, item.quantity)"
      />
    </div>
    <div class="flex flex-col items-end gap-2">
      <span :class="[
        'font-srProDisplay text-lg font-semibold',
        textClasses
      ]">{{
        formatPrice(item.product?.basePrice ? item.product.basePrice * item.quantity : 0)
      }}</span>
      <button
        :class="[
          'text-2xl transition-colors cursor-pointer',
          'theme-muted-text hover:theme-error-text'
        ]"
        @click="$emit('remove', item.id)"
      >
        <v-icon name="hi-x" scale="1.2" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import QuantityButton from '@/components/cart/QuantityButton.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

// Theme classes
const { textClasses, textSecondaryClasses } = useThemeClasses()


interface Product {
  name: string
  basePrice: number
  imageUrl?: string
}

interface CartItem {
  id: number
  quantity: number
  product?: Product
  productVariant?: {
    sku: string
  }
}

defineProps<{
  item: CartItem
}>()

defineEmits<{
  increment: [itemId: number, currentQuantity: number]
  decrement: [itemId: number, currentQuantity: number]
  remove: [itemId: number]
}>()

/**
 * Format price with proper currency formatting
 * Converts from cents (API format) to euros and formats with Spanish locale
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

// Helper to get product image. This is a placeholder since the API doesn't provide images.
function getProductImage(productName: string | undefined) {
  if (!productName) return '/public/images/logo.webp'
  if (productName.toLowerCase().includes('iphone 14'))
    return '/public/images/Iphone-14-pro-purple.png'
  if (productName.toLowerCase().includes('airpods max')) return '/public/images/Apple-airPods.png'
  if (productName.toLowerCase().includes('apple watch')) return '/public/images/Apple-Watch.png'
  return '/public/images/logo.webp'
}
</script>
