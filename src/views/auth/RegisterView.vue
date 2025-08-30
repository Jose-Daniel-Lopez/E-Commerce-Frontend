<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/axios'
import { useThemeClasses } from '@/composables/useThemeClasses'
import Wrapper from '@/components/shared/Wrapper.vue'
import FloatingInput from '@/components/shared/FloatingInput.vue'
import PasswordInput from '@/components/shared/PasswordInput.vue'
import ErrorAlert from '@/components/shared/ErrorAlert.vue'
import SubmitButton from '@/components/shared/SubmitButton.vue'
import { sendVerificationEmail } from '@/lib/emailjs'
import { useFormValidation, validationRules } from '@/composables/useFormValidation'
import WipTag from '@/components/shared/WipTag.vue'

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  role: string
}

interface RegisterResponse {
  token?: string
  user?: {
    id: number
    username: string
    email: string
    role: string
    verificationToken?: string
  }
}

const router = useRouter()

// Theme classes
const {
  pageBackgroundClasses,
  cardClasses,
  textClasses,
  textMutedClasses,
  formInputClasses,
  iconBackgroundClasses
} = useThemeClasses()

// Component state
const form = ref<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'CUSTOMER',
})
const loading = ref(false)
const showVerificationMsg = ref(false)
const termsAccepted = ref(false)
const isDropdownOpen = ref(false)

// Form validation setup
const {
  globalError,
  registerField,
  updateField,
  validateForm,
  hasFieldError,
  setGlobalError,
  clearGlobalError,
} = useFormValidation()

// Available user roles
const roles = [
  { value: 'CUSTOMER', label: 'Customer', isWip: false },
  { value: 'SELLER', label: 'Seller', isWip: true },
  { value: 'ADMIN', label: 'Admin', isWip: true },
]

/**
 * Initialize form validation rules
 */
onMounted(() => {
  registerField('username', form.value.username, [
    validationRules.required('Username is required'),
    validationRules.minLength(3, 'Username must be at least 3 characters long'),
  ])

  registerField('email', form.value.email, [
    validationRules.required('Email is required'),
    validationRules.email('Please enter a valid email address'),
  ])

  registerField('password', form.value.password, [
    validationRules.required('Password is required'),
    validationRules.minLength(6, 'Password must be at least 6 characters long'),
  ])

  registerField('confirmPassword', form.value.confirmPassword, [
    validationRules.required('Please confirm your password'),
    {
      test: (value: unknown) => String(value) === form.value.password,
      message: 'Passwords do not match',
    },
  ])
})

/**
 * Handle input changes for each field
 */
const handleUsernameChange = (value: string) => {
  form.value.username = value
  updateField('username', value)
}

const handleEmailChange = (value: string) => {
  form.value.email = value
  updateField('email', value)
}

const handlePasswordChange = (value: string) => {
  form.value.password = value
  updateField('password', value)
  // Re-validate confirm password if it has a value
  if (form.value.confirmPassword) {
    updateField('confirmPassword', form.value.confirmPassword)
  }
}

const handleConfirmPasswordChange = (value: string) => {
  form.value.confirmPassword = value
  updateField('confirmPassword', value)
}

/**
 * Handle role selection from custom dropdown
 */
const selectRole = (roleValue: string) => {
  form.value.role = roleValue
  isDropdownOpen.value = false
}

/**
 * Get the selected role object
 */
const selectedRole = computed(() => {
  return roles.find(r => r.value === form.value.role) || roles[0]
})

/**
 * Custom validation for terms acceptance
 */
const validateTerms = (): boolean => {
  if (!termsAccepted.value) {
    setGlobalError('You must agree to the Terms of Service and Privacy Policy')
    return false
  }
  return true
}

/**
 * Handle form submission and API call
 *
 * @description
 * Manages the complete registration flow including:
 * - Form validation (fields and terms)
 * - Loading state management
 * - API call to registration endpoint
 * - Email verification process
 * - Success/error handling and user feedback
 * - Navigation after successful registration
 */
const handleSubmit = async (): Promise<void> => {
  const { isValid } = validateForm()

  if (!isValid || !validateTerms()) return

  loading.value = true

  try {
    const { data } = await api.post<RegisterResponse>('/auth/register', {
      username: form.value.username.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
      role: form.value.role,
    })

    if (data.user && data.user.verificationToken) {
      // Build verification link with base URL
      const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '') // Remove trailing slash
      const verificationLink = `${window.location.origin}${baseUrl}/verify?token=${data.user.verificationToken}`

      // Send verification email
      try {
        await sendVerificationEmail({
          email: data.user.email,
          verification_link: verificationLink,
        })
        showVerificationMsg.value = true
        setTimeout(() => {
          router.push({ name: 'login' })
        }, 10000)
        return
      } catch (emailError) {
        console.error('Error sending verification email:', emailError)
        setGlobalError(
          'Account created but verification email failed to send. Please contact support.',
        )
        return
      }
    }

    await router.push({ name: 'login' })
  } catch (err: unknown) {
    console.error('Registration error:', err)
    const error_obj = err as { response?: { status?: number; data?: { message?: string; error?: string } } }

    if (error_obj.response?.status === 409) {
      // Check if the error message contains information about which field is duplicated
      const errorMessage = error_obj.response.data?.message || error_obj.response.data?.error || ''
      console.log('409 Error message:', errorMessage) // Debug log

      if (errorMessage.toLowerCase().includes('username')) {
        setGlobalError('Username already exists')
      } else if (errorMessage.toLowerCase().includes('email')) {
        setGlobalError('Email already exists')
      } else {
        setGlobalError('Username or email already exists')
      }
    } else if (error_obj.response?.status === 400) {
      setGlobalError('Bad registration data')
    } else {
      setGlobalError('Registration failed. Please try again.')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div :class="['pt-[85px] lg:pt-0', pageBackgroundClasses]">
    <Wrapper class="py-8">
      <!-- Header -->
      <section class="max-w-7xl mx-auto mb-8">
        <h1 :class="['font-srProDisplay text-2xl font-semibold text-left', textClasses]">Join us</h1>
      </section>

      <!-- Registration Content -->
      <section class="max-w-7xl mx-auto mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <!-- Left Panel - Account Benefits -->
          <div :class="['rounded-lg p-6 h-full', cardClasses]">
            <h2 :class="['font-srProDisplay text-xl font-semibold mb-6', textClasses]">
              Why Create an Account?
            </h2>

            <div class="space-y-0">
              <!-- Faster Checkout -->
              <div class="flex items-start gap-4 py-8 border-b border-border">
                <div
                  :class="['w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0', iconBackgroundClasses]"
                >
                  <v-icon name="hi-truck" scale="1.7" class="text-primary" />
                </div>
                <div>
                  <h3 :class="['font-srProDisplay text-lg font-medium mb-1', textClasses]">
                    Faster Checkout
                  </h3>
                  <p :class="['font-srProDisplay text-sm mb-1', textMutedClasses]">
                    Save your information for quicker purchases
                  </p>
                  <p :class="['font-srProDisplay text-sm', textMutedClasses]">
                    Skip entering details every time
                  </p>
                </div>
              </div>

              <!-- Order History -->
              <div class="flex items-start gap-4 py-12 border-b border-border">
                <div
                  :class="['w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0', iconBackgroundClasses]"
                >
                  <v-icon name="hi-clipboard-list" scale="1.7" class="text-primary" />
                </div>
                <div>
                  <h3 :class="['font-srProDisplay text-lg font-medium mb-1', textClasses]">
                    Order History
                  </h3>
                  <p :class="['font-srProDisplay text-sm mb-1', textMutedClasses]">
                    Track all your purchases in one place
                  </p>
                  <p class="font-srProDisplay text-muted-foreground text-xs">
                    Easy returns and support
                  </p>
                </div>
              </div>

              <!-- Exclusive Offers -->
              <div class="flex items-start gap-4 py-12 border-b border-border">
                <div
                  :class="['w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0', iconBackgroundClasses]"
                >
                  <v-icon name="hi-gift" scale="1.7" class="text-primary" />
                </div>
                <div>
                  <h3 :class="['font-srProDisplay text-lg font-medium mb-1', textClasses]">
                    Exclusive Offers
                  </h3>
                  <p :class="['font-srProDisplay text-sm mb-1', textMutedClasses]">
                    Get access to member-only deals
                  </p>
                  <p :class="['font-srProDisplay text-sm', textMutedClasses]">
                    Early access to sales and new products
                  </p>
                </div>
              </div>

              <!-- Wishlist -->
              <div class="flex items-start gap-4 py-12">
                <div
                  :class="['w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0', iconBackgroundClasses]"
                >
                  <v-icon name="hi-heart" scale="1.7" class="text-primary" />
                </div>
                <div>
                  <h3 :class="['font-srProDisplay text-lg font-medium mb-1', textClasses]">
                    Save Favorites
                  </h3>
                  <p :class="['font-srProDisplay text-sm mb-1', textMutedClasses]">
                    Create wishlists and save items for later
                  </p>
                  <p class="font-srProDisplay text-muted-foreground text-xs">
                    Never lose track of products you love
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panel - Registration Form -->
          <div class="animate-[fadeInUp_0.8s_ease-out]">
            <div
              :class="['border rounded-lg p-6 h-full transition-all duration-300 hover:shadow-lg', cardClasses]"
            >
              <h2 :class="['font-srProDisplay text-xl font-semibold mb-6', textClasses]">
                Registration Form
              </h2>

              <!-- Success Message -->
              <div
                v-if="showVerificationMsg"
                class="mb-4 flex items-center justify-between rounded-lg border border-success bg-success-bg p-3 animate-[slideDown_0.3s_ease-out]"
              >
                <p class="font-srProDisplay text-sm text-success">
                  Account verification email sent! Please check your inbox to verify your account.
                </p>
              </div>

              <!-- Error Alert -->
              <ErrorAlert
                :message="globalError"
                :show="!!globalError"
                @dismiss="clearGlobalError"
              />

              <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
                <!-- Username -->
                <FloatingInput
                  id="username"
                  label="Username"
                  :model-value="form.username"
                  type="text"
                  autocomplete="username"
                  :required="true"
                  animation-class="animate-[fadeInUp_0.6s_ease-out_0.1s_both]"
                  :has-error="hasFieldError('username').value"
                  @update:model-value="handleUsernameChange"
                />

                <!-- Email -->
                <FloatingInput
                  id="email"
                  label="Email Address"
                  :model-value="form.email"
                  type="email"
                  autocomplete="email"
                  :required="true"
                  animation-class="animate-[fadeInUp_0.6s_ease-out_0.2s_both]"
                  :has-error="hasFieldError('email').value"
                  @update:model-value="handleEmailChange"
                />

                <!-- Role -->
                <div
                  class="relative transition-all duration-300 hover:-translate-y-0.5 animate-[fadeInUp_0.6s_ease-out_0.3s_both]"
                >
                  <div class="relative">
                    <!-- Custom Dropdown Button -->
                    <button
                      type="button"
                      @click="isDropdownOpen = !isDropdownOpen"
                      :class="['peer w-full px-4 pt-6 pb-2 pr-10 border rounded-xl bg-input backdrop-blur-sm font-srProDisplay focus:outline-none focus:border-primary focus:bg-input focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)] focus:scale-[1.01] transition-all duration-300 appearance-none cursor-pointer text-left', formInputClasses]"
                    >
                      <span class="flex items-center gap-2">
                        {{ selectedRole.label }}
                        <WipTag
                          v-if="selectedRole.isWip"
                          variant="compact"
                          :show-icon="false"
                          text="WIP"
                          tooltip="Work In Progress. Yet to be implemented."
                        />
                      </span>
                    </button>

                    <!-- Hidden select for form submission -->
                    <select
                      v-model="form.role"
                      class="sr-only"
                      tabindex="-1"
                      aria-hidden="true"
                    >
                      <option v-for="r in roles" :key="r.value" :value="r.value">
                        {{ r.label }}
                      </option>
                    </select>

                    <label
                      for="role"
                      :class="['absolute left-4 top-2 text-xs font-srProDisplay transition-all duration-300 transform origin-left pointer-events-none bg-background px-1.5 z-[1]', textClasses]"
                    >
                      Account Type
                    </label>

                    <!-- Custom dropdown arrow -->
                    <div
                      class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                    >
                      <v-icon
                        name="hi-chevron-down"
                        scale="1.2"
                        class="text-muted-foreground transition-transform duration-200"
                        :class="{ 'rotate-180': isDropdownOpen }"
                      />
                    </div>

                    <!-- Dropdown Menu -->
                    <div
                      v-if="isDropdownOpen"
                      :class="['top-full left-0 right-0 mt-1 border rounded-xl overflow-hidden', cardClasses]"
                    >
                      <button
                        v-for="role in roles"
                        :key="role.value"
                        type="button"
                        @click="selectRole(role.value)"
                        :class="[
                          'w-full px-4 py-3 text-left font-srProDisplay hover:bg-accent transition-colors duration-200 flex items-center justify-between gap-2',
                          textClasses,
                          { 'bg-accent': form.role === role.value }
                        ]"
                      >
                        <span>{{ role.label }}</span>
                        <WipTag
                          v-if="role.isWip"
                          variant="compact"
                          :show-icon="false"
                          text="WIP"
                          tooltip="Work In Progress. Yet to be implemented."
                        />
                      </button>
                    </div>
                  </div>

                  <!-- Click outside to close -->
                  <div
                    v-if="isDropdownOpen"
                    @click="isDropdownOpen = false"
                    class="fixed inset-0 z-40"
                  ></div>
                </div>

                <!-- Password -->
                <PasswordInput
                  id="password"
                  label="Password"
                  :model-value="form.password"
                  autocomplete="new-password"
                  :required="true"
                  animation-class="animate-[fadeInUp_0.6s_ease-out_0.4s_both]"
                  :has-error="hasFieldError('password').value"
                  @update:model-value="handlePasswordChange"
                />

                <!-- Confirm Password -->
                <PasswordInput
                  id="confirmPassword"
                  label="Confirm Password"
                  :model-value="form.confirmPassword"
                  autocomplete="new-password"
                  :required="true"
                  animation-class="animate-[fadeInUp_0.6s_ease-out_0.5s_both]"
                  :has-error="hasFieldError('confirmPassword').value"
                  @update:model-value="handleConfirmPasswordChange"
                />

                <!-- Divider -->
                <div
                  class="border-t border-border pt-4 animate-[fadeInUp_0.6s_ease-out_0.6s_both]"
                >
                  <!-- Terms Agreement -->
                  <div class="mb-4">
                    <label class="flex items-start group cursor-pointer">
                      <input
                        v-model="termsAccepted"
                        type="checkbox"
                        required
                        class="appearance-none w-4 h-4 border border-border rounded-sm bg-input cursor-pointer relative flex-shrink-0 mr-3 mt-1 hover:border-muted checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-3 after:h-3 after:bg-[url('data:image/svg+xml,%3csvg%20viewBox%3D%270%200%2016%2016%27%20fill%3D%27white%27%20xmlns%3D%27http://www.w3.org/2000/svg%27%3e%3cpath%20d%3D%27m13.854%203.646a.5.5%200%200%201%200%20.708l-7%207a.5.5%200%200%201-.708%200l-3.5-3.5a.5.5%200%201%201%20.708-.708L6.5%2010.293l6.646-6.647a.5.5%200%200%201%20.708%200z%27/%3e%3c/svg%3e')] after:bg-contain after:bg-no-repeat after:bg-center after:opacity-0 checked:after:opacity-100 transition-all duration-200"
                      />
                      <span
                        :class="['font-srProDisplay text-sm group-hover:text-primary transition-colors duration-200', textMutedClasses]"
                      >
                        I agree to the
                        <router-link :to="{ name: 'terms' }" class="text-primary hover:underline cursor-pointer"
                          >Terms of Service</router-link
                        >
                        and
                        <router-link :to="{ name: 'privacy' }" class="text-primary hover:underline cursor-pointer"
                          >Privacy Policy </router-link
                        >
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Submit Button -->
                <SubmitButton
                  :loading="loading"
                  text="Create Account"
                  loading-text="Creating Account..."
                  :aria-describedby="globalError ? 'register-error' : undefined"
                />
              </form>

              <!-- Sign In Link -->
              <div class="mt-6 pt-4 border-t border-border">
                <p :class="['text-center font-srProDisplay text-sm', textMutedClasses]">
                  Already have an account?
                  <RouterLink
                    to="/login"
                    class="font-medium text-primary hover:underline ml-1 cursor-pointer"
                    >Sign in</RouterLink
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<style scoped>
/* Component-specific styles only */
/* Hide browser password visibility toggles since we have our own */
input[type='password']::-ms-reveal,
input[type='password']::-ms-clear,
input[type='password']::-webkit-credentials-auto-fill-button,
input[type='password']::-webkit-input-password-toggle-button,
input[type='password']::-webkit-input-clear-button {
  display: none !important;
}

input[type='text']::-ms-reveal,
input[type='text']::-ms-clear,
input[type='text']::-webkit-credentials-auto-fill-button,
input[type='text']::-webkit-input-password-toggle-button,
input[type='text']::-webkit-input-clear-button {
  display: none !important;
}

/* Component-specific animations for registration form */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
