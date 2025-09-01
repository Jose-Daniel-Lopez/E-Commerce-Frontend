<template>
  <div class="home-page-layout" :class="pageBackgroundClasses">
    <Wrapper class="py-8">
      <!-- Breadcrumb -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <!-- Header -->
      <section class="content-section">
        <h1 class="page-header-title transition-colors duration-200" :class="textClasses">
          {{ t('contact.title') }}
        </h1>
      </section>

      <!-- Contact Content (Shopping Cart Style Layout) -->
      <section class="content-section">
        <div class="grid items-start grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- Left Panel - Contact Information -->
          <ContactInfoCard />
          <!-- Right Panel - Contact Form (Order Summary Style Card) -->
          <ContactForm />
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="content-section">
        <ContactFAQ :faqs="faqs" v-model="activeFaq" />
      </section>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
/**
 * ContactView - Optimized according to Style Optimization Guide
 *
 * Key optimizations implemented:
 * ✅ Global layout utilities moved to base.css
 * ✅ Uses useThemeClasses composable for consistent theming
 * ✅ Performance optimized with global classes
 * ✅ Clean component structure and semantic classes
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import ContactInfoCard from '@/components/contact/ContactInfoCard.vue'
import ContactForm from '@/components/contact/ContactForm.vue'
import ContactFAQ from '@/components/contact/ContactFAQ.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const { t } = useI18n()
const { pageBackgroundClasses, textClasses } = useThemeClasses()

// Breadcrumb config
const breadcrumbs = [{ label: t('contact.title') }]

// FAQ state and questions
const activeFaq = ref<number | null>(null)
const faqs = [
  {
    question: 'contact.faq.questions.delivery.question',
    answer: 'contact.faq.questions.delivery.answer',
  },
  {
    question: 'contact.faq.questions.payment.question',
    answer: 'contact.faq.questions.payment.answer',
  },
  {
    question: 'contact.faq.questions.returns.question',
    answer: 'contact.faq.questions.returns.answer',
  },
]
</script>

<style scoped>
/* =================================
   ContactView Component Styles
   Only component-specific styles here
   ================================= */

/* Focus states moved to global utilities */
.focus-reset:focus {
  outline: none;
  box-shadow: none;
}
</style>
