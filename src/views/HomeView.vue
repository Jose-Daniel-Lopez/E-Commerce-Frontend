<template>
  <div class="flex justify-center items-center min-h-[70vh] p-8">
    <div class="text-center max-w-2xl">
      <h1 class="text-3xl md:text-5xl mb-4 text-gray-900 dark:text-gray-100">
        Bienvenido a E-Commerce
      </h1>
      <p class="text-base md:text-xl mb-8 text-gray-600 dark:text-gray-300 opacity-80">
        Gestiona tu tienda online de manera fácil y eficiente
      </p>
      <router-link
        to="/users"
        class="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-all duration-300 ease-in-out shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 no-underline"
      >
        Ver Usuarios
        <span
          v-if="usersStore.userCount > 0"
          class="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm"
        >
          {{ usersStore.userCount }}
        </span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()
</script>
