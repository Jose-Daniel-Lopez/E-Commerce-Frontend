<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black min-h-screen">
    <Wrapper class="py-20 max-w-[1300px] mx-auto">
      <!-- Stepper -->
      <div class="flex items-center justify-center mb-20">
        <div class="flex items-center gap-8 w-full max-w-3xl">
          <!-- Step 1: Address -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-12 h-12 flex items-center justify-center rounded-full bg-[#F3F3F3] mr-3">
              <v-icon name="md-locationon" scale="1.5" fill="#BDBDBD"/>
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-[#BDBDBD]">Step 1</span>
              <span class="font-srProDisplay text-base font-semibold text-[#BDBDBD] mt-0.5">Address</span>
            </div>
          </div>
          <!-- Line -->
          <div class="flex-1 h-0.5 bg-[#E5E5E5] mx-2"></div>
          <!-- Step 2: Shipping -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-12 h-12 flex items-center justify-center rounded-full bg-[#F3F3F3] mr-3">
              <v-icon name="md-localshipping" scale="1.5" fill="#BDBDBD"/>
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-[#BDBDBD]">Step 2</span>
              <span class="font-srProDisplay text-base font-semibold text-[#BDBDBD] mt-0.5">Shipping</span>
            </div>
          </div>
          <!-- Line -->
          <div class="flex-1 h-0.5 bg-[#E5E5E5] mx-2"></div>
          <!-- Step 3: Payment -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-12 h-12 flex items-center justify-center rounded-full bg-black mr-3">
              <v-icon name="si-contactlesspayment" scale="2" fill="white"/>
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-black">Step 3</span>
              <span class="font-srProDisplay text-base font-semibold text-black mt-0.5">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-12 max-w-5xl mx-auto">
        <!-- Left Side - Summary -->
        <div class="flex-1">
          <div class="border border-[#E5E5E5] rounded-[10px] p-8">
            <section>
              <h2 class="font-srProDisplay text-lg font-semibold text-[#232340] mb-6">Summary</h2>

              <!-- Products -->
              <div class="space-y-4 mb-8">
                <div v-for="item in cartItems" :key="item.id" class="flex items-center p-2 rounded-[13px] justify-between bg-[#F7F7F7]">
                  <div class="flex items-center gap-3">
                    <div class="w-16 h-16 rounded-lg flex items-center justify-center relative">
                      <img :src="getProductImage(item.product?.name)" :alt="item.product?.name" class="w-12 h-12 object-contain" />
                      <span v-if="item.quantity > 1" class="absolute top-0 right-0 bg-black text-white text-xs rounded-full px-2 py-0.5 font-srProDisplay">x{{ item.quantity }}</span>
                    </div>
                    <span class="font-srProDisplay text-base text-black">{{ item.product?.name }}</span>
                  </div>
                  <span class="font-srProDisplay text-base font-semibold text-black">{{ userCartStore.formatPrice((item.product?.basePrice || 0) * item.quantity) }}</span>
                </div>
              </div>

              <!-- Address -->
              <div class="mb-6">
                <h3 class="font-srProDisplay text-base font-semibold text-black mb-2">Address</h3>
                <div v-if="selectedAddress" class="flex flex-col gap-1">
                  <span class="font-srProDisplay text-sm text-black">{{ selectedAddress.street }}</span>
                  <span class="font-srProDisplay text-sm text-black">{{ selectedAddress.city }}, {{ selectedAddress.state }} {{ selectedAddress.zipCode }}</span>
                  <span class="font-srProDisplay text-sm text-black">{{ selectedAddress.country }}</span>
                  <span v-if="selectedAddress.type" class="font-srProDisplay text-xs text-white bg-black rounded px-2 py-0.5 w-fit mt-1">{{ selectedAddress.type }}</span>
                </div>
                <p v-else class="font-srProDisplay text-gray-400 text-sm">No address selected</p>
              </div>

              <!-- Shipment method -->
              <div class="mb-8">
                <h3 class="font-srProDisplay text-base font-semibold text-black mb-2">Shipment method</h3>
                <p v-if="selectedShipping" class="font-srProDisplay text-[#232340] text-sm">{{ selectedShipping.name }}</p>
                <p v-else class="font-srProDisplay text-gray-400 text-sm">No shipping method selected</p>
              </div>

              <!-- Order Summary -->
              <div class="space-y-3 pt-4 border-t border-[#E5E5E5]">
                <div class="flex justify-between">
                  <span class="font-srProDisplay text-base font-semibold text-black">Subtotal</span>
                  <span class="font-srProDisplay text-base font-semibold text-black">{{ userCartStore.formatPrice(subtotal) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-srProDisplay text-base text-gray-700">Estimated Tax</span>
                  <span class="font-srProDisplay text-base text-gray-700">{{ userCartStore.formatPrice(estimatedTax) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-srProDisplay text-base text-gray-700">Estimated shipping & Handling</span>
                  <span class="font-srProDisplay text-base text-gray-700">{{ userCartStore.formatPrice(shippingCost) }}</span>
                </div>
                <div class="flex justify-between pt-3 border-t border-[#E5E5E5]">
                  <span class="font-srProDisplay text-lg font-bold text-black">Total</span>
                  <span class="font-srProDisplay text-lg font-bold text-black">{{ userCartStore.formatPrice(total) }}</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- Right Side - Payment -->
        <div class="flex-1">
          <section>
            <h2 class="font-srProDisplay text-lg font-semibold text-[#232340] mb-6">Payment</h2>

            <!-- Payment Method Tabs -->
            <div class="flex gap-4 mb-8">
              <button
                v-for="method in paymentMethods"
                :key="method.id"
                @click="selectedPaymentMethod = method.id"
                :class="[
                  'px-4 py-2 rounded-md font-srProDisplay text-sm font-medium transition-colors',
                  selectedPaymentMethod === method.id
                    ? 'bg-black text-white'
                    : 'bg-white text-[#666] border border-[#E5E5E5] hover:border-black'
                ]"
              >
                {{ method.name }}
              </button>
            </div>

            <!-- Credit Card Form -->
            <div v-if="selectedPaymentMethod === 'credit'" class="space-y-6">
              <!-- Credit Card Visual manual -->
              <div class="relative">
                <CreditCard
                  :name="paymentForm.cardholderName"
                  :number="paymentForm.cardNumber"
                  :expiration="paymentForm.expDate"
                  :cvc="paymentForm.cvv"
                  :focused="focusedField"
                />
              </div>

              <!-- Payment Form -->
              <form @submit.prevent="processPayment" class="space-y-4">
                <!-- Cardholder Name -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">Cardholder Name</label>
                  <input
                    v-model="paymentForm.cardholderName"
                    type="text"
                    required
                    @focus="focusedField = 'name'"
                    @blur="focusedField = ''"
                    @input="paymentForm.cardholderName = paymentForm.cardholderName.replace(/\d/g, '')"
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="Enter cardholder name"
                  />
                </div>

                <!-- Card Number -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">Card Number</label>
                  <input
                    v-model="paymentForm.cardNumber"
                    type="text"
                    required
                    maxlength="19"
                    @focus="focusedField = 'number'"
                    @blur="focusedField = ''"
                    @input="formatCardNumber"
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <!-- Exp Date and CVV -->
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="block font-srProDisplay text-sm font-medium text-black mb-2">Exp Date</label>
                    <input
                      v-model="paymentForm.expDate"
                      type="text"
                      required
                      maxlength="5"
                      @focus="focusedField = 'expiry'"
                      @blur="focusedField = ''"
                      @input="formatExpDate"
                      class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div class="flex-1">
                    <label class="block font-srProDisplay text-sm font-medium text-black mb-2">CVV</label>
                    <input
                      v-model="paymentForm.cvv"
                      type="text"
                      required
                      maxlength="3"
                      @focus="focusedField = 'cvv'"
                      @blur="focusedField = ''"
                      class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                      placeholder="123"
                    />
                  </div>
                </div>

                <!-- Same as billing address -->
                <div class="flex items-center gap-2">
                  <input
                    v-model="paymentForm.sameAsBilling"
                    type="checkbox"
                    id="sameAsBilling"
                    class="w-4 h-4 accent-black"
                  />
                  <label for="sameAsBilling" class="font-srProDisplay text-sm text-black">
                    Same as billing address
                  </label>
                </div>
              </form>
            </div>

            <!-- PayPal Option -->
            <div v-else-if="selectedPaymentMethod === 'paypal'" class="text-center py-8">
              <div class="text-blue-600 text-2xl font-bold mb-4">PayPal</div>
              <p class="font-srProDisplay text-[#666] mb-6">You will be redirected to PayPal to complete your payment.</p>
            </div>

            <!-- Apple Pay Option -->
            <div v-else-if="selectedPaymentMethod === 'apple-pay'" class="text-center py-8">
              <div class="border border-black rounded-[8px] inline-block px-4 py-2 mb-4">
                <span class="text-black text-2xl font-bold"> Pay</span>
              </div>
              <p class="font-srProDisplay text-[#666] mb-6">Pay with Apple Pay for a faster checkout.</p>
            </div>
          </section>

          <!-- Navigation Buttons -->
          <div class="flex justify-between gap-4 mt-12">
            <button
              class="px-28 py-5 border border-black rounded-[6px] font-srProDisplay text-black bg-white hover:bg-gray-50 transition"
              @click="goBack"
            >
              Back
            </button>
            <button
              class="px-28 py-5 rounded-[6px] font-srProDisplay text-white bg-black hover:bg-[#232340] transition"
              @click="processPayment"
              :disabled="!isFormValid"
              :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Wrapper from '@/components/shared/Wrapper.vue'
import CreditCard from '@/components/shared/CreditCard.vue'
import { useRouter } from 'vue-router'
import { useUserCartStore } from '@/stores/userCart'
import { useCheckoutStore } from '@/stores/checkout'

const router = useRouter()
const userCartStore = useUserCartStore()
const checkoutStore = useCheckoutStore()

// Payment methods
const paymentMethods = ref([
  { id: 'credit', name: 'Credit Card' },
  { id: 'paypal', name: 'PayPal' },
  { id: 'apple-pay', name: 'Apple Pay' }
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
  sameAsBilling: true
})

// Track focused field for card flip animation
const focusedField = ref('')

// Computed values
const subtotal = computed(() => userCartStore.totalPrice)
const estimatedTax = computed(() => {
  return parseFloat((subtotal.value * 0.05).toFixed(2));
});
const shippingCost = computed(() => selectedShipping.value?.price || 0)
const total = computed(() => subtotal.value + estimatedTax.value + shippingCost.value)

const isFormValid = computed(() => {
  if (selectedPaymentMethod.value === 'credit') {
    return (
      paymentForm.value.cardholderName &&
      paymentForm.value.cardNumber &&
      paymentForm.value.expDate &&
      paymentForm.value.cvv
    );
  }
  return true; // Always valid for PayPal and Apple Pay
})

onMounted(() => {
  // Ensure cart is loaded, if not, redirect or load it
  if (!userCartStore.hasItems) {
    // Maybe redirect to cart page if it's empty
    router.push({ name: 'shoppingCart' })
  }
})

function formatCardNumber() {
  paymentForm.value.cardNumber = paymentForm.value.cardNumber.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpDate() {
  paymentForm.value.expDate = paymentForm.value.expDate.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/')
}

function goBack() {
  router.push({ name: 'checkoutShipping' })
}

function processPayment() {
  if (selectedPaymentMethod.value === 'apple-pay') {
    alert('Payment processed successfully with Apple Pay!');
  } else if (selectedPaymentMethod.value === 'paypal') {
    alert('You will be redirected to PayPal to complete your payment.');
  } else {
    alert('Payment processed successfully!');
  }
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
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(24px);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Avoid that annoying tailwind blue outline */
button:focus {
  outline: none;
  box-shadow: none;
}
</style>
