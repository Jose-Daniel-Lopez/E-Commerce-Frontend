<template>
  <div class="home-page-layout" :class="pageBackgroundClasses">


    <!-- hero section -->
    <HeroSection />

    <!-- browse category section -->
    <BrowseCategorySection />

    <!-- products section -->
    <ProductsSection />

    <!-- banner section one -->
    <BannerSectionOne />

    <!-- banner section two -->
    <BannerSection />

    <!-- discount products section -->
    <DiscountProductSection />
  </div>
</template>

<script setup lang="ts">
/**
 * HomeView - Optimized according to Style Optimization Guide
 *
 * Key optimizations implemented:
 * ✅ Global layout utilities moved to base.css
 * ✅ Uses useThemeClasses composable for consistent theming
 * ✅ Performance optimized with global animation classes
 * ✅ Clean separation of concerns
 */
import '@/assets/base.css'
import { useThemeClasses } from '@/composables/useThemeClasses'

// Import components
import BannerSection from '@/components/home/BannerSection.vue'
import BannerSectionOne from '@/components/home/BannerSectionOne.vue'
import BrowseCategorySection from '@/components/home/BrowseCategorySection.vue'
import DiscountProductSection from '@/components/home/DiscountProductSection.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import ProductsSection from '@/components/home/ProductsSection.vue'

const { pageBackgroundClasses } = useThemeClasses()
</script>
