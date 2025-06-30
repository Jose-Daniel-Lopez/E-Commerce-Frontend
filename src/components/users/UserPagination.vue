<script setup lang="ts">
import { useUsersStore } from '@/stores/users'
import { computed } from 'vue'

const usersStore = useUsersStore()

const pagination = computed(() => usersStore.pagination)

const pageNumbers = computed(() => {
  const total = pagination.value.totalPages
  const current = pagination.value.page
  const pages: number[] = []
  
  // Mostrar máximo 5 páginas
  const maxPagesToShow = 5
  let start = Math.max(0, current - Math.floor(maxPagesToShow / 2))
  const end = Math.min(total - 1, start + maxPagesToShow - 1)
  
  // Ajustar si estamos cerca del final
  if (end - start + 1 < maxPagesToShow) {
    start = Math.max(0, end - maxPagesToShow + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const pageSizeOptions = [10, 20, 50, 100]

const startItem = computed(() => 
  pagination.value.page * pagination.value.size + 1
)

const endItem = computed(() => 
  Math.min(
    (pagination.value.page + 1) * pagination.value.size,
    pagination.value.totalElements
  )
)
</script>

<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
    <!-- Pagination Info -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Items per page -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600 dark:text-gray-300">Items per page:</span>
        <select 
          :value="pagination.size" 
          @change="usersStore.changePageSize(Number(($event.target as HTMLSelectElement).value))"
          class="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <!-- Pagination info text -->
      <div class="text-sm text-gray-600 dark:text-gray-300">
        Showing {{ startItem }} to {{ endItem }} of {{ pagination.totalElements }} users
      </div>

      <!-- Pagination controls -->
      <div class="flex items-center space-x-1">
        <!-- First page -->
        <button
          @click="usersStore.goToFirstPage()"
          :disabled="pagination.first || usersStore.loading"
          class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <v-icon name="hi-chevron-double-left" scale="0.9" />
        </button>

        <!-- Previous page -->
        <button
          @click="usersStore.goToPreviousPage()"
          :disabled="pagination.first || usersStore.loading"
          class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <v-icon name="hi-chevron-left" scale="0.9" />
        </button>

        <!-- Page numbers -->
        <button
          v-for="pageNum in pageNumbers"
          :key="pageNum"
          @click="usersStore.goToPage(pageNum)"
          :disabled="usersStore.loading"
          :class="[
            'px-3 py-1 text-sm border rounded-md transition-colors',
            pageNum === pagination.page
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
          ]"
        >
          {{ pageNum + 1 }}
        </button>

        <!-- Next page -->
        <button
          @click="usersStore.goToNextPage()"
          :disabled="pagination.last || usersStore.loading"
          class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <v-icon name="hi-chevron-right" scale="0.9" />
        </button>

        <!-- Last page -->
        <button
          @click="usersStore.goToLastPage()"
          :disabled="pagination.last || usersStore.loading"
          class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <v-icon name="hi-chevron-double-right" scale="0.9" />
        </button>
      </div>
    </div>

    <!-- Loading indicator for pagination -->
    <div v-if="usersStore.loading" class="mt-2 flex justify-center">
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
        <span>Loading...</span>
      </div>
    </div>
  </div>
</template>
