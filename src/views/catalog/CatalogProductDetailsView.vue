<script setup lang="ts">
// === Details Section Collapsing ===
const detailsCollapsed = ref(false)
const toggleDetails = () => (detailsCollapsed.value = !detailsCollapsed.value)

// === Reviews Section Collapsing ===
const reviewsCollapsed = ref(false)
const toggleReviews = () => (reviewsCollapsed.value = !reviewsCollapsed.value)

// === Image & Variant Selection ===
const selectImage = (index: number) => {
  selectedImageIndex.value = index
}
const selectColor = (color: string) => {
  selectedColor.value = color
  const imageIndex = productImages.value.findIndex(img => typeof img === 'string' && img.includes(color.toLowerCase()))
  if (imageIndex !== -1) selectedImageIndex.value = imageIndex
}
const selectStorage = (size: string) => {
  selectedStorage.value = size
}

import { ref, onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/products'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAuthStore } from '@/stores/auth'
import { useUserCartStore } from '@/stores/userCart'
import { useReviewsStore } from '@/stores/reviews'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import RelatedProducts from '@/components/products/RelatedProducts.vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { useToast } from '@/composables/useToast'
import { useThemeClasses } from '@/composables/useThemeClasses'

// === Interfaces ===
interface ProductVariant {
  id: number
  size: string
  color: string
  stock: number
  sku: string
  imageUrl?: string
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
const userCartStore = useUserCartStore()
const reviewsStore = useReviewsStore()
const { t } = useI18n()
const toast = useToast()

// === Theme Classes ===
const {
  cardClasses,
  textClasses,
  textSecondaryClasses,
  textMutedClasses,
  buttonPrimaryClasses,
  buttonSecondaryClasses,
  pageBackgroundClasses,
  iconBackgroundClasses,
  iconColorClasses,
  dividerClasses,
  hoverClasses,
  progressBarBgClasses,
  ratingTextClasses,
  ratingCountClasses
} = useThemeClasses()

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

// === Product Images from Variants ===
const productImages = computed(() => {
  // Prefer variant images if available
  if (productVariants.value.length > 0) {
    // Only include valid image URLs
    return productVariants.value
      .map(v => v.imageUrl)
      .filter(url => typeof url === 'string' && url.length > 0)
  }
  // Fallback to product image or default
  return currentProduct.value?.image ? [currentProduct.value.image] : ['/images/placeholder-phone-red.webp']
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
const getUserInitials = (userName: string) => {
  if (!userName || userName === 'Anonymous') return 'A'
  return userName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
const getAvatarColor = (userName: string) => {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-pink-500 to-rose-600',
    'from-yellow-500 to-orange-600',
    'from-indigo-500 to-blue-600',
    'from-red-500 to-pink-600',
    'from-purple-500 to-indigo-600',
    'from-teal-500 to-green-600',
  ]
  const nameHash = (userName || 'Anonymous').split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
  return colors[Math.abs(nameHash) % colors.length]
}
const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const fallback = img.nextElementSibling as HTMLElement
  if (img && fallback) {
    img.style.display = 'none'
    fallback.style.display = 'flex'
  }
}
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

// === Reviews ===
const { productReviews, productReviewsLoading, productReviewsError, fetchProductReviews } = reviewsStore
const reviewsToShow = ref(3)
const showAllReviews = ref(false)
const displayedReviews = computed(() =>
  showAllReviews.value ? productReviews.value : productReviews.value.slice(0, reviewsToShow.value)
)
const hasMoreReviews = computed(() => productReviews.value.length > reviewsToShow.value)
const toggleShowAllReviews = () => (showAllReviews.value = !showAllReviews.value)
const reviewStats = computed(() => {
  const reviews = productReviews.value
  const totalReviews = reviews.length
  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      excellent: 0,
      good: 0,
      average: 0,
      belowAverage: 0,
      poor: 0,
    }
  }
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
  const excellent = reviews.filter(r => r.rating === 5).length
  const good = reviews.filter(r => r.rating === 4).length
  const averageCount = reviews.filter(r => r.rating === 3).length
  const belowAverage = reviews.filter(r => r.rating === 2).length
  const poor = reviews.filter(r => r.rating === 1).length
  return {
    averageRating,
    totalReviews,
    excellent,
    good,
    average: averageCount,
    belowAverage,
    poor,
  }
})

// --- Review Modal State ---
const showReviewModal = ref(false)
const reviewRating = ref(0)
const reviewComment = ref('')
const reviewSubmitting = ref(false)
const reviewErrors = ref<{ rating?: string; comment?: string; submit?: string }>({})

const closeReviewModal = () => {
  showReviewModal.value = false
  reviewRating.value = 0
  reviewComment.value = ''
  reviewErrors.value = {}
}

const validateReview = () => {
  const errors: { rating?: string; comment?: string } = {}
  if (!reviewRating.value || reviewRating.value < 1 || reviewRating.value > 5) {
    errors.rating = 'Please select a rating between 1 and 5.'
  }
  if (!reviewComment.value.trim()) {
    errors.comment = 'Comment is required.'
  } else if (reviewComment.value.length > 1000) {
    errors.comment = 'Comment must be at most 1000 characters.'
  }
  return errors
}

const submitReview = async () => {
  reviewErrors.value = validateReview()
  if (Object.keys(reviewErrors.value).length > 0) return

  reviewSubmitting.value = true
  reviewErrors.value.submit = ''

  // Show loading toast
  const loadingToast = toast.loading('Submitting your review...')

  try {
    // Check authentication first
    if (!isAuthenticated.value) {
      const errorMessage = 'You must be logged in to submit a review.'
      console.error('Review submission failed:', errorMessage)
      reviewErrors.value.submit = errorMessage
      loadingToast.error(errorMessage, {
        title: 'Authentication Required',
        duration: 5000,
      })
      reviewSubmitting.value = false
      return
    }

    // Use productId from props and userId from store
    const productId = parseInt(props.productId)
    const userId = user.value?.id

    console.log('Authentication check passed')
    console.log('Props productId (raw):', props.productId)
    console.log('Parsed productId:', productId)
    console.log('User from store:', user.value)
    console.log('User ID:', userId)

    if (isNaN(productId) || !productId) {
      const errorMessage = 'Invalid product ID. Please refresh the page and try again.'
      console.error('Review submission failed:', errorMessage, 'Raw productId:', props.productId)
      reviewErrors.value.submit = errorMessage
      loadingToast.error(errorMessage)
      reviewSubmitting.value = false
      return
    }

    if (!userId) {
      const errorMessage = 'User information is missing. Please log out and log in again.'
      console.error('Review submission failed:', errorMessage)
      reviewErrors.value.submit = errorMessage
      loadingToast.error(errorMessage)
      reviewSubmitting.value = false
      return
    }

    const reviewPayload = {
      rating: reviewRating.value,
      comment: reviewComment.value.trim(),
      productId,
      userId,
    }

    console.log('Making API request to:', 'http://localhost:8080/api/reviews')
    console.log('Request payload:', reviewPayload)
    console.log('Request headers will include:', {
      'Content-Type': 'application/json'
    })

    const response = await axios.post('http://localhost:8080/api/reviews', reviewPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    })

    console.log('Review submission successful!')
    console.log('Response status:', response.status)
    console.log('Response data:', response.data)

    // Show success toast
    loadingToast.success('Review submitted successfully!', {
      title: 'Thank you for your feedback',
      duration: 4000,
    })

    // Optionally, refresh reviews list here
    if (typeof fetchProductReviews === 'function') {
      console.log('Refreshing product reviews...')
      await fetchProductReviews(productId)
    } else {
      console.log('fetchProductReviews function not available, skipping refresh')
    }

    closeReviewModal()

  } catch (err) {
    console.error('Review submission error:', err)

    let errorMessage = 'Failed to submit review. Please try again.'
    let errorTitle = 'Review Submission Failed'

    if (axios.isAxiosError(err)) {
      // Handle Axios errors
      if (err.response) {
        console.error('Server responded with error:')
        console.error('Status:', err.response.status)
        console.error('Data:', err.response.data)
        console.error('Headers:', err.response.headers)

        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data?.message || 'Invalid review data. Please check your input.'
            errorTitle = 'Invalid Data'
            break
          case 401:
            errorMessage = 'You are not authorized to submit reviews. Please log in again.'
            errorTitle = 'Authorization Required'
            break
          case 403:
            errorMessage = 'You do not have permission to submit reviews.'
            errorTitle = 'Permission Denied'
            break
          case 404:
            errorMessage = 'Product not found or review endpoint unavailable.'
            errorTitle = 'Resource Not Found'
            break
          case 409:
            errorMessage = 'You have already reviewed this product.'
            errorTitle = 'Duplicate Review'
            break
          case 500:
            errorMessage = 'Server error. Please try again later.'
            errorTitle = 'Server Error'
            break
          default:
            errorMessage = err.response.data?.message || `Server error (${err.response.status})`
        }
      } else if (err.request) {
        console.error('No response received:', err.request)
        errorMessage = 'Unable to connect to the server. Please check your internet connection.'
        errorTitle = 'Connection Error'
      } else {
        console.error('Request setup error:', err.message)
        errorMessage = 'An unexpected error occurred while setting up the request.'
        errorTitle = 'Request Error'
      }
    } else {
      console.error('Non-Axios error:', err)
      errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.'
    }

    reviewErrors.value.submit = errorMessage
    loadingToast.error(errorMessage, {
      title: errorTitle,
      duration: 8000, // Longer duration for errors
    })

  } finally {
    reviewSubmitting.value = false
  }
}

// Debug helper function (available in browser console as window.debugReview)
const debugReviewSubmission = () => {
  console.log('=== REVIEW SUBMISSION DEBUG INFO ===')
  console.log('Props:', props)
  console.log('Product ID (raw):', props.productId)
  console.log('Product ID (parsed):', parseInt(props.productId))
  console.log('Is Authenticated:', isAuthenticated.value)
  console.log('Current User:', user.value)
  console.log('User ID:', user.value?.id)
  console.log('Review Rating:', reviewRating.value)
  console.log('Review Comment:', reviewComment.value)
  console.log('Review Errors:', reviewErrors.value)
  console.log('Review Submitting:', reviewSubmitting.value)
  console.log('Show Review Modal:', showReviewModal.value)

  const testPayload = {
    rating: reviewRating.value || 5,
    comment: reviewComment.value || 'Test review',
    productId: parseInt(props.productId),
    userId: user.value?.id,
  }
  console.log('Test payload would be:', testPayload)
  console.log('===================================')
}

// Expose debug function to window for console access
if (typeof window !== 'undefined') {
  ; (window as Window & typeof globalThis & { debugReview?: () => void }).debugReview = debugReviewSubmission
}

// === Cart Functionality ===
const wishlistLoading = ref(false)
const cartLoading = ref(false)
const addToCart = async () => {
  if (!isAuthenticated.value) {
    toast.error('Please log in to add products to your cart', {
      title: 'Authentication Required',
      icon: 'hi-user',
      duration: 4000,
    })
    return
  }
  if (!isInStock.value) {
    toast.warning('This item is currently out of stock', {
      title: 'Out of Stock',
      icon: 'hi-exclamation-triangle',
      duration: 4000,
    })
    return
  }
  // Check if variant is selected (for products with variants)
  if (availableColors.value.length > 0 && !selectedColor.value) {
    console.log('🔴 [CATALOG PRODUCT DETAILS] No color selected')
    toast.warning('Please select a color to continue', {
      title: 'Selection Required',
      icon: 'hi-color-swatch',
      duration: 3000,
    })
    return
  }
  if (availableSizes.value.length > 0 && !selectedStorage.value) {
    console.log('🔴 [CATALOG PRODUCT DETAILS] No storage/size selected')
    toast.warning('Please select a storage option to continue', {
      title: 'Selection Required',
      icon: 'hi-database',
      duration: 3000,
    })
    return
  }
  // Get the product variant ID
  const productVariantId = currentVariant.value?.id
  if (!productVariantId) {
    console.log('🔴 [CATALOG PRODUCT DETAILS] No product variant selected')
    toast.error('Please select a product variant', {
      title: 'Invalid Selection',
      duration: 4000,
    })
    return
  }

  cartLoading.value = true

  // Show loading toast
  const loadingToast = toast.loading('Adding to cart...')

  try {
    console.log('🟡 [CATALOG PRODUCT DETAILS] Adding to cart:', {
      productVariantId,
      color: selectedColor.value,
      size: selectedStorage.value,
      sku: currentVariant.value?.sku
    })

    // Ensure cart is loaded
    if (!userCartStore.cart && user.value?.id) {
      console.log('🟡 [CATALOG PRODUCT DETAILS] Loading user cart first...')
      await userCartStore.fetchUserCart(user.value.id)
    }

    // Add product to cart
    const result = await userCartStore.addProductToCart(productVariantId)

    if (result.success) {
      console.log('🟢 [CATALOG PRODUCT DETAILS] Product added to cart successfully')

      loadingToast.success('Product added to your cart!', {
        title: 'Added Successfully',
        icon: 'hi-shopping-cart',
        duration: 4000,
        action: {
          label: 'View Cart',
          handler: () => {
            // Navigate to cart - you might need to adjust this route
            window.location.href = '/cart'
          },
        },
      })
    } else {
      console.error('🔴 [CATALOG PRODUCT DETAILS] Failed to add to cart:', result.error)
      loadingToast.error(`Failed to add to cart: ${result.error}`, {
        title: 'Cart Error',
        icon: 'hi-exclamation-circle',
        duration: 6000,
      })
    }
  } catch (error) {
    console.error('🔴 [CATALOG PRODUCT DETAILS] Error adding to cart:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to add product to cart. Please try again.'

    loadingToast.error(errorMessage, {
      title: 'Cart Error',
      icon: 'hi-exclamation-circle',
      duration: 6000,
      action: {
        label: 'Retry',
        handler: () => addToCart(),
      },
    })
  } finally {
    cartLoading.value = false
  }
}

const addToWishlist = async () => {
  console.log('🟡 [CATALOG PRODUCT DETAILS] Add to Wishlist clicked for product:', currentProduct.value?.id)
  if (!isAuthenticated.value) {
    console.log('🔴 [CATALOG PRODUCT DETAILS] User not authenticated')
    toast.error('Please log in to add products to your wishlist', {
      title: 'Authentication Required',
      duration: 4000,
    })
    return
  }
  if (!currentProduct.value?.id) {
    console.log('🔴 [CATALOG PRODUCT DETAILS] No product ID found')
    toast.error('No product ID found. Please refresh and try again.', {
      title: 'Wishlist Error',
      duration: 4000,
    })
    return
  }
  wishlistLoading.value = true
  try {
    const productId = currentProduct.value.id
    const isCurrentlyInWishlist = wishlistStore.isProductInWishlist(productId)
    if (isCurrentlyInWishlist) {
      toast.info('This product is already in your wishlist!', {
        title: 'Already in Wishlist',
        icon: 'hi-heart',
        duration: 3000,
      })
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
    toast.success('Product added to your wishlist!', {
      title: 'Wishlist Updated',
      icon: 'hi-heart',
      duration: 3000,
    })
  } catch (error) {
    console.error('🔴 [CATALOG PRODUCT DETAILS] Error adding to wishlist:', error)
    toast.error('Failed to add product to wishlist. Please try again.', {
      title: 'Wishlist Error',
      duration: 5000,
    })
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
    // Fetch product reviews
    await fetchProductReviews(productId)
    // Initialize wishlist if user is authenticated
    if (isAuthenticated.value && user.value?.id) {
      console.log('🟣 [CATALOG PRODUCT DETAILS] Initializing wishlist for user:', user.value.id)
      await wishlistStore.fetchUserWishlist(user.value.id)
      // Also initialize cart for authenticated user
      console.log('🟣 [CATALOG PRODUCT DETAILS] Initializing cart for user:', user.value.id)
      await userCartStore.fetchUserCart(user.value.id)
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
  <div :class="['min-h-screen', pageBackgroundClasses]">
    <!-- Breadcrumb -->
  <div :class="['pt-[85px] lg:pt-0', cardClasses]">
      <div class="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" :class="['flex justify-center items-center py-12', pageBackgroundClasses]">
      <div :class="['animate-spin rounded-full h-12 w-12 border-b-2', textClasses.includes('dark:text-white') ? 'border-black dark:border-white' : 'border-black']"></div>
      <span :class="['ml-3', textSecondaryClasses]">Cargando producto...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" :class="['max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8', pageBackgroundClasses]">
      <div class="px-4 py-3 text-center rounded-lg bg-error-bg border-border">
        <span :class="textClasses">{{ error }}</span>
      </div>
    </div>

    <!-- Product Details -->
    <div v-else :class="['max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8', pageBackgroundClasses]">
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Left Column - Product Images -->
        <div class="space-y-4">
          <!-- Main Product Image -->
            <div :class="['w-full h-[400px] lg:h-[500px] flex items-center justify-center rounded-2xl overflow-hidden', cardClasses]">
            <img :src="currentImage" :alt="currentProduct.name"
              class="object-cover w-full h-full rounded-2xl product-image-hover" />
          </div>

          <!-- Image Thumbnails -->
          <div v-if="productImages.length > 1" class="flex mt-2 space-x-2 overflow-x-auto">
            <button v-for="(img, idx) in productImages" :key="idx" @click="selectImage(idx)" :class="[
              'border rounded-lg overflow-hidden focus:outline-none transition-colors duration-200',
              selectedImageIndex === idx
                ? 'border-primary'
                : 'border-border'
            ]" style="width: 64px; height: 64px;">
              <img
                :src="img && typeof img === 'string' ? img : (img as any)?.imageUrl || '/images/placeholder-phone-red.webp'"
                :alt="`Product view ${idx + 1}`" class="object-cover w-full h-full transition-opacity duration-200"
                :style="selectedImageIndex === idx ? '' : 'opacity: 0.4;'" />
            </button>
          </div>
        </div>

        <!-- Right Column - Product Info -->
        <div class="space-y-6">
          <!-- Product Title and Price -->
          <div>
            <h1 :class="['font-srProDisplay text-4xl font-bold mb-4', textClasses]">
              {{ currentProduct.name }}
            </h1>

            <div class="flex items-center mb-4 space-x-3">
              <span :class="['font-srProDisplay text-3xl font-semibold', textSecondaryClasses]">
                {{ formatPrice(finalPrice) }}
              </span>
              <span :class="['font-srProDisplay text-xl line-through', textMutedClasses]">
                {{ formatPrice(discountPrice) }}
              </span>
            </div>
          </div>

          <!-- Color Selection -->
            <div v-if="availableColors.length > 0" class="flex items-center gap-4">
            <span :class="['font-srProDisplay text-sm font-medium', textSecondaryClasses]">Select color:</span>
            <div class="flex space-x-3">
              <button v-for="color in availableColors" :key="color" @click="selectColor(color)" :class="[
                'w-8 h-8 rounded-full border-2 transition-all',
                selectedColor === color
                  ? 'border-primary ring-2 ring-primary ring-opacity-20'
                  : 'theme-border',
                getColorClass(color),
              ]" :title="color"></button>
            </div>
          </div>

          <!-- Size/Storage Selection -->
          <div v-if="availableSizes.length > 0" class="space-y-3">
            <div class="flex flex-wrap gap-3">
              <button v-for="size in availableSizes" :key="size" @click="selectStorage(size)" :class="[
                'px-6 py-3 border rounded-[8px] font-srProDisplay text-sm font-medium transition-all',
                selectedStorage === size
                  ? buttonPrimaryClasses
                  : [buttonSecondaryClasses, 'hover:bg-primary', 'hover:text-primary-foreground']
              ]">
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Storage Display (for Mobile & Compute) - fallback for when no variants -->
          <div v-else-if="isMobileComputeCategory && currentProduct.specifications?.storage" class="space-y-3">
            <span :class="['font-srProDisplay text-sm font-medium', textSecondaryClasses]">Storage:</span>
            <div
              :class="['px-6 py-3 border rounded-[8px] font-srProDisplay text-sm font-medium', cardClasses]">
              {{ currentProduct.specifications?.storage ?? '' }}
            </div>
          </div>

          <!-- Stock Information -->
            <div v-if="currentVariant || productVariants.length > 0" class="space-y-2">
            <div class="flex items-center gap-2">
              <span :class="['font-srProDisplay text-sm font-medium', textSecondaryClasses]">Stock:</span>
              <span :class="[
                'font-srProDisplay text-sm font-semibold',
                isInStock ? 'text-success' : 'text-error'
              ]">
                {{ isInStock ? `${currentStock} available` : 'Out of stock' }}
              </span>
            </div>
            <div v-if="currentVariant" :class="['text-xs', textMutedClasses]">
              SKU: {{ currentVariant?.sku ?? '' }}
            </div>
          </div>

          <!-- DEBUG: Raw product data -->
          <div v-if="product"
            :class="['p-4 space-y-3 border rounded', cardClasses]">
            <h3 :class="['text-sm font-bold', textClasses]">🔍 DEBUG: Product & Variant Data (REMOVE
              LATER)</h3>
            <div :class="['space-y-1 text-xs', textMutedClasses]">
              <p><strong>Category:</strong> {{ product?.category ?? '' }}</p>
              <p><strong>Is Mobile/Compute:</strong> {{ isMobileComputeCategory }}</p>
              <p><strong>Is Input/Control:</strong> {{ isInputControlCategory }}</p>
              <p><strong>Has Specifications:</strong> {{ !!product?.specifications }}</p>
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
          <div v-if="isMobileComputeCategory && currentProduct.specifications"
            class="grid grid-cols-2 gap-3 md:grid-cols-3">
            <!-- Screen Size -->
            <div v-if="currentProduct.specifications?.screenSize"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10', iconBackgroundClasses]">
                <v-icon name="io-resize" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Screen size</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications?.screenSize ?? '' }}
                </p>
              </div>
            </div>

            <!-- CPU -->
            <div v-if="currentProduct.specifications?.cpu"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="hi-solid-chip" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">CPU</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications?.cpu ?? '' }}
                </p>
              </div>
            </div>

            <!-- GPU -->
            <div v-if="currentProduct.specifications?.gpu"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="hi-chip" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">GPU</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications?.gpu ?? '' }}
                </p>
              </div>
            </div>

            <!-- RAM -->
            <div v-if="currentProduct.specifications?.ram"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="hi-cube" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">RAM</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications && currentProduct.specifications.ram ?
                    currentProduct.specifications.ram + 'GB' : '' }}
                </p>
              </div>
            </div>

            <!-- Refresh Rate -->
            <div v-if="currentProduct.specifications?.refreshRate"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="hi-refresh" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Refresh Rate</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications && currentProduct.specifications.refreshRate ?
                    currentProduct.specifications.refreshRate + 'Hz' : '' }}
                </p>
              </div>
            </div>

            <!-- Camera -->
            <div v-if="currentProduct.specifications?.camera"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="bi-camera" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Camera</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications?.camera ?? '' }}
                </p>
              </div>
            </div>

            <!-- Front Camera -->
            <div v-if="currentProduct.specifications?.frontCamera"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="io-camera-reverse-outline" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Front Camera</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications?.frontCamera ?? '' }}
                </p>
              </div>
            </div>

            <!-- Battery -->
            <div v-if="currentProduct.specifications?.battery"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="gi-battery-75" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Battery</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications?.battery ?? '' }}
                </p>
              </div>
            </div>

            <!-- Operating System -->
            <div v-if="currentProduct.specifications?.os"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="io-settings" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">OS</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications?.os ?? '' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Product Specifications - Input & Control Template -->
          <div v-else-if="isInputControlCategory && currentProduct.specifications"
            class="grid grid-cols-2 gap-3 md:grid-cols-3">
            <!-- DPI -->
            <div v-if="currentProduct.specifications?.dpi"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="io-locate" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">DPI</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications?.dpi ?? '' }}
                </p>
              </div>
            </div>

            <!-- Polling Rate -->
            <div v-if="currentProduct.specifications?.pollingRate"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="hi-lightning-bolt" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Polling Rate</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications && currentProduct.specifications.pollingRate ?
                    currentProduct.specifications.pollingRate + 'Hz' : '' }}
                </p>
              </div>
            </div>

            <!-- Switch Type -->
            <div v-if="currentProduct.specifications?.switchType"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="io-keypad" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Switch Type</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications?.switchType ?? '' }}
                </p>
              </div>
            </div>

            <!-- Backlighting -->
            <div v-if="currentProduct.specifications?.backlighting"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="io-bulb" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Backlighting</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications?.backlighting ?? '' }}
                </p>
              </div>
            </div>

            <!-- Programmable Buttons -->
            <div v-if="currentProduct.specifications?.programmableButtons !== undefined"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="io-options" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Programmable</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications && currentProduct.specifications.programmableButtons !== undefined ?
                    (currentProduct.specifications.programmableButtons ? 'Yes' : 'No') : '' }}
                </p>
              </div>
            </div>

            <!-- Battery Life -->
            <div v-if="currentProduct.specifications?.batteryLife"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="gi-battery-75" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Battery Life</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications?.batteryLife ?? '' }}
                </p>
              </div>
            </div>

            <!-- Ergonomic -->
            <div v-if="currentProduct.specifications?.ergonomic !== undefined"
              :class="['flex items-center space-x-3 rounded-[8px] w-auto h-auto p-3', cardClasses]">
              <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconBackgroundClasses]">
                <v-icon name="io-hand-left" scale="1.2" :class="iconColorClasses" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Ergonomic</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">
                  {{ currentProduct.specifications && currentProduct.specifications.ergonomic !== undefined ?
                    (currentProduct.specifications.ergonomic ? 'Yes' : 'No') : '' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Product Description -->
          <div class="space-y-3">
            <p :class="['font-srProDisplay leading-relaxed', textSecondaryClasses]">
              {{ displayedDescription }}
            </p>
            <button v-if="isDescriptionLong" @click="toggleDescription"
              :class="['font-srProDisplay text-sm font-medium underline focus:outline-none', textClasses]">
              {{ showFullDescription ? 'less...' : 'more...' }}
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button @click="addToWishlist"
              :disabled="wishlistLoading || !isAuthenticated || (!!currentProduct?.id && wishlistStore.isProductInWishlist(currentProduct.id))"
              :class="['flex-1 border py-4 px-6 rounded-[6px] font-srProDisplay text-sm font-medium transition-colors', buttonSecondaryClasses]">
              <span v-if="wishlistLoading" class="flex items-center justify-center">
                <div :class="['w-4 h-4 mr-2 border-b-2 rounded-full animate-spin', dividerClasses]"></div>
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
            <button @click="addToCart"
              :disabled="cartLoading || !isInStock || (!selectedColor && availableColors.length > 0) || (!selectedStorage && availableSizes.length > 0)"
              :class="['flex-1 py-4 px-6 rounded-[6px] font-srProDisplay text-sm font-medium transition-colors', buttonPrimaryClasses]">
              <span v-if="cartLoading" class="flex items-center justify-center">
                <div class="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                Adding...
              </span>
              <span v-else-if="!isAuthenticated">
                Login to Add to Cart
              </span>
              <span v-else-if="!isInStock">
                Out of Stock
              </span>
              <span v-else-if="availableColors.length > 0 && !selectedColor">
                Select Color
              </span>
              <span v-else-if="availableSizes.length > 0 && !selectedStorage">
                Select {{ availableSizes.length > 0 && availableSizes[0].includes('GB') ? 'Storage' : 'Size' }}
              </span>
              <span v-else>
                Add to Cart
              </span>
            </button>
          </div>

          <!-- Delivery Info -->
          <div class="grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
            <div :class="['flex items-center rounded-[8px] p-3', cardClasses]">
              <div :class="['w-[50px] h-[50px] flex items-center justify-center mr-4', iconColorClasses]">
                <v-icon name="hi-truck" scale="1.2" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Free Delivery</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">1-2 day</p>
              </div>
            </div>
            <div :class="['flex items-center rounded-[8px] p-3', cardClasses]">
              <div :class="['w-[50px] h-[50px] flex items-center justify-center mr-4', iconColorClasses]">
                <v-icon name="bi-shop" scale="1.2" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">In Stock</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">Today</p>
              </div>
            </div>
            <div :class="['flex items-center rounded-[8px] p-3', cardClasses]">
              <div :class="['w-[50px] h-[50px] flex items-center justify-center mr-4', iconColorClasses]">
                <v-icon name="hi-badge-check" scale="1.2" />
              </div>
              <div>
                <p :class="['text-xs', textMutedClasses]">Guaranteed</p>
                <p :class="['font-srProDisplay text-sm font-semibold', textClasses]">1 year</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Section -->
    <section :class="['w-full flex justify-center py-24', 'theme-surface']">
      <div :class="['w-full max-w-[1640px] rounded-2xl shadow-sm px-8 py-10', cardClasses]">
        <div class="flex items-center justify-between mb-2">
          <h2 :class="['text-2xl font-semibold', textClasses]">Details</h2>
          <button @click="toggleDetails" :class="['p-1 transition-colors rounded', hoverClasses]"
            type="button" aria-label="Toggle details section">
            <v-icon name="hi-chevron-down"
              :class="['w-5 h-5 transition-transform duration-200', textSecondaryClasses, { 'rotate-180': detailsCollapsed }]"
              scale="1.2" />
          </button>
        </div>
        <transition name="fade-details">
          <div v-show="!detailsCollapsed">
            <p :class="['mb-8 max-w-auto', textMutedClasses]">
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
            <div class="relative space-y-6">
              <div :class="[
                'transition-all duration-300 overflow-hidden',
                showAllDetails ? '' : 'max-h-[600px]',
              ]" style="position: relative">
                <div :style="showAllDetails
                    ? ''
                    : 'mask-image: linear-gradient(to bottom, #fff 70%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, #fff 70%, transparent 100%);'
                  ">
                  <!-- Mobile & Compute Template Details -->
                  <template v-if="isMobileComputeCategory && hasMobileComputeSpecs">
                    <!-- Display Section -->
                    <div>
                      <h3 :class="['mt-8 mb-4 text-xl font-semibold', textClasses]">Display & Screen</h3>
                      <div :class="['border-t', dividerClasses]">
                        <div v-if="currentProduct.specifications?.screenSize"
                          :class="['flex items-center py-4 border-b', dividerClasses]">
                          <div :class="['flex-1', textSecondaryClasses]">Screen size</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">
                            {{ currentProduct.specifications.screenSize }}
                          </div>
                        </div>
                        <div v-if="currentProduct.specifications?.refreshRate"
                          :class="['flex items-center py-4 border-b', dividerClasses]">
                          <div :class="['flex-1', textSecondaryClasses]">Refresh rate</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.refreshRate }}Hz</div>
                        </div>
                      </div>
                    </div>
                    <!-- Performance Section -->
                    <div>
                      <h3 :class="['mt-12 mb-4 text-xl font-semibold', textClasses]">Performance</h3>
                      <div :class="['border-t', dividerClasses]">
                        <div v-if="currentProduct.specifications?.cpu"
                          :class="['flex items-center py-4 border-b', dividerClasses]">
                          <div :class="['flex-1', textSecondaryClasses]">CPU</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.cpu }}</div>
                        </div>
                        <div v-if="currentProduct.specifications?.gpu"
                          :class="['flex items-center py-4 border-b', dividerClasses]">
                          <div :class="['flex-1', textSecondaryClasses]">GPU</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.gpu }}</div>
                        </div>
                        <div v-if="currentProduct.specifications?.ram"
                          :class="['flex items-center py-4 border-b', dividerClasses]">
                          <div :class="['flex-1', textSecondaryClasses]">RAM</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.ram }}GB</div>
                        </div>
                        <div v-if="currentProduct.specifications?.storage"
                          :class="['flex items-center py-4 border-b', dividerClasses]">
                          <div :class="['flex-1', textSecondaryClasses]">Storage</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.storage }}</div>
                        </div>
                        <div v-if="currentProduct.specifications?.os" class="flex items-center py-4">
                          <div :class="['flex-1', textSecondaryClasses]">Operating System</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{ currentProduct.specifications.os
                            }}</div>
                        </div>
                      </div>
                    </div>
                    <!-- Camera Section -->
                    <div v-if="currentProduct.specifications?.camera || currentProduct.specifications?.frontCamera">
                      <h3 :class="['mt-12 mb-4 text-xl font-semibold', textClasses]">Camera</h3>
                      <div :class="['border-t', dividerClasses]">
                        <div v-if="currentProduct.specifications?.camera"
                          :class="['flex items-center py-4 border-b', dividerClasses]">
                          <div :class="['flex-1', textSecondaryClasses]">Rear camera</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.camera }}</div>
                        </div>
                        <div v-if="currentProduct.specifications?.frontCamera" class="flex items-center py-4">
                          <div :class="['flex-1', textSecondaryClasses]">Front camera</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.frontCamera }}</div>
                        </div>
                      </div>
                    </div>
                    <!-- Battery Section -->
                    <div v-if="currentProduct.specifications?.battery">
                      <h3 :class="['mt-12 mb-4 text-xl font-semibold', textClasses]">Battery</h3>
                      <div :class="['border-t', dividerClasses]">
                        <div class="flex items-center py-4">
                          <div :class="['flex-1', textSecondaryClasses]">Battery capacity</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.battery }}</div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- Input & Control Template Details -->
                  <template v-else-if="isInputControlCategory && hasInputControlSpecs">
                    <!-- Performance Section -->
                    <div>
                      <h3 :class="['mt-8 mb-4 text-xl font-semibold', textClasses]">Performance</h3>
                      <div :class="['border-t', dividerClasses]">
                        <div v-if="currentProduct.specifications?.dpi"
                          :class="['flex items-center py-4 border-b', dividerClasses]">
                          <div :class="['flex-1', textSecondaryClasses]">DPI</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.dpi }}</div>
                        </div>
                        <div v-if="currentProduct.specifications?.pollingRate" class="flex items-center py-4">
                          <div :class="['flex-1', textSecondaryClasses]">Polling rate</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.pollingRate }}Hz</div>
                        </div>
                      </div>
                    </div>
                    <!-- Input Features Section -->
                    <div>
                      <h3 :class="['mt-12 mb-4 text-xl font-semibold', textClasses]">Input Features</h3>
                      <div :class="['border-t', dividerClasses]">
                        <div v-if="currentProduct.specifications?.switchType"
                          :class="['flex items-center py-4 border-b', dividerClasses]">
                          <div :class="['flex-1', textSecondaryClasses]">Switch type</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.switchType }}</div>
                        </div>
                        <div v-if="currentProduct.specifications?.backlighting"
                          :class="['flex items-center py-4 border-b', dividerClasses]">
                          <div :class="['flex-1', textSecondaryClasses]">Backlighting</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.backlighting }}</div>
                        </div>
                        <div v-if="currentProduct.specifications?.programmableButtons !== undefined"
                          :class="['flex items-center py-4 border-b', dividerClasses]">
                          <div :class="['flex-1', textSecondaryClasses]">Programmable buttons</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.programmableButtons ? 'Yes' : 'No' }}</div>
                        </div>
                        <div v-if="currentProduct.specifications?.ergonomic !== undefined"
                          :class="['flex items-center py-4']">
                          <div :class="['flex-1', textSecondaryClasses]">Ergonomic design</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.ergonomic ? 'Yes' : 'No' }}</div>
                        </div>
                      </div>
                    </div>
                    <!-- Power Section -->
                    <div v-if="currentProduct.specifications?.batteryLife">
                      <h3 :class="['mt-12 mb-4 text-xl font-semibold', textClasses]">Power</h3>
                      <div :class="['border-t', dividerClasses]">
                        <div class="flex items-center py-4">
                          <div :class="['flex-1', textSecondaryClasses]">Battery life</div>
                          <div :class="['w-48 font-medium text-right', textClasses]">{{
                            currentProduct.specifications.batteryLife }}</div>
                        </div>
                      </div>
                    </div>
                  </template>

                </div>

                <!-- Fade overlay when not showing all details -->
                <div v-if="!showAllDetails"
                  :class="['absolute bottom-0 left-0 w-full h-32 pointer-events-none bg-gradient-to-t to-transparent from-[var(--color-background)]']">
                </div>
              </div>

              <!-- View More/Less Button -->
              <div class="flex justify-center mt-6">
                <button @click="showAllDetails = !showAllDetails"
                  :class="[buttonSecondaryClasses, 'flex items-center justify-center gap-2 px-8 py-3 font-medium transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-primary']">
                  <span>{{ showAllDetails ? 'View Less' : 'View More' }}</span>
                  <v-icon v-if="!showAllDetails" name="hi-chevron-down" class="w-5 h-5" scale="1.2" />
                  <v-icon v-else name="hi-chevron-up" class="w-5 h-5" scale="1.2" />
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <!-- Reviews Section -->
    <section :class="['w-full flex justify-center py-12 lg:py-24', pageBackgroundClasses]">
      <div :class="['w-full max-w-[1640px] rounded-2xl px-4 lg:px-8 py-6 lg:py-10', cardClasses]">
        <div class="flex items-center justify-between mb-2">
          <h2 :class="['text-xl lg:text-2xl font-semibold mb-4 lg:mb-8', textClasses]">Reviews</h2>
          <button @click="toggleReviews"
            :class="[hoverClasses, 'p-2 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center']"
            type="button" aria-label="Toggle reviews section">
            <v-icon name="hi-chevron-down"
              :class="['w-5 h-5 transition-transform duration-200', textSecondaryClasses, { 'rotate-180': reviewsCollapsed }]"
              scale="1.2" />
          </button>
        </div>

        <transition name="fade-reviews">
          <div v-show="!reviewsCollapsed">
            <!-- Mobile Reviews Stats -->
            <div v-if="!productReviewsLoading && productReviews.length > 0" class="mb-6 lg:hidden">
              <!-- Overall Rating - Mobile -->
              <div :class="['text-center rounded-2xl p-6 mb-6', cardClasses]">
                <div :class="['text-4xl font-bold mb-2', textClasses]">{{
                  Number(reviewStats.averageRating).toFixed(Number(reviewStats.averageRating) % 1 === 0 ? 0 : 1) }}
                </div>
                <div :class="['text-sm mb-3', textMutedClasses]">
                  of {{ reviewStats.totalReviews }} reviews
                </div>
                <div class="flex justify-center">
                  <div class="flex">
                    <v-icon v-for="star in 5" :key="star" :name="star <= Math.floor(reviewStats.averageRating) ? 'bi-star-fill' : 'bi-star'
                      " :class="star <= Math.floor(reviewStats.averageRating)
                      ? 'text-yellow-400'
                      : textMutedClasses
                    " scale="1.1" />
                  </div>
                </div>
              </div>

              <!-- Rating Breakdown - Mobile -->
              <div :class="['p-4 rounded-2xl', cardClasses]">
                <h3 :class="['text-base font-semibold mb-4', textClasses]">Rating Breakdown</h3>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <span :class="['text-sm w-20 flex-shrink-0', textSecondaryClasses]">Excellent</span>
                    <div :class="['flex-1 h-2', progressBarBgClasses]">
                      <div class="h-2 transition-all duration-300 bg-yellow-400 rounded-full" :style="{
                        width: (reviewStats.excellent / reviewStats.totalReviews) * 100 + '%',
                      }"></div>
                    </div>
                    <span :class="['text-xs w-6 text-right', textMutedClasses]">{{ reviewStats.excellent }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span :class="['text-sm w-20 flex-shrink-0', textSecondaryClasses]">Good</span>
                    <div :class="['flex-1 h-2', progressBarBgClasses]">
                      <div class="h-2 transition-all duration-300 bg-yellow-400 rounded-full" :style="{
                        width: (reviewStats.good / reviewStats.totalReviews) * 100 + '%',
                      }"></div>
                    </div>
                    <span :class="['w-6 text-xs text-right', ratingCountClasses]">{{ reviewStats.good }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span :class="['flex-shrink-0 w-20 text-sm', ratingTextClasses]">Average</span>
                    <div :class="['flex-1 h-2', progressBarBgClasses]">
                      <div class="h-2 transition-all duration-300 bg-yellow-400 rounded-full" :style="{
                        width: (reviewStats.average / reviewStats.totalReviews) * 100 + '%',
                      }"></div>
                    </div>
                    <span :class="['w-6 text-xs text-right', ratingCountClasses]">{{ reviewStats.average }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span :class="['flex-shrink-0 w-20 text-sm', ratingTextClasses]">Below Avg</span>
                    <div :class="['flex-1 h-2', progressBarBgClasses]">
                      <div class="h-2 transition-all duration-300 bg-yellow-400 rounded-full" :style="{
                        width: (reviewStats.belowAverage / reviewStats.totalReviews) * 100 + '%',
                      }"></div>
                    </div>
                    <span :class="['w-6 text-xs text-right', ratingCountClasses]">{{ reviewStats.belowAverage }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span :class="['flex-shrink-0 w-20 text-sm', ratingTextClasses]">Poor</span>
                    <div :class="['flex-1 h-2', progressBarBgClasses]">
                      <div class="h-2 transition-all duration-300 bg-yellow-400 rounded-full" :style="{
                        width: (reviewStats.poor / reviewStats.totalReviews) * 100 + '%',
                      }"></div>
                    </div>
                    <span :class="['w-6 text-xs text-right', ratingCountClasses]">{{ reviewStats.poor }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop Reviews Stats -->
            <div v-if="!productReviewsLoading && productReviews.length > 0"
              class="items-start hidden gap-12 mb-8 lg:flex">
              <!-- Overall Rating -->
              <div :class="['text-center space-x-3 rounded-[25px] w-auto h-auto p-8', cardClasses]">
                <div :class="['mb-2 text-6xl font-bold', textClasses]">{{
                  Number(reviewStats.averageRating).toFixed(Number(reviewStats.averageRating) % 1 === 0 ? 0 : 1) }}
                </div>
                <div :class="['mb-2 text-sm', textMutedClasses]">
                  of {{ reviewStats.totalReviews }} reviews
                </div>
                <div class="flex justify-center">
                  <div class="flex">
                    <v-icon v-for="star in 5" :key="star" :name="star <= Math.floor(reviewStats.averageRating) ? 'bi-star-fill' : 'bi-star'
                      " :class="star <= Math.floor(reviewStats.averageRating)
                      ? 'text-yellow-400'
                      : textMutedClasses
                    " scale="1.2" />
                  </div>
                </div>
              </div>

              <!-- Rating Breakdown -->
              <div class="flex-1 max-w-7xl">
                <div class="space-y-2">
                  <div class="flex items-center gap-4">
                    <span :class="['text-lg w-30', ratingTextClasses]">Excellent</span>
                    <div :class="['flex-1 h-1.5', progressBarBgClasses]">
                      <div class="bg-yellow-400 h-1.5 rounded-full" :style="{
                        width: (reviewStats.excellent / reviewStats.totalReviews) * 100 + '%',
                      }"></div>
                    </div>
                    <span :class="['w-8 text-sm', ratingCountClasses]">{{ reviewStats.excellent }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span :class="['text-lg w-30', ratingTextClasses]">Good</span>
                    <div :class="['flex-1 h-1.5', progressBarBgClasses]">
                      <div class="bg-yellow-400 h-1.5 rounded-full" :style="{
                        width: (reviewStats.good / reviewStats.totalReviews) * 100 + '%',
                      }"></div>
                    </div>
                    <span :class="['w-8 text-sm', ratingCountClasses]">{{ reviewStats.good }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span :class="['text-lg w-30', ratingTextClasses]">Average</span>
                    <div :class="['flex-1 h-1.5', progressBarBgClasses]">
                      <div class="bg-yellow-400 h-1.5 rounded-full" :style="{
                        width: (reviewStats.average / reviewStats.totalReviews) * 100 + '%',
                      }"></div>
                    </div>
                    <span :class="['w-8 text-sm', ratingCountClasses]">{{ reviewStats.average }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span :class="['text-lg w-30', ratingTextClasses]">Below Average</span>
                    <div :class="['flex-1 h-1.5', progressBarBgClasses]">
                      <div class="bg-yellow-400 h-1.5 rounded-full" :style="{
                        width: (reviewStats.belowAverage / reviewStats.totalReviews) * 100 + '%',
                      }"></div>
                    </div>
                    <span :class="['w-8 text-sm', ratingCountClasses]">{{ reviewStats.belowAverage }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span :class="['text-lg w-30', ratingTextClasses]">Poor</span>
                    <div :class="['flex-1 h-1.5', progressBarBgClasses]">
                      <div class="bg-yellow-400 h-1.5 rounded-full" :style="{
                        width: (reviewStats.poor / reviewStats.totalReviews) * 100 + '%',
                      }"></div>
                    </div>
                    <span :class="['w-8 text-sm', ratingCountClasses]">{{ reviewStats.poor }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Leave Comment Button -->
            <div class="mb-8">
              <button @click="showReviewModal = true"
                :class="['w-full border rounded-[7px] px-4 py-4 text-base font-medium transition-all focus:outline-none focus:ring-2 min-h-[48px]', buttonSecondaryClasses]">
                Leave Comment
              </button>
            </div>

            <!-- Review Modal -->
            <transition name="fade-details">
              <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
                <div
                  :class="['rounded-xl shadow-lg p-6 lg:p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto', cardClasses]">
                  <button @click="closeReviewModal"
                    :class="['absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center', iconColorClasses]"
                    aria-label="Close">
                    <v-icon name="hi-x" scale="1.2" />
                  </button>
                  <h3 :class="['text-lg lg:text-xl font-semibold mb-4 pr-8', textClasses]">Leave a Review</h3>
                  <form @submit.prevent="submitReview">
                    <div class="mb-4">
                      <label :class="['block mb-2 font-medium', textClasses]">Rating</label>
                      <div class="flex gap-2">
                        <button v-for="star in 5" :key="star" type="button" @click="reviewRating = star"
                          :aria-label="`Set rating to ${star}`"
                          class="focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center">
                          <v-icon :name="star <= reviewRating ? 'bi-star-fill' : 'bi-star'"
                            :class="star <= reviewRating ? 'text-yellow-400' : textMutedClasses" scale="1.5" />
                        </button>
                      </div>
                      <div v-if="reviewErrors.rating" class="mt-1 text-sm text-red-500">{{ reviewErrors.rating }}</div>
                    </div>
                    <div class="mb-4">
                      <label :class="['block mb-2 font-medium', textClasses]">Comment</label>
                      <textarea v-model="reviewComment" maxlength="1000" rows="5"
                        :class="['w-full border rounded-[7px] px-4 py-3 text-base focus:outline-none focus:ring-2 transition-all resize-none', 'border-border text-foreground focus:ring-primary']"
                        placeholder="Share your experience..."></textarea>
                      <div :class="['flex justify-between mt-1 text-xs', textMutedClasses]">
                        <span>{{ reviewComment.length }}/1000</span>
                        <span v-if="reviewErrors.comment" class="text-red-500">{{ reviewErrors.comment }}</span>
                      </div>
                    </div>
                    <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                      <button type="button" @click="closeReviewModal" :class="[
                        'flex-1 border py-3 lg:py-4 px-4 lg:px-6 rounded-[6px] font-srProDisplay text-sm font-medium transition-colors min-h-[48px]',
                        buttonSecondaryClasses
                      ]">
                        Cancel
                      </button>
                      <button type="submit" :disabled="reviewSubmitting" :class="[
                        'flex-1 py-3 lg:py-4 px-4 lg:px-6 rounded-[6px] font-srProDisplay text-sm font-medium transition-colors min-h-[48px]',
                        !reviewSubmitting
                          ? buttonPrimaryClasses
                          : textMutedClasses
                      ]">
                        <span v-if="reviewSubmitting">Submitting...</span>
                        <span v-else>Submit Review</span>
                      </button>
                    </div>
                    <div v-if="reviewErrors.submit" class="mt-4 text-sm text-center text-red-500">{{ reviewErrors.submit
                      }}
                    </div>
                  </form>
                </div>
              </div>
            </transition>

            <!-- Loading State for Reviews -->
            <div v-if="productReviewsLoading" class="flex items-center justify-center py-8">
              <div :class="['w-8 h-8 border-b-2 rounded-full animate-spin', dividerClasses]"></div>
              <span :class="['ml-3', textMutedClasses]">Loading reviews...</span>
            </div>

            <!-- Error State for Reviews -->
            <div v-else-if="productReviewsError"
              class="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
              {{ productReviewsError }}
            </div>

            <!-- No Reviews State -->
            <div v-else-if="productReviews.length === 0" class="py-8 text-center">
              <div :class="['text-lg', textMutedClasses]">No reviews yet</div>
              <div :class="['mt-2 text-sm', textMutedClasses]">Be the first to leave a review!</div>
            </div>

            <!-- Individual Reviews with View More/Less and Fade -->
            <div v-else class="relative space-y-4 lg:space-y-6">
              <div :class="[
                'transition-all duration-300 overflow-hidden',
                showAllReviews ? '' : 'max-h-[400px] lg:max-h-[600px]',
              ]" style="position: relative">
                <div :style="showAllReviews
                    ? ''
                    : 'mask-image: linear-gradient(to bottom, #fff 70%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, #fff 70%, transparent 100%);'
                  ">
                  <div v-for="review in displayedReviews" :key="review.id" class="relative mb-4 lg:mb-6">
                    <div class="flex items-start gap-3 lg:gap-4 rounded-[10px] w-auto h-auto p-4 lg:p-8" :style="{ background: 'var(--color-input-background)' }">
                      <!-- Avatar -->
                      <div class="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12">
                        <img v-if="review.userAvatar" :src="review.userAvatar"
                          :alt="`${review.userName || 'User'} avatar`"
                          class="object-cover w-10 h-10 border-2 border-white rounded-full shadow-lg lg:w-12 lg:h-12 avatar-hover"
                          @error="handleAvatarError" />
                        <div v-else
                          class="flex items-center justify-center w-10 h-10 rounded-full shadow-lg lg:w-12 lg:h-12 bg-gradient-to-br avatar-hover"
                          :class="`bg-gradient-to-br ${getAvatarColor(review.userName || 'Anonymous')} ${review.userAvatar ? 'hidden' : ''}`">
                          <span class="text-xs font-semibold text-white lg:text-sm">{{
                            getUserInitials(review.userName || 'Anonymous')
                            }}</span>
                        </div>
                      </div>

                      <!-- Review Content -->
                      <div class="flex-1">
                        <div class="flex items-center justify-between mb-1">
                          <h4 class="text-sm font-medium lg:text-base">{{ review.userName || 'Anonymous'
                            }}
                          </h4>
                          <span :class="['text-xs lg:text-sm', textMutedClasses]">{{ review.date }}</span>
                        </div>

                        <!-- Star Rating -->
                        <div class="flex mb-2">
                          <v-icon v-for="star in 5" :key="star"
                            :name="star <= review.rating ? 'bi-star-fill' : 'bi-star'"
                            :class="star <= review.rating ? 'text-yellow-400' : textMutedClasses" scale="1.0"
                            class="lg:scale-110" />
                        </div>

                        <!-- Comment -->
                        <p class="text-sm leading-relaxed theme-text lg:text-base">{{ review.comment }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Fade overlay when not showing all reviews -->
                <div v-if="!showAllReviews && hasMoreReviews"
                  class="absolute bottom-0 left-0 w-full h-24 pointer-events-none lg:h-32 theme-fade-overlay">
                </div>
              </div>
              <div v-if="hasMoreReviews" class="flex justify-center mt-6">
                <button @click="toggleShowAllReviews"
                  :class="['flex items-center justify-center gap-2 px-6 lg:px-8 py-3 border rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px]', buttonSecondaryClasses]">
                  <span>{{ showAllReviews ? 'View Less' : 'View More' }}</span>
                  <v-icon v-if="!showAllReviews" name="hi-chevron-down" class="w-5 h-5" scale="1.2" />
                  <v-icon v-else name="hi-chevron-up" class="w-5 h-5" scale="1.2" />
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>


    <!-- Related Products Section -->
    <RelatedProducts
      :product-id="parseInt(props.productId)"
      :limit="3"
      :collapsible="true"
      :show-title="true"
    />
  </div>
</template>

<style scoped>
/* Component-specific styles for CatalogProductDetailsView */

/* Product image hover effects specific to this view */
.product-image-hover {
  transition: transform 0.3s ease;
}

.product-image-hover:hover {
  transform: scale(1.05);
}

/* Color selection button animations */
.color-button {
  transition: all 0.2s ease;
}

.color-button:hover {
  transform: scale(1.1);
}

/* Storage selection button animations */
.storage-button {
  transition: all 0.2s ease;
}

.storage-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Collapsible section animations for details/reviews */
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

/* Reviews section fade overlay */
.review-fade-overlay {
  background: linear-gradient(to bottom, transparent 0%, var(--color-background) 100%);
  z-index: 2;
}

/* Avatar hover effects for reviews */
.avatar-hover {
  transition: all 0.2s ease-in-out;
}

.avatar-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>
