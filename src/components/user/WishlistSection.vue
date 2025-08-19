<template>
  <section
    :id="sectionId"
    :class="['transition-colors duration-200', sectionContainerClasses]"
    aria-labelledby="wishlist-title"
  >
    <div class="flex items-center justify-between mb-6">
      <h2 id="wishlist-title" :class="['text-xl font-semibold font-srProDisplay', textClasses]">
        <span :class="sectionHeaderClasses">{{ $t('account.wishlist.title') }}</span>
      </h2>
      <router-link
        to="/wishlist"
        :class="['text-sm font-medium transition-colors', linkClasses, 'focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1']"
        :aria-label="`View all ${wishlistProducts.length} wishlist items`"
      >
        {{ $t('account.wishlist.viewAll') }}
      </router-link>
    </div>

    <!-- Loading state for wishlist -->
    <div v-if="wishlistLoading" class="flex items-center justify-center py-8" role="status" aria-live="polite">
      <div class="w-8 h-8 border-b-2 rounded-full animate-spin opacity-70" :class="['border-theme-text']" aria-hidden="true"></div>
      <span class="sr-only">Loading wishlist items...</span>
    </div>

    <!-- Error state for wishlist -->
    <div v-else-if="wishlistError" class="p-4 rounded-lg theme-error-bg theme-error-text" role="alert">
      <p class="text-sm font-semibold theme-error-text">{{ wishlistError }}</p>
    </div>

    <!-- Empty state when no wishlist items are available -->
    <div v-else-if="wishlistProducts.length === 0" class="py-8 text-center">
  <v-icon name="hi-heart" scale="2" :class="['mb-4 opacity-80', emptyStateIconClasses]" aria-hidden="true" />
      <p :class="['text-base font-srProDisplay', emptyStateTextClasses]">{{ $t('account.wishlist.emptyMessage') }}</p>
    </div>

    <!-- Display grid of wishlist items -->
    <div
      v-else
      class="grid grid-cols-1 gap-4 md:grid-cols-2"
      role="list"
      :aria-label="`${wishlistProducts.length} wishlist items`"
    >
      <div
        v-for="item in wishlistProducts.slice(0, 6)"
        :key="item.id"
        :class="['flex items-center gap-4 transition-all duration-200 group', listItemClasses]"
        role="listitem"
      >
        <div class="relative">
          <router-link
            :to="`/products/${item.id}`"
            class="block rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :aria-label="`View ${item.name} details`"
          >
            <img
              :src="item.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp'"
              :alt="item.name"
              class="object-contain w-16 h-16 p-2 transition-transform rounded-lg hover:scale-105"
              loading="lazy"
              width="64"
              height="64"
              :onerror="`this.src='https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp'`"
            />
          </router-link>
          <button
            @click="$emit('remove-from-wishlist', item.id, item.name)"
            :disabled="removeItemLoading[item.id]"
            class="absolute flex items-center justify-center w-6 h-6 transition-opacity rounded-full opacity-0 cursor-pointer -top-2 -right-2 group-hover:opacity-100 focus:outline-none focus:ring-2 hover:theme-error-bg disabled:opacity-50 disabled:cursor-not-allowed"
            :aria-label="`Remove ${item.name} from wishlist`"
            type="button"
          >
            <div v-if="removeItemLoading[item.id]" class="w-3 h-3 border rounded-full border-t-transparent animate-spin" :class="['border-theme-text']" aria-hidden="true"></div>
            <v-icon v-else name="hi-x" scale="0.8" class="theme-text" aria-hidden="true" />
          </button>
        </div>
        <div class="flex-1 min-w-0">
          <h4 :class="['mb-1 text-sm font-medium font-srProDisplay line-clamp-2', textClasses]">
            {{ item.name }}
          </h4>
          <p :class="['text-lg font-semibold font-srProDisplay', priceTextClasses]">
            ${{ item.basePrice.toFixed(2) }}
          </p>
        </div>
        <Button
          @click="$emit('add-to-cart', item.id, item.name)"
          :disabled="cartItemLoading[item.id] || addedToCartItems[item.id]"
          :text-color="addedToCartItems[item.id] ? '#16a34a' : 'white'"
          :bg-color="addedToCartItems[item.id] ? '#f0fdf4' : 'black'"
          :hover-bg-color="addedToCartItems[item.id] ? '#dcfce7' : '#333333'"
          :border-width="addedToCartItems[item.id] ? '1px' : '0'"
          :border-color="addedToCartItems[item.id] ? '#16a34a' : 'transparent'"
          width="auto"
          height="32px"
          class="px-3 text-sm transition-all duration-300 shrink-0"
          :aria-label="addedToCartItems[item.id] ? `${item.name} is in cart` : `Add ${item.name} to cart`"
        >
          <span v-if="cartItemLoading[item.id]" class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" aria-hidden="true"></div>
            <span class="sr-only">Adding to cart...</span>
            Adding...
          </span>
          <span v-else-if="addedToCartItems[item.id]" class="flex items-center gap-2">
            <v-icon name="hi-check" scale="0.9" class="text-green-600" aria-hidden="true" />
            Added to Cart
          </span>
          <span v-else>
            {{ $t('account.wishlist.addToCart') }}
          </span>
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '@/components/shared/Button.vue'

interface WishlistProduct {
  id: number
  name: string
  imageUrl?: string
  basePrice: number
}

interface Props {
  sectionId: string
  wishlistProducts: WishlistProduct[]
  wishlistLoading: boolean
  wishlistError: string
  cartItemLoading: { [key: number]: boolean }
  removeItemLoading: { [key: number]: boolean }
  addedToCartItems: { [key: number]: boolean }
  sectionContainerClasses: string
  textClasses: string
  sectionHeaderClasses: string
  linkClasses: string
  emptyStateIconClasses: string
  emptyStateTextClasses: string
  listItemClasses: string
  priceTextClasses: string
}

interface Emits {
  (e: 'add-to-cart', productId: number, productName: string): void
  (e: 'remove-from-wishlist', productId: number, productName: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
