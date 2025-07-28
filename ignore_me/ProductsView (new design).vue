<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'  // Commented out until needed
import { useProductStore } from '@/stores/products'

const productStore = useProductStore()
const router = useRouter()  // Commented out until needed

// Filter states
const priceRange = ref({ min: 1200, max: 1200 })
// const selectedBrands = ref<string[]>(['Apple'])  // Commented out until needed
const sortBy = ref('rating')

// Mock data for demonstration
const brands = [
  { name: 'Apple', count: 110, checked: true },
  { name: 'Samsung', count: 125, checked: false },
  { name: 'Xiaomi', count: 68, checked: false },
  { name: 'Poco', count: 44, checked: false },
  { name: 'OPPO', count: 36, checked: false },
  { name: 'Honor', count: 10, checked: false },
  { name: 'Motorola', count: 34, checked: false },
  { name: 'Nokia', count: 22, checked: false },
  { name: 'Realme', count: 35, checked: false }
]

const memoryOptions = [
  { value: '16GB', count: 85, checked: false },
  { value: '32GB', count: 148, checked: false },
  { value: '64GB', count: 126, checked: false },
  { value: '128GB', count: 80, checked: true },
  { value: '256GB', count: 68, checked: false },
  { value: '512GB', count: 4, checked: false }
]

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: 'Apple iPhone 14 Pro 512GB Gold (MQ233)',
    price: 1437,
    image: '/images/Iphone-14-pro-Gold.png',
    favorite: false
  },
  {
    id: 2,
    name: 'Apple iPhone 11 128GB White (MQ233)',
    price: 510,
    image: '/images/Apple-phone.png',
    favorite: false
  },
  {
    id: 3,
    name: 'Apple iPhone 11 128GB White (MQ233)',
    price: 550,
    image: '/images/Apple-phone.png',
    favorite: false
  },
  {
    id: 4,
    name: 'Apple iPhone 14 Pro 1TB Gold (MQ2YJ)',
    price: 1490,
    image: '/images/Iphone-14-pro-Gold.png',
    favorite: false
  },
  {
    id: 5,
    name: 'Apple iPhone 14 Pro 1TB Gold (MQ2YJ)',
    price: 1399,
    image: '/images/Iphone-14-pro-Gold.png',
    favorite: false
  },
  {
    id: 6,
    name: 'Apple iPhone 14 Pro 128GB Deep Purple (MQ0G3)',
    price: 1600,
    image: '/images/Iphone-14-pro-purple.png',
    favorite: false
  },
  {
    id: 7,
    name: 'Apple iPhone 13 mini 128GB Pink (MLK23)',
    price: 850,
    image: '/images/Iphone-14-pro-pink.png',
    favorite: false
  },
  {
    id: 8,
    name: 'Apple iPhone 14 Pro 256GB Space Black (MQ0T3)',
    price: 1399,
    image: '/images/Iphone-14-pro-black.png',
    favorite: false
  },
  {
    id: 9,
    name: 'Apple iPhone 14 Pro 256GB Silver (MQ103)',
    price: 1399,
    image: '/images/Iphone-14-pro-silver.png',
    favorite: false
  }
]

onMounted(async () => {
  // Load products when component mounts
  await productStore.fetchProducts()
})

const formatPrice = (price: number) => {
  return `$${price}`
}

const toggleFavorite = (productId: number) => {
  const product = mockProducts.find(p => p.id === productId)
  if (product) {
    product.favorite = !product.favorite
  }
}

const buyNow = (productId: number) => {
  console.log('Buy now clicked for product:', productId)
}

const toggleFilter = () => {
  // Toggle filter sections - functionality to be implemented
}

const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(mockProducts.length / 9))

const goToPage = (page: number) => {
  currentPage.value = page
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb Navigation -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex py-4 text-sm">
          <a href="/" class="text-gray-500 hover:text-gray-700">Home</a>
          <span class="mx-2 text-gray-400">></span>
          <a href="/catalog" class="text-gray-500 hover:text-gray-700">Catalog</a>
          <span class="mx-2 text-gray-400">></span>
          <span class="text-gray-900 font-medium">Smartphones</span>
        </nav>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-8">
        <!-- Sidebar Filters -->
        <div class="w-64 flex-shrink-0">
          <!-- Price Filter -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div class="p-4 border-b border-gray-200">
              <button @click="toggleFilter()" class="flex items-center justify-between w-full">
                <h3 class="text-lg font-semibold text-gray-900">Price</h3>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div class="p-4">
              <div class="flex items-center space-x-4 mb-4">
                <div class="flex-1">
                  <input type="number" v-model="priceRange.min" placeholder="1200"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <label class="text-xs text-gray-500 mt-1 block">From</label>
                </div>
                <div class="flex-1">
                  <input type="number" v-model="priceRange.max" placeholder="1200"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <label class="text-xs text-gray-500 mt-1 block">To</label>
                </div>
              </div>
              <!-- Price Range Slider -->
              <div class="relative">
                <div class="w-full h-2 bg-gray-200 rounded-full">
                  <div class="h-2 bg-blue-600 rounded-full" style="width: 60%; margin-left: 20%"></div>
                </div>
                <div class="flex justify-between mt-2">
                  <span class="text-xs text-gray-500">$0</span>
                  <span class="text-xs text-gray-500">$2000</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div class="p-4 border-b border-gray-200">
              <button @click="toggleFilter()" class="flex items-center justify-between w-full">
                <h3 class="text-lg font-semibold text-gray-900">Brand</h3>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div class="p-4">
              <div class="mb-4">
                <input type="text" placeholder="Search..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="space-y-3 max-h-48 overflow-y-auto">
                <div v-for="brand in brands" :key="brand.name" class="flex items-center">
                  <input :id="'brand-' + brand.name" type="checkbox" v-model="brand.checked"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label :for="'brand-' + brand.name" class="ml-3 flex-1 flex items-center justify-between">
                    <span class="text-sm text-gray-700">{{ brand.name }}</span>
                    <span class="text-xs text-gray-500">({{ brand.count }})</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Built-in Memory Filter -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div class="p-4 border-b border-gray-200">
              <button @click="toggleFilter()" class="flex items-center justify-between w-full">
                <h3 class="text-lg font-semibold text-gray-900">Built-in memory</h3>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div class="p-4">
              <div class="mb-4">
                <input type="text" placeholder="Search..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="space-y-3 max-h-48 overflow-y-auto">
                <div v-for="memory in memoryOptions" :key="memory.value" class="flex items-center">
                  <input :id="'memory-' + memory.value" type="checkbox" v-model="memory.checked"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label :for="'memory-' + memory.value" class="ml-3 flex-1 flex items-center justify-between">
                    <span class="text-sm text-gray-700">{{ memory.value }}</span>
                    <span class="text-xs text-gray-500">({{ memory.count }})</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Filters -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Protection class</h3>
            </div>
            <div class="p-4">
              <div class="text-sm text-gray-500">No options available</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Screen diagonal</h3>
            </div>
            <div class="p-4">
              <div class="text-sm text-gray-500">No options available</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Screen type</h3>
            </div>
            <div class="p-4">
              <div class="text-sm text-gray-500">No options available</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Battery capacity</h3>
            </div>
            <div class="p-4">
              <div class="text-sm text-gray-500">No options available</div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Header with product count and sorting -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Selected Products</h1>
              <p class="text-gray-600">{{ mockProducts.length }} products found</p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">By rating</span>
              <select v-model="sortBy" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="rating">By rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div v-for="product in mockProducts" :key="product.id"
              class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <!-- Product Image -->
              <div class="relative p-6 bg-gray-50">
                <button @click="toggleFavorite(product.id)"
                  class="absolute top-4 right-4 p-2 rounded-full hover:bg-white transition-colors">
                  <svg class="w-5 h-5" :class="product.favorite ? 'text-red-500 fill-current' : 'text-gray-400'"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
                <img :src="product.image" :alt="product.name"
                  class="w-full h-48 object-contain">
              </div>

              <!-- Product Info -->
              <div class="p-4">
                <h3 class="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                  {{ product.name }}
                </h3>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-lg font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
                </div>
                <button @click="buyNow(product.id)"
                  class="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium">
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-center space-x-2">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
              class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                page === currentPage
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              ]">
              {{ page }}
            </button>

            <span class="px-3 py-2 text-gray-500">...</span>
            <button class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">12</button>

            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
              class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

/* Custom scrollbar for filter sections */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth transitions for interactive elements */
input[type="checkbox"]:checked {
  background-color: #2563eb;
  border-color: #2563eb;
}

/* Product card hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Price range slider styles */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
