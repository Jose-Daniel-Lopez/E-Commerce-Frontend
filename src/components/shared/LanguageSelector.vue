<template>
  <div class="relative inline-block text-left">
    <button
      @click="toggleDropdown"
      class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <v-icon name="hi-globe" class="w-4 h-4 mr-2" />
      {{ currentLocale.code.toUpperCase() }}
      <v-icon name="hi-chevron-down" class="w-4 h-4 ml-2" />
    </button>

    <!-- Dropdown -->
    <div
      v-if="isDropdownOpen"
      class="absolute right-0 z-50 mt-2 w-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div class="py-1">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="changeLocale(locale.code)"
          class="flex items-center justify-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          :class="{ 'bg-gray-100 font-medium': locale.code === currentLocale.code }"
        >
          {{ locale.code.toUpperCase() }}
          <v-icon
            v-if="locale.code === currentLocale.code"
            name="hi-check"
            class="w-3 h-3 ml-2 text-green-500"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const { currentLocale, availableLocales, changeLanguage } = useLanguage()
const isDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const changeLocale = (newLocale: string) => {
  changeLanguage(newLocale)
  isDropdownOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
