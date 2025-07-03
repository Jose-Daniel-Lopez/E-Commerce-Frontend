<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import CategoryHeader from '@/components/categories/CategoryHeader.vue'
import CategoryCard from '@/components/categories/CategoryCard.vue'
import CategoryFooter from '@/components/categories/CategoryFooter.vue'

const categoriesStore = useCategoriesStore()

onMounted(async () => {
  await categoriesStore.fetchCategories()
})
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header Component -->
      <CategoryHeader />

      <!-- Loading State -->
      <div v-if="categoriesStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Loading categories...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="categoriesStore.error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2">
        <v-icon name="hi-exclamation-circle" scale="1.2" />
        <span>{{ categoriesStore.error }}</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="categoriesStore.categories.length === 0" class="text-center py-12">
        <div class="flex justify-center mb-4">
          <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
            <v-icon name="hi-view-grid" scale="3" class="text-gray-400 dark:text-gray-600" />
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No categories found
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          No categories are available in the system yet
        </p>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CategoryCard v-for="category in categoriesStore.categories" :key="category.id" :category="category" />
      </div>

      <!-- Footer Component -->
      <CategoryFooter />
    </div>
  </div>
</template>
