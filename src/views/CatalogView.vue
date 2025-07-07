<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'

const router = useRouter()
const categoriesStore = useCategoriesStore()
const { t } = useLanguage()

// State
const currentPage = ref(1)
const sortBy = ref('name')
const searchQuery = ref('')
const favoriteCategories = ref(new Map<number, boolean>())
const categoryTypes = ref<Array<{ name: string; originalName: string; count: number; checked: boolean }>>([])

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

  // Type filter - only show categories that are checked
  const selectedTypes = categoryTypes.value.filter(type => type.checked).map(type => type.originalName)
  if (selectedTypes.length > 0) {
    filtered = filtered.filter(category =>
      selectedTypes.includes(category.name)
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

// Breadcrumbs for navigation (reactivo y traducido)
const breadcrumbs = computed(() => [
  { label: 'catalog.title', to: '/catalog' },
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

const getCategoryImageName = (categoryName: string): string => {
  const normalizedName = removeAccents(categoryName).toLowerCase()

  const categoryMapping: { [key: string]: string } = {
    // Audio
    'audio': 'audio',
    'sonido': 'audio',

    // Gaming
    'gaming': 'gaming',
    'juegos': 'gaming',
    'videojuegos': 'gaming',
    'consolas': 'gaming',

    // Tablets
    'tablets': 'tablets',
    'tabletas': 'tablets',
    'ipad': 'tablets',

    // Smartphones
    'smartphones': 'smartphones',
    'phones': 'smartphones',
    'teléfonos': 'smartphones',
    'telefonos': 'smartphones',
    'móviles': 'smartphones',
    'moviles': 'smartphones',
    'celulares': 'smartphones',
    'iphone': 'smartphones',

    // Computers
    'computers': 'computers',
    'computadoras': 'computers',
    'ordenadores': 'computers',
    'laptops': 'computers',
    'pc': 'computers',
    'macbook': 'computers',

    // Cameras
    'cameras': 'cameras',
    'cámaras': 'cameras',
    'camaras': 'cameras',
    'fotografía': 'cameras',
    'fotografia': 'cameras',

    // Headphones
    'headphones': 'headphones',
    'auriculares': 'headphones',
    'audífonos': 'headphones',
    'cascos': 'headphones',

    // Accessories
    'accessories': 'accessories',
    'accesorios': 'accessories',
    'complementos': 'accessories',

    // Keyboards
    'keyboards': 'keyboards',
    'teclados': 'keyboards',

    // Mice - Más específico primero
    'mice': 'mice',
    'ratones': 'mice',
    'mouse': 'mice',
    'ratón': 'mice',

    // Smart Home - Más específico primero
    'smart home': 'smarthome',
    'smarthome': 'smarthome',
    'casa inteligente': 'smarthome',
    'hogar inteligente': 'smarthome',
    'hogarinteligente': 'smarthome',
    'casainteligente': 'smarthome',
    'domótica': 'smarthome',
    'domotica': 'smarthome',

    // Smart Watches
    'smart watches': 'smartwatches',
    'smartwatches': 'smartwatches',
    'relojes inteligentes': 'smartwatches',
    'relojesinteligentes': 'smartwatches',
    'apple watch': 'smartwatches',
    'wearables': 'smartwatches'
  }

  // Try exact match first
  if (categoryMapping[normalizedName]) {
    return categoryMapping[normalizedName]
  }

  // Sort keys by length (longest first) to avoid incorrect partial matches
  const sortedKeys = Object.keys(categoryMapping).sort((a, b) => b.length - a.length)

  // Try partial match with longer keys first
  for (const key of sortedKeys) {
    if (normalizedName.includes(key)) {
      return categoryMapping[key]
    }
  }

  return normalizedName.replace(/\s+/g, '').replace(/-/g, '')
}

// Utility to get the best image format for a category
const getCategoryImage = (categoryName: string): string[] => {
  const imageName = getCategoryImageName(categoryName)
  const base = `/images/categories-${imageName}`

  // Debug: log to see which images are being searched
  console.log(`Categoria: "${categoryName}" -> Imagen: "${imageName}" -> Path: "${base}"`)

  return [
    `${base}.webp`,
    `${base}.png`
  ]
}

// Categories for catalog grid, with image path candidates
const translatedPaginatedCategories = computed(() => {
  return paginatedCategories.value.map(category => {
    return {
      ...category,
      name: translateCategoryName(category.name),
      imageCandidates: getCategoryImage(category.name)
    }
  })
})

onMounted(async () => {
  await categoriesStore.fetchCategories()
  // Initialize category types after categories are loaded
  categoryTypes.value = categoriesStore.categories.map(category => ({
    name: translateCategoryName(category.name),
    originalName: category.name,
    count: categoriesStore.getProductCount(category.id),
    checked: false
  }))
})

// Methods
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const currentSrc = img.src

  // Find the corresponding category to get the image candidates
  const category = translatedPaginatedCategories.value.find(cat =>
    cat.imageCandidates?.some(candidate => currentSrc.includes(candidate.split('/').pop()?.split('.')[0] || ''))
  )

  if (category && category.imageCandidates) {
    const currentIndex = category.imageCandidates.findIndex(candidate =>
      currentSrc.includes(candidate.split('/').pop()?.split('.')[0] || '')
    )

    // Try the next candidate
    if (currentIndex !== -1 && currentIndex < category.imageCandidates.length - 1) {
      img.src = category.imageCandidates[currentIndex + 1]
      return
    }
  }

  // If there are no more candidates, show fallback
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    parent.innerHTML = `
      <div class="w-[80px] h-[80px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    `
  }
}

const toggleFavorite = (categoryId: number) => {
  const isFavorite = favoriteCategories.value.get(categoryId) || false
  favoriteCategories.value.set(categoryId, !isFavorite)
}

const viewCategoryProducts = (categoryId: number) => {
  // Find the category by ID to get its name
  const category = categoriesStore.categories.find(cat => cat.id === categoryId)
  if (category) {
    // Normalize the name for the URL
    const categoryName = category.name.toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '')       // Remove special characters
      .replace(/\-\-+/g, '-')         // Replace multiple dashes with a single one
      .replace(/^-+/, '')             // Remove dashes at the start
      .replace(/-+$/, '')             // Remove dashes at the end

    router.push(`/catalog/${categoryName}`).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
   }).catch(error => {
      console.error('Error navigating to category:', error)
    })
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const toggleFilter = (filterName: keyof typeof collapsedFilters.value) => {
  collapsedFilters.value[filterName] = !collapsedFilters.value[filterName]
}

const clearTypeFilters = () => {
  categoryTypes.value.forEach(type => {
    type.checked = false
  })
}

// Watch for search changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1
})

// Watch for category type filter changes to reset pagination
watch(categoryTypes, () => {
  currentPage.value = 1
}, { deep: true })
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
              <div class="flex items-center space-x-2">
                <button
                  v-if="categoryTypes.some(type => type.checked)"
                  @click="clearTypeFilters"
                  class="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  type="button"
                  title="Limpiar filtros"
                >
                  Limpiar
                </button>
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
              class="relative h-auto rounded-[9px] bg-[#f6f6f6] px-3 py-6 duration-500 hover:scale-[1.02] hover:shadow-md md:h-[435px] md:px-4 flex flex-col"
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
                <!-- Category Image/Icon -->
              <div class="flex items-center justify-center mb-4">
                <div class="h-[160px] w-[160px] bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden relative">
                  <!-- Imagen principal con candidates -->
                  <img
                    v-if="category.imageCandidates"
                    :src="category.imageCandidates[0]"
                    :alt="`Imagen de ${category.name}`"
                    class="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    @error="handleImageError"
                  />

                  <!-- Fallback icon con mejor diseño -->
                  <div v-else class="w-[80px] h-[80px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>
                <!-- Category Name -->
                <div class="flex-1 flex flex-col items-center justify-center">
                  <h3 class="font-srProDisplay text-lg font-semibold text-black mb-2 text-center line-clamp-2">{{ category.name }}</h3>
                  <p class="text-sm text-gray-600 text-center">{{ categoriesStore.getProductCount(category.id) }} productos</p>
                </div>
                <!-- View Button -->
                <div class="flex items-center justify-center mt-4">
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
/* Remove default Tailwind blue outline on button focus */
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
