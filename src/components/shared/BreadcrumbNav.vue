<template>
  <nav :class="breadcrumbContainerClasses">
    <router-link to="/" :class="breadcrumbLinkClasses">
      {{ $t('nav.home') }}
    </router-link>

    <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
      <span :class="breadcrumbSeparatorClasses">></span>

      <router-link v-if="breadcrumb.to && index !== breadcrumbs.length - 1" :to="breadcrumb.to"
        :class="breadcrumbLinkClasses">
        {{ isTranslationKey(breadcrumb.label) ? $t(breadcrumb.label) : breadcrumb.label }}
      </router-link>

      <span v-else :class="breadcrumbCurrentClasses">
        {{ isTranslationKey(breadcrumb.label) ? $t(breadcrumb.label) : breadcrumb.label }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  breadcrumbs: BreadcrumbItem[]
}>()

const { textSecondaryClasses, textClasses } = useThemeClasses()

// Classes for breadcrumb container
const breadcrumbContainerClasses = computed(
  () => 'flex items-center text-sm space-x-2 mb-4 mt-4 p-4 theme-surface rounded-lg border theme-border transition-colors duration-200'
)

// Classes for breadcrumb links
const breadcrumbLinkClasses = computed(
  () => `flex items-center ${textSecondaryClasses.value} hover:theme-text transition-colors duration-200 font-srProDisplay font-medium`
)

// Classes for breadcrumb separator
const breadcrumbSeparatorClasses = computed(
  () => 'text-muted-foreground font-srProDisplay transition-colors duration-200'
)

// Classes for current breadcrumb (last item)
const breadcrumbCurrentClasses = computed(
  () => `${textClasses.value} font-srProDisplay font-medium transition-colors duration-200`
)

// Helper function to check if a string is a translation key
const isTranslationKey = (str: string): boolean => {
  return str.includes('.')
}
</script>
