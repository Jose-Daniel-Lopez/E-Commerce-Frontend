<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!-- Modern Header with Tailwind -->
  <header
    class="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex-shrink-0">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            <span class="text-emerald-600 dark:text-emerald-400">E</span>-Commerce
          </h1>
        </div>

        <!-- Navigation -->
        <nav class="flex space-x-8">
          <RouterLink
            to="/"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-emerald-500"
            active-class="text-emerald-600 dark:text-emerald-400 border-emerald-500"
          >
            <v-icon name="hi-home" scale="1.1" />
            <span>Home</span>
          </RouterLink>
          <RouterLink
            to="/users"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-emerald-500"
            active-class="text-emerald-600 dark:text-emerald-400 border-emerald-500"
          >
            <v-icon name="hi-users" scale="1.1" />
            <span>Users</span>
          </RouterLink>
          <RouterLink
            to="/products"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-emerald-500"
            active-class="text-emerald-600 dark:text-emerald-400 border-emerald-500"
          >
            <v-icon name="hi-shopping-bag" scale="1.1" />
            <span>Products</span>
          </RouterLink>
          <RouterLink
            to="/categories"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-emerald-500"
            active-class="text-emerald-600 dark:text-emerald-400 border-emerald-500"
          >
            <v-icon name="hi-view-grid" scale="1.1" />
            <span>Categories</span>
          </RouterLink>
          <RouterLink
            to="/login"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-emerald-500"
            active-class="text-emerald-600 dark:text-emerald-400 border-emerald-500"
          >
            <v-icon name="hi-user-follow" scale="1.1" />
            <span>Login</span>
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <RouterView />
  </main>
</template>
