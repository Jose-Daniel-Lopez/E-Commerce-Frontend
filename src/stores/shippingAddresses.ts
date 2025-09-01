import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'
import type {
  ShippingAddress,
  CreateShippingAddressRequest,
  UpdateShippingAddressRequest,
  AssignAddressToOrderRequest,
  ShippingAddressApiResponse
} from '@/types/shippingAddress'

export const useShippingAddressStore = defineStore('shippingAddresses', () => {
  // ========== STATE ==========
  const shippingAddresses = ref<ShippingAddress[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ========== GETTERS ==========
  const addressCount = computed(() => shippingAddresses.value.length)
  const hasAddresses = computed(() => shippingAddresses.value.length > 0)

  const addressesByType = computed(() => {
    const types: Record<string, ShippingAddress[]> = {}
    shippingAddresses.value.forEach((address) => {
      if (!types[address.addressType]) {
        types[address.addressType] = []
      }
      types[address.addressType].push(address)
    })
    return types
  })

  const getDefaultAddress = computed(() => {
    return shippingAddresses.value.length > 0 ? shippingAddresses.value[0] : null
  })

  // ========== API ACTIONS ==========

  /**
   * Fetch all shipping addresses for a specific user
   */
  const fetchUserAddresses = async (userId: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/users/${userId}/shippingAddresses`)

      // Handle array response
      if (Array.isArray(response.data)) {
        shippingAddresses.value = response.data.map(convertApiResponseToAddress)
      } else if (response.data) {
        // Handle single address response (fallback)
        const addressData: ShippingAddressApiResponse = response.data
        const address = convertApiResponseToAddress(addressData)
        shippingAddresses.value = [address]
      } else {
        shippingAddresses.value = []
      }

    } catch (e) {
      console.error('Failed to fetch user addresses:', e)

      // Handle 404 (user has no address) as a valid empty state
      const isAxiosError = (error: unknown): error is { response?: { status: number } } => {
        return typeof error === 'object' && error !== null && 'response' in error
      }

      if (isAxiosError(e) && e.response?.status === 404) {
        shippingAddresses.value = []
        error.value = null // No error for empty state
      } else {
        error.value = e instanceof Error ? e.message : 'Failed to load addresses'
        shippingAddresses.value = []
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new shipping address
   */
  const createAddress = async (addressData: CreateShippingAddressRequest): Promise<ShippingAddress | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/shippingAddresses', addressData)
      const newAddress = convertApiResponseToAddress(response.data)

      // Add to local state
      shippingAddresses.value.push(newAddress)

      return newAddress
    } catch (e) {
      console.error('Failed to create address:', e)
      error.value = e instanceof Error ? e.message : 'Failed to create address'
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing shipping address
   */
  const updateAddress = async (addressData: UpdateShippingAddressRequest): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/shippingAddresses/${addressData.id}`, addressData)
      const updatedAddress = convertApiResponseToAddress(response.data)

      // Update local state
      const index = shippingAddresses.value.findIndex(addr => addr.id === addressData.id)
      if (index !== -1) {
        shippingAddresses.value[index] = updatedAddress
      }

      return true
    } catch (e) {
      console.error('Failed to update address:', e)
      error.value = e instanceof Error ? e.message : 'Failed to update address'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a shipping address
   */
  const deleteAddress = async (addressId: number): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/shippingAddresses/${addressId}`)

      // Remove from local state
      const index = shippingAddresses.value.findIndex(addr => addr.id === addressId)
      if (index !== -1) {
        shippingAddresses.value.splice(index, 1)
      }

      return true
    } catch (e) {
      console.error('Failed to delete address:', e)
      error.value = e instanceof Error ? e.message : 'Failed to delete address'

      // Re-throw the error so the component can handle specific cases
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Assign a shipping address to an order
   */
  const assignAddressToOrder = async (orderId: number, addressId: number): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const request: AssignAddressToOrderRequest = { orderId, addressId }
      await api.post('/shippingAddresses/assign-to-order', request)
      return true
    } catch (e) {
      console.error('Failed to assign address to order:', e)
      error.value = e instanceof Error ? e.message : 'Failed to assign address to order'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Get default address for a user (using the same endpoint since only one address per user)
   */
  const fetchDefaultAddress = async (userId: number): Promise<ShippingAddress | null> => {
    try {
      const response = await api.get(`/shippingAddresses/${userId}`)
      return convertApiResponseToAddress(response.data)
    } catch (e) {
      console.error('Failed to fetch default address:', e)
      return null
    }
  }

  /**
   * Get shipping address for a specific order
   */
  const fetchOrderAddress = async (orderId: number): Promise<ShippingAddress | null> => {
    try {
      const response = await api.get(`/shippingAddresses/order/${orderId}`)
      return convertApiResponseToAddress(response.data)
    } catch (e) {
      console.error('Failed to fetch order address:', e)
      return null
    }
  }

  // ========== UTILITY FUNCTIONS ==========

  /**
   * Convert API response to our ShippingAddress interface
   */
  const convertApiResponseToAddress = (apiData: ShippingAddressApiResponse): ShippingAddress => {
    return {
      id: apiData.id,
      title: apiData.title,
      addressType: apiData.addressType as 'HOME' | 'OFFICE' | 'PICKUP',
      street: apiData.street,
      city: apiData.city,
      state: apiData.state,
      zipCode: apiData.zipCode,
      country: apiData.country,
      userId: apiData.userId
    }
  }

  /**
   * Format address for display
   */
  const formatAddress = (address: ShippingAddress): string => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`
  }

  /**
   * Get address type display label
   */
  const getAddressTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'HOME': 'Home',
      'OFFICE': 'Office',
      'PICKUP': 'Pick up point'
    }
    return labels[type] || type
  }

  /**
   * Find address by ID
   */
  const getAddressById = (addressId: number): ShippingAddress | undefined => {
    return shippingAddresses.value.find(addr => addr.id === addressId)
  }

  /**
   * Clear all addresses and reset state
   */
  const clearAddresses = () => {
    shippingAddresses.value = []
    error.value = null
    loading.value = false
  }

  /**
   * Search addresses
   */
  const searchAddresses = (searchTerm: string): ShippingAddress[] => {
    if (!searchTerm.trim()) return shippingAddresses.value

    const term = searchTerm.toLowerCase()
    return shippingAddresses.value.filter(addr =>
      addr.title.toLowerCase().includes(term) ||
      addr.street.toLowerCase().includes(term) ||
      addr.city.toLowerCase().includes(term) ||
      addr.state.toLowerCase().includes(term) ||
      addr.country.toLowerCase().includes(term)
    )
  }

  return {
    // State
    shippingAddresses,
    loading,
    error,

    // Getters
    addressCount,
    hasAddresses,
    addressesByType,
    getDefaultAddress,

    // API Actions
    fetchUserAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    assignAddressToOrder,
    fetchDefaultAddress,
    fetchOrderAddress,

    // Utilities
    formatAddress,
    getAddressTypeLabel,
    getAddressById,
    clearAddresses,
    searchAddresses
  }
})
