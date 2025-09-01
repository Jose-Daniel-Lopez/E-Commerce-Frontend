<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categories'

const categoriesStore = useCategoriesStore()
</script>

<template>
  <!-- Categories Count -->
  <div v-if="categoriesStore.categories.length > 0" class="mt-8 text-center">
    <div class="inline-flex items-center px-4 py-2 rounded-full theme-card">
      <span class="font-semibold" :class="['theme-text']">
        Total: {{ categoriesStore.categoryCount }} categor{{
          categoriesStore.categoryCount !== 1 ? 'ies' : 'y'
        }}
      </span>
    </div>
  </div>

  <!-- Add New Category Button -->
  <div class="mt-12 text-center">
    <button
      class="inline-flex items-center space-x-2 px-6 py-3 button-primary rounded-lg transition-colors"
    >
      <v-icon name="hi-plus" scale="1.1" />
      <span>Add new category</span>
    </button>
  </div>
</template>
