<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'
import { useThemeClasses } from '@/composables/useThemeClasses'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'

const router = useRouter()
const categoriesStore = useCategoriesStore()
const { t } = useLanguage()

// Theme classes
const {
  pageBackgroundClasses,
  textClasses,
  textSecondaryClasses,
  buttonPrimaryClasses,
  catalogFilterSectionClasses,
  catalogFilterHeaderClasses,
  catalogFilterTitleClasses,
  catalogSearchInputClasses,
  catalogProductCardClasses,
  catalogMobileFilterClasses,
  catalogSortSelectClasses,
  catalogCheckboxClasses,
  catalogFilterLabelClasses,
  catalogClearFilterClasses,
  catalogPaginationButtonClasses,
  catalogPaginationActiveClasses,
  emptyStateTextClasses,
  emptyStateIconClasses,
  loadingTextClasses,
  hoverClasses,
} = useThemeClasses()

// State
const currentPage = ref(1)
const sortBy = ref('name')
const searchQuery = ref('')
const categoryTypes = ref<
  Array<{ name: string; originalName: string; count: number; checked: boolean }>
>([])

// Mobile-specific state
const showMobileFilters = ref(false)
const showMobileSorting = ref(false)

// Filter collapse states
const collapsedFilters = ref({
  search: false,
  productCount: false,
  alphabetical: false,
})

// Computed
const itemsPerPage = 12
const filteredCategories = computed(() => {
  let filtered = [...categoriesStore.categories]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter((category) => category.name.toLowerCase().includes(query))
  }

  // Type filter - only show categories that are checked
  const selectedTypes = categoryTypes.value
    .filter((type) => type.checked)
    .map((type) => type.originalName)
  if (selectedTypes.length > 0) {
    filtered = filtered.filter((category) => selectedTypes.includes(category.name))
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
      filtered.sort(
        (a, b) => categoriesStore.getProductCount(b.id) - categoriesStore.getProductCount(a.id),
      )
      break
    case 'products-low':
      filtered.sort(
        (a, b) => categoriesStore.getProductCount(a.id) - categoriesStore.getProductCount(b.id),
      )
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
const breadcrumbs = computed(() => [{ label: 'catalog.title', to: '/catalog' }])

// Check if any filters are active
const hasActiveFilters = () => {
  const searchActive = searchQuery.value.trim().length > 0
  const typeFiltersActive = categoryTypes.value.some((type) => type.checked)
  return searchActive || typeFiltersActive
}

// Clear all filters
const clearAllFilters = () => {
  searchQuery.value = ''
  categoryTypes.value.forEach((type) => {
    type.checked = false
  })
  currentPage.value = 1
  showMobileFilters.value = false
}

// Translate category name using i18n, supporting both accented and unaccented keys
const removeAccents = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ -]/g, '')
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
    audio: 'audio',
    sonido: 'audio',

    // Gaming
    gaming: 'gaming',
    juegos: 'gaming',
    videojuegos: 'gaming',
    consolas: 'gaming',

    // Tablets
    tablets: 'tablets',
    tabletas: 'tablets',
    ipad: 'tablets',

    // Smartphones
    smartphones: 'smartphones',
    phones: 'smartphones',
    teléfonos: 'smartphones',
    telefonos: 'smartphones',
    móviles: 'smartphones',
    moviles: 'smartphones',
    celulares: 'smartphones',
    iphone: 'smartphones',

    // Computers
    computers: 'computers',
    computadoras: 'computers',
    ordenadores: 'computers',
    laptops: 'computers',
    pc: 'computers',
    macbook: 'computers',

    // Cameras
    cameras: 'cameras',
    cámaras: 'cameras',
    camaras: 'cameras',
    fotografía: 'cameras',
    fotografia: 'cameras',

    // Headphones
    headphones: 'headphones',
    auriculares: 'headphones',
    audífonos: 'headphones',
    cascos: 'headphones',

    // Accessories
    accessories: 'accessories',
    accesorios: 'accessories',
    complementos: 'accessories',

    // Keyboards
    keyboards: 'keyboards',
    teclados: 'keyboards',

    // Mice - Más específico primero
    mice: 'mice',
    ratones: 'mice',
    mouse: 'mice',
    ratón: 'mice',

    // Smart Home - Más específico primero
    'smart home': 'smarthome',
    smarthome: 'smarthome',
    'casa inteligente': 'smarthome',
    'hogar inteligente': 'smarthome',
    hogarinteligente: 'smarthome',
    casainteligente: 'smarthome',
    domótica: 'smarthome',
    domotica: 'smarthome',

    // Smart Watches
    'smart watches': 'smartwatches',
    smartwatches: 'smartwatches',
    'relojes inteligentes': 'smartwatches',
    relojesinteligentes: 'smartwatches',
    'apple watch': 'smartwatches',
    wearables: 'smartwatches',
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

  return [`${base}.webp`, `${base}.png`]
}

// Categories for catalog grid, with image path candidates
const translatedPaginatedCategories = computed(() => {
  return paginatedCategories.value.map((category) => {
    return {
      ...category,
      name: translateCategoryName(category.name),
      imageCandidates: getCategoryImage(category.name),
    }
  })
})

onMounted(async () => {
  await categoriesStore.fetchCategories()
  // Initialize category types after categories are loaded
  categoryTypes.value = categoriesStore.categories.map((category) => ({
    name: translateCategoryName(category.name),
    originalName: category.name,
    count: categoriesStore.getProductCount(category.id),
    checked: false,
  }))
})

// Methods
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const currentSrc = img.src

  // Find the corresponding category to get the image candidates
  const category = translatedPaginatedCategories.value.find((cat) =>
    cat.imageCandidates?.some((candidate) =>
      currentSrc.includes(candidate.split('/').pop()?.split('.')[0] || ''),
    ),
  )

  if (category && category.imageCandidates) {
    const currentIndex = category.imageCandidates.findIndex((candidate) =>
      currentSrc.includes(candidate.split('/').pop()?.split('.')[0] || ''),
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

const viewCategoryProducts = (categoryId: number) => {
  // Find the category by ID to get its name
  const category = categoriesStore.categories.find((cat) => cat.id === categoryId)
  if (category) {
    // Normalize the name for the URL
    const categoryName = category.name
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/[^\w-]+/g, '') // Remove special characters
      .replace(/--+/g, '-') // Replace multiple dashes with a single one
      .replace(/^-+/, '') // Remove dashes at the start
      .replace(/-+$/, '') // Remove dashes at the end

    router
      .push(`/catalog/${categoryName}`)
      .catch((error) => {
        console.error('Error navigating to category:', error)
      })
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  // Scroll to top on mobile for better UX
  if (window.innerWidth < 768) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const toggleFilter = (filterName: keyof typeof collapsedFilters.value) => {
  collapsedFilters.value[filterName] = !collapsedFilters.value[filterName]
}

const clearTypeFilters = () => {
  categoryTypes.value.forEach((type) => {
    type.checked = false
  })
}

// Watch for search changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1
})

// Watch for category type filter changes to reset pagination
watch(
  categoryTypes,
  () => {
    currentPage.value = 1
  },
  { deep: true },
)
</script>

<template>
  <div :class="pageBackgroundClasses" class="min-h-screen">
    <!-- Breadcrumb -->
    <div :class="pageBackgroundClasses" class="pt-[85px] lg:pt-0">
      <div class="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      </div>
    </div>

    <div class="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-8">
      <!-- Mobile: Single Column Layout -->
      <div class="lg:hidden">
        <!-- Mobile Header -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 :class="['text-lg font-semibold font-srProDisplay sm:text-xl', textClasses]">
                {{ t('catalog.title') }}
              </h1>
              <p :class="['text-sm font-srProDisplay', textSecondaryClasses]">
                {{ filteredCategories.length }} {{ filteredCategories.length === 1 ? t('catalog.category') :
                t('catalog.categories') }}
              </p>
            </div>
          </div>

          <!-- Mobile Filter/Sort Controls -->
          <div class="flex gap-3 mb-4">
            <button @click="showMobileFilters = !showMobileFilters" :class="[
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[48px]',
                showMobileFilters ? buttonPrimaryClasses : `${pageBackgroundClasses} ${textSecondaryClasses} ${hoverClasses}`
              ]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              <span v-if="hasActiveFilters()" class="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                Active
              </span>
            </button>

            <button @click="showMobileSorting = !showMobileSorting"
              :class="`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium min-h-[48px] ${pageBackgroundClasses} ${textSecondaryClasses} ${hoverClasses}`">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 5v6m0 0V9a2 2 0 012-2h4a2 2 0 012 2v2M8 11l4 4 4-4" />
              </svg>
              Sort
            </button>
          </div>

          <!-- Mobile Collapsible Filters -->
          <div v-if="showMobileFilters" :class="catalogMobileFilterClasses">
            <!-- Search Filter -->
            <div>
              <h3 :class="catalogFilterTitleClasses" class="mb-3 text-base font-semibold font-srProDisplay">{{
                t('catalog.searchCategories') }}</h3>
              <div
                :class="`flex items-center gap-2 ${pageBackgroundClasses} p-3 rounded-lg border border-gray-200 dark:border-gray-600`">
                <v-icon name="fa-search" scale="1" :class="textSecondaryClasses" />
                <input v-model="searchQuery" :class="`flex-1 bg-transparent text-sm outline-none ${textClasses}`"
                  type="search" :placeholder="t('catalog.searchPlaceholder')" />
              </div>
            </div>

            <!-- Category Types Filter -->
            <div v-if="categoryTypes.length > 0">
              <h3 :class="catalogFilterTitleClasses" class="mb-3 text-base font-semibold font-srProDisplay">{{
                t('catalog.types') }}</h3>
              <div class="grid grid-cols-1 gap-3 overflow-y-auto max-h-48">
                <label v-for="type in categoryTypes.slice(0, 12)" :key="type.name"
                  :class="`flex items-center justify-between gap-2 ${pageBackgroundClasses} p-3 rounded text-sm cursor-pointer ${hoverClasses}`">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" v-model="type.checked" :class="catalogCheckboxClasses" />
                    <span :class="catalogFilterLabelClasses" class="font-medium">{{ type.name }}</span>
                  </div>
                  <span :class="textSecondaryClasses" class="text-xs font-medium">{{ type.count }}</span>
                </label>
              </div>
            </div>

            <!-- Clear Filters -->
            <div v-if="hasActiveFilters()" class="flex gap-3">
              <button @click="clearAllFilters"
                class="flex-1 py-2 text-sm text-red-600 transition-colors border border-red-200 rounded-lg dark:text-red-400 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                Clear All
              </button>
              <button @click="showMobileFilters = false"
                :class="`flex-1 py-2 text-sm rounded-lg transition-colors ${buttonPrimaryClasses}`">
                Apply Filters
              </button>
            </div>
          </div>

          <!-- Mobile Sort Dropdown -->
          <div v-if="showMobileSorting"
            :class="`${pageBackgroundClasses} border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden mb-4`">
            <button v-for="option in [
                { value: 'name', label: t('catalog.sort.nameAZ') },
                { value: 'name-desc', label: t('catalog.sort.nameZA') },
                { value: 'products-high', label: t('catalog.sort.mostProducts') },
                { value: 'products-low', label: t('catalog.sort.leastProducts') }
              ]" :key="option.value" @click="sortBy = option.value; showMobileSorting = false" :class="[
                `w-full px-4 py-3 text-left text-sm ${hoverClasses} transition-colors min-h-[48px] flex items-center`,
                sortBy === option.value ? `bg-gray-100 dark:bg-gray-700 font-medium ${textClasses}` : textClasses
              ]">
              {{ option.label }}
              <svg v-if="sortBy === option.value" :class="`w-5 h-5 ml-auto ${textClasses}`" fill="currentColor"
                viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Categories Grid -->
        <div class="w-full">
          <!-- Loading State -->
          <div v-if="categoriesStore.loading" class="flex items-center justify-center py-12">
            <div class="w-12 h-12 border-b-2 rounded-full animate-spin border-emerald-500"></div>
            <span :class="loadingTextClasses" class="ml-3">{{ t('shop.loadingCategories') }}</span>
          </div>

          <!-- Error State -->
          <div v-else-if="categoriesStore.error"
            class="flex items-center justify-center px-4 py-3 mb-8 space-x-2 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900/30 dark:border-red-600 dark:text-red-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            <span>{{ categoriesStore.error }}</span>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredCategories.length === 0" class="py-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="p-6 bg-gray-100 rounded-full dark:bg-gray-800">
                <svg :class="emptyStateIconClasses" class="w-12 h-12" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h3 :class="textClasses" class="mb-2 text-xl font-semibold">{{ t('catalog.noCategoriesFound') }}</h3>
            <p :class="emptyStateTextClasses" class="mb-4">{{ t('catalog.noCategoriesMatch') }}</p>
            <button v-if="hasActiveFilters()" @click="clearAllFilters"
              :class="`${buttonPrimaryClasses} px-4 py-2 rounded-md text-sm font-medium transition-colors`">
              Clear All Filters
            </button>
          </div>

          <!-- Categories Grid -->
          <div v-else class="grid grid-cols-2 gap-4 mb-8">
            <div v-for="category in translatedPaginatedCategories" :key="category.id"
              :class="`relative rounded-lg p-3 transition-shadow flex flex-col ${catalogProductCardClasses}`">
              <div class="flex flex-col h-full">
                <!-- Category Image/Icon -->
                <div class="flex items-center justify-center mb-3">
                  <div
                    :class="`h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] ${pageBackgroundClasses} rounded-xl flex items-center justify-center shadow-sm overflow-hidden relative border border-gray-200 dark:border-gray-600`">
                    <!-- Imagen principal con candidates -->
                    <img v-if="category.imageCandidates" :src="category.imageCandidates[0]"
                      :alt="`Imagen de ${category.name}`"
                      class="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                      loading="lazy" @error="handleImageError" />

                    <!-- Fallback icon con mejor diseño -->
                    <div v-else
                      class="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                      <svg :class="emptyStateIconClasses" class="w-8 h-8 sm:w-12 sm:h-12" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Category Name -->
                <div class="flex flex-col items-center justify-center flex-1 mb-3 text-center">
                  <h3 :class="textClasses"
                    class="mb-1 text-sm font-semibold font-srProDisplay sm:text-base line-clamp-2">
                    {{ category.name }}
                  </h3>
                  <p :class="textSecondaryClasses" class="text-xs sm:text-sm">
                    {{ categoriesStore.getProductCount(category.id) }} {{ t('shop.product' +
                    (categoriesStore.getProductCount(category.id) === 1 ? '' : 's')) }}
                  </p>
                </div>

                <!-- View Button -->
                <button @click="viewCategoryProducts(category.id)"
                  :class="`w-full py-2 px-3 rounded-md font-srProDisplay text-xs sm:text-sm font-medium transition-colors ${buttonPrimaryClasses}`">
                  {{ t('catalog.viewProducts') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center space-x-1">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
              :class="`p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center ${hoverClasses}`">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span :class="textSecondaryClasses" class="px-4 py-2 text-sm">
              {{ currentPage }} of {{ totalPages }}
            </span>

            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
              :class="`p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center ${hoverClasses}`">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop: Two Column Layout -->
      <div class="hidden gap-8 lg:flex">
        <!-- Desktop Sidebar Filters -->
        <div class="flex-shrink-0 w-64">
          <!-- Search Filter -->
          <div :class="catalogFilterSectionClasses" class="mb-6">
            <div :class="catalogFilterHeaderClasses">
              <h3 :class="catalogFilterTitleClasses" class="text-lg font-semibold font-srProDisplay">{{
                t('catalog.searchCategories') }}</h3>
              <button @click="toggleFilter('search')" :class="`p-1 rounded transition-colors ${hoverClasses}`"
                type="button" aria-label="Toggle search filter">
                <svg
                  :class="`w-4 h-4 ${textSecondaryClasses} transition-transform duration-200 ${collapsedFilters.search ? 'rotate-180' : ''}`"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            <div v-show="!collapsedFilters.search" class="transition-all duration-200">
              <div :class="`flex items-center justify-start gap-2 ${catalogSearchInputClasses} p-3 rounded-lg`">
                <v-icon name="fa-search" scale="1.2" :class="textSecondaryClasses" />
                <input v-model="searchQuery"
                  :class="`w-full bg-transparent p-0.5 font-srProDisplay text-sm font-medium outline-none ${textClasses}`"
                  type="search" :placeholder="t('catalog.searchPlaceholder') " />
              </div>
            </div>
          </div>

          <!-- Category Types Filter -->
          <div :class="catalogFilterSectionClasses" class="mb-6">
            <div :class="catalogFilterHeaderClasses">
              <h3 :class="catalogFilterTitleClasses" class="text-lg font-semibold font-srProDisplay">{{
                t('catalog.types') }}</h3>
              <div class="flex items-center space-x-2">
                <button v-if="categoryTypes.some((type) => type.checked)" @click="clearTypeFilters"
                  :class="catalogClearFilterClasses" class="text-xs transition-colors" type="button"
                  :title="t('catalog.clearFilters')">
                  {{ t('catalog.clearFilters') }}
                </button>
                <button @click="toggleFilter('productCount')" :class="`p-1 rounded transition-colors ${hoverClasses}`"
                  type="button" aria-label="Toggle product count filter">
                  <svg
                    :class="`w-4 h-4 ${textSecondaryClasses} transition-transform duration-200 ${collapsedFilters.productCount ? 'rotate-180' : ''}`"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div v-show="!collapsedFilters.productCount" class="transition-all duration-200">
              <div class="space-y-3 overflow-y-auto max-h-64">
                <div v-for="type in categoryTypes" :key="type.name" class="flex items-center">
                  <input :id="'type-' + type.name" type="checkbox" v-model="type.checked"
                    :class="catalogCheckboxClasses" class="focus:ring-1 focus:ring-gray-400" />
                  <label :for="'type-' + type.name" class="flex items-center justify-between flex-1 ml-3">
                    <span :class="catalogFilterLabelClasses" class="text-sm font-srProDisplay">{{ type.name }}</span>
                    <span :class="textSecondaryClasses" class="pr-4 text-xs font-srProDisplay">{{
                      type.count
                      }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div
            class="p-4 mb-6 transition-colors duration-200 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
            <h4 :class="textClasses" class="mb-2 text-sm font-semibold font-srProDisplay">{{ t('catalog.stats') }}</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span :class="textSecondaryClasses">{{ t('catalog.totalCategories') }}</span>
                <span :class="textClasses" class="font-medium">{{ categoriesStore.categoryCount }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="textSecondaryClasses">{{ t('catalog.totalProducts') }}</span>
                <span :class="textClasses" class="font-medium">{{ categoriesStore.totalProducts }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="textSecondaryClasses">{{ t('catalog.filtered') }}</span>
                <span :class="textClasses" class="font-medium">{{ filteredCategories.length }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Main Content -->
        <div class="flex-1">
          <!-- Header with category count and sorting -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 :class="textClasses" class="text-xl font-semibold font-srProDisplay">
                {{ t('catalog.title') }}
              </h1>
              <p :class="textSecondaryClasses" class="font-srProDisplay">
                {{ filteredCategories.length }} {{ filteredCategories.length === 1 ? t('catalog.category') :
                t('catalog.categories') }}
              </p>
            </div>
            <div class="flex items-center">
              <select v-model="sortBy" :class="catalogSortSelectClasses"
                class="font-srProDisplay w-70 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400">
                <option value="name">{{ t('catalog.sort.nameAZ') }}</option>
                <option value="name-desc">{{ t('catalog.sort.nameZA') }}</option>
                <option value="products-high">{{ t('catalog.sort.mostProducts') }}</option>
                <option value="products-low">{{ t('catalog.sort.leastProducts') }}</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="categoriesStore.loading" class="flex items-center justify-center py-12">
            <div class="w-12 h-12 border-b-2 rounded-full animate-spin border-emerald-500"></div>
            <span :class="loadingTextClasses" class="ml-3">{{ t('shop.loadingCategories') }}</span>
          </div>

          <!-- Error State -->
          <div v-else-if="categoriesStore.error"
            class="flex items-center justify-center px-4 py-3 mb-8 space-x-2 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900/30 dark:border-red-600 dark:text-red-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            <span>{{ categoriesStore.error }}</span>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredCategories.length === 0" class="py-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="p-6 bg-gray-100 rounded-full dark:bg-gray-800">
                <svg :class="emptyStateIconClasses" class="w-12 h-12" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h3 :class="textClasses" class="mb-2 text-xl font-semibold">{{ t('catalog.noCategoriesFound') }}</h3>
            <p :class="emptyStateTextClasses">{{ t('catalog.noCategoriesMatch') }}</p>
          </div>

          <!-- Categories Grid -->
          <div v-else class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="category in translatedPaginatedCategories" :key="category.id"
              :class="`relative h-auto rounded-[9px] px-3 py-6 duration-500 hover:scale-[1.02] hover:shadow-md md:h-[435px] md:px-4 flex flex-col ${catalogProductCardClasses}`">
              <div class="flex flex-col h-full">
                <!-- Category Image/Icon -->
                <div class="flex items-center justify-center mb-4">
                  <div
                    :class="`h-[160px] w-[160px] ${pageBackgroundClasses} rounded-xl flex items-center justify-center shadow-sm overflow-hidden relative border border-gray-200 dark:border-gray-600`">
                    <!-- Imagen principal con candidates -->
                    <img v-if="category.imageCandidates" :src="category.imageCandidates[0]"
                      :alt="`Imagen de ${category.name}`"
                      class="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                      loading="lazy" @error="handleImageError" />

                    <!-- Fallback icon con mejor diseño -->
                    <div v-else
                      class="w-[80px] h-[80px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                      <svg :class="emptyStateIconClasses" class="w-12 h-12" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <!-- Category Name -->
                <div class="flex flex-col items-center justify-center flex-1">
                  <h3 :class="textClasses"
                    class="mb-2 text-lg font-semibold text-center font-srProDisplay line-clamp-2">
                    {{ category.name }}
                  </h3>
                  <p :class="textSecondaryClasses" class="text-sm text-center">
                    {{ categoriesStore.getProductCount(category.id) }} {{ t('shop.product' +
                    (categoriesStore.getProductCount(category.id) === 1 ? '' : 's')) }}
                  </p>
                </div>
                <!-- View Button -->
                <div class="flex items-center justify-center mt-4">
                  <button @click="viewCategoryProducts(category.id)"
                    :class="`w-full py-2.5 px-4 rounded-md font-srProDisplay text-sm font-medium transition-colors ${buttonPrimaryClasses}`">
                    {{ t('catalog.viewProducts') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center space-x-2">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
              :class="`p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${hoverClasses}`">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <button v-for="page in Math.min(totalPages, 5)" :key="page" @click="goToPage(page)" :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                page === currentPage ? catalogPaginationActiveClasses : catalogPaginationButtonClasses,
              ]">
              {{ page }}
            </button>

            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
              :class="`p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${hoverClasses}`">
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

a:focus {
  outline: none;
  box-shadow: none;
}

svg:focus {
  outline: none;
  box-shadow: none;
}

/* Custom scrollbar for filter sections */
.overflow-y-auto::-webkit-scrollbar {
  width: 2px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #000;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #222;
}

/* Dark mode scrollbar */
@media (prefers-color-scheme: dark) {
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #374151;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #fff;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #e5e7eb;
  }
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>
