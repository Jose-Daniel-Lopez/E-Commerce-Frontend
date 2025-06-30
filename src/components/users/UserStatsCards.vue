<script setup lang="ts">
import { useUsersStore } from '@/stores/users'
import { computed } from 'vue'

const usersStore = useUsersStore()

// Usar estadísticas globales si están disponibles, sino usar la información de paginación
const totalUsers = computed(() => 
  usersStore.stats.totalUsers || usersStore.pagination.totalElements
)

const adminUsersCount = computed(() => 
  usersStore.stats.adminUsers || usersStore.adminUsers.length
)

const enabledUsersCount = computed(() => 
  usersStore.stats.enabledUsers || usersStore.enabledUsers.length
)

const disabledUsersCount = computed(() => 
  usersStore.stats.disabledUsers || usersStore.disabledUsers.length
)
</script>

<template>
  <!-- Statistics Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <!-- Total Users -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalUsers }}</p>
        </div>
        <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
          <v-icon name="hi-users" scale="1.5" class="text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>

    <!-- Admin Users -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Administrators</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">
            {{ adminUsersCount }}
          </p>
        </div>
        <div class="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
          <v-icon name="hi-badge-check" scale="1.5" class="text-red-600 dark:text-red-400" />
        </div>
      </div>
    </div>

    <!-- Active Users -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ enabledUsersCount }}
          </p>
        </div>
        <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
          <v-icon name="hi-check-circle" scale="1.5" class="text-green-600 dark:text-green-400" />
        </div>
      </div>
    </div>

    <!-- Disabled Users -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Disabled Users</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">
            {{ disabledUsersCount }}
          </p>
        </div>
        <div class="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
          <v-icon name="hi-x-circle" scale="1.5" class="text-red-600 dark:text-red-400" />
        </div>
      </div>
    </div>
  </div>
</template>
