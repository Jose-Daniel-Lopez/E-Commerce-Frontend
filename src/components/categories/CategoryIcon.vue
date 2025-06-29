<script setup lang="ts">
interface Category {
  id: number
  name: string
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

const getCategoryIcon = (categoryName: string): string => {
  const icons: Record<string, string> = {
    "Dispositivos Móviles": "hi-device-mobile",
    Electrónica: 'co-settings',
    Informática: "bi-laptop",
    Audio: 'bi-headphones',
    Hogar: 'hi-home',
    Clothing: 'fa-tshirt',
    Books: 'hi-book-open',
    'Home & Garden': 'hi-home',
    Sports: 'md-sports-soccer',
    Beauty: 'hi-sparkles',
    Toys: 'md-smart-toy',
    Food: 'hi-cake',
    Automotive: 'hi-truck',
    Health: 'hi-heart',
    Music: 'hi-music-note',
    Gaming: 'gi-joystick',
    Travel: 'hi-airplane',
    Art: 'hi-color-swatch',
    Furniture: 'md-chair',
    Jewelry: 'gi-diamond-ring',
    'Pet Supplies': 'gi-cat',
    Baby: 'fa-baby',
    Office: 'hi-office-building',
    Kitchen: 'gi-cooking-pot',
  }

  return icons[categoryName] || 'hi-cube'
}
</script>

<template>
  <v-icon
    :name="getCategoryIcon(category.name)"
    :scale="sizeClasses[size]"
    class="text-blue-600 dark:text-blue-400"
  />
</template>
 