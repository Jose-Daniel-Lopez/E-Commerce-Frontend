<template>
  <div :class="[cardClasses, 'rounded-lg overflow-hidden']">
  <div :class="['px-6 py-4 border-b theme-surface transition-colors duration-200', dividerClasses]">
      <h2 :class="['font-srProDisplay text-lg font-semibold transition-colors duration-200', textClasses]">
        {{ t('contact.faq.title') }}
      </h2>
    </div>
    <div :class="['divide-y', dividerClasses]">
      <div v-for="(faq, idx) in faqs" :key="idx">
        <button :class="faqButtonClasses" @click="toggleFaq(idx)">
          {{ t(faq.question) }}
          <v-icon name="hi-chevron-down"
            :class="['w-5 h-5 transition-transform duration-200', textSecondaryClasses, { 'rotate-180': activeFaq === idx }]" />
        </button>
        <div v-show="activeFaq === idx" :class="faqContentClasses">
          <p :class="['font-srProDisplay text-sm leading-relaxed transition-colors duration-200', textSecondaryClasses]">
            {{ t(faq.answer) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeClasses } from '@/composables/useThemeClasses'
const { t } = useI18n()
const {
  cardClasses,
  textClasses,
  textSecondaryClasses,
  faqButtonClasses,
  faqContentClasses,
  dividerClasses
} = useThemeClasses()

const props = defineProps<{
  faqs: { question: string; answer: string }[]
  modelValue: number | null
}>()
const emit = defineEmits(['update:modelValue'])
const { modelValue } = toRefs(props)
const activeFaq = ref<number | null>(modelValue.value)
watch(modelValue, v => (activeFaq.value = v))
const toggleFaq = (idx: number) => {
  emit('update:modelValue', activeFaq.value === idx ? null : idx)
}
</script>
