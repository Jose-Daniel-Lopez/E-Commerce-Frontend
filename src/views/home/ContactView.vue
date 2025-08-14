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
          <div :class="infoCardClasses">
            <h2 :class="['font-srProDisplay text-xl font-semibold mb-6 transition-colors duration-200', textClasses]">
              {{ t('contact.information.title') }}
            </h2>

            <div class="space-y-0">
              <!-- Email Block -->
              <div :class="['flex items-start gap-4 py-8 border-b', dividerClasses]">
                <div :class="iconBackgroundClasses">
                  <v-icon name="hi-mail" :class="['w-6 h-6', interactiveIconClasses]" />
                </div>
                <div>
                  <h3
                    :class="['font-srProDisplay text-lg font-medium mb-1 transition-colors duration-200', textClasses]">
                    {{ t('contact.information.email.title') }}
                  </h3>
                  <p :class="['font-srProDisplay text-sm mb-1 transition-colors duration-200', textSecondaryClasses]">
                    {{ t('contact.information.email.info') }}
                  </p>
                  <p :class="['font-srProDisplay text-sm transition-colors duration-200', textSecondaryClasses]">
                    {{ t('contact.information.email.support') }}
                  </p>
                </div>
              </div>

              <!-- Phone Block -->
              <div :class="['flex items-start gap-4 py-12 border-b', dividerClasses]">
                <div :class="iconBackgroundClasses">
                  <v-icon name="hi-phone" :class="['w-6 h-6', interactiveIconClasses]" />
                </div>
                <div>
                  <h3
                    :class="['font-srProDisplay text-lg font-medium mb-1 transition-colors duration-200', textClasses]">
                    {{ t('contact.information.phone.title') }}
                  </h3>
                  <p :class="['font-srProDisplay text-sm mb-1 transition-colors duration-200', textSecondaryClasses]">
                    {{ t('contact.information.phone.number') }}
                  </p>
                  <p :class="['font-srProDisplay text-xs transition-colors duration-200', textSecondaryClasses]">
                    {{ t('contact.information.phone.hours') }}
                  </p>
                </div>
              </div>

              <!-- Location Block -->
              <div :class="['flex items-start gap-4 py-12 border-b', dividerClasses]">
                <div :class="iconBackgroundClasses">
                  <v-icon name="hi-location-marker" :class="['w-6 h-6', interactiveIconClasses]" />
                </div>
                <div>
                  <h3
                    :class="['font-srProDisplay text-lg font-medium mb-1 transition-colors duration-200', textClasses]">
                    {{ t('contact.information.location.title') }}
                  </h3>
                  <p :class="['font-srProDisplay text-sm mb-1 transition-colors duration-200', textSecondaryClasses]">
                    {{ t('contact.information.location.address') }}
                  </p>
                  <p :class="['font-srProDisplay text-sm transition-colors duration-200', textSecondaryClasses]">
                    {{ t('contact.information.location.city') }}
                  </p>
                </div>
              </div>

              <!-- Response Time Block -->
              <div class="flex items-start gap-4 py-12">
                <div :class="iconBackgroundClasses">
                  <v-icon name="hi-clock" :class="['w-6 h-6', interactiveIconClasses]" />
                </div>
                <div>
                  <h3
                    :class="['font-srProDisplay text-lg font-medium mb-1 transition-colors duration-200', textClasses]">
                    {{ t('contact.information.responseTime.title') }}
                  </h3>
                  <p :class="['font-srProDisplay text-sm mb-1 transition-colors duration-200', textSecondaryClasses]">
                    {{ t('contact.information.responseTime.description') }}
                  </p>
                  <p :class="['font-srProDisplay text-xs transition-colors duration-200', textSecondaryClasses]">
                    {{ t('contact.information.responseTime.businessHours') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panel - Contact Form (Order Summary Style Card) -->
          <div>
            <div :class="cardClasses">
              <h2 :class="['font-srProDisplay text-xl font-semibold mb-6 transition-colors duration-200', textClasses]">
                {{ t('contact.form.title') }}
              </h2>

              <form class="space-y-4">
                <!-- Name -->
                <div>
                  <label :class="formLabelClasses">
                    {{ t('contact.form.fields.fullName.label') }}
                  </label>
                  <input type="text" name="fullName" required :class="formInputClasses"
                    :placeholder="t('contact.form.fields.fullName.placeholder')" />
                </div>

                <!-- Email -->
                <div>
                  <label :class="formLabelClasses">
                    {{ t('contact.form.fields.email.label') }}
                  </label>
                  <input type="email" name="email" required :class="formInputClasses"
                    :placeholder="t('contact.form.fields.email.placeholder')" />
                </div>

                <!-- Subject -->
                <div>
                  <label :class="formLabelClasses">
                    {{ t('contact.form.fields.subject.label') }}
                  </label>
                  <input type="text" name="subject" required :class="formInputClasses"
                    :placeholder="t('contact.form.fields.subject.placeholder')" />
                </div>

                <!-- Message -->
                <div>
                  <label :class="formLabelClasses">
                    {{ t('contact.form.fields.message.label') }}
                  </label>
                  <textarea name="message" required rows="4" :class="[formInputClasses, 'resize-none']"
                    :placeholder="t('contact.form.fields.message.placeholder')"></textarea>
                </div>

                <!-- Divider -->
                <div :class="['border-t pt-4', dividerClasses]">
                  <!-- Contact Preference -->
                  <div class="mb-4">
                    <label
                      :class="['block font-srProDisplay text-sm font-medium mb-3 transition-colors duration-200', textSecondaryClasses]">
                      {{ t('contact.form.fields.contactMethod.label') }}
                    </label>
                    <div class="space-y-2">
                      <label class="flex items-center">
                        <input type="radio" name="contactMethod" value="email" class="mr-3 text-black" checked />
                        <span :class="['font-srProDisplay text-sm transition-colors duration-200', textClasses]">{{
                          t('contact.form.fields.contactMethod.email')
                        }}</span>
                      </label>
                      <label class="flex items-center">
                        <input type="radio" name="contactMethod" value="phone" class="mr-3 text-black" />
                        <span :class="['font-srProDisplay text-sm transition-colors duration-200', textClasses]">{{
                          t('contact.form.fields.contactMethod.phone')
                        }}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" @click.prevent="submitForm"
                  :class="[buttonPrimaryClasses, 'w-full font-srProDisplay font-medium py-4 rounded-md']">
                  {{ t('contact.form.submit') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="mx-auto mb-16 max-w-7xl">
        <div :class="[cardClasses, 'rounded-lg overflow-hidden']">
          <div
            :class="['px-6 py-4 border-b bg-gray-50 dark:bg-gray-800 transition-colors duration-200', dividerClasses]">
            <h2 :class="['font-srProDisplay text-lg font-semibold transition-colors duration-200', textClasses]">
              {{ t('contact.faq.title') }}
            </h2>
          </div>

          <div :class="['divide-y', dividerClasses]">
            <div>
              <button :class="faqButtonClasses" @click="toggleFaq(0)">
                {{ t('contact.faq.questions.delivery.question') }}
                <v-icon name="hi-chevron-down"
                  :class="['w-5 h-5 transition-transform duration-200', textSecondaryClasses, { 'rotate-180': activeFaq === 0 }]" />
              </button>
              <div v-show="activeFaq === 0" :class="faqContentClasses">
                <p
                  :class="['font-srProDisplay text-sm leading-relaxed transition-colors duration-200', textSecondaryClasses]">
                  {{ t('contact.faq.questions.delivery.answer') }}
                </p>
              </div>
            </div>

            <div>
              <button :class="faqButtonClasses" @click="toggleFaq(1)">
                {{ t('contact.faq.questions.payment.question') }}
                <v-icon name="hi-chevron-down"
                  :class="['w-5 h-5 transition-transform duration-200', textSecondaryClasses, { 'rotate-180': activeFaq === 1 }]" />
              </button>
              <div v-show="activeFaq === 1" :class="faqContentClasses">
                <p
                  :class="['font-srProDisplay text-sm leading-relaxed transition-colors duration-200', textSecondaryClasses]">
                  {{ t('contact.faq.questions.payment.answer') }}
                </p>
              </div>
            </div>

            <div>
              <button :class="faqButtonClasses" @click="toggleFaq(2)">
                {{ t('contact.faq.questions.returns.question') }}
                <v-icon name="hi-chevron-down"
                  :class="['w-5 h-5 transition-transform duration-200', textSecondaryClasses, { 'rotate-180': activeFaq === 2 }]" />
              </button>
              <div v-show="activeFaq === 2" :class="faqContentClasses">
                <p
                  :class="['font-srProDisplay text-sm leading-relaxed transition-colors duration-200', textSecondaryClasses]">
                  {{ t('contact.faq.questions.returns.answer') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const { t } = useI18n()

// Theme classes
const {
  pageBackgroundClasses,
  textClasses,
  textSecondaryClasses,
  cardClasses,
  formInputClasses,
  formLabelClasses,
  buttonPrimaryClasses,
  faqButtonClasses,
  faqContentClasses,
  infoCardClasses,
  iconBackgroundClasses,
  interactiveIconClasses,
  dividerClasses
} = useThemeClasses()

// Breadcrumb config
const breadcrumbs = [{ label: t('contact.title') }]

// FAQ state
const activeFaq = ref<number | null>(null)

// Methods
const submitForm = () => {
  // Form submission logic
  console.log('Form submitted')
}

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>

<style scoped>
/* Remove default Tailwind blue outline on button focus */
button:focus {
  outline: none;
  box-shadow: none;
}
</style>
