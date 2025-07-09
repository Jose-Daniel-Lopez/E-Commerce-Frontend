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

      <li class="flex h-[66px] cursor-pointer flex-col items-center justify-center border-r-0 group hover:bg-blue-50 sm:h-auto sm:border-none sm:hover:bg-transparent">
        <div class="relative">
          <router-link to="/wishlist">
            <img
              src="/images/Favorites.png"
              alt="favorites icon"
              class="w-8 h-8 group-hover:scale-120 group-hover:drop-shadow-md transition-all duration-200"
            />
            <span class="absolute -right-[3px] -top-[4px] rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
              99
            </span>
          </router-link>
        </div>
        <span class="mt-[-5px] font-srProDisplay text-sm font-medium sm:hidden group-hover:text-blue-600 transition-colors duration-200">
          Favorites
        </span>
      </li>

      <li class="flex h-[66px] cursor-pointer flex-col items-center justify-center border-r-0 group hover:bg-blue-50 sm:h-auto sm:border-none sm:hover:bg-transparent">
        <div class="relative">
          <router-link to="/cart">
            <img
              src="/images/Cart.png"
              alt="cart icon"
              class="w-8 h-8 group-hover:scale-120 group-hover:drop-shadow-md transition-all duration-200"
            />
            <span class="absolute -right-[6px] -top-[4px] rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
              99
            </span>
          </router-link>
        </div>
        <span class="mt-[-5px] font-srProDisplay text-sm font-medium sm:hidden group-hover:text-blue-600 transition-colors duration-200">
          Cart
        </span>
      </li>

      <li class="relative flex h-[66px] cursor-pointer flex-col items-center justify-center group hover:bg-blue-50 sm:hover:bg-transparent" @click.stop="toggleUserDropdown">
        <img
          src="/images/User.png"
          alt="user icon"
          class="w-8 h-8 group-hover:scale-120 group-hover:drop-shadow-md transition-all duration-200"
        />
        <span class="font-srProDisplay text-sm font-medium sm:hidden group-hover:text-blue-600 transition-colors duration-200">
          User
        </span>
        <!-- User Dropdown -->
        <div v-show="showUserDropdown" class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100]" @click.stop>
          <div class="py-3">
            <div class="max-h-80 overflow-y-auto categories-scroll">
              <div v-for="option in userOptions" :key="option.label" @click="selectUserOption(option)" class="group flex items-center px-4 py-3 text-sm font-srProDisplay text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-gray-700">
                <span class="flex-1 group-hover:text-gray-800 group-hover:font-medium transition-all duration-200">{{ option.label }}</span>
              </div>
            </div>
          </div>
        </div>
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

    // --- User Dropdown State and Logic ---
    const showUserDropdown = ref(false)
    const userOptions = [
      { label: 'Profile', hash: '#profile' },
      { label: 'My orders', hash: '#orders' },
      { label: 'Refunds and drawbacks', hash: '#refunds' },
      { label: 'My wishlist', hash: '#wishlist' },
      { label: 'My addresses', hash: '#addresses' },
      { label: 'My reviews', hash: '#reviews' },
      { label: 'Settings', hash: '#settings' }
    ]
    const toggleUserDropdown = () => {
      showUserDropdown.value = !showUserDropdown.value
    }
    const selectUserOption = (option) => {
      showUserDropdown.value = false
      // Navega a UserAccountView y hace scroll a la sección
      if (window.location.pathname !== '/account') {
        window.location.href = '/account' + option.hash
      } else {
        window.location.hash = option.hash
      }
    }
    // Cierra el dropdown al hacer click fuera
    if (typeof window !== 'undefined') {
      window.addEventListener('click', () => {
        showUserDropdown.value = false
      })
    }
    return {
      showMenu,
      showSearchBar,
      toggleMenu,
      toggleSearchBar,
      showUserDropdown,
      userOptions,
      toggleUserDropdown,
      selectUserOption
    }
  }
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
