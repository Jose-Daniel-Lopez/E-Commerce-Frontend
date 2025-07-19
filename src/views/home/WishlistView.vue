<script setup lang="ts">
import '@/assets/base.css'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import LoadingState from '@/components/shared/LoadingState.vue'
import ErrorAlert from '@/components/shared/ErrorAlert.vue'
import EmptyWishlistState from '@/components/wishlist/EmptyWishlistState.vue'
import WishlistProductCard from '@/components/wishlist/WishlistProductCard.vue'

const { t } = useLanguage()
const router = useRouter()

// Hardcoded product list (ejemplo similar a ShopView.vue y ProductsView (new design).vue)
interface WishlistProduct {
  id: number
  name: string
  description: string
  price: number
  image: string
}

const wishlist = ref<WishlistProduct[]>([
  {
    id: 1,
    name: 'iPhone 14 Pro',
    description: 'El iPhone más avanzado con cámara profesional y chip A16 Bionic.',
    price: 1099,
    image: '/images/Iphone-14-pro-black.png',
  },
  {
    id: 2,
    name: 'AirPods Pro',
    description: 'Auriculares inalámbricos con cancelación activa de ruido.',
    price: 249,
    image: '/images/Apple-airPods.png',
  },
  {
    id: 3,
    name: 'MacBook Pro',
    description: 'Portátil profesional con chip M2 para máximo rendimiento.',
    price: 1999,
    image: '/images/Macbook.png',
  },
  {
    id: 4,
    name: 'Apple Watch',
    description: 'Reloj inteligente con seguimiento avanzado de salud.',
    price: 399,
    image: '/images/Apple-Watch.png',
  },
  {
    id: 5,
    name: 'Galaxy Buds',
    description: 'Auriculares inalámbricos Samsung con sonido premium.',
    price: 149,
    image: '/images/Galaxy-buds-FE.png',
  },
])

const loading = ref(false)
const error = ref('')

const removeFromWishlist = (productId: number) => {
  wishlist.value = wishlist.value.filter((item) => item.id !== productId)
}

function goToProduct(productId: number) {
  router.push({ name: 'productDetails', params: { productId } })
}
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
          v-if="loading" 
          :loading-text="t('wishlist.loading') || 'Loading...'" 
        />
        
        <ErrorAlert 
          v-else-if="error" 
          :message="error"
          :show="!!error"
        />
        
        <div v-else>
          <EmptyWishlistState
            v-if="wishlist.length === 0"
            :empty-title="t('wishlist.empty') || 'Your wishlist is empty.'"
            :empty-description="t('wishlist.emptyDescription') || 'Browse products and add your favorites here.'"
            :catalog-button-text="t('wishlist.goToCatalog') || 'Go to Catalog'"
            @go-to-catalog="() => router.push('/catalog')"
          />
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <WishlistProductCard
              v-for="item in wishlist"
              :key="item.id"
              :product="item"
              @go-to-product="goToProduct"
              @remove="removeFromWishlist"
            />
          </div>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<style scoped></style>
