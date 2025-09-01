<template>
  <div class="relative search-container">
  <div :class="['flex items-center justify-start gap-2', sectionContainerClasses]">
      <v-icon name="fa-search" scale="1.2" :class="iconColorClasses" />

      <form @submit.prevent="performSearch" class="flex-1">
        <input
          v-model="searchQuery"
          :class="[catalogSearchInputClasses, 'bg-surface']"
          type="search"
          id="search"
          :placeholder="t('search.placeholder')"
          @keyup.enter="performSearch"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
      </form>

      <!-- Search Button (visible on focus or when there's text) -->
      <button
        v-if="searchQuery.trim() || isInputFocused"
        @click="performSearch"
        type="button"
        :class="[buttonPrimaryClasses, 'px-3 py-1 text-sm rounded-lg']"
        :disabled="!searchQuery.trim()"
      >
        {{ t('search.button') }}
      </button>
    </div>

    <!-- Enhanced Search Suggestions Component -->
    <SearchSuggestions
      :show="showSuggestions"
      :query="searchQuery"
      :suggestions="suggestions"
      :recent-searches="recentSearches"
      @select-suggestion="selectSuggestion"
      @clear-recent="clearRecentSearches"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SearchSuggestions from './SearchSuggestions.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// =======================
// State
// =======================

const searchQuery = ref('')
const isInputFocused = ref(false)
const showSuggestions = ref(false)
const suggestions = ref<string[]>([])
const recentSearches = ref<string[]>([])

// Theme-aware classes from composable
const { catalogSearchInputClasses, iconColorClasses, buttonPrimaryClasses, sectionContainerClasses } = useThemeClasses()

// =======================
// Constants
// =======================

const RECENT_SEARCHES_KEY = 'search-recent-queries'
const MAX_RECENT_SEARCHES = 5

const popularSuggestions = [
  'iPhone',
  'Samsung Galaxy',
  'MacBook',
  'AirPods',
  'iPad',
  'Apple Watch',
  'Gaming laptop',
  'Headphones',
  'Smartphone',
  'Tablet',
  'Gaming mouse',
  'Wireless earbuds',
  'Smart TV',
  'Cameras',
  'Smartwatch'
]

// =======================
// Methods
// =======================

/**
 * Simple debounce implementation
 */
const debounce = <T extends (...args: never[]) => void>(func: T, wait: number) => {
  let timeout: number | undefined
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = window.setTimeout(() => func(...args), wait)
  }
}

/**
 * Load recent searches from localStorage
 */
const loadRecentSearches = () => {
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (saved) {
      recentSearches.value = JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Failed to load recent searches:', error)
    recentSearches.value = []
  }
}

/**
 * Save recent searches to localStorage
 */
const saveRecentSearches = () => {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches.value))
  } catch (error) {
    console.warn('Failed to save recent searches:', error)
  }
}

/**
 * Add a search query to recent searches
 */
const addToRecentSearches = (query: string) => {
  const trimmedQuery = query.trim()
  if (!trimmedQuery || trimmedQuery.length < 2) return

  // Remove if it already exists
  const filtered = recentSearches.value.filter(item =>
    item.toLowerCase() !== trimmedQuery.toLowerCase()
  )

  // Add to beginning
  recentSearches.value = [trimmedQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES)
  saveRecentSearches()
}

/**
 * Clear all recent searches
 */
const clearRecentSearches = () => {
  recentSearches.value = []
  saveRecentSearches()
}

/**
 * Performs the main search and navigates to search results page
 */
const performSearch = async () => {
  const query = searchQuery.value.trim()
  if (!query) return

  console.log('🔍 [HeaderSearch] Performing search for:', query)

  // Add to recent searches
  addToRecentSearches(query)

  // Hide suggestions
  showSuggestions.value = false

  // Navigate to search results page
  try {
    await router.push({
      name: 'searchResults',
      query: {
        q: query,
        page: '1',
        sort: 'name,asc'
      }
    })
    console.log('🟢 [HeaderSearch] Navigation to search results successful')
  } catch (error) {
    console.error('🔴 [HeaderSearch] Navigation error:', error)
  }
}



/**
 * Selects a suggestion and performs search
 */
const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  showSuggestions.value = false
  performSearch()
}

/**
 * Handles input focus
 */
const handleInputFocus = () => {
  isInputFocused.value = true
  if (searchQuery.value.trim()) {
    fetchSuggestions(searchQuery.value)
  } else {
    // Show recent searches when focused with no query
    showSuggestions.value = recentSearches.value.length > 0
  }
}

/**
 * Handles input blur
 */
const handleInputBlur = () => {
  isInputFocused.value = false
  // Delay hiding suggestions to allow clicks
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

/**
 * Fetches search suggestions based on the query
 */
const fetchSuggestions = debounce(async (query: string) => {
  if (!query || query.length < 2) {
    suggestions.value = []
    showSuggestions.value = recentSearches.value.length > 0 && isInputFocused.value
    return
  }

  try {
    // Filter popular suggestions based on query
    const filteredSuggestions = popularSuggestions
      .filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 6)

    suggestions.value = filteredSuggestions
    showSuggestions.value = (filteredSuggestions.length > 0 || recentSearches.value.length > 0) && isInputFocused.value
  } catch (error) {
    console.error('🔴 [HeaderSearch] Error fetching suggestions:', error)
    suggestions.value = []
    showSuggestions.value = false
  }
}, 300)

// =======================
// Lifecycle & Effects
// =======================

onMounted(() => {
  // Load recent searches from localStorage
  loadRecentSearches()

  // Set search query from URL if we're on search results page
  if (route.name === 'searchResults' && route.query.q) {
    searchQuery.value = route.query.q as string
  }
})

onUnmounted(() => {
  // No cleanup needed as we removed manual event listeners
})

// Watch for input changes to show suggestions
watch(searchQuery, (newQuery) => {
  if (newQuery && newQuery.length >= 2 && isInputFocused.value) {
    fetchSuggestions(newQuery)
  } else if (newQuery === '' && isInputFocused.value) {
    suggestions.value = []
    showSuggestions.value = recentSearches.value.length > 0
  } else {
    suggestions.value = []
    showSuggestions.value = false
  }
})

// Watch route changes to update search query
watch(() => route.query.q, (newQuery) => {
  if (route.name === 'searchResults' && newQuery) {
    searchQuery.value = newQuery as string
  } else if (route.name !== 'searchResults') {
    // Don't clear search query when navigating to non-search pages
    // This allows users to navigate back and retain their search
  }
})
</script>

<style scoped>
/* Ensure the search container has relative positioning for absolute dropdown */
.search-container {
  position: relative;
}

/* Ensure suggestions dropdown appears above other content */
.search-container .absolute {
  z-index: 9999;
}
</style>
