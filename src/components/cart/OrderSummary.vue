<template>
  <div class="bg-white border border-[#EBEBEB] rounded-[10px] p-6 py-16 h-full">
    <h2 class="font-srProDisplay text-xl font-semibold text-black mb-6">Order Summary</h2>
    
    <!-- Discount Code Form -->
    <form class="space-y-4" @submit.prevent>
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block font-srProDisplay text-sm text-black">
            Discount code / Promo code
          </label>
          <transition name="fade">
            <span
              v-if="couponEffect"
              class="text-green-600 font-srProDisplay text-sm animate-bounce ml-2 whitespace-nowrap"
            >
              ✔ Coupon applied!
            </span>
          </transition>
        </div>
        <div class="relative">
          <input
            type="text"
            v-model="localDiscountCode"
            :class="[
              'w-full px-4 py-5 border border-[#EBEBEB] rounded-[7px] bg-[#FAFAFA] font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-all duration-200 pr-28',
              couponEffect ? 'ring-2 ring-green-400' : '',
            ]"
            placeholder="Code"
          />
          <button
            type="button"
            @click="handleApplyDiscount"
            class="absolute top-1/2 right-4 -translate-y-1/2 px-6 border border-black rounded-[6px] bg-white text-black font-srProDisplay transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200 focus:outline-none text-base cursor-pointer"
            style="height: 32px; min-width: 75px"
          >
            Apply
          </button>
        </div>
      </div>
    </form>

    <!-- Order Summary Details -->
    <div class="my-6 border-t border-[#EBEBEB] pt-4 space-y-2">
      <div class="flex justify-between font-srProDisplay font-semibold">
        <span>Subtotal</span>
        <span>{{ formatPrice(subtotal) }}</span>
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

    <!-- Checkout Button -->
    <button
      @click="$emit('checkout')"
      class="w-full bg-black text-white font-srProDisplay font-medium py-4 rounded-md hover:bg-gray-800 transition-colors duration-200 mt-4 cursor-pointer"
    >
      Checkout
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  subtotal: number
  estimatedTax: number
  estimatedShipping: number
  discount: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  checkout: []
  applyDiscount: [code: string]
}>()

const localDiscountCode = ref('')
const couponEffect = ref(false)

const total = computed(() => 
  props.subtotal - (props.discount * 100) + props.estimatedTax + props.estimatedShipping
)

/**
 * Format price with proper currency formatting
 * Converts from cents (API format) to euros and formats with Spanish locale
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

const handleApplyDiscount = () => {
  // Hardcoded: if code is 'SAVE10', apply 10€ discount
  if (localDiscountCode.value.trim().toUpperCase() === 'SAVE10') {
    couponEffect.value = true
    setTimeout(() => {
      couponEffect.value = false
    }, 1500)
  }
  
  // Emit the discount code to parent
  emit('applyDiscount', localDiscountCode.value)
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
