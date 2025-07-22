import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export interface User {
  id: number
  name: string
  email: string
  username: string
}

export interface DiscountCode {
  id: number
  code: string
  discountPercent: number
  isActive: boolean
}

export interface Payment {
  id: number
  paymentMethod: string
  paymentStatus: string
  paymentDate: string
  amount: number
}

export interface OrderItem {
  id: number
  quantity: number
  unitPrice: number
  totalPrice: number
  product: {
    id: number
    name: string
    description: string
    basePrice: number
  }
}

export interface Order {
  id: number
  orderDate: string
  status: 'CREATED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED'
  totalAmount: number
  hasDiscount: boolean
  payment?: Payment
  discountCode?: DiscountCode
  orderItems?: OrderItem[]
  user?: User
}

export const useOrdersStore = defineStore('orders', () => {
  // State
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref('')
  const currentUserId = ref<number | null>(null)

  // Getters
  const orderCount = computed(() => orders.value.length)
  const hasOrders = computed(() => orders.value.length > 0)

  const totalRevenue = computed(() => {
    return orders.value.reduce((total, order) => total + order.totalAmount, 0)
  })

  const averageOrderValue = computed(() => {
    if (orders.value.length === 0) return 0
    return Math.round((totalRevenue.value / orders.value.length) * 100) / 100
  })

  const ordersByStatus = computed(() => {
    return {
      CREATED: orders.value.filter((order) => order.status === 'CREATED'),
      PAID: orders.value.filter((order) => order.status === 'PAID'),
      SHIPPED: orders.value.filter((order) => order.status === 'SHIPPED'),
      DELIVERED: orders.value.filter((order) => order.status === 'DELIVERED'),
      CANCELED: orders.value.filter((order) => order.status === 'CANCELED'),
    }
  })

  const ordersWithDiscount = computed(() => {
    return orders.value.filter((order) => order.hasDiscount)
  })

  const paidOrders = computed(() => {
    return orders.value.filter(
      (order) =>
        order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED',
    )
  })

  const pendingOrders = computed(() => {
    return orders.value.filter((order) => order.status === 'CREATED')
  })

  const completedOrders = computed(() => {
    return orders.value.filter((order) => order.status === 'DELIVERED')
  })

  // Actions
  const fetchOrdersByUser = async (userId: number) => {
  loading.value = true
  error.value = ''
  currentUserId.value = userId

  try {
    const response = await api.get(`/users/${userId}/orders`)
    orders.value = response.data._embedded?.orders || []
  } catch (err) {
    console.error(`Error fetching orders for user ${userId}:`, err)
    error.value = 'Error al cargar los pedidos del usuario'
  } finally {
    loading.value = false
  }
}

  const fetchOrderById = async (orderId: number) => {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return response.data
    } catch (err) {
      console.error(`Error fetching order ${orderId}:`, err)
      throw err
    }
  }

  const fetchOrdersByStatus = async (status: Order['status']) => {
    loading.value = true
    error.value = ''

    try {
      const response = await api.get(`/orders/search/findByStatus?status=${status}`)
      orders.value = response.data._embedded ? response.data._embedded.orders : response.data
    } catch (err) {
      console.error(`Error fetching orders with status ${status}:`, err)
      error.value = `Error al cargar los pedidos con estado ${status}`
    } finally {
      loading.value = false
    }
  }

  const createOrder = async (orderData: Partial<Order>) => {
    try {
      const response = await api.post('/orders', orderData)
      const newOrder = response.data
      orders.value.unshift(newOrder)
      return newOrder
    } catch (err) {
      console.error('Error creating order:', err)
      throw err
    }
  }

  const updateOrderStatus = async (orderId: number, status: Order['status']) => {
    try {
      const response = await api.patch(`/orders/${orderId}`, { status })
      const updatedOrder = response.data

      const index = orders.value.findIndex((order) => order.id === orderId)
      if (index > -1) {
        orders.value[index] = { ...orders.value[index], ...updatedOrder }
      }

      return updatedOrder
    } catch (err) {
      console.error(`Error updating order ${orderId} status:`, err)
      throw err
    }
  }

  const cancelOrder = async (orderId: number) => {
    return updateOrderStatus(orderId, 'CANCELED')
  }

  const addOrder = (order: Order) => {
    orders.value.unshift(order)
  }

  const removeOrder = (orderId: number) => {
    const index = orders.value.findIndex((order) => order.id === orderId)
    if (index > -1) {
      orders.value.splice(index, 1)
    }
  }

  const updateOrder = (orderId: number, updatedOrder: Partial<Order>) => {
    const index = orders.value.findIndex((order) => order.id === orderId)
    if (index > -1) {
      orders.value[index] = { ...orders.value[index], ...updatedOrder }
    }
  }

  const getOrderById = (orderId: number) => {
    return orders.value.find((order) => order.id === orderId)
  }

  const getOrdersByDateRange = (startDate: string, endDate: string) => {
    return orders.value.filter((order) => {
      const orderDate = new Date(order.orderDate)
      const start = new Date(startDate)
      const end = new Date(endDate)
      return orderDate >= start && orderDate <= end
    })
  }

  const searchOrders = (searchTerm: string) => {
    if (!searchTerm.trim()) return orders.value

    const term = searchTerm.toLowerCase()
    return orders.value.filter(
      (order) =>
        order.id.toString().includes(term) ||
        order.user?.name.toLowerCase().includes(term) ||
        order.user?.email.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term),
    )
  }

  const filterOrdersByAmount = (minAmount: number, maxAmount: number) => {
    return orders.value.filter(
      (order) => order.totalAmount >= minAmount && order.totalAmount <= maxAmount,
    )
  }

  const clearOrders = () => {
    orders.value = []
    error.value = ''
    currentUserId.value = null
  }

  const getStatusText = (status: Order['status']) => {
    const texts = {
      CREATED: 'Creado',
      PAID: 'Pagado',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregado',
      CANCELED: 'Cancelado',
    }
    return texts[status] || status
  }

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      CREATED: 'gray',
      PAID: 'blue',
      SHIPPED: 'yellow',
      DELIVERED: 'green',
      CANCELED: 'red',
    }
    return colors[status] || 'gray'
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getOrderItemsCount = (order: Order) => {
    return order.orderItems?.length || 0
  }

  const getOrderTotalItems = (order: Order) => {
    return order.orderItems?.reduce((total, item) => total + item.quantity, 0) || 0
  }

  return {
    // State
    orders,
    loading,
    error,
    currentUserId,
    // Getters
    orderCount,
    hasOrders,
    totalRevenue,
    averageOrderValue,
    ordersByStatus,
    ordersWithDiscount,
    paidOrders,
    pendingOrders,
    completedOrders,
    // Actions
    fetchOrdersByUser,
    fetchOrderById,
    fetchOrdersByStatus,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    addOrder,
    removeOrder,
    updateOrder,
    getOrderById,
    getOrdersByDateRange,
    searchOrders,
    filterOrdersByAmount,
    clearOrders,
    getStatusText,
    getStatusColor,
    formatPrice,
    formatDate,
    getOrderItemsCount,
    getOrderTotalItems,
  }
})
