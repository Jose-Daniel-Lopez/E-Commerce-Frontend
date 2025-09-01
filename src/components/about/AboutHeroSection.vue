<template>
  <section class="max-w-4xl mx-auto text-center mb-16">
    <h1 :class="heroTitleClasses">
      {{ $t('about.title') }}
    </h1>
    <p :class="heroDescriptionClasses">
      {{ $t('about.description') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'
const { heroTitleClasses, heroDescriptionClasses } = useThemeClasses()
</script>
