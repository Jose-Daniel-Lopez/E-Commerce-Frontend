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
            <div v-if="userCartStore.loading" class="text-center">Loading cart...</div>
            <div v-else-if="userCartStore.error" class="text-center text-red-500">{{ userCartStore.error }}</div>
            <div v-else-if="!userCartStore.hasItems" class="text-center">Your cart is empty.</div>
            <div v-else class="divide-y divide-[#EBEBEB]">
              <div v-for="item in userCartStore.cartItems" :key="item.id" class="flex items-center gap-6 py-8">
                <img :src="getProductImage(item.product?.name)" :alt="item.product?.name" class="w-24 h-24 object-contain rounded-lg bg-gray-50" />
                <div class="flex-1">
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">{{ item.product?.name }}</h3>
                  <p class="text-[#666] text-sm mb-1">#{{ item.productVariant?.sku }}</p>
                  <div class="flex items-center gap-3 mt-2">
                    <button class="w-8 h-8 flex items-center justify-center border border-[#EBEBEB] rounded" @click="decrement(item.id, item.quantity)">-</button>
                    <span class="font-srProDisplay text-base">{{ item.quantity }}</span>
                    <button class="w-8 h-8 flex items-center justify-center border border-[#EBEBEB] rounded" @click="increment(item.id, item.quantity)">+</button>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <span class="font-srProDisplay text-lg font-semibold text-black">{{ userCartStore.formatPrice(item.product?.basePrice ? item.product.basePrice * item.quantity : 0) }}</span>
                  <button class="text-2xl text-[#999] hover:text-black" @click="remove(item.id)">&times;</button>
                </div>
              </div>
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
      <label class="block font-srProDisplay text-sm text-black">Discount code / Promo code</label>
      <transition name="fade">
        <span v-if="couponEffect" class="text-green-600 font-srProDisplay text-sm animate-bounce ml-2 whitespace-nowrap">✔ Coupon applied!</span>
      </transition>
    </div>
    <div class="relative">
      <input type="text" v-model="discountCode" :class="['w-full px-4 py-5 border border-[#9F9F9F] rounded-[7px] bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200 pr-28', couponEffect ? 'ring-2 ring-green-400' : '']" placeholder="Code" />
      <button type="button" @click="applyDiscount"
        class="absolute top-1/2 right-4 -translate-y-1/2 px-6 border border-black rounded-[6px] bg-white text-gray-700 font-srProDisplay font-[12px] transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100 focus:outline-none text-base"
        style="height:32px; min-width:75px;">
        Apply
      </button>
    </div>
  </div>
</form>
              <div class="my-6 border-t border-[#EBEBEB] pt-4 space-y-2">
                <div class="flex justify-between font-srProDisplay text-semibold">
                  <span>Subtotal</span>
                  <span>{{ userCartStore.formatPrice(userCartStore.totalPrice) }}</span>
                </div>
                <div class="flex justify-between font-srProDisplay text-gray-500">
                  <span>Estimated Tax</span>
                  <span>${{ estimatedTax }}</span>
                </div>
                <div class="flex justify-between font-srProDisplay text-gray-500">
                  <span>Estimated shipping &amp; Handling</span>
                  <span>${{ estimatedShipping }}</span>
                </div>
                <div class="flex justify-between font-srProDisplay text-lg font-semibold pt-2">
                  <span>Total</span>
                  <span>{{ userCartStore.formatPrice(total) }}</span>
                </div>
              </div>
              <button @click="checkout" class="w-full bg-black text-white font-srProDisplay font-medium py-4 rounded-md hover:bg-[#333333] transition-colors duration-200 mt-4">Checkout</button>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import '@/assets/base.css'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import { useUserCartStore } from '@/stores/userCart'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const userCartStore = useUserCartStore()
const authStore = useAuthStore()

const breadcrumbs = [
  { label: 'Shopping Cart' }
]

const discountCode = ref('')
const discount = ref(0)
const couponEffect = ref(false)

const estimatedTax = computed(() => 50)
const estimatedShipping = computed(() => 29)
const total = computed(() => userCartStore.totalPrice - discount.value + estimatedTax.value + estimatedShipping.value)

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
  // Hardcoded: if code is 'SAVE10', apply $10 discount
  if (discountCode.value.trim().toUpperCase() === 'SAVE10') {
    discount.value = 10
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
    window.scrollTo({ top: 0, behavior: 'smooth' })})
}

// Helper to get product image. This is a placeholder since the API doesn't provide images.
function getProductImage(productName: string | undefined) {
  if (!productName) return '/public/images/logo.webp'
  if (productName.toLowerCase().includes('iphone 14')) return '/public/images/Iphone-14-pro-purple.png'
  if (productName.toLowerCase().includes('airpods max')) return '/public/images/Apple-airPods.png'
  if (productName.toLowerCase().includes('apple watch')) return '/public/images/Apple-Watch.png'
  return '/public/images/logo.webp'
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
