<template>
  <div
    v-if="showDebugPanel"
    class="fixed bottom-4 right-4 z-50 max-w-[420px] w-full"
    role="region"
    aria-label="Debug information panel"
  >
    <div class="p-4 border border-yellow-300 rounded-lg shadow-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-bold text-yellow-800 dark:text-yellow-300">🛠️ Debug Panel</span>
        <button
          @click="$emit('toggle')"
          class="text-xs text-yellow-700 underline rounded dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          :aria-expanded="true"
          aria-controls="debug-content"
        >
          Hide
        </button>
      </div>
      <div id="debug-content" class="space-y-2 text-xs text-yellow-900 dark:text-yellow-200">
        <div><b>User:</b> {{ debugData.username || 'N/A' }}</div>
        <div><b>Theme:</b> {{ debugData.theme }}</div>
        <div><b>Wishlist Count:</b> {{ debugData.wishlistCount }}</div>
        <div><b>Orders Count:</b> {{ debugData.ordersCount }}</div>
        <div><b>Refunds Count:</b> {{ debugData.refundsCount }}</div>
        <div><b>Addresses Count:</b> {{ debugData.addressesCount }}</div>
        <div><b>Reviews Count:</b> {{ debugData.reviewsCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DebugData {
  username?: string
  theme: string
  wishlistCount: number
  ordersCount: number
  refundsCount: number
  addressesCount: number
  reviewsCount: number
}

interface Props {
  showDebugPanel: boolean
  debugData: DebugData
}

defineProps<Props>()

defineEmits<{
  toggle: []
}>()
</script>

<style scoped>
/* Optimized transitions for better performance */
.fade-debug-enter-active, .fade-debug-leave-active {
  transition: opacity 0.15s ease-out;
}
.fade-debug-enter-from, .fade-debug-leave-to {
  opacity: 0;
}
</style>
