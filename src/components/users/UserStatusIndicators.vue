<script setup lang="ts">
interface Props {
  user: {
    enabled: boolean
    accountNonLocked: boolean
    accountNonExpired: boolean
    credentialsNonExpired: boolean
  }
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-2 mb-6">
    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Account Status</h4>
    <div class="grid grid-cols-2 gap-2 text-xs">
      <div class="flex items-center space-x-1">
        <div :class="`w-2 h-2 rounded-full ${user.enabled ? 'bg-green-500' : 'bg-red-500'}`"></div>
        <span class="text-gray-600 dark:text-gray-300">{{
          user.enabled ? 'Enabled' : 'Disabled'
        }}</span>
      </div>
      <div class="flex items-center space-x-1">
        <div
          :class="`w-2 h-2 rounded-full ${user.accountNonLocked ? 'bg-green-500' : 'bg-red-500'}`"
        ></div>
        <span class="text-gray-600 dark:text-gray-300">{{
          user.accountNonLocked ? 'Unlocked' : 'Locked'
        }}</span>
      </div>
      <div class="flex items-center space-x-1">
        <div
          :class="`w-2 h-2 rounded-full ${user.accountNonExpired ? 'bg-green-500' : 'bg-red-500'}`"
        ></div>
        <span class="text-gray-600 dark:text-gray-300">{{
          user.accountNonExpired ? 'Valid' : 'Expired'
        }}</span>
      </div>
      <div class="flex items-center space-x-1">
        <div
          :class="`w-2 h-2 rounded-full ${user.credentialsNonExpired ? 'bg-green-500' : 'bg-red-500'}`"
        ></div>
        <span class="text-gray-600 dark:text-gray-300">{{
          user.credentialsNonExpired ? 'Credentials OK' : 'Credentials Expired'
        }}</span>
      </div>
    </div>
  </div>
</template>
