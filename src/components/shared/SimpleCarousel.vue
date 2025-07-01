<template>
  <div class="flex flex-wrap gap-4 justify-start">
    <div
      v-for="category in categories"
      :key="category.id"
      class="flex-shrink-0"
    >
      <CategoryCard :category="category" />
    </div>
  </div>
</template>

<script setup>
import CategoryCard from './CategoryCard.vue';

// Definir las props que el componente recibe
defineProps({
  categories: {
    type: Array,
    required: true
  }
});
</script>
