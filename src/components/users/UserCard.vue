<script setup lang="ts">
import { useUsersStore } from '@/stores/users'
import UserAvatar from './UserAvatar.vue'
import UserStatusIndicators from './UserStatusIndicators.vue'
import UserActions from './UserActions.vue'

interface Authority {
  authority: string
}

interface User {
  id: number
  username: string
  email: string
  password: string
  avatar: string
  role: string
  enabled: boolean
  displayName: string
  accountNonExpired: boolean
  accountNonLocked: boolean
  admin: boolean
  authorities: Authority[]
  credentialsNonExpired: boolean
  _links?: {
    self?: {
      href: string
    }
    user?: {
      href: string
    }
    addresses?: {
      href: string
    }
    orders?: {
      href: string
    }
    cart?: {
      href: string
    }
    productReviews?: {
      href: string
    }
  }
}

interface Props {
  user: User
}

defineProps<Props>()

const usersStore = useUsersStore()
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
  >
    <!-- User Header -->
    <div
      class="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <!-- Avatar -->
          <UserAvatar :user="user" />
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ user.displayName }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ user.username }}</p>
          </div>
        </div>
        <!-- Status Badge -->
        <span
          :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${usersStore.getStatusColor(user)}`"
        >
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
          <span
            :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${usersStore.getRoleColor(user.role)}`"
          >
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
      <UserStatusIndicators :user="user" />

      <!-- Actions -->
      <UserActions :user="user" />

      <!-- User ID -->
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span class="text-xs text-gray-500 dark:text-gray-400">ID: {{ user.id }}</span>
      </div>
    </div>
  </div>
</template>
