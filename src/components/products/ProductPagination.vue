<script setup lang="ts">
import { useProductStore } from '@/stores/products'
import { computed } from 'vue'

const productStore = useProductStore()

const pagination = computed(() => productStore.pagination)

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

const startItem = computed(() => pagination.value.page * pagination.value.size + 1)

const endItem = computed(() =>
  Math.min((pagination.value.page + 1) * pagination.value.size, pagination.value.totalElements),
)
</script>

<template>
  <div class="theme-card rounded-lg p-4 border theme-border">
    <!-- Pagination Info -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Items per page -->
      <div class="flex items-center space-x-2">
        <span class="text-sm theme-muted-text">Items per page:</span>
        <select
          :value="pagination.size"
          @change="productStore.changePageSize(Number(($event.target as HTMLSelectElement).value))"
          class="theme-input text-sm rounded-md px-2 py-1"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <!-- Pagination info text -->
      <div class="text-sm theme-muted-text">
        Showing {{ startItem }} to {{ endItem }} of {{ pagination.totalElements }} products
      </div>

      <!-- Pagination controls -->
      <div class="flex items-center space-x-1">
        <!-- First page -->
        <button
          @click="productStore.goToFirstPage()"
          :disabled="pagination.first || productStore.loading"
          class="px-2 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:theme-surface theme-text theme-border bg-transparent"
        >
          <v-icon name="hi-chevron-double-left" scale="0.9" />
        </button>

        <!-- Previous page -->
        <button
          @click="productStore.goToPreviousPage()"
          :disabled="pagination.first || productStore.loading"
          class="px-2 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:theme-surface theme-text theme-border bg-transparent"
        >
          <v-icon name="hi-chevron-left" scale="0.9" />
        </button>

        <!-- Page numbers -->
        <button
          v-for="pageNum in pageNumbers"
          :key="pageNum"
          @click="productStore.goToPage(pageNum)"
          :disabled="productStore.loading"
          :class="[
            'px-3 py-1 text-sm border rounded-md transition-colors',
            pageNum === pagination.page
              ? 'button-primary'
              : 'border theme-border hover:theme-surface theme-text bg-transparent',
          ]"
        >
          {{ pageNum + 1 }}
        </button>

        <!-- Next page -->
        <button
          @click="productStore.goToNextPage()"
          :disabled="pagination.last || productStore.loading"
          class="px-2 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:theme-surface theme-text theme-border bg-transparent"
        >
          <v-icon name="hi-chevron-right" scale="0.9" />
        </button>

        <!-- Last page -->
        <button
          @click="productStore.goToLastPage()"
          :disabled="pagination.last || productStore.loading"
          class="px-2 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:theme-surface theme-text theme-border bg-transparent"
        >
          <v-icon name="hi-chevron-double-right" scale="0.9" />
        </button>
      </div>
    </div>

    <!-- Loading indicator for pagination -->
    <div v-if="productStore.loading" class="mt-2 flex justify-center">
      <div class="flex items-center space-x-2 text-sm theme-muted-text">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2" :style="{ borderColor: 'var(--color-primary)' }"></div>
        <span class="theme-muted-text">Loading...</span>
      </div>
    </div>
  </div>
</template>
