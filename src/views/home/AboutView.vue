<template>
  <div class="home-page-layout" :class="pageBackgroundClasses">
    <Wrapper class="py-8">
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      <AboutHeroSection />
      <AboutValuesSection />
      <AboutFeaturedProducts />
      <AboutCtaSection :goToProducts="goToProducts" :contactUs="contactUs" />
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
/**
 * AboutView - Optimized according to Style Optimization Guide
 *
 * Key optimizations implemented:
 * ✅ Global layout utilities moved to base.css
 * ✅ Uses useThemeClasses composable for consistent theming
 * ✅ Performance optimized with global animation classes
 * ✅ Clean component structure
 */
import '@/assets/base.css'
import { useRouter } from 'vue-router'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import AboutHeroSection from '@/components/about/AboutHeroSection.vue'
import AboutValuesSection from '@/components/about/AboutValuesSection.vue'
import AboutFeaturedProducts from '@/components/about/AboutFeaturedProducts.vue'
import AboutCtaSection from '@/components/about/AboutCtaSection.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const router = useRouter()
const { pageBackgroundClasses } = useThemeClasses()
const breadcrumbs = [{ label: 'about.title' }]

const goToProducts = () => {
  router.push({ name: 'home' })
}
const contactUs = () => {
  router.push({ name: 'contact' })
}
</script>
