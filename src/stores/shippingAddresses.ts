import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export interface ShippingAddress {
  id: number
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  order?: {
    id: number
    orderDate: string
    status: string
    totalAmount: number
    user?: {
      name: string
    }
  }
  _links?: {
    self?: {
      href: string
    }
    order?: {
      href: string
    }
  }
}

export const useShippingAddressesStore = defineStore('shippingAddresses', () => {
  // State
  const addresses = ref<ShippingAddress[]>([])
  const loading = ref(false)
  const error = ref('')

  // Getters
  const addressCount = computed(() => addresses.value.length)
  const hasAddresses = computed(() => addresses.value.length > 0)

  const addressesByCountry = computed(() => {
    const countries: Record<string, ShippingAddress[]> = {}
    addresses.value.forEach(address => {
      if (!countries[address.country]) {
        countries[address.country] = []
      }
      countries[address.country].push(address)
    })
    return countries
  })

  const addressesByState = computed(() => {
    const states: Record<string, ShippingAddress[]> = {}
    addresses.value.forEach(address => {
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
    addresses.value.forEach(address => {
      const key = `${address.city}, ${address.state}`
      if (!cities[key]) {
        cities[key] = []
      }
      cities[key].push(address)
    })
    return cities
  })

  const uniqueCountries = computed(() => {
    return [...new Set(addresses.value.map(addr => addr.country))].sort()
  })

  const uniqueStates = computed(() => {
    return [...new Set(addresses.value.map(addr => addr.state))].sort()
  })

  const uniqueCities = computed(() => {
    return [...new Set(addresses.value.map(addr => addr.city))].sort()
  })

  // Actions
  const fetchShippingAddresses = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await api.get('/shippingAddresses')
      addresses.value = response.data._embedded
        ? response.data._embedded.shippingAddresses
        : response.data
    } catch (err) {
      console.error('Error fetching shipping addresses:', err)
      error.value = 'Error loading shipping addresses'
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
    addresses.value.push(address)
  }

  const removeAddress = (addressId: number) => {
    const index = addresses.value.findIndex(addr => addr.id === addressId)
    if (index > -1) {
      addresses.value.splice(index, 1)
    }
  }

  const updateAddress = (addressId: number, updatedAddress: Partial<ShippingAddress>) => {
    const index = addresses.value.findIndex(addr => addr.id === addressId)
    if (index > -1) {
      addresses.value[index] = { ...addresses.value[index], ...updatedAddress }
    }
  }

  const getAddressById = (addressId: number) => {
    return addresses.value.find(addr => addr.id === addressId)
  }

  const searchAddresses = (searchTerm: string) => {
    if (!searchTerm.trim()) return addresses.value

    const term = searchTerm.toLowerCase()
    return addresses.value.filter(addr =>
      addr.street.toLowerCase().includes(term) ||
      addr.city.toLowerCase().includes(term) ||
      addr.state.toLowerCase().includes(term) ||
      addr.country.toLowerCase().includes(term) ||
      addr.zipCode.toLowerCase().includes(term)
    )
  }

  const filterByCountry = (country: string) => {
    return addresses.value.filter(addr => addr.country === country)
  }

  const filterByState = (state: string) => {
    return addresses.value.filter(addr => addr.state === state)
  }

  const filterByCity = (city: string) => {
    return addresses.value.filter(addr => addr.city === city)
  }

  const clearAddresses = () => {
    addresses.value = []
    error.value = ''
  }

  const formatFullAddress = (address: ShippingAddress) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`
  }

  const getCountryFlag = (country: string) => {
    // Simple mapping for common countries - you could expand this
    const flags: Record<string, string> = {
      'Spain': '🇪🇸',
      'USA': '🇺🇸',
      'United States': '🇺🇸',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Italy': '🇮🇹',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Mexico': '🇲🇽',
      'Brazil': '🇧🇷',
      'Argentina': '🇦🇷',
      'Portugal': '🇵🇹',
      'Netherlands': '🇳🇱',
    }
    return flags[country] || '🌍'
  }

  return {
    // State
    addresses,
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
