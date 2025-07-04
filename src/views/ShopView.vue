<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black">
    <Wrapper class="py-8">
      <!-- Breadcrumb -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <!-- Hero Section -->
      <section class="max-w-4xl mx-auto text-center mb-16">
        <h1 class="font-srProDisplay text-5xl font-medium mb-6 text-black">{{ t('shop.title') }}</h1>
        <p class="font-srProDisplay text-lg text-[#787878] mb-8 leading-relaxed">
          {{ t('shop.description') }}
        </p>
      </section>

      <!-- Category Filter -->
      <section class="max-w-6xl mx-auto mb-16">
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'px-6 py-3 rounded-lg font-srProDisplay font-medium transition-all duration-200',
              selectedCategory === category.id
                ? 'bg-black text-white'
                : 'bg-[#f8f8f8] text-black hover:bg-[#2E2E2E] hover:text-white'
            ]"
          >
            {{ category.name }}
          </button>
          <button
            @click="selectedCategory = null"
            :class="[
              'px-6 py-3 rounded-lg font-srProDisplay font-medium transition-all duration-200',
              selectedCategory === null
                ? 'bg-black text-white'
                : 'bg-[#f8f8f8] text-black hover:bg-[#2E2E2E] hover:text-white'
            ]"
          >
            {{ t('shop.categories.all') }}
          </button>
        </div>
      </section>

      <!-- Products Grid -->
      <section class="max-w-6xl mx-auto mb-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-white border border-[#e5e5e5] rounded-[15px] overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <!-- Product Image -->
            <div class="aspect-square bg-[#f8f8f8] relative overflow-hidden">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute top-4 right-4">
                <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200">
                  <v-icon name="hi-heart" class="w-5 h-5 text-[#787878] hover:text-red-500" />
                </button>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-6">
              <div class="mb-2">
                <span class="text-sm font-srProDisplay text-[#787878]">{{ product.category }}</span>
              </div>
              <h3 class="font-srProDisplay text-xl font-medium mb-2 text-black">
                {{ product.name }}
              </h3>
              <p class="font-srProDisplay text-[#787878] text-sm mb-4 line-clamp-2">
                {{ product.description }}
              </p>

              <!-- Price -->
              <div class="flex items-center justify-between mb-4">
                <div>
                  <span class="font-srProDisplay text-2xl font-medium text-black">
                    {{ formatPrice(product.price) }}
                  </span>
                  <span v-if="product.originalPrice" class="ml-2 text-sm text-[#787878] line-through">
                    {{ formatPrice(product.originalPrice) }}
                  </span>
                </div>
                <div v-if="product.originalPrice" class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                  -{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
                </div>
              </div>

              <!-- Add to Cart Button -->
              <Button
                text-color="white"
                bg-color="black"
                border-width="1px"
                border-color="black"
                hover-bg-color="#2E2E2E"
                hover-text-color="white"
                width="100%"
                height="48px"
                @click="addToCart(product)"
              >
                <span class="flex items-center justify-center gap-2">
                  <v-icon name="hi-shopping-cart" class="w-4 h-4" />
                  {{ t('shop.product.addToCart') }}
                </span>
              </Button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-16">
          <div class="w-16 h-16 mx-auto mb-4 bg-[#f6f6f6] rounded-full flex items-center justify-center">
            <v-icon name="hi-shopping-bag" class="w-8 h-8 text-[#787878]" />
          </div>
          <h3 class="font-srProDisplay text-xl font-medium mb-2 text-black">{{ t('shop.empty.title') }}</h3>
          <p class="font-srProDisplay text-[#787878]">
            {{ t('shop.empty.description') }}
          </p>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="max-w-4xl mx-auto text-center bg-[#2E2E2E] rounded-[15px] p-12">
        <h2 class="font-srProDisplay text-3xl font-medium mb-4 text-white">{{ t('shop.cta.title') }}</h2>
        <p class="font-srProDisplay text-[#CCCCCC] mb-8 leading-relaxed">
          {{ t('shop.cta.description') }}
        </p>
        <Button
          text-color="black"
          bg-color="white"
          border-width="1px"
          border-color="white"
          hover-bg-color="#f0f0f0"
          hover-text-color="black"
          width="200px"
          height="48px"
          @click="goToContact"
        >
          <span class="flex items-center gap-2">
            <v-icon name="hi-mail" class="w-4 h-4" />
            {{ t('shop.cta.contact') }}
          </span>
        </Button>
      </section>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import Wrapper from '@/components/shared/Wrapper.vue'
import Button from '@/components/shared/Button.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'

// Router
const router = useRouter()

// i18n
const { t } = useLanguage()

// Breadcrumb config
const breadcrumbs = [
  { label: t('nav.products') }
]

// State
const selectedCategory = ref<number | null>(null)

// Mock data - In a real app, this would come from an API
const categories = ref([
  { id: 1, name: t('shop.categories.mobiles') },
  { id: 2, name: t('shop.categories.headphones') },
  { id: 3, name: t('shop.categories.computers') },
  { id: 4, name: t('shop.categories.smartwatches') },
  { id: 5, name: t('shop.categories.cameras') }
])

const products = ref([
  {
    id: 1,
    name: 'iPhone 14 Pro',
    description: 'El iPhone más avanzado con cámara profesional y chip A16 Bionic.',
    price: 1099,
    originalPrice: 1199,
    category: 'Moviles',
    categoryId: 1,
    image: '/images/Iphone-14-pro-black.png'
  },
  {
    id: 2,
    name: 'AirPods Pro',
    description: 'Auriculares inalámbricos con cancelación activa de ruido.',
    price: 249,
    category: 'Auriculares',
    categoryId: 2,
    image: '/images/Apple-airPods.png'
  },
  {
    id: 3,
    name: 'MacBook Pro',
    description: 'Portátil profesional con chip M2 para máximo rendimiento.',
    price: 1999,
    category: 'Ordenadores',
    categoryId: 3,
    image: '/images/Macbook.png'
  },
  {
    id: 4,
    name: 'Apple Watch',
    description: 'Reloj inteligente con seguimiento avanzado de salud.',
    price: 399,
    originalPrice: 449,
    category: 'Relojes Inteligentes',
    categoryId: 4,
    image: '/images/Apple-Watch.png'
  },
  {
    id: 5,
    name: 'Galaxy Buds',
    description: 'Auriculares inalámbricos Samsung con sonido premium.',
    price: 149,
    category: 'Auriculares',
    categoryId: 2,
    image: '/images/Galaxy-buds-FE.png'
  },
  {
    id: 6,
    name: 'Samsung Watch',
    description: 'Reloj inteligente Samsung con pantalla AMOLED.',
    price: 299,
    category: 'Relojes Inteligentes',
    categoryId: 4,
    image: '/images/Samsung-Watch.png'
  }
])

// Computed
const filteredProducts = computed(() => {
  if (selectedCategory.value === null) {
    return products.value
  }
  return products.value.filter(product => product.categoryId === selectedCategory.value)
})

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  categoryId: number
  image: string
}

const addToCart = (product: Product) => {
  // Add to cart logic
  console.log('Added to cart:', product.name)
  // You would typically dispatch to a Pinia store here
}

const goToContact = () => {
  router.push('/contact')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
