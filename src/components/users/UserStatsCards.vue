<script setup lang="ts">
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()
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
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ usersStore.userCount }}</p>
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
            {{ usersStore.adminUsers.length }}
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
            {{ usersStore.enabledUsers.length }}
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
            {{ usersStore.disabledUsers.length }}
          </p>
        </div>
        <div class="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
          <v-icon name="hi-x-circle" scale="1.5" class="text-red-600 dark:text-red-400" />
        </div>
      </div>
    </div>
  </div>
</template>
