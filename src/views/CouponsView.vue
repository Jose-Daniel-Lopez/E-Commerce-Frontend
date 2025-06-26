<script setup lang="ts">
import { onMounted } from 'vue'
import { useCouponsStore } from '@/stores/coupons'

const couponsStore = useCouponsStore()

onMounted(async () => {
  await couponsStore.fetchCoupons()
})

// Format price as a percentage
const formatPrice = (price: number) => {
  return `${price}%`
}

// Format date to a readable format
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const copyToClipboard = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    // You could add a toast notification here
    console.log('Code copied to clipboard:', code)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}

const getDaysUntilExpiry = (expiryDate: string) => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <div class="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-full">
            <v-icon name="ri-coupon-2-line" scale="2.5" class="text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Discount Coupons</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Manage your discount codes and promotional offers
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Total Coupons -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Coupons</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ couponsStore.couponCount }}</p>
            </div>
            <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <v-icon name="ri-coupon-2-line" scale="1.5" class="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <!-- Active Coupons -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Active</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ couponsStore.activeCoupons.length }}</p>
            </div>
            <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <v-icon name="hi-check-circle" scale="1.5" class="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <!-- Valid Coupons -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Valid</p>
              <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ couponsStore.validCoupons.length }}</p>
            </div>
            <div class="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full">
              <v-icon name="hi-badge-check" scale="1.5" class="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <!-- Expired Coupons -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Expired</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ couponsStore.expiredCoupons.length }}</p>
            </div>
            <div class="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
              <v-icon name="hi-x-circle" scale="1.5" class="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="couponsStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Loading coupons...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="couponsStore.error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2"
      >
        <v-icon name="hi-exclamation-circle" scale="1.2" />
        <span>{{ couponsStore.error }}</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="couponsStore.coupons.length === 0" class="text-center py-12">
        <div class="flex justify-center mb-4">
          <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
            <v-icon name="ri-coupon-2-line" scale="3" class="text-gray-400 dark:text-gray-600" />
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No coupons found</h3>
        <p class="text-gray-600 dark:text-gray-300">No discount coupons are available in the system</p>
      </div>

      <!-- Coupons Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="coupon in couponsStore.coupons"
          :key="coupon.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- Coupon Header -->
          <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <v-icon name="ri-coupon-2-line" scale="1.2" class="text-orange-600 dark:text-orange-400" />
                <span class="font-bold text-lg text-gray-900 dark:text-white">{{ coupon.code }}</span>
              </div>
              <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${couponsStore.getStatusColor(coupon)}`">
                {{ couponsStore.getStatusText(coupon) }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <!-- Discount Amount -->
            <div class="text-center mb-4">
              <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {{ formatPrice(coupon.discountAmount) }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Discount Amount</div>
            </div>

            <!-- Expiry Information -->
            <div class="mb-4">
              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <v-icon name="hi-calendar" scale="1" />
                <span>Expires: {{ formatDate(coupon.expiryDate) }}</span>
              </div>
              <div class="mt-1">
                <span
                  :class="[
                    'text-xs px-2 py-1 rounded',
                    getDaysUntilExpiry(coupon.expiryDate) < 0
                      ? 'bg-red-100 text-red-700'
                      : getDaysUntilExpiry(coupon.expiryDate) <= 7
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                  ]"
                >
                  {{
                    getDaysUntilExpiry(coupon.expiryDate) < 0
                      ? `Expired ${Math.abs(getDaysUntilExpiry(coupon.expiryDate))} days ago`
                      : getDaysUntilExpiry(coupon.expiryDate) === 0
                        ? 'Expires today'
                        : `${getDaysUntilExpiry(coupon.expiryDate)} days remaining`
                  }}
                </span>
              </div>
            </div>

            <!-- Coupon Actions -->
            <div class="space-y-2">
              <button
                @click="copyToClipboard(coupon.code)"
                class="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <v-icon name="hi-clipboard-copy" scale="1" />
                <span>Copy Code</span>
              </button>
              <div class="flex space-x-2">
                <button
                  class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                >
                  <v-icon name="hi-pencil" scale="0.9" />
                  <span>Edit</span>
                </button>
                <button
                  class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                >
                  <v-icon name="hi-trash" scale="0.9" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            <!-- Coupon ID -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span class="text-xs text-gray-500 dark:text-gray-400">ID: {{ coupon.id }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Coupon Button -->
      <div class="mt-12 text-center">
        <button
          class="inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
        >
          <v-icon name="hi-plus" scale="1.1" />
          <span>Add new coupon</span>
        </button>
      </div>

      <!-- Coupons Count -->
      <div v-if="couponsStore.coupons.length > 0" class="mt-8 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full"
        >
          <span class="text-orange-600 dark:text-orange-400 font-semibold">
            Total: {{ couponsStore.couponCount }} coupon{{
              couponsStore.couponCount !== 1 ? 's' : ''
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
