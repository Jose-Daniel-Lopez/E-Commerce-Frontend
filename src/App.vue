<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const setDarkClass = (value: boolean) => {
  const html = document.documentElement
  if (value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const toggleDark = () => {
  isDark.value = !isDark.value
  setDarkClass(isDark.value)
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    setDarkClass(true)
  } else {
    isDark.value = false
    setDarkClass(false)
  }
})
</script>

<template>
  <!-- Modern Header with Tailwind -->
  <header class="bg-background shadow-lg border-b border-border sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex-shrink-0">
          <h1 class="text-2xl font-bold text-text"><span class="text-primary">E</span>-Commerce</h1>
        </div>

        <!-- Main Navigation -->
        <nav class="flex space-x-8 items-center">
          <RouterLink
            to="/"
            class="flex items-center space-x-2 text-text hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-primary"
            active-class="text-primary border-primary"
          >
            <v-icon name="hi-home" scale="1.1" />
            <span>Home</span>
          </RouterLink>
          <RouterLink
            to="/users"
            class="flex items-center space-x-2 text-text hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-primary"
            active-class="text-primary border-primary"
          >
            <v-icon name="hi-users" scale="1.1" />
            <span>Users</span>
          </RouterLink>
          <RouterLink
            to="/products"
            class="flex items-center space-x-2 text-text hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-primary"
            active-class="text-primary border-primary"
          >
            <v-icon name="hi-shopping-bag" scale="1.1" />
            <span>Products</span>
          </RouterLink>
          <RouterLink
            to="/categories"
            class="flex items-center space-x-2 text-text hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-primary"
            active-class="text-primary border-primary"
          >
            <v-icon name="hi-view-grid" scale="1.1" />
            <span>Categories</span>
          </RouterLink>


          <RouterLink
            to="/orders"
            class="flex items-center space-x-2 text-text hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-primary"
            active-class="text-primary border-primary"
          >
            <v-icon name="fa-boxes" scale="1.1" />
            <span>Orders</span>
          </RouterLink>
          <RouterLink
            to="/coupons"
            class="flex items-center space-x-2 text-text hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-primary"
            active-class="text-primary border-primary"
          >
            <v-icon name="ri-coupon-2-line" scale="1.1" />
            <span>Coupons</span>
          </RouterLink>
          <RouterLink
            to="/payments"
            class="flex items-center space-x-2 text-text hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-primary"
            active-class="text-primary border-primary"
          >
            <v-icon name="fa-credit-card" scale="1.1" />
            <span>Payments</span>
          </RouterLink>
          <RouterLink
            to="/shipping-addresses"
            class="flex items-center space-x-2 text-text hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-primary"
            active-class="text-primary border-primary"
          >
            <v-icon name="hi-location-marker" scale="1.1" />
            <span>Shipping</span>
          </RouterLink>
        </nav>

        <!-- Auth Navigation (Right Side) -->
        <div class="flex items-center space-x-4">
          <RouterLink
            to="/login"
            class="flex items-center space-x-2 text-text hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border border-transparent hover:border-primary"
            active-class="text-primary border-primary"
          >
            <v-icon name="fa-user-circle" scale="1.1" />
            <span>Login</span>
          </RouterLink>
          <RouterLink
            to="/register"
            class="flex items-center space-x-2 text-text hover:text-error px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border border-transparent hover:border-error"
            active-class="text-error border-error"
          >
            <v-icon name="io-person-add-sharp" scale="1.1" />
            <span>Register</span>
          </RouterLink>
          <RouterLink
            to="/logout"
            class="flex items-center space-x-2 text-text hover:text-error px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border border-transparent hover:border-error"
            active-class="text-error border-error"
          >
            <v-icon name="md-logout-outlined" scale="1.1" />
            <span>Logout</span>
          </RouterLink>

          <!-- light/dark -->
          <button
            @click="toggleDark"
            class="ml-2 p-2 rounded-full border border-transparent hover:bg-accent transition-colors"
            :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
            type="button"
          >
            <v-icon v-if="isDark" name="hi-sun" scale="1.2" class="text-warning" />
            <v-icon v-else name="hi-moon" scale="1.2" class="text-text" />
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="min-h-screen bg-background">
    <RouterView />
  </main>
</template>
