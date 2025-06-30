<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserOrdersStore } from '@/stores/userOrders'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const route = useRoute()
const userOrdersStore = useUserOrdersStore()
const usersStore = useUsersStore()

const {
  orders,
  loading: ordersLoading,
  error: ordersError,
  orderCount,
  totalRevenue,
  averageOrderValue
} = storeToRefs(userOrdersStore)
const {
  selectedUser: user,
  loading: userLoading,
  error: userError
} = storeToRefs(usersStore)

const userId = route.params.userId as string

const loading = computed(() => ordersLoading.value || userLoading.value)
const error = computed(() => ordersError.value || userError.value)

onMounted(async () => {
  if (userId) {
    try {
      await usersStore.fetchUserById(userId)
      await userOrdersStore.fetchUserOrders(userId)
    } catch (err) {
      console.error('Error loading user orders:', err)
    }
  } else {
    console.error('No userId provided in route params')
  }
})
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div v-if="user" class="flex items-center justify-center space-x-4 mb-4">
          <div
            class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="user.avatar"
              :src="user.avatar"
              :alt="user.displayName"
              class="w-full h-full object-cover"
              @error="
                ($event.target as HTMLImageElement)?.style &&
                (($event.target as HTMLImageElement).style.display = 'none')
              "
            />
            <span v-else class="text-2xl font-bold text-gray-600 dark:text-gray-300">
              {{ usersStore.getInitials(user.displayName || '?') }}
            </span>
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ user.displayName || 'User' }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300">{{ user.email || '' }}</p>
          </div>
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          User Orders
        </h3>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          All orders placed by this user
        </p>
      </div>

      <!-- Order Statistics -->
      <div v-if="orders.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ orderCount }}</p>
            </div>
            <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <v-icon name="hi-shopping-bag" scale="1.5" class="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ userOrdersStore.formatPrice(totalRevenue) }}</p>
            </div>
            <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <v-icon name="hi-currency-dollar" scale="1.5" class="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Average Order</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ userOrdersStore.formatPrice(averageOrderValue) }}</p>
            </div>
            <div class="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <v-icon name="hi-chart-bar" scale="1.5" class="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Loading orders...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center"
      >
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="text-center py-12">
        <div class="flex justify-center mb-4">
          <div class="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full">
            <v-icon name="hi-shopping-bag" scale="3" class="text-blue-500 dark:text-blue-400" />
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h3>
        <p class="text-gray-600 dark:text-gray-300">
          This user has not placed any orders yet.
        </p>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-6">
            <!-- Order Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <span class="text-lg font-semibold text-gray-900 dark:text-white">
                  Order #{{ order.id }}
                </span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="userOrdersStore.getStatusColor(order.status)"
                >
                  <v-icon
                    :name="
                      order.status === 'DELIVERED'
                        ? 'hi-check-circle'
                        : order.status === 'SHIPPED'
                          ? 'hi-truck'
                          : order.status === 'PAID'
                            ? 'hi-credit-card'
                            : order.status === 'CANCELED'
                              ? 'hi-x-circle'
                              : 'hi-clock'
                    "
                    scale="0.9"
                    class="mr-1.5"
                  />
                  {{ userOrdersStore.getStatusText(order.status) }}
                </span>
                <span v-if="order.hasDiscount" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200">
                  <v-icon name="hi-tag" scale="0.8" class="mr-1" />
                  Discount Applied
                </span>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                <p class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ userOrdersStore.formatPrice(order.totalAmount) }}
                </p>
              </div>
            </div>

            <!-- Order Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                <p class="text-gray-800 dark:text-white">{{ userOrdersStore.formatDate(order.orderDate) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p class="text-gray-800 dark:text-white">{{ userOrdersStore.getStatusText(order.status) }}</p>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div class="flex flex-wrap gap-3">
                <button
                  class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <v-icon name="hi-eye" scale="0.9" />
                  <span>View Details</span>
                </button>
                <button
                  v-if="order._links?.orderItems"
                  class="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  <v-icon name="hi-collection" scale="0.9" />
                  <span>View Items</span>
                </button>
                <button
                  v-if="order._links?.payment"
                  class="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  <v-icon name="hi-credit-card" scale="0.9" />
                  <span>Payment Info</span>
                </button>
                <button
                  v-if="order.status === 'CREATED'"
                  class="flex items-center space-x-2 px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-lg transition-colors"
                >
                  <v-icon name="hi-x-circle" scale="0.9" />
                  <span>Cancel Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Button and Actions -->
      <div class="mt-12 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <button
          @click="$router.push({ name: 'users' })"
          class="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
        >
          <v-icon name="hi-arrow-left" scale="1.1" />
          <span>Back to Users</span>
        </button>

        <button
          class="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
          <v-icon name="hi-plus" scale="1.1" />
          <span>Create New Order</span>
        </button>
      </div>

      <!-- Orders Count -->
      <div v-if="orderCount > 0" class="mt-8 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full"
        >
          <span class="text-blue-600 dark:text-blue-400 font-semibold">
            Total: {{ orderCount }} order{{ orderCount !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
