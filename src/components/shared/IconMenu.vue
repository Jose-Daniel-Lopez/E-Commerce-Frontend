<template>
  <div class="flex w-[220px] items-center justify-end lg:block lg:w-[144px]">
    <ul
      class="fixed bottom-0 left-0 grid h-[66px] w-full grid-cols-4 items-center justify-between border-t-[1px] border-t-slate-100 bg-white sm:static sm:justify-end sm:gap-0 sm:bg-transparent lg:grid-cols-3"
    >
      <li
        class="flex h-[66px] cursor-pointer flex-col items-center justify-center border-r-0 hover:bg-blue-50 sm:h-auto sm:border-none sm:hover:bg-transparent lg:hidden"
        @click="toggleSearchBar"
      >
        <svg class="text-gray-500 w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span class="text-sm font-medium font-srProDisplay sm:hidden"> Search </span>
      </li>

      <li
        class="flex h-[66px] cursor-pointer flex-col items-center justify-center border-r-0 group hover:bg-blue-50 sm:h-auto sm:border-none sm:hover:bg-transparent"
      >
        <div class="relative">
          <router-link to="/wishlist" class="relative flex items-center justify-center">
            <v-icon
              name="hi-heart"
              scale="1.7"
              class="text-gray-600 transition-all duration-200 group-hover:text-pink-500 group-hover:scale-110 group-hover:drop-shadow-md"
              aria-label="Favorites"
            />
            <span
              v-if="wishlistCount > 0"
              class="absolute -right-[3px] -top-[4px] rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white shadow-md min-w-[18px] text-center"
            >
              {{ wishlistCount }}
            </span>
          </router-link>
        </div>
        <span
          class="mt-[-5px] font-srProDisplay text-sm font-medium sm:hidden group-hover:text-blue-600 transition-colors duration-200"
        >
          Favorites
        </span>
      </li>

      <li
        class="flex h-[66px] cursor-pointer flex-col items-center justify-center border-r-0 group hover:bg-blue-50 sm:h-auto sm:border-none sm:hover:bg-transparent"
      >
        <div class="relative">
          <router-link to="/cart" class="relative flex items-center justify-center">
            <v-icon
              name="hi-shopping-cart"
              scale="1.7"
              class="text-gray-600 transition-all duration-200 group-hover:text-blue-600 group-hover:scale-110 group-hover:drop-shadow-md"
              aria-label="Cart"
            />
            <span
              class="absolute -right-[6px] -top-[4px] rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white shadow-md"
            >
              {{ totalQuantity }}
            </span>
          </router-link>
        </div>
        <span
          class="mt-[-5px] font-srProDisplay text-sm font-medium sm:hidden group-hover:text-blue-600 transition-colors duration-200"
        >
          Cart
        </span>
      </li>

      <li
        class="relative flex h-[66px] cursor-pointer flex-col items-center justify-center group hover:bg-blue-50 sm:hover:bg-transparent"
        @click.stop="toggleUserDropdown"
      >
        <UserAvatar
          :show-status="true"
          :icon-scale="1.7"
        />
        <span
          class="text-sm font-medium transition-colors duration-200 font-srProDisplay sm:hidden group-hover:text-blue-600"
        >
          {{ isAuthenticated ? 'Account' : 'User' }}
        </span>
        <!-- User Dropdown -->
        <div
          v-show="showUserDropdown"
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] sm:top-full sm:bottom-auto sm:mt-2 sm:mb-0"
          @click.stop
        >
          <div class="py-3">
            <div class="overflow-y-auto max-h-80 categories-scroll">
              <div
                v-for="option in userOptions"
                :key="option.label"
                @click="selectUserOption(option)"
                class="flex items-center px-4 py-3 text-sm transition-all duration-200 border-l-4 border-transparent cursor-pointer group font-srProDisplay"
                :class="
                  option.isLogout
                    ? 'text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-500'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-700'
                "
              >
                <span
                  class="flex-1 transition-all duration-200 group-hover:font-medium"
                  :class="
                    option.isLogout ? 'group-hover:text-red-700' : 'group-hover:text-gray-800'
                  "
                >
                  {{ option.label }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <li class="block cursor-pointer lg:hidden">
      <div
        class="flex items-center justify-center duration-300 ease-in-out h-9 w-9"
        @click="toggleMenu"
      >
        <svg
          v-if="!showMenu"
          class="w-8 h-8 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          class="text-black w-9 h-9"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </li>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useUserDropdown } from '@/composables/useUserDropdown'
import { storeToRefs } from 'pinia'
import { useUserCartStore } from '@/stores/userCart'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAuthStore } from '@/stores/auth'
import UserAvatar from './UserAvatar.vue'

const emit = defineEmits(['update-mobile-menu', 'update-search-bar'])

const showMenu = ref(false)
const showSearchBar = ref(false)

// Auth store for authentication status
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const toggleSearchBar = () => {
  showSearchBar.value = !showSearchBar.value
}

// Watch for menu changes
watch(showMenu, (newValue) => {
  if (newValue) {
    emit('update-mobile-menu', 'left-0')
    emit('update-search-bar', 'invisible opacity-0 top-[100px]')
    showSearchBar.value = false
  } else {
    emit('update-mobile-menu', 'left-[-300px]')
  }
})

// Watch for search bar changes
watch(showSearchBar, (newValue) => {
  if (newValue) {
    emit('update-search-bar', 'visible opacity-100 top-[81px]')
    emit('update-mobile-menu', 'left-[-300px]')
    showMenu.value = false
  } else {
    emit('update-search-bar', 'invisible opacity-0 top-[100px]')
  }
})

// Use the user dropdown composable
const { showUserDropdown, userOptions, toggleUserDropdown, selectUserOption } = useUserDropdown()

// User cart store
const userCartStore = useUserCartStore()
const { totalQuantity } = storeToRefs(userCartStore)

// Wishlist store
const wishlistStore = useWishlistStore()
const { count: wishlistCount } = storeToRefs(wishlistStore)

// Close dropdown when clicking outside
if (typeof window !== 'undefined') {
  window.addEventListener('click', () => {
    showUserDropdown.value = false
  })
}
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
</style>
