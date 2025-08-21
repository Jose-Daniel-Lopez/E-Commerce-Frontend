<template>
  <router-link :to="`/catalog/${category.slug}`">
    <div
      class="mb-3 !flex !h-[128px] !w-[160px] flex-col items-center justify-center gap-3 rounded-[15px] theme-card py-4 text-black hover:theme-surface transition-colors duration-200"
    >
      <v-icon :name="category.icon" scale="3" class="theme-text" />
      <p class="font-medium font-srProDisplay theme-text">
        {{ category.name }}
      </p>
    </div>
  </router-link>
</template>

<script setup lang="ts">
interface Category {
  id: number
  name: string
  slug: string
  icon: string
}

defineProps<{
  category: Category
}>()
</script>
