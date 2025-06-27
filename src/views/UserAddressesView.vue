<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserAddressesStore } from '@/stores/userAddresses'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const route = useRoute()
const userAddressesStore = useUserAddressesStore()
const usersStore = useUsersStore()

const {
  addresses,
  loading: addressesLoading,
  error: addressesError,
  addressCount
} = storeToRefs(userAddressesStore)
const {
  selectedUser: user,
  loading: userLoading,
  error: userError
} = storeToRefs(usersStore)

const userId = route.params.userId as string

const loading = computed(() => addressesLoading.value || userLoading.value)
const error = computed(() => addressesError.value || userError.value)

onMounted(() => {
  if (userId) {
    usersStore.fetchUserById(userId)
    userAddressesStore.fetchUserAddresses(userId)
  }
})
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
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
          User Addresses
        </h3>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          All addresses registered by this user
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Loading addresses...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center"
      >
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="addresses.length === 0" class="text-center py-12">
        <div class="flex justify-center mb-4">
          <div class="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full">
            <v-icon name="hi-location-marker" scale="3" class="text-blue-500 dark:text-blue-400" />
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No addresses found</h3>
        <p class="text-gray-600 dark:text-gray-300">
          This user has not registered any addresses yet.
        </p>
      </div>

      <!-- Addresses List -->
      <div v-else class="space-y-6">
        <div
          v-for="address in addresses"
          :key="address.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-6">
            <!-- Address Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200':
                      address.isShippingAddress,
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200':
                      address.isBillingAddress && !address.isShippingAddress,
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300':
                      !address.isShippingAddress && !address.isBillingAddress
                  }"
                >
                  <v-icon
                    :name="
                      address.isShippingAddress
                        ? 'fa-shipping-fast'
                        : address.isBillingAddress
                          ? 'fa-file-invoice-dollar'
                          : 'hi-location-marker'
                    "
                    scale="0.9"
                    class="mr-1.5"
                  />
                  {{
                    address.isShippingAddress
                      ? 'Shipping'
                      : address.isBillingAddress
                        ? 'Billing'
                        : 'Address'
                  }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  ID: {{ address.id }}
                </span>
              </div>
            </div>

            <!-- Address Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div class="col-span-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">Street</p>
                <p class="text-lg font-semibold text-gray-800 dark:text-white">
                  {{ address.street }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">City</p>
                <p class="text-gray-800 dark:text-white">{{ address.city }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">State</p>
                <p class="text-gray-800 dark:text-white">{{ address.state }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Postal Code</p>
                <p class="text-gray-800 dark:text-white">{{ address.postalCode }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Country</p>
                <p class="text-gray-800 dark:text-white">{{ address.country }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-12 text-center">
        <button
          @click="$router.go(-1)"
          class="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
        >
          <v-icon name="hi-arrow-left" scale="1.1" />
          <span>Back to Users</span>
        </button>
      </div>

      <!-- Addresses Count -->
      <div v-if="addressCount > 0" class="mt-8 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full"
        >
          <span class="text-blue-600 dark:text-blue-400 font-semibold">
            Total: {{ addressCount }} address{{ addressCount !== 1 ? 'es' : '' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
