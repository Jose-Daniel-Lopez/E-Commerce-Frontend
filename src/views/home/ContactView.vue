<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black">
    <Wrapper class="py-8">
      <!-- Breadcrumb -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <!-- Header -->
      <section class="max-w-7xl mx-auto mb-8">
        <h1 class="font-srProDisplay text-2xl font-semibold text-left text-black">
          {{ t('contact.title') }}
        </h1>
      </section>

      <!-- Contact Content (Shopping Cart Style Layout) -->
      <section class="max-w-7xl mx-auto mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <!-- Left Panel - Contact Information -->
          <div class="bg-white rounded-lg p-6 h-full">
            <h2 class="font-srProDisplay text-xl font-semibold text-black mb-6">
              {{ t('contact.information.title') }}
            </h2>

            <div class="space-y-0">
              <!-- Email Block -->
              <div class="flex items-start gap-4 py-8 border-b border-[#EBEBEB]">
                <div
                  class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <v-icon name="hi-mail" class="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">
                    {{ t('contact.information.email.title') }}
                  </h3>
                  <p class="font-srProDisplay text-[#666666] text-sm mb-1">
                    {{ t('contact.information.email.info') }}
                  </p>
                  <p class="font-srProDisplay text-[#666666] text-sm">
                    {{ t('contact.information.email.support') }}
                  </p>
                </div>
              </div>

              <!-- Phone Block -->
              <div class="flex items-start gap-4 py-12 border-b border-[#EBEBEB]">
                <div
                  class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <v-icon name="hi-phone" class="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">
                    {{ t('contact.information.phone.title') }}
                  </h3>
                  <p class="font-srProDisplay text-[#666666] text-sm mb-1">
                    {{ t('contact.information.phone.number') }}
                  </p>
                  <p class="font-srProDisplay text-[#999999] text-xs">
                    {{ t('contact.information.phone.hours') }}
                  </p>
                </div>
              </div>

              <!-- Location Block -->
              <div class="flex items-start gap-4 py-12 border-b border-[#EBEBEB]">
                <div
                  class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <v-icon name="hi-location-marker" class="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">
                    {{ t('contact.information.location.title') }}
                  </h3>
                  <p class="font-srProDisplay text-[#666666] text-sm mb-1">
                    {{ t('contact.information.location.address') }}
                  </p>
                  <p class="font-srProDisplay text-[#666666] text-sm">
                    {{ t('contact.information.location.city') }}
                  </p>
                </div>
              </div>

              <!-- Response Time Block -->
              <div class="flex items-start gap-4 py-12">
                <div
                  class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <v-icon name="hi-clock" class="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">
                    {{ t('contact.information.responseTime.title') }}
                  </h3>
                  <p class="font-srProDisplay text-[#666666] text-sm mb-1">
                    {{ t('contact.information.responseTime.description') }}
                  </p>
                  <p class="font-srProDisplay text-[#999999] text-xs">
                    {{ t('contact.information.responseTime.businessHours') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panel - Contact Form (Order Summary Style Card) -->
          <div>
            <div class="bg-white border border-[#EBEBEB] rounded-lg p-6 h-full">
              <h2 class="font-srProDisplay text-xl font-semibold text-black mb-6">
                {{ t('contact.form.title') }}
              </h2>

              <form class="space-y-4">
                <!-- Name -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">
                    {{ t('contact.form.fields.fullName.label') }}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    :placeholder="t('contact.form.fields.fullName.placeholder')"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">
                    {{ t('contact.form.fields.email.label') }}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    :placeholder="t('contact.form.fields.email.placeholder')"
                  />
                </div>

                <!-- Subject -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">
                    {{ t('contact.form.fields.subject.label') }}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    :placeholder="t('contact.form.fields.subject.placeholder')"
                  />
                </div>

                <!-- Message -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">
                    {{ t('contact.form.fields.message.label') }}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200 resize-none"
                    :placeholder="t('contact.form.fields.message.placeholder')"
                  ></textarea>
                </div>

                <!-- Divider -->
                <div class="border-t border-[#EBEBEB] pt-4">
                  <!-- Contact Preference -->
                  <div class="mb-4">
                    <label class="block font-srProDisplay text-sm font-medium text-[#666666] mb-3">
                      {{ t('contact.form.fields.contactMethod.label') }}
                    </label>
                    <div class="space-y-2">
                      <label class="flex items-center">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="email"
                          class="mr-3 text-black"
                          checked
                        />
                        <span class="font-srProDisplay text-sm text-black">{{
                          t('contact.form.fields.contactMethod.email')
                        }}</span>
                      </label>
                      <label class="flex items-center">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="phone"
                          class="mr-3 text-black"
                        />
                        <span class="font-srProDisplay text-sm text-black">{{
                          t('contact.form.fields.contactMethod.phone')
                        }}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  @click.prevent="submitForm"
                  class="w-full bg-black text-white font-srProDisplay font-medium py-4 rounded-md hover:bg-[#333333] transition-colors duration-200"
                >
                  {{ t('contact.form.submit') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="max-w-7xl mx-auto mb-16">
        <div class="bg-white border border-[#EBEBEB] rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-[#EBEBEB] bg-gray-50">
            <h2 class="font-srProDisplay text-lg font-semibold text-black">
              {{ t('contact.faq.title') }}
            </h2>
          </div>

          <div class="divide-y divide-[#EBEBEB]">
            <div>
              <button
                class="w-full px-6 py-4 text-left font-srProDisplay font-medium text-black hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between bg-gray-50"
                @click="toggleFaq(0)"
              >
                {{ t('contact.faq.questions.delivery.question') }}
                <v-icon
                  name="hi-chevron-down"
                  class="w-5 h-5 text-[#666666] transition-transform duration-200"
                  :class="{ 'rotate-180': activeFaq === 0 }"
                />
              </button>
              <div v-show="activeFaq === 0" class="px-6 pb-4 py-4 bg-white">
                <p class="font-srProDisplay text-[#666666] text-sm leading-relaxed">
                  {{ t('contact.faq.questions.delivery.answer') }}
                </p>
              </div>
            </div>

            <div>
              <button
                class="w-full px-6 py-4 text-left font-srProDisplay font-medium text-black hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between bg-gray-50"
                @click="toggleFaq(1)"
              >
                {{ t('contact.faq.questions.payment.question') }}
                <v-icon
                  name="hi-chevron-down"
                  class="w-5 h-5 text-[#666666] transition-transform duration-200"
                  :class="{ 'rotate-180': activeFaq === 1 }"
                />
              </button>
              <div v-show="activeFaq === 1" class="px-6 pb-4 py-4 bg-white">
                <p class="font-srProDisplay text-[#666666] text-sm leading-relaxed">
                  {{ t('contact.faq.questions.payment.answer') }}
                </p>
              </div>
            </div>

            <div>
              <button
                class="w-full px-6 py-4 text-left font-srProDisplay font-medium text-black hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between bg-gray-50"
                @click="toggleFaq(2)"
              >
                {{ t('contact.faq.questions.returns.question') }}
                <v-icon
                  name="hi-chevron-down"
                  class="w-5 h-5 text-[#666666] transition-transform duration-200"
                  :class="{ 'rotate-180': activeFaq === 2 }"
                />
              </button>
              <div v-show="activeFaq === 2" class="px-6 pb-4 py-4 bg-white">
                <p class="font-srProDisplay text-[#666666] text-sm leading-relaxed">
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

const { t } = useI18n()

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
