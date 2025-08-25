<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import { useCategoriesStore } from '@/stores/categories'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { getCategoryImage } from '@/composables/useCloudinaryImages'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'

/**
 * === Dependencies & Composables ===
 * We initialize essential composables and stores here.
 * These provide routing, internationalization, state, and UI theming.
 */
const router = useRouter()
const categoriesStore = useCategoriesStore()
const { t } = useLanguage()

// Theme utility: Centralizes all UI class bindings for consistent design
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

/**
 * === 🧠 Reactive State Management ===
 * All user-driven and application state is declared here.
 * Grouped by purpose for clarity.
 */

// Pagination & sorting
const currentPage = ref(1)
const sortBy = ref('name')
const searchQuery = ref('')

// Filter options derived from store data
const categoryTypes = ref<
  Array<{ name: string; originalName: string; count: number; checked: boolean }>
>([])

// Mobile UX controls
const showMobileFilters = ref(false)
const showMobileSorting = ref(false)

// Accordion-style filter collapse states (desktop & mobile)
const collapsedFilters = ref({
  search: false,
  productCount: false,
  alphabetical: false,
})

/**
 * === Computed Properties ===
 * Derived state for filtering, sorting, pagination, and display.
 * These automatically update when dependencies change.
 */

// Number of categories per page (consistent across app)
const itemsPerPage = 12

// Apply search, type filters, and sorting to category list
const filteredCategories = computed(() => {
  let result = [...categoriesStore.categories]

  // 🔎 Filter by search query (case-insensitive substring match)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(category =>
      category.name.toLowerCase().includes(query)
    )
  }

  // Filter by selected category types (only checked ones)
  const selectedTypes = categoryTypes.value
    .filter(type => type.checked)
    .map(type => type.originalName)

  if (selectedTypes.length > 0) {
    result = result.filter(category => selectedTypes.includes(category.name))
  }

  // 🔤 Sort based on user preference
  switch (sortBy.value) {
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'products-high':
      result.sort(
        (a, b) => categoriesStore.getProductCount(b.id) - categoriesStore.getProductCount(a.id)
      )
      break
    case 'products-low':
      result.sort(
        (a, b) => categoriesStore.getProductCount(a.id) - categoriesStore.getProductCount(b.id)
      )
      break
  }

  return result
})

// Paginate the filtered results
const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCategories.value.slice(start, end)
})

// Total number of pages for pagination UI
const totalPages = computed(() => Math.ceil(filteredCategories.value.length / itemsPerPage))

// Breadcrumb navigation (supports translation and routing)
const breadcrumbs = computed(() => [
  { label: 'catalog.title', to: '/catalog' }
])

/**
 * === 🧰 Utility Functions ===
 * Reusable helpers for filtering, translation, and image handling.
 */

// Check if any filter (search or type) is active
const hasActiveFilters = () => {
  const searchActive = searchQuery.value.trim().length > 0
  const typeFiltersActive = categoryTypes.value.some(type => type.checked)
  return searchActive || typeFiltersActive
}

// Reset all filters and UI state
const clearAllFilters = () => {
  searchQuery.value = ''
  categoryTypes.value.forEach(type => (type.checked = false))
  currentPage.value = 1
  showMobileFilters.value = false
}

// Remove accents from strings for robust i18n key matching
const removeAccents = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ -]/g, '')

// Translate category names with fallback to unaccented keys
const translateCategoryName = (categoryName: string): string => {
  const normalizedName = categoryName.toLowerCase()
  const translationKey = `shop.categories.${normalizedName}`
  let translated = t(translationKey)
  if (translated !== translationKey) return translated

  // Fallback: try without accents
  const unaccented = removeAccents(normalizedName)
  const translationKeyUnaccented = `shop.categories.${unaccented}`
  translated = t(translationKeyUnaccented)
  if (translated !== translationKeyUnaccented) return translated

  // Final fallback: return original name
  return categoryName
}

// Generate optimized category image URL using Cloudinary
const getCategoryImageUrl = (categoryName: string): string => {
  // Use the Cloudinary helper for category images
  return getCategoryImage(categoryName, { width: 160, height: 160, quality: 'auto' })
}

// Enhanced paginated categories with translated names and image candidates
const translatedPaginatedCategories = computed(() =>
  paginatedCategories.value.map(category => ({
    ...category,
    name: translateCategoryName(category.name),
    imageCandidates: [getCategoryImageUrl(category.name)], // Single optimized URL
  }))
)

/**
 * === Lifecycle & Initialization ===
 * Load data and initialize filter options when component mounts.
 */
onMounted(async () => {
  await categoriesStore.fetchCategories()
  // Initialize filter checkboxes with translated names and product counts
  categoryTypes.value = categoriesStore.categories.map(category => ({
    name: translateCategoryName(category.name),
    originalName: category.name,
    count: categoriesStore.getProductCount(category.id),
    checked: false,
  }))
})

/**
 * === 🛠️ Event Handlers & Methods ===
 * Functions triggered by user interaction.
 */

// Handle image loading failure by showing fallback
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  
  // Hide the failed image and show fallback UI
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    parent.innerHTML = `
      <div class="w-[80px] h-[80px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
        </svg>
      </div>
    `
  }
}

// Navigate to category page with URL-safe name
const viewCategoryProducts = (categoryId: number) => {
  const category = categoriesStore.categories.find(cat => cat.id === categoryId)
  if (category) {
    const categoryName = category.name
      .toLowerCase()
      .replace(/\s+/g, '-') // Spaces → dashes
      .replace(/[^\w-]+/g, '') // Remove special chars
      .replace(/--+/g, '-') // Multiple dashes → single
      .replace(/^-+/, '') // Trim start
      .replace(/-+$/, '') // Trim end

    router.push(`/catalog/${categoryName}`).catch(error => {
      console.error('Error navigating to category:', error)
    })
  }
}

// Change page and scroll to top on mobile for better UX
const goToPage = (page: number) => {
  currentPage.value = Math.max(1, Math.min(page, totalPages.value))
  if (window.innerWidth < 768) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Toggle visibility of a filter section (accordion)
const toggleFilter = (filterName: keyof typeof collapsedFilters.value) => {
  collapsedFilters.value[filterName] = !collapsedFilters.value[filterName]
}

// Clear only the category type filters (used in desktop UI)
const clearTypeFilters = () => {
  categoryTypes.value.forEach(type => (type.checked = false))
}

/**
 * === Watchers ===
 * Automatically reset pagination when filters change.
 */
watch(searchQuery, () => {
  currentPage.value = 1
})

watch(
  categoryTypes,
  () => {
    currentPage.value = 1
  },
  { deep: true }
)
</script>

<template>
  <!-- Main container with theme background -->
  <div :class="pageBackgroundClasses" class="min-h-screen">
    <!-- Breadcrumb Navigation -->
    <div :class="pageBackgroundClasses" class="pt-[85px] lg:pt-0">
      <div class="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      </div>
    </div>

    <!-- Main content area -->
    <div class="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-8">
      <!-- Mobile Layout -->
      <div class="lg:hidden">
        <div class="mb-6">
          <!-- Mobile Header -->
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 :class="['text-lg font-semibold font-srProDisplay sm:text-xl', textClasses]">
                {{ t('catalog.title') }}
              </h1>
              <p :class="['text-sm font-srProDisplay', textSecondaryClasses]">
                {{ filteredCategories.length }} {{ filteredCategories.length === 1 ? t('catalog.category') : t('catalog.categories') }}
              </p>
            </div>
          </div>

          <!-- Mobile Filter & Sort Buttons -->
          <div class="flex gap-3 mb-4">
            <button
              @click="showMobileFilters = !showMobileFilters"
              :class="[
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[48px]',
                showMobileFilters ? buttonPrimaryClasses : `${pageBackgroundClasses} ${textSecondaryClasses} ${hoverClasses}`
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              <span v-if="hasActiveFilters()" class="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                Active
              </span>
            </button>

            <button
              @click="showMobileSorting = !showMobileSorting"
              :class="`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium min-h-[48px] ${pageBackgroundClasses} ${textSecondaryClasses} ${hoverClasses}`"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 5v6m0 0V9a2 2 0 012-2h4a2 2 0 012 2v2M8 11l4 4 4-4" />
              </svg>
              Sort
            </button>
          </div>

          <!-- Mobile Filters Panel -->
          <div v-if="showMobileFilters" :class="catalogMobileFilterClasses">
            <!-- Search -->
            <div>
              <h3 :class="catalogFilterTitleClasses" class="mb-3 text-base font-semibold font-srProDisplay">
                {{ t('catalog.searchCategories') }}
              </h3>
              <div :class="`flex items-center gap-2 ${pageBackgroundClasses} p-3 rounded-lg border border-gray-200 dark:border-gray-600`">
                <v-icon name="fa-search" scale="1" :class="textSecondaryClasses" />
                <input
                  v-model="searchQuery"
                  :class="`flex-1 bg-transparent text-sm outline-none ${textClasses}`"
                  type="search"
                  :placeholder="t('catalog.searchPlaceholder')"
                />
              </div>
            </div>

            <!-- Category Types -->
            <div v-if="categoryTypes.length > 0">
              <h3 :class="catalogFilterTitleClasses" class="mb-3 text-base font-semibold font-srProDisplay">
                {{ t('catalog.types') }}
              </h3>
              <div class="grid grid-cols-1 gap-3 overflow-y-auto max-h-48">
                <label
                  v-for="type in categoryTypes.slice(0, 12)"
                  :key="type.name"
                  :class="`flex items-center justify-between gap-2 ${pageBackgroundClasses} p-3 rounded text-sm cursor-pointer ${hoverClasses}`"
                >
                  <div class="flex items-center gap-2">
                    <input type="checkbox" v-model="type.checked" :class="catalogCheckboxClasses" />
                    <span :class="catalogFilterLabelClasses" class="font-medium">{{ type.name }}</span>
                  </div>
                  <span :class="textSecondaryClasses" class="text-xs font-medium">{{ type.count }}</span>
                </label>
              </div>
            </div>

            <!-- Clear & Apply -->
            <div v-if="hasActiveFilters()" class="flex gap-3">
              <button
                @click="clearAllFilters"
                class="flex-1 py-2 text-sm text-red-600 transition-colors border border-red-200 rounded-lg dark:text-red-400 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Clear All
              </button>
              <button
                @click="showMobileFilters = false"
                :class="`flex-1 py-2 text-sm rounded-lg transition-colors ${buttonPrimaryClasses}`"
              >
                Apply Filters
              </button>
            </div>
          </div>

          <!-- Mobile Sort Options -->
          <div v-if="showMobileSorting"
            :class="`${pageBackgroundClasses} border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden mb-4`">
            <button
              v-for="option in [
                { value: 'name', label: t('catalog.sort.nameAZ') },
                { value: 'name-desc', label: t('catalog.sort.nameZA') },
                { value: 'products-high', label: t('catalog.sort.mostProducts') },
                { value: 'products-low', label: t('catalog.sort.leastProducts') }
              ]"
              :key="option.value"
              @click="sortBy = option.value; showMobileSorting = false"
              :class="[
                `w-full px-4 py-3 text-left text-sm ${hoverClasses} transition-colors min-h-[48px] flex items-center`,
                sortBy === option.value ? `bg-gray-100 dark:bg-gray-700 font-medium ${textClasses}` : textClasses
              ]"
            >
              {{ option.label }}
              <svg v-if="sortBy === option.value" :class="`w-5 h-5 ml-auto ${textClasses}`" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Categories Grid -->
        <div class="w-full">
          <!-- Loading -->
          <div v-if="categoriesStore.loading" class="flex items-center justify-center py-12">
            <div class="w-12 h-12 border-b-2 rounded-full animate-spin border-emerald-500"></div>
            <span :class="loadingTextClasses" class="ml-3">{{ t('shop.loadingCategories') }}</span>
          </div>

          <!-- Error -->
          <div v-else-if="categoriesStore.error"
            class="flex items-center justify-center px-4 py-3 mb-8 space-x-2 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900/30 dark:border-red-600 dark:text-red-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            <span>{{ categoriesStore.error }}</span>
          </div>

          <!-- Empty -->
          <div v-else-if="filteredCategories.length === 0" class="py-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="p-6 bg-gray-100 rounded-full dark:bg-gray-800">
                <svg :class="emptyStateIconClasses" class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <!-- Grid -->
          <div v-else class="grid grid-cols-2 gap-4 mb-8">
            <div
              v-for="category in translatedPaginatedCategories"
              :key="category.id"
              @click="viewCategoryProducts(category.id)"
              role="link"
              :aria-label="`View ${category.name}`"
              tabindex="0"
              @keyup.enter="viewCategoryProducts(category.id)"
              :class="`relative rounded-lg p-3 transition-shadow flex flex-col cursor-pointer ${catalogProductCardClasses}`"
            >
              <!-- Card content -->
              <div class="flex flex-col h-full">
                <!-- Image -->
                <div class="flex items-center justify-center mb-3">
                  <div
                    :class="`h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] ${pageBackgroundClasses} rounded-xl flex items-center justify-center shadow-sm overflow-hidden relative border border-gray-200 dark:border-gray-600`">
                    <img
                      v-if="category.imageCandidates"
                      :src="category.imageCandidates[0]"
                      :alt="`Imagen de ${category.name}`"
                      class="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      @error="handleImageError"
                    />
                    <div v-else
                      class="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                      <svg :class="emptyStateIconClasses" class="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Name & Count -->
                <div class="flex flex-col items-center justify-center flex-1 mb-3 text-center">
                  <h3 :class="textClasses" class="mb-1 text-sm font-semibold font-srProDisplay sm:text-base line-clamp-2">
                    {{ category.name }}
                  </h3>
                  <p :class="textSecondaryClasses" class="text-xs sm:text-sm">
                    {{ categoriesStore.getProductCount(category.id) }} {{ t('shop.product' + (categoriesStore.getProductCount(category.id) === 1 ? '' : 's')) }}
                  </p>
                </div>

                <!-- Action Button -->
                <button
                  @click.stop="viewCategoryProducts(category.id)"
                  :class="`w-full py-2 px-3 rounded-md font-srProDisplay text-xs sm:text-sm font-medium transition-colors ${buttonPrimaryClasses}`"
                >
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

      <!-- Desktop Layout -->
      <div class="hidden gap-8 lg:flex">
        <!-- Sidebar -->
        <div class="flex-shrink-0 w-64">
          <!-- Search Filter -->
          <div :class="catalogFilterSectionClasses" class="mb-6">
            <div :class="catalogFilterHeaderClasses">
              <h3 :class="catalogFilterTitleClasses" class="text-lg font-semibold font-srProDisplay">
                {{ t('catalog.searchCategories') }}
              </h3>
              <button @click="toggleFilter('search')" :class="`p-1 rounded transition-colors ${hoverClasses}`" aria-label="Toggle search">
                <svg :class="`w-4 h-4 ${textSecondaryClasses} transition-transform duration-200 ${collapsedFilters.search ? 'rotate-180' : ''}`"
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
                  type="search" :placeholder="t('catalog.searchPlaceholder')" />
              </div>
            </div>
          </div>

          <!-- Category Types -->
          <div :class="catalogFilterSectionClasses" class="mb-6">
            <div :class="catalogFilterHeaderClasses">
              <h3 :class="catalogFilterTitleClasses" class="text-lg font-semibold font-srProDisplay">
                {{ t('catalog.types') }}
              </h3>
              <div class="flex items-center space-x-2">
                <button v-if="categoryTypes.some((type) => type.checked)" @click="clearTypeFilters"
                  :class="catalogClearFilterClasses" class="text-xs transition-colors" :title="t('catalog.clearFilters')">
                  {{ t('catalog.clearFilters') }}
                </button>
                <button @click="toggleFilter('productCount')" :class="`p-1 rounded transition-colors ${hoverClasses}`" aria-label="Toggle product count">
                  <svg :class="`w-4 h-4 ${textSecondaryClasses} transition-transform duration-200 ${collapsedFilters.productCount ? 'rotate-180' : ''}`"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div v-show="!collapsedFilters.productCount" class="transition-all duration-200">
              <div class="space-y-3 overflow-y-auto max-h-64">
                <div v-for="type in categoryTypes" :key="type.name" class="flex items-center">
                  <input :id="'type-' + type.name" type="checkbox" v-model="type.checked" :class="catalogCheckboxClasses" class="focus:ring-1 focus:ring-gray-400" />
                  <label :for="'type-' + type.name" class="flex items-center justify-between flex-1 ml-3">
                    <span :class="catalogFilterLabelClasses" class="text-sm font-srProDisplay">{{ type.name }}</span>
                    <span :class="textSecondaryClasses" class="pr-4 text-xs font-srProDisplay">{{ type.count }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="p-4 mb-6 transition-colors duration-200 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
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

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 :class="textClasses" class="text-xl font-semibold font-srProDisplay">{{ t('catalog.title') }}</h1>
              <p :class="textSecondaryClasses" class="font-srProDisplay">
                {{ filteredCategories.length }} {{ filteredCategories.length === 1 ? t('catalog.category') : t('catalog.categories') }}
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

          <!-- Loading / Error / Empty States -->
          <div v-if="categoriesStore.loading" class="flex items-center justify-center py-12">
            <div class="w-12 h-12 border-b-2 rounded-full animate-spin border-emerald-500"></div>
            <span :class="loadingTextClasses" class="ml-3">{{ t('shop.loadingCategories') }}</span>
          </div>
          <div v-else-if="categoriesStore.error" class="flex items-center justify-center px-4 py-3 mb-8 space-x-2 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900/30 dark:border-red-600 dark:text-red-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ categoriesStore.error }}</span>
          </div>
          <div v-else-if="filteredCategories.length === 0" class="py-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="p-6 bg-gray-100 rounded-full dark:bg-gray-800">
                <svg :class="emptyStateIconClasses" class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h3 :class="textClasses" class="mb-2 text-xl font-semibold">{{ t('catalog.noCategoriesFound') }}</h3>
            <p :class="emptyStateTextClasses">{{ t('catalog.noCategoriesMatch') }}</p>
          </div>

          <!-- Categories Grid -->
          <div v-else class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="category in translatedPaginatedCategories"
              :key="category.id"
              @click="viewCategoryProducts(category.id)"
              role="link"
              :aria-label="`View ${category.name}`"
              tabindex="0"
              @keyup.enter="viewCategoryProducts(category.id)"
              :class="`relative h-auto rounded-[9px] px-3 py-6 duration-500 hover:scale-[1.02] hover:shadow-md md:h-[435px] md:px-4 flex flex-col cursor-pointer ${catalogProductCardClasses}`"
            >
              <div class="flex flex-col h-full">
                <!-- Image -->
                <div class="flex items-center justify-center mb-4">
                  <div :class="`h-[160px] w-[160px] ${pageBackgroundClasses} rounded-xl flex items-center justify-center shadow-sm overflow-hidden relative border border-gray-200 dark:border-gray-600`">
                    <img
                      v-if="category.imageCandidates"
                      :src="category.imageCandidates[0]"
                      :alt="`Imagen de ${category.name}`"
                      class="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      @error="handleImageError"
                    />
                    <div v-else class="w-[80px] h-[80px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                      <svg :class="emptyStateIconClasses" class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <!-- Name & Count -->
                <div class="flex flex-col items-center justify-center flex-1">
                  <h3 :class="textClasses" class="mb-2 text-lg font-semibold text-center font-srProDisplay line-clamp-2">
                    {{ category.name }}
                  </h3>
                  <p :class="textSecondaryClasses" class="text-sm text-center">
                    {{ categoriesStore.getProductCount(category.id) }} {{ t('shop.product' + (categoriesStore.getProductCount(category.id) === 1 ? '' : 's')) }}
                  </p>
                </div>
                <!-- Action Button -->
                <div class="flex items-center justify-center mt-4">
                  <button
                    @click.stop="viewCategoryProducts(category.id)"
                    :class="`w-full py-2.5 px-4 rounded-md font-srProDisplay text-sm font-medium transition-colors ${buttonPrimaryClasses}`"
                  >
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
            <button
              v-for="page in Math.min(totalPages, 5)"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                page === currentPage ? catalogPaginationActiveClasses : catalogPaginationButtonClasses,
              ]"
            >
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
/* Remove default outline for better visual control */
button:focus, a:focus, svg:focus {
  outline: none;
  box-shadow: none;
}

/* Custom scrollbar for filter lists */
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

/* Text truncation utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>
