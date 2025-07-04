<template>
  <nav class="w-full h-14 bg-[#2E2E2E] flex items-center">
    <div class="flex items-center h-full w-full">
      <template v-for="(category, idx) in categories" :key="category.slug">
        <div
          class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors"
          @click="navigateToCategory(category.slug)"
        >
          <div class="flex flex-col items-center gap-0.5">
            <v-icon
              :name="category.icon || 'hi-cube'"
              scale="1.4"
              class="opacity-50 pt-1 pb-0.5 text-white"
            />
            <span class="text-white text-sm opacity-50 font-medium">{{ category.name }}</span>
          </div>
        </div>
        <div v-if="idx < categories.length - 1" class="h-6 w-px bg-white opacity-20"></div>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface CategoryNav {
  name: string
  icon?: string
  slug: string
}

const props = defineProps<{ categories: CategoryNav[] }>()

const router = useRouter()
const navigateToCategory = (categorySlug: string) => {
  router.push(`/category/${categorySlug}`)
}
</script>

<style scoped>
.font-medium {
  font-weight: 500;
}
</style>
