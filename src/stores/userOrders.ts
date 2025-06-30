import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export interface UserOrder {
  id: number
  orderDate: string
  status: 'CREATED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED'
  totalAmount: number
  hasDiscount: boolean
  _links?: {
    self?: { href: string }
    order?: { href: string }
    orderItems?: { href: string }
    discountCode?: { href: string }
    payment?: { href: string }
    user?: { href: string }
  }
}

export const useUserOrdersStore = defineStore('userOrders', () => {
  // State
  const orders = ref<UserOrder[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const orderCount = computed(() => orders.value.length)
  const totalRevenue = computed(() => {
    return orders.value.reduce((total, order) => total + order.totalAmount, 0)
  })
  const averageOrderValue = computed(() => {
    if (orders.value.length === 0) return 0
    return Math.round((totalRevenue.value / orders.value.length) * 100) / 100
  })

  const ordersByStatus = computed(() => {
    return {
      CREATED: orders.value.filter(order => order.status === 'CREATED'),
      PAID: orders.value.filter(order => order.status === 'PAID'),
      SHIPPED: orders.value.filter(order => order.status === 'SHIPPED'),
      DELIVERED: orders.value.filter(order => order.status === 'DELIVERED'),
      CANCELED: orders.value.filter(order => order.status === 'CANCELED')
    }
  })

  const ordersWithDiscount = computed(() => orders.value.filter((o) => o.hasDiscount))
  const completedOrders = computed(() => orders.value.filter((o) => o.status === 'DELIVERED'))
  const pendingOrders = computed(() => orders.value.filter((o) => o.status === 'CREATED'))

  // Actions
  async function fetchUserOrders(userId: string | number) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/users/${userId}/orders`)

      // Manejar diferentes estructuras de respuesta
      if (response.data._embedded) {
        orders.value = response.data._embedded.orders || []
      } else if (Array.isArray(response.data)) {
        orders.value = response.data
      } else {
        orders.value = []
      }
    } catch (e) {
      console.error('Failed to fetch user orders:', e)
      if (e instanceof Error) {
        error.value = `Error loading orders: ${e.message}`
      } else {
        error.value = 'An unknown error occurred while loading orders'
      }
    } finally {
      loading.value = false
    }
  }

  function clearOrders() {
    orders.value = []
  }

  // Utility functions
  const getStatusText = (status: UserOrder['status']) => {
    const texts = {
      CREATED: 'Created',
      PAID: 'Paid',
      SHIPPED: 'Shipped',
      DELIVERED: 'Delivered',
      CANCELED: 'Canceled'
    }
    return texts[status] || status
  }

  const getStatusColor = (status: UserOrder['status']) => {
    const colors = {
      CREATED: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
      PAID: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      SHIPPED: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      DELIVERED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      CANCELED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    }
    return colors[status] || colors.CREATED
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    orders,
    loading,
    error,
    orderCount,
    totalRevenue,
    averageOrderValue,
    ordersByStatus,
    ordersWithDiscount,
    completedOrders,
    pendingOrders,
    fetchUserOrders,
    clearOrders,
    getStatusText,
    getStatusColor,
    formatPrice,
    formatDate
  }
})
