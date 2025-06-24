<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'

const categoriesStore = useCategoriesStore()
const router = useRouter()

onMounted(async () => {
  await categoriesStore.fetchCategories()
})

const viewCategoryProducts = (categoryId: number) => {
  // Navegar a la vista de productos con el ID de categoría
  router.push({ name: 'CategoryProducts', params: { categoryId: categoryId.toString() } })
}
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <div class="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full">
            <v-icon name="hi-view-grid" scale="2.5" class="text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Categorías</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Explora nuestras categorías de productos organizadas
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="categoriesStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Cargando categorías...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="categoriesStore.error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2"
      >
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
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay categorías</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Aún no hay categorías disponibles en el sistema
        </p>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="category in categoriesStore.categories"
          :key="category.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
        >
          <!-- Category Icon Header -->
          <div
            class="h-32 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-900/30 dark:to-purple-800/30 flex items-center justify-center"
          >
            <div class="text-6xl">{{ categoriesStore.getCategoryIcon(category.name) }}</div>
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
                  {{ categoriesStore.getProductCount(category.id) }} producto{{
                    categoriesStore.getProductCount(category.id) !== 1 ? 's' : ''
                  }}
                </span>
              </div>
            </div>

            <!-- Category Actions -->
            <div class="space-y-2">
              <button
                @click="viewCategoryProducts(category.id)"
                class="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <v-icon name="hi-eye" scale="1" />
                <span>Ver productos</span>
              </button>
              <div class="flex space-x-2">
                <button
                  class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <v-icon name="hi-pencil" scale="0.9" />
                  <span>Editar</span>
                </button>
                <button
                  class="flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                >
                  <v-icon name="hi-trash" scale="0.9" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>

            <!-- Category ID -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span class="text-xs text-gray-500 dark:text-gray-400"> ID: {{ category.id }} </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Category Button -->
      <div class="mt-12 text-center">
        <button
          class="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
          <v-icon name="hi-plus" scale="1.1" />
          <span>Agregar nueva categoría</span>
        </button>
      </div>

      <!-- Categories Count -->
      <div v-if="categoriesStore.categories.length > 0" class="mt-8 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full"
        >
          <span class="text-blue-600 dark:text-blue-400 font-semibold">
            Total: {{ categoriesStore.categoryCount }} categoría{{
              categoriesStore.categoryCount !== 1 ? 's' : ''
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si necesitas personalización específica */
</style>
