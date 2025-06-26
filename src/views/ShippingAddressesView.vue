<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useShippingAddressesStore } from '@/stores/shippingAddresses'

const shippingAddressesStore = useShippingAddressesStore()

onMounted(async () => {
  await shippingAddressesStore.fetchShippingAddresses()
})

const getCountryFlag = (country: string) => {
  const flags: { [key: string]: string } = {
    'Spain': '🇪🇸',
    'France': '🇫🇷',
    'Germany': '🇩🇪',
    'Italy': '🇮🇹',
    'Portugal': '🇵🇹',
    'United Kingdom': '🇬🇧',
    'United States': '🇺🇸',
    'Canada': '🇨🇦',
    'Mexico': '🇲🇽',
    'Brazil': '🇧🇷',
    'Argentina': '🇦🇷',
    'Chile': '🇨🇱'
  }
  return flags[country] || '🌍'
}

const formatAddress = (address: { street: string; city: string; state: string; zipCode: string; country: string }) => {
  const parts = [address.street, address.city, address.state, address.zipCode, address.country]
  return parts.filter(Boolean).join(', ')
}

const addressesWithOrders = computed(() => {
  return shippingAddressesStore.addresses.filter(address => address.order)
})
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <div class="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
            <v-icon name="hi-location-marker" scale="2.5" class="text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Shipping Addresses</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Manage delivery addresses for all orders
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Total Addresses -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Addresses</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ shippingAddressesStore.addressCount }}
              </p>
            </div>
            <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <v-icon name="hi-location-marker" scale="1.5" class="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <!-- Countries -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Countries</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ shippingAddressesStore.uniqueCountries.length }}
              </p>
            </div>
            <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <v-icon name="hi-globe" scale="1.5" class="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <!-- Cities -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Cities</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ shippingAddressesStore.uniqueCities.length }}
              </p>
            </div>
            <div class="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <v-icon name="hi-office-building" scale="1.5" class="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <!-- With Orders -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">With Orders</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ addressesWithOrders.length }}
              </p>
            </div>
            <div class="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
              <v-icon name="hi-shopping-bag" scale="1.5" class="text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="shippingAddressesStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Loading shipping addresses...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="shippingAddressesStore.error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2"
      >
        <v-icon name="hi-exclamation-circle" scale="1.2" />
        <span>{{ shippingAddressesStore.error }}</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="shippingAddressesStore.addresses.length === 0" class="text-center py-12">
        <div class="flex justify-center mb-4">
          <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
            <v-icon name="hi-location-marker" scale="3" class="text-gray-400 dark:text-gray-600" />
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No shipping addresses found</h3>
        <p class="text-gray-600 dark:text-gray-300">No shipping addresses are available in the system</p>
      </div>

      <!-- Shipping Addresses Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="address in shippingAddressesStore.addresses"
          :key="address.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- Address Header -->
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-2xl">{{ getCountryFlag(address.country) }}</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  Address #{{ address.id }}
                </span>
              </div>
              <div v-if="address.order" class="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <v-icon name="hi-shopping-bag" scale="0.9" />
                <span class="text-sm font-medium">Order #{{ address.order.id }}</span>
              </div>
            </div>
          </div>

          <div class="p-6">
            <!-- Street Address -->
            <div class="mb-4">
              <div class="flex items-center space-x-2 mb-2">
                <v-icon name="hi-home" scale="1" class="text-gray-500 dark:text-gray-400" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Street</span>
              </div>
              <p class="text-gray-900 dark:text-white font-medium pl-6">
                {{ address.street }}
              </p>
            </div>

            <!-- City & State -->
            <div class="mb-4">
              <div class="flex items-center space-x-2 mb-2">
                <v-icon name="hi-office-building" scale="1" class="text-gray-500 dark:text-gray-400" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">City & State</span>
              </div>
              <p class="text-gray-900 dark:text-white font-medium pl-6">
                {{ address.city }}<span v-if="address.state">, {{ address.state }}</span>
              </p>
            </div>

            <!-- Zip Code -->
            <div class="mb-4">
              <div class="flex items-center space-x-2 mb-2">
                <v-icon name="hi-mail" scale="1" class="text-gray-500 dark:text-gray-400" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Zip Code</span>
              </div>
              <p class="text-gray-900 dark:text-white font-medium pl-6">
                {{ address.zipCode }}
              </p>
            </div>

            <!-- Country -->
            <div class="mb-4">
              <div class="flex items-center space-x-2 mb-2">
                <v-icon name="hi-globe" scale="1" class="text-gray-500 dark:text-gray-400" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Country</span>
              </div>
              <p class="text-gray-900 dark:text-white font-medium pl-6">
                {{ address.country }}
              </p>
            </div>

            <!-- Full Address -->
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div class="flex items-center space-x-2 mb-2">
                <v-icon name="hi-location-marker" scale="1" class="text-gray-500 dark:text-gray-400" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Full Address</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 pl-6 line-clamp-2">
                {{ formatAddress(address) }}
              </p>
            </div>

            <!-- Order Info -->
            <div v-if="address.order" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Associated Order</span>
                <span class="text-sm font-medium text-green-600 dark:text-green-400">
                  #{{ address.order.id }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex items-center justify-between">
              <button
                class="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <v-icon name="hi-eye" scale="0.9" />
                <span>View Details</span>
              </button>

              <button
                class="flex items-center space-x-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <v-icon name="hi-pencil" scale="0.9" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Address Button -->
      <div class="mt-12 text-center">
        <button
          class="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          <v-icon name="hi-plus" scale="1.1" />
          <span>Add new address</span>
        </button>
      </div>

      <!-- Addresses Count -->
      <div v-if="shippingAddressesStore.addresses.length > 0" class="mt-8 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full"
        >
          <v-icon name="hi-location-marker" scale="1" class="text-green-600 dark:text-green-400 mr-2" />
          <span class="text-green-600 dark:text-green-400 font-semibold">
            {{ shippingAddressesStore.addressCount }} shipping addresses registered
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
