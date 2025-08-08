<template>
  <div class="pt-[85px] lg:pt-0 bg-white dark:bg-gray-900 text-black dark:text-white animate-fadeInUp transition-colors duration-200">


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

// Import components
import BannerSection from '@/components/home/BannerSection.vue'
import BannerSectionOne from '@/components/home/BannerSectionOne.vue'
import BrowseCategorySection from '@/components/home/BrowseCategorySection.vue'
import DiscountProductSection from '@/components/home/DiscountProductSection.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import ProductsSection from '@/components/home/ProductsSection.vue'
</script>
