<template>
  <div :class="[cardClasses, 'border-0']">
    <h2 :class="['font-srProDisplay text-xl font-semibold mb-6 transition-colors duration-200', textClasses]">
      {{ t('contact.form.title') }}
    </h2>
    <form class="space-y-4" @submit.prevent="submitForm">
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
              <input type="radio" name="contactMethod" value="email" class="mr-3" checked />
              <span :class="['font-srProDisplay text-sm transition-colors duration-200', textClasses]">
                {{ t('contact.form.fields.contactMethod.email') }}
              </span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="contactMethod" value="phone" class="mr-3" />
              <span :class="['font-srProDisplay text-sm transition-colors duration-200', textClasses]">
                {{ t('contact.form.fields.contactMethod.phone') }}
              </span>
            </label>
          </div>
        </div>
      </div>
      <!-- Submit Button -->
      <button type="submit" :class="[buttonPrimaryClasses, 'w-full font-srProDisplay font-medium py-4 rounded-md']">
        {{ t('contact.form.submit') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useThemeClasses } from '@/composables/useThemeClasses'
const { t } = useI18n()
const {
  cardClasses,
  textClasses,
  textSecondaryClasses,
  formInputClasses,
  formLabelClasses,
  buttonPrimaryClasses,
  dividerClasses
} = useThemeClasses()

const submitForm = () => {
  // Form submission logic
  console.log('Form submitted')
}
</script>
