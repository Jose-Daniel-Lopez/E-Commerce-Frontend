<template>
  <div class="pt-[85px] lg:pt-0">
    <!-- hero section start -->
    <HeroSection />
    <!-- hero section end -->

    <!-- browse category section start -->
    <BrowseCategorySection />
    <!-- browse category section end -->

    <!-- products section start -->
    <ProductsSection />
    <!-- products section end -->

    <!-- banner section one start -->
    <BannerSectionOne />
    <!-- banner section one end -->

    <!-- banner section Two start -->
    <BannerSection />
    <!-- banner section Two end -->

    <!-- discount Product Section start -->
    <DiscountProductSection />
    <!-- discount Product Section end -->
  </div>
</template>

<script>
import BannerSection from '@/components/home/BannerSection.vue'
import BannerSectionOne from '@/components/home/BannerSectionOne.vue'
import BrowseCategorySection from '@/components/home/BrowseCategorySection.vue'
import DiscountProductSection from '@/components/home/DiscountProductSection.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import ProductsSection from '@/components/home/ProductsSection.vue'

export default {
  name: 'HomeView',
  components: {
    BannerSection,
    BannerSectionOne,
    BrowseCategorySection,
    DiscountProductSection,
    HeroSection,
    ProductsSection
  }
}
</script>
