<template>
  <div :class="['pt-[85px] lg:pt-0 animate-fadeInUp', pageBackgroundClasses]">
    <Wrapper class="py-8">
      <!-- Breadcrumb -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />
      <!-- Hero Section -->
      <section class="max-w-4xl mx-auto text-center mb-16">
        <h1 :class="heroTitleClasses">
          {{ $t('about.title') }}
        </h1>
        <p :class="heroDescriptionClasses">
          {{ $t('about.description') }}
        </p>
      </section>

      <!-- Values Section -->
      <section class="max-w-6xl mx-auto mb-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Quality -->
          <div :class="aboutValueCardClasses">
            <div :class="aboutValueIconBgClasses">
              <v-icon name="hi-badge-check" :class="aboutValueIconClasses" />
            </div>
            <h3 :class="aboutValueTitleClasses">
              {{ $t('about.values.quality.title') }}
            </h3>
            <p :class="['font-srProDisplay leading-relaxed', textSecondaryClasses]">
              {{ $t('about.values.quality.description') }}
            </p>
          </div>

          <!-- Innovation -->
          <div :class="aboutValueCardClasses">
            <div :class="aboutValueIconBgClasses">
              <v-icon name="gi-smartphone" :class="aboutValueIconClasses" />
            </div>
            <h3 :class="aboutValueTitleClasses">
              {{ $t('about.values.innovation.title') }}
            </h3>
            <p :class="['font-srProDisplay leading-relaxed', textSecondaryClasses]">
              {{ $t('about.values.innovation.description') }}
            </p>
          </div>

          <!-- Support -->
          <div :class="aboutValueCardClasses">
            <div :class="aboutValueIconBgClasses">
              <v-icon name="hi-users" :class="aboutValueIconClasses" />
            </div>
            <h3 :class="aboutValueTitleClasses">
              {{ $t('about.values.support.title') }}
            </h3>
            <p :class="['font-srProDisplay leading-relaxed', textSecondaryClasses]">
              {{ $t('about.values.support.description') }}
            </p>
          </div>
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="max-w-6xl mx-auto mb-16">
        <h2 :class="sectionTitleClasses">
          {{ $t('about.featuredProducts.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- iPhone -->
          <div :class="featuredProductCardClasses">
            <div class="h-32 w-full flex items-center justify-center mb-6">
              <img src="/images/Apple-phone.png" alt="iPhone" class="h-full object-contain" />
            </div>
            <h3 :class="featuredProductTitleClasses">
              {{ $t('about.featuredProducts.iphone.title') }}
            </h3>
            <p :class="featuredProductDescriptionClasses">
              {{ $t('about.featuredProducts.iphone.description') }}
            </p>
          </div>

          <!-- MacBook -->
          <div :class="featuredProductCardClasses">
            <div class="h-32 w-full flex items-center justify-center mb-6">
              <img src="/images/Macbook.png" alt="MacBook" class="h-full object-contain" />
            </div>
            <h3 :class="featuredProductTitleClasses">
              {{ $t('about.featuredProducts.macbook.title') }}
            </h3>
            <p :class="featuredProductDescriptionClasses">
              {{ $t('about.featuredProducts.macbook.description') }}
            </p>
          </div>

          <!-- AirPods -->
          <div :class="featuredProductCardClasses">
            <div class="h-32 w-full flex items-center justify-center mb-6">
              <img src="/images/Apple-airPods.png" alt="AirPods" class="h-full object-contain" />
            </div>
            <h3 :class="featuredProductTitleClasses">
              {{ $t('about.featuredProducts.airpods.title') }}
            </h3>
            <p :class="featuredProductDescriptionClasses">
              {{ $t('about.featuredProducts.airpods.description') }}
            </p>
          </div>
        </div>
      </section>

      <!-- Contact CTA -->
      <section :class="ctaSectionClasses">
        <h2 :class="ctaTitleClasses">
          {{ $t('about.cta.title') }}
        </h2>
        <p :class="ctaDescriptionClasses">
          {{ $t('about.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            text-color="black"
            bg-color="white"
            border-width="1px"
            border-color="white"
            hover-bg-color="#f0f0f0"
            hover-text-color="black"
            width="160px"
            height="48px"
            @click="goToProducts"
          >
            Explorar
          </Button>
          <Button
            text-color="white"
            bg-color="transparent"
            border-width="1px"
            border-color="white"
            hover-bg-color="white"
            hover-text-color="black"
            width="160px"
            height="48px"
            @click="contactUs"
          >
            {{ $t('about.cta.contact') }}
          </Button>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import '@/assets/base.css'
import { useRouter } from 'vue-router'
import Wrapper from '@/components/shared/Wrapper.vue'
import Button from '@/components/shared/Button.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const router = useRouter()

// Theme classes
const {
  pageBackgroundClasses,
  textSecondaryClasses,
  heroTitleClasses,
  heroDescriptionClasses,
  aboutValueCardClasses,
  aboutValueIconBgClasses,
  aboutValueIconClasses,
  aboutValueTitleClasses,
  featuredProductCardClasses,
  featuredProductTitleClasses,
  featuredProductDescriptionClasses,
  ctaSectionClasses,
  ctaTitleClasses,
  ctaDescriptionClasses,
  sectionTitleClasses,
} = useThemeClasses()

// Breadcrumb config
const breadcrumbs = [{ label: 'about.title' }]

const goToProducts = () => {
  // Navigate to home page
  router.push({ name: 'home' })
}

const contactUs = () => {
  // Navigate to contact page
  router.push({ name: 'contact' })
}
</script>
