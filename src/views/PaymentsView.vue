<script setup lang="ts">
import { onMounted } from 'vue'
import { usePaymentsStore } from '@/stores/payments'

const paymentsStore = usePaymentsStore()

onMounted(async () => {
  await paymentsStore.fetchPayments()
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
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

const getPaymentMethodColor = (method: string) => {
  const methodLower = method.toLowerCase()
  if (methodLower.includes('credit') || methodLower.includes('card')) return 'bg-blue-100 text-blue-600'
  if (methodLower.includes('paypal')) return 'bg-indigo-100 text-indigo-600'
  if (methodLower.includes('bank')) return 'bg-green-100 text-green-600'
  if (methodLower.includes('cash')) return 'bg-gray-100 text-gray-600'
  return 'bg-gray-100 text-gray-600'
}
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <div class="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
            <v-icon name="hi-credit-card" scale="2.5" class="text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Payment Management</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Monitor and manage all payment transactions
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Total Payments -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Payments</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ paymentsStore.paymentCount }}</p>
            </div>
            <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <v-icon name="hi-credit-card" scale="1.5" class="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <!-- Completed Payments -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ paymentsStore.completedPayments.length }}</p>
            </div>
            <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <v-icon name="hi-check-circle" scale="1.5" class="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <!-- Pending Payments -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ paymentsStore.pendingPayments.length }}</p>
            </div>
            <div class="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
              <v-icon name="hi-clock" scale="1.5" class="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <!-- Cancelled Payments -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Cancelled Payments</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ paymentsStore.failedPayments.length }}</p>
            </div>
            <div class="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
              <v-icon name="hi-x-circle" scale="1.5" class="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Total Revenue Card -->
      <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">Total Completed Revenue</p>
            <p class="text-3xl font-bold">{{ formatPrice(paymentsStore.totalCompletedAmount) }}</p>
          </div>
          <div class="bg-white/20 p-4 rounded-full">
            <v-icon name="hi-cash" scale="2" class="text-white" />
          </div>
        </div>
      </div>

      <!-- Total Pending Amount Card -->
      <div class="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-yellow-100 text-sm font-medium">Total Pending Amount</p>
            <p class="text-3xl font-bold">{{ formatPrice(paymentsStore.totalPendingAmount) }}</p>
          </div>
          <div class="bg-white/20 p-4 rounded-full">
            <v-icon name="hi-clock" scale="2" class="text-white" />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="paymentsStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Loading payments...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="paymentsStore.error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2"
      >
        <v-icon name="hi-exclamation-circle" scale="1.2" />
        <span>{{ paymentsStore.error }}</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="paymentsStore.payments.length === 0" class="text-center py-12">
        <div class="flex justify-center mb-4">
          <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
            <v-icon name="hi-credit-card" scale="3" class="text-gray-400 dark:text-gray-600" />
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No payments found</h3>
        <p class="text-gray-600 dark:text-gray-300">No payment transactions are available in the system</p>
      </div>

      <!-- Payments Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="payment in paymentsStore.payments"
          :key="payment.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- Payment Header -->
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <v-icon :name="paymentsStore.getPaymentMethodIcon(payment.paymentMethod)" scale="1.2" class="text-green-600 dark:text-green-400" />
                <span class="font-semibold text-gray-900 dark:text-white">Payment #{{ payment.id }}</span>
              </div>
              <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${paymentsStore.getStatusColor(payment.status)}`">
                <v-icon :name="paymentsStore.getStatusIcon(payment.status)" scale="0.8" class="mr-1" />
                {{ payment.status }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <!-- Payment Method -->
            <div class="mb-4">
              <div class="flex items-center space-x-2">
                <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(payment.paymentMethod)}`">
                  {{ payment.paymentMethod }}
                </span>
              </div>
            </div>

            <!-- Amount -->
            <div class="mb-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ payment.amount ? formatPrice(payment.amount) : 'N/A' }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Amount</div>
              </div>
            </div>

            <!-- Order Information -->
            <div v-if="payment.order" class="mb-4">
              <div class="space-y-2">
                <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <v-icon name="hi-shopping-cart" scale="1" />
                  <span>Order #{{ payment.order.id }}</span>
                </div>
                <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <v-icon name="hi-calendar" scale="1" />
                  <span>{{ formatDate(payment.order.orderDate) }}</span>
                </div>
                <div v-if="payment.order.user" class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <v-icon name="hi-user" scale="1" />
                  <span>{{ payment.order.user.name }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Actions -->
            <div class="space-y-2">
              <button
                class="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <v-icon name="hi-eye" scale="1" />
                <span>View Details</span>
              </button>
              <div class="flex space-x-2">
                <button
                  v-if="payment.status === 'PENDING'"
                  class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                >
                  <v-icon name="hi-check" scale="0.9" />
                  <span>Process</span>
                </button>
                <button
                  v-if="payment.status === 'PENDING'"
                  class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                >
                  <v-icon name="hi-x" scale="0.9" />
                  <span>Cancel</span>
                </button>
                <button
                  v-else
                  class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <v-icon name="hi-pencil" scale="0.9" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            <!-- Payment ID -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span class="text-xs text-gray-500 dark:text-gray-400">ID: {{ payment.id }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Payment Button -->
      <div class="mt-12 text-center">
        <button
          class="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          <v-icon name="hi-plus" scale="1.1" />
          <span>Add new payment</span>
        </button>
      </div>

      <!-- Payments Count -->
      <div v-if="paymentsStore.payments.length > 0" class="mt-8 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full"
        >
          <span class="text-green-600 dark:text-green-400 font-semibold">
            Total: {{ paymentsStore.paymentCount }} payment{{
              paymentsStore.paymentCount !== 1 ? 's' : ''
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
