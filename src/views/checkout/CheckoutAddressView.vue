<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black min-h-screen">
    <Wrapper class="py-20 max-w-[1300px] mx-auto">
      <!-- Stepper -->
      <div class="flex items-center justify-center mb-20">
        <div class="flex items-center gap-8 w-full max-w-3xl">
          <!-- Step 1: Address -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-12 h-12 flex items-center justify-center rounded-full bg-black mr-3">
              <v-icon name="md-locationon" scale="1.5" fill="white"/>
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-black">Step 1</span>
              <span class="font-srProDisplay text-base font-semibold text-black mt-0.5">Address</span>
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
            <span class="w-12 h-12 flex items-center justify-center rounded-full bg-[#F3F3F3] mr-3">
              <v-icon name="si-contactlesspayment" scale="2" fill="#BDBDBD"/>
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-[#BDBDBD]">Step 3</span>
              <span class="font-srProDisplay text-base font-semibold text-[#BDBDBD] mt-0.5">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Select Address -->
      <section class="max-w-5xl mx-auto">
        <h2 class="font-srProDisplay text-lg font-semibold text-[#232340] mb-6">Select Address</h2>
        <div v-if="shippingAddressStore.loading" class="text-center">Loading addresses...</div>
        <div v-else-if="shippingAddressStore.error" class="text-center text-red-500">{{ shippingAddressStore.error }}</div>
        <div v-else class="space-y-6">
          <div v-for="address in addresses" :key="address.id" class="bg-[#F7F7F7] rounded-xl p-6 flex items-center justify-between">
            <label class="flex items-start gap-4 cursor-pointer flex-1">
              <input type="radio" name="selectedAddress" :value="address.id" v-model="selectedAddressId" class="accent-black w-5 h-5 mt-1" />
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-srProDisplay text-base font-semibold text-black">{{ address.street }}</span>
                  <span class="ml-2 px-2 py-0.5 rounded bg-black text-white text-xs font-srProDisplay font-semibold">{{ address.type }}</span>
                </div>
                <div class="font-srProDisplay text-[#232340] text-base">{{ `${address.city}, ${address.state} ${address.zipCode}` }}</div>
                <div class="font-srProDisplay text-[#232340] text-base">{{ address.country }}</div>
              </div>
            </label>
            <div class="flex items-center gap-4 ml-4">
              <button class="text-xl text-black hover:text-[#666]" @click="editAddress(address.id)">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12.65 3.35a2.121 2.121 0 1 1 3 3L7.5 14.5l-4 1 1-4 8.15-8.15Z"/>
                </svg>
              </button>
              <button class="text-2xl text-black hover:text-[#666]" @click="removeAddress(address.id)">&times;</button>
            </div>
          </div>
        </div>

        <!-- Add New Address -->
        <div class="relative flex flex-col items-center justify-center my-14 select-none">
          <div class="flex items-center w-full" style="height:48px;">
            <!-- Left dashed line -->
            <div class="flex-1 h-0.5">
              <svg width="100%" height="24" viewBox="0 0 548 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line y1="11.75" x2="548" y2="11.75" stroke="url(#paint0_linear_left)" stroke-width="0.5" stroke-dasharray="3 3"/>
                <defs>
                  <linearGradient id="paint0_linear_left" x1="555.117" y1="12" x2="0" y2="12" gradientUnits="userSpaceOnUse">
                    <stop/>
                    <stop offset="1" stop-color="#E6E6E6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <!-- Add Address Icon -->
            <button @click="showAddForm = true" class="mx-1 flex items-center justify-center p-0 mt-5 bg-transparent border-none outline-none focus:outline-none">
              <v-icon name="md-addcircle" scale="1.7" fill="black"/>
            </button>
            <!-- Right dashed line -->
            <div class="flex-1 h-0.5">
              <svg width="100%" height="24" viewBox="0 0 548 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="548" y1="12.25" x2="0" y2="12.25" stroke="url(#paint1_linear_right)" stroke-width="0.5" stroke-dasharray="3 3"/>
                <defs>
                  <linearGradient id="paint1_linear_right" x1="0" y1="12" x2="548" y2="12" gradientUnits="userSpaceOnUse">
                    <stop/>
                    <stop offset="1" stop-color="#E6E6E6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <span class="font-srProDisplay text-gray-700 text-black mt-2">Add New Address</span>

          <!-- Styled Add Address Form (ContactView style) -->
          <transition name="fade-slide">
            <div v-if="showAddForm" class="w-full max-w-lg mt-8 bg-white border border-[#EBEBEB] rounded-lg p-8 shadow z-20">
              <form @submit.prevent="submitNewAddress" class="space-y-4">
                <!-- Title -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">Title</label>
                  <input
                    v-model="newAddress.title"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="e.g. Home"
                  />
                </div>
                <!-- Type -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">Type</label>
                  <select
                    v-model="newAddress.type"
                    required
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black focus:outline-none focus:border-black transition-colors duration-200"
                  >
                    <option value="" disabled selected>Select type</option>
                    <option value="HOME">Home</option>
                    <option value="OFFICE">Office</option>
                    <option value="PICKUP">Pick up point</option>
                  </select>
                </div>
                <!-- Address Line -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">Address Line</label>
                  <input
                    v-model="newAddress.line"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="Street, number, etc."
                  />
                </div>
                <!-- City -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">City</label>
                  <input
                    v-model="newAddress.city"
                    type="text"
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="City"
                  />
                </div>
                <!-- Phone -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">Phone</label>
                  <input
                    v-model="newAddress.phone"
                    type="text"
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="Phone"
                  />
                </div>
                <!-- Actions -->
                <div class="flex gap-2 justify-end pt-2 border-t border-[#EBEBEB] mt-4">
                  <button type="button" @click="showAddForm = false" class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-srProDisplay">Cancel</button>
                  <button type="submit" class="px-4 py-2 rounded bg-black text-white hover:bg-[#232340] font-srProDisplay">Add</button>
                </div>
              </form>
            </div>
          </transition>
        </div>
      </section>

      <!-- Navigation Buttons -->
      <div class="flex justify-end gap-4 max-w-5xl mx-auto mt-8">
        <button class="px-22 py-5 border border-black rounded-[6px] font-srProDisplay text-black bg-white hover:bg-gray-50 transition" @click="goBack">Back</button>
        <button class="px-22 py-5 rounded-[6px] font-srProDisplay text-white bg-black hover:bg-[#232340] transition" @click="goNext">Next</button>
      </div>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Wrapper from '@/components/shared/Wrapper.vue'
import router from '@/router'
import { useShippingAddressStore } from '@/stores/shippingAddresses'
import { useAuthStore } from '@/stores/auth'
import { useCheckoutStore } from '@/stores/checkout'

const shippingAddressStore = useShippingAddressStore()
const authStore = useAuthStore()
const checkoutStore = useCheckoutStore()

const addresses = computed(() => shippingAddressStore.shippingAddresses)
const selectedAddressId = ref<number | null>(null)

onMounted(async () => {
  if (authStore.user?.id) {
    await shippingAddressStore.fetchShippingAddresses(authStore.user.id)
    if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0].id
      checkoutStore.setSelectedAddress(addresses.value[0])
    }
  }
})

const showAddForm = ref(false)
const newAddress = ref({
  title: '',
  type: '',
  line: '',
  city: '',
  phone: '',
})

function submitNewAddress() {
  // This should be implemented to add the address via the store
  alert('Adding new address (not implemented)')
  showAddForm.value = false
}

function editAddress(addressId: number) {
  alert(`Edit address ${addressId} (not implemented)`)
}

function removeAddress(addressId: number) {
  // This should be implemented to remove the address via the store
  alert(`Removing address ${addressId} (not implemented)`)
}

function goBack() {
  router.push({ name: 'shoppingCart' }).then(() => {
    // Scroll to top after navigation with a smooth animation
    window.scrollTo({ top: 0, behavior: 'smooth' })}).catch(err => {
    console.error('Navigation error:', err)
  })
}

function goNext() {
  router.push({ name: 'checkoutShipping' }).then(() => {
    // Scroll to top after navigation with a smooth animation
    window.scrollTo({ top: 0, behavior: 'smooth' })}).catch(err => {
    console.error('Navigation error:', err)
  })
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
