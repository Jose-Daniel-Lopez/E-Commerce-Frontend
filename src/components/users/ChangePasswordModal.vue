<template>
  <Transition name="modal-overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
      @click="closeModal"
    >
      <div
        class="w-full max-w-md transform bg-white border border-gray-200 shadow-2xl rounded-xl modal-content"
        @click.stop
      >
          <!-- Modal Header -->
          <div class="sticky top-0 z-10 px-6 py-4 bg-white border-b border-gray-200 rounded-t-xl">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-semibold text-black font-srProDisplay">
                  Change Password
                </h2>
                <p class="mt-1 text-sm text-gray-600 font-srProDisplay">
                  Enter your current password and choose a new one
                </p>
              </div>
              <button
                @click="closeModal"
                class="p-2 transition-colors rounded-full hover:bg-gray-100"
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
              class="p-4 border border-red-200 rounded-lg bg-red-50"
            >
              <div class="flex items-center">
                <v-icon name="hi-exclamation-circle" scale="1.2" class="mr-3 text-red-600" />
                <p class="text-sm text-red-700 font-srProDisplay">{{ error }}</p>
              </div>
            </div>

            <!-- Success Message -->
            <div
              v-if="success"
              class="p-4 border border-green-200 rounded-lg bg-green-50"
            >
              <div class="flex items-center">
                <v-icon name="hi-check-circle" scale="1.2" class="mr-3 text-green-600" />
                <p class="text-sm text-green-700 font-srProDisplay">{{ success }}</p>
              </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Current Password -->
              <PasswordInput
                id="currentPassword"
                label="Current Password"
                :model-value="formData.currentPassword"
                autocomplete="current-password"
                :required="true"
                :disabled="loading"
                @update:model-value="updateCurrentPassword"
              />

              <!-- New Password -->
              <div class="space-y-1">
                <PasswordInput
                  id="newPassword"
                  label="New Password"
                  :model-value="formData.newPassword"
                  autocomplete="new-password"
                  :required="true"
                  :disabled="loading"
                  :min-length="8"
                  @update:model-value="updateNewPassword"
                />
                <p class="mt-1 text-xs text-gray-500 font-srProDisplay">
                  Password must be at least 8 characters long
                </p>
              </div>

              <!-- Confirm New Password -->
              <div class="space-y-1">
                <PasswordInput
                  id="confirmPassword"
                  label="Confirm New Password"
                  :model-value="formData.confirmPassword"
                  autocomplete="new-password"
                  :required="true"
                  :disabled="loading"
                  @update:model-value="updateConfirmPassword"
                />
                <p
                  v-if="formData.confirmPassword && formData.newPassword !== formData.confirmPassword"
                  class="mt-1 text-xs text-red-500 font-srProDisplay"
                >
                  Passwords do not match
                </p>
              </div>

              <!-- Password Strength Indicator -->
              <div v-if="formData.newPassword" class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-600 font-srProDisplay">Password Strength:</span>
                  <span
                    :class="[
                      'font-srProDisplay text-xs font-medium',
                      passwordStrength.color
                    ]"
                  >
                    {{ passwordStrength.label }}
                  </span>
                </div>
                <div class="w-full h-2 bg-gray-200 rounded-full">
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
            class="sticky bottom-0 z-10 px-6 py-4 bg-white border-t border-gray-200 rounded-b-xl"
          >
            <div class="flex justify-end gap-3">
              <button
                @click="closeModal"
                class="px-6 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                :disabled="loading"
              >
                Cancel
              </button>
              <button
                @click="handleSubmit"
                :disabled="!isFormValid || loading"
                class="flex items-center px-6 py-2 font-medium text-white transition-colors bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, shallowRef } from 'vue'
import { useAuthStore } from '@/stores/auth'
import PasswordInput from '@/components/shared/PasswordInput.vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const authStore = useAuthStore()

// Form state - usar shallowRef para mejor rendimiento
const formData = shallowRef({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// UI state
const loading = ref(false)
const error = ref('')
const success = ref('')

// Cache para password strength para evitar recalculos
const strengthCache = new Map()

// Form validation con debounce implícito
const isFormValid = computed(() => {
  const data = formData.value
  return (
    data.currentPassword.length > 0 &&
    data.newPassword.length >= 8 &&
    data.newPassword === data.confirmPassword
  )
})

// Event handlers optimizados
const updateCurrentPassword = (value: string) => {
  formData.value = { ...formData.value, currentPassword: value }
}

const updateNewPassword = (value: string) => {
  formData.value = { ...formData.value, newPassword: value }
}

const updateConfirmPassword = (value: string) => {
  formData.value = { ...formData.value, confirmPassword: value }
}

// Password strength calculator optimizado con cache
const passwordStrength = computed(() => {
  const password = formData.value.newPassword

  // Usar cache para evitar recalculos
  if (strengthCache.has(password)) {
    return strengthCache.get(password)
  }

  let score = 0
  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  const strengthLevels = [
    { label: 'Very Weak', color: 'text-red-600', bgColor: 'bg-red-500', width: 20 },
    { label: 'Weak', color: 'text-red-500', bgColor: 'bg-red-400', width: 40 },
    { label: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-400', width: 60 },
    { label: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-400', width: 80 },
    { label: 'Strong', color: 'text-green-500', bgColor: 'bg-green-400', width: 90 },
    { label: 'Very Strong', color: 'text-green-600', bgColor: 'bg-green-500', width: 100 }
  ]

  const result = strengthLevels[score] || strengthLevels[0]

  // Guardar en cache
  strengthCache.set(password, result)

  // Limpiar cache si crece mucho
  if (strengthCache.size > 50) {
    strengthCache.clear()
  }

  return result
})

// Reset form cuando el modal se abre - optimizado
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    // Reset inmediato sin watchers anidados
    formData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    error.value = ''
    success.value = ''
    strengthCache.clear() // Limpiar cache al abrir
  }
}, { immediate: false })

const resetForm = () => {
  formData.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  error.value = ''
  success.value = ''
  strengthCache.clear()
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

/* Modal Transitions - Optimizadas */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.25s ease-out;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

/* Animación del contenido del modal aplicada directamente */
.modal-content {
  animation: modal-content-enter 0.25s ease-out;
}

@keyframes modal-content-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Custom shadow for modal - Optimizada */
.shadow-2xl {
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(0, 0, 0, 0.08);
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
