import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'
import type { UserOrder } from '@/stores/userOrders'

export interface ShippingAddress {
  id: number
  type: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  _links?: {
    self?: { href: string }
    shippingAddress?: { href: string }
    order?: { href: string }
  }
}

export const useShippingAddressStore = defineStore('shippingAddresses', () => {
  // State
  const shippingAddresses = ref<ShippingAddress[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const addressCount = computed(() => shippingAddresses.value.length)
  const hasAddresses = computed(() => shippingAddresses.value.length > 0)

  const addressesByCountry = computed(() => {
    const countries: Record<string, ShippingAddress[]> = {}
    shippingAddresses.value.forEach((address) => {
      if (!countries[address.country]) {
        countries[address.country] = []
      }
      countries[address.country].push(address)
    })
    return countries
  })

  const addressesByState = computed(() => {
    const states: Record<string, ShippingAddress[]> = {}
    shippingAddresses.value.forEach((address) => {
      const key = `${address.state}, ${address.country}`
      if (!states[key]) {
        states[key] = []
      }
      states[key].push(address)
    })
    return states
  })

  const addressesByCity = computed(() => {
    const cities: Record<string, ShippingAddress[]> = {}
    shippingAddresses.value.forEach((address) => {
      const key = `${address.city}, ${address.state}`
      if (!cities[key]) {
        cities[key] = []
      }
      cities[key].push(address)
    })
    return cities
  })

  const uniqueCountries = computed(() => {
    return [...new Set(shippingAddresses.value.map((addr) => addr.country))].sort()
  })

  const uniqueStates = computed(() => {
    return [...new Set(shippingAddresses.value.map((addr) => addr.state))].sort()
  })

  const uniqueCities = computed(() => {
    return [...new Set(shippingAddresses.value.map((addr) => addr.city))].sort()
  })

  // Actions
  const fetchShippingAddresses = async (userId: string | number) => {
    loading.value = true
    error.value = null
    try {
      const ordersResponse = await api.get(`/users/${userId}/orders`)
      const orders: UserOrder[] = ordersResponse.data._embedded
        ? ordersResponse.data._embedded.orders
        : []

      const addresses = await Promise.all(
        orders.map(async (order) => {
          try {
            // The link to the shipping address is on the order object itself in spring data rest
            if (order._links?.shippingAddress?.href) {
              const addressResponse = await api.get(order._links.shippingAddress.href)
              return addressResponse.data
            }
          } catch (e) {
            console.error(`Failed to fetch shipping address for order ${order.id}:`, e)
          }
          return null
        }),
      )

      shippingAddresses.value = addresses.filter(
        (address): address is ShippingAddress => address !== null,
      )
    } catch (e) {
      console.error('Failed to fetch shipping addresses:', e)
      if (e instanceof Error) {
        error.value = `Error loading shipping addresses: ${e.message}`
      } else {
        error.value = 'An unknown error occurred while loading shipping addresses'
      }
    } finally {
      loading.value = false
    }
  }

  const fetchAddressById = async (addressId: number) => {
    try {
      const response = await api.get(`/shippingAddresses/${addressId}`)
      return response.data
    } catch (err) {
      console.error(`Error fetching shipping address ${addressId}:`, err)
      throw err
    }
  }

  const addAddress = (address: ShippingAddress) => {
    shippingAddresses.value.push(address)
  }

  const removeAddress = (addressId: number) => {
    const index = shippingAddresses.value.findIndex((addr) => addr.id === addressId)
    if (index > -1) {
      shippingAddresses.value.splice(index, 1)
    }
  }

  const updateAddress = (addressId: number, updatedAddress: Partial<ShippingAddress>) => {
    const index = shippingAddresses.value.findIndex((addr) => addr.id === addressId)
    if (index > -1) {
      shippingAddresses.value[index] = { ...shippingAddresses.value[index], ...updatedAddress }
    }
  }

  const getAddressById = (addressId: number) => {
    return shippingAddresses.value.find((addr) => addr.id === addressId)
  }

  const searchAddresses = (searchTerm: string) => {
    if (!searchTerm.trim()) return shippingAddresses.value

    const term = searchTerm.toLowerCase()
    return shippingAddresses.value.filter(
      (addr) =>
        addr.street.toLowerCase().includes(term) ||
        addr.city.toLowerCase().includes(term) ||
        addr.state.toLowerCase().includes(term) ||
        addr.country.toLowerCase().includes(term) ||
        addr.zipCode.toLowerCase().includes(term),
    )
  }

  const filterByCountry = (country: string) => {
    return shippingAddresses.value.filter((addr) => addr.country === country)
  }

  const filterByState = (state: string) => {
    return shippingAddresses.value.filter((addr) => addr.state === state)
  }

  const filterByCity = (city: string) => {
    return shippingAddresses.value.filter((addr) => addr.city === city)
  }

  const clearAddresses = () => {
    shippingAddresses.value = []
    error.value = ''
  }

  const formatFullAddress = (address: ShippingAddress) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`
  }

  const getCountryFlag = (country: string) => {
    // Simple mapping for common countries - you could expand this
    const flags: Record<string, string> = {
      Spain: '🇪🇸',
      USA: '🇺🇸',
      'United States': '🇺🇸',
      France: '🇫🇷',
      Germany: '🇩🇪',
      Italy: '🇮🇹',
      'United Kingdom': '🇬🇧',
      Canada: '🇨🇦',
      Mexico: '🇲🇽',
      Brazil: '🇧🇷',
      Argentina: '🇦🇷',
      Portugal: '🇵🇹',
      Netherlands: '🇳🇱',
    }
    return flags[country] || '🌍'
  }

  return {
    // State
    shippingAddresses,
    loading,
    error,
    // Getters
    addressCount,
    hasAddresses,
    addressesByCountry,
    addressesByState,
    addressesByCity,
    uniqueCountries,
    uniqueStates,
    uniqueCities,
    // Actions
    fetchShippingAddresses,
    fetchAddressById,
    addAddress,
    removeAddress,
    updateAddress,
    getAddressById,
    searchAddresses,
    filterByCountry,
    filterByState,
    filterByCity,
    clearAddresses,
    formatFullAddress,
    getCountryFlag,
  }
})
