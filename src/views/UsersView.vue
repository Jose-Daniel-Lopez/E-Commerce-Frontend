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
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <div class="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full">
            <v-icon name="hi-users" scale="2.5" class="text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Lista de Usuarios</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Gestiona todos los usuarios de tu plataforma
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="usersStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Cargando usuarios...</span>
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
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay usuarios</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Aún no se han registrado usuarios en la plataforma
        </p>
      </div>

      <!-- Users Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="user in usersStore.users"
          :key="user.id ? user.id : user.email"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 border border-gray-200 dark:border-gray-700 relative"
        >
          <!-- User Role -->
          <div class="absolute top-4 right-4">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
            >
              {{ user.role || 'Sin rol' }}
            </span>
          </div>

          <!-- User Avatar -->
          <div
            class="flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mx-auto mb-4"
          >
            <span class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {{ (user.username && user.username.length > 0) ? user.username.charAt(0).toUpperCase() : '?' }}
            </span>
          </div>

          <!-- User Info -->
          <div class="text-center">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ user.username || 'Sin nombre' }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ user.email || 'Sin email' }}
            </p>

            <!-- User ID Badge -->
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              ID: {{ user.id ? user.id : 'No ID' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Users Count -->
      <div v-if="usersStore.users.length > 0" class="mt-12 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
        >
          <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
            Total: {{ usersStore.userCount }} usuario{{ usersStore.userCount !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
