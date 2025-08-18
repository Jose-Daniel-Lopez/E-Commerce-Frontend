<template>
  <div class="flex items-center gap-3 mt-2">
    <button
  class="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-gray-100 transition-colors cursor-pointer"
      @click="$emit('decrement')"
      :disabled="quantity <= 1"
      :class="{ 'opacity-50 cursor-not-allowed': quantity <= 1 }"
    >
      -
    </button>
    <span class="font-srProDisplay text-base">{{ quantity }}</span>
    <button
  class="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-gray-100 transition-colors cursor-pointer"
      @click="$emit('increment')"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  quantity: number
}>()

defineEmits<{
  increment: []
  decrement: []
}>()
</script>
