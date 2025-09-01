<template>
  <div
    v-if="show && suggestions.length > 0"
    class="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto"
    @click.stop
  >
    <!-- Recent Searches Header -->
    <div
      v-if="recentSearches.length > 0"
      class="px-4 py-2 bg-gray-50 border-b border-gray-100"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Recent Searches
        </span>
        <button
          @click="$emit('clearRecent')"
          class="text-xs text-gray-400 hover:text-gray-600"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Recent Searches -->
    <div
      v-for="(recent, index) in recentSearches.slice(0, 3)"
      :key="`recent-${index}`"
      @click="$emit('selectSuggestion', recent)"
      class="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
    >
      <div class="flex items-center gap-2">
        <v-icon name="fa-clock-o" scale="0.8" class="text-gray-400" />
        <span class="text-sm text-gray-700">{{ recent }}</span>
      </div>
    </div>

    <!-- Suggestions Header -->
    <div
      v-if="filteredSuggestions.length > 0"
      class="px-4 py-2 bg-gray-50 border-b border-gray-100"
    >
      <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">
        Popular Searches
      </span>
    </div>

    <!-- Search Suggestions -->
    <div
      v-for="(suggestion, index) in filteredSuggestions"
      :key="`suggestion-${index}`"
      @click="$emit('selectSuggestion', suggestion)"
      class="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
    >
      <div class="flex items-center gap-2">
        <v-icon name="fa-search" scale="0.8" class="text-gray-400" />
        <span class="text-sm text-gray-700">{{ suggestion }}</span>
      </div>
    </div>

    <!-- No Results -->
    <div
      v-if="filteredSuggestions.length === 0 && recentSearches.length === 0"
      class="px-4 py-3 text-center text-sm text-gray-500"
    >
      Start typing to see suggestions...
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// =======================
// 📋 Props & Emits
// =======================

interface Props {
  show: boolean
  query: string
  suggestions: string[]
  recentSearches: string[]
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  query: '',
  suggestions: () => [],
  recentSearches: () => []
})

defineEmits<{
  selectSuggestion: [suggestion: string]
  clearRecent: []
}>()

// =======================
// 🧮 Computed Properties
// =======================

/**
 * Filter suggestions based on the current query
 * Exclude recent searches to avoid duplicates
 */
const filteredSuggestions = computed(() => {
  const query = props.query.toLowerCase()
  return props.suggestions
    .filter(suggestion =>
      suggestion.toLowerCase().includes(query) &&
      !props.recentSearches.includes(suggestion)
    )
    .slice(0, 5) // Limit to 5 suggestions
})
</script>

<style scoped>
/* Custom scrollbar for the suggestions dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
