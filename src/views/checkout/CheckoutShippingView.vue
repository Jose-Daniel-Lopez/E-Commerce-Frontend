<template>
  <div class="pt-[85px] lg:pt-0 min-h-screen overflow-visible" :class="pageBackgroundClasses">
    <Wrapper class="py-20 max-w-[1300px] mx-auto overflow-visible">
      <!-- Stepper -->
      <div class="flex items-center justify-center mb-20">
        <div class="flex items-center w-full max-w-3xl gap-8">
          <!-- Step 1: Address -->
          <div class="flex items-center justify-center flex-1">
            <span class="flex items-center justify-center w-12 h-12 mr-3 rounded-full bg-surface">
              <v-icon name="md-locationon" scale="1.5" class="text-muted" />
            </span>
            <div class="flex flex-col items-start">
              <span class="text-xs font-srProDisplay text-muted">Step 1</span>
              <span class="font-srProDisplay text-base font-semibold text-muted mt-0.5">Address</span>
            </div>
          </div>
          <!-- Line -->
          <div class="flex-1 h-0.5 bg-border mx-2"></div>
          <!-- Step 2: Shipping -->
          <div class="flex items-center justify-center flex-1">
            <span class="flex items-center justify-center w-12 h-12 mr-3 rounded-full bg-primary">
              <v-icon name="md-localshipping" scale="1.5" class="text-primary-foreground" />
            </span>
            <div class="flex flex-col items-start">
              <span class="text-xs font-srProDisplay text-foreground">Step 2</span>
              <span class="font-srProDisplay text-base font-semibold text-foreground mt-0.5">Shipping</span>
            </div>
          </div>
          <!-- Line -->
          <div class="flex-1 h-0.5 bg-border mx-2"></div>
          <!-- Step 3: Payment -->
          <div class="flex items-center justify-center flex-1">
            <span class="flex items-center justify-center w-12 h-12 mr-3 rounded-full bg-surface">
              <v-icon name="si-contactlesspayment" scale="2" class="text-muted" />
            </span>
            <div class="flex flex-col items-start">
              <span class="text-xs font-srProDisplay text-muted">Step 3</span>
              <span class="font-srProDisplay text-base font-semibold text-muted mt-0.5">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Select Shipping Method -->
      <section class="relative max-w-5xl mx-auto z-1">
        <h2 class="mb-6 text-lg font-semibold font-srProDisplay text-foreground">{{ $t('checkout.shipmentMethod') }}
        </h2>
        <div class="space-y-6 overflow-visible">
          <div v-for="method in shippingMethods" :key="method.id" :class="[cardClasses]"
            class="relative flex items-center justify-between p-6 overflow-visible rounded-xl">
            <label class="flex items-start flex-1 w-full gap-4 cursor-pointer">
              <input type="radio" name="selectedShipping" :value="method.id" v-model="selectedShippingId"
                class="w-5 h-5 mt-1 accent-primary" />
              <div class="flex items-center justify-between flex-1 w-full">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-base font-semibold font-srProDisplay text-foreground">{{ method.name }}</span>
                    <span
                      class="ml-2 px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-srProDisplay font-semibold">{{
                        userCartStore.formatPrice(method.price) }}</span>
                  </div>
                  <div class="mb-2 text-base font-srProDisplay text-foreground">{{ method.description }}</div>
                </div>
                <div class="relative flex items-center overflow-visible">
                  <!-- Show estimated delivery or "Select Date" for schedule -->
                  <span class="text-base font-srProDisplay text-foreground whitespace-nowrap">
                    {{ method.id === '3' && selectedShippingId === '3' && selectedScheduleDate ? selectedScheduleDate :
                      method.estimatedDelivery }}
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- DatePicker Section - Outside of shipping methods loop for better mobile UX -->
        <div v-if="selectedShippingId === '3'" :class="[cardClasses]" class="p-6 mt-8 rounded-xl">
          <h3 class="mb-4 text-base font-semibold font-srProDisplay text-foreground">Select your preferred delivery date
          </h3>
          <div class="w-full">
            <DatePicker v-model="selectedScheduleDate" class="w-full" />
          </div>
        </div>
      </section>

      <!-- Navigation Buttons -->
      <div class="flex justify-end max-w-5xl gap-4 mx-auto mt-8">
        <button :class="buttonOutlineClasses" class="px-22 py-5 rounded-[6px] font-srProDisplay transition"
          @click="goBack">
          Back
        </button>
        <button class="px-22 py-5 rounded-[6px] font-srProDisplay transition" :class="buttonPrimaryClasses"
          @click="goNext">
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
import { useThemeClasses } from '@/composables/useThemeClasses'

const { pageBackgroundClasses, buttonPrimaryClasses, buttonOutlineClasses, cardClasses } = useThemeClasses()

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
/* Ensure parent containers allow overflow for better positioning */
section {
  overflow: visible;
}

.max-w-5xl {
  overflow: visible;
}
</style>
