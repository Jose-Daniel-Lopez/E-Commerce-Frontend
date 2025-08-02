<script setup lang="ts">
function openProductUrl(url?: string) {
  if (url) {
    window.open(url, '_blank')
  }
}
import { useWishlistStore } from '@/stores/wishlistStore'
import '@/assets/base.css'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import { storeToRefs } from 'pinia'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import LoadingState from '@/components/shared/LoadingState.vue'
import ErrorAlert from '@/components/shared/ErrorAlert.vue'
import EmptyWishlistState from '@/components/wishlist/EmptyWishlistState.vue'

import { useAuthStore } from '@/stores/auth'
import { useUserCartStore } from '@/stores/userCart'
import { useProductVariantsStore } from '@/stores/productVariants'
import { useToast } from '@/composables/useToast'
const router = useRouter()
const { t } = useLanguage()
const toast = useToast()

const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const userCartStore = useUserCartStore()
const productVariantsStore = useProductVariantsStore()
const { wishlistProducts, wishlistLoading, wishlistError } = storeToRefs(wishlistStore)

// Cart functionality state
const loadingItems = ref<Set<number>>(new Set())
const addedToCartItems = ref<Set<number>>(new Set())

const removeFromWishlist = async (productId: number) => {
  await wishlistStore.removeProductFromWishlist(productId)
}

// Add to cart functionality
const addToCartFromWishlist = async (productId: number) => {
  try {
    loadingItems.value.add(productId)

    // Fetch available variants for the product
    await productVariantsStore.fetchVariantsByProduct(productId)
    const variants = productVariantsStore.variants

    if (!variants || variants.length === 0) {
      toast.error('No variants available for this product', {
        title: 'Cart Error',
        duration: 4000
      })
      return
    }

    // Use the first available variant with stock
    const availableVariant = variants.find(variant => variant.stock > 0)

    if (!availableVariant) {
      toast.error('Product is out of stock', {
        title: 'Cart Error',
        duration: 4000
      })
      return
    }

    // Add to cart
    const result = await userCartStore.addProductToCart(availableVariant.id)

    if (result.success) {
      addedToCartItems.value.add(productId)
      toast.success('Product added to cart successfully!', {
        title: 'Added to Cart',
        duration: 3000
      })

      // Refresh cart after successful addition
      setTimeout(() => {
        if (authStore.user?.id) {
          userCartStore.fetchUserCart(authStore.user.id)
        }
      }, 500)
    } else {
      toast.error(result.error || 'Failed to add product to cart', {
        title: 'Cart Error',
        duration: 4000
      })
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    toast.error('An unexpected error occurred', {
      title: 'Error',
      duration: 4000
    })
  } finally {
    loadingItems.value.delete(productId)
  }
}

// Check which wishlist products are already in cart
const checkWishlistProductsInCart = () => {
  if (!userCartStore.cart?.cartItems) return

  // Extract product IDs from cart items
  const cartProductIds = new Set<number>()

  userCartStore.cart.cartItems.forEach(cartItem => {
    if (cartItem.product?.id) {
      cartProductIds.add(cartItem.product.id)
    } else if (cartItem._links?.productVariant?.href) {
      // Extract product ID from productVariant link if needed
      const productLink = cartItem._links.productVariant.href
      const productIdMatch = productLink.match(/\/products\/(\d+)/)
      if (productIdMatch) {
        cartProductIds.add(parseInt(productIdMatch[1]))
      }
    }
  })

  // Mark wishlist products that are in cart as "added"
  addedToCartItems.value.clear()
  wishlistProducts.value.forEach(product => {
    if (cartProductIds.has(product.id)) {
      addedToCartItems.value.add(product.id)
    }
  })
}

function goToProduct(productId: number) {
  router.push({ name: 'productDetails', params: { productId } })
}

onMounted(() => {
  if (authStore.user?.id) {
    wishlistStore.fetchUserWishlist(authStore.user.id)
    // Initialize cart and check which products are already in cart
    userCartStore.fetchUserCart(authStore.user.id).then(() => {
      checkWishlistProductsInCart()
    })
  }
})

// Watch for changes in wishlist and re-check cart status
watch(() => wishlistProducts.value, () => {
  checkWishlistProductsInCart()
}, { deep: true })
</script>

<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black min-h-screen">
    <Wrapper class="py-8">
      <!-- Breadcrumb -->
      <BreadcrumbNav
        :breadcrumbs="[{ label: t('wishlist.title') || 'Wishlist', to: '/wishlist' }]"
      />

      <!-- Header -->
      <section class="mx-auto mb-8 max-w-7xl">
        <h1 class="text-2xl font-semibold text-left text-black font-srProDisplay">
          {{ t('wishlist.title') || 'Wishlist' }}
        </h1>
      </section>

      <!-- Wishlist Content -->
      <section class="mx-auto mb-16 max-w-7xl animate-fadeInUp">
        <LoadingState
          v-if="wishlistLoading"
          :loading-text="t('wishlist.loading') || 'Loading...'"
        />

        <ErrorAlert
          v-else-if="wishlistError"
          :message="wishlistError"
          :show="!!wishlistError"
        />

        <div v-else>
          <EmptyWishlistState
            v-if="wishlistProducts.length === 0"
            :empty-title="t('wishlist.empty') || 'Your wishlist is empty.'"
            :empty-description="t('wishlist.emptyDescription') || 'Browse products and add your favorites here.'"
            :catalog-button-text="t('wishlist.goToCatalog') || 'Go to Catalog'"
            @go-to-catalog="() => router.push('/catalog')"
          />

          <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="item in wishlistProducts"
              :key="item.id"
              class="relative flex flex-col overflow-hidden transition bg-white border border-gray-100 shadow-lg cursor-pointer rounded-xl hover:shadow-xl group"
              @click="openProductUrl(item.productUrl)"
            >
              <!-- Remove 'x' button -->
              <button
                class="absolute z-10 flex items-center justify-center w-8 h-8 text-gray-500 transition bg-gray-100 rounded-full top-3 right-3 hover:bg-red-500 hover:text-white"
                @click.stop="removeFromWishlist(item.id)"
                aria-label="{{ t('wishlist.remove') || 'Remove' }}"
              >
                <span class="text-lg font-bold">&times;</span>
              </button>
              <div class="flex items-center justify-center h-48 bg-gray-50">
                <img :src="item.imageUrl" :alt="item.name" class="object-contain h-40 transition-transform duration-200 group-hover:scale-105" />
              </div>
              <div class="flex flex-col flex-1 p-5">
                <h2 class="mb-1 text-lg font-semibold text-black font-srProDisplay">{{ item.name }}</h2>
                <p class="mb-2 text-sm text-gray-500">{{ item.description }}</p>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded">{{ item.brand }}</span>
                  <span class="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">${{ item.basePrice }}</span>
                  <span v-if="item.screenSize" class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded">{{ item.screenSize }}</span>
                  <span v-if="item.ramCapacity" class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded">RAM: {{ item.ramCapacity }}GB</span>
                  <span v-if="item.storageCapacity" class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded">Almacenamiento: {{ item.storageCapacity }}GB</span>
                  <span v-if="item.operatingSystem" class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded">{{ item.operatingSystem }}</span>
                  <span v-if="item.totalStock !== undefined" class="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">Stock: {{ item.totalStock }}</span>
                </div>
                <div class="flex flex-col items-center mt-auto space-y-2">
                  <button
                    v-if="!addedToCartItems.has(item.id)"
                    :disabled="loadingItems.has(item.id)"
                    class="w-full bg-black text-white py-2.5 px-4 rounded-md font-srProDisplay text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    @click.stop="addToCartFromWishlist(item.id)"
                  >
                    <span v-if="loadingItems.has(item.id)">Adding...</span>
                    <span v-else>{{ t('cart.addToCart') || 'Add to Cart' }}</span>
                  </button>
                  <button
                    v-else
                    disabled
                    class="w-full bg-green-600 text-white py-2.5 px-4 rounded-md font-srProDisplay text-sm font-medium cursor-not-allowed"
                    @click.stop
                  >{{ t('cart.addedToCart') || 'Added to Cart' }}</button>
                  <button
                    class="w-full bg-gray-100 text-black py-2.5 px-4 rounded-md font-srProDisplay text-sm font-medium hover:bg-gray-200 transition-colors"
                    @click.stop="goToProduct(item.id)"
                  >{{ t('wishlist.details') || 'View details' }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<style scoped></style>
