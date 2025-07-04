<script setup lang="ts">

interface Category {
  id: number
  name: string
  icon?: string // Nuevo campo opcional para el icono
}

interface CategoryIconProps {
  category: Category
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

withDefaults(defineProps<CategoryIconProps>(), {
  size: 'xl',
})

const sizeClasses = {
  sm: '1.5',
  md: '2.5',
  lg: '3.5',
  xl: '4.5',
}


// Ahora el icono viene del campo category.icon, con fallback
const getCategoryIcon = (category: Category): string => {
  return category.icon || 'hi-cube'
}
</script>

<template>
  <v-icon
    :name="getCategoryIcon(category)"
    :scale="sizeClasses[size]"
    class="text-blue-600 dark:text-blue-400"
  />
</template>
