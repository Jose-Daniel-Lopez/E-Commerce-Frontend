<template>
  <Transition name="modal-overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <Transition name="modal-content">
        <div
          v-if="isOpen"
          class="bg-white rounded-xl shadow-2xl max-w-md w-full transform border border-gray-100"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="font-srProDisplay text-xl font-semibold text-black">
                  Change Password
                </h2>
                <p class="font-srProDisplay text-sm text-gray-600 mt-1">
                  Enter your current password and choose a new one
                </p>
              </div>
              <button
                @click="closeModal"
                class="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <v-icon name="hi-x" scale="1.4" class="text-gray-500" />
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="p-6 space-y-6">
            <!-- Error Message -->
            <div
              v-if="error"
              class="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div class="flex items-center">
                <v-icon name="hi-exclamation-circle" scale="1.2" class="text-red-600 mr-3" />
                <p class="font-srProDisplay text-sm text-red-700">{{ error }}</p>
              </div>
            </div>

            <!-- Success Message -->
            <div
              v-if="success"
              class="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div class="flex items-center">
                <v-icon name="hi-check-circle" scale="1.2" class="text-green-600 mr-3" />
                <p class="font-srProDisplay text-sm text-green-700">{{ success }}</p>
              </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Current Password -->
              <div>
                <label for="currentPassword" class="block font-srProDisplay text-sm font-medium text-black mb-2">
                  Current Password
                </label>
                <div class="relative">
                  <input
                    id="currentPassword"
                    v-model="formData.currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg font-srProDisplay text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="Enter your current password"
                    required
                    :disabled="loading"
                  />
                  <button
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    :disabled="loading"
                  >
                    <v-icon :name="showCurrentPassword ? 'hi-eye-off' : 'hi-eye'" scale="1.1" />
                  </button>
                </div>
              </div>

              <!-- New Password -->
              <div>
                <label for="newPassword" class="block font-srProDisplay text-sm font-medium text-black mb-2">
                  New Password
                </label>
                <div class="relative">
                  <input
                    id="newPassword"
                    v-model="formData.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg font-srProDisplay text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="Enter your new password"
                    required
                    :disabled="loading"
                    minlength="8"
                  />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    :disabled="loading"
                  >
                    <v-icon :name="showNewPassword ? 'hi-eye-off' : 'hi-eye'" scale="1.1" />
                  </button>
                </div>
                <p class="font-srProDisplay text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>

              <!-- Confirm New Password -->
              <div>
                <label for="confirmPassword" class="block font-srProDisplay text-sm font-medium text-black mb-2">
                  Confirm New Password
                </label>
                <div class="relative">
                  <input
                    id="confirmPassword"
                    v-model="formData.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg font-srProDisplay text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="Confirm your new password"
                    required
                    :disabled="loading"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    :disabled="loading"
                  >
                    <v-icon :name="showConfirmPassword ? 'hi-eye-off' : 'hi-eye'" scale="1.1" />
                  </button>
                </div>
                <p
                  v-if="formData.confirmPassword && formData.newPassword !== formData.confirmPassword"
                  class="font-srProDisplay text-xs text-red-500 mt-1"
                >
                  Passwords do not match
                </p>
              </div>

              <!-- Password Strength Indicator -->
              <div v-if="formData.newPassword" class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-srProDisplay text-xs text-gray-600">Password Strength:</span>
                  <span
                    :class="[
                      'font-srProDisplay text-xs font-medium',
                      passwordStrength.color
                    ]"
                  >
                    {{ passwordStrength.label }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    :class="[
                      'h-2 rounded-full transition-all duration-300',
                      passwordStrength.bgColor
                    ]"
                    :style="{ width: passwordStrength.width + '%' }"
                  ></div>
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div
            class="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 px-6 py-4 rounded-b-xl z-10"
          >
            <div class="flex gap-3 justify-end">
              <button
                @click="closeModal"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                :disabled="loading"
              >
                Cancel
              </button>
              <button
                @click="handleSubmit"
                :disabled="!isFormValid || loading"
                class="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <v-icon
                  v-if="loading"
                  name="hi-refresh"
                  scale="1.1"
                  class="mr-2 animate-spin"
                />
                {{ loading ? 'Changing...' : 'Change Password' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const authStore = useAuthStore()

// Form state
const formData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// UI state
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

// Form validation
const isFormValid = computed(() => {
  return (
    formData.value.currentPassword.length > 0 &&
    formData.value.newPassword.length >= 8 &&
    formData.value.newPassword === formData.value.confirmPassword
  )
})

// Password strength calculator
const passwordStrength = computed(() => {
  const password = formData.value.newPassword
  let score = 0

  if (password.length >= 8) score += 1
  if (password.match(/[a-z]/)) score += 1
  if (password.match(/[A-Z]/)) score += 1
  if (password.match(/[0-9]/)) score += 1
  if (password.match(/[^a-zA-Z0-9]/)) score += 1

  const strength = {
    0: { label: 'Very Weak', color: 'text-red-600', bgColor: 'bg-red-500', width: 20 },
    1: { label: 'Weak', color: 'text-red-500', bgColor: 'bg-red-400', width: 40 },
    2: { label: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-400', width: 60 },
    3: { label: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-400', width: 80 },
    4: { label: 'Strong', color: 'text-green-500', bgColor: 'bg-green-400', width: 90 },
    5: { label: 'Very Strong', color: 'text-green-600', bgColor: 'bg-green-500', width: 100 }
  }

  return strength[score as keyof typeof strength] || strength[0]
})

// Reset form when modal opens/closes
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

const resetForm = () => {
  formData.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
  error.value = ''
  success.value = ''
}

const handleSubmit = async () => {
  if (!isFormValid.value || loading.value) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const result = await authStore.changePassword(
      formData.value.currentPassword,
      formData.value.newPassword
    )

    if (result.success) {
      success.value = result.message || 'Password changed successfully!'

      // Close modal after a short delay to show success message
      setTimeout(() => {
        emit('success')
        closeModal()
      }, 1500)
    } else {
      error.value = result.error || 'Failed to change password'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
    console.error('Change password error:', err)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  if (!loading.value) {
    resetForm()
    emit('close')
  }
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Enhanced backdrop-filter with fallbacks */
.backdrop-blur-md {
  /* Fallback para navegadores sin soporte */
  background: rgba(0, 0, 0, 0.6);

  /* Soporte nativo */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Detectar soporte para backdrop-filter y ajustar */
@supports (backdrop-filter: blur(8px)) or (-webkit-backdrop-filter: blur(8px)) {
  .backdrop-blur-md {
    background: rgba(0, 0, 0, 0.4);
  }
}

/* Modal Transitions */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

/* Custom shadow for modal with elevated appearance */
.shadow-2xl {
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Ensure modal appears above everything */
.z-50 {
  z-index: 9999;
}

/* Animation for loading spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
