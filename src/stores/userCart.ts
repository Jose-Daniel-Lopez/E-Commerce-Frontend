import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export interface ProductVariant {
  id: number
  size: string
  color: string
  stock: number
  sku: string
  _links?: {
    self?: { href: string }
    productVariant?: { href: string }
    product?: { href: string }
  }
}

export interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  totalStock: number
  category?: {
    id: number
    name: string
  }
  _links?: {
    self?: { href: string }
    product?: { href: string }
  }
}

export interface CartItem {
  id: number
  quantity: number
  productVariant?: ProductVariant
  product?: Product
  _links?: {
    self?: { href: string }
    cartItem?: { href: string }
    cart?: { href: string }
    productVariant?: { href: string }
  }
}

export interface Cart {
  id: number
  createdAt: string
  cartItems?: CartItem[]
  _links?: {
    self?: { href: string }
    cart?: { href: string }
    user?: { href: string }
    cartItems?: { href: string }
  }
}

export const useUserCartStore = defineStore('userCart', () => {
  // State
  const cart = ref<Cart | null>(null)
  const cartItems = ref<CartItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const cartItemsCount = computed(() => cartItems.value.length)
  const totalQuantity = computed(() =>
    cartItems.value.reduce((total, item) => total + item.quantity, 0),
  )
  const totalPrice = computed(() =>
    cartItems.value.reduce((total, item) => {
      if (item.product) {
        return total + item.product.basePrice * item.quantity
      }
      return total
    }, 0),
  )
  const hasItems = computed(() => cartItems.value.length > 0)

  // Actions
  async function fetchUserCart(userId: string | number) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/users/${userId}/cart`)
      cart.value = response.data

      if (cart.value) {
        await fetchCartItems(cart.value.id)
      }
    } catch (e) {
      console.error('Failed to fetch user cart:', e)
      if (e instanceof Error) {
        error.value = `Error loading cart: ${e.message}`
      } else {
        error.value = 'An unknown error occurred while loading cart'
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchCartItems(cartId: number) {
    try {
      const response = await api.get(`/carts/${cartId}/cartItems`)
      const items = response.data._embedded ? response.data._embedded.cartItems : []

      // Fetch product variant and product details for each cart item
      const itemsWithDetails = await Promise.all(
        items.map(async (item: CartItem) => {
          try {
            // Fetch product variant
            const variantResponse = await api.get(`/cartItems/${item.id}/productVariant`)
            item.productVariant = variantResponse.data

            // Fetch product details
            if (item.productVariant?._links?.product?.href) {
              const productUrl = item.productVariant._links.product.href
              const productResponse = await api.get(productUrl)
              item.product = productResponse.data
            }

            return item
          } catch (err) {
            console.error(`Error fetching details for cart item ${item.id}:`, err)
            return item
          }
        }),
      )

      cartItems.value = itemsWithDetails
    } catch (e) {
      console.error('Failed to fetch cart items:', e)
      throw e
    }
  }

  // Update the quantity of a specific cart item
  async function updateItemQuantity(cartItemId: number, newQuantity: number) {
    try {
      loading.value = true
      await api.patch(`/cartItems/${cartItemId}`, { quantity: newQuantity })

      // Update local state
      const itemIndex = cartItems.value.findIndex((item) => item.id === cartItemId)
      if (itemIndex !== -1) {
        cartItems.value[itemIndex].quantity = newQuantity
      }
    } catch (e) {
      console.error('Failed to update item quantity:', e)
      if (e instanceof Error) {
        error.value = `Error updating quantity: ${e.message}`
      }
    } finally {
      loading.value = false
    }
  }

  // Add a product variant to the cart
  async function addProductToCart(productVariantId: number) {
    if (!cart.value) {
      throw new Error('Cart not initialized. Please load user cart first.')
    }

    try {
      loading.value = true
      error.value = null

      console.log('🟡 [CART STORE] Adding product variant to cart:', {
        cartId: cart.value.id,
        productVariantId
      })

      // Make API call to add product to cart
      const response = await api.post(`/cart/${cart.value.id}/products/${productVariantId}`)
      
      console.log('🟢 [CART STORE] Product added successfully:', response.data)

      // Update cart data with the response
      cart.value = response.data

      // Refresh cart items to get the updated list
      if (cart.value && cart.value.cartItems) {
        cartItems.value = cart.value.cartItems
      } else if (cart.value) {
        await fetchCartItems(cart.value.id)
      }

      return { success: true, data: response.data }
    } catch (e) {
      console.error('🔴 [CART STORE] Failed to add product to cart:', e)
      let errorMessage = 'Failed to add product to cart'
      
      if (e instanceof Error) {
        errorMessage = `Error adding to cart: ${e.message}`
      } else if (e && typeof e === 'object' && 'response' in e) {
        const axiosError = e as { response?: { status?: number; data?: { message?: string } } }
        if (axiosError.response?.status === 401) {
          errorMessage = 'Authentication required. Please log in again.'
        } else if (axiosError.response?.status === 404) {
          errorMessage = 'Cart or product variant not found.'
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message
        }
      }
      
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Remove an item from the cart by its ID
  async function removeItem(cartItemId: number) {
    try {
      loading.value = true
      await api.delete(`/cartItems/${cartItemId}`)

      // Remove from local state
      cartItems.value = cartItems.value.filter((item) => item.id !== cartItemId)
    } catch (e) {
      console.error('Failed to remove cart item:', e)
      if (e instanceof Error) {
        error.value = `Error removing item: ${e.message}`
      }
    } finally {
      loading.value = false
    }
  }

  function clearCart() {
    cart.value = null
    cartItems.value = []
    error.value = null
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  return {
    // State
    cart,
    cartItems,
    loading,
    error,
    // Getters
    cartItemsCount,
    totalQuantity,
    totalPrice,
    hasItems,
    // Actions
    fetchUserCart,
    fetchCartItems,
    addProductToCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    // Utilities
    formatPrice,
    formatDate,
  }
})
