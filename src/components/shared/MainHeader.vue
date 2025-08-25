<template>
  <header
    :class="`fixed z-50 h-[82px] w-full shadow-md border-b border-gray-600 lg:sticky lg:left-0 lg:top-0 lg:transition-transform lg:duration-300 ${show}`"
    :style="{ background: 'var(--header-bg)' }">
    <Wrapper class="flex h-[82px] items-center justify-between py-4 md:gap-3 xl:gap-8">
      <!-- logo start -->
      <div class="flex items-center justify-center lg:justify-start">
        <router-link to="/">
          <img :src="logoSrc" alt="logo" class="w-[180px] h-auto" />
        </router-link>
      </div>
      <!-- logo end -->

      <!-- search bar start -->
      <div
        :class="`fixed left-0 ${positionSearchBar} w-full duration-500 ease-linear lg:visible lg:static lg:block lg:w-[401px] lg:opacity-100 lg:duration-0`">
        <HeaderSearch />
      </div>
      <!-- search bar end -->

      <!-- Navigation start -->
      <div class="px-1 lg:w-[383px]">
        <ul
          :class="`fixed top-[81px] z-50 flex h-screen w-[250px] flex-col items-start justify-start gap-0 bg-white dark:bg-gray-900 p-2 font-srProDisplay text-base font-medium text-foreground *:w-full lg:static lg:h-auto lg:w-auto lg:flex-row lg:items-center lg:justify-center lg:gap-3 lg:bg-transparent lg:p-0 lg:text-muted *:lg:text-center ${showMobileMenu} duration-500 ease-linear lg:duration-0`">
          <li class="block p-3 duration-300 hover:bg-blue-200 lg:p-0 hover:lg:bg-transparent">
            <router-link to="/"
              class="transition-colors text-foreground hover:text-blue-600 dark:hover:text-blue-400">{{ $t('nav.home')
              }}</router-link>
          </li>
          <li
            class="relative flex cursor-pointer items-center justify-between p-3 hover:bg-blue-200 lg:gap-[2px] lg:p-0 hover:lg:bg-transparent hover:lg:text-foreground">
            <div @click.stop="toggleCategoriesDropdown" class="flex items-center w-full">
              <span>{{ $t('nav.categories') }}</span>
              <svg class="w-4 h-4 ml-1 transition-transform duration-200"
                :class="{ 'rotate-180': showCategoriesDropdown }" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </div>

            <!-- Categories Dropdown -->
            <div v-show="showCategoriesDropdown"
              class="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100]"
              @click.stop>
              <div class="py-3">
                <div class="overflow-y-auto max-h-80 categories-scroll">
                  <div v-for="category in categories" :key="category.name" @click="selectCategory(category)"
                    class="flex items-center px-4 py-3 text-sm text-gray-700 transition-all duration-200 border-l-4 border-transparent cursor-pointer group font-srProDisplay hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-700">
                    <span
                      class="flex-1 transition-all duration-200 group-hover:text-gray-800 group-hover:font-medium">{{
                      category.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="block p-3 duration-300 hover:bg-blue-200 lg:p-0 hover:lg:bg-transparent hover:lg:text-foreground">
            <router-link to="/about" class="block">
              {{ $t('nav.about') }}
            </router-link>
          </li>
          <li class="block p-3 duration-300 hover:bg-blue-200 lg:p-0 hover:lg:bg-transparent hover:lg:text-foreground">
            <router-link to="/contact">{{ $t('nav.contact') }}</router-link>
          </li>
        </ul>
      </div>
      <!-- Navigation end -->

      <!-- icons start -->
      <div class="flex items-center gap-3">
        <!-- DEBUG: TEMP: Theme Switcher for testing -->
        <select v-model="selectedTheme" @change="themeStore.setTheme(selectedTheme)"
          class="px-2 py-1 text-sm text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style="min-width: 90px;">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        <IconMenu @update-mobile-menu="setShowMobileMenu" @update-search-bar="setPositionSearchBar" />
      </div>
      <!-- icons end -->
    </Wrapper>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
// ...existing code...

// Theme store for temporary theme switcher
const themeStore = useThemeStore()
const { selectedTheme } = storeToRefs(themeStore)
if (themeStore.initializeTheme) themeStore.initializeTheme()
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Wrapper from './Wrapper.vue'
import HeaderSearch from './HeaderSearch.vue'
import IconMenu from './IconMenu.vue'

const router = useRouter()
const showMobileMenu = ref('left-[-300px]')
const positionSearchBar = ref('invisible opacity-0 top-[100px]')
const show = ref('lg:translate-y-0')
const lastScrollY = ref(0)

// Computed logo source — uses theme store selection, system preference, or document dark class
const logoSrc = computed(() => {
  const theme = selectedTheme?.value ?? 'light'
  const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const darkActive = document.documentElement.classList.contains('dark') || theme === 'dark' || (theme === 'system' && systemPrefersDark)
  return darkActive ? 'https://res.cloudinary.com/tejon-tech/image/upload/v1756151697/e-commerce/logo-full-white.webp' : 'https://res.cloudinary.com/tejon-tech/image/upload/v1756151699/e-commerce/logo-full.webp'
})

// Categories dropdown state
const showCategoriesDropdown = ref(false)

// Options for categories
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const categories = [
  { name: t('shop.categories.all'), route: '/catalog' },
  { name: 'All Products', route: '/catalog/all-products' },
  { name: t('shop.categories.smartphones'), route: '/catalog/smartphones' },
  { name: t('shop.categories.tablets'), route: '/catalog/tablets' },
  { name: t('shop.categories.laptops'), route: '/catalog/laptops' },
  { name: t('shop.categories.handhelds'), route: '/catalog/handhelds' },
  { name: t('shop.categories.keyboards'), route: '/catalog/keyboards' },
  { name: t('shop.categories.mice'), route: '/catalog/mice' },
  { name: t('shop.categories.controllers'), route: '/catalog/controllers' },
]

// Function to show/hide the categories dropdown
const toggleCategoriesDropdown = () => {
  showCategoriesDropdown.value = !showCategoriesDropdown.value
}

// Function to select a category and navigate
const selectCategory = (category: { name: string; route: string }) => {
  showCategoriesDropdown.value = false
  router.push(category.route)
}

// --- EVENT MANAGER ---

// Single function to close all dropdowns when clicking outside
const closeAllDropdowns = () => {
  showCategoriesDropdown.value = false
}

// --- FUNCTIONS ---

// Control the visibility of the navigation bar on scroll
const controlNavbar = () => {
  if (window.scrollY > 200) {
    if (window.scrollY > lastScrollY.value) {
      show.value = 'lg:translate-y-[-82px]'
    } else {
      show.value = 'shadow-md'
    }
  } else {
    show.value = 'lg:translate-y-0'
  }
  lastScrollY.value = window.scrollY
}

const setShowMobileMenu = (value: string) => {
  showMobileMenu.value = value
}

const setPositionSearchBar = (value: string) => {
  positionSearchBar.value = value
}

// --- LIFECYCLE HOOKS ---

onMounted(() => {
  window.addEventListener('scroll', controlNavbar)
  document.addEventListener('click', closeAllDropdowns)
})

onUnmounted(() => {
  window.removeEventListener('scroll', controlNavbar)
  document.removeEventListener('click', closeAllDropdowns)
})
</script>

<style scoped>
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

/* Categories dropdown custom scrollbar */
.categories-scroll::-webkit-scrollbar {
  width: 4px;
}

.categories-scroll::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 8px;
}

.categories-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #374151, #1f2937);
  border-radius: 8px;
}

.categories-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #1f2937, #0e1522);
}

/* Smooth transitions for dropdown */
.transition-transform {
  transition: transform 0.2s ease-in-out;
}

/* Prevent dropdown from being cut off */
.relative {
  position: relative;
}

/* Ensure dropdown appears above other elements */
.z-\[100\] {
  z-index: 100;
}

.z-\[90\] {
  z-index: 90;
}

/* Gradient hover effect */
.hover\:from-gray-50:hover {
  --tw-gradient-from: #f9fafb;
}

.hover\:to-gray-100:hover {
  --tw-gradient-to: #f3f4f6;
}

/* Border animation */
.border-l-4 {
  border-left-width: 4px;
}

/* Text color transitions */
.group-hover\:text-gray-800:hover {
  color: #1f2937;
}

.group-hover\:font-medium:hover {
  font-weight: 500;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group-hover\:text-gray-700 {
  transition: color 0.2s ease-in-out;
}

.group:hover .group-hover\:text-gray-700 {
  color: #374151;
}

/* Rounded corners enhancement */
.rounded-xl {
  border-radius: 0.75rem;
}
</style>
