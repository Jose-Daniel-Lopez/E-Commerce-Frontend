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
        <div :class="`w-2 h-2 rounded-full ${user.enabled ? 'theme-success-bg' : 'theme-error-bg'}`"></div>
        <span class="theme-muted-text">{{ user.enabled ? 'Enabled' : 'Disabled' }}</span>
      </div>
      <div class="flex items-center space-x-1">
  <div :class="`w-2 h-2 rounded-full ${user.accountNonLocked ? 'theme-success-bg' : 'theme-error-bg'}`"></div>
  <span class="theme-muted-text">{{ user.accountNonLocked ? 'Unlocked' : 'Locked' }}</span>
      </div>
      <div class="flex items-center space-x-1">
  <div :class="`w-2 h-2 rounded-full ${user.accountNonExpired ? 'theme-success-bg' : 'theme-error-bg'}`"></div>
  <span class="theme-muted-text">{{ user.accountNonExpired ? 'Valid' : 'Expired' }}</span>
      </div>
      <div class="flex items-center space-x-1">
  <div :class="`w-2 h-2 rounded-full ${user.credentialsNonExpired ? 'theme-success-bg' : 'theme-error-bg'}`"></div>
  <span class="theme-muted-text">{{ user.credentialsNonExpired ? 'Credentials OK' : 'Credentials Expired' }}</span>
      </div>
    </div>
  </div>
</template>
