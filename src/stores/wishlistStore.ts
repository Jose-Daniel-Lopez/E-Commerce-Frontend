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

  const count = computed(() => wishlistProducts.value.length)

  async function fetchUserWishlist(userId: number) {
    wishlistLoading.value = true
    wishlistError.value = ''
    wishlistProducts.value = []
    try {
      const wishlistRes = await axios.get(`/users/${userId}/wishlists`)
      const wishlists = wishlistRes.data._embedded?.wishlists || []
      if (!wishlists.length) {
        wishlistProducts.value = []
        wishlistLoading.value = false
        return
      }
      const productsLink = wishlists[0]._links?.products?.href
      if (!productsLink) {
        wishlistError.value = 'No products link found in wishlist.'
        wishlistLoading.value = false
        return
      }
      const productsRes = await axios.get(productsLink)
      const rawProducts = productsRes.data._embedded?.products as unknown[] || []
      wishlistProducts.value = rawProducts.map((item) => {
        const prod = item as WishlistProduct & { _links?: { self?: { href?: string } } }
        return {
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
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load wishlist.'
      wishlistError.value = errorMsg
    } finally {
      wishlistLoading.value = false
    }
  }

  return {
    wishlistProducts,
    wishlistLoading,
    wishlistError,
    fetchUserWishlist,
    count,
  }
})
