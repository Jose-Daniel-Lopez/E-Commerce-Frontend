<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import Wrapper from '@/components/shared/Wrapper.vue'
import FloatingInput from '@/components/shared/FloatingInput.vue'
import PasswordInput from '@/components/shared/PasswordInput.vue'
import ErrorAlert from '@/components/shared/ErrorAlert.vue'
import SubmitButton from '@/components/shared/SubmitButton.vue'
import { useFormValidation, validationRules } from '@/composables/useFormValidation'

interface LoginForm {
  email: string
  password: string
}

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = ref<LoginForm>({
  email: '',
  password: '',
})
const loading = ref(false)
const rememberMe = ref(false)

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

/**
 * Initialize form validation rules
 */
onMounted(() => {
  registerField('email', form.value.email, [
    validationRules.required('Email is required'),
    validationRules.email('Please enter a valid email address'),
  ])

  registerField('password', form.value.password, [
    validationRules.required('Password is required'),
    validationRules.minLength(6, 'Password must be at least 6 characters long'),
  ])
})

/**
 * Handle email input changes
 */
const handleEmailChange = (value: string) => {
  form.value.email = value
  updateField('email', value)
}

/**
 * Handle password input changes
 */
const handlePasswordChange = (value: string) => {
  form.value.password = value
  updateField('password', value)
}

/**
 * Handles the login process and manages authentication feedback
 *
 * @description
 * Manages the complete login flow including:
 * - Form validation
 * - Loading state management
 * - API call to authentication store
 * - Success/error handling and user feedback with toast notifications
 * - Navigation after successful login
 */
const handleSubmit = async (): Promise<void> => {
  const { isValid } = validateForm()

  if (!isValid) return

  loading.value = true
  clearGlobalError() // Clear any previous errors

  try {
    const result = await authStore.login({
      email: form.value.email.trim(),
      password: form.value.password,
    })

    if (result?.success) {
      // Show success toast notification
      toast.success('Welcome back! You have been successfully logged in.', {
        title: 'Login Successful',
        duration: 4000,
      })

      // Small delay to show the toast before navigation
      setTimeout(async () => {
        await router.push({ name: 'userAccount' })
      }, 500)
    } else {
      setGlobalError(result?.error || 'Login failed. Please try again.')
      // Also show error toast for better UX
      toast.error(result?.error || 'Login failed. Please try again.', {
        title: 'Login Failed',
        duration: 6000,
      })
    }
  } catch (err) {
    console.error('Login error:', err)
    const errorMessage = 'An unexpected error occurred. Please try again.'
    setGlobalError(errorMessage)
    toast.error(errorMessage, {
      title: 'Login Error',
      duration: 6000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-[#f6f6f6] min-h-screen flex items-center justify-center">
    <!-- Centered card with two sections: image and form -->
    <div
      class="flex max-[900px]:flex-col w-[850px] max-w-full min-h-[520px] max-[900px]:w-screen max-[900px]:h-auto max-[900px]:rounded-none rounded-2xl shadow-2xl overflow-hidden bg-white mx-auto"
    >
      <!-- Left: welcoming image for visual appeal -->
      <div
        class="flex-1 min-w-[320px] max-[900px]:hidden bg-cover bg-center bg-no-repeat"
        style="background-image: url('/images/login.webp')"
      ></div>
      <!-- Right: login form for user authentication -->
      <div
        class="flex-1 min-w-[320px] max-[900px]:w-full max-[900px]:min-w-0 flex items-center justify-center bg-white"
      >
        <Wrapper class="w-full max-w-[400px] px-6 py-8 rounded-[20px] bg-white">
          <div class="w-full max-w-md animate-[fadeInUp_0.8s_ease-out]">
            <!-- Welcome header -->
            <div class="text-center mb-8">
              <h1 class="font-srProDisplay text-3xl font-semibold text-primary mb-2">
                Welcome back
              </h1>
              <p class="font-srProDisplay text-muted text-sm">
                Sign in to continue to your account
              </p>
            </div>
            <!-- Login form card -->
            <div
              class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 transition-all duration-500 hover:bg-white/90"
              role="main"
              aria-label="Login form"
            >
              <!-- Error message display -->
              <ErrorAlert
                :message="globalError"
                :show="!!globalError"
                @dismiss="clearGlobalError"
              />

              <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
                <!-- Email input field -->
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

                <!-- Password input field with visibility toggle -->
                <PasswordInput
                  id="password"
                  label="Password"
                  :model-value="form.password"
                  autocomplete="current-password"
                  :required="true"
                  animation-class="animate-[fadeInUp_0.6s_ease-out_0.3s_both]"
                  :has-error="hasFieldError('password').value"
                  @update:model-value="handlePasswordChange"
                />
                <!-- Remember me and forgot password options -->
                <div class="flex items-center justify-between">
                  <label class="flex items-center group cursor-pointer">
                    <input
                      v-model="rememberMe"
                      type="checkbox"
                      class="appearance-none w-4 h-4 border border-gray-300 rounded-sm bg-white cursor-pointer relative flex-shrink-0 mr-3 hover:border-gray-400 checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-3 after:h-3 after:bg-[url('data:image/svg+xml,%3csvg%20viewBox%3D%270%200%2016%2016%27%20fill%3D%27white%27%20xmlns%3D%27http://www.w3.org/2000/svg%27%3e%3cpath%20d%3D%27m13.854%203.646a.5.5%200%200%201%200%20.708l-7%207a.5.5%200%200%201-.708%200l-3.5-3.5a.5.5%200%201%201%20.708-.708L6.5%2010.293l6.646-6.647a.5.5%200%200%201%20.708%200z%27/%3e%3c/svg%3e')] after:bg-contain after:bg-no-repeat after:bg-center after:opacity-0 checked:after:opacity-100 transition-all duration-200"
                    />
                    <span
                      class="font-srProDisplay text-sm text-muted group-hover:text-primary transition-colors duration-200"
                      >Remember me</span
                    >
                  </label>
                  <a
                    href="#"
                    class="font-srProDisplay text-sm text-muted hover:text-primary hover:underline transition-all duration-200 cursor-pointer"
                  >
                    Forgot password?
                  </a>
                </div>
                <!-- Sign in button with loading state -->
                <SubmitButton
                  :loading="loading"
                  text="Sign In"
                  loading-text="Signing in..."
                  :aria-describedby="globalError ? 'login-error' : undefined"
                />
              </form>
              <!-- Sign up link for new users -->
              <div class="mt-8 pt-6 border-t border-input-border">
                <p class="text-center font-srProDisplay text-sm text-muted">
                  Don't have an account?
                  <RouterLink
                    to="/register"
                    class="font-medium text-primary hover:underline ml-1 transition-all duration-200 cursor-pointer"
                    >Create one here</RouterLink
                  >
                </p>
              </div>
            </div>
            <!-- Footer with terms and privacy notice -->
            <div class="text-center mt-8">
              <p class="font-srProDisplay text-xs text-muted-foreground">
                By signing in, you agree to our terms of service and privacy policy
              </p>
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

/* Remove button focus outline since we use Tailwind focus states */
button:focus {
  outline: none;
  box-shadow: none;
}

/* Backdrop filter support for browsers that support it */
@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
}
</style>
