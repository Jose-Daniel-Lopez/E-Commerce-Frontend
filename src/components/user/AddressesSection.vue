<template>
  <section
    :id="sectionId"
    :class="['transition-colors duration-200', sectionContainerClasses]"
  >
    <div class="flex items-center justify-between mb-6">
      <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
        <span :class="sectionHeaderClasses">{{ $t('account.addresses.title') }}</span>
      </h2>
      <div class="flex gap-2">
        <Button
          @click="handleRefreshAddresses"
          :class="['px-4', buttonOutlineClasses]"
          text-color="currentColor"
          bg-color="transparent"
          border-width="1px"
          width="auto"
          height="36px"
          :disabled="loading"
        >
          <v-icon name="hi-refresh" scale="0.9" class="mr-2 theme-text" />
          <span :class="buttonTextClasses">Refresh</span>
        </Button>
        <Button
          @click="handleCreateAddress"
          :class="['px-4', buttonOutlineClasses]"
          text-color="currentColor"
          bg-color="transparent"
          border-width="1px"
          width="auto"
          height="36px"
        >
          <v-icon name="hi-plus" scale="0.9" class="mr-2 theme-text" />
          <span :class="buttonTextClasses">{{ $t('account.addresses.addButton') }}</span>
        </Button>
      </div>
    </div>

    <!-- Loading state for addresses -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="w-8 h-8 border-b-2 rounded-full animate-spin opacity-70" :class="['border-theme-text']"></div>
      <span :class="['ml-3 font-medium theme-text', loadingTextClasses]">Loading addresses...</span>
    </div>

    <!-- Error state for addresses -->
    <div v-else-if="error" class="p-4 rounded-lg theme-error-bg theme-error-text">
      <p class="font-semibold theme-error-text">{{ error }}</p>
      <Button
        @click="handleRefreshAddresses"
        class="px-3 mt-2 text-sm font-semibold transition-colors duration-200 bg-transparent border theme-error-text hover:theme-error-bg"
        text-color="currentColor"
        bg-color="transparent"
        border-width="1px"
        width="auto"
        height="32px"
      >
        Retry
      </Button>
    </div>

    <!-- Empty state when no addresses are available -->
    <div v-else-if="shippingAddresses.length === 0" class="py-8 text-center">
      <v-icon name="hi-location-marker" scale="2" :class="['mb-3 opacity-80', emptyStateIconClasses]" />
      <p :class="['mb-4 text-base font-srProDisplay', emptyStateTextClasses]">You have no saved addresses</p>
      <Button
        @click="handleCreateAddress"
        :class="['px-4 font-semibold transition-colors duration-200', buttonPrimaryClasses]"
        text-color="currentColor"
        bg-color="transparent"
        width="auto"
        height="36px"
      >
        <v-icon name="hi-plus" scale="0.9" class="mr-2" />
        Add your first address
      </Button>
    </div>

    <!-- Display grid of shipping addresses -->
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div
        v-for="address in shippingAddresses"
        :key="address.id"
        :class="['relative transition-all duration-200 group', listItemClasses]"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <v-icon name="hi-location-marker" scale="1.1" :class="iconColorClasses" />
            <!-- Address Title and Type -->
            <div>
              <h4 :class="['font-semibold font-srProDisplay', textClasses]">
                {{ address.title }}
              </h4>
              <span :class="['text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800', textSecondaryClasses]">
                {{ getAddressTypeLabel(address.addressType) }}
              </span>
            </div>
          </div>
          <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
            <button
              @click="openEditForm(address)"
              :class="['w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer', interactiveIconClasses]"
              aria-label="Edit address"
              :disabled="formSubmitting"
            >
              <v-icon name="hi-pencil" scale="0.95" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
            <button
              @click="confirmDeleteAddress(address)"
              :class="['w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer', interactiveIconClasses]"
              aria-label="Delete address"
              :disabled="deletingAddress"
            >
              <v-icon name="hi-trash" scale="0.95" class="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        <!-- Display all address fields from the API -->
        <p :class="['text-sm leading-relaxed font-srProDisplay', textSecondaryClasses]">
          {{ address.street }}<br />
          {{ address.city }}, {{ address.state }} {{ address.zipCode }}<br />
          {{ address.country }}
        </p>
      </div>
    </div>

    <!-- Address Form Modal -->
    <div v-if="showAddressForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div class="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold font-srProDisplay" :class="textClasses">
            {{ editingAddress ? 'Edit Address' : 'Add New Address' }}
          </h3>
          <button
            @click="cancelAddressForm"
            class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <v-icon name="hi-x" scale="1.1" />
          </button>
        </div>

        <form @submit.prevent="submitAddressForm" class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium mb-1" :class="textClasses">
              Address Title *
            </label>
            <input
              v-model="addressForm.title"
              type="text"
              required
              placeholder="e.g., Home, Office"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              :class="textClasses"
            />
          </div>

          <!-- Address Type -->
          <div>
            <label class="block text-sm font-medium mb-1" :class="textClasses">
              Address Type *
            </label>
            <select
              v-model="addressForm.addressType"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              :class="textClasses"
            >
              <option value="">Select type</option>
              <option value="HOME">Home</option>
              <option value="OFFICE">Office</option>
              <option value="PICKUP">Pick up point</option>
            </select>
          </div>

          <!-- Street -->
          <div>
            <label class="block text-sm font-medium mb-1" :class="textClasses">
              Street Address *
            </label>
            <input
              v-model="addressForm.street"
              type="text"
              required
              placeholder="1234 Main St"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              :class="textClasses"
            />
          </div>

          <!-- City and State -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1" :class="textClasses">
                City *
              </label>
              <input
                v-model="addressForm.city"
                type="text"
                required
                placeholder="City"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                :class="textClasses"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" :class="textClasses">
                State *
              </label>
              <input
                v-model="addressForm.state"
                type="text"
                required
                placeholder="State"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                :class="textClasses"
              />
            </div>
          </div>

          <!-- Zip Code and Country -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1" :class="textClasses">
                Zip Code *
              </label>
              <input
                v-model="addressForm.zipCode"
                type="text"
                required
                placeholder="12345"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                :class="textClasses"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" :class="textClasses">
                Country *
              </label>
              <input
                v-model="addressForm.country"
                type="text"
                required
                placeholder="Country"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                :class="textClasses"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              @click="cancelAddressForm"
              :class="['px-4', buttonOutlineClasses]"
              text-color="currentColor"
              bg-color="transparent"
              border-width="1px"
              width="auto"
              height="36px"
              :disabled="formSubmitting"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              :class="['px-4', buttonPrimaryClasses]"
              text-color="white"
              bg-color="currentColor"
              width="auto"
              height="36px"
              :disabled="formSubmitting"
            >
              <span v-if="formSubmitting">
                <v-icon name="hi-refresh" scale="0.9" class="mr-2 animate-spin" />
                {{ editingAddress ? 'Updating...' : 'Creating...' }}
              </span>
              <span v-else>
                {{ editingAddress ? 'Update Address' : 'Create Address' }}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Button from '@/components/shared/Button.vue'
import { useShippingAddressStore } from '@/stores/shippingAddresses'
import { useToast } from '@/composables/useToast'
import type { ShippingAddress, CreateShippingAddressRequest, UpdateShippingAddressRequest } from '@/types/shippingAddress'

interface Props {
  sectionId: string
  userId: number
  sectionContainerClasses: string
  textClasses: string
  sectionHeaderClasses: string
  buttonOutlineClasses: string
  buttonTextClasses: string
  buttonPrimaryClasses: string
  loadingTextClasses: string
  emptyStateIconClasses: string
  emptyStateTextClasses: string
  listItemClasses: string
  iconColorClasses: string
  interactiveIconClasses: string
  textSecondaryClasses: string
}

interface Emits {
  (e: 'edit-address', address: ShippingAddress): void
  (e: 'create-address'): void
  (e: 'address-deleted', addressId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Store setup
const shippingStore = useShippingAddressStore()
const { shippingAddresses, loading, error } = storeToRefs(shippingStore)
const { fetchUserAddresses, deleteAddress, getAddressTypeLabel, createAddress, updateAddress } = shippingStore

// Toasts
const toast = useToast()

// Form state
const showAddressForm = ref(false)
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
  userId: props.userId
})

// Load addresses on component mount
onMounted(() => {
  handleRefreshAddresses()
})

// Event handlers
const handleRefreshAddresses = async () => {
  await fetchUserAddresses(props.userId)
}

const handleCreateAddress = () => {
  showAddressForm.value = true
  editingAddress.value = null
  resetAddressForm()
}

// New form-related functions
const openEditForm = (address: ShippingAddress) => {
  editingAddress.value = address
  showAddressForm.value = true

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

const confirmDeleteAddress = async (address: ShippingAddress) => {
  if (!confirm(`Are you sure you want to delete "${address.title}"?`)) {
    return
  }

  deletingAddress.value = true

  try {
    const success = await deleteAddress(address.id!)
    if (success) {
      emit('address-deleted', address.id!)
      toast.success(`Address "${address.title}" deleted successfully`)
    }
  } catch (error) {
    console.error('Error deleting address:', error)

    // Check if it's the specific error about address being used by orders
    const isAxiosError = error && typeof error === 'object' && 'response' in error
    const errorMessage = isAxiosError ? (error as { response: { data: { error: string } } }).response?.data?.error : ''

    if (errorMessage && errorMessage.includes('being used by') && errorMessage.includes('order(s)')) {
      // Clear the store error since we're handling this specific case
      shippingStore.error = null

      toast.error(`Cannot delete "${address.title}" - it's being used by existing orders`, {
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

const submitAddressForm = async () => {
  if (!props.userId) return

  formSubmitting.value = true

  try {
    if (editingAddress.value) {
      // Update existing address
      const updateData: UpdateShippingAddressRequest = {
        ...addressForm.value,
        id: editingAddress.value.id!
      }

      const success = await updateAddress(updateData)
      if (success) {
        cancelAddressForm()
        // Create a properly typed address for the emit
        const updatedAddress: ShippingAddress = {
          ...editingAddress.value,
          ...updateData,
          addressType: updateData.addressType as 'HOME' | 'OFFICE' | 'PICKUP'
        }
    emit('edit-address', updatedAddress)
    toast.success('Address updated successfully')
      }
    } else {
      // Create new address
      const newAddress = await createAddress(addressForm.value)
      if (newAddress) {
        cancelAddressForm()
        emit('create-address')
    toast.success('Address created successfully')
      }
    }
  } catch (error) {
    console.error('Error submitting address form:', error)
  toast.error('Failed to save address')
  } finally {
    formSubmitting.value = false
  }
}

const cancelAddressForm = () => {
  showAddressForm.value = false
  editingAddress.value = null
  resetAddressForm()
}

const resetAddressForm = () => {
  addressForm.value = {
    title: '',
    addressType: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    userId: props.userId
  }
}
</script>

<style scoped>
/* Modal backdrop blur effect */
.fixed.inset-0 {
  backdrop-filter: blur(4px);
}

/* Modal animation */
.fixed.inset-0 > div {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Form inputs dark mode styling */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Ensure modal is above everything */
.fixed.inset-0 {
  z-index: 9999;
}
</style>
