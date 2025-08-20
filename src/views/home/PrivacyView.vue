<template>
  <div class="home-page-layout" :class="pageBackgroundClasses">
    <Wrapper class="py-8">
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <div class="legal-content space-y-6">
        <div class="flex items-center justify-center gap-3 mb-4">
          <v-icon name="hi-shield-check" class="!w-6 !h-6 mb-12" />
          <h1 :class="sectionTitleClasses">Privacy Policy</h1>
        </div>

        <div :class="sectionContainerClasses">
          <p :class="heroDescriptionClasses">
            Your privacy matters to us. This policy explains what personal data we collect, why we
            collect it, and how we protect it.
          </p>

          <h3 class="text-lg font-semibold mb-2" :class="textClasses">1. Information We Collect</h3>
          <p :class="textSecondaryClasses">
            We collect information you provide directly (e.g., account creation, orders), and
            information collected automatically (e.g., usage data, cookies) to improve our services.
          </p>

          <h3 class="text-lg font-semibold mb-2 mt-4" :class="textClasses">2. How We Use Data</h3>
          <p :class="textSecondaryClasses">
            Data is used to process orders, communicate with you, personalize content, and for
            analytics. We never sell your personal information to third parties.
          </p>

          <h3 class="text-lg font-semibold mb-2 mt-4" :class="textClasses">3. Security</h3>
          <p :class="textSecondaryClasses">
            We implement reasonable security measures to protect the information we process. However,
            no transmission over the internet is completely secure.
          </p>

          <h3 class="text-lg font-semibold mb-2 mt-4" :class="textClasses">4. Your Rights</h3>
          <p :class="textSecondaryClasses">
            Depending on your jurisdiction, you may have rights to access, correct, or delete your
            personal data. Contact us for requests related to your information.
          </p>

          <div class="mt-4 text-sm" :class="textSecondaryClasses">
            <p>Last updated: August 2025</p>
          </div>
        </div>
      </div>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
/**
 * PrivacyView - Optimized according to Style Optimization Guide
 *
 * Key optimizations implemented:
 * ✅ Global layout utilities moved to base.css
 * ✅ Uses useThemeClasses composable for consistent theming
 * ✅ Performance optimized with global animation classes
 * ✅ Clean legal document structure
 */
import '@/assets/base.css'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const { pageBackgroundClasses, sectionTitleClasses, sectionContainerClasses, heroDescriptionClasses, textClasses, textSecondaryClasses } = useThemeClasses()

const breadcrumbs = [{ label: 'privacy.title' }]
</script>

<style scoped>
/* =================================
   PrivacyView Component Styles
   Only component-specific styles here
   ================================= */

/* Focus states handled by global utilities in base.css */
/* Legal document styling uses theme composable classes */
</style>
