<script setup lang="ts">
function openProductUrl(url?: string) {
  if (url) {
    window.open(url, '_blank')
  }
}
import { useWishlistStore } from '@/stores/wishlist'
import '@/assets/base.css'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import LoadingState from '@/components/shared/LoadingState.vue'
import ErrorAlert from '@/components/shared/ErrorAlert.vue'
import EmptyWishlistState from '@/components/wishlist/EmptyWishlistState.vue'
import WishlistProductCard from '@/components/wishlist/WishlistProductCard.vue'

import { useAuthStore } from '@/stores/auth'
const router = useRouter()
const { t } = useLanguage()

const authStore = useAuthStore()
const {
  wishlistProducts,
  wishlistLoading,
  wishlistError,
  fetchUserWishlist,
} = useWishlistStore()

const removeFromWishlist = (productId: number) => {
  wishlistProducts.value = wishlistProducts.value.filter((item: import('@/stores/wishlist').WishlistProduct) => item.id !== productId)
}

function goToProduct(productId: number) {
  router.push({ name: 'productDetails', params: { productId } })
}

onMounted(() => {
  if (authStore.user?.id) {
    fetchUserWishlist(authStore.user.id)
  }
})
</script>

<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black min-h-screen">
    <Wrapper class="py-8">
      <!-- Breadcrumb -->
      <BreadcrumbNav
        :breadcrumbs="[{ label: t('wishlist.title') || 'Wishlist', to: '/wishlist' }]"
      />

      <!-- Header -->
      <section class="max-w-7xl mx-auto mb-8">
        <h1 class="font-srProDisplay text-2xl font-semibold text-left text-black">
          {{ t('wishlist.title') || 'Wishlist' }}
        </h1>
      </section>

      <!-- Wishlist Content -->
      <section class="max-w-7xl mx-auto mb-16 animate-fadeInUp">
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

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="item in wishlistProducts"
              :key="item.id"
              class="relative rounded-xl bg-white shadow-lg border border-gray-100 flex flex-col overflow-hidden transition hover:shadow-xl cursor-pointer group"
              @click="openProductUrl(item.productUrl)"
            >
              <!-- Remove 'x' button -->
              <button
                class="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 text-gray-500 hover:text-white transition"
                @click.stop="removeFromWishlist(item.id)"
                aria-label="{{ t('wishlist.remove') || 'Remove' }}"
              >
                <span class="text-lg font-bold">&times;</span>
              </button>
              <div class="bg-gray-50 flex items-center justify-center h-48">
                <img :src="item.imageUrl" :alt="item.name" class="h-40 object-contain group-hover:scale-105 transition-transform duration-200" />
              </div>
              <div class="p-5 flex flex-col flex-1">
                <h2 class="font-srProDisplay text-lg font-semibold mb-1 text-black">{{ item.name }}</h2>
                <p class="text-sm text-gray-500 mb-2">{{ item.description }}</p>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{{ item.brand }}</span>
                  <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">${{ item.basePrice }}</span>
                  <span v-if="item.screenSize" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{{ item.screenSize }}</span>
                  <span v-if="item.ramCapacity" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">RAM: {{ item.ramCapacity }}GB</span>
                  <span v-if="item.storageCapacity" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">Almacenamiento: {{ item.storageCapacity }}GB</span>
                  <span v-if="item.operatingSystem" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{{ item.operatingSystem }}</span>
                  <span v-if="item.totalStock !== undefined" class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">Stock: {{ item.totalStock }}</span>
                </div>
                <div class="flex flex-col items-center mt-auto">
                  <button
                    class="w-full bg-black text-white py-2.5 px-4 rounded-md font-srProDisplay text-sm font-medium hover:bg-gray-800 transition-colors"
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
