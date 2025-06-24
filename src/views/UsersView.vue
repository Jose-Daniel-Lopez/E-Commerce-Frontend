<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

interface User {
  id: number
  name: string
  email: string
  password?: string  // Opcional por seguridad
  avatar?: string
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER'
  addresses?: Array<any>
  cart?: any
  productReviews?: Array<any>
  orders?: Array<any>
}

const users = ref<User[]>([])
const loading = ref(true)
const error = ref('')
const router = useRouter()

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/users')
    // Con Spring Data REST, los usuarios están en response.data._embedded.users
    users.value = response.data._embedded ? response.data._embedded.users : response.data
    
    // Para cada usuario, obtener sus datos relacionados
    await Promise.all(users.value.map(async (user) => {
      try {
        // Obtener direcciones del usuario
        const addressesResponse = await axios.get(`http://localhost:8080/api/users/${user.id}/addresses`)
        user.addresses = addressesResponse.data._embedded ? addressesResponse.data._embedded.addresses : []
        
        // Obtener carrito del usuario
        try {
          const cartResponse = await axios.get(`http://localhost:8080/api/users/${user.id}/cart`)
          user.cart = cartResponse.data
        } catch (cartErr) {
          // Si no tiene carrito, es normal
          user.cart = null
        }
        
        // Obtener reseñas del usuario
        const reviewsResponse = await axios.get(`http://localhost:8080/api/users/${user.id}/productReviews`)
        user.productReviews = reviewsResponse.data._embedded ? reviewsResponse.data._embedded.productReviews : []
        
        // Obtener pedidos del usuario
        const ordersResponse = await axios.get(`http://localhost:8080/api/users/${user.id}/orders`)
        user.orders = ordersResponse.data._embedded ? ordersResponse.data._embedded.orders : []
        
      } catch (relationErr) {
        console.warn(`Error fetching relations for user ${user.id}:`, relationErr)
        // Establecer valores por defecto si falla alguna relación
        user.addresses = user.addresses || []
        user.productReviews = user.productReviews || []
        user.orders = user.orders || []
        user.cart = user.cart || null
      }
    }))
    
  } catch (err) {
    console.error('Error fetching users:', err)
    error.value = 'Error al cargar los usuarios'
  } finally {
    loading.value = false
  }
})

const getRoleColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    case 'SELLER':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
    case 'CUSTOMER':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'
  }
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return '👑'
    case 'SELLER':
      return '🏪'
    case 'CUSTOMER':
      return '👤'
    default:
      return '❓'
  }
}

const getAddressCount = (user: User) => {
  return user.addresses ? user.addresses.length : 0
}

const getOrdersCount = (user: User) => {
  return user.orders ? user.orders.length : 0
}

const getReviewsCount = (user: User) => {
  return user.productReviews ? user.productReviews.length : 0
}

const hasCart = (user: User) => {
  return user.cart ? true : false
}

const viewUserDetails = async (userId: number) => {
  // Aquí podrías navegar a una vista de detalles del usuario
  console.log(`Ver detalles del usuario ${userId}`)
}

const viewUserAddresses = async (userId: number) => {
  // Navegar a las direcciones del usuario
  window.open(`http://localhost:8080/api/users/${userId}/addresses`, '_blank')
}

const viewUserOrders = async (userId: number) => {
  // Navegar a los pedidos del usuario
  window.open(`http://localhost:8080/api/users/${userId}/orders`, '_blank')
}

const viewUserReviews = async (userId: number) => {
  // Navegar a las reseñas del usuario usando Vue Router
  router.push({ name: 'userReviews', params: { userId: userId.toString() } })
}

const viewUserCart = async (userId: number) => {
  // Navegar al carrito del usuario
  window.open(`http://localhost:8080/api/users/${userId}/cart`, '_blank')
}
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Lista de Usuarios</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Gestiona todos los usuarios de tu plataforma
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Cargando usuarios...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center"
      >
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="users.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">👥</div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay usuarios</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Aún no se han registrado usuarios en la plataforma
        </p>
      </div>

      <!-- Users Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="user in users"
          :key="user.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- User Header -->
          <div class="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 text-white relative">
            <!-- Role Badge -->
            <div class="absolute top-4 right-4">
              <span
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  'bg-white/20 text-white'
                ]"
              >
                {{ getRoleIcon(user.role) }} {{ user.role }}
              </span>
            </div>

            <!-- Avatar -->
            <div class="flex items-center space-x-4">
              <div class="relative">
                <div
                  v-if="user.avatar"
                  class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden"
                >
                  <img 
                    :src="user.avatar" 
                    :alt="user.name"
                    class="w-full h-full object-cover"
                    @error="$event.target.style.display = 'none'"
                  />
                </div>
                <div
                  v-else
                  class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <span class="text-2xl font-bold">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
              </div>
              
              <div class="flex-1">
                <h3 class="text-xl font-bold truncate">{{ user.name }}</h3>
                <p class="text-white/80 text-sm truncate">{{ user.email }}</p>
              </div>
            </div>
          </div>

          <!-- User Details -->
          <div class="p-6">
            <!-- User ID -->
            <div class="mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                ID: {{ user.id }}
              </span>
            </div>

            <!-- Statistics Grid -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <!-- Addresses -->
              <div 
                @click="viewUserAddresses(user.id)"
                class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ getAddressCount(user) }}
                </div>
                <div class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  🏠 Direcciones
                </div>
              </div>

              <!-- Orders -->
              <div 
                @click="viewUserOrders(user.id)"
                class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
              >
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ getOrdersCount(user) }}
                </div>
                <div class="text-xs text-green-600 dark:text-green-400 font-medium">
                  📦 Pedidos
                </div>
              </div>

              <!-- Reviews -->
              <div 
                @click="viewUserReviews(user.id)"
                class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors"
              >
                <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {{ getReviewsCount(user) }}
                </div>
                <div class="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  ⭐ Reseñas
                </div>
              </div>

              <!-- Cart Status -->
              <div 
                @click="viewUserCart(user.id)"
                :class="[
                  'rounded-lg p-3 text-center transition-colors',
                  hasCart(user) 
                    ? 'bg-purple-50 dark:bg-purple-900/20 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/40' 
                    : 'bg-gray-50 dark:bg-gray-900/20'
                ]"
              >
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {{ hasCart(user) ? '✅' : '❌' }}
                </div>
                <div class="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  🛒 Carrito
                </div>
              </div>
            </div>

            <!-- User Actions -->
            <div class="space-y-2">
              <button
                @click="viewUserDetails(user.id)"
                class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                Ver detalles
              </button>
              <div class="flex space-x-2">
                <button
                  class="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  ✏️ Editar
                </button>
                <button
                  class="flex-1 py-2 px-4 rounded-lg border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            <!-- Avatar URL (if exists) -->
            <div v-if="user.avatar" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                Avatar: {{ user.avatar }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New User Button -->
      <div class="mt-12 text-center">
        <button
          class="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
          <span class="mr-2">➕</span>
          Agregar nuevo usuario
        </button>
      </div>

      <!-- Users Count -->
      <div v-if="users.length > 0" class="mt-8 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
        >
          <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
            Total: {{ users.length }} usuario{{ users.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si necesitas personalización específica */
</style>