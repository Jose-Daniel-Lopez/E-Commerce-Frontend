<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

interface ProductReview {
  id: number
  rating: number
  comment: string
  reviewDate?: string
  createdAt?: string
  product?: {
    id: number
    name: string
    basePrice: number
  }
}

interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

const route = useRoute()
const reviews = ref<ProductReview[]>([])
const user = ref<User | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const userId = route.params.userId as string

  try {
    // Obtener información del usuario
    const userResponse = await axios.get(`http://localhost:8080/api/users/${userId}`)
    user.value = userResponse.data

    // Obtener reseñas del usuario
    const reviewsResponse = await axios.get(
      `http://localhost:8080/api/users/${userId}/productReviews`,
    )
    reviews.value = reviewsResponse.data._embedded
      ? reviewsResponse.data._embedded.productReviews
      : reviewsResponse.data
  } catch (err) {
    console.error('Error fetching user reviews:', err)
    error.value = 'Error al cargar las reseñas del usuario'
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return 'Fecha no disponible'
  }

  try {
    const date = new Date(dateString)

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida'
    }

    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Error en fecha'
  }
}

const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) {
    return 'Precio no disponible'
  }

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

const getRatingStars = (rating: number) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const emptyStars = 5 - fullStars

  for (let i = 0; i < fullStars; i++) {
    stars.push({ filled: true, key: `star-${i}` })
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push({ filled: false, key: `empty-${i}` })
  }

  return stars
}

const getRatingBadgeColor = (rating: number) => {
  if (!rating) return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'

  if (rating >= 4) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
  if (rating >= 3) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
  if (rating >= 2) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
  return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
}
</script>

<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div v-if="user" class="flex items-center justify-center space-x-4 mb-4">
          <div
            class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="user.avatar"
              :src="user.avatar"
              :alt="user.name"
              class="w-full h-full object-cover"
              @error="
                ($event.target as HTMLImageElement)?.style &&
                (($event.target as HTMLImageElement).style.display = 'none')
              "
            />
            <span v-else class="text-2xl font-bold text-gray-600 dark:text-gray-300">
              {{ user.name?.charAt(0)?.toUpperCase() || '?' }}
            </span>
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ user.name || 'Usuario' }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300">{{ user.email || '' }}</p>
          </div>
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Reseñas de Productos
        </h3>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Todas las reseñas realizadas por este usuario
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Cargando reseñas...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center"
      >
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="reviews.length === 0" class="text-center py-12">
        <div class="flex justify-center mb-4">
          <div class="bg-yellow-100 dark:bg-yellow-900/30 p-6 rounded-full">
            <v-icon name="hi-star" scale="3" class="text-yellow-500 dark:text-yellow-400" />
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay reseñas</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Este usuario aún no ha realizado ninguna reseña
        </p>
      </div>

      <!-- Reviews List -->
      <div v-else class="space-y-6">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-6">
            <!-- Review Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                    getRatingBadgeColor(review.rating),
                  ]"
                >
                  <div class="flex items-center space-x-1">
                    <span>{{ review.rating || 0 }}/5</span>
                    <v-icon name="hi-star" scale="0.8" class="text-yellow-500" />
                  </div>
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400"> ID: {{ review.id }} </span>
              </div>
              <div class="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <v-icon name="hi-calendar" scale="0.8" />
                <span>{{ formatDate(review.reviewDate || review.createdAt) }}</span>
              </div>
            </div>

            <!-- Product Info -->
            <div v-if="review.product" class="mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Producto:</p>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ review.product.name || 'Producto sin nombre' }}
                  </h4>
                </div>
                <div class="text-right">
                  <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {{ formatPrice(review.product.basePrice) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Stars Rating -->
            <div class="mb-4 flex items-center space-x-1">
              <v-icon
                v-for="star in getRatingStars(review.rating)"
                :key="star.key"
                name="hi-star"
                scale="1.2"
                :class="star.filled ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'"
              />
            </div>

            <!-- Comment -->
            <div class="mb-4">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ review.comment || 'Sin comentario' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-12 text-center">
        <button
          @click="$router.go(-1)"
          class="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
        >
          <v-icon name="hi-arrow-left" scale="1.1" />
          <span>Volver a usuarios</span>
        </button>
      </div>

      <!-- Reviews Count -->
      <div v-if="reviews.length > 0" class="mt-8 text-center">
        <div
          class="inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full"
        >
          <span class="text-yellow-600 dark:text-yellow-400 font-semibold">
            Total: {{ reviews.length }} reseña{{ reviews.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
