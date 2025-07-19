<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black animate-fadeInUp">
    <Wrapper class="py-4">
      <!-- Breadcrumb -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <section class="max-w-7xl mx-auto py-6 mb-6">
        <h1 class="font-srProDisplay text-2xl font-semibold text-left text-black">Shopping Cart</h1>
      </section>

      <section class="max-w-7xl mx-auto mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <!-- Left Panel - Cart Items -->
          <div class="bg-white rounded-lg p-6 h-full">
            <div v-if="userCartStore.loading" class="text-center text-[#666666]">
              Loading cart...
            </div>
            <div v-else-if="userCartStore.error" class="text-center text-red-600">
              {{ userCartStore.error }}
            </div>
            <div v-else-if="!userCartStore.hasItems" class="text-center text-[#666666]">
              Your cart is empty.
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
            <div class="bg-white border border-[#EBEBEB] rounded-[10px] p-6 py-16 h-full">
              <h2 class="font-srProDisplay text-xl font-semibold text-black mb-6">Order Summary</h2>
              <form class="space-y-4" @submit.prevent>
                <!-- Discount Code -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="block font-srProDisplay text-sm text-black"
                      >Discount code / Promo code</label
                    >
                    <transition name="fade">
                      <span
                        v-if="couponEffect"
                        class="text-green-600 font-srProDisplay text-sm animate-bounce ml-2 whitespace-nowrap"
                        >✔ Coupon applied!</span
                      >
                    </transition>
                  </div>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="discountCode"
                      :class="[
                        'w-full px-4 py-5 border border-[#EBEBEB] rounded-[7px] bg-[#FAFAFA] font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200 pr-28',
                        couponEffect ? 'ring-2 ring-green-400' : '',
                      ]"
                      placeholder="Code"
                    />
                    <button
                      type="button"
                      @click="applyDiscount"
                      class="absolute top-1/2 right-4 -translate-y-1/2 px-6 border border-black rounded-[6px] bg-white text-black font-srProDisplay transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200 focus:outline-none text-base cursor-pointer"
                      style="height: 32px; min-width: 75px"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </form>
              <div class="my-6 border-t border-[#EBEBEB] pt-4 space-y-2">
                <div class="flex justify-between font-srProDisplay font-semibold">
                  <span>Subtotal</span>
                  <span>{{ formatPrice(userCartStore.totalPrice) }}</span>
                </div>
                <div class="flex justify-between font-srProDisplay text-[#666666]">
                  <span>Estimated Tax</span>
                  <span>{{ formatPrice(estimatedTax) }}</span>
                </div>
                <div class="flex justify-between font-srProDisplay text-[#666666]">
                  <span>Estimated shipping &amp; Handling</span>
                  <span>{{ formatPrice(estimatedShipping) }}</span>
                </div>
                <div class="flex justify-between font-srProDisplay text-lg font-semibold pt-2">
                  <span>Total</span>
                  <span>{{ formatPrice(total) }}</span>
                </div>
              </div>
              <button
                @click="checkout"
                class="w-full bg-black text-white font-srProDisplay font-medium py-4 rounded-md hover:bg-gray-800 transition-colors duration-200 mt-4 cursor-pointer"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import CartItem from '@/components/cart/CartItem.vue'
import { useUserCartStore } from '@/stores/userCart'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const userCartStore = useUserCartStore()
const authStore = useAuthStore()

const breadcrumbs = [{ label: 'Shopping Cart' }]

const discountCode = ref('')
const discount = ref(0)
const couponEffect = ref(false)

const estimatedTax = computed(() => 5000) // 50.00 € en centavos
const estimatedShipping = computed(() => 2900) // 29.00 € en centavos
const total = computed(
  () =>
    userCartStore.totalPrice - discount.value * 100 + estimatedTax.value + estimatedShipping.value,
)

/**
 * Format price with proper currency formatting
 * Converts from cents (API format) to euros and formats with Spanish locale
 * @param {number} priceInCents - The price in cents (e.g., 222712 = 2227.12 €)
 * @returns {string} Formatted price string (e.g., "2.227,12 €")
 */
const formatPrice = (priceInCents: number): string => {
  const priceInEuros = priceInCents / 100
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInEuros)
}

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

function applyDiscount() {
  // Hardcoded: if code is 'SAVE10', apply 10€ discount
  if (discountCode.value.trim().toUpperCase() === 'SAVE10') {
    discount.value = 10 // 10 euros
    couponEffect.value = true
    setTimeout(() => {
      couponEffect.value = false
    }, 1500)
  } else {
    discount.value = 0
    couponEffect.value = false
  }
}

const checkout = () => {
  // Navigate to contact page
  router.push({ name: 'checkoutAddress' }).then(() => {
    // Scroll to top after navigation with a smooth animation
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
