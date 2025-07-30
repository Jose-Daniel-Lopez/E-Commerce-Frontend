<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/products'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAuthStore } from '@/stores/auth'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

// === Interfaces ===
interface ProductVariant {
  id: number
  size: string
  color: string
  stock: number
  sku: string
  _links?: {
    self: { href: string }
    productVariant: { href: string }
    product: { href: string }
  }
}

interface ProductVariantsResponse {
  _embedded?: { productVariants: ProductVariant[] }
  productVariants?: ProductVariant[]
}

interface BackendProduct {
  id: number
  name: string
  description: string
  brand: string
  createdAt?: string
  rating: number
  isFeatured: boolean
  imageUrl?: string
  basePrice: number
  totalStock: number
  categoryName: string
  // Mobile & Compute
  screenSize?: string
  cpu?: string
  gpu?: string
  ram?: number
  storage?: string
  refreshRate?: number
  camera?: string
  frontCamera?: string
  battery?: string
  os?: string
  // Input & Control
  dpi?: number
  pollingRate?: number
  switchType?: string
  backlighting?: string
  programmableButtons?: boolean
  batteryLife?: string
  ergonomic?: boolean
  _links?: {
    self: { href: string }
    product: { href: string }
    category: { href: string }
    productVariants: { href: string }
    wishlists?: { href: string }
  }
}

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
    screenSize?: string
    cpu?: string
    gpu?: string
    ram?: number
    storage?: string
    refreshRate?: number
    camera?: string
    frontCamera?: string
    battery?: string
    os?: string
    dpi?: number
    pollingRate?: number
    switchType?: string
    backlighting?: string
    programmableButtons?: boolean
    batteryLife?: string
    ergonomic?: boolean
    colors?: string[]
  }
}

interface Props {
  categoryName: string
  productId: string
}
const props = defineProps<Props>()

// === Stores & i18n ===
const productStore = useProductStore()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()
const { t } = useI18n()

// === Reactive refs ===
const { isAuthenticated, user } = storeToRefs(authStore)

// === State ===
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref('')
const selectedColor = ref('')
const selectedStorage = ref('')
const selectedImageIndex = ref(0)
const showAllDetails = ref(false)
const showFullDescription = ref(false)

// Variants
const productVariants = ref<ProductVariant[]>([])
const selectedVariant = ref<ProductVariant | null>(null)
const variantsLoading = ref(false)
const variantsError = ref('')

// === Mock Data ===
const mockProduct: Product = {
  id: 1,
  name: 'Apple iPhone 14 Pro Max',
  description:
    'Enhanced capabilities thanks to an enlarged display of 6.7 inches and work without recharging throughout the day. Incredible photos as in weak, yes and in bright light using the new system with two cameras.',
  basePrice: 1399,
  totalStock: 50,
  image: '/images/placeholder-phone-red.webp',
  brand: 'Apple',
  category: 'Smartphones',
  specifications: {
    screenSize: '6.7"',
    cpu: 'Apple A16 Bionic',
    gpu: 'Apple GPU (5-core)',
    ram: 6,
    storage: '256GB',
    refreshRate: 120,
    camera: '48MP + 12MP + 12MP',
    frontCamera: '12MP',
    battery: '4323 mAh',
    os: 'iOS 17',
    colors: ['Red', 'White', 'Black', 'Blue'],
  },
}

// === Image Mapping ===
const imageMap: Record<string, string[]> = {
  smartphones: [
    '/images/placeholder-phone-red.webp',
    '/images/placeholder-phone-white.webp',
    '/images/placeholder-phone-black.webp',
    '/images/placeholder-phone-blue.webp',
  ],
  tablets: [
    '/images/placeholder-tablet-red.png',
    '/images/placeholder-tablet-white.png',
    '/images/placeholder-tablet-black.png',
    '/images/placeholder-tablet-blue.png',
  ],
}

const defaultImages = ['/images/placeholder-phone-red.webp']

const productImages = computed(() => {
  const category = currentProduct.value?.category?.toLowerCase() || ''
  return imageMap[category] || imageMap[category.replace(/s$/, '')] || defaultImages
})

// === Computed ===
const currentProduct = computed(() => product.value || mockProduct)

const finalPrice = computed(() => currentProduct.value?.basePrice || mockProduct.basePrice)
const discountPrice = computed(() => finalPrice.value + 100)

const currentImage = computed(() => {
  return productImages.value[selectedImageIndex.value] || currentProduct.value?.image || mockProduct.image
})

const availableColors = computed(() => {
  const colors = [...new Set(productVariants.value.map(v => v.color))]
  return colors.length > 0 ? colors : (currentProduct.value?.specifications?.colors || [])
})

const availableSizes = computed(() => {
  return [...new Set(productVariants.value.map(v => v.size))]
})

const currentVariant = computed(() => {
  if (selectedColor.value && selectedStorage.value) {
    return productVariants.value.find(v => v.color === selectedColor.value && v.size === selectedStorage.value) || null
  }
  return selectedVariant.value
})

const currentStock = computed(() => {
  return currentVariant.value?.stock || currentProduct.value?.totalStock || 0
})

const isInStock = computed(() => currentStock.value > 0)

const hasMobileComputeSpecs = computed(() => {
  const specs = currentProduct.value?.specifications
  return !!(specs?.screenSize || specs?.cpu || specs?.ram || specs?.storage || specs?.camera || specs?.battery || specs?.os)
})

const hasInputControlSpecs = computed(() => {
  const specs = currentProduct.value?.specifications
  return !!(specs?.dpi || specs?.pollingRate || specs?.switchType || specs?.programmableButtons !== undefined || specs?.ergonomic !== undefined)
})

const isMobileComputeCategory = computed(() => {
  const cat = currentProduct.value?.category?.toLowerCase()
  return cat ? ['smartphones', 'tablets', 'laptops', 'handhelds', 'computers', 'phones'].includes(cat) : false
})

const isInputControlCategory = computed(() => {
  const cat = currentProduct.value?.category?.toLowerCase()
  return cat ? ['mice', 'keyboards', 'controllers', 'gaming'].includes(cat) : false
})

// === Breadcrumbs ===
const breadcrumbs = computed(() => {
  const categoryKey = `shop.categories.${props.categoryName}`
  const categoryLabel = t(categoryKey) !== categoryKey ? t(categoryKey) : capitalizeFirstLetter(props.categoryName)
  return [
    { label: t('catalog.title'), to: '/catalog' },
    { label: categoryLabel, to: `/catalog/${props.categoryName}` },
    { label: currentProduct.value?.name },
  ]
})

// === Methods ===
const formatPrice = (price: number) => `$${price.toLocaleString()}`

const getColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    Red: 'bg-red-500', White: 'bg-gray-100', Black: 'bg-gray-900', Blue: 'bg-blue-500',
    'Deep Purple': 'bg-purple-600', Gold: 'bg-yellow-400', Silver: 'bg-gray-300', 'Space Black': 'bg-gray-900'
  }
  return colorMap[color] || 'bg-gray-400'
}

const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const getProductImage = (productName: string, category?: string): string => {
  const cat = category?.toLowerCase() || currentProduct.value?.category?.toLowerCase()
  if (cat === 'smartphones' || cat === 'phones') return '/images/placeholder-phone-red.webp'
  if (cat === 'tablets') return '/images/placeholder-tablet-red.webp'

  const productImageMap: Record<string, string> = {
    iphone: '/images/Iphone-14-pro-Gold.png',
    samsung: '/images/Galaxy-Z-Mobile.png',
    apple: '/images/Iphone-14-pro-Gold.png',
    realme: '/images/placeholder-phone-red.webp',
  }

  const lowerName = productName.toLowerCase()
  for (const [key, path] of Object.entries(productImageMap)) {
    if (lowerName.includes(key)) return path
  }
  return '/images/placeholder-phone-red.webp'
}

const getColorOptions = (): string[] => {
  return currentProduct.value?.category === 'Smartphones'
    ? ['Red', 'White', 'Black', 'Blue']
    : ['Black', 'White', 'Silver', 'Gold']
}

// === Description Logic ===
const descriptionLimit = 180
const isDescriptionLong = computed(() => (currentProduct.value?.description?.length || 0) > descriptionLimit)
const displayedDescription = computed(() => {
  const desc = currentProduct.value?.description || ''
  if (!showFullDescription.value && desc.length > descriptionLimit) {
    return desc.slice(0, descriptionLimit) + '...'
  }
  return desc
})
const toggleDescription = () => (showFullDescription.value = !showFullDescription.value)

// === Section Collapsing ===
const detailsCollapsed = ref(false)
const reviewsCollapsed = ref(false)
const relatedCollapsed = ref(false)
const toggleDetails = () => (detailsCollapsed.value = !detailsCollapsed.value)
const toggleReviews = () => (reviewsCollapsed.value = !reviewsCollapsed.value)
const toggleRelated = () => (relatedCollapsed.value = !relatedCollapsed.value)

// === Reviews ===
const reviews = [
  { id: 1, name: 'Grace Carey', rating: 4, date: '24 January 2023', comment: "...", avatar: '/images/user-1.jpg' },
  { id: 2, name: 'Ronald Richards', rating: 5, date: '24 January 2023', comment: "...", avatar: '/images/user-2.jpg' },
  { id: 3, name: 'Michael Smith', rating: 2, date: '12 September 2021', comment: "...", avatar: '/images/user-2.jpg' },
  { id: 4, name: 'Samantha Johnson', rating: 4, date: '09 April 2023', comment: "...", avatar: '/images/user-4.jpg' },
  { id: 5, name: 'Jonathan Doe', rating: 5, date: '17 October 2024', comment: "...", avatar: '/images/user-5.jpg' },
  { id: 6, name: 'Veronica Taylor', rating: 1, date: '01 May 2025', comment: "...", avatar: '/images/user-6.jpg' },
]

const reviewsToShow = ref(3)
const showAllReviews = ref(false)
const displayedReviews = computed(() => showAllReviews.value ? reviews : reviews.slice(0, reviewsToShow.value))
const hasMoreReviews = computed(() => reviews.length > reviewsToShow.value)
const toggleShowAllReviews = () => (showAllReviews.value = !showAllReviews.value)

const reviewStats = {
  averageRating: 4.8,
  totalReviews: 125,
  excellent: 100, good: 11, average: 3, belowAverage: 8, poor: 1
}

// === Image & Variant Selection ===
const selectImage = (index: number) => {
  selectedImageIndex.value = index
}

const selectColor = (color: string) => {
  selectedColor.value = color
  const imageIndex = productImages.value.findIndex(img => img.includes(color.toLowerCase()))
  if (imageIndex !== -1) selectedImageIndex.value = imageIndex

  if (selectedStorage.value) {
    selectedVariant.value = productVariants.value.find(v => v.color === color && v.size === selectedStorage.value) || null
  }
}

const selectStorage = (size: string) => {
  selectedStorage.value = size
  if (selectedColor.value) {
    selectedVariant.value = productVariants.value.find(v => v.color === selectedColor.value && v.size === size) || null
  }
}

// === Cart & Wishlist ===
const addToCart = () => {
  if (!isInStock.value) {
    alert('This item is currently out of stock')
    return
  }
  console.log('Adding to cart:', {
    product: currentProduct.value?.name,
    productId: currentProduct.value?.id,
    variant: currentVariant.value,
    color: selectedColor.value,
    size: selectedStorage.value,
    price: finalPrice.value,
    stock: currentStock.value,
    sku: currentVariant.value?.sku
  })
}

const wishlistLoading = ref(false)

const addToWishlist = async () => {
  console.log('🟡 [CATALOG PRODUCT DETAILS] Add to Wishlist clicked for product:', currentProduct.value?.id)

  if (!isAuthenticated.value) {
    console.log('🔴 [CATALOG PRODUCT DETAILS] User not authenticated')
    alert('Please log in to add products to your wishlist')
    return
  }

  if (!currentProduct.value?.id) {
    console.log('🔴 [CATALOG PRODUCT DETAILS] No product ID found')
    return
  }

  wishlistLoading.value = true

  try {
    const productId = currentProduct.value.id
    const isCurrentlyInWishlist = wishlistStore.isProductInWishlist(productId)

    if (isCurrentlyInWishlist) {
      alert('This product is already in your wishlist!')
      return
    }

    console.log('🟡 [CATALOG PRODUCT DETAILS] Adding to wishlist...')
    const productData = {
      name: currentProduct.value.name,
      description: currentProduct.value.description,
      brand: currentProduct.value.brand || '',
      isFeatured: false,
      basePrice: currentProduct.value.basePrice,
      totalStock: currentProduct.value.totalStock,
      screenSize: currentProduct.value.specifications?.screenSize,
      ramCapacity: currentProduct.value.specifications?.ram,
      storageCapacity: currentProduct.value.specifications?.storage ? parseInt(currentProduct.value.specifications.storage.replace(/\D/g, '')) : undefined,
      operatingSystem: currentProduct.value.specifications?.os,
      imageUrl: currentProduct.value.image || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
    }
    await wishlistStore.addProductToWishlist(productId, productData)

    console.log('🟢 [CATALOG PRODUCT DETAILS] Product added to wishlist successfully')
    alert('Product added to your wishlist!')
  } catch (error) {
    console.error('🔴 [CATALOG PRODUCT DETAILS] Error adding to wishlist:', error)
    alert('Failed to add product to wishlist. Please try again.')
  } finally {
    wishlistLoading.value = false
  }
}

// === Fetch Data ===
onMounted(async () => {
  try {
    const productId = parseInt(props.productId)
    if (!productId || isNaN(productId)) throw new Error('Invalid product ID')

    const backendProduct = await productStore.fetchProductById(productId) as BackendProduct

    product.value = {
      id: backendProduct.id,
      name: backendProduct.name,
      description: backendProduct.description,
      basePrice: backendProduct.basePrice,
      totalStock: backendProduct.totalStock,
      brand: backendProduct.brand,
      rating: backendProduct.rating,
      image: getProductImage(backendProduct.name, backendProduct.categoryName),
      category: backendProduct.categoryName,
      createdAt: backendProduct.createdAt,
      specifications: {
        screenSize: backendProduct.screenSize,
        cpu: backendProduct.cpu,
        gpu: backendProduct.gpu,
        ram: backendProduct.ram,
        storage: backendProduct.storage,
        refreshRate: backendProduct.refreshRate,
        camera: backendProduct.camera,
        frontCamera: backendProduct.frontCamera,
        battery: backendProduct.battery,
        os: backendProduct.os,
        dpi: backendProduct.dpi,
        pollingRate: backendProduct.pollingRate,
        switchType: backendProduct.switchType,
        backlighting: backendProduct.backlighting,
        programmableButtons: backendProduct.programmableButtons,
        batteryLife: backendProduct.batteryLife,
        ergonomic: backendProduct.ergonomic,
        colors: getColorOptions(),
      },
    }

    selectedColor.value = availableColors.value[0] || ''
    selectedStorage.value = ''

    await fetchProductVariants(productId)

    // Initialize wishlist if user is authenticated
    if (isAuthenticated.value && user.value?.id) {
      console.log('🟣 [CATALOG PRODUCT DETAILS] Initializing wishlist for user:', user.value.id)
      await wishlistStore.fetchUserWishlist(user.value.id)
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = 'Error loading product details'
  } finally {
    loading.value = false
  }
})

const fetchProductVariants = async (productId: number) => {
  variantsLoading.value = true
  variantsError.value = ''
  try {
    const res = await fetch(`http://localhost:8080/api/products/${productId}/productVariants`)
    if (!res.ok) throw new Error('Failed to fetch variants')

    const data: ProductVariantsResponse = await res.json()
    const variants = data._embedded?.productVariants || data.productVariants || []

    productVariants.value = variants

    if (variants.length > 0) {
      if (!selectedColor.value) selectedColor.value = variants[0].color
      if (!selectedStorage.value) selectedStorage.value = variants[0].size
      selectedVariant.value = variants.find(v => v.color === selectedColor.value && v.size === selectedStorage.value) || variants[0]
    }
  } catch (err) {
    console.error('Error fetching variants:', err)
    variantsError.value = 'Error loading product variants'
  } finally {
    variantsLoading.value = false
  }
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
          <div v-if="availableColors.length > 0" class="flex items-center gap-4">
            <span class="font-srProDisplay text-sm font-medium text-gray-700">Select color:</span>
            <div class="flex space-x-3">
              <button
                v-for="color in availableColors"
                :key="color"
                @click="selectColor(color)"
                :class="[
                  'w-8 h-8 rounded-full border-2 transition-all',
                  selectedColor === color ? 'border-black ring-2 ring-gray-300' : 'border-gray-300',
                  getColorClass(color),
                ]"
                :title="color"
              ></button>
            </div>
            <span v-if="selectedColor" class="text-sm text-gray-600">{{ selectedColor }}</span>
          </div>

          <!-- Size/Storage Selection -->
          <div v-if="availableSizes.length > 0" class="space-y-3">
            <div class="flex flex-wrap gap-3">
              <button
                v-for="size in availableSizes"
                :key="size"
                @click="selectStorage(size)"
                :class="[
                  'px-6 py-3 border rounded-[8px] font-srProDisplay text-sm font-medium transition-all',
                  selectedStorage === size
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100'
                ]"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Storage Display (for Mobile & Compute) - fallback for when no variants -->
          <div v-else-if="isMobileComputeCategory && currentProduct.specifications?.storage" class="space-y-3">
            <span class="font-srProDisplay text-sm font-medium text-gray-700">Storage:</span>
            <div class="px-6 py-3 border border-gray-300 rounded-[8px] font-srProDisplay text-sm font-medium text-gray-700 bg-gray-50">
              {{ currentProduct.specifications.storage }}
            </div>
          </div>

          <!-- Stock Information -->
          <div v-if="currentVariant || productVariants.length > 0" class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-srProDisplay text-sm font-medium text-gray-700">Stock:</span>
              <span :class="[
                'font-srProDisplay text-sm font-semibold',
                isInStock ? 'text-green-600' : 'text-red-600'
              ]">
                {{ isInStock ? `${currentStock} available` : 'Out of stock' }}
              </span>
            </div>
            <div v-if="currentVariant" class="text-xs text-gray-500">
              SKU: {{ currentVariant.sku }}
            </div>
          </div>

          <!-- DEBUG: Raw product data -->
          <div v-if="product" class="space-y-3 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 class="font-bold text-sm">🔍 DEBUG: Product & Variant Data (REMOVE LATER)</h3>
            <div class="text-xs space-y-1">
              <p><strong>Category:</strong> {{ product.category }}</p>
              <p><strong>Is Mobile/Compute:</strong> {{ isMobileComputeCategory }}</p>
              <p><strong>Is Input/Control:</strong> {{ isInputControlCategory }}</p>
              <p><strong>Has Specifications:</strong> {{ !!product.specifications }}</p>
              <p><strong>Available Colors:</strong> {{ availableColors.join(', ') }}</p>
              <p><strong>Available Sizes:</strong> {{ availableSizes.join(', ') }}</p>
              <p><strong>Selected Color:</strong> {{ selectedColor }}</p>
              <p><strong>Selected Storage:</strong> {{ selectedStorage }}</p>
              <p><strong>Current Variant:</strong> {{ currentVariant?.sku || 'None' }}</p>
              <p><strong>Current Stock:</strong> {{ currentStock }}</p>
              <p><strong>Is In Stock:</strong> {{ isInStock }}</p>
              <p><strong>Total Variants:</strong> {{ productVariants.length }}</p>
            </div>
          </div>

          <!-- Product Specifications - Mobile & Compute Template -->
          <div v-if="isMobileComputeCategory" class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <!-- Screen Size -->
            <div v-if="currentProduct.specifications?.screenSize"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <v-icon name="io-resize" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Screen size</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.screenSize }}
                </p>
              </div>
            </div>

            <!-- CPU -->
            <div v-if="currentProduct.specifications?.cpu"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="hi-solid-chip" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">CPU</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.cpu }}
                </p>
              </div>
            </div>

            <!-- GPU -->
            <div v-if="currentProduct.specifications?.gpu"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="hi-chip" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">GPU</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.gpu }}
                </p>
              </div>
            </div>

            <!-- RAM -->
            <div v-if="currentProduct.specifications?.ram"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="hi-cube" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">RAM</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.ram }}GB
                </p>
              </div>
            </div>

            <!-- Refresh Rate -->
            <div v-if="currentProduct.specifications?.refreshRate"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="hi-refresh" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Refresh Rate</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.refreshRate }}Hz
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
                  {{ currentProduct.specifications.camera }}
                </p>
              </div>
            </div>

            <!-- Front Camera -->
            <div v-if="currentProduct.specifications?.frontCamera"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="io-camera-reverse-outline" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Front Camera</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.frontCamera }}
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
                  {{ currentProduct.specifications.battery }}
                </p>
              </div>
            </div>

            <!-- Operating System -->
            <div v-if="currentProduct.specifications?.os"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="io-settings" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">OS</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.os }}
                </p>
              </div>
            </div>
          </div>

          <!-- Product Specifications - Input & Control Template -->
          <div v-else-if="isInputControlCategory" class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <!-- DPI -->
            <div v-if="currentProduct.specifications?.dpi"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="io-locate" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">DPI</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.dpi }}
                </p>
              </div>
            </div>

            <!-- Polling Rate -->
            <div v-if="currentProduct.specifications?.pollingRate"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="hi-lightning-bolt" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Polling Rate</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.pollingRate }}Hz
                </p>
              </div>
            </div>

            <!-- Switch Type -->
            <div v-if="currentProduct.specifications?.switchType"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="io-keypad" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Switch Type</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.switchType }}
                </p>
              </div>
            </div>

            <!-- Backlighting -->
            <div v-if="currentProduct.specifications?.backlighting"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="io-bulb" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Backlighting</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.backlighting }}
                </p>
              </div>
            </div>

            <!-- Programmable Buttons -->
            <div v-if="currentProduct.specifications?.programmableButtons !== undefined"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="io-options" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Programmable</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.programmableButtons ? 'Yes' : 'No' }}
                </p>
              </div>
            </div>

            <!-- Battery Life -->
            <div v-if="currentProduct.specifications?.batteryLife"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="gi-battery-75" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Battery Life</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.batteryLife }}
                </p>
              </div>
            </div>

            <!-- Ergonomic -->
            <div v-if="currentProduct.specifications?.ergonomic !== undefined"
                 class="flex items-center space-x-3 bg-[#F4F4F4] rounded-[8px] w-auto h-auto p-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <v-icon name="io-hand-left" scale="1.2" class="text-gray-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Ergonomic</p>
                <p class="font-srProDisplay text-sm font-semibold">
                  {{ currentProduct.specifications.ergonomic ? 'Yes' : 'No' }}
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
              :disabled="wishlistLoading || !isAuthenticated || (!!currentProduct?.id && wishlistStore.isProductInWishlist(currentProduct.id))"
              :class="[
                'flex-1 border border-gray-300 py-4 px-6 rounded-[6px] font-srProDisplay text-sm font-medium transition-colors',
                wishlistLoading || !isAuthenticated || (!!currentProduct?.id && wishlistStore.isProductInWishlist(currentProduct.id))
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              <span v-if="wishlistLoading" class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Adding...
              </span>
              <span v-else-if="!isAuthenticated">
                Login to Add to Wishlist
              </span>
              <span v-else-if="currentProduct?.id && wishlistStore.isProductInWishlist(currentProduct.id)">
                Already in Wishlist
              </span>
              <span v-else>
                Add to Wishlist
              </span>
            </button>
            <button
              @click="addToCart"
              :disabled="!isInStock || (!selectedColor && availableColors.length > 0) || (!selectedStorage && availableSizes.length > 0)"
              :class="[
                'flex-1 py-4 px-6 rounded-[6px] font-srProDisplay text-sm font-medium transition-colors',
                isInStock && (availableColors.length === 0 || selectedColor) && (availableSizes.length === 0 || selectedStorage)
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              {{ !isInStock ? 'Out of Stock' : 'Add to Cart' }}
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
                  <!-- Mobile & Compute Template Details -->
                  <template v-if="isMobileComputeCategory && hasMobileComputeSpecs">
                  <!-- Display Section -->
                  <div>
                    <h3 class="text-xl font-semibold mb-4 mt-8">Display & Screen</h3>
                    <div class="border-t border-gray-200">
                      <div v-if="currentProduct.specifications?.screenSize"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Screen size</div>
                        <div class="w-48 text-right font-medium">
                          {{ currentProduct.specifications.screenSize }}
                        </div>
                      </div>
                      <div v-if="currentProduct.specifications?.refreshRate"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Refresh rate</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications.refreshRate }}Hz</div>
                      </div>
                    </div>
                  </div>
                  <!-- Performance Section -->
                  <div>
                    <h3 class="text-xl font-semibold mb-4 mt-12">Performance</h3>
                    <div class="border-t border-gray-200">
                      <div v-if="currentProduct.specifications?.cpu"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">CPU</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications.cpu }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.gpu"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">GPU</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications.gpu }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.ram"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">RAM</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications.ram }}GB</div>
                      </div>
                      <div v-if="currentProduct.specifications?.storage"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Storage</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications.storage }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.os"
                           class="flex items-center py-4">
                        <div class="flex-1 text-gray-600">Operating System</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications.os }}</div>
                      </div>
                    </div>
                  </div>
                  <!-- Camera Section -->
                  <div v-if="currentProduct.specifications?.camera || currentProduct.specifications?.frontCamera">
                    <h3 class="text-xl font-semibold mb-4 mt-12">Camera</h3>
                    <div class="border-t border-gray-200">
                      <div v-if="currentProduct.specifications?.camera"
                           class="flex items-center py-4 border-b border-gray-100">
                        <div class="flex-1 text-gray-600">Rear camera</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications.camera }}</div>
                      </div>
                      <div v-if="currentProduct.specifications?.frontCamera"
                           class="flex items-center py-4">
                        <div class="flex-1 text-gray-600">Front camera</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications.frontCamera }}</div>
                      </div>
                    </div>
                  </div>
                  <!-- Battery Section -->
                  <div v-if="currentProduct.specifications?.battery">
                    <h3 class="text-xl font-semibold mb-4 mt-12">Battery</h3>
                    <div class="border-t border-gray-200">
                      <div class="flex items-center py-4">
                        <div class="flex-1 text-gray-600">Battery capacity</div>
                        <div class="w-48 text-right font-medium">{{ currentProduct.specifications.battery }}</div>
                      </div>
                    </div>
                  </div>
                  </template>
                  <!-- Input & Control Template Details -->
                  <template v-else-if="isInputControlCategory && hasInputControlSpecs">
                    <!-- Performance Section -->
                    <div>
                      <h3 class="text-xl font-semibold mb-4 mt-8">Performance</h3>
                      <div class="border-t border-gray-200">
                        <div v-if="currentProduct.specifications?.dpi"
                             class="flex items-center py-4 border-b border-gray-100">
                          <div class="flex-1 text-gray-600">DPI</div>
                          <div class="w-48 text-right font-medium">{{ currentProduct.specifications.dpi }}</div>
                        </div>
                        <div v-if="currentProduct.specifications?.pollingRate"
                             class="flex items-center py-4">
                          <div class="flex-1 text-gray-600">Polling rate</div>
                          <div class="w-48 text-right font-medium">{{ currentProduct.specifications.pollingRate }}Hz</div>
                        </div>
                      </div>
                    </div>
                    <!-- Input Features Section -->
                    <div>
                      <h3 class="text-xl font-semibold mb-4 mt-12">Input Features</h3>
                      <div class="border-t border-gray-200">
                        <div v-if="currentProduct.specifications?.switchType"
                             class="flex items-center py-4 border-b border-gray-100">
                          <div class="flex-1 text-gray-600">Switch type</div>
                          <div class="w-48 text-right font-medium">{{ currentProduct.specifications.switchType }}</div>
                        </div>
                        <div v-if="currentProduct.specifications?.backlighting"
                             class="flex items-center py-4 border-b border-gray-100">
                          <div class="flex-1 text-gray-600">Backlighting</div>
                          <div class="w-48 text-right font-medium">{{ currentProduct.specifications.backlighting }}</div>
                        </div>
                        <div v-if="currentProduct.specifications?.programmableButtons !== undefined"
                             class="flex items-center py-4 border-b border-gray-100">
                          <div class="flex-1 text-gray-600">Programmable buttons</div>
                          <div class="w-48 text-right font-medium">{{ currentProduct.specifications.programmableButtons ? 'Yes' : 'No' }}</div>
                        </div>
                        <div v-if="currentProduct.specifications?.ergonomic !== undefined"
                             class="flex items-center py-4">
                          <div class="flex-1 text-gray-600">Ergonomic design</div>
                          <div class="w-48 text-right font-medium">{{ currentProduct.specifications.ergonomic ? 'Yes' : 'No' }}</div>
                        </div>
                      </div>
                    </div>
                    <!-- Power Section -->
                    <div v-if="currentProduct.specifications?.batteryLife">
                      <h3 class="text-xl font-semibold mb-4 mt-12">Power</h3>
                      <div class="border-t border-gray-200">
                        <div class="flex items-center py-4">
                          <div class="flex-1 text-gray-600">Battery life</div>
                          <div class="w-48 text-right font-medium">{{ currentProduct.specifications.batteryLife }}</div>
                        </div>
                      </div>
                    </div>
                  </template>

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
