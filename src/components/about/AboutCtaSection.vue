<template>
  <section :class="ctaSectionClasses">
    <h2 :class="ctaTitleClasses">
      {{ $t('about.cta.title') }}
    </h2>
    <p :class="ctaDescriptionClasses">
      {{ $t('about.cta.description') }}
    </p>
    <div class="flex flex-col justify-center gap-4 sm:flex-row">
      <Button
        text-color="var(--color-primary-foreground)"
        bg-color="var(--color-primary)"
        border-width="1px"
        border-color="var(--color-border)"
        hover-bg-color="var(--color-accent)"
        hover-text-color="var(--color-primary-foreground)"
        width="160px"
        height="48px"
        @click="goToProducts"
      >
        Explorar
      </Button>
      <Button
        text-color="var(--color-text)"
        bg-color="transparent"
        border-width="1px"
        border-color="var(--color-border)"
        hover-bg-color="var(--color-primary)"
        hover-text-color="var(--color-primary-foreground)"
        width="160px"
        height="48px"
        @click="contactUs"
      >
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
