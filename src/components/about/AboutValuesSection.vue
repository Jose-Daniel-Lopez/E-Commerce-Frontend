<template>
  <section class="max-w-6xl mx-auto mb-16">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="value in values" :key="value.icon" :class="aboutValueCardClasses">
        <div :class="aboutValueIconBgClasses">
          <v-icon :name="value.icon" :class="aboutValueIconClasses" />
        </div>
        <h3 :class="aboutValueTitleClasses">
          {{ $t(value.title) }}
        </h3>
        <p :class="['font-srProDisplay leading-relaxed', textSecondaryClasses]">
          {{ $t(value.description) }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'
const {
  aboutValueCardClasses,
  aboutValueIconBgClasses,
  aboutValueIconClasses,
  aboutValueTitleClasses,
  textSecondaryClasses,
} = useThemeClasses()

const values = [
  {
    icon: 'hi-badge-check',
    title: 'about.values.quality.title',
    description: 'about.values.quality.description',
  },
  {
    icon: 'gi-smartphone',
    title: 'about.values.innovation.title',
    description: 'about.values.innovation.description',
  },
  {
    icon: 'hi-users',
    title: 'about.values.support.title',
    description: 'about.values.support.description',
  },
]
</script>
