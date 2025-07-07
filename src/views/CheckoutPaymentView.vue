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
                    <div class="w-16 h-16 rounded-lg flex items-center justify-center">
                      <img :src="item.image" :alt="item.name" class="w-12 h-12 object-contain" />
                    </div>
                    <span class="font-srProDisplay text-base text-black">{{ item.name }}</span>
                  </div>
                  <span class="font-srProDisplay text-base font-semibold text-black">${{ item.price }}</span>
                </div>
              </div>

              <!-- Address -->
              <div class="mb-6">
                <h3 class="font-srProDisplay text-base font-base text-black mb-2">Address</h3>
                <p class="font-srProDisplay text-[#232340] text-sm">{{ selectedAddress }}</p>
              </div>

              <!-- Shipment method -->
              <div class="mb-8">
                <h3 class="font-srProDisplay text-base font-base text-black mb-2">Shipment method</h3>
                <p class="font-srProDisplay text-[#232340] text-sm">{{ selectedShipping }}</p>
              </div>

              <!-- Order Summary -->
              <div class="space-y-3 pt-4 border-t border-[#E5E5E5]">
                <div class="flex justify-between">
                  <span class="font-srProDisplay text-base font-semibold text-black">Subtotal</span>
                  <span class="font-srProDisplay text-base font-semibold text-black">${{ subtotal }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-srProDisplay text-base text-gray-700">Estimated Tax</span>
                  <span class="font-srProDisplay text-base text-gray-700">${{ estimatedTax }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-srProDisplay text-base text-gray-700">Estimated shipping & Handling</span>
                  <span class="font-srProDisplay text-base text-gray-700">${{ shippingCost }}</span>
                </div>
                <div class="flex justify-between pt-3 border-t border-[#E5E5E5]">
                  <span class="font-srProDisplay text-lg font-semibold text-black">Total</span>
                  <span class="font-srProDisplay text-lg font-semibold text-black">${{ total }}</span>
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

            <!-- PayPal Credit Option -->
            <div v-else-if="selectedPaymentMethod === 'paypal-credit'" class="text-center py-8">
              <div class="text-blue-600 text-2xl font-bold mb-4">PayPal Credit</div>
              <p class="font-srProDisplay text-[#666] mb-6">Pay with PayPal Credit and get flexible payment options.</p>
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
import { ref, computed } from 'vue'
import Wrapper from '@/components/shared/Wrapper.vue'
import CreditCard from '@/components/shared/CreditCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Payment methods
const paymentMethods = ref([
  { id: 'credit', name: 'Credit Card' },
  { id: 'paypal', name: 'PayPal' },
  { id: 'paypal-credit', name: 'PayPal Credit' }
])

const selectedPaymentMethod = ref('credit')

// Sample cart items (this would come from a store in real app)
const cartItems = ref([
  {
    id: 1,
    name: 'Apple iPhone 14 Pro Max 128Gb',
    price: 1399,
    image: '/images/Iphone-14-pro-black.png'
  },
  {
    id: 2,
    name: 'AirPods Max Silver',
    price: 549,
    image: '/images/Apple-airPods.png'
  },
  {
    id: 3,
    name: 'Apple Watch Series 9 GPS 41mm',
    price: 399,
    image: '/images/Apple-Watch.png'
  }
])

// Sample address and shipping (this would come from previous steps)
const selectedAddress = ref('1131 Dusty Townline, Jacksonville, TX 40322')
const selectedShipping = ref('Free')

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
const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price, 0))
const estimatedTax = computed(() => {
  return parseFloat((subtotal.value * 0.05).toFixed(2));
});
const shippingCost = computed(() => 29)
const total = computed(() => subtotal.value + estimatedTax.value + shippingCost.value)

const isFormValid = computed(() => {
  return (
    paymentForm.value.cardholderName &&
    paymentForm.value.cardNumber &&
    paymentForm.value.expDate &&
    paymentForm.value.cvv
  )
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
  alert('Payment processed successfully!')
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
</style>
