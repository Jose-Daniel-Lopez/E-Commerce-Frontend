import { ref } from 'vue'
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
  imageUrl?: string // Optional, fallback if not present
  productUrl?: string // Optional, fallback if not present
  categoryName?: string // Optional, fallback if not present
}


export function useWishlistStore() {
  const wishlistProducts = ref<WishlistProduct[]>([])
  const wishlistLoading = ref(false)
  const wishlistError = ref('')

  const fetchUserWishlist = async (userId: number) => {
    wishlistLoading.value = true
    wishlistError.value = ''
    wishlistProducts.value = []
    try {
      // Step 1: Get the user's wishlist
      const wishlistRes = await axios.get(`/users/${userId}/wishlists`)
      const wishlists = wishlistRes.data._embedded?.wishlists || []
      if (!wishlists.length) {
        wishlistProducts.value = []
        wishlistLoading.value = false
        return
      }
      // Step 2: Get products link from the first wishlist (or handle multiple wishlists if needed)
      const productsLink = wishlists[0]._links?.products?.href
      if (!productsLink) {
        wishlistError.value = 'No products link found in wishlist.'
        wishlistLoading.value = false
        return
      }
      // Step 3: Fetch products from the products link
      const productsRes = await axios.get(productsLink)
      const rawProducts = productsRes.data._embedded?.products || []
      wishlistProducts.value = rawProducts.map((item: WishlistProduct & { _links?: { self?: { href?: string } } }) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        brand: item.brand,
        isFeatured: item.isFeatured,
        basePrice: item.basePrice,
        totalStock: item.totalStock,
        screenSize: item.screenSize,
        ramCapacity: item.ramCapacity,
        storageCapacity: item.storageCapacity,
        operatingSystem: item.operatingSystem,
        imageUrl: item.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
        productUrl: item._links?.self?.href || '',
        categoryName: item.categoryName || 'smartphones',
      }))
    } catch (err: unknown) {
      wishlistError.value = err instanceof Error ? err.message : 'Failed to load wishlist.'
    } finally {
      wishlistLoading.value = false
    }
  }

  return {
    wishlistProducts,
    wishlistLoading,
    wishlistError,
    fetchUserWishlist,
  }
}
