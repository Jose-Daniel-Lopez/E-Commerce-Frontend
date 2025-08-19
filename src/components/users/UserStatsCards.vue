<script setup lang="ts">
import { useUsersStore } from '@/stores/users'
import { computed } from 'vue'

const usersStore = useUsersStore()

// Usar estadísticas globales si están disponibles, sino usar la información de paginación
const totalUsers = computed(
  () => usersStore.stats.totalUsers || usersStore.pagination.totalElements,
)

const adminUsersCount = computed(() => {
  const stats = (usersStore as unknown as { stats?: Record<string, number> }).stats
  const statsVal = stats && typeof stats.adminUsers === 'number' ? stats.adminUsers : undefined
  const list = (usersStore as unknown as { adminUsers?: unknown }).adminUsers
  const listVal = Array.isArray(list) ? list.length : undefined
  return statsVal ?? listVal ?? 0
})

const enabledUsersCount = computed(() => {
  const stats = (usersStore as unknown as { stats?: Record<string, number> }).stats
  const statsVal = stats && typeof stats.enabledUsers === 'number' ? stats.enabledUsers : undefined
  const list = (usersStore as unknown as { enabledUsers?: unknown }).enabledUsers
  const listVal = Array.isArray(list) ? list.length : undefined
  return statsVal ?? listVal ?? 0
})

const disabledUsersCount = computed(() => {
  const stats = (usersStore as unknown as { stats?: Record<string, number> }).stats
  const statsVal = stats && typeof stats.disabledUsers === 'number' ? stats.disabledUsers : undefined
  const list = (usersStore as unknown as { disabledUsers?: unknown }).disabledUsers
  const listVal = Array.isArray(list) ? list.length : undefined
  return statsVal ?? listVal ?? 0
})
</script>

<template>
  <!-- Statistics Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <!-- Total Users -->
  <div class="rounded-xl shadow-lg border p-6 theme-card theme-border">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalUsers }}</p>
        </div>
        <div class="p-3 rounded-full theme-surface">
          <v-icon name="hi-users" scale="1.5" class="theme-text" />
        </div>
      </div>
    </div>

    <!-- Admin Users -->
  <div class="rounded-xl shadow-lg border p-6 theme-card theme-border">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Administrators</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">
            {{ adminUsersCount }}
          </p>
        </div>
        <div class="p-3 rounded-full theme-surface">
          <v-icon name="hi-badge-check" scale="1.5" class="theme-text" />
        </div>
      </div>
    </div>

    <!-- Active Users -->
  <div class="rounded-xl shadow-lg border p-6 theme-card theme-border">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ enabledUsersCount }}
          </p>
        </div>
        <div class="p-3 rounded-full theme-surface">
          <v-icon name="hi-check-circle" scale="1.5" class="theme-text" />
        </div>
      </div>
    </div>

    <!-- Disabled Users -->
  <div class="rounded-xl shadow-lg border p-6 theme-card theme-border">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Disabled Users</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">
            {{ disabledUsersCount }}
          </p>
        </div>
        <div class="p-3 rounded-full theme-surface">
          <v-icon name="hi-x-circle" scale="1.5" class="theme-text" />
        </div>
      </div>
    </div>
  </div>
</template>
