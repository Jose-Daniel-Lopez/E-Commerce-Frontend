import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export interface UserAddress {
  id: number
  street: string
  city: string
  state: string
  postalCode?: string
  zipCode?: string  // La API devuelve zipCode en lugar de postalCode
  country: string
  isShippingAddress?: boolean
  isBillingAddress?: boolean
  _links?: {
    self?: { href: string }
    address?: { href: string }
    user?: { href: string }
  }
}

export const useUserAddressesStore = defineStore('userAddresses', () => {
  // State
  const addresses = ref<UserAddress[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const addressCount = computed(() => addresses.value.length)
  const shippingAddresses = computed(() => addresses.value.filter((a) => a.isShippingAddress))
  const billingAddresses = computed(() => addresses.value.filter((a) => a.isBillingAddress))

  // Actions
  async function fetchUserAddresses(userId: string | number) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/users/${userId}/addresses`)
      
      // Manejar diferentes estructuras de respuesta
      if (response.data._embedded) {
        addresses.value = response.data._embedded.userAddresses || response.data._embedded.addresses || []
      } else if (Array.isArray(response.data)) {
        addresses.value = response.data
      } else {
        addresses.value = []
      }
    } catch (e) {
      console.error('Failed to fetch user addresses:', e)
      if (e instanceof Error) {
        error.value = `Error loading addresses: ${e.message}`
      } else {
        error.value = 'An unknown error occurred while loading addresses'
      }
    } finally {
      loading.value = false
    }
  }

  function clearAddresses() {
    addresses.value = []
  }

  return {
    addresses,
    loading,
    error,
    addressCount,
    shippingAddresses,
    billingAddresses,
    fetchUserAddresses,
    clearAddresses
  }
})
