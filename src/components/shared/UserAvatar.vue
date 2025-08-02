<template>
  <div class="relative">
    <!-- Avatar Image or Default Icon -->
    <div
      v-if="avatarUrl && isAuthenticated"
      class="w-8 h-8 overflow-hidden border-2 border-gray-300 rounded-full shadow-sm transition-all duration-200 group-hover:border-blue-400 group-hover:scale-110 group-hover:shadow-md"
    >
      <img
        :src="avatarUrl"
        :alt="altText"
        class="object-cover w-full h-full"
        @error="onImageError"
      />
    </div>

    <!-- Fallback Icon when no avatar or not authenticated -->
    <v-icon
      v-else
      name="hi-user-circle"
      :scale="iconScale"
      class="text-gray-600 transition-all duration-200 group-hover:text-blue-600 group-hover:scale-110 group-hover:drop-shadow-md"
      :aria-label="ariaLabel"
    />

    <!-- Online/Authenticated Status Indicator (optional) -->
    <div
      v-if="showStatus && isAuthenticated"
      class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"
      :title="statusTitle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showStatus?: boolean
  iconScale?: number
  fallbackToIcon?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  showStatus: false,
  iconScale: 1.7,
  fallbackToIcon: true
})

const authStore = useAuthStore()
const imageError = ref(false)

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const avatarUrl = computed(() => {
  if (imageError.value || !user.value?.avatar) {
    return null
  }
  return user.value.avatar
})

const altText = computed(() => {
  return user.value?.username ? `${user.value.username}'s avatar` : 'User avatar'
})

const ariaLabel = computed(() => {
  return isAuthenticated.value ? 'User account' : 'Login'
})

const statusTitle = computed(() => {
  return isAuthenticated.value ? 'Online' : 'Offline'
})

// Methods
const onImageError = () => {
  console.warn('Failed to load user avatar image:', avatarUrl.value)
  imageError.value = true
}

// Expose reactive data for parent components if needed
defineExpose({
  isAuthenticated,
  avatarUrl,
  user
})
</script>

<style scoped>
/* Smooth transitions for all interactive states */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced shadow effects */
.group-hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Status indicator pulse animation */
@keyframes pulse-green {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.bg-green-500 {
  animation: pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
