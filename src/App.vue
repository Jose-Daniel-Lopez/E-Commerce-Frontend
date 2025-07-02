<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/shared/Header.vue'
import SubnavBar from '@/components/shared/Subnav.vue'
import Footer from '@/components/shared/Footer.vue'
</script>

<template>
  <div id="app" class="min-h-screen bg-white">
    <!-- Header Component -->
    <Header />

    <!-- Subnav Component -->
    <SubnavBar />

    <!-- Main Content -->
    <main class="min-h-screen">
      <RouterView />
    </main>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>
