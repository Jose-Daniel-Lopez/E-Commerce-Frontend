<template>
  <div class="flex justify-center items-center h-40">
    <span class="text-gray-500">{{ loadingText }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loadingText: string
}>()
</script>
