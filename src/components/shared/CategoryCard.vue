<template>
  <router-link :to="`/categories/${category.id}/products`">
    <div
      class="mb-3 !flex !h-[128px] !w-[160px] flex-col items-center justify-center gap-3 rounded-[15px] bg-[#ededed] py-4 text-white hover:bg-gray-300 transition-colors duration-200"
    >
      <v-icon :name="category.icon" scale="3" class="text-black" />
      <p class="font-srProDisplay font-medium text-black">
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
