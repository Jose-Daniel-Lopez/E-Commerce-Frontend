<template>
  <div class="pt-[85px] lg:pt-0 bg-background text-foreground min-h-screen">
    <Wrapper class="py-20 max-w-[1300px] mx-auto">
      <!-- Stepper -->
      <div class="flex items-center justify-center mb-20">
        <div class="flex items-center gap-8 w-full max-w-3xl">
          <!-- Step 1: Address -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground mr-3">
              <v-icon name="md-locationon" scale="1.5" class="text-primary-foreground" />
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-muted">Step 1</span>
              <span class="font-srProDisplay text-base font-semibold text-foreground mt-0.5">Address</span>
            </div>
          </div>
          <!-- Line -->
          <div class="flex-1 h-0.5 bg-[#E5E5E5] mx-2"></div>
          <!-- Step 2: Shipping -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-12 h-12 flex items-center justify-center rounded-full bg-surface mr-3">
              <v-icon name="md-localshipping" scale="1.5" class="text-muted" />
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-muted">Step 2</span>
              <span class="font-srProDisplay text-base font-semibold text-muted mt-0.5">Shipping</span>
            </div>
          </div>
          <!-- Line -->
          <div class="flex-1 h-0.5 bg-[#E5E5E5] mx-2"></div>
          <!-- Step 3: Payment -->
          <div class="flex flex-1 items-center justify-center">
            <span class="w-12 h-12 flex items-center justify-center rounded-full bg-surface mr-3">
              <v-icon name="si-contactlesspayment" scale="2" class="text-muted" />
            </span>
            <div class="flex flex-col items-start">
              <span class="font-srProDisplay text-xs text-muted">Step 3</span>
              <span class="font-srProDisplay text-base font-semibold text-muted mt-0.5">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Select Address -->
      <section class="max-w-5xl mx-auto">
  <h2 class="font-srProDisplay text-lg font-semibold text-foreground mb-6">Select Address</h2>

        <!-- Loading State -->
        <div v-if="shippingAddressStore.loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <p class="mt-2 text-gray-600">Loading addresses...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="shippingAddressStore.error" class="text-center py-8">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-600">{{ shippingAddressStore.error }}</p>
            <button
              @click="loadAddresses"
              class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Address List -->
        <div v-else-if="addresses.length > 0" class="space-y-6">
          <div v-for="address in addresses" :key="address.id" class="bg-surface rounded-xl p-6 flex items-center justify-between">
            <label class="flex items-start gap-4 cursor-pointer flex-1">
              <input type="radio" name="selectedAddress" :value="address.id" v-model="selectedAddressId" @change="onAddressSelected(address)" class="accent-primary w-5 h-5 mt-1" />
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-srProDisplay text-base font-semibold text-foreground">{{ address.title }}</span>
                  <span class="ml-2 px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-srProDisplay font-semibold">{{ getAddressTypeLabel(address.addressType) }}</span>
                </div>
                <div class="font-srProDisplay text-foreground text-base">{{ address.street }}</div>
                <div class="font-srProDisplay text-foreground text-base">{{ `${address.city}, ${address.state} ${address.zipCode}` }}</div>
                <div class="font-srProDisplay text-foreground text-base">{{ address.country }}</div>
              </div>
            </label>
            <div class="flex items-center gap-4 ml-4">
              <button class="text-xl text-foreground hover:text-muted" @click="editAddress(address)" :disabled="!!editingAddress">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12.65 3.35a2.121 2.121 0 1 1 3 3L7.5 14.5l-4 1 1-4 8.15-8.15Z" />
                </svg>
              </button>
              <button class="text-2xl text-foreground hover:text-muted" @click="confirmRemoveAddress(address)" :disabled="deletingAddress">
                &times;
              </button>
            </div>
          </div>
        </div>

        <!-- No Addresses State -->
        <div v-else class="text-center py-12">
          <div class="bg-surface rounded-lg p-8">
            <v-icon name="md-locationon" scale="3" class="text-muted mb-4" />
            <h3 class="text-lg font-semibold text-foreground mb-2">No addresses found</h3>
            <p class="text-muted mb-4">Add your first shipping address to continue</p>
          </div>
        </div>

        <!-- Add New Address -->
        <div class="relative flex flex-col items-center justify-center my-14 select-none">
          <div class="flex items-center w-full" style="height: 48px">
            <!-- Left dashed line -->
            <div class="flex-1 h-0.5">
              <svg
                width="100%"
                height="24"
                viewBox="0 0 548 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  y1="11.75"
                  x2="548"
                  y2="11.75"
                  stroke="url(#paint0_linear_left)"
                  stroke-width="0.5"
                  stroke-dasharray="3 3"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_left"
                    x1="555.117"
                    y1="12"
                    x2="0"
                    y2="12"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop />
                    <stop offset="1" stop-color="#E6E6E6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <!-- Add Address Icon -->
            <button
              @click="showAddForm = true"
              class="mx-1 flex items-center justify-center p-0 mt-5 bg-transparent border-none outline-none focus:outline-none"
            >
              <v-icon name="md-addcircle" scale="1.7" fill="black" />
            </button>
            <!-- Right dashed line -->
            <div class="flex-1 h-0.5">
              <svg
                width="100%"
                height="24"
                viewBox="0 0 548 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="548"
                  y1="12.25"
                  x2="0"
                  y2="12.25"
                  stroke="url(#paint1_linear_right)"
                  stroke-width="0.5"
                  stroke-dasharray="3 3"
                />
                <defs>
                  <linearGradient
                    id="paint1_linear_right"
                    x1="0"
                    y1="12"
                    x2="548"
                    y2="12"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop />
                    <stop offset="1" stop-color="#E6E6E6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <span class="font-srProDisplay text-foreground mt-2">Add New Address</span>

          <!-- Add/Edit Address Form -->
          <transition name="fade-slide">
            <div v-if="showAddForm || editingAddress" class="w-full max-w-lg mt-8 bg-background border border-border rounded-lg p-8 shadow z-20">
              <h3 class="font-srProDisplay text-lg font-semibold mb-4 text-foreground">{{ editingAddress ? 'Edit Address' : 'Add New Address' }}</h3>

              <form @submit.prevent="submitAddressForm" class="space-y-4">
                <!-- Title -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-foreground mb-2">Title</label>
                  <input v-model="addressForm.title" type="text" required class="w-full px-4 py-3 border border-border rounded-md bg-background font-srProDisplay text-foreground placeholder-muted focus:outline-none focus:border-border transition-colors duration-200" placeholder="e.g. Home, Work, etc." />
                </div>

                <!-- Type -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-foreground mb-2">Type</label>
                  <select v-model="addressForm.addressType" required class="w-full px-4 py-3 border border-border rounded-md bg-background font-srProDisplay text-foreground focus:outline-none focus:border-border transition-colors duration-200">
                    <option value="" disabled>Select type</option>
                    <option value="HOME">Home</option>
                    <option value="OFFICE">Office</option>
                    <option value="PICKUP">Pick up point</option>
                  </select>
                </div>

                <!-- Street Address -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-foreground mb-2">Street Address</label>
                  <input v-model="addressForm.street" type="text" required class="w-full px-4 py-3 border border-border rounded-md bg-background font-srProDisplay text-foreground placeholder-muted focus:outline-none focus:border-border transition-colors duration-200" placeholder="Street name and number" />
                </div>

                <!-- City -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-foreground mb-2">City</label>
                  <input v-model="addressForm.city" type="text" required class="w-full px-4 py-3 border border-border rounded-md bg-background font-srProDisplay text-foreground placeholder-muted focus:outline-none focus:border-border transition-colors duration-200" placeholder="City" />
                </div>

                <!-- State -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-foreground mb-2">State</label>
                  <input v-model="addressForm.state" type="text" required class="w-full px-4 py-3 border border-border rounded-md bg-background font-srProDisplay text-foreground placeholder-muted focus:outline-none focus:border-border transition-colors duration-200" placeholder="State or Province" />
                </div>

                <!-- Zip Code -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-foreground mb-2">Zip Code</label>
                  <input v-model="addressForm.zipCode" type="text" required class="w-full px-4 py-3 border border-border rounded-md bg-background font-srProDisplay text-foreground placeholder-muted focus:outline-none focus:border-border transition-colors duration-200" placeholder="Zip or Postal Code" />
                </div>

                <!-- Country -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-foreground mb-2">Country</label>
                  <input v-model="addressForm.country" type="text" required class="w-full px-4 py-3 border border-border rounded-md bg-background font-srProDisplay text-foreground placeholder-muted focus:outline-none focus:border-border transition-colors duration-200" placeholder="Country" />
                </div>

                <!-- Actions -->
                <div class="flex gap-2 justify-end pt-4 border-t border-border mt-6">
                  <button type="button" @click="cancelAddressForm" class="px-4 py-2 rounded bg-surface text-foreground hover:bg-surface/90 font-srProDisplay" :disabled="formSubmitting">Cancel</button>
                  <button type="submit" class="px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-95 font-srProDisplay flex items-center gap-2" :disabled="formSubmitting">
                    <div v-if="formSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {{ editingAddress ? 'Update' : 'Add' }}
                  </button>
                </div>
              </form>
            </div>
          </transition>
        </div>
      </section>

      <!-- Navigation Buttons -->
      <div class="flex justify-end gap-4 max-w-5xl mx-auto mt-8">
  <button class="px-22 py-5 border border-border rounded-[6px] font-srProDisplay text-foreground bg-background hover:bg-surface transition" @click="goBack">Back</button>
  <button class="px-22 py-5 rounded-[6px] font-srProDisplay text-primary-foreground bg-primary hover:opacity-95 transition" @click="goNext" :disabled="!selectedAddressId">Next</button>
      </div>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import Wrapper from '@/components/shared/Wrapper.vue'
import router from '@/router'
import { useShippingAddressStore } from '@/stores/shippingAddresses'
import { useAuthStore } from '@/stores/auth'
import { useCheckoutStore } from '@/stores/checkout'
import type { ShippingAddress, CreateShippingAddressRequest, UpdateShippingAddressRequest } from '@/types/shippingAddress'

// ========== STORES ==========
const shippingAddressStore = useShippingAddressStore()
const authStore = useAuthStore()
const checkoutStore = useCheckoutStore()

// ========== COMPUTED ==========
const addresses = computed(() => shippingAddressStore.shippingAddresses)

// ========== STATE ==========
const selectedAddressId = ref<number | null>(null)
const showAddForm = ref(false)
const editingAddress = ref<ShippingAddress | null>(null)
const formSubmitting = ref(false)
const deletingAddress = ref(false)

// Address form data
const addressForm = ref<CreateShippingAddressRequest>({
  title: '',
  addressType: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  userId: authStore.user?.id || 0
})

// ========== LIFECYCLE ==========
onMounted(async () => {
  await loadAddresses()
})

// Watch for auth user changes
watch(
  () => authStore.user?.id,
  (newUserId) => {
    if (newUserId) {
      addressForm.value.userId = newUserId
      loadAddresses()
    }
  },
  { immediate: true }
)

// ========== METHODS ==========

/**
 * Load user addresses
 */
const loadAddresses = async () => {
  if (!authStore.user?.id) return

  await shippingAddressStore.fetchUserAddresses(authStore.user.id)

  // Auto-select first address if none selected
  if (addresses.value.length > 0 && !selectedAddressId.value) {
    selectedAddressId.value = addresses.value[0].id!
    checkoutStore.setSelectedAddress(addresses.value[0])
  }
}

/**
 * Handle address selection
 */
const onAddressSelected = (address: ShippingAddress) => {
  checkoutStore.setSelectedAddress(address)
}

/**
 * Get address type display label
 */
const getAddressTypeLabel = (type: string): string => {
  return shippingAddressStore.getAddressTypeLabel(type)
}

/**
 * Submit address form (create or update)
 */
const submitAddressForm = async () => {
  if (!authStore.user?.id) return

  formSubmitting.value = true

  try {
    if (editingAddress.value) {
      // Update existing address
      const updateData: UpdateShippingAddressRequest = {
        ...addressForm.value,
        id: editingAddress.value.id!
      }

      const success = await shippingAddressStore.updateAddress(updateData)
      if (success) {
        cancelAddressForm()
      }
    } else {
      // Create new address
      const newAddress = await shippingAddressStore.createAddress(addressForm.value)
      if (newAddress) {
        // Auto-select the new address
        selectedAddressId.value = newAddress.id!
        checkoutStore.setSelectedAddress(newAddress)
        cancelAddressForm()
      }
    }
  } catch (error) {
    console.error('Error submitting address form:', error)
  } finally {
    formSubmitting.value = false
  }
}

/**
 * Cancel address form
 */
const cancelAddressForm = () => {
  showAddForm.value = false
  editingAddress.value = null

  // Reset form
  addressForm.value = {
    title: '',
    addressType: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    userId: authStore.user?.id || 0
  }
}

/**
 * Edit existing address
 */
const editAddress = (address: ShippingAddress) => {
  editingAddress.value = address
  showAddForm.value = true

  // Populate form with existing data
  addressForm.value = {
    title: address.title,
    addressType: address.addressType,
    street: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    country: address.country,
    userId: address.userId
  }
}

/**
 * Confirm address removal
 */
const confirmRemoveAddress = async (address: ShippingAddress) => {
  if (!confirm(`Are you sure you want to delete "${address.title}"?`)) {
    return
  }

  await removeAddress(address.id!)
}

/**
 * Remove address
 */
const removeAddress = async (addressId: number) => {
  deletingAddress.value = true

  try {
    const success = await shippingAddressStore.deleteAddress(addressId)
    if (success) {
      // If the deleted address was selected, clear selection
      if (selectedAddressId.value === addressId) {
        selectedAddressId.value = null
        checkoutStore.setSelectedAddress(null)

        // Auto-select first remaining address
        if (addresses.value.length > 0) {
          selectedAddressId.value = addresses.value[0].id!
          checkoutStore.setSelectedAddress(addresses.value[0])
        }
      }
    }
  } catch (error) {
    console.error('Error removing address:', error)
  } finally {
    deletingAddress.value = false
  }
}

/**
 * Navigation methods
 */
const goBack = () => {
  router.push({ name: 'shoppingCart' }).catch(console.error)
}

const goNext = () => {
  if (!selectedAddressId.value) {
    alert('Please select a shipping address')
    return
  }

  router.push({ name: 'checkoutShipping' }).catch(console.error)
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
