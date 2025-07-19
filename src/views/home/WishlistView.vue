<script setup lang="ts">
import '@/assets/base.css'
import { ref } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'

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
        <div v-if="loading" class="flex justify-center items-center h-40">
          <span class="text-gray-500">{{ t('wishlist.loading') || 'Loading...' }}</span>
        </div>
        <div
          v-else-if="error"
          class="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 animate-slideDown"
        >
          <p class="font-srProDisplay text-sm text-red-700">{{ error }}</p>
        </div>
        <div v-else>
          <div v-if="wishlist.length === 0" class="text-center text-[#666] py-16 animate-fadeInUp">
            <img
              src="/public/images/Favorites.png"
              alt="Wishlist"
              class="mx-auto mb-6 w-24 h-24 opacity-60"
            />
            <h2 class="font-srProDisplay text-xl font-semibold mb-2">
              {{ t('wishlist.empty') || 'Your wishlist is empty.' }}
            </h2>
            <p class="font-srProDisplay text-[#999] text-sm mb-6">
              {{ t('wishlist.emptyDescription') || 'Browse products and add your favorites here.' }}
            </p>
            <button
              @click="() => router.push('/catalog')"
              class="px-6 py-3 bg-black text-white rounded-xl font-srProDisplay hover:bg-gray-900 transition"
            >
              {{ t('wishlist.goToCatalog') || 'Go to Catalog' }}
            </button>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="item in wishlist"
              :key="item.id"
              class="bg-white border border-[#EBEBEB] rounded-xl p-6 flex flex-col shadow-sm hover:shadow-lg transition cursor-pointer animate-fadeInUp"
              @click="goToProduct(item.id)"
            >
              <img
                :src="item.image || '/public/images/Favorites.png'"
                :alt="item.name"
                class="w-full h-48 object-contain mb-4 rounded-lg bg-gray-50"
              />
              <h3 class="font-srProDisplay text-lg font-semibold mb-2">{{ item.name }}</h3>
              <p class="font-srProDisplay text-[#666] text-sm mb-4">{{ item.description }}</p>
              <div class="flex items-center justify-between mt-auto">
                <span class="font-srProDisplay text-black text-lg font-bold"
                  >${{ item.price }}</span
                >
                <button
                  @click.stop="removeFromWishlist(item.id)"
                  class="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-srProDisplay hover:bg-red-200 transition flex items-center justify-center"
                >
                  <OhVueIcon name="bi-trash" :scale="1.2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<style scoped></style>
