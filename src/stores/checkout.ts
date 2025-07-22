import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ShippingAddress } from '@/types/shippingAddress'

export interface ShippingMethod {
  id: string
  name: string
  price: number
  description: string
  estimatedDelivery: string
  selectedDate?: string
}

export const useCheckoutStore = defineStore('checkout', () => {
  const selectedAddress = ref<ShippingAddress | null>(null)
  const selectedShippingMethod = ref<ShippingMethod | null>(null)

  function setSelectedAddress(address: ShippingAddress | null) {
    selectedAddress.value = address
  }

  function setSelectedShippingMethod(method: ShippingMethod) {
    selectedShippingMethod.value = method
  }

  function clearCheckoutState() {
    selectedAddress.value = null
    selectedShippingMethod.value = null
  }

  return {
    selectedAddress,
    selectedShippingMethod,
    setSelectedAddress,
    setSelectedShippingMethod,
    clearCheckoutState,
  }
})
