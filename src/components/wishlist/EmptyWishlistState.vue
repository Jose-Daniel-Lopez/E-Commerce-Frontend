<template>
  <div class="text-center py-16 animate-fadeInUp theme-muted-foreground">
    <img src="https://res.cloudinary.com/tejon-tech/image/upload/v1756151651/e-commerce/Favorites.png" alt="Wishlist" class="mx-auto mb-6 w-24 h-24 opacity-60" />
    <h2 class="font-srProDisplay text-xl font-semibold mb-2 theme-text">{{ emptyTitle }}</h2>
    <p class="font-srProDisplay theme-muted-text text-sm mb-6">{{ emptyDescription }}</p>
    <button @click="$emit('goToCatalog')" class="px-6 py-3 button-primary rounded-xl font-srProDisplay transition">{{ catalogButtonText }}</button>
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
