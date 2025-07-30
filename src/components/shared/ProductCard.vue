<template>
  <div
    class="relative h-auto rounded-[9px] bg-[#f6f6f6] px-3 py-6 duration-500 hover:scale-[1.02] hover:shadow-md md:h-[435px] md:px-4"
  >
    <!-- Debug Panel (only visible in development) -->
    <div
      v-if="showDebug"
      class="absolute bottom-0 left-0 right-0 bg-yellow-100 border border-yellow-300 p-2 text-xs z-30 rounded-b-[9px] max-h-32 overflow-y-auto"
    >
      <div><strong>Debug Info:</strong></div>
      <div class="font-bold" :class="product.id > 0 ? 'text-green-600' : 'text-red-600'">
        Product ID: {{ product.id }} ({{ typeof product.id }}) {{ product.id > 0 ? '✅' : '❌ INVALID' }}
      </div>
      <div>Fav: {{ isFavorite ? '❤️' : '🤍' }} | Toggle: {{ isToggling ? '⏳' : '✅' }}</div>
      <div>User: {{ user?.id || 'None' }} | WL ID: {{ wishlistId || 'None' }} | Count: {{ wishlistProducts.length }}</div>
      <div v-if="wishlistStore.wishlistError" class="text-red-600">Error: {{ wishlistStore.wishlistError }}</div>
    </div>

    <div class="absolute top-4 right-4 z-40">
      <button
        @click="toggleFavorite"
        class="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 transform hover:scale-110"
        type="button"
        aria-label="Toggle favorite"
        :disabled="isToggling"
      >
        <svg
          v-if="!isFavorite"
          class="w-6 h-6 text-gray-600 hover:text-red-600 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <svg
          v-else
          class="w-6 h-6 text-red-600 animate-pulse"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>

    <div class="flex flex-col h-full">
      <div class="flex items-center justify-center mb-6">
        <div class="h-[104px] w-[104px] md:h-[160px] md:w-[160px]">
          <img
            :src="product.image.url"
            :alt="product.image.altText"
            class="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      </div>

      <div class="flex flex-col flex-1 gap-6">
        <div class="flex flex-col gap-4">
          <div class="h-[75px] sm:h-[50px]">
            <a href="#" @click.prevent class="block">
              <h3
                class="text-center font-srProDisplay text-base font-medium hover:text-indigo-600 transition-colors"
              >
                {{ truncatedName }}
              </h3>
            </a>
          </div>

          <div class="flex justify-center items-center gap-2">
            <span v-if="hasDiscount" class="font-figtree text-xl font-semibold text-green-600">
              ${{ product.discountPrice }}
            </span>
            <span
              v-if="hasDiscount"
              class="font-figtree text-lg font-medium text-gray-500 line-through"
            >
              ${{ product.originalPrice }}
            </span>
            <span v-if="!hasDiscount" class="font-figtree text-xl font-semibold">
              {{ isUpcoming ? 'N/A' : `$${product.originalPrice}` }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-center mt-auto">
          <Button
            height="48px"
            width="183px"
            bg-color="black"
            text-color="white"
            text-size="14px"
            font-weight="500"
            hover-bg-color="#1a1a1a"
            :disabled="isUpcoming"
            @click="handleBuyNow"
          >
            {{ isUpcoming ? 'Próximamente' : 'Comprar' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import Button from './Button.vue'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAuthStore } from '@/stores/auth'

interface ProductImage {
  url: string
  altText: string
}

interface Product {
  id: number
  name: string
  image: ProductImage
  discountPrice?: string | number
  originalPrice: string | number
  featureType?: string
}

interface Props {
  product: Product
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
})

const isToggling = ref(false)
const showDebug = ref(true) // Set to false to hide debug info

const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const { user } = storeToRefs(authStore)
const { wishlistProducts, wishlistId } = storeToRefs(wishlistStore)

const truncatedName = computed(() => {
  return props.product.name.length <= 40
    ? props.product.name
    : `${props.product.name.slice(0, 40)}...`
})

const hasDiscount = computed(() => {
  return props.product.discountPrice && props.product.discountPrice !== ''
})

const isUpcoming = computed(() => {
  return props.product.featureType === 'Up Coming...' || props.product.originalPrice === 'N/A'
})

const isFavorite = computed(() => {
  return wishlistProducts.value.some(item => item.id === props.product.id)
})

const toggleFavorite = async () => {
  console.log('🔵 [PRODUCT CARD] toggleFavorite called for product:', props.product.id)
  console.log('🔵 [PRODUCT CARD] Full product object:', props.product)
  console.log('🔵 [PRODUCT CARD] Product ID type:', typeof props.product.id)
  console.log('🔵 [PRODUCT CARD] Product ID value:', props.product.id)
  console.log('🔵 [PRODUCT CARD] Is Product ID valid?', props.product.id && props.product.id > 0)
  console.log('🔵 [PRODUCT CARD] Current isFavorite state:', isFavorite.value)
  console.log('🔵 [PRODUCT CARD] Current user:', user.value)
  console.log('🔵 [PRODUCT CARD] Current wishlistId:', wishlistId.value)
  console.log('🔵 [PRODUCT CARD] Current isToggling:', isToggling.value)

  // Validate product ID first
  if (!props.product.id || props.product.id <= 0) {
    console.error('🔴 [PRODUCT CARD] Invalid product ID:', props.product.id)
    alert('❌ Error: Invalid product ID (' + props.product.id + '). Cannot add to wishlist.')
    return
  }

  if (!user.value || !user.value.id) {
    console.error('🔴 [PRODUCT CARD] User not authenticated')
    alert('User not authenticated - please log in')
    return
  }

  if (isToggling.value) {
    console.warn('🟠 [PRODUCT CARD] Already toggling, ignoring click')
    return // Prevent multiple clicks
  }

  isToggling.value = true
  console.log('🟡 [PRODUCT CARD] Setting isToggling to true')

  try {
    // Ensure wishlist is loaded and wishlistId is set
    if (!wishlistId.value) {
      console.log('🟡 [PRODUCT CARD] No wishlistId, fetching user wishlist...')
      await wishlistStore.fetchUserWishlist(user.value.id)
      console.log('🟡 [PRODUCT CARD] After fetch, wishlistId:', wishlistId.value)
    }

    const favoriteStateBefore = isFavorite.value
    console.log('🟡 [PRODUCT CARD] Favorite state before action:', favoriteStateBefore)

    if (!favoriteStateBefore) {
      console.log('🟡 [PRODUCT CARD] Adding product to wishlist with ID:', props.product.id)

      // Pass product data to help create a better wishlist entry
      const productData = {
        name: props.product.name,
        description: props.product.name, // Using name as description since we don't have description in the interface
        brand: 'Unknown', // Not available in current interface
        isFeatured: false,
        basePrice: typeof props.product.originalPrice === 'number' ? props.product.originalPrice : 0,
        totalStock: 0, // Not available in current interface
        imageUrl: props.product.image?.url,
      }

      await wishlistStore.addProductToWishlist(props.product.id, productData)
      console.log('🟢 [PRODUCT CARD] Add operation completed')
    } else {
      console.log('🟡 [PRODUCT CARD] Removing product from wishlist...')
      await wishlistStore.removeProductFromWishlist(props.product.id)
      console.log('🟢 [PRODUCT CARD] Remove operation completed')
    }

    const favoriteStateAfter = isFavorite.value
    console.log('🟡 [PRODUCT CARD] Favorite state after action:', favoriteStateAfter)
    console.log('🟡 [PRODUCT CARD] State change successful:', favoriteStateBefore !== favoriteStateAfter)

    // Show success feedback
    if (!favoriteStateBefore && favoriteStateAfter) {
      alert('✅ Product added to wishlist!')
    } else if (favoriteStateBefore && !favoriteStateAfter) {
      alert('✅ Product removed from wishlist!')
    } else {
      alert('⚠️ State didn\'t change as expected - check console for details')
    }

  } catch (error) {
    console.error('🔴 [PRODUCT CARD] Error toggling favorite:', error)
    alert('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
  } finally {
    isToggling.value = false
    console.log('🟡 [PRODUCT CARD] Setting isToggling to false')
  }
}

const handleBuyNow = () => {
  if (!isUpcoming.value) {
    // Add to cart logic or navigate to product details
    console.log('Buy now clicked for product:', props.product.id)
  }
}
</script>
