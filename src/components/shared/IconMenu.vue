<template>
  <div class="flex w-[220px] items-center justify-end lg:block lg:w-[144px]">
    <ul class="fixed bottom-0 left-0 grid h-[66px] w-full grid-cols-4 items-center justify-between border-t-[1px] border-t-slate-100 bg-white sm:static sm:justify-end sm:gap-0 sm:bg-transparent lg:grid-cols-3">
      <li
        class="flex h-[66px] cursor-pointer flex-col items-center justify-center border-r-0 hover:bg-blue-50 sm:h-auto sm:border-none sm:hover:bg-transparent lg:hidden"
        @click="toggleSearchBar"
      >
        <svg class="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="font-srProDisplay text-sm font-medium sm:hidden">
          Search
        </span>
      </li>

      <li class="flex h-[66px] cursor-pointer flex-col items-center justify-center border-r-0 hover:bg-blue-50 sm:h-auto sm:border-none sm:hover:bg-transparent">
        <div class="relative">
          <router-link to="/wishlist">
            <img
              src="/images/Favorites.png"
              alt="favorites icon"
              class="w-8 h-8"
            />
            <span class="absolute -right-[3px] -top-[4px] rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
              99
            </span>
          </router-link>
        </div>
        <span class="mt-[-5px] font-srProDisplay text-sm font-medium sm:hidden">
          Favorites
        </span>
      </li>

      <li class="flex h-[66px] cursor-pointer flex-col items-center justify-center border-r-0 hover:bg-blue-50 sm:h-auto sm:border-none sm:hover:bg-transparent">
        <div class="relative">
          <router-link to="/cart">
            <img
              src="/images/Cart.png"
              alt="cart icon"
              class="w-8 h-8"
            />
            <span class="absolute -right-[6px] -top-[4px] rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
              99
            </span>
          </router-link>
        </div>
        <span class="mt-[-5px] font-srProDisplay text-sm font-medium sm:hidden">
          Cart
        </span>
      </li>

      <li class="flex h-[66px] cursor-pointer flex-col items-center justify-center hover:bg-blue-50 sm:hover:bg-transparent">
        <img
          src="/images/User.png"
          alt="user icon"
          class="w-8 h-8"
        />
        <span class="font-srProDisplay text-sm font-medium sm:hidden">
          User
        </span>
      </li>
    </ul>
    <li class="block cursor-pointer lg:hidden">
      <div
        class="flex h-9 w-9 items-center justify-center duration-300 ease-in-out"
        @click="toggleMenu"
      >
        <svg
          v-if="!showMenu"
          class="w-8 h-8 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg
          v-else
          class="w-9 h-9 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </li>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'IconMenu',
  emits: ['update-mobile-menu', 'update-search-bar'],
  setup(props, { emit }) {
    const showMenu = ref(false)
    const showSearchBar = ref(false)

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

    return {
      showMenu,
      showSearchBar,
      toggleMenu,
      toggleSearchBar
    }
  }
}
</script>
