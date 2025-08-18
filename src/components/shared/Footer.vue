<template>
  <footer class="mb-[66px] h-auto w-full bg-background text-foreground sm:mb-0 lg:h-[464px] transition-colors duration-200">
    <Wrapper class="flex h-auto flex-col gap-8 py-12 md:gap-6 md:px-[64px] lg:py-[104px]">
      <div
        class="flex h-auto w-full flex-col items-center justify-start gap-8 md:flex-row md:items-start lg:h-[216px] lg:justify-between">
        <div class="basis-auto text-center md:text-left lg:basis-[384px]">
          <router-link to="/" class="flex justify-center md:justify-start">
            <img src="/images/logo-full.webp" alt="logo"
              class="w-20 h-auto mb-4 transition-transform duration-200 hover:scale-105 invert" />
          </router-link>
          <div class="w-[295px] xl:w-full">
            <p class="text-base font-semibold font-srProDisplay">Location</p>
            <address class="h-[48px] font-srProDisplay text-sm font-light text-[#cfcfcf]">
              Head Office: Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </address>
            <h4 class="text-base font-medium font-srProDisplay">Email:</h4>
            <a href="mailto:webteam@tejontech.com"
              class="font-normal text-orange-400 transition-colors font-srProDisplay hover:text-orange-500">webteam@tejontech.com</a>
          </div>
        </div>
        <div
          class="flex basis-auto flex-col justify-between gap-8 text-center md:text-left lg:basis-[623px] lg:flex-row">
          <div class="max-w-[295px]">
            <h4 class="text-base font-medium font-srProDisplay">About Us</h4>
            <ul class="mt-2 font-srProDisplay text-sm font-light *:pb-2">
              <li>
                <router-link to="#" :class="footerLinkClasses">Payment Method</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'terms' }" :class="footerLinkClasses">Terms & Conditions</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'privacy' }" :class="footerLinkClasses">Privacy Policy</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'refund' }" :class="footerLinkClasses">Refund & Return Policy</router-link>
              </li>
              <li>
                <router-link to="#" :class="footerLinkClasses">About Us</router-link>
              </li>
              <li>
                <router-link to="#" :class="footerLinkClasses">Contact Us</router-link>
              </li>
            </ul>
          </div>
          <div class="max-w-[295px]">
            <h4 class="text-base font-medium font-srProDisplay">Support</h4>
            <div class="flex items-center justify-start p-2 mt-2 border border-gray-700 rounded-2xl">
              <div class="px-3 border-r">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div class="px-3">
                <p class="text-sm font-thin text-gray-300 font-srProDisplay">9AM - 8PM</p>
                <p class="font-semibold text-orange-400 font-srProDisplay">16744</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- footer social icon section start -->
      <div class="mx-auto mt-2 flex w-[173px] items-center justify-between md:mx-0 lg:h-[16px]">
          <SocialIcons :links="links" :link-class="footerLinkClasses" />
      </div>
      <!-- footer social icon section end -->
    </Wrapper>
  </footer>
</template>

<script setup lang="ts">
import Wrapper from './Wrapper.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import SocialIcons from './SocialIcons.vue'

const links = [
  { href: '#', label: 'Twitter', target: '_blank' as const },
  { href: '#', label: 'Facebook', target: '_blank' as const },
  { href: '#', label: 'GitHub', target: '_blank' as const },
]

// Define component name
defineOptions({
  name: 'AppFooter'
})

// Theme classes
const {
  footerLinkClasses
} = useThemeClasses()
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
