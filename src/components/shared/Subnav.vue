<template>
  <nav class="flex items-center w-full border-b h-14" :style="{ background: 'var(--subnav-bg)' }">
    <div class="flex items-center w-full h-full">
      <template v-for="(category, idx) in categories" :key="category.slug">
        <div class="flex items-center justify-center flex-1 h-full px-1 transition-colors cursor-pointer"
          @click="navigateToCategory(category.slug)" @mouseover="hover = idx" @mouseleave="hover = null"
          :style="hover === idx ? { background: 'var(--subnav-hover)' } : { background: 'transparent' }">
          <div class="flex flex-col items-center gap-0.5">
            <v-icon :name="category.icon || 'hi-cube'" scale="1.4" :class="[
              'pt-1 pb-0.5',
              hover === idx ? 'opacity-100' : 'opacity-60',
              'text-gray-700 dark:text-white'
            ]" />
            <span :class="[
              'text-sm font-medium',
              hover === idx ? 'opacity-100' : 'opacity-70',
              'text-gray-700 dark:text-white'
            ]">{{ category.name }}</span>
          </div>
        </div>
        <div v-if="idx < categories.length - 1"
          :class="['h-6 w-px', hover === idx ? 'bg-gray-400' : 'bg-gray-300', 'dark:bg-white/20']"></div>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'

interface CategoryNav {
  name: string
  icon?: string
  slug: string
}

// Destructure to avoid unused prop diagnostics
const { categories } = defineProps<{ categories: CategoryNav[] }>()

// Component name to satisfy multi-word rule
defineOptions({ name: 'AppSubnav' })

const router = useRouter()
const hover = ref<number | null>(null)
const navigateToCategory = (categorySlug: string) => {
  router.push(`/catalog/${categorySlug}`)
}
</script>

<style scoped>
.font-medium {
  font-weight: 500;
}

nav {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

@media (prefers-color-scheme: dark) {
  nav {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
}
</style>
