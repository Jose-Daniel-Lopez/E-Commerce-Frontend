<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categories'

const categoriesStore = useCategoriesStore()
</script>

<template>
  <!-- Categories Count -->
  <div v-if="categoriesStore.categories.length > 0" class="mt-8 text-center">
    <div class="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
      <span class="text-blue-600 dark:text-blue-400 font-semibold">
        Total: {{ categoriesStore.categoryCount }} categor{{
          categoriesStore.categoryCount !== 1 ? 'ies' : 'y'
        }}
      </span>
    </div>
  </div>

  <!-- Add New Category Button -->
  <div class="mt-12 text-center">
    <button
      class="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
    >
      <v-icon name="hi-plus" scale="1.1" />
      <span>Add new category</span>
    </button>
  </div>
</template>
