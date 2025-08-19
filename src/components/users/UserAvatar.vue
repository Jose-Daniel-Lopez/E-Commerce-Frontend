<script setup lang="ts">
import { useUsersStore } from '@/stores/users'

// Temporary interface for user data
// TODO: Update to match the real user data structure
interface Props {
  user: {
    id: number
    displayName: string
    email: string
    avatar: string
    admin: boolean
  }
}

defineProps<Props>()

const usersStore = useUsersStore()
</script>

<template>
  <div class="relative">
    <div
      v-if="user.avatar && user.avatar !== 'alicia.png'"
        class="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden theme-card"
    >
      <img
        :src="`/avatars/${user.avatar}`"
        :alt="user.displayName"
        class="w-full h-full object-cover"
      />
    </div>
    <div
      v-else
  class="w-12 h-12 rounded-full flex items-center justify-center theme-card"
    >
  <span class="text-sm font-bold theme-text">
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
</template>
