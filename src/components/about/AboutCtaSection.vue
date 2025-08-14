<template>
  <section :class="ctaSectionClasses">
    <h2 :class="ctaTitleClasses">
      {{ $t('about.cta.title') }}
    </h2>
    <p :class="ctaDescriptionClasses">
      {{ $t('about.cta.description') }}
    </p>
    <div class="flex flex-col justify-center gap-4 sm:flex-row">
      <Button text-color="black" bg-color="white" border-width="1px" border-color="white" hover-bg-color="#f0f0f0"
        hover-text-color="black" width="160px" height="48px" @click="goToProducts">
        Explorar
      </Button>
      <Button text-color="white" bg-color="transparent" border-width="1px" border-color="white" hover-bg-color="white"
        hover-text-color="black" width="160px" height="48px" @click="contactUs">
        {{ $t('about.cta.contact') }}
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '@/components/shared/Button.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
const { ctaSectionClasses, ctaTitleClasses, ctaDescriptionClasses } = useThemeClasses()

defineProps<{ goToProducts: () => void; contactUs: () => void }>()
</script>
