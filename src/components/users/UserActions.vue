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

// User orders
const goToUserOrders = (userId: number) => {
  router.push({ name: 'userOrders', params: { userId } })
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
      class="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors button-primary"
    >
      <v-icon name="hi-eye" scale="1" />
      <span>View Details</span>
    </button>

    <div class="grid grid-cols-2 gap-2">
      <button
        v-if="user._links?.orders"
        @click="goToUserOrders(user.id)"
  class="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg transition-colors text-xs theme-border theme-text hover:theme-surface"
      >
        <v-icon name="hi-clipboard-list" scale="0.8" />
        <span>Orders</span>
      </button>

      <button
        v-if="user._links?.addresses"
        @click="goToUserAddresses(user.id)"
  class="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg transition-colors text-xs theme-border theme-text hover:theme-surface"
      >
        <v-icon name="hi-location-marker" scale="0.8" />
        <span>Addresses</span>
      </button>

      <button
        v-if="user._links?.cart"
        @click="goToUserCart(user.id)"
  class="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg transition-colors text-xs theme-border theme-text hover:theme-surface"
      >
        <v-icon name="hi-shopping-bag" scale="0.8" />
        <span>Cart</span>
      </button>

      <button
        v-if="user._links?.productReviews"
        @click="goToUserReviews(user.id)"
  class="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg transition-colors text-xs theme-border theme-text hover:theme-surface"
      >
        <v-icon name="hi-star" scale="0.8" />
        <span>Reviews</span>
      </button>
    </div>
  </div>
</template>
