<template>
  <div class="bg-background border border-border rounded-[10px] p-6 py-16 h-full">
    <!-- Section header for order summary -->
    <h2 class="font-srProDisplay text-xl font-semibold text-black mb-6">
      Order Summary
    </h2>

    <!-- Discount Code Form -->
    <form class="space-y-4" @submit.prevent>
      <div>
        <!-- Label and success feedback -->
        <div class="flex items-center justify-between mb-2">
          <label class="block font-srProDisplay text-sm text-black">
            Discount code / Promo code
          </label>

          <!-- Success feedback with transition effect when coupon is applied -->
          <transition name="fade">
            <span
              v-if="couponEffect"
              class="text-green-600 font-srProDisplay text-sm animate-bounce ml-2 whitespace-nowrap"
            >
              ✔ Coupon applied!
            </span>
          </transition>
        </div>

        <!-- Input field with apply button -->
        <div class="relative">
          <input
            type="text"
            v-model="localDiscountCode"
            :class="[
              'w-full px-4 py-5 border border-border rounded-[7px] bg-surface font-srProDisplay text-foreground placeholder-muted focus:outline-none focus:border-border focus:ring-2 focus:ring-black/20 transition-all duration-200 pr-28',
              couponEffect ? 'ring-2 ring-green-400' : '',
            ]"
            placeholder="Code"
          />
          <button
            type="button"
            @click="handleApplyDiscount"
            class="absolute top-1/2 right-4 -translate-y-1/2 px-6 border border-black rounded-[6px] bg-background text-foreground font-srProDisplay transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200 focus:outline-none text-base cursor-pointer"
            style="height: 32px; min-width: 75px"
          >
            Apply
          </button>
        </div>
      </div>
    </form>

    <!-- Order Summary Details -->
  <div class="my-6 border-t border-border pt-4 space-y-2">
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
      :disabled="props.isCartEmpty"
  class="w-full bg-primary text-primary-foreground font-srProDisplay font-medium py-4 rounded-md hover:opacity-95 transition-colors duration-200 mt-4 cursor-pointer"
      :class="{ 'opacity-50 cursor-not-allowed': props.isCartEmpty }"
    >
      Checkout
    </button>
  </div>
</template>

<script setup lang="ts">
// Vue imports
import { ref, computed } from 'vue'

/**
 * Props definition for OrderSummary component
 *
 * All values are expected in cents (integer) to avoid floating-point precision issues.
 */
interface Props {
  subtotal: number // Cart subtotal in cents
  estimatedTax: number // Estimated tax in cents
  estimatedShipping: number // Estimated shipping cost in cents
  discount: number // Discount amount in euros (converted to cents internally)
  isCartEmpty: boolean // Flag to disable checkout if cart is empty
}

const props = defineProps<Props>()

/**
 * Events emitted by this component:
 * - 'checkout': Triggered when user clicks checkout button
 * - 'applyDiscount': Sends the entered discount code to parent for processing
 */
const emit = defineEmits<{
  checkout: []
  applyDiscount: [code: string]
}>()

/**
 * Local state
 */
const localDiscountCode = ref<string>('') // Tracks user input for discount code
const couponEffect = ref<boolean>(false) // Controls visual feedback animation

/**
 * Computed total price
 * - Subtotal (in cents)
 * - Minus discount (converted from euros to cents)
 * - Plus tax and shipping (in cents)
 */
const total = computed<number>(() => {
  return (
    props.subtotal -
    props.discount * 100 + // Convert euros to cents
    props.estimatedTax +
    props.estimatedShipping
  )
})

/**
 * Format price from cents to localized currency string
 * Uses Spanish locale (es-ES) with EUR currency formatting
 *
 * @param priceInCents - The amount in cents (e.g., 1299 = €12.99)
 * @returns Formatted currency string (e.g., "12,99 €")
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

/**
 * Handle discount code application
 * - Triggers visual feedback if the code is 'SAVE10'
 * - Emits the code to parent component for business logic processing
 * - Clears visual effect after 1.5 seconds
 */
const handleApplyDiscount = () => {
  const code = localDiscountCode.value.trim().toUpperCase()

  // Visual feedback for successful coupon (hardcoded for 'SAVE10')
  if (code === 'SAVE10') {
    couponEffect.value = true
    setTimeout(() => {
      couponEffect.value = false
    }, 1500)
  }

  // Always emit the code so parent can apply discount logic
  emit('applyDiscount', localDiscountCode.value)
}
</script>

<style scoped>
/* Fade transition for coupon success message */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
