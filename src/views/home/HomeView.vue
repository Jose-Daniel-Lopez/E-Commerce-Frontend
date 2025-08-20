<template>
  <div class="pt-[85px] lg:pt-0 animate-fadeInUp" :class="pageBackgroundClasses">


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
