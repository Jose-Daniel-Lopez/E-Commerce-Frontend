<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'

interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  totalStock: number
  image?: string
  brand?: string
  model?: string
  specifications?: {
    screenSize?: string
    processor?: string
    ncores?: string
    camera?: string
    frontCamera?: string
    battery?: string
    storage?: string[]
    colors?: string[]
    memory?: string
  }
}

// State
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref('')
const selectedColor = ref('')
const selectedStorage = ref('')
const selectedImageIndex = ref(0)
const showAllDetails = ref(false)

// Mock product data based on the image
const mockProduct: Product = {
  id: 1,
  name: 'Apple iPhone 14 Pro Max',
  description:
    'Enhanced capabilities thanks to an enlarged display of 6.7 inches and work without recharging throughout the day. Incredible photos as in weak, yes and in bright light using the new system with two cameras.',
  basePrice: 1399,
  totalStock: 50,
  image: '/images/Iphone-14-pro-Gold.png',
  brand: 'Apple',
  model: 'iPhone 14 Pro Max',
  specifications: {
    screenSize: '6.7"',
    processor: 'Apple A16 Bionic',
    ncores: '6',
    camera: '48-12-12 MP',
    frontCamera: '12 MP',
    battery: '4323 mAh',
    storage: ['128GB', '256GB', '512GB', '1TB'],
    colors: ['Deep Purple', 'Gold', 'Silver', 'Space Black'],
    memory: '6GB',
  },
}

// Product images for different colors/angles
const productImages = [
  '/images/Iphone-14-pro-Gold.png',
  '/images/Iphone-14-pro-purple.png',
  '/images/Iphone-14-pro-silver.png',
  '/images/Iphone-14-pro-black.png',
]

// Breadcrumb config
const breadcrumbs = ref([
  { label: 'Catálogo', to: '/catalog' },
  { label: 'Smartphones', to: '/catalog/smartphones' },
  { label: 'iPhone 14 Pro Max' },
])

// Computed properties
const finalPrice = computed(() => {
  let price = product.value?.basePrice || mockProduct.basePrice

  // Add storage upgrade costs
  if (selectedStorage.value === '256GB') price += 100
  else if (selectedStorage.value === '512GB') price += 300
  else if (selectedStorage.value === '1TB') price += 500

  return price
})

const discountPrice = computed(() => {
  return finalPrice.value + 100 // Show original higher price
})

const currentImage = computed(() => {
  return productImages[selectedImageIndex.value] || mockProduct.image
})

onMounted(async () => {
  try {
    // For now, use mock data. In production, fetch from API
    product.value = mockProduct
    selectedColor.value = mockProduct.specifications?.colors?.[0] || ''
    selectedStorage.value = mockProduct.specifications?.storage?.[0] || ''

    // Simulate API call delay
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = 'Error loading product details'
    loading.value = false
  }
})

// Methods
const selectColor = (color: string) => {
  selectedColor.value = color
  // Update image based on color selection
  const colorIndex = mockProduct.specifications?.colors?.indexOf(color) || 0
  selectedImageIndex.value = colorIndex
}

const selectStorage = (storage: string) => {
  selectedStorage.value = storage
}

const selectImage = (index: number) => {
  selectedImageIndex.value = index
}

const addToCart = () => {
  console.log('Adding to cart:', {
    product: product.value?.name,
    color: selectedColor.value,
    storage: selectedStorage.value,
    price: finalPrice.value,
  })
  // Implement add to cart functionality
}

const addToWishlist = () => {
  console.log('Adding to wishlist:', product.value?.name)
  // Implement add to wishlist functionality
}

const formatPrice = (price: number) => {
  return `$${price.toLocaleString()}`
}

const getColorClass = (color: string) => {
  const colorMap: { [key: string]: string } = {
    'Deep Purple': 'bg-purple-600',
    Gold: 'bg-yellow-400',
    Silver: 'bg-gray-300',
    'Space Black': 'bg-gray-900',
  }
  return colorMap[color] || 'bg-gray-400'
}

// Description expand/collapse
import { computed as vComputed } from 'vue'
const showFullDescription = ref(false)
const descriptionLimit = 180
const isDescriptionLong = vComputed(
  () => (product.value?.description || mockProduct.description).length > descriptionLimit,
)
const displayedDescription = vComputed(() => {
  const desc = product.value?.description || mockProduct.description
  if (!showFullDescription.value && desc.length > descriptionLimit) {
    return desc.slice(0, descriptionLimit) + '...'
  }
  return desc
})
const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value
}

// Details section collapse toggle
const detailsCollapsed = ref(false)
const toggleDetails = () => {
  detailsCollapsed.value = !detailsCollapsed.value
}

// Reviews section collapse toggle
const reviewsCollapsed = ref(false)
const toggleReviews = () => {
  reviewsCollapsed.value = !reviewsCollapsed.value
}

// Related Products section collapse toggle
const relatedCollapsed = ref(false)
const toggleRelated = () => {
  relatedCollapsed.value = !relatedCollapsed.value
}

// Mock reviews data
const reviews = [
  {
    id: 1,
    name: 'Grace Carey',
    rating: 4,
    date: '24 January 2023',
    comment:
      "I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!! I have a pre-paid data plan so I was worried that this phone wouldn't connect with my data plan, since the new phones don't have the physical Sim tray anymore, but couldn't have been easier! I bought an Unlocked black iPhone 14 Pro Max in excellent condition and everything is PERFECT! It was super easy to set up and the phone works and looks great. It truly was in excellent condition. Highly recommend!!🖤",
    avatar: '/images/user-1.jpg',
  },
  {
    id: 2,
    name: 'Ronald Richards',
    rating: 5,
    date: '24 January 2023',
    comment:
      'Perfect phone in perfect condition. Great value for money and fast shipping. Highly recommended!',
    avatar: '/images/user-2.jpg',
  },
  {
    id: 3,
    name: 'Michael Smith',
    rating: 2,
    date: '12 September 2021',
    comment:
      'The phone arrived with a few scratches and the battery life is not as good as expected. Disappointed with the quality.',
    avatar: '/images/user-2.jpg',
  },
  {
    id: 4,
    name: 'Samantha Johnson',
    rating: 4,
    date: '09 April 2023',
    comment:
      'Great phone overall, but the camera quality is not as good as I hoped. Still a solid purchase for the price.',
    avatar: '/images/user-4.jpg',
  },
  {
    id: 5,
    name: 'Jonathan Doe',
    rating: 5,
    date: '17 October 2024',
    comment:
      'Absolutely love this phone! The performance is top-notch and the design is sleek. Highly recommend it to anyone looking for a premium smartphone experience.',
    avatar: '/images/user-5.jpg',
  },
  {
    id: 6,
    name: 'Veronica Taylor',
    rating: 1,
    date: '01 May 2025',
    comment:
      'I had high expectations, but the phone has been underwhelming. The battery drains quickly and the software is buggy. Not worth the price.',
    avatar: '/images/user-6.jpg',
  },
]

// Reviews show more/less logic
const reviewsToShow = ref(3)
const showAllReviews = ref(false)
const displayedReviews = computed(() => {
  return showAllReviews.value ? reviews : reviews.slice(0, reviewsToShow.value)
})
const hasMoreReviews = computed(() => reviews.length > reviewsToShow.value)
const toggleShowAllReviews = () => {
  showAllReviews.value = !showAllReviews.value
}

const reviewStats = {
  averageRating: 4.8,
  totalReviews: 125,
  excellent: 100,
  good: 11,
  average: 3,
  belowAverage: 8,
  poor: 1,
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Breadcrumb -->
    <div class="pt-[85px] lg:pt-0 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      <span class="ml-3 text-gray-600">Cargando producto...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Product Details -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column - Product Images -->
        <div class="space-y-4">
          <!-- Main Product Image -->
          <div class="bg-gray-50 rounded-lg p-8 flex items-center justify-center h-[500px]">
            <img
              :src="currentImage"
              :alt="product?.name || mockProduct.name"
              class="h-[500px] w-[400px] object-contain"
            />
          </div>

          <!-- Image Thumbnails -->
          <div class="flex space-x-2 overflow-x-auto">
            <button
              v-for="(image, index) in productImages"
              :key="index"
              @click="selectImage(index)"
              :class="[
                'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden',
                selectedImageIndex === index ? 'border-black' : 'border-gray-200',
              ]"
            >
              <img
                :src="image"
                :alt="`Product view ${index + 1}`"
                class="w-full h-full object-cover transition-opacity duration-200"
                :style="selectedImageIndex === index ? '' : 'opacity: 0.4;'"
              />
            </button>
          </div>
        </div>

        <!-- Right Column - Product Info -->
        <div class="space-y-6">
          <!-- Product Title and Price -->
          <div>
            <h1 class="font-srProDisplay text-4xl font-bold text-black mb-4">
              {{ product?.name || mockProduct.name }}
            </h1>

            <div class="flex items-center space-x-3 mb-4">
              <span class="font-srProDisplay text-3xl font-semibold text-gray-700">
                {{ formatPrice(finalPrice) }}
              </span>
              <span class="font-srProDisplay text-xl text-gray-400 line-through">
                {{ formatPrice(discountPrice) }}
              </span>
            </div>
          </div>

          <!-- Color Selection -->
          <div class="flex items-center gap-4">
            <span class="font-srProDisplay text-sm font-medium text-gray-700">Select color:</span>
            <div class="flex space-x-3">
              <button
                v-for="color in mockProduct.specifications?.colors"
                :key="color"
                @click="selectColor(color)"
                :class="[
                  'w-8 h-8 rounded-full border-1 transition-all',
                  selectedColor === color ? 'border-black ring-2 ring-gray-300' : 'border-gray-300',
                  getColorClass(color),
                ]"
                :title="color"
              ></button>
            </div>
          </div>

          <!-- Storage Selection -->
          <div class="space-y-3">
            <div class="flex space-x-3">
              <button
                v-for="storage in mockProduct.specifications?.storage"
                :key="storage"
                @click="selectStorage(storage)"
                :class="[
                  'px-6 py-3 border rounded-[8px] font-srProDisplay text-sm font-medium transition-colors',
                  selectedStorage === storage
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400',
                ]"
              >
                {{ storage }}
              </button>
            </div>
          </div>

          <!-- Product Specifications -->
          <div class="grid grid-cols-3 gap-3">
            <!-- Screen Size -->
            <div class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <v-icon name="io-resize" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Screen size</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ mockProduct.specifications?.screenSize }}
                </p>
              </div>
            </div>

            <!-- Processor -->
            <div class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="hi-solid-chip" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">CPU</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ mockProduct.specifications?.processor }}
                </p>
              </div>
            </div>

            <!-- Number of cores -->
            <div class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="hi-chip" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Number of Cores</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ mockProduct.specifications?.ncores }}
                </p>
              </div>
            </div>

            <!-- Camera -->
            <div class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="bi-camera" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Camera</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ mockProduct.specifications?.camera }}
                </p>
              </div>
            </div>

            <!-- Front camera -->
            <div class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="io-camera-reverse-outline" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Front-Camera</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ mockProduct.specifications?.frontCamera }}
                </p>
              </div>
            </div>

            <!-- Battery -->
            <div class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="gi-battery-75" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Battery</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ mockProduct.specifications?.battery }}
                </p>
              </div>
            </div>
          </div>

          <!-- Product Description -->
          <div class="space-y-3">
            <p class="font-srProDisplay text-gray-700 leading-relaxed">
              {{ displayedDescription }}
            </p>
            <button
              v-if="isDescriptionLong"
              @click="toggleDescription"
              class="text-black font-srProDisplay text-sm font-medium underline focus:outline-none"
            >
              {{ showFullDescription ? 'less...' : 'more...' }}
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="addToWishlist"
              class="flex-1 border border-gray-300 text-gray-700 py-4 px-6 rounded-[6px] font-srProDisplay text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Add to Wishlist
            </button>
            <button
              @click="addToCart"
              class="flex-1 bg-black text-white py-4 px-6 rounded-[6px] font-srProDisplay text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
          </div>

          <!-- Delivery Info -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div class="flex items-center bg-[#F4F4F4] rounded-[8px] p-3">
              <div class="w-[50px] h-[50px] flex items-center justify-center text-gray-600 mr-4">
                <v-icon name="hi-truck" scale="1.2" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Free Delivery</p>
                <p class="font-srProDisplay text-sm font-semibold">1-2 day</p>
              </div>
            </div>
            <div class="flex items-center bg-[#F4F4F4] rounded-[8px] p-3">
              <div class="w-[50px] h-[50px] flex items-center justify-center text-gray-600 mr-4">
                <v-icon name="bi-shop" scale="1.2" />
              </div>
              <div>
                <p class="text-xs text-gray-500">In Stock</p>
                <p class="font-srProDisplay text-sm font-semibold">Today</p>
              </div>
            </div>
            <div class="flex items-center bg-[#F4F4F4] rounded-[8px] p-3">
              <div class="w-[50px] h-[50px] flex items-center justify-center text-gray-600 mr-4">
                <v-icon name="hi-badge-check" scale="1.2" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Guaranteed</p>
                <p class="font-srProDisplay text-sm font-semibold">1 year</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Section -->
    <section class="w-full flex justify-center bg-[#fafbfc] py-24">
      <div class="w-full max-w-[1640px] bg-white rounded-2xl shadow-sm px-8 py-10">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-2xl font-semibold">Details</h2>
          <button
            @click="toggleDetails"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            type="button"
            aria-label="Toggle details section"
          >
            <svg
              class="w-5 h-5 text-gray-600 transition-transform duration-200"
              :class="{ 'rotate-180': detailsCollapsed }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
        <transition name="fade-details">
          <div v-show="!detailsCollapsed">
            <p class="text-gray-400 mb-8 max-w-auto">
              Just as a book is judged by its cover, the first thing you notice when you pick up a
              modern smartphone is the display. Nothing surprising, because advanced technologies
              allow you to practically level the display frames and cutouts for the front camera and
              speaker, leaving no room for bold design solutions. And how good that in such
              realities Apple everything is fine with displays. Both critics and mass consumers
              always praise the quality of the picture provided by the products of the Californian
              brand. And last year's 6.7-inch Retina panels, which had ProMotion, caused real
              admiration for many.
            </p>

            <!-- Details content with fade effect -->
            <div class="space-y-6 relative">
              <div
                :class="[
                  'transition-all duration-300 overflow-hidden',
                  showAllDetails ? '' : 'max-h-[600px]',
                ]"
                style="position: relative"
              >
                <div
                  :style="
                    showAllDetails
                      ? ''
                      : 'mask-image: linear-gradient(to bottom, #fff 70%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, #fff 70%, transparent 100%);'
                  "
                >
                  <!-- Screen Section -->
                  <h3 class="text-xl font-semibold mb-4 mt-8">Screen</h3>
                  <div class="border-t border-gray-200">
                    <div class="flex items-center py-4 border-b border-gray-100">
                      <div class="flex-1 text-gray-600">Screen diagonal</div>
                      <div class="w-48 text-right font-medium">6.7"</div>
                    </div>
                    <div class="flex items-center py-4 border-b border-gray-100">
                      <div class="flex-1 text-gray-600">The screen resolution</div>
                      <div class="w-48 text-right font-medium">2796x1290</div>
                    </div>
                    <div class="flex items-center py-4 border-b border-gray-100">
                      <div class="flex-1 text-gray-600">The screen refresh rate</div>
                      <div class="w-48 text-right font-medium">120 Hz</div>
                    </div>
                    <div class="flex items-center py-4 border-b border-gray-100">
                      <div class="flex-1 text-gray-600">The pixel density</div>
                      <div class="w-48 text-right font-medium">460 ppi</div>
                    </div>
                    <div class="flex items-center py-4 border-b border-gray-100">
                      <div class="flex-1 text-gray-600">Screen type</div>
                      <div class="w-48 text-right font-medium">OLED</div>
                    </div>
                    <div class="flex items-center py-4">
                      <div class="flex-1 text-gray-600">Additionally</div>
                      <div class="w-48 text-right font-medium space-y-1">
                        <div>Dynamic Island</div>
                        <div>Always-On display</div>
                        <div>HDR display</div>
                        <div>True Tone</div>
                        <div>Wide color (P3)</div>
                      </div>
                    </div>
                  </div>

                  <!-- CPU Section -->
                  <h3 class="text-xl font-semibold mb-4 mt-12">CPU</h3>
                  <div class="border-t border-gray-200">
                    <div class="flex items-center py-4 border-b border-gray-100">
                      <div class="flex-1 text-gray-600">CPU</div>
                      <div class="w-48 text-right font-medium">Apple A16 Bionic</div>
                    </div>
                    <div class="flex items-center py-4 border-b border-gray-100">
                      <div class="flex-1 text-gray-600">Number of cores</div>
                      <div class="w-48 text-right font-medium">6</div>
                    </div>
                    <div class="flex items-center py-4">
                      <div class="flex-1 text-gray-600">Memory</div>
                      <div class="w-48 text-right font-medium">6GB</div>
                    </div>
                  </div>

                  <!-- Camera Section -->
                  <h3 class="text-xl font-semibold mb-4 mt-12">Camera</h3>
                  <div class="border-t border-gray-200">
                    <div class="flex items-center py-4 border-b border-gray-100">
                      <div class="flex-1 text-gray-600">Rear camera</div>
                      <div class="w-48 text-right font-medium">48 MP + 12 MP + 12 MP</div>
                    </div>
                    <div class="flex items-center py-4 border-b border-gray-100">
                      <div class="flex-1 text-gray-600">Front camera</div>
                      <div class="w-48 text-right font-medium">12 MP</div>
                    </div>
                    <div class="flex items-center py-4">
                      <div class="flex-1 text-gray-600">Camera features</div>
                      <div class="w-48 text-right font-medium space-y-1">
                        <div>Night mode</div>
                        <div>Deep Fusion</div>
                        <div>Smart HDR 4</div>
                        <div>Photographic Styles</div>
                        <div>ProRAW & ProRes</div>
                      </div>
                    </div>
                  </div>

                  <!-- Battery Section -->
                  <h3 class="text-xl font-semibold mb-4 mt-12">Battery</h3>
                  <div class="border-t border-gray-200">
                    <div class="flex items-center py-4 border-b border-gray-100">
                      <div class="flex-1 text-gray-600">Capacity</div>
                      <div class="w-48 text-right font-medium">4323 mAh</div>
                    </div>
                    <div class="flex items-center py-4 border-b border-gray-100">
                      <div class="flex-1 text-gray-600">Charging</div>
                      <div class="w-48 text-right font-medium">Fast charging, MagSafe wireless</div>
                    </div>
                    <div class="flex items-center py-4">
                      <div class="flex-1 text-gray-600">Battery life</div>
                      <div class="w-48 text-right font-medium">Up to 29 hours video playback</div>
                    </div>
                  </div>

                  <!-- Storage Section -->
                  <h3 class="text-xl font-semibold mb-4 mt-12">Storage</h3>
                  <div class="border-t border-gray-200">
                    <div class="flex items-center py-4">
                      <div class="flex-1 text-gray-600">Available options</div>
                      <div class="w-48 text-right font-medium space-y-1">
                        <div>128GB</div>
                        <div>256GB</div>
                        <div>512GB</div>
                        <div>1TB</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Fade overlay when not showing all details -->
                <div
                  v-if="!showAllDetails"
                  class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"
                ></div>
              </div>

              <!-- View More/Less Button -->
              <div class="flex justify-center mt-6">
                <button
                  @click="showAllDetails = !showAllDetails"
                  class="flex items-center justify-center gap-2 px-8 py-3 border border-gray-400 rounded-lg bg-white text-gray-800 font-medium transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <span>{{ showAllDetails ? 'View Less' : 'View More' }}</span>
                  <svg
                    v-if="!showAllDetails"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <!-- Reviews Section -->
    <section class="w-full flex justify-center bg-white py-24">
      <div class="w-full max-w-[1640px] bg-white rounded-2xl px-8 py-10">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-2xl font-semibold mb-8">Reviews</h2>
          <button
            @click="toggleReviews"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            type="button"
            aria-label="Toggle reviews section"
          >
            <svg
              class="w-5 h-5 text-gray-600 transition-transform duration-200"
              :class="{ 'rotate-180': reviewsCollapsed }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <transition name="fade-reviews">
          <div v-show="!reviewsCollapsed">
            <!-- Reviews Stats -->
            <div class="flex items-start gap-12 mb-8">
              <!-- Overall Rating -->
              <div class="text-center space-x-3 bg-[#F4F4F4] rounded-[25px] w-auto h-auto p-8">
                <div class="text-6xl font-bold mb-2">{{ reviewStats.averageRating }}</div>
                <div class="text-gray-400 text-sm mb-2">
                  of {{ reviewStats.totalReviews }} reviews
                </div>
                <div class="flex justify-center">
                  <div class="flex">
                    <v-icon
                      v-for="star in 5"
                      :key="star"
                      :name="
                        star <= Math.floor(reviewStats.averageRating) ? 'bi-star-fill' : 'bi-star'
                      "
                      :class="
                        star <= Math.floor(reviewStats.averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      "
                      scale="1.2"
                    />
                  </div>
                </div>
              </div>

              <!-- Rating Breakdown -->
              <div class="flex-1 max-w-7xl">
                <div class="space-y-2">
                  <div class="flex items-center gap-4">
                    <span class="text-lg text-gray-600 w-30">Excellent</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        class="bg-yellow-400 h-1.5 rounded-full"
                        :style="{
                          width: (reviewStats.excellent / reviewStats.totalReviews) * 100 + '%',
                        }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 w-8">{{ reviewStats.excellent }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-lg text-gray-600 w-30">Good</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        class="bg-yellow-400 h-1.5 rounded-full"
                        :style="{
                          width: (reviewStats.good / reviewStats.totalReviews) * 100 + '%',
                        }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 w-8">{{ reviewStats.good }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-lg text-gray-600 w-30">Average</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        class="bg-yellow-400 h-1.5 rounded-full"
                        :style="{
                          width: (reviewStats.average / reviewStats.totalReviews) * 100 + '%',
                        }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 w-8">{{ reviewStats.average }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-lg text-gray-600 w-30">Below Average</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        class="bg-yellow-400 h-1.5 rounded-full"
                        :style="{
                          width: (reviewStats.belowAverage / reviewStats.totalReviews) * 100 + '%',
                        }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 w-8">{{ reviewStats.belowAverage }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-lg text-gray-600 w-30">Poor</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        class="bg-yellow-400 h-1.5 rounded-full"
                        :style="{
                          width: (reviewStats.poor / reviewStats.totalReviews) * 100 + '%',
                        }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 w-8">{{ reviewStats.poor }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Leave Comment Button -->
            <div class="mb-8">
              <input
                type="text"
                placeholder="Leave Comment"
                class="w-full border border-gray-200 rounded-[7px] px-4 py-4 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              />
            </div>

            <!-- Individual Reviews with View More/Less and Fade -->
            <div class="space-y-6 relative">
              <div
                :class="[
                  'transition-all duration-300 overflow-hidden',
                  showAllReviews ? '' : 'max-h-[600px]',
                ]"
                style="position: relative"
              >
                <div
                  :style="
                    showAllReviews
                      ? ''
                      : 'mask-image: linear-gradient(to bottom, #fff 70%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, #fff 70%, transparent 100%);'
                  "
                >
                  <div v-for="review in displayedReviews" :key="review.id" class="relative mb-6">
                    <div
                      class="flex items-start gap-4 bg-[#F4F4F4] rounded-[10px] w-auto h-auto p-8"
                    >
                      <!-- Avatar -->
                      <div
                        class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <span class="text-gray-600 text-sm font-medium">{{
                          review.name.charAt(0)
                        }}</span>
                      </div>

                      <!-- Review Content -->
                      <div class="flex-1">
                        <div class="flex items-center justify-between mb-1">
                          <h4 class="font-medium text-gray-900">{{ review.name }}</h4>
                          <span class="text-sm text-gray-500">{{ review.date }}</span>
                        </div>

                        <!-- Star Rating -->
                        <div class="flex mb-2">
                          <v-icon
                            v-for="star in 5"
                            :key="star"
                            :name="star <= review.rating ? 'bi-star-fill' : 'bi-star'"
                            :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                            scale="1.2"
                          />
                        </div>

                        <!-- Comment -->
                        <p class="text-gray-700 leading-relaxed">{{ review.comment }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Fade overlay when not showing all reviews -->
                <div
                  v-if="!showAllReviews && hasMoreReviews"
                  class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"
                ></div>
              </div>
              <div v-if="hasMoreReviews" class="flex justify-center mt-6">
                <button
                  @click="toggleShowAllReviews"
                  class="flex items-center justify-center gap-2 px-8 py-3 border border-gray-400 rounded-lg bg-white text-gray-800 font-medium transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <span>{{ showAllReviews ? 'View Less' : 'View More' }}</span>
                  <svg
                    v-if="!showAllReviews"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <!-- Related Products Section -->
    <section class="w-full flex justify-center bg-[#fafbfc] py-32">
      <div class="w-full max-w-[1640px] px-8">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-2xl font-semibold text-left mb-8 text-black">Related Products</h2>
          <button
            @click="toggleRelated"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            type="button"
            aria-label="Toggle related products section"
          >
            <svg
              class="w-5 h-5 text-gray-600 transition-transform duration-200"
              :class="{ 'rotate-180': relatedCollapsed }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
        <transition name="fade-details">
          <div v-show="!relatedCollapsed">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <!-- Product 1 -->
              <div
                class="bg-white rounded-[15px] p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div class="h-32 w-full flex items-center justify-center mb-6">
                  <img
                    src="/images/Apple-phone.png"
                    alt="iPhone 14"
                    class="h-full object-contain"
                  />
                </div>
                <h3 class="font-srProDisplay text-lg font-medium mb-2 text-black">iPhone 14</h3>
                <p class="font-srProDisplay text-[#787878] text-sm mb-4">Starting at $699</p>
                <button
                  class="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View Details
                </button>
              </div>

              <!-- Product 2 -->
              <div
                class="bg-white rounded-[15px] p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div class="h-32 w-full flex items-center justify-center mb-6">
                  <img src="/images/Apple-iPad.png" alt="iPad Pro" class="h-full object-contain" />
                </div>
                <h3 class="font-srProDisplay text-lg font-medium mb-2 text-black">iPad Pro</h3>
                <p class="font-srProDisplay text-[#787878] text-sm mb-4">Starting at $999</p>
                <button
                  class="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View Details
                </button>
              </div>

              <!-- Product 3 -->
              <div
                class="bg-white rounded-[15px] p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div class="h-32 w-full flex items-center justify-center mb-6">
                  <img
                    src="/images/Apple-airPods.png"
                    alt="AirPods Pro"
                    class="h-full object-contain"
                  />
                </div>
                <h3 class="font-srProDisplay text-lg font-medium mb-2 text-black">AirPods Pro</h3>
                <p class="font-srProDisplay text-[#787878] text-sm mb-4">Starting at $249</p>
                <button
                  class="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Remove Vue's Blue Effect on selected item */
button:focus {
  outline: none;
  box-shadow: none;
}

input::placeholder {
  font-weight: 200;
  color: #a3a3a3;
  font-size: 14px;
  opacity: 1;
}

/* Custom transitions */
.transition-all {
  transition: all 0.3s ease;
}

/* Hover effects for product images */
.product-image-hover {
  transition: transform 0.3s ease;
}

.product-image-hover:hover {
  transform: scale(1.05);
}

/* Color button animations */
.color-button {
  transition: all 0.2s ease;
}

.color-button:hover {
  transform: scale(1.1);
}

/* Storage button animations */
.storage-button {
  transition: all 0.2s ease;
}

.storage-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Transition animations for collapsible sections */
.fade-details-enter-active,
.fade-details-leave-active,
.fade-reviews-enter-active,
.fade-reviews-leave-active {
  transition: all 0.3s ease;
}

.fade-details-enter-from,
.fade-details-leave-to,
.fade-reviews-enter-from,
.fade-reviews-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Fade effect for reviews */
.review-fade-overlay {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
  z-index: 2;
}
</style>
