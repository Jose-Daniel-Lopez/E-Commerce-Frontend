<script setup lang="ts">
import { useRouter } from 'vue-router'

// Provisional interface for user data
// TODO: This should match the actual user data structure

interface Props {
  user: {
    id: number
    _links?: {
      orders?: {
        href: string
      }
      addresses?: {
        href: string
      }
      cart?: {
        href: string
      }
      productReviews?: {
        href: string
      }
    }
  }
}

defineProps<Props>()

const router = useRouter()

// User reviews
const goToUserReviews = (userId: number) => {
  router.push({ name: 'userReviews', params: { userId } })
}

// User addresses
const goToUserAddresses = (userId: number) => {
  router.push({ name: 'userAddresses', params: { userId } })
}

// User cart
const goToUserCart = (userId: number) => {
  router.push({ name: 'userCart', params: { userId } })
}
</script>

<template>
  <div class="space-y-2">
    <button
      class="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
    >
      <v-icon name="hi-eye" scale="1" />
      <span>View Details</span>
    </button>

    <div class="grid grid-cols-2 gap-2">
      <button
        v-if="user._links?.orders"
        class="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-xs"
      >
        <v-icon name="hi-shopping-cart" scale="0.8" />
        <span>Orders</span>
      </button>

      <button
        v-if="user._links?.addresses"
        @click="goToUserAddresses(user.id)"
        class="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-xs"
      >
        <v-icon name="hi-location-marker" scale="0.8" />
        <span>Addresses</span>
      </button>

      <button
        v-if="user._links?.cart"
        @click="goToUserCart(user.id)"
        class="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg border border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-xs"
      >
        <v-icon name="hi-shopping-bag" scale="0.8" />
        <span>Cart</span>
      </button>

      <button
        v-if="user._links?.productReviews"
        @click="goToUserReviews(user.id)"
        class="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg border border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors text-xs"
      >
        <v-icon name="hi-star" scale="0.8" />
        <span>Reviews</span>
      </button>
    </div>
  </div>
</template>
