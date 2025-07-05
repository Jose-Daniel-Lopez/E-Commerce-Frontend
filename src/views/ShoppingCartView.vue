<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black">
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
            <div class="divide-y divide-[#EBEBEB]">
              <div v-for="(item, idx) in cartItems" :key="item.id" class="flex items-center gap-6 py-8">
                <img :src="item.image" :alt="item.name" class="w-24 h-24 object-contain rounded-lg bg-gray-50" />
                <div class="flex-1">
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">{{ item.name }}</h3>
                  <p class="text-[#666] text-sm mb-1">#{{ item.sku }}</p>
                  <div class="flex items-center gap-3 mt-2">
                    <button class="w-8 h-8 flex items-center justify-center border border-[#EBEBEB] rounded" @click="decrement(idx)">-</button>
                    <span class="font-srProDisplay text-base">{{ item.qty }}</span>
                    <button class="w-8 h-8 flex items-center justify-center border border-[#EBEBEB] rounded" @click="increment(idx)">+</button>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <span class="font-srProDisplay text-lg font-semibold text-black">${{ item.price * item.qty }}</span>
                  <button class="text-2xl text-[#999] hover:text-black" @click="remove(idx)">&times;</button>
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
                  <span>${{ subtotal }}</span>
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
                  <span>${{ total }}</span>
                </div>
              </div>
              <button class="w-full bg-black text-white font-srProDisplay font-medium py-4 rounded-md hover:bg-[#333333] transition-colors duration-200 mt-4">Checkout</button>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'

const breadcrumbs = [
  { label: 'Shopping Cart' }
]

const cartItems = ref([
  {
    id: 1,
    name: 'Apple iPhone 14 Pro Max 128Gb Deep Purple',
    sku: '25139526913984',
    image: '/public/images/Iphone-14-pro-purple.png',
    price: 1399,
    qty: 1
  },
  {
    id: 2,
    name: 'AirPods Max Silver',
    sku: '53459358345',
    image: '/public/images/Apple-airPods.png',
    price: 549,
    qty: 1
  },
  {
    id: 3,
    name: 'Apple Watch Series 9 GPS 41mm Starlight Aluminium',
    sku: '63632324',
    image: '/public/images/Apple-Watch.png',
    price: 399,
    qty: 1
  }
])


const discountCode = ref('')
const discount = ref(0)
const couponEffect = ref(false)

const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0))
const estimatedTax = computed(() => 50)
const estimatedShipping = computed(() => 29)
const total = computed(() => subtotal.value - discount.value + estimatedTax.value + estimatedShipping.value)

function increment(idx: number) {
  cartItems.value[idx].qty++
}
function decrement(idx: number) {
  if (cartItems.value[idx].qty > 1) cartItems.value[idx].qty--
}
function remove(idx: number) {
  cartItems.value.splice(idx, 1)
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
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
