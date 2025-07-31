<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black animate-fadeInUp">
    <Wrapper class="py-4">
      <!-- Breadcrumb -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <section class="max-w-7xl mx-auto py-6 mb-6">
        <h1 class="font-srProDisplay text-2xl font-semibold text-left text-black">{{ $t('cart.title') }}</h1>
      </section>

      <section class="max-w-7xl mx-auto mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <!-- Left Panel - Cart Items -->
          <div class="bg-white rounded-lg p-6 h-full">
            <div v-if="userCartStore.loading" class="text-center text-[#666666]">
              {{ $t('cart.loading') }}
            </div>
            <div v-else-if="userCartStore.error" class="text-center text-red-600">
              {{ $t('cart.error') }}
            </div>
            <div v-else-if="!userCartStore.hasItems" class="text-center text-[#666666]">
              {{ $t('cart.empty') }}
            </div>
            <div v-else class="divide-y divide-[#EBEBEB]">
              <CartItem
                v-for="item in userCartStore.cartItems"
                :key="item.id"
                :item="item"
                @increment="increment"
                @decrement="decrement"
                @remove="remove"
              />
            </div>
          </div>

          <!-- Right Panel - Order Summary -->
          <div>
            <OrderSummary
              :subtotal="userCartStore.totalPrice"
              :estimated-tax="estimatedTax"
              :estimated-shipping="estimatedShipping"
              :discount="discount"
              @checkout="checkout"
              @apply-discount="applyDiscount"
            />
          </div>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import CartItem from '@/components/cart/CartItem.vue'
import OrderSummary from '@/components/cart/OrderSummary.vue'
import { useUserCartStore } from '@/stores/userCart'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const userCartStore = useUserCartStore()
const authStore = useAuthStore()
const { t } = useI18n()

const breadcrumbs = [{ label: t('cart.title') }]

const discount = ref(0)

const estimatedTax = computed(() => 5000) // 50.00 € en centavos
const estimatedShipping = computed(() => 2900) // 29.00 € en centavos

onMounted(() => {
  if (authStore.user?.id) {
    userCartStore.fetchUserCart(authStore.user.id)
  }
})

function increment(itemId: number, currentQuantity: number) {
  userCartStore.updateItemQuantity(itemId, currentQuantity + 1)
}

function decrement(itemId: number, currentQuantity: number) {
  if (currentQuantity > 1) {
    userCartStore.updateItemQuantity(itemId, currentQuantity - 1)
  }
}

function remove(itemId: number) {
  userCartStore.removeItem(itemId)
}

function applyDiscount(code: string) {
  // Hardcoded: if code is 'SAVE10', apply 10€ discount
  if (code.trim().toUpperCase() === 'SAVE10') {
    discount.value = 10 // 10 euros
  } else {
    discount.value = 0
  }
}

const checkout = () => {
  // Navigate to contact page
  router.push({ name: 'checkoutAddress' })
}
</script>
