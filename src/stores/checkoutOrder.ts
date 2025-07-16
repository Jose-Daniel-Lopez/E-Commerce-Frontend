import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'

export interface Order {
  id: number
  orderTrackingNumber: string
  totalPrice: number
  totalQuantity: number
  status: string
  dateCreated: string
  lastUpdated: string
  _links?: {
    self: { href: string }
    order: { href: string }
    user: { href: string }
    shippingAddress: { href: string }
    billingAddress: { href: string }
  }
}

export const useCheckoutOrderStore = defineStore('checkoutOrder', () => {
  const order = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function createOrderForUser(userId: number) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/orders', {
        user: `/api/users/${userId}`,
        status: 'PENDING_CHECKOUT'
      })
      order.value = response.data
      return order.value
    } catch (e) {
      console.error('Failed to create order:', e)
      if (e instanceof Error) {
        error.value = `Error creating order: ${e.message}`
      } else {
        error.value = 'An unknown error occurred while creating the order'
      }
      throw e
    } finally {
      loading.value = false
    }
  }

  function clearOrder() {
    order.value = null
  }

  return {
    order,
    loading,
    error,
    createOrderForUser,
    clearOrder
  }
})
