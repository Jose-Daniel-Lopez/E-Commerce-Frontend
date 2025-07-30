import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/lib/axios'

export interface WishlistProduct {
  id: number
  name: string
  description: string
  brand: string
  isFeatured: boolean
  basePrice: number
  totalStock: number
  screenSize?: string
  ramCapacity?: number
  storageCapacity?: number
  operatingSystem?: string
  imageUrl?: string
  productUrl?: string
}

export const useWishlistStore = defineStore('wishlist', () => {
  const wishlistProducts = ref<WishlistProduct[]>([])
  const wishlistLoading = ref(false)
  const wishlistError = ref('')
  const wishlistId = ref<number | null>(null)

  const count = computed(() => wishlistProducts.value.length)

  async function fetchUserWishlist(userId: number) {
    console.log('🟣 [WISHLIST STORE] Starting fetchUserWishlist for userId:', userId)
    wishlistLoading.value = true
    wishlistError.value = ''
    wishlistProducts.value = []
    try {
      const wishlistUrl = `/users/${userId}/wishlists`
      console.log('🟣 [WISHLIST STORE] Fetching wishlists from:', wishlistUrl)

      const wishlistRes = await axios.get(wishlistUrl)
      console.log('🟢 [WISHLIST STORE] Wishlists response:', wishlistRes.data)

      const wishlists = wishlistRes.data._embedded?.wishlists || []
      console.log('🟣 [WISHLIST STORE] Found wishlists:', wishlists.length)

      if (!wishlists.length) {
        console.log('🟠 [WISHLIST STORE] No wishlists found for user')
        wishlistProducts.value = []
        wishlistId.value = null
        wishlistLoading.value = false
        return
      }

      wishlistId.value = wishlists[0].id // Store the first wishlist's id
      console.log('🟣 [WISHLIST STORE] Set wishlistId to:', wishlistId.value)

      const productsLink = wishlists[0]._links?.products?.href
      console.log('🟣 [WISHLIST STORE] Products link:', productsLink)

      if (!productsLink) {
        console.error('🔴 [WISHLIST STORE] No products link found in wishlist')
        wishlistError.value = 'No products link found in wishlist.'
        wishlistLoading.value = false
        return
      }

      console.log('🟣 [WISHLIST STORE] Fetching products from:', productsLink)
      const productsRes = await axios.get(productsLink)
      console.log('🟢 [WISHLIST STORE] Products response:', productsRes.data)

      const rawProducts = productsRes.data._embedded?.products as unknown[] || []
      console.log('🟣 [WISHLIST STORE] Found products:', rawProducts.length)

      wishlistProducts.value = rawProducts.map((item, index) => {
        console.log(`🟣 [WISHLIST STORE] Processing initial product ${index}:`, item)
        const prod = item as WishlistProduct & { _links?: { self?: { href?: string } } }
        const mappedProduct = {
          id: prod.id,
          name: prod.name,
          description: prod.description,
          brand: prod.brand,
          isFeatured: prod.isFeatured,
          basePrice: prod.basePrice,
          totalStock: prod.totalStock,
          screenSize: prod.screenSize,
          ramCapacity: prod.ramCapacity,
          storageCapacity: prod.storageCapacity,
          operatingSystem: prod.operatingSystem,
          imageUrl: prod.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
          productUrl: prod._links?.self?.href || '',
        }
        console.log(`🟣 [WISHLIST STORE] Mapped initial product ${index}:`, mappedProduct)
        return mappedProduct
      })

      console.log('🟢 [WISHLIST STORE] Successfully loaded wishlist with', wishlistProducts.value.length, 'products')
      console.log('🟢 [WISHLIST STORE] Product IDs in wishlist:', wishlistProducts.value.map(p => p.id))

    } catch (err) {
      console.error('🔴 [WISHLIST STORE] Error in fetchUserWishlist:', err)
      const errorMsg = err instanceof Error ? err.message : 'Failed to load wishlist.'
      wishlistError.value = errorMsg
    } finally {
      wishlistLoading.value = false
    }
  }

  // Helper function to create wishlist product from minimal data
  function createWishlistProduct(productId: number, productData?: Partial<WishlistProduct>): WishlistProduct {
    return {
      id: productId,
      name: productData?.name || `Product ${productId}`,
      description: productData?.description || 'Added to wishlist',
      brand: productData?.brand || 'Unknown',
      isFeatured: productData?.isFeatured || false,
      basePrice: productData?.basePrice || 0,
      totalStock: productData?.totalStock || 0,
      screenSize: productData?.screenSize,
      ramCapacity: productData?.ramCapacity,
      storageCapacity: productData?.storageCapacity,
      operatingSystem: productData?.operatingSystem,
      imageUrl: productData?.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
      productUrl: productData?.productUrl || '',
    }
  }

  async function addProductToWishlist(productId: number, productData?: Partial<WishlistProduct>) {
    console.log('🟡 [WISHLIST STORE] Starting addProductToWishlist for productId:', productId)
    console.log('🟡 [WISHLIST STORE] Product data provided:', productData)
    console.log('🟡 [WISHLIST STORE] Current wishlistId:', wishlistId.value)
    console.log('🟡 [WISHLIST STORE] Current wishlistProducts count:', wishlistProducts.value.length)

    if (!wishlistId.value) {
      console.error('🔴 [WISHLIST STORE] No wishlist ID found')
      wishlistError.value = 'No wishlist ID found.'
      return
    }
    try {
      const addUrl = `/wishlists/${wishlistId.value}/products/${productId}`
      console.log('🟡 [WISHLIST STORE] Making POST request to:', addUrl)

      const addResponse = await axios.post(addUrl)
      console.log('🟢 [WISHLIST STORE] ADD response status:', addResponse.status)
      console.log('🟢 [WISHLIST STORE] ADD response data:', addResponse.data)

      // Now refresh the wishlist using the correct endpoint
      const refreshUrl = `/wishlists/${wishlistId.value}/products`
      console.log('🟡 [WISHLIST STORE] Refreshing wishlist with GET request to:', refreshUrl)

      const response = await axios.get(refreshUrl)
      console.log('🟢 [WISHLIST STORE] REFRESH response status:', response.status)
      console.log('🟢 [WISHLIST STORE] REFRESH response data:', response.data)

      const rawProducts = response.data._embedded?.products as unknown[] || []
      console.log('🟡 [WISHLIST STORE] Raw products from API:', rawProducts.length, 'items')
      console.log('🟡 [WISHLIST STORE] First raw product structure:', rawProducts[0])

      wishlistProducts.value = rawProducts.map((item, index) => {
        console.log(`🟡 [WISHLIST STORE] Processing product ${index}:`, item)
        const prod = item as WishlistProduct & { _links?: { self?: { href?: string } } }
        const mappedProduct = {
          id: prod.id,
          name: prod.name,
          description: prod.description,
          brand: prod.brand,
          isFeatured: prod.isFeatured,
          basePrice: prod.basePrice,
          totalStock: prod.totalStock,
          screenSize: prod.screenSize,
          ramCapacity: prod.ramCapacity,
          storageCapacity: prod.storageCapacity,
          operatingSystem: prod.operatingSystem,
          imageUrl: prod.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
          productUrl: prod._links?.self?.href || '',
        }
        console.log(`🟡 [WISHLIST STORE] Mapped product ${index}:`, mappedProduct)
        return mappedProduct
      })

      console.log(' [WISHLIST STORE] Updated wishlistProducts count:', wishlistProducts.value.length)
      console.log('🟢 [WISHLIST STORE] Product with ID', productId, 'is now in wishlist:',
                  wishlistProducts.value.some(item => item.id === productId))

    } catch (err) {
      console.error('🔴 [WISHLIST STORE] Error in addProductToWishlist:', err)
      if (err instanceof Error) {
        console.error('🔴 [WISHLIST STORE] Error message:', err.message)
        console.error('🔴 [WISHLIST STORE] Error stack:', err.stack)
      }
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: unknown } }
        console.error('🔴 [WISHLIST STORE] Axios error status:', axiosError.response?.status)
        console.error('🔴 [WISHLIST STORE] Axios error data:', axiosError.response?.data)
      }
      const errorMsg = err instanceof Error ? err.message : 'Failed to add product to wishlist.'
      wishlistError.value = errorMsg

      // If the add request succeeded but refresh failed, add optimistically
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number } }
        if (axiosError.response?.status === 404 && productData) {
          console.log('🟡 [WISHLIST STORE] Refresh failed, adding optimistically')
          const newProduct = createWishlistProduct(productId, productData)
          if (!wishlistProducts.value.some(item => item.id === productId)) {
            wishlistProducts.value.push(newProduct)
            console.log('🟡 [WISHLIST STORE] Added product optimistically:', newProduct)
          }
        }
      }
    }
  }

  async function removeProductFromWishlist(productId: number) {
    if (!wishlistId.value) {
      wishlistError.value = 'No wishlist ID found.'
      return
    }
    try {
      await axios.delete(`/wishlists/${wishlistId.value}/products/${productId}`)
      // Remove the product from the local state
      wishlistProducts.value = wishlistProducts.value.filter((item) => item.id !== productId)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to remove product from wishlist.'
      wishlistError.value = errorMsg
    }
  }

  function isProductInWishlist(productId: number): boolean {
    return wishlistProducts.value.some((item) => item.id === productId)
  }

  return {
    wishlistProducts,
    wishlistLoading,
    wishlistError,
    fetchUserWishlist,
    count,
    wishlistId,
    addProductToWishlist,
    removeProductFromWishlist,
    isProductInWishlist,
  }
})
