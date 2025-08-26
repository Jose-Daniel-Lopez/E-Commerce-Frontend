<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainHeader from '@/components/shared/MainHeader.vue'
import SubnavBar from '@/components/shared/Subnav.vue'
import Footer from '@/components/shared/Footer.vue'
import ToastContainer from '@/components/shared/ToastContainer.vue'
import ScrollToTop from '@/components/shared/ScrollToTop.vue'
import { useCategoriesStore } from '@/stores/categories'
import { computed, onMounted } from 'vue'

const categoriesStore = useCategoriesStore()

// Normalizar categorías para SubnavBar
const subnavCategories = computed(() =>
  categoriesStore.categories.map((category) => ({
    name: category.name,
    icon: category.icon,
    slug: category.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[áàäâã]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöôõ]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9-]/g, ''),
  })),
)

onMounted(() => {
  if (!categoriesStore.hasCategories) {
    categoriesStore.fetchCategories()
  }
})
</script>

<template>
  <div id="app" class="bg-white">
    <!-- Header Component -->
    <MainHeader />

    <!-- Subnav Component -->
    <SubnavBar :categories="subnavCategories" />

    <!-- Main Content -->
    <main>
      <RouterView />
    </main>

    <!-- Footer Component -->
    <Footer />

    <!-- Toast Notifications -->
    <ToastContainer />

  <!-- Scroll to top button -->
  <ScrollToTop />
  </div>
</template>
