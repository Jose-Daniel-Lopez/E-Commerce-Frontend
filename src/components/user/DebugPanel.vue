<template>
  <div
    v-if="showDebugPanel"
    class="fixed bottom-4 right-4 z-50 max-w-[420px] w-full"
    role="region"
    aria-label="Debug information panel"
  >
    <div class="p-4 rounded-lg shadow-lg bg-surface border border-gray-200 theme-warning-text">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-bold theme-warning-text">🛠️ Debug Panel</span>
        <button
          @click="$emit('toggle')"
          class="text-xs underline rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          :aria-expanded="true"
          aria-controls="debug-content"
        >
          Hide
        </button>
      </div>
      <div id="debug-content" class="space-y-2 text-xs theme-warning-text">
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
