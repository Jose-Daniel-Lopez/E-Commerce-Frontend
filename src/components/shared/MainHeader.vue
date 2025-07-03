<template>
  <header
    :class="`fixed z-50 h-[82px] w-full bg-white shadow-md lg:sticky lg:left-0 lg:top-0 lg:transition-transform lg:duration-300 ${show}`">
    <Wrapper class="flex h-[82px] items-center justify-between py-4 md:gap-3 xl:gap-8">
      <!-- logo start -->
      <div class="w-[96px]">
        <router-link to="/">
          <img src="/images/logo_black.png" alt="logo" class="w-24 h-8" />
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
          :class="`fixed top-[81px] z-50 flex h-screen w-[250px] flex-col items-start justify-start gap-0 bg-[#f1f1f1] p-2 font-srProDisplay text-base font-medium text-black *:w-full lg:static lg:h-auto lg:w-auto lg:flex-row lg:items-center lg:justify-center lg:gap-3 lg:bg-transparent lg:p-0 lg:text-gray-400 *:lg:text-center ${showMobileMenu} duration-500 ease-linear lg:duration-0`">
          <li
            class="active block p-3 duration-300 hover:bg-blue-200 lg:p-0 hover:lg:bg-transparent hover:lg:text-black">
            <router-link to="/">{{ $t('nav.home') }}</router-link>
          </li>
          <li class="relative flex cursor-pointer items-center justify-between p-3 hover:bg-blue-200 lg:gap-[2px] lg:p-0 hover:lg:bg-transparent hover:lg:text-black">
            <div @click.stop="toggleCategoriesDropdown" class="flex items-center w-full">
              <span>Categorías</span>
              <svg
                class="w-4 h-4 ml-1 transition-transform duration-200"
                :class="{ 'rotate-180': showCategoriesDropdown }"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </div>

            <!-- Categories Dropdown -->
            <div
              v-show="showCategoriesDropdown"
              class="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100]"
              @click.stop
            >
              <div class="py-3">
                <div class="max-h-80 overflow-y-auto categories-scroll">
                  <div
                    v-for="category in categories"
                    :key="category.name"
                    @click="selectCategory(category)"
                    class="group flex items-center px-4 py-3 text-sm font-srProDisplay text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-gray-700"
                  >
                    <span class="flex-1 group-hover:text-gray-800 group-hover:font-medium transition-all duration-200">{{ category.name }}</span>
                    <svg class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-gray-700 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="block p-3 duration-300 hover:bg-blue-200 lg:p-0 hover:lg:bg-transparent hover:lg:text-black">
            <router-link to="/about" class="block">
              {{ $t('nav.about') }}
            </router-link>
          </li>
          <li class="block p-3 duration-300 hover:bg-blue-200 lg:p-0 hover:lg:bg-transparent hover:lg:text-black">
            <router-link to="/contact">{{ $t('nav.contact') }}</router-link>
          </li>
        </ul>
      </div>
      <!-- Navigation end -->

      <!-- icons start -->
      <div class="flex items-center gap-3">
        <!-- Language Selector -->
        <div class="hidden lg:block">
          <LanguageSelector />
        </div>
        <IconMenu @update-mobile-menu="setShowMobileMenu" @update-search-bar="setPositionSearchBar" />
      </div>
      <!-- icons end -->
    </Wrapper>

    <!-- Overlay removed as requested -->
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Wrapper from './Wrapper.vue'
import HeaderSearch from './HeaderSearch.vue'
import IconMenu from './IconMenu.vue'
import LanguageSelector from './LanguageSelector.vue'

const showMobileMenu = ref('left-[-300px]')
const positionSearchBar = ref('invisible opacity-0 top-[100px]')
const show = ref('lg:translate-y-0')
const lastScrollY = ref(0)

// Categories dropdown state
const showCategoriesDropdown = ref(false)

// Categories list with routes
const categories = [
  { name: 'Todas las categorías', route: '/catalog' },
  { name: 'Móviles', route: '/catalog/smartphones' },
  { name: 'Relojes inteligentes', route: '/catalog/smartwatches' },
  { name: 'Cámaras', route: '/catalog/cameras' },
  { name: 'Auriculares', route: '/catalog/headphones' },
  { name: 'Ordenadores', route: '/catalog/computers' },
  { name: 'Teclados', route: '/catalog/keyboards' },
  { name: 'Ratones', route: '/catalog/mice' },
  { name: 'Gaming', route: '/catalog/gaming' },
  { name: 'Tablets', route: '/catalog/tablets' },
  { name: 'Hogar inteligente', route: '/catalog/smart-home' },
  { name: 'Audio', route: '/catalog/audio' },
  { name: 'Accesorios', route: '/catalog/accessories' }
]

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

// Categories dropdown functions
const toggleCategoriesDropdown = () => {
  showCategoriesDropdown.value = !showCategoriesDropdown.value
}

const selectCategory = (category: { name: string; route: string }) => {
  showCategoriesDropdown.value = false
  // Navigate to the category route
  window.location.href = category.route
}

const closeCategoriesDropdown = () => {
  showCategoriesDropdown.value = false
}

const setShowMobileMenu = (value: string) => {
  showMobileMenu.value = value
}

const setPositionSearchBar = (value: string) => {
  positionSearchBar.value = value
}

onMounted(() => {
  window.addEventListener('scroll', controlNavbar)
  document.addEventListener('click', closeCategoriesDropdown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', controlNavbar)
  document.removeEventListener('click', closeCategoriesDropdown)
})
</script>

<style scoped>
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
  background: linear-gradient(to bottom, #1f2937, #111827);
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
