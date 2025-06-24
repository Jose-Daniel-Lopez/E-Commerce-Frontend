<template>
  <div
    class="min-h-[80vh] bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
  >
    <!-- Hero Section -->
    <div class="flex justify-center items-center pt-20 pb-12 px-8">
      <div class="text-center max-w-4xl">
        <div class="mb-6">
          <v-icon
            name="hi-shopping-bag"
            scale="4"
            class="text-emerald-600 dark:text-emerald-400 mb-4"
          />
        </div>
        <h1 class="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Bienvenido a <span class="text-emerald-600 dark:text-emerald-400">E-Commerce</span>
        </h1>
        <p class="text-lg md:text-xl mb-12 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Gestiona tu tienda online de manera fácil y eficiente con nuestra plataforma moderna
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-wrap justify-center gap-4 mb-16">
          <router-link
            to="/users"
            class="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 no-underline"
          >
            <v-icon name="hi-users" scale="1.1" />
            <span>Ver Usuarios</span>
            <span
              v-if="usersStore.userCount > 0"
              class="ml-1 bg-white/20 px-2 py-1 rounded-full text-sm"
            >
              {{ usersStore.userCount }}
            </span>
          </router-link>

          <router-link
            to="/products"
            class="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 no-underline"
          >
            <v-icon name="hi-shopping-bag" scale="1.1" />
            <span>Ver Productos</span>
          </router-link>

          <router-link
            to="/categories"
            class="inline-flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:-translate-y-0.5 no-underline"
          >
            <v-icon name="hi-view-grid" scale="1.1" />
            <span>Ver Categorías</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="max-w-6xl mx-auto px-8 pb-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Users Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                <v-icon
                  name="hi-users"
                  scale="1.5"
                  class="text-emerald-600 dark:text-emerald-400"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Usuarios</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Total registrados</p>
              </div>
            </div>
          </div>
          <div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {{ usersStore.userCount || 0 }}
          </div>
        </div>

        <!-- Products Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <v-icon
                  name="hi-shopping-bag"
                  scale="1.5"
                  class="text-blue-600 dark:text-blue-400"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Productos</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">En catálogo</p>
              </div>
            </div>
          </div>
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {{ productsStore.productCount || 0 }}
          </div>
        </div>

        <!-- Categories Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <v-icon
                  name="hi-view-grid"
                  scale="1.5"
                  class="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Categorías</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Disponibles</p>
              </div>
            </div>
          </div>
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {{ categoriesStore.categoryCount || 0 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from '@/stores/users'
import { useProductsStore } from '@/stores/products'
import { useCategoriesStore } from '@/stores/categories'

const usersStore = useUsersStore()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()
</script>
