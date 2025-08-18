<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black min-h-screen">
    <Wrapper class="py-20 max-w-[1300px] mx-auto">
      <!-- Stepper -->
      <div class="flex items-center justify-center mb-20">
        <div class="flex items-center gap-8 w-full max-w-3xl">
          <!-- Step 1: Address -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-12 h-12 flex items-center justify-center rounded-full bg-[#F3F3F3] mr-3">
              <v-icon name="md-locationon" scale="1.5" fill="#BDBDBD" />
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-[#BDBDBD]">Step 1</span>
              <span class="font-srProDisplay text-base font-semibold text-[#BDBDBD] mt-0.5"
                >Address</span
              >
            </div>
          </div>
          <!-- Line -->
          <div class="flex-1 h-0.5 bg-[#E5E5E5] mx-2"></div>
          <!-- Step 2: Shipping -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-12 h-12 flex items-center justify-center rounded-full bg-black mr-3">
              <v-icon name="md-localshipping" scale="1.5" fill="white" />
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-black">Step 2</span>
              <span class="font-srProDisplay text-base font-semibold text-black mt-0.5"
                >Shipping</span
              >
            </div>
          </div>
          <!-- Line -->
          <div class="flex-1 h-0.5 bg-[#E5E5E5] mx-2"></div>
          <!-- Step 3: Payment -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-12 h-12 flex items-center justify-center rounded-full bg-[#F3F3F3] mr-3">
              <v-icon name="si-contactlesspayment" scale="2" fill="#BDBDBD" />
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-[#BDBDBD]">Step 3</span>
              <span class="font-srProDisplay text-base font-semibold text-[#BDBDBD] mt-0.5"
                >Payment</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Select Shipping Method -->
      <section class="max-w-5xl mx-auto">
        <h2 class="font-srProDisplay text-lg font-semibold text-[#232340] mb-6">{{ $t('checkout.shipmentMethod') }}</h2>
        <div class="space-y-6 overflow-visible">
          <div
            v-for="method in shippingMethods"
            :key="method.id"
            class="bg-[#F7F7F7] rounded-xl p-6 flex items-center justify-between overflow-visible relative"
          >
            <label class="flex items-start gap-4 cursor-pointer flex-1 w-full">
              <input
                type="radio"
                name="selectedShipping"
                :value="method.id"
                v-model="selectedShippingId"
                class="accent-black w-5 h-5 mt-1"
              />
              <div class="flex flex-1 items-center justify-between w-full">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-srProDisplay text-base font-semibold text-black">{{
                      method.name
                    }}</span>
                    <span
                      class="ml-2 px-2 py-0.5 rounded bg-black text-white text-xs font-srProDisplay font-semibold"
                      >{{ userCartStore.formatPrice(method.price) }}</span
                    >
                  </div>
                  <div class="font-srProDisplay text-[#232340] text-base mb-2">
                    {{ method.description }}
                  </div>
                </div>
                <div class="flex items-center relative overflow-visible">
                  <!-- Show estimated delivery or "Select Date" for schedule -->
                  <span
                    class="font-srProDisplay text-[#232340] text-base whitespace-nowrap"
                  >
                    {{ method.id === '3' && selectedShippingId === '3' && selectedScheduleDate
                        ? selectedScheduleDate
                        : method.estimatedDelivery }}
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>
                                    <span class="w-12 h-12 flex items-center justify-center rounded-full bg-[#F3F3F3] mr-3">
        <!-- DatePicker Section - Outside of shipping methods loop for better mobile UX -->
        <div
          v-if="selectedShippingId === '3'"
          class="mt-8 p-6 bg-[#F7F7F7] rounded-xl"
        >
          <h3 class="font-srProDisplay text-base font-semibold text-black mb-4">
            Select your preferred delivery date
          </h3>
          <div class="w-full">
            <DatePicker
              v-model="selectedScheduleDate"
              class="w-full min-h-[300px] sm:min-h-[350px]"
            />
                                    <span class="w-12 h-12 flex items-center justify-center rounded-full bg-background mr-3">
        </div>
      </section>

      <!-- Navigation Buttons -->
      <div class="flex justify-end gap-4 max-w-5xl mx-auto mt-8">
        <button
          class="px-22 py-5 border border-black rounded-[6px] font-srProDisplay text-black bg-white hover:bg-gray-50 transition"
          @click="goBack"
        >
          Back
        </button>
        <button
          class="px-22 py-5 rounded-[6px] font-srProDisplay text-white bg-black hover:bg-[#232340] transition"
          @click="goNext"
        >
          Next
        </button>
      </div>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Wrapper from '@/components/shared/Wrapper.vue'
import DatePicker from '@/components/shared/DatePicker.vue'
import { useRouter } from 'vue-router'
import { useCheckoutStore, type ShippingMethod } from '@/stores/checkout'
import { useUserCartStore } from '@/stores/userCart'

const router = useRouter()
const checkoutStore = useCheckoutStore()
const userCartStore = useUserCartStore()

const shippingMethods = ref<ShippingMethod[]>([
  {
    id: '1',
    name: 'Free',
    price: 0,
    description: 'Our standard delivery option.',
    estimatedDelivery: '17 Oct, 2023',
  },
  {
    id: '2',
    name: 'Express',
    price: 8.5,
    description: 'Get your delivery as soon as possible.',
    estimatedDelivery: '1 Oct, 2023',
  },
  {
    id: '3',
    name: 'Schedule',
    price: 0,
    description: 'Pick a date when you want to get your delivery.',
    estimatedDelivery: 'Select Date',
  },
])

const selectedShippingId = ref(shippingMethods.value[0].id)
const selectedScheduleDate = ref('')

// Clear selected date when switching away from Schedule option
watch(selectedShippingId, (newValue) => {
  if (newValue !== '3') {
    selectedScheduleDate.value = ''
  }
})

function goBack() {
  router
    .push({ name: 'checkoutAddress' })
    .catch((err) => {
      console.error('Navigation error:', err)
    })
}

function goNext() {
  const selectedMethod = shippingMethods.value.find((m) => m.id === selectedShippingId.value)
  if (selectedMethod) {
    // Validate that a date is selected for Schedule option
    if (selectedMethod.id === '3' && !selectedScheduleDate.value) {
      alert('Please select a delivery date for the scheduled shipping option.')
      return
    }

    // Add the selected date for Schedule option
    if (selectedMethod.id === '3' && selectedScheduleDate.value) {
      selectedMethod.selectedDate = selectedScheduleDate.value
      selectedMethod.estimatedDelivery = selectedScheduleDate.value
    }
    checkoutStore.setSelectedShippingMethod(selectedMethod)
  }
  router
    .push({ name: 'checkoutPayment' })
    .catch((err) => {
      console.error('Navigation error:', err)
    })
}
</script>

<style scoped>
/* Responsive DatePicker popover fix */
/* DatePicker below Schedule option, full width on mobile */
.date-picker-popover {
  width: 100%;
  max-width: 100vw;
  min-width: 0;
  overflow-x: auto;
}
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
</style>
