<template>
  <div :class="['pt-[85px] lg:pt-0', pageBackgroundClasses]">
    <Wrapper class="py-8">
      <!-- Breadcrumb -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <!-- Header -->
      <section class="mx-auto mb-8 max-w-7xl">
        <h1 :class="['font-srProDisplay text-2xl font-semibold text-left transition-colors duration-200', textClasses]">
          {{ t('contact.title') }}
        </h1>
      </section>

      <!-- Contact Content (Shopping Cart Style Layout) -->
      <section class="mx-auto mb-16 max-w-7xl">
        <div class="grid items-start grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- Left Panel - Contact Information -->
          <ContactInfoCard />
          <!-- Right Panel - Contact Form (Order Summary Style Card) -->
          <ContactForm />
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="mx-auto mb-16 max-w-7xl">
        <ContactFAQ :faqs="faqs" v-model="activeFaq" />
      </section>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
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
button:focus {
  outline: none;
  box-shadow: none;
}
</style>
