<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'

const router = useRouter()
const categoriesStore = useCategoriesStore()
const { t } = useLanguage()

// State
const currentPage = ref(1)
const sortBy = ref('name')
const searchQuery = ref('')
const favoriteCategories = ref(new Map<number, boolean>())

// Filter collapse states
const collapsedFilters = ref({
  search: false,
  productCount: false,
  alphabetical: false
})

// Computed
const itemsPerPage = 12
const filteredCategories = computed(() => {
  let filtered = [...categoriesStore.categories]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(category =>
      category.name.toLowerCase().includes(query)
    )
  }

  // Sort categories
  switch (sortBy.value) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'products-high':
      filtered.sort((a, b) => categoriesStore.getProductCount(b.id) - categoriesStore.getProductCount(a.id))
      break
    case 'products-low':
      filtered.sort((a, b) => categoriesStore.getProductCount(a.id) - categoriesStore.getProductCount(b.id))
      break
  }

  return filtered
})

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCategories.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredCategories.value.length / itemsPerPage))

// Breadcrumbs for navigation
const breadcrumbs = ref([
  { label: 'Catalog' } // Will be translated via i18n
])

// Translate category name using i18n, supporting both accented and unaccented keys
const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[ -]/g, '')
const translateCategoryName = (categoryName: string): string => {
  const normalizedName = categoryName.toLowerCase()
  const translationKey = `shop.categories.${normalizedName}`
  let translated = t(translationKey)
  if (translated !== translationKey) return translated
  // Try without accents
  const unaccented = removeAccents(normalizedName)
  const translationKeyUnaccented = `shop.categories.${unaccented}`
  translated = t(translationKeyUnaccented)
  if (translated !== translationKeyUnaccented) return translated
  return categoryName
}

// Category type options for filtering
const categoryTypes = computed(() => {
  return categoriesStore.categories.map(category => ({
    name: translateCategoryName(category.name),
    count: categoriesStore.getProductCount(category.id),
    checked: false
  }))
})

// Categories for catalog grid, with translation and image for smartphones
const translatedPaginatedCategories = computed(() => {
  return paginatedCategories.value.map(category => {
    let image = ''
    // Add image for smartphones category
    if (category.name.toLowerCase().includes('smartphone') || category.name.toLowerCase().includes('smartphones') || category.name.toLowerCase().includes('moviles')) {
      image = '/images/categories-smartphones.jpg'
    }
    return {
      ...category,
      name: translateCategoryName(category.name),
      image
    }
  })
})

onMounted(async () => {
  await categoriesStore.fetchCategories()
})

// Methods
const toggleFavorite = (categoryId: number) => {
  const isFavorite = favoriteCategories.value.get(categoryId) || false
  favoriteCategories.value.set(categoryId, !isFavorite)
}

const viewCategoryProducts = (categoryId: number) => {
  router.push({ name: 'categoryProducts', params: { categoryId: categoryId.toString() } })
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const toggleFilter = (filterName: keyof typeof collapsedFilters.value) => {
  collapsedFilters.value[filterName] = !collapsedFilters.value[filterName]
}

// Watch for search changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Breadcrumb -->
    <div class="pt-[85px] lg:pt-0 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-8">
        <!-- Sidebar Filters -->
        <div class="w-64 flex-shrink-0">
          <!-- Search Filter -->
          <div class="mb-6">
            <div class="flex items-center justify-between border-b border-[#EBEBEB] mb-4 pb-3">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Buscar Categorías</h3>
              <button
                @click="toggleFilter('search')"
                class="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
                aria-label="Toggle search filter"
              >
                <svg
                  class="w-4 h-4 text-gray-600 transition-transform duration-200"
                  :class="{ 'rotate-180': collapsedFilters.search }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div v-show="!collapsedFilters.search" class="transition-all duration-200">
              <div class="flex items-center justify-start gap-2 bg-[#f5f5f5] p-3 rounded-lg">
                <v-icon name="fa-search" scale="1.2" class="text-gray-400" />
                <input
                  v-model="searchQuery"
                  class="w-full bg-[#f5f5f5] p-0.5 font-srProDisplay text-sm font-medium text-black outline-none"
                  type="search"
                  placeholder="Buscar"
                />
              </div>
            </div>
          </div>

          <!-- Category Types Filter -->
          <div class="mb-6">
            <div class="flex items-center justify-between border-b border-[#EBEBEB] mb-4 pb-3">
              <h3 class="font-srProDisplay text-lg font-semibold text-black">Tipos</h3>
              <button
                @click="toggleFilter('productCount')"
                class="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
                aria-label="Toggle product count filter"
              >
                <svg
                  class="w-4 h-4 text-gray-600 transition-transform duration-200"
                  :class="{ 'rotate-180': collapsedFilters.productCount }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div v-show="!collapsedFilters.productCount" class="transition-all duration-200">
              <div class="space-y-3 max-h-64 overflow-y-auto">
                <div v-for="type in categoryTypes" :key="type.name" class="flex items-center">
                  <input :id="'type-' + type.name" type="checkbox" v-model="type.checked"
                    class="custom-checkbox focus:ring-1 focus:ring-gray-400">
                  <label :for="'type-' + type.name" class="ml-3 flex-1 flex items-center justify-between">
                    <span class="text-sm font-srProDisplay text-gray-1000">{{ type.name }}</span>
                    <span class="text-xs font-srProDisplay text-gray-400 pr-4">{{ type.count }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-srProDisplay text-sm font-semibold text-gray-800 mb-2">Estadísticas</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Categorías:</span>
                <span class="font-medium">{{ categoriesStore.categoryCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Productos:</span>
                <span class="font-medium">{{ categoriesStore.totalProducts }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Filtradas:</span>
                <span class="font-medium">{{ filteredCategories.length }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Header with category count and sorting -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="font-srProDisplay text-xl font-semibold text-black">Catálogo de Categorías</h1>
              <p class="font-srProDisplay text-gray-600">{{ filteredCategories.length }} categorías encontradas</p>
            </div>
            <div class="flex items-center">
              <select v-model="sortBy" class="font-srProDisplay border border-[#EBEBEB] rounded-md w-70 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500">
                <option value="name">Nombre A-Z</option>
                <option value="name-desc">Nombre Z-A</option>
                <option value="products-high">Más productos</option>
                <option value="products-low">Menos productos</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="categoriesStore.loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            <span class="ml-3 text-gray-600">Cargando categorías...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="categoriesStore.error"
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2 mb-8">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ categoriesStore.error }}</span>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredCategories.length === 0" class="text-center py-12">
            <div class="flex justify-center mb-4">
              <div class="bg-gray-100 p-6 rounded-full">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron categorías
            </h3>
            <p class="text-gray-600">
              No hay categorías que coincidan con tu búsqueda
            </p>
          </div>

          <!-- Categories Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div
              v-for="category in translatedPaginatedCategories"
              :key="category.id"
              class="relative h-auto rounded-[9px] bg-[#f6f6f6] px-3 py-6 duration-500 hover:scale-[1.02] hover:shadow-md md:h-[300px] md:px-4"
            >
              <!-- Favorite Button -->
              <div class="absolute top-4 right-4 z-10">
                <button
                  @click="toggleFavorite(category.id)"
                  class="w-6 h-6 text-gray-600 hover:text-red-600 transition-colors"
                  type="button"
                  aria-label="Toggle favorite"
                >
                  <svg
                    v-if="!favoriteCategories.get(category.id)"
                    class="w-6 h-6 text-gray-600 hover:text-red-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-6 h-6 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div class="flex flex-col h-full">

                <!-- Category Icon -->
                <div class="flex items-center justify-center mb-6">
                  <div class="h-[80px] w-[80px] md:h-[100px] md:w-[100px] bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
                    <img v-if="category.image" :src="category.image" :alt="category.name" class="object-cover w-full h-full" />
                    <svg v-else class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>

                <div class="flex flex-col flex-1 gap-4">
                  <!-- Category Name -->
                  <div class="text-center">
                    <h3 class="font-srProDisplay text-lg font-semibold text-black mb-2">{{ category.name }}</h3>
                    <p class="text-sm text-gray-600">{{ categoriesStore.getProductCount(category.id) }} productos</p>
                  </div>

                  <!-- View Button -->
                  <div class="flex items-center justify-center mt-auto">
                    <button
                      @click="viewCategoryProducts(category.id)"
                      class="w-full bg-black text-white py-2.5 px-4 rounded-md font-srProDisplay text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Ver Productos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center space-x-2">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
              class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <button v-for="page in Math.min(totalPages, 5)" :key="page" @click="goToPage(page)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                page === currentPage
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              ]">
              {{ page }}
            </button>

            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
              class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Avoid that annoying tailwind blue outline */
button:focus {
  outline: none;
  box-shadow: none;
}

/* Custom scrollbar for filter sections */
.overflow-y-auto::-webkit-scrollbar {
  width: 2px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #000;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #222;
}

/* Smooth transitions for interactive elements */
.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background-color: white;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
}

/* Hover state */
.custom-checkbox:hover {
  border-color: #9ca3af;
}

/* Checked state */
.custom-checkbox:checked {
  background-color: #000000;
  border-color: #000000;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M13.854 3.646L6.354 11.146a.5.5 0 01-.708 0L2.146 7.646a.5.5 0 11.708-.708L6 10.293l7.146-7.147a.5.5 0 01.708.708z'/%3e%3c/svg%3e");
  background-size: 8px 8px;
  background-position: center;
  background-repeat: no-repeat;
}

/* Category card hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Category card animations */
.category-card {
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Loading animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style>
