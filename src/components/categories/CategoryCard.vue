<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'
import CategoryActions from './CategoryActions.vue'
import CategoryIcon from './CategoryIcon.vue'

interface Category {
  id: number
  name: string
}

interface Props {
  category: Category
}

defineProps<Props>()

const router = useRouter()
const categoriesStore = useCategoriesStore()

console.log('CategoryCard mounted with category:', categoriesStore.categories)

const viewCategoryProducts = (categoryId: number) => {
  router.push({ name: 'categoryProducts', params: { categoryId: categoryId.toString() } })
}

const handleEditCategory = (categoryId: number) => {
  console.log('Edit category:', categoryId)
  // TODO: Add logic to edit a category
}

const handleDeleteCategory = (categoryId: number) => {
  console.log('Delete category:', categoryId)
  // TODO: Add logic to delete a category
}
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
  >
    <!-- Category Icon Header -->
    <div
      class="h-32 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-900/30 dark:to-purple-800/30 flex items-center justify-center"
    >
      <CategoryIcon :category="category" />
    </div>

    <div class="p-6">
      <!-- Category Name -->
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
        {{ category.name }}
      </h3>

      <!-- Product Count -->
      <div class="flex items-center justify-center mb-4">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-blue-500"></div>
          <span class="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {{ categoriesStore.getProductCount(category.id) }} product{{
              categoriesStore.getProductCount(category.id) !== 1 ? 's' : ''
            }}
          </span>
        </div>
      </div>

      <!-- Category Actions -->
      <CategoryActions
        :category="category"
        @view-products="viewCategoryProducts"
        @edit-category="handleEditCategory"
        @delete-category="handleDeleteCategory"
      />

      <!-- Category ID -->
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span class="text-xs text-gray-500 dark:text-gray-400"> ID: {{ category.id }} </span>
      </div>
    </div>
  </div>
</template>
