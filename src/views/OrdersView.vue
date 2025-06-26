<script setup lang="ts">
import { onMounted } from 'vue'
import { useOrdersStore } from '@/stores/orders'

const ordersStore = useOrdersStore()

onMounted(async () => {
  await ordersStore.fetchOrders()
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

const getStatusColor = (status: string) => {
  const colors = {
    CREATED: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    PAID: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    SHIPPED: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    DELIVERED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    CANCELED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  }
  return colors[status as keyof typeof colors] || colors.CREATED
}

const getStatusText = (status: string) => {
  // Return status as it comes from API
  return status
}

const getStatusIcon = (status: string) => {
  const icons = {
    CREATED: 'hi-document-text',
    PAID: 'hi-credit-card',
    SHIPPED: 'hi-truck',
    DELIVERED: 'hi-check-circle',
    CANCELED: 'hi-x-circle'
  }
  return icons[status as keyof typeof icons] || 'hi-document-text'
}
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <div class="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
            <v-icon name="hi-clipboard-list" scale="2.5" class="text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Orders List</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Manage and monitor all placed orders
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="ordersStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Loading orders...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="ordersStore.error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2"
      >
        <v-icon name="hi-exclamation-circle" scale="1.2" />
        <span>{{ ordersStore.error }}</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="ordersStore.orders.length === 0" class="text-center py-12">
        <div class="flex justify-center mb-4">
          <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
            <v-icon name="hi-clipboard-list" scale="3" class="text-gray-400 dark:text-gray-600" />
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h3>
        <p class="text-gray-600 dark:text-gray-300">No orders were found in the system</p>
      </div>

      <!-- Orders Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="order in ordersStore.orders"
          :key="order.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- Order Header -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <v-icon :name="getStatusIcon(order.status)" scale="1.2" class="text-blue-600 dark:text-blue-400" />
                <span class="font-semibold text-gray-900 dark:text-white">Order #{{ order.id }}</span>
              </div>
              <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`">
                {{ getStatusText(order.status) }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <!-- Order Date -->
            <div class="mb-4">
              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <v-icon name="hi-calendar" scale="1" />
                <span>{{ formatDate(order.orderDate) }}</span>
              </div>
            </div>

            <!-- Order Info Grid -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <!-- Total Amount -->
              <div class="text-center">
                <div class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {{ formatPrice(order.totalAmount) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Total</div>
              </div>

              <!-- Order Items Count -->
              <div class="text-center">
                <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {{ order.orderItems?.length || 0 }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Items</div>
              </div>
            </div>

            <!-- Discount Badge -->
            <div v-if="order.hasDiscount" class="mb-4">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
              >
                <v-icon name="hi-tag" scale="0.8" class="mr-1" />
                Discount applied
              </span>
            </div>

            <!-- Payment Status -->
            <div v-if="order.payment" class="mb-4">
              <div class="flex items-center space-x-2 text-sm">
                <v-icon name="hi-credit-card" scale="1" class="text-gray-500 dark:text-gray-400" />
                <span class="text-gray-600 dark:text-gray-300">
                  Payment: {{ order.payment.paymentMethod }}
                </span>
              </div>
            </div>

            <!-- User Info -->
            <div v-if="order.user" class="mb-4">
              <div class="flex items-center space-x-2 text-sm">
                <v-icon name="hi-user" scale="1" class="text-gray-500 dark:text-gray-400" />
                <span class="text-gray-600 dark:text-gray-300">
                  {{ order.user.name }}
                </span>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="space-y-2">
              <button
                class="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <v-icon name="hi-eye" scale="1" />
                <span>View details</span>
              </button>
              <div class="flex space-x-2">
                <button
                  v-if="order.status !== 'DELIVERED' && order.status !== 'CANCELED'"
                  class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                >
                  <v-icon name="hi-pencil" scale="0.9" />
                  <span>Update</span>
                </button>
                <button
                  v-if="order.status === 'CREATED' || order.status === 'PAID'"
                  class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                >
                  <v-icon name="hi-x-circle" scale="0.9" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>

            <!-- Order ID -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span class="text-xs text-gray-500 dark:text-gray-400"> ID: {{ order.id }} </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Count -->
      <div v-if="ordersStore.orders.length > 0" class="mt-8 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
        >
          <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
            Total: {{ ordersStore.orderCount }} order{{
              ordersStore.orderCount !== 1 ? 's' : ''
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}
</style>
