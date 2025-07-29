<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/products'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'

// Complete backend product response interface matching your entity
interface BackendProduct {
  // Core fields
  id: number
  name: string
  description: string
  brand: string
  createdAt: string
  rating: number
  isFeatured: boolean
  imageUrl?: string
  basePrice: number
  totalStock: number

  // Smartphones attributes
  screenSize?: string
  cpu?: string
  memory?: string
  numberOfCores?: number
  camera?: string
  frontCamera?: string
  battery?: string

  // Smartwatches attributes
  displaySize?: string
  batteryLife?: string
  waterResistance?: string
  connectivity?: string
  healthSensors?: string
  compatibility?: string

  // Cameras attributes
  resolution?: string
  sensorType?: string
  lensMount?: string
  videoResolution?: string
  isoRange?: string
  opticalZoom?: string

  // Headphones attributes
  driverSize?: string
  frequencyResponse?: string
  impedance?: string
  noiseCancel?: boolean
  bluetoothVersion?: string

  // Computers attributes
  processorModel?: string
  ramCapacity?: number
  storageType?: string
  storageCapacity?: number
  graphicsCard?: string
  operatingSystem?: string

  // Keyboards attributes
  keyType?: string
  layout?: string
  backlight?: string
  keyProfile?: string
  ergonomic?: boolean

  // Mice attributes
  dpi?: number
  programmableButtons?: boolean

  // Gaming attributes
  platform?: string
  gameGenre?: string
  playerCount?: number
  onlineMultiplayer?: boolean
  systemRequirements?: string
  ageRating?: string

  // Smart home attributes
  powerSource?: string
  controlMethod?: string
  automationFeatures?: string
  securityFeatures?: string

  // Audio attributes
  powerOutput?: number
  speakerConfiguration?: string

  // Accessories attributes
  material?: string
  dimensions?: string
  weight?: string
  warranty?: string
  color?: string

  // Category relationship
  category?: {
    id: number
    name: string
  }

  // HATEOAS links
  _links?: {
    self: { href: string }
    product: { href: string }
    category: { href: string }
    productVariants: { href: string }
  }
}

// Frontend product interface for this component
interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  totalStock: number
  brand?: string
  rating?: number
  image?: string
  category?: string
  createdAt?: string
  specifications?: {
    // Core specs
    screenSize?: string
    processor?: string
    camera?: string
    frontCamera?: string
    battery?: string
    memory?: string

    // Display/Screen
    displaySize?: string
    resolution?: string

    // Performance
    numberOfCores?: number
    ramCapacity?: number
    storageCapacity?: number

    // Audio/Video
    driverSize?: string
    frequencyResponse?: string
    powerOutput?: number

    // Connectivity
    connectivity?: string
    bluetoothVersion?: string

    // Special features
    waterResistance?: string
    noiseCancel?: boolean
    programmableButtons?: boolean

    // Gaming/Platform
    platform?: string
    gameGenre?: string

    // Physical attributes
    material?: string
    dimensions?: string
    weight?: string
    color?: string

    // Default UI fields (for missing data)
    storage?: string[]
    colors?: string[]
  }
}

// Props interface for route parameters
interface Props {
  categoryName: string
  productId: string
}

const props = defineProps<Props>()
const productStore = useProductStore()

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
  specifications: {
    screenSize: '6.7"',
    processor: 'Apple A16 Bionic',
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
  return productImages[selectedImageIndex.value] || product.value?.image || mockProduct.image
})

// Get the current product for display (prioritize fetched data over mock)
const currentProduct = computed(() => product.value || mockProduct)

// Dynamic specs availability checks
const hasScreenSpecs = computed(() => {
  const specs = currentProduct.value?.specifications
  return specs?.screenSize || specs?.displaySize || specs?.resolution
})

const hasPerformanceSpecs = computed(() => {
  const specs = currentProduct.value?.specifications
  return specs?.processor || specs?.numberOfCores || specs?.memory ||
         specs?.ramCapacity || specs?.storageCapacity
})

const hasCameraSpecs = computed(() => {
  const specs = currentProduct.value?.specifications
  return specs?.camera || specs?.frontCamera || specs?.resolution
})

const hasAudioSpecs = computed(() => {
  const specs = currentProduct.value?.specifications
  return specs?.driverSize || specs?.frequencyResponse ||
         specs?.noiseCancel !== undefined || specs?.powerOutput
})

const hasConnectivitySpecs = computed(() => {
  const specs = currentProduct.value?.specifications
  return specs?.connectivity || specs?.bluetoothVersion
})

const hasGamingSpecs = computed(() => {
  const specs = currentProduct.value?.specifications
  return specs?.platform || specs?.gameGenre
})

const hasPhysicalSpecs = computed(() => {
  const specs = currentProduct.value?.specifications
  return specs?.material || specs?.dimensions || specs?.weight || specs?.color
})

onMounted(async () => {
  try {
    // Get productId from route params
    const productId = parseInt(props.productId)

    if (!productId || isNaN(productId)) {
      error.value = 'Invalid product ID'
      loading.value = false
      return
    }

    // Fetch product from backend
    const backendProduct = await productStore.fetchProductById(productId) as BackendProduct

    // Transform backend data to frontend format
    product.value = {
      id: backendProduct.id,
      name: backendProduct.name,
      description: backendProduct.description,
      basePrice: backendProduct.basePrice,
      totalStock: backendProduct.totalStock,
      brand: backendProduct.brand,
      rating: backendProduct.rating,
      image: getProductImage(backendProduct.name),
      category: backendProduct.category?.name,
      createdAt: backendProduct.createdAt,
      specifications: {
        // Core specifications
        screenSize: backendProduct.screenSize || backendProduct.displaySize,
        processor: backendProduct.cpu || backendProduct.processorModel,
        camera: backendProduct.camera,
        frontCamera: backendProduct.frontCamera,
        battery: backendProduct.battery ? `${backendProduct.battery}` : backendProduct.batteryLife,
        memory: backendProduct.memory,

        // Display/Screen
        displaySize: backendProduct.displaySize,
        resolution: backendProduct.resolution,

        // Performance
        numberOfCores: backendProduct.numberOfCores,
        ramCapacity: backendProduct.ramCapacity,
        storageCapacity: backendProduct.storageCapacity,

        // Audio/Video
        driverSize: backendProduct.driverSize,
        frequencyResponse: backendProduct.frequencyResponse,
        powerOutput: backendProduct.powerOutput,

        // Connectivity
        connectivity: backendProduct.connectivity,
        bluetoothVersion: backendProduct.bluetoothVersion,

        // Special features
        waterResistance: backendProduct.waterResistance,
        noiseCancel: backendProduct.noiseCancel,
        programmableButtons: backendProduct.programmableButtons,

        // Gaming/Platform
        platform: backendProduct.platform,
        gameGenre: backendProduct.gameGenre,

        // Physical attributes
        material: backendProduct.material,
        dimensions: backendProduct.dimensions,
        weight: backendProduct.weight,
        color: backendProduct.color,

        // Default values for missing fields (UI-specific)
        storage: getStorageOptions(backendProduct.memory || backendProduct.storageCapacity?.toString()),
        colors: getColorOptions(backendProduct.color),
      },
    }

    // Set default selections
    selectedColor.value = product.value.specifications?.colors?.[0] || ''
    selectedStorage.value = product.value.specifications?.storage?.[0] || ''

    // Update breadcrumb with actual product name
    breadcrumbs.value = [
      { label: 'Catálogo', to: '/catalog' },
      { label: capitalizeFirstLetter(props.categoryName), to: `/catalog/${props.categoryName}` },
      { label: product.value.name },
    ]

    loading.value = false
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
  const colorIndex = (product.value?.specifications?.colors || mockProduct.specifications?.colors)?.indexOf(color) || 0
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

// Helper function to get product image (fallback to default)
const getProductImage = (productName: string): string => {
  // Map product names to specific images
  const productImageMap: { [key: string]: string } = {
    'iphone': '/images/Iphone-14-pro-Gold.png',
    'samsung': '/images/Galaxy-Z-Mobile.png',
    'apple': '/images/Iphone-14-pro-Gold.png',
    'realme': '/images/Iphone-14-pro-Gold.png', // fallback for now
  }

  const name = productName.toLowerCase()
  for (const [key, imagePath] of Object.entries(productImageMap)) {
    if (name.includes(key)) {
      return imagePath
    }
  }

  // Default fallback image
  return '/images/Iphone-14-pro-Gold.png'
}

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Helper function to generate storage options based on actual storage
const getStorageOptions = (actualStorage?: string): string[] => {
  if (!actualStorage) {
    return ['128GB', '256GB', '512GB', '1TB'] // Default options
  }

  const storageValue = actualStorage.toLowerCase()
  if (storageValue.includes('128')) return ['128GB', '256GB', '512GB']
  if (storageValue.includes('256')) return ['128GB', '256GB', '512GB', '1TB']
  if (storageValue.includes('512')) return ['256GB', '512GB', '1TB']
  if (storageValue.includes('1tb') || storageValue.includes('1024')) return ['512GB', '1TB', '2TB']

  return [actualStorage, '256GB', '512GB', '1TB']
}

// Helper function to generate color options based on actual color
const getColorOptions = (actualColor?: string): string[] => {
  if (!actualColor) {
    return ['Black', 'White', 'Silver', 'Gold'] // Default options
  }

  const baseColors = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Purple']
  const result = [actualColor]

  // Add complementary colors
  baseColors.forEach(color => {
    if (color.toLowerCase() !== actualColor.toLowerCase() && !result.includes(color)) {
      result.push(color)
    }
  })

  return result.slice(0, 4) // Limit to 4 colors for UI
}

// Description expand/collapse
import { computed as vComputed } from 'vue'
const showFullDescription = ref(false)
const descriptionLimit = 180
const isDescriptionLong = vComputed(
  () => (currentProduct.value?.description || '').length > descriptionLimit,
)
const displayedDescription = vComputed(() => {
  const desc = currentProduct.value?.description || ''
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
              :alt="currentProduct.name"
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
              {{ currentProduct.name }}
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
                v-for="color in currentProduct.specifications?.colors"
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
                v-for="storage in currentProduct.specifications?.storage"
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
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <!-- Screen Size / Display Size -->
            <div v-if="currentProduct.specifications?.screenSize || currentProduct.specifications?.displaySize"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <v-icon name="io-resize" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Screen size</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications?.screenSize || currentProduct.specifications?.displaySize }}
                </p>
              </div>
            </div>

            <!-- Processor / CPU -->
            <div v-if="currentProduct.specifications?.processor"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="hi-solid-chip" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">CPU</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications?.processor }}
                </p>
              </div>
            </div>

            <!-- Memory / RAM -->
            <div v-if="currentProduct.specifications?.memory || currentProduct.specifications?.ramCapacity"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="hi-chip" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Memory</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications?.memory || (currentProduct.specifications?.ramCapacity ? `${currentProduct.specifications.ramCapacity}GB` : '') }}
                </p>
              </div>
            </div>

            <!-- Camera -->
            <div v-if="currentProduct.specifications?.camera"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="bi-camera" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Camera</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications?.camera }}
                </p>
              </div>
            </div>

            <!-- Front camera -->
            <div v-if="currentProduct.specifications?.frontCamera"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="io-camera-reverse-outline" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Front-Camera</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications?.frontCamera }}
                </p>
              </div>
            </div>

            <!-- Battery -->
            <div v-if="currentProduct.specifications?.battery"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="gi-battery-75" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Battery</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications?.battery }}
                </p>
              </div>
            </div>

            <!-- Water Resistance (for smartwatches) -->
            <div v-if="currentProduct.specifications?.waterResistance"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="io-water" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Water Resistance</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications?.waterResistance }}
                </p>
              </div>
            </div>

            <!-- Connectivity -->
            <div v-if="currentProduct.specifications?.connectivity"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="io-wifi" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Connectivity</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications?.connectivity }}
                </p>
              </div>
            </div>

            <!-- Platform (for gaming) -->
            <div v-if="currentProduct.specifications?.platform"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="io-game-controller" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Platform</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications?.platform }}
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
                  <!-- Screen/Display Section -->
                  <div v-if="hasScreenSpecs">
                    <h3 class="text-xl font-semibold mb-4 mt-8">Display</h3>
                    <div class="border-t border-gray-200">
                      <div v-if="currentProduct.specifications?.screenSize || currentProduct.specifications?.displaySize"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Screen diagonal</div>
                        <div class="w-48 text-right font-medium">
                          {{ currentProduct.specifications?.screenSize || currentProduct.specifications?.displaySize || 'N/A' }}
                        </div>
                      </div>
                      <div v-if="currentProduct.specifications?.resolution"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Resolution</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.resolution }}</div>
                      </div>
                      <div class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Screen refresh rate</div>
                        <div class="w-48 text-right font-medium">120 Hz</div>
                      </div>
                      <div class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Pixel density</div>
                        <div class="w-48 text-right font-medium">460 ppi</div>
                      </div>
                      <div class="flex items-center py-4">
                        <div class="flex-1 text-gray-600">Screen type</div>
                        <div class="w-48 text-right font-medium">OLED</div>
                      </div>
                    </div>
                  </div>

                  <!-- Performance Section -->
                  <div v-if="hasPerformanceSpecs">
                    <h3 class="text-xl font-semibold mb-4 mt-12">Performance</h3>
                    <div class="border-t border-gray-200">
                      <div v-if="currentProduct.specifications?.processor"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Processor</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.processor }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.numberOfCores"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Number of cores</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.numberOfCores }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.memory || currentProduct.specifications?.ramCapacity"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Memory</div>
                        <div class="w-48 text-right font-medium">
                          {{ currentProduct.specifications?.memory || (currentProduct.specifications?.ramCapacity ? `${currentProduct.specifications.ramCapacity}GB` : 'N/A') }}
                        </div>
                      </div>
                      <div v-if="currentProduct.specifications?.storageCapacity"
                           class="flex items-center py-4">
                        <div class="flex-1 text-gray-600">Storage</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.storageCapacity }}GB</div>
                      </div>
                    </div>
                  </div>

                  <!-- Camera Section -->
                  <div v-if="hasCameraSpecs">
                    <h3 class="text-xl font-semibold mb-4 mt-12">Camera</h3>
                    <div class="border-t border-gray-200">
                      <div v-if="currentProduct.specifications?.camera"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Rear camera</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.camera }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.frontCamera"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Front camera</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.frontCamera }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.resolution"
                           class="flex items-center py-4">
                        <div class="flex-1 text-gray-600">Image resolution</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.resolution }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Audio Section -->
                  <div v-if="hasAudioSpecs">
                    <h3 class="text-xl font-semibold mb-4 mt-12">Audio</h3>
                    <div class="border-t border-gray-200">
                      <div v-if="currentProduct.specifications?.driverSize"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Driver size</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.driverSize }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.frequencyResponse"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Frequency response</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.frequencyResponse }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.noiseCancel !== undefined"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Noise cancellation</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.noiseCancel ? 'Yes' : 'No' }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.powerOutput"
                           class="flex items-center py-4">
                        <div class="flex-1 text-gray-600">Power output</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.powerOutput }}W</div>
                      </div>
                    </div>
                  </div>

                  <!-- Connectivity Section -->
                  <div v-if="hasConnectivitySpecs">
                    <h3 class="text-xl font-semibold mb-4 mt-12">Connectivity</h3>
                    <div class="border-t border-gray-200">
                      <div v-if="currentProduct.specifications?.connectivity"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Connectivity</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.connectivity }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.bluetoothVersion"
                           class="flex items-center py-4">
                        <div class="flex-1 text-gray-600">Bluetooth</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.bluetoothVersion }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Gaming Section -->
                  <div v-if="hasGamingSpecs">
                    <h3 class="text-xl font-semibold mb-4 mt-12">Gaming</h3>
                    <div class="border-t border-gray-200">
                      <div v-if="currentProduct.specifications?.platform"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Platform</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.platform }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.gameGenre"
                           class="flex items-center py-4">
                        <div class="flex-1 text-gray-600">Genre</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.gameGenre }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Physical Section -->
                  <div v-if="hasPhysicalSpecs">
                    <h3 class="text-xl font-semibold mb-4 mt-12">Physical</h3>
                    <div class="border-t border-gray-200">
                      <div v-if="currentProduct.specifications?.material"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Material</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.material }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.dimensions"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Dimensions</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.dimensions }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.weight"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Weight</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.weight }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.color"
                           class="flex items-center py-4">
                        <div class="flex-1 text-gray-600">Color</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.color }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Battery Section -->
                  <div v-if="currentProduct.specifications?.battery">
                    <h3 class="text-xl font-semibold mb-4 mt-12">Battery</h3>
                    <div class="border-t border-gray-200">
                      <div class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Capacity</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications?.battery }}</div>
                      </div>
                      <div class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Charging</div>
                        <div class="w-48 text-right font-medium">Fast charging</div>
                      </div>
                      <div class="flex items-center py-4">
                        <div class="flex-1 text-gray-600">Battery life</div>
                        <div class="w-48 text-right font-medium">All day usage</div>
                      </div>
                    </div>
                  </div>

                  <!-- Available Options Section -->
                  <div v-if="currentProduct.specifications?.storage?.length">
                    <h3 class="text-xl font-semibold mb-4 mt-12">Available Options</h3>
                    <div class="border-t border-gray-200">
                      <div class="flex items-center py-4">
                        <div class="flex-1 text-gray-600">Storage options</div>
                        <div class="w-48 text-right font-medium space-y-1">
                          <div v-for="storage in currentProduct.specifications?.storage" :key="storage">{{ storage }}</div>
                        </div>
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
