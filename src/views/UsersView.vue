<script setup lang="ts">
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import UserStatsCards from '@/components/users/UserStatsCards.vue'
import UserCard from '@/components/users/UserCard.vue'
import UserPagination from '@/components/users/UserPagination.vue'

const usersStore = useUsersStore()

onMounted(async () => {
  // Cargar tanto los usuarios como las estadísticas
  await Promise.all([
    usersStore.fetchUsers(),
    usersStore.fetchUserStats()
  ])
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
        <p class="text-lg text-gray-600 dark:text-gray-300">Manage all users in your platform</p>
      </div>

      <!-- Statistics Cards -->
      <UserStatsCards />

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
      <div v-else class="space-y-6">
        <!-- Pagination - Top -->
        <UserPagination />

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UserCard v-for="user in usersStore.users" :key="user.id" :user="user" />
        </div>

        <!-- Pagination - Bottom -->
        <UserPagination />
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
            Showing {{ usersStore.users.length }} of {{ usersStore.pagination.totalElements }} user{{ usersStore.pagination.totalElements !== 1 ? 's' : '' }}
            (Page {{ usersStore.pagination.page + 1 }} of {{ usersStore.pagination.totalPages }})
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
