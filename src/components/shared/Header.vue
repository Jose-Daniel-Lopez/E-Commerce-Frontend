<template>
  <header
    :class="`fixed z-50 h-[82px] w-full bg-white shadow-md lg:sticky lg:left-0 lg:top-0 lg:transition-transform lg:duration-300 ${show}`"
  >
    <Wrapper class="flex h-[82px] items-center justify-between py-4 md:gap-3 xl:gap-8">
      <!-- logo start -->
      <div class="w-[96px]">
        <router-link to="/">
          <img
            src="/images/logo_black.png"
            alt="logo"
            class="w-24 h-8"
          />
        </router-link>
      </div>
      <!-- logo end -->

      <!-- search bar start -->
      <div
        :class="`fixed left-0 ${positionSearchBar} w-full duration-500 ease-linear lg:visible lg:static lg:block lg:w-[401px] lg:opacity-100 lg:duration-0`"
      >
        <HeaderSearch />
      </div>
      <!-- search bar end -->

      <!-- Navigation start -->
      <div class="px-1 lg:w-[383px]">
        <ul
          :class="`fixed top-[81px] z-50 flex h-screen w-[250px] flex-col items-start justify-start gap-0 bg-[#f1f1f1] p-2 font-srProDisplay text-base font-medium text-black *:w-full lg:static lg:h-auto lg:w-auto lg:flex-row lg:items-center lg:justify-center lg:gap-3 lg:bg-transparent lg:p-0 lg:text-gray-400 *:lg:text-center ${showMobileMenu} duration-500 ease-linear lg:duration-0`"
        >
          <li class="active block p-3 duration-300 hover:bg-blue-200 lg:p-0 hover:lg:bg-transparent hover:lg:text-black">
            <router-link to="/">Inicio</router-link>
          </li>
          <li class="flex items-center justify-between p-3 hover:bg-blue-200 lg:gap-[2px] lg:p-0 hover:lg:bg-transparent hover:lg:text-black">
            <router-link to="/categories" class="flex items-center w-full">
              <span>Categorias</span>
              <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </router-link>
          </li>
          <li class="block p-3 duration-300 hover:bg-blue-200 lg:p-0 hover:lg:bg-transparent hover:lg:text-black">
            <router-link to="/about">
              Acerca de
            </router-link>
          </li>
          <li class="block p-3 duration-300 hover:bg-blue-200 lg:p-0 hover:lg:bg-transparent hover:lg:text-black">
            <router-link to="/contact">Contáctanos</router-link>
          </li>
        </ul>
      </div>
      <!-- Navigation end -->

      <!-- icons start -->
      <IconMenu
        @update-mobile-menu="setShowMobileMenu"
        @update-search-bar="setPositionSearchBar"
      />
      <!-- icons end -->
    </Wrapper>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import Wrapper from './Wrapper.vue'
import HeaderSearch from './HeaderSearch.vue'
import IconMenu from './IconMenu.vue'

export default {
  name: 'Header',
  components: {
    Wrapper,
    HeaderSearch,
    IconMenu
  },
  setup() {
    const showMobileMenu = ref('left-[-300px]')
    const positionSearchBar = ref('invisible opacity-0 top-[100px]')
    const show = ref('lg:translate-y-0')
    const lastScrollY = ref(0)

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

    const setShowMobileMenu = (value) => {
      showMobileMenu.value = value
    }

    const setPositionSearchBar = (value) => {
      positionSearchBar.value = value
    }

    onMounted(() => {
      window.addEventListener('scroll', controlNavbar)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', controlNavbar)
    })

    return {
      showMobileMenu,
      positionSearchBar,
      show,
      setShowMobileMenu,
      setPositionSearchBar
    }
  }
}
</script>

<template>
  <header
    :class="`fixed z-50 h-[82px] w-full bg-white shadow-md lg:sticky lg:left-0 lg:top-0 lg:transition-transform lg:duration-300 ${show}`"
  >
    <Wrapper class="flex h-[82px] items-center justify-between py-4 md:gap-3 xl:gap-8">
      <!-- logo start -->
      <div class="w-[96px]">
        <router-link to="/">
          <img
            src="/images/logo_black.png"
            alt="logo"
            class="w-24 h-8"
          />
        </router-link>
      </div>
      <!-- logo end -->

      <!-- search bar start -->
      <div
        :class="`fixed left-0 ${positionSearchBar} w-full duration-500 ease-linear lg:visible lg:static lg:block lg:w-[401px] lg:opacity-100 lg:duration-0`"
      >
        <HeaderSearch />
      </div>
      <!-- search bar end -->

      <!-- Navigation start -->
      <div class="px-1 lg:w-[383px]">
        <ul
          :class="`fixed top-[81px] z-50 flex h-screen w-[250px] flex-col items-start justify-start gap-0 bg-[#f1f1f1] p-2 font-srProDisplay text-base font-medium text-black *:w-full lg:static lg:h-auto lg:w-auto lg:flex-row lg:items-center lg:justify-center lg:gap-3 lg:bg-transparent lg:p-0 lg:text-gray-400 *:lg:text-center ${showMobileMenu} duration-500 ease-linear lg:duration-0`"
        >
          <li class="active block p-3 duration-300 hover:bg-blue-200 lg:p-0 hover:lg:bg-transparent hover:lg:text-black">
            <router-link to="/">Inicio</router-link>
          </li>
          <li class="flex cursor-pointer items-center justify-between p-3 hover:bg-blue-200 lg:gap-[2px] lg:p-0 hover:lg:bg-transparent hover:lg:text-black">
            <router-link to="/categories">Categorias</router-link>
            <span>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </span>
          </li>
          <li class="block p-3 duration-300 hover:bg-blue-200 lg:p-0 hover:lg:bg-transparent hover:lg:text-black">
            <router-link to="/about" class="block">
              Acerca de
            </router-link>
          </li>
          <li class="block p-3 duration-300 hover:bg-blue-200 lg:p-0 hover:lg:bg-transparent hover:lg:text-black">
            <router-link to="/contact">Contáctanos</router-link>
          </li>
        </ul>
      </div>
      <!-- Navigation end -->

      <!-- icons start -->
      <IconMenu
        @update-mobile-menu="setShowMobileMenu"
        @update-search-bar="setPositionSearchBar"
      />
      <!-- icons end -->
    </Wrapper>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import Wrapper from './Wrapper.vue'
import HeaderSearch from './HeaderSearch.vue'
import IconMenu from './IconMenu.vue'

export default {
  name: 'Header',
  components: {
    Wrapper,
    HeaderSearch,
    IconMenu
  },
  setup() {
    const showMobileMenu = ref('left-[-300px]')
    const positionSearchBar = ref('invisible opacity-0 top-[100px]')
    const show = ref('lg:translate-y-0')
    const lastScrollY = ref(0)

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

    const setShowMobileMenu = (value) => {
      showMobileMenu.value = value
    }

    const setPositionSearchBar = (value) => {
      positionSearchBar.value = value
    }

    onMounted(() => {
      window.addEventListener('scroll', controlNavbar)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', controlNavbar)
    })

    return {
      showMobileMenu,
      positionSearchBar,
      show,
      setShowMobileMenu,
      setPositionSearchBar
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
