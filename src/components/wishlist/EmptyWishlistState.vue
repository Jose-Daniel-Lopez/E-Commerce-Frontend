<template>
  <div class="text-center text-[#666] py-16 animate-fadeInUp">
    <img
      src="/public/images/Favorites.png"
      alt="Wishlist"
      class="mx-auto mb-6 w-24 h-24 opacity-60"
    />
    <h2 class="font-srProDisplay text-xl font-semibold mb-2">
      {{ emptyTitle }}
    </h2>
    <p class="font-srProDisplay text-[#999] text-sm mb-6">
      {{ emptyDescription }}
    </p>
    <button
      @click="$emit('goToCatalog')"
      class="px-6 py-3 bg-black text-white rounded-xl font-srProDisplay hover:bg-gray-900 transition"
    >
      {{ catalogButtonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  emptyTitle: string
  emptyDescription: string
  catalogButtonText: string
}>()

defineEmits<{
  goToCatalog: []
}>()
</script>
