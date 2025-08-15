<template>
  <div :class="['pt-[85px] lg:pt-0 animate-fadeInUp', pageBackgroundClasses]">
    <Wrapper class="py-8">
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <div class="max-w-5xl mx-auto space-y-6">
        <div class="flex items-center justify-center gap-3 mb-4">
          <v-icon name="hi-information-circle" class="!w-6 !h-6 mb-12" />
          <h1 :class="sectionTitleClasses">Terms & Conditions</h1>
        </div>

        <div :class="sectionContainerClasses">
          <p :class="heroDescriptionClasses">
            Welcome to our Terms & Conditions. These terms govern your use of our website and
            services. Please read them carefully. By accessing or using our site you agree to be
            bound by these terms.
          </p>

          <h3 class="text-lg font-semibold mb-2" :class="textClasses">1. Use of Service</h3>
          <p :class="textSecondaryClasses">
            You agree to use the site only for lawful purposes and in a way that does not infringe the
            rights of, restrict or inhibit anyone else's use and enjoyment of the site.
          </p>

          <h3 class="text-lg font-semibold mb-2 mt-4" :class="textClasses">2. Orders & Pricing</h3>
          <p :class="textSecondaryClasses">
            All prices are shown in the applicable currency and are subject to change without notice.
            We reserve the right to refuse or cancel orders at our discretion.
          </p>

          <h3 class="text-lg font-semibold mb-2 mt-4" :class="textClasses">3. Intellectual Property</h3>
          <p :class="textSecondaryClasses">
            All content on this site, including images, text, and logos, is owned or licensed by us
            and protected by intellectual property laws.
          </p>

          <h3 class="text-lg font-semibold mb-2 mt-4" :class="textClasses">4. Limitation of Liability</h3>
          <p :class="textSecondaryClasses">
            To the fullest extent permitted by law, we will not be liable for any indirect or
            consequential loss arising from the use of the site.
          </p>

          <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>Last updated: August 2025</p>
          </div>
        </div>
      </div>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import '@/assets/base.css'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const { pageBackgroundClasses, sectionTitleClasses, sectionContainerClasses, heroDescriptionClasses, textClasses, textSecondaryClasses } = useThemeClasses()

const breadcrumbs = [{ label: 'terms.title' }]
</script>

<style scoped>
button:focus { outline: none; box-shadow: none }
a:focus { outline: none; box-shadow: none }
svg:focus { outline: none; box-shadow: none }
</style>
