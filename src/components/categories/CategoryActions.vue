<script setup lang="ts">
interface Category {
  id: number
  name: string
}

interface Props {
  category: Category
}

const props = defineProps<Props>()

// Define custom events that this component can emit to its parent
// Each event passes a categoryId parameter when triggered
const emit = defineEmits<{
  viewProducts: [categoryId: number]
  editCategory: [categoryId: number]
  deleteCategory: [categoryId: number]
}>()

const handleViewProducts = () => {
  emit('viewProducts', props.category.id)
}

const handleEditCategory = () => {
  emit('editCategory', props.category.id)
}

const handleDeleteCategory = () => {
  emit('deleteCategory', props.category.id)
}
</script>

<template>
  <div class="space-y-2">
    <button
      @click="handleViewProducts"
      class="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
    >
      <v-icon name="hi-eye" scale="1" />
      <span>View products</span>
    </button>
    <div class="flex space-x-2">
      <button
        @click="handleEditCategory"
        class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
      >
        <v-icon name="hi-pencil" scale="0.9" />
        <span>Edit</span>
      </button>
      <button
        @click="handleDeleteCategory"
        class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
      >
        <v-icon name="hi-trash" scale="0.9" />
        <span>Delete</span>
      </button>
    </div>
  </div>
</template>
