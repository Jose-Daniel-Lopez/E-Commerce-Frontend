<template>
  <div class="pt-[85px] lg:pt-0 min-h-screen" :class="pageBackgroundClasses">
    <Wrapper class="py-20 max-w-[1300px] mx-auto">
      <!-- Stepper -->
      <div class="flex items-center justify-center mb-20">
        <div class="flex items-center w-full max-w-3xl gap-8">
          <!-- Step 1: Address -->
          <div class="flex items-center justify-center flex-1">
            <span class="flex items-center justify-center w-12 h-12 mr-3 bg-primary rounded-full text-primary-foreground ring-2 ring-primary/20 dark:ring-primary/30 shadow-sm">
              <v-icon name="md-locationon" scale="1.5" fill="currentColor" class="text-primary-foreground" />
            </span>
            <div class="flex flex-col items-start">
              <span class="text-xs text-muted font-srProDisplay">Step 1</span>
              <span class="font-srProDisplay text-base font-semibold text-foreground mt-0.5">Address</span>
            </div>
          </div>
          <!-- Line -->
          <div class="flex-1 h-0.5 bg-border mx-2"></div>
          <!-- Step 2: Shipping -->
          <div class="flex items-center justify-center flex-1">
            <span class="flex items-center justify-center w-12 h-12 mr-3 rounded-full bg-surface">
              <v-icon name="md-localshipping" scale="1.5" class="text-muted" />
            </span>
            <div class="flex flex-col items-start">
              <span class="text-xs font-srProDisplay text-muted">Step 2</span>
              <span class="font-srProDisplay text-base font-semibold text-muted mt-0.5">Shipping</span>
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
              <span class="font-srProDisplay text-xs text-muted">Step 3</span>
              <span class="font-srProDisplay text-base font-semibold text-muted mt-0.5">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Select Address -->
      <section class="max-w-5xl mx-auto">
  <h2 class="mb-6 text-lg font-semibold font-srProDisplay text-foreground">{{ $t('checkout.selectAddress') }}</h2>

        <!-- Loading State -->
        <div v-if="shippingAddressStore.loading" class="py-8 text-center">
          <div class="inline-block w-8 h-8 border-b-2 border-primary rounded-full animate-spin"></div>
          <p class="mt-2 text-muted">Loading addresses...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="shippingAddressStore.error" class="py-8 text-center">
          <div class="p-4 rounded-lg theme-error-bg">
            <p>{{ shippingAddressStore.error }}</p>
            <button
              @click="loadAddresses"
              class="px-4 py-2 mt-2 rounded"
              :class="buttonPrimaryClasses"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Address List -->
    <div v-else-if="addresses.length > 0" class="space-y-6">
          <div
            v-for="address in addresses"
            :key="address.id"
      :class="[cardClasses]"
      class="flex items-center justify-between p-6 rounded-xl"
          >
            <label class="flex items-start flex-1 gap-4 cursor-pointer">
              <input
                type="radio"
                name="selectedAddress"
                :value="address.id"
                v-model="selectedAddressId"
                @change="onAddressSelected(address)"
                class="w-5 h-5 mt-1 accent-primary"
              />
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-base font-semibold font-srProDisplay text-foreground">{{
                    address.title
                  }}</span>
                  <span
                    class="ml-2 px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-srProDisplay font-semibold"
                    >{{ getAddressTypeLabel(address.addressType) }}</span
                  >
                </div>
                <div class="text-base font-srProDisplay text-foreground">
                  {{ address.street }}
                </div>
                <div class="text-base font-srProDisplay text-foreground">
                  {{ `${address.city}, ${address.state} ${address.zipCode}` }}
                </div>
                <div class="text-base font-srProDisplay text-foreground">{{ address.country }}</div>
              </div>
            </label>
            <div class="flex items-center gap-4 ml-4">
              <button
                class="text-xl text-foreground hover:text-muted"
                @click="editAddress(address)"
                :disabled="!!editingAddress"
              >
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
              <button
                class="text-2xl text-foreground hover:text-muted"
                @click="confirmRemoveAddress(address)"
                :disabled="deletingAddress"
              >
                &times;
              </button>
            </div>
          </div>
        </div>

        <!-- No Addresses State -->
        <div v-else class="py-12 text-center">
          <div :class="[cardClasses]" class="p-8 rounded-lg">
            <v-icon name="md-locationon" scale="3" class="mb-4 text-muted" />
            <h3 class="mb-2 text-lg font-semibold text-muted">No addresses found</h3>
            <p class="mb-4 text-muted">Add your first shipping address to continue</p>
          </div>
        </div>

        <!-- Add New Address -->
        <div class="relative flex flex-col items-center justify-center select-none my-14">
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
                    <stop offset="1" style="stop-color: var(--color-border)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <!-- Add Address Icon -->
            <button
              @click="showAddForm = true"
              class="flex items-center justify-center p-0 mx-1 mt-5 w-10 h-10 rounded-full bg-primary text-primary-foreground border-none outline-none focus:outline-none shadow-sm"
              aria-label="Add address"
            >
              <v-icon name="md-addcircle" scale="1.4" fill="currentColor" />
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
                    <stop offset="1" style="stop-color: var(--color-border)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <span class="mt-2 font-srProDisplay text-muted">Add New Address</span>

          <!-- Add/Edit Address Form -->
          <transition name="fade-slide">
            <div
              v-if="showAddForm || editingAddress"
              :class="[cardClasses]"
              class="z-20 w-full max-w-lg p-8 mt-8 rounded-lg shadow"
            >
              <h3 class="mb-4 text-lg font-semibold font-srProDisplay">
                {{ editingAddress ? 'Edit Address' : 'Add New Address' }}
              </h3>

              <form @submit.prevent="submitAddressForm" class="space-y-4">
                <!-- Title -->
                <div>
                  <label :class="formLabelClasses" class="block mb-2">Title</label>

                  <input
                    v-model="addressForm.title"
                    type="text"
                    required
                    :class="formInputClasses"
                    placeholder="e.g. Home, Work, etc."
                  />
                </div>

                <!-- Type -->
                <div>
                  <label :class="formLabelClasses" class="block mb-2">Type</label>
                  <select
                    v-model="addressForm.addressType"
                    required
                    :class="formInputClasses"
                  >
                    <option value="" disabled>Select type</option>
                    <option value="HOME">Home</option>
                    <option value="OFFICE">Office</option>
                    <option value="PICKUP">Pickup</option>
                  </select>
                </div>

                <!-- Street Address -->
                <div>
                  <label :class="formLabelClasses" class="block mb-2">Street Address</label>
                  <input
                    v-model="addressForm.street"
                    type="text"
                    required
                    :class="formInputClasses"
                    placeholder="Street name and number"
                  />
                </div>

                <!-- City -->
                <div>
                  <label :class="formLabelClasses" class="block mb-2">City</label>
                  <input
                    v-model="addressForm.city"
                    type="text"
                    required
                    :class="formInputClasses"
                    placeholder="City"
                  />
                </div>

                <!-- State -->
                <div>
                  <label :class="formLabelClasses" class="block mb-2">State</label>
                  <input
                    v-model="addressForm.state"
                    type="text"
                    required
                    :class="formInputClasses"
                    placeholder="State or Province"
                  />
                </div>

                <!-- Zip Code -->
                <div>
                  <label :class="formLabelClasses" class="block mb-2">Zip Code</label>
                  <input
                    v-model="addressForm.zipCode"
                    type="text"
                    required
                    :class="formInputClasses"
                    placeholder="Zip or Postal Code"
                  />
                </div>

                <!-- Country -->
                <div>
                  <label :class="formLabelClasses" class="block mb-2">Country</label>
                  <input
                    v-model="addressForm.country"
                    type="text"
                    required
                    :class="formInputClasses"
                    placeholder="Country"
                  />
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-2 pt-4 mt-6 border-t border-border">
                  <button
                    type="button"
                    @click="cancelAddressForm"
                    :class="buttonOutlineClasses"
                    class="px-4 py-2 rounded font-srProDisplay"
                    :disabled="formSubmitting"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :class="buttonPrimaryClasses"
                    class="flex items-center gap-2 px-4 py-2 rounded font-srProDisplay"
                    :disabled="formSubmitting"
                  >
                    <div v-if="formSubmitting" class="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    {{ editingAddress ? 'Update' : 'Add' }}
                  </button>
                </div>
              </form>
            </div>
          </transition>
        </div>
      </section>

      <!-- Navigation Buttons -->
  <div class="flex justify-end max-w-5xl gap-4 mx-auto mt-8">
        <button
      :class="buttonOutlineClasses"
      class="px-22 py-5 rounded-[6px] font-srProDisplay transition"
          @click="goBack"
        >
          Back
        </button>
        <button
    class="px-22 py-5 rounded-[6px] font-srProDisplay transition"
    :class="buttonPrimaryClasses"
          @click="goNext"
          :disabled="!selectedAddressId"
        >
          Next
        </button>
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
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useToast } from '@/composables/useToast'

const { pageBackgroundClasses, buttonPrimaryClasses, buttonOutlineClasses, cardClasses, formInputClasses, formLabelClasses } = useThemeClasses()

// ========== STORES ==========
const shippingAddressStore = useShippingAddressStore()
const authStore = useAuthStore()
const checkoutStore = useCheckoutStore()

// Toast notifications
const toast = useToast()

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
        toast.success('Address updated successfully')
        cancelAddressForm()
      }
    } else {
      // Create new address
      const newAddress = await shippingAddressStore.createAddress(addressForm.value)
      if (newAddress) {
        toast.success('Address created successfully')
        // Auto-select the new address
        selectedAddressId.value = newAddress.id!
        checkoutStore.setSelectedAddress(newAddress)
        cancelAddressForm()
      }
    }
  } catch (error) {
    console.error('Error submitting address form:', error)
    toast.error('Failed to save address')
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
      // Find the address title for the success message
      const deletedAddress = addresses.value.find(addr => addr.id === addressId)
      const addressTitle = deletedAddress?.title || 'Address'

      toast.success(`${addressTitle} deleted successfully`)

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

    // Check if it's the specific error about address being used by orders
    const isAxiosError = error && typeof error === 'object' && 'response' in error
    const errorMessage = isAxiosError ? (error as { response: { data: { error: string } } }).response?.data?.error : ''

    if (errorMessage && errorMessage.includes('being used by') && errorMessage.includes('order(s)')) {
      // Clear the store error since we're handling this specific case
      shippingAddressStore.error = null

      const deletedAddress = addresses.value.find(addr => addr.id === addressId)
      const addressTitle = deletedAddress?.title || 'Address'

      toast.error(`Cannot delete "${addressTitle}" - it's being used by existing orders`, {
        title: 'Address In Use',
        duration: 6000
      })
    } else {
      toast.error('Failed to delete address')
    }
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
</style>
