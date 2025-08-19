<template>
  <nav class="flex items-center text-sm theme-muted-text space-x-2 mb-8 p-4 theme-surface rounded-lg">
    <router-link
      to="/"
      class="flex items-center hover:text-black transition-colors duration-200 font-srProDisplay font-medium"
    >
      <v-icon name="hi-home" class="w-4 h-4 mr-1" />
      Home
    </router-link>

    <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
  <span class="text-muted-foreground font-srProDisplay">></span>

      <router-link
        v-if="breadcrumb.to && index !== breadcrumbs.length - 1"
        :to="breadcrumb.to"
  class="hover:theme-text transition-colors duration-200 font-srProDisplay font-medium"
      >
        {{ breadcrumb.label }}
      </router-link>

  <span v-else class="theme-text font-srProDisplay font-medium">
        {{ breadcrumb.label }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  breadcrumbs: BreadcrumbItem[]
}>()
</script>
