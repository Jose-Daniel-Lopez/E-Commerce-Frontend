<script setup lang="ts">
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()

onMounted(async () => {
  await usersStore.fetchUsers()
})
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <div class="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full">
            <v-icon name="hi-users" scale="2.5" class="text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">User Management</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Manage all users in your platform
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Total Users -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ usersStore.userCount }}</p>
            </div>
            <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <v-icon name="hi-users" scale="1.5" class="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <!-- Admin Users -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Administrators</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ usersStore.adminUsers.length }}</p>
            </div>
            <div class="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
              <v-icon name="hi-badge-check" scale="1.5" class="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <!-- Active Users -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ usersStore.enabledUsers.length }}</p>
            </div>
            <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <v-icon name="hi-check-circle" scale="1.5" class="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <!-- Disabled Users -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Disabled Users</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ usersStore.disabledUsers.length }}</p>
            </div>
            <div class="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
              <v-icon name="hi-x-circle" scale="1.5" class="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="usersStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Loading users...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="usersStore.error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2"
      >
        <v-icon name="hi-exclamation-circle" scale="1.2" />
        <span>{{ usersStore.error }}</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="usersStore.users.length === 0" class="text-center py-12">
        <div class="flex justify-center mb-4">
          <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
            <v-icon name="hi-users" scale="3" class="text-gray-400 dark:text-gray-600" />
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
        <p class="text-gray-600 dark:text-gray-300">
          No users have been registered on the platform yet
        </p>
      </div>

      <!-- Users Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="user in usersStore.users"
          :key="user.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- User Header -->
          <div class="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <!-- Avatar -->
                <div class="relative">
                  <div
                    v-if="user.avatar && user.avatar !== 'alicia.png'"
                    class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center overflow-hidden"
                  >
                    <img :src="`/avatars/${user.avatar}`" :alt="user.displayName" class="w-full h-full object-cover" />
                  </div>
                  <div
                    v-else
                    class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center"
                  >
                    <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {{ usersStore.getInitials(user.displayName) }}
                    </span>
                  </div>
                  <!-- Admin Badge -->
                  <div
                    v-if="user.admin"
                    class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <v-icon name="hi-badge-check" scale="0.6" class="text-white" />
                  </div>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ user.displayName }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ user.username }}</p>
                </div>
              </div>
              <!-- Status Badge -->
              <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${usersStore.getStatusColor(user)}`">
                {{ usersStore.getStatusText(user) }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <!-- User Information -->
            <div class="space-y-4 mb-6">
              <!-- Email -->
              <div class="flex items-center space-x-2">
                <v-icon name="hi-mail" scale="1" class="text-gray-500" />
                <span class="text-sm text-gray-600 dark:text-gray-300">{{ user.email }}</span>
              </div>

              <!-- Role -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <v-icon name="hi-user-circle" scale="1" class="text-gray-500" />
                  <span class="text-sm text-gray-600 dark:text-gray-300">Role:</span>
                </div>
                <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${usersStore.getRoleColor(user.role)}`">
                  {{ user.role }}
                </span>
              </div>

              <!-- Authorities -->
              <div v-if="user.authorities && user.authorities.length > 0">
                <div class="flex items-center space-x-2 mb-2">
                  <v-icon name="hi-key" scale="1" class="text-gray-500" />
                  <span class="text-sm text-gray-600 dark:text-gray-300">Authorities:</span>
                </div>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="authority in user.authorities"
                    :key="authority.authority"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {{ authority.authority }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Account Status Details -->
            <div class="space-y-2 mb-6">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Account Status</h4>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="flex items-center space-x-1">
                  <div :class="`w-2 h-2 rounded-full ${user.enabled ? 'bg-green-500' : 'bg-red-500'}`"></div>
                  <span class="text-gray-600 dark:text-gray-300">{{ user.enabled ? 'Enabled' : 'Disabled' }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <div :class="`w-2 h-2 rounded-full ${user.accountNonLocked ? 'bg-green-500' : 'bg-red-500'}`"></div>
                  <span class="text-gray-600 dark:text-gray-300">{{ user.accountNonLocked ? 'Unlocked' : 'Locked' }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <div :class="`w-2 h-2 rounded-full ${user.accountNonExpired ? 'bg-green-500' : 'bg-red-500'}`"></div>
                  <span class="text-gray-600 dark:text-gray-300">{{ user.accountNonExpired ? 'Valid' : 'Expired' }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <div :class="`w-2 h-2 rounded-full ${user.credentialsNonExpired ? 'bg-green-500' : 'bg-red-500'}`"></div>
                  <span class="text-gray-600 dark:text-gray-300">{{ user.credentialsNonExpired ? 'Credentials OK' : 'Credentials Expired' }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="space-y-2">
              <button
                class="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <v-icon name="hi-eye" scale="1" />
                <span>View Details</span>
              </button>
              
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-if="user._links?.orders"
                  class="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-xs"
                >
                  <v-icon name="hi-shopping-cart" scale="0.8" />
                  <span>Orders</span>
                </button>
                
                <button
                  v-if="user._links?.addresses"
                  class="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-xs"
                >
                  <v-icon name="hi-location-marker" scale="0.8" />
                  <span>Addresses</span>
                </button>
                
                <button
                  v-if="user._links?.cart"
                  class="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg border border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-xs"
                >
                  <v-icon name="hi-shopping-bag" scale="0.8" />
                  <span>Cart</span>
                </button>
                
                <button
                  v-if="user._links?.productReviews"
                  class="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg border border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors text-xs"
                >
                  <v-icon name="hi-star" scale="0.8" />
                  <span>Reviews</span>
                </button>
              </div>
            </div>

            <!-- User ID -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span class="text-xs text-gray-500 dark:text-gray-400">ID: {{ user.id }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New User Button -->
      <div class="mt-12 text-center">
        <button
          class="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
          <v-icon name="hi-plus" scale="1.1" />
          <span>Add new user</span>
        </button>
      </div>

      <!-- Users Count -->
      <div v-if="usersStore.users.length > 0" class="mt-8 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
        >
          <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
            Total: {{ usersStore.userCount }} user{{ usersStore.userCount !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
