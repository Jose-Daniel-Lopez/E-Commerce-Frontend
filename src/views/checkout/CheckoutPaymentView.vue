<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black min-h-screen">
    <Wrapper class="py-20 max-w-[1300px] mx-auto">
      <!-- Stepper - Mobile optimized -->
      <div class="flex items-center justify-center mb-12 lg:mb-20">
        <div class="flex items-center gap-4 lg:gap-8 w-full max-w-3xl px-4 lg:px-0">
          <!-- Step 1: Address -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-8 h-8 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-[#F3F3F3] mr-2 lg:mr-3">
              <v-icon name="md-locationon" :scale="1" fill="#BDBDBD" class="lg:scale-150" />
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-[#BDBDBD] hidden sm:block">Step 1</span>
              <span class="font-srProDisplay text-sm lg:text-base font-semibold text-[#BDBDBD] mt-0.5"
                >Address</span
              >
            </div>
          </div>
          <!-- Line -->
          <div class="flex-1 h-0.5 bg-[#E5E5E5] mx-1 lg:mx-2"></div>
          <!-- Step 2: Shipping -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-8 h-8 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-[#F3F3F3] mr-2 lg:mr-3">
              <v-icon name="md-localshipping" :scale="1" fill="#BDBDBD" class="lg:scale-150" />
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-[#BDBDBD] hidden sm:block">Step 2</span>
              <span class="font-srProDisplay text-sm lg:text-base font-semibold text-[#BDBDBD] mt-0.5"
                >Shipping</span
              >
            </div>
          </div>
          <!-- Line -->
          <div class="flex-1 h-0.5 bg-[#E5E5E5] mx-1 lg:mx-2"></div>
          <!-- Step 3: Payment -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-8 h-8 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-black mr-2 lg:mr-3">
              <v-icon name="si-contactlesspayment" :scale="1.5" fill="white" class="lg:scale-200" />
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-black hidden sm:block">Step 3</span>
              <span class="font-srProDisplay text-sm lg:text-base font-semibold text-black mt-0.5"
                >Payment</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile: Single column, Desktop: Two columns -->
      <div class="flex flex-col lg:flex-row gap-6 lg:gap-12 max-w-5xl mx-auto px-4 lg:px-0">
        <!-- Payment Section - Shows first on mobile -->
        <div class="flex-1 order-2 lg:order-2">
          <section>
            <h2 class="font-srProDisplay text-lg font-semibold text-[#232340] mb-6">{{ $t('checkout.payment') }}</h2>

            <!-- Payment Method Tabs - Mobile optimized -->
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8">
              <button
                v-for="method in paymentMethods"
                :key="method.id"
                @click="selectedPaymentMethod = method.id"
                :class="[
                  'px-4 py-3 sm:py-2 rounded-md font-srProDisplay text-sm font-medium transition-colors min-h-[44px]',
                  selectedPaymentMethod === method.id
                    ? 'bg-black text-white'
                    : 'bg-white text-[#666] border border-[#E5E5E5] hover:border-black',
                ]"
              >
                {{ method.name }}
              </button>
            </div>

            <!-- Credit Card Form -->
            <div v-if="selectedPaymentMethod === 'credit'" class="space-y-6">
              <!-- Credit Card Visual - Mobile responsive -->
              <div class="relative flex justify-center lg:justify-start">
                <div class="w-full max-w-[320px] lg:max-w-none">
                  <CreditCard
                    :name="paymentForm.cardholderName"
                    :number="paymentForm.cardNumber"
                    :expiration="paymentForm.expDate"
                    :cvc="paymentForm.cvv"
                    :focused="focusedField"
                    class="scale-90 sm:scale-100"
                  />
                </div>
              </div>

              <!-- Payment Form -->
              <form @submit.prevent="processPayment" class="space-y-4">
                <!-- Cardholder Name -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2"
                    >Cardholder Name</label
                  >
                  <input
                    v-model="paymentForm.cardholderName"
                    type="text"
                    required
                    @focus="focusedField = 'name'"
                    @blur="focusedField = ''"
                    @input="
                      paymentForm.cardholderName = paymentForm.cardholderName.replace(/\d/g, '')
                    "
                    class="w-full px-4 py-4 lg:py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-base lg:text-sm text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="Enter cardholder name"
                  />
                </div>

                <!-- Card Number -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2"
                    >Card Number</label
                  >
                  <input
                    v-model="paymentForm.cardNumber"
                    type="text"
                    required
                    maxlength="19"
                    @focus="focusedField = 'number'"
                    @blur="focusedField = ''"
                    @input="formatCardNumber"
                    class="w-full px-4 py-4 lg:py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-base lg:text-sm text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <!-- Exp Date and CVV -->
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="block font-srProDisplay text-sm font-medium text-black mb-2"
                      >Exp Date</label
                    >
                    <input
                      v-model="paymentForm.expDate"
                      type="text"
                      required
                      maxlength="5"
                      @focus="focusedField = 'expiry'"
                      @blur="focusedField = ''"
                      @input="formatExpDate"
                      class="w-full px-4 py-4 lg:py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-base lg:text-sm text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div class="flex-1">
                    <label class="block font-srProDisplay text-sm font-medium text-black mb-2"
                      >CVV</label
                    >
                    <input
                      v-model="paymentForm.cvv"
                      type="text"
                      required
                      maxlength="3"
                      @focus="focusedField = 'cvv'"
                      @blur="focusedField = ''"
                      class="w-full px-4 py-4 lg:py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-base lg:text-sm text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                      placeholder="123"
                    />
                  </div>
                </div>

                <!-- Same as billing address -->
                <div class="flex items-center gap-2 py-2">
                  <input
                    v-model="paymentForm.sameAsBilling"
                    type="checkbox"
                    id="sameAsBilling"
                    class="w-5 h-5 lg:w-4 lg:h-4 accent-black"
                  />
                  <label for="sameAsBilling" class="font-srProDisplay text-sm text-black">
                    Same as billing address
                  </label>
                </div>
              </form>
            </div>

            <!-- PayPal Option -->
            <div v-else-if="selectedPaymentMethod === 'paypal'" class="text-center py-8">
              <div class="text-blue-600 text-2xl font-bold mb-4" />
              <v-icon name="bi-paypal" :scale="1" fill="#666" class="lg:scale-150 mb-1" />
                <span class="text-black text-2xl font-bold"> Paypal</span>
              <p class="font-srProDisplay text-[#666] mb-6">
                You will be redirected to PayPal to complete your payment.
              </p>
            </div>

            <!-- Apple Pay Option -->
            <div v-else-if="selectedPaymentMethod === 'apple-pay'" class="text-center py-8">
              <div class="border border-black rounded-[8px] inline-block px-4 py-2 mb-4">
                <v-icon name="bi-apple" :scale="1" fill="#666" class="lg:scale-150 mb-1" />
                <span class="text-black text-2xl font-bold"> Pay</span>
              </div>
              <p class="font-srProDisplay text-[#666] mb-6">
                Pay with Apple Pay for a faster checkout.
              </p>
            </div>
          </section>
        </div>

        <!-- Summary Section - Shows second on mobile -->
        <div class="flex-1 order-1 lg:order-1">
          <div class="border border-[#E5E5E5] rounded-[10px] p-4 lg:p-8">
            <section>
              <h2 class="font-srProDisplay text-lg font-semibold text-[#232340] mb-6">{{ $t('checkout.summary') }}</h2>

              <!-- Products - Mobile optimized -->
              <div class="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                <div
                  v-for="item in cartItems"
                  :key="item.id"
                  class="flex items-center p-3 lg:p-2 rounded-[13px] justify-between bg-[#F7F7F7]"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center relative">
                      <img
                        :src="item.product?.imageUrl || getProductImage(item.product?.name)"
                        :alt="item.product?.name"
                        class="w-10 h-10 lg:w-12 lg:h-12 object-contain"
                      />
                      <span
                        v-if="item.quantity > 1"
                        class="absolute -top-1 -right-1 lg:top-0 lg:right-0 bg-black text-white text-xs rounded-full px-1.5 py-0.5 lg:px-2 font-srProDisplay min-w-[18px] text-center"
                        >x{{ item.quantity }}</span
                      >
                    </div>
                    <span class="font-srProDisplay text-sm lg:text-base text-black line-clamp-2">{{
                      item.product?.name
                    }}</span>
                  </div>
                  <span class="font-srProDisplay text-sm lg:text-base font-semibold text-black whitespace-nowrap ml-2">{{
                    userCartStore.formatPrice((item.product?.basePrice || 0) * item.quantity)
                  }}</span>
                </div>
              </div>

              <!-- Address -->
              <div class="mb-4 lg:mb-6">
                <h3 class="font-srProDisplay text-base font-semibold text-black mb-2">{{ $t('checkout.address') }}</h3>
                <div v-if="selectedAddress" class="flex flex-col gap-1">
                  <span class="font-srProDisplay text-sm text-black">{{
                    selectedAddress.street
                  }}</span>
                  <span class="font-srProDisplay text-sm text-black"
                    >{{ selectedAddress.city }}, {{ selectedAddress.state }}
                    {{ selectedAddress.zipCode }}</span
                  >
                  <span class="font-srProDisplay text-sm text-black">{{
                    selectedAddress.country
                  }}</span>
                  <span
                    v-if="selectedAddress.addressType"
                    class="font-srProDisplay text-xs text-white bg-black rounded px-2 py-0.5 w-fit mt-1"
                    >{{ selectedAddress.addressType }}</span
                  >
                </div>
                <p v-else class="font-srProDisplay text-gray-400 text-sm">{{ $t('checkout.noAddress') }}</p>
              </div>

              <!-- Shipment method -->
              <div class="mb-6 lg:mb-8">
                <h3 class="font-srProDisplay text-base font-semibold text-black mb-2">
                  {{ $t('checkout.shipmentMethod') }}
                </h3>
                <div v-if="selectedShipping" class="space-y-1">
                  <p class="font-srProDisplay text-[#232340] text-sm">
                    {{ selectedShipping.name }}
                  </p>
                  <p
                    v-if="selectedShipping.id === '3' && selectedShipping.selectedDate"
                    class="font-srProDisplay text-[#666] text-xs"
                  >
                    Scheduled for: {{ selectedShipping.selectedDate }}
                  </p>
                </div>
                <p v-else class="font-srProDisplay text-gray-400 text-sm">
                  {{ $t('checkout.noShipping') }}
                </p>
              </div>

              <!-- Order Summary -->
              <div class="space-y-3 pt-4 border-t border-[#E5E5E5]">
                <div class="flex justify-between">
                  <span class="font-srProDisplay text-base font-semibold text-black">{{ $t('checkout.subtotal') }}</span>
                  <span class="font-srProDisplay text-base font-semibold text-black">{{
                    userCartStore.formatPrice(subtotal)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-srProDisplay text-base text-gray-700">{{ $t('checkout.estimatedTax') }}</span>
                  <span class="font-srProDisplay text-base text-gray-700">{{
                    userCartStore.formatPrice(estimatedTax)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-srProDisplay text-base text-gray-700">
                    {{ $t('checkout.estimatedShipping') }}
                  </span>
                  <span class="font-srProDisplay text-base text-gray-700">{{
                    userCartStore.formatPrice(shippingCost)
                  }}</span>
                </div>
                <div class="flex justify-between pt-3 border-t border-[#E5E5E5]">
                  <span class="font-srProDisplay text-lg font-bold text-black">{{ $t('checkout.total') }}</span>
                  <span class="font-srProDisplay text-lg font-bold text-black">{{
                    userCartStore.formatPrice(total)
                  }}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons - Mobile optimized -->
      <div class="flex flex-col sm:flex-row justify-between gap-4 max-w-5xl mx-auto mt-8 px-4 lg:px-0">
        <button
          class="px-8 sm:px-28 py-4 lg:py-5 border border-black rounded-[6px] font-srProDisplay text-black bg-white hover:bg-gray-50 transition min-h-[48px] order-2 sm:order-1"
          @click="goBack"
        >
          Back
        </button>
        <button
          class="px-8 sm:px-28 py-4 lg:py-5 rounded-[6px] font-srProDisplay text-white bg-black hover:bg-[#232340] transition min-h-[48px] order-1 sm:order-2"
          @click="processPayment"
          :disabled="!isFormValid"
          :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
        >
          Pay
        </button>
      </div>
    </Wrapper>
  </div>
</template>

<!-- Script remains the same -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Wrapper from '@/components/shared/Wrapper.vue'
import CreditCard from '@/components/shared/CreditCard.vue'
import { useRouter } from 'vue-router'
import { useUserCartStore } from '@/stores/userCart'
import { useCheckoutStore } from '@/stores/checkout'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const userCartStore = useUserCartStore()
const checkoutStore = useCheckoutStore()
const toast = useToast()
const authStore = useAuthStore()

// Payment methods
const paymentMethods = ref([
  { id: 'credit', name: 'Credit Card' },
  { id: 'paypal', name: 'PayPal' },
  { id: 'apple-pay', name: 'Apple Pay' },
])

const selectedPaymentMethod = ref('credit')

// Computed properties from stores
const cartItems = computed(() => userCartStore.cartItems)
const selectedAddress = computed(() => checkoutStore.selectedAddress)
const selectedShipping = computed(() => checkoutStore.selectedShippingMethod)

// Payment form
const paymentForm = ref({
  cardholderName: '',
  cardNumber: '',
  expDate: '',
  cvv: '',
  sameAsBilling: true,
})

// Track focused field for card flip animation
const focusedField = ref('')

// Computed values
const subtotal = computed(() => userCartStore.totalPrice)
const estimatedTax = computed(() => {
  return parseFloat((subtotal.value * 0.05).toFixed(2))
})
const shippingCost = computed(() => selectedShipping.value?.price || 0)
const total = computed(() => subtotal.value + estimatedTax.value + shippingCost.value)

const isFormValid = computed(() => {
  if (selectedPaymentMethod.value === 'credit') {
    return (
      paymentForm.value.cardholderName &&
      paymentForm.value.cardNumber &&
      paymentForm.value.expDate &&
      paymentForm.value.cvv
    )
  }
  return true // Always valid for PayPal and Apple Pay
})

onMounted(() => {
  // Ensure cart is loaded, if not, redirect or load it
  if (!userCartStore.hasItems) {
    // Maybe redirect to cart page if it's empty
    router.push({ name: 'shoppingCart' })
  }
})

function formatCardNumber() {
  paymentForm.value.cardNumber = paymentForm.value.cardNumber
    .replace(/\D/g, '')
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpDate() {
  paymentForm.value.expDate = paymentForm.value.expDate
    .replace(/\D/g, '')
    .replace(/(\d{2})(?=\d)/g, '$1/')
}

function goBack() {
  router.push({ name: 'checkoutShipping' })
}

async function processPayment() {
  if (!isFormValid.value) {
    toast.warning('Please complete all required payment information', {
      title: 'Payment Information Required'
    })
    return
  }

  let loadingMessage = 'Processing payment...'
  let successMessage = 'Credit card payment completed successfully!'

  if (selectedPaymentMethod.value === 'apple-pay') {
    loadingMessage = 'Processing Apple Pay payment...'
    successMessage = 'Payment completed successfully with Apple Pay!'
  } else if (selectedPaymentMethod.value === 'paypal') {
    loadingMessage = 'Redirecting to PayPal...'
    successMessage = 'PayPal payment completed successfully!'
  }

  try {
    const paymentLoader = toast.loading(loadingMessage)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // --- ORDER CREATION LOGIC ---
    const userId = authStore.user?.id
    const shippingAddressId = selectedAddress.value?.id
    // If you have a discount code, add it here
    const discountCode: string | undefined = undefined
    // Example: discountCode = checkoutStore.discountCode
    if (!userId || !shippingAddressId) {
      paymentLoader.error('Missing user or address information.', { title: 'Order Error' })
      return
    }
    const orderResult = await userCartStore.createOrder({ userId, shippingAddressId, discountCode })
    if (!orderResult.success) {
      paymentLoader.error('Order creation failed. Please try again.', { title: 'Order Error' })
      return
    }
    // --- END ORDER CREATION ---

    const clearResult = await userCartStore.clearCart()
    if (clearResult.success) {
      checkoutStore.clearCheckoutState()
      paymentLoader.success(successMessage, { title: 'Payment Successful' })
      setTimeout(() => {
        toast.success('Your order has been confirmed and will be processed shortly.', {
          title: 'Order Confirmed',
          duration: 5000,
          action: {
            label: 'View Orders',
            handler: () => {
              router.push({ name: 'userAccount' })
            }
          }
        })
      }, 1000)
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 2500)
    } else {
      console.error('Failed to clear cart:', clearResult.error)
      paymentLoader.error('Payment was successful, but there was an issue processing your order.', { title: 'Processing Error' })
      toast.warning('Please refresh the page or contact support if the issue persists.', {
        title: 'Action Required',
        persistent: true,
        action: {
          label: 'Refresh Page',
          handler: () => {
            window.location.reload()
          }
        }
      })
    }
  } catch (error) {
    console.error('Error processing payment:', error)
    toast.error('There was an error processing your payment. Please try again.', {
      title: 'Payment Error',
      duration: 6000
    })
  }
}

// Helper to get product image. This is a placeholder since the API doesn't provide images.
function getProductImage(productName: string | undefined) {
  if (!productName) return '/public/images/logo.webp'
  if (productName.toLowerCase().includes('iphone 14'))
    return '/public/images/Iphone-14-pro-purple.png'
  if (productName.toLowerCase().includes('airpods max')) return '/public/images/Apple-airPods.png'
  if (productName.toLowerCase().includes('apple watch')) return '/public/images/Apple-Watch.png'
  return '/public/images/logo.webp'
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(24px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Avoid that annoying tailwind blue outline */
button:focus {
  outline: none;
  box-shadow: none;
}

/* Mobile-specific utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
