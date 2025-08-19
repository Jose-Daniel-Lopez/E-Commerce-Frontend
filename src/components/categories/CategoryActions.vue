<script setup lang="ts">
interface Category {
  id: number
  name: string
}

interface Props {
  category: Category
}

const props = defineProps<Props>()

// Custom events emitted to the parent component
// Each event provides a categoryId parameter
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
      class="w-full flex items-center justify-center space-x-2 py-2 px-4 button-primary rounded-lg font-medium text-sm transition-colors"
    >
      <v-icon name="hi-eye" scale="1" />
      <span>View products</span>
    </button>
    <div class="flex space-x-2">
      <button
        @click="handleEditCategory"
        class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border theme-border text-muted hover:theme-surface transition-colors text-sm"
      >
        <v-icon name="hi-pencil" scale="0.9" />
        <span>Edit</span>
      </button>
      <button
        @click="handleDeleteCategory"
        class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border theme-border text-red-600 hover:theme-error-bg hover:theme-error-text transition-colors text-sm"
      >
        <v-icon name="hi-trash" scale="0.9" />
        <span>Delete</span>
      </button>
    </div>
  </div>
</template>
