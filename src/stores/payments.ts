import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export interface Payment {
  id: number
  paymentMethod: string
  amount: number,
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  order?: {
    id: number
    orderDate: string
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

export const usePaymentsStore = defineStore('payments', () => {
  // State
  const payments = ref<Payment[]>([])
  const loading = ref(false)
  const error = ref('')

  // Getters
  const paymentCount = computed(() => payments.value.length)
  const hasPayments = computed(() => payments.value.length > 0)

  const pendingPayments = computed(() =>
    payments.value.filter(payment => payment.status === 'PENDING')
  )

  const completedPayments = computed(() =>
    payments.value.filter(payment => payment.status === 'COMPLETED')
  )

  const failedPayments = computed(() =>
    payments.value.filter(payment => payment.status === 'FAILED')
  )

  const totalPendingAmount = computed(() => {
    return pendingPayments.value.reduce((total, payment) => {
      return total + payment.amount
    }, 0)
  })

  const totalCompletedAmount = computed(() => {
    return completedPayments.value.reduce((total, payment) => {
      return total + payment.amount
    }, 0)
  })

  const paymentsByMethod = computed(() => {
    const methods: Record<string, Payment[]> = {}
    payments.value.forEach(payment => {
      if (!methods[payment.paymentMethod]) {
        methods[payment.paymentMethod] = []
      }
      methods[payment.paymentMethod].push(payment)
    })
    return methods
  })

  // Actions
  const fetchPayments = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await api.get('/payments')
      payments.value = response.data._embedded
        ? response.data._embedded.payments
        : response.data
    } catch (err) {
      console.error('Error fetching payments:', err)
      error.value = 'Error loading payments'
    } finally {
      loading.value = false
    }
  }

  const fetchPaymentById = async (paymentId: number) => {
    try {
      const response = await api.get(`/payments/${paymentId}`)
      return response.data
    } catch (err) {
      console.error(`Error fetching payment ${paymentId}:`, err)
      throw err
    }
  }

  const addPayment = (payment: Payment) => {
    payments.value.push(payment)
  }

  const removePayment = (paymentId: number) => {
    const index = payments.value.findIndex(payment => payment.id === paymentId)
    if (index > -1) {
      payments.value.splice(index, 1)
    }
  }

  const updatePayment = (paymentId: number, updatedPayment: Partial<Payment>) => {
    const index = payments.value.findIndex(payment => payment.id === paymentId)
    if (index > -1) {
      payments.value[index] = { ...payments.value[index], ...updatedPayment }
    }
  }

  const getPaymentById = (paymentId: number) => {
    return payments.value.find(payment => payment.id === paymentId)
  }

  const clearPayments = () => {
    payments.value = []
    error.value = ''
  }

  const getStatusColor = (status: Payment['status']) => {
    const colors = {
      PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      COMPLETED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    }
    return colors[status] || colors.PENDING
  }

  const getStatusIcon = (status: Payment['status']) => {
    const icons = {
      PENDING: 'hi-clock',
      COMPLETED: 'hi-check-circle',
      FAILED: 'hi-x-circle'
    }
    return icons[status] || 'hi-clock'
  }

  const getPaymentMethodIcon = (method: string) => {
    const methodLower = method.toLowerCase()
    if (methodLower.includes('credit') || methodLower.includes('card')) return 'hi-credit-card'
    if (methodLower.includes('paypal')) return 'fa-paypal'
    if (methodLower.includes('bank') || methodLower.includes('transfer')) return 'hi-office-building'
    if (methodLower.includes('cash')) return 'hi-cash'
    return 'hi-credit-card'
  }

  return {
    // State
    payments,
    loading,
    error,
    // Getters
    paymentCount,
    hasPayments,
    pendingPayments,
    completedPayments,
    failedPayments,
    totalPendingAmount,
    totalCompletedAmount,
    paymentsByMethod,
    // Actions
    fetchPayments,
    fetchPaymentById,
    addPayment,
    removePayment,
    updatePayment,
    getPaymentById,
    clearPayments,
    getStatusColor,
    getStatusIcon,
    getPaymentMethodIcon,
  }
})
