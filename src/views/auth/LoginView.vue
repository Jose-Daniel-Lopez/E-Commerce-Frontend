<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/axios'
import Wrapper from '@/components/shared/Wrapper.vue'

interface LoginForm {
  email: string
  password: string
}

interface LoginResponse {
  token?: string
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
}

const router = useRouter()

// Component state
const form = ref<LoginForm>({
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

// Form validation with user-friendly error messages
const validateForm = () => {
  if (!form.value.email) return error.value = 'Email is required', false
  if (!form.value.email.includes('@')) return error.value = 'Please enter a valid email', false
  if (!form.value.password) return error.value = 'Password is required', false
  if (form.value.password.length < 6) return error.value = 'Password must be at least 6 characters', false
  return true
}

// Handle form submission and API call
const handleSubmit = async () => {
  error.value = ''
  if (!validateForm()) return
  loading.value = true

  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      email: form.value.email,
      password: form.value.password
    })

    console.log('Login successful:', response.data)

    // Save token if exists
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
    }

    // Save user information
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }

    // Redirect to users page
    router.push({ name: 'users' })

  } catch (err: any) {
    console.error('Login error:', err)
    if (err.response?.status === 401) error.value = 'Incorrect credentials'
    else if (err.response?.status === 404) error.value = 'User not found'
    else error.value = 'Login error. Please try again.'
  } finally {
    loading.value = false
  }
}

// Toggle password visibility
const togglePasswordVisibility = () => showPassword.value = !showPassword.value
const clearError = () => error.value = ''
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
    <!-- Subtle background decoration -->
    <div class="absolute inset-0 opacity-30">
      <div class="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-gray-100 to-gray-50 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-transparent via-gray-50 to-transparent rounded-full blur-3xl"></div>
    </div>

    <!-- Geometric patterns -->
    <div class="absolute inset-0 opacity-5">
      <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>
    </div>

    <Wrapper class="relative z-10">
      <div class="min-h-screen flex items-center justify-center py-12">
        <!-- Centered Login Card -->
        <div class="w-full max-w-md animate-fadeInUp">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="font-srProDisplay text-3xl font-semibold text-black mb-2">Welcome back</h1>
            <p class="font-srProDisplay text-[#666666] text-sm">Sign in to continue to your account</p>
          </div>

          <!-- Login Form Card -->
          <div class="bg-white/80 backdrop-blur-sm border border-[#EBEBEB] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/90">
            <!-- Error Message -->
            <div v-if="error" class="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 animate-slideDown">
              <p class="font-srProDisplay text-sm text-red-700">{{ error }}</p>
              <button @click="clearError" class="text-red-600 hover:underline text-sm transition-all duration-200 hover:scale-110">✕</button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Email -->
              <div class="form-group">
                <div class="relative">
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    autocomplete="email"
                    required
                    @input="clearError"
                    class="floating-input peer w-full px-4 pt-6 pb-2 border border-[#EBEBEB] rounded-xl bg-white/50 backdrop-blur-sm font-srProDisplay text-black focus:outline-none focus:border-black focus:bg-white transition-all duration-300 transform"
                    placeholder=" "
                  />
                  <label
                    for="email"
                    class="floating-label absolute left-4 top-4 font-srProDisplay text-[#999999] transition-all duration-300 transform origin-left pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-black"
                  >
                    Email Address
                  </label>
                </div>
              </div>

              <!-- Password -->
              <div class="form-group">
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    required
                    @input="clearError"
                    class="floating-input peer w-full px-4 pt-6 pb-2 pr-12 border border-[#EBEBEB] rounded-xl bg-white/50 backdrop-blur-sm font-srProDisplay text-black focus:outline-none focus:border-black focus:bg-white transition-all duration-300 transform"
                    placeholder=" "
                  />
                  <label
                    for="password"
                    class="floating-label absolute left-4 top-4 font-srProDisplay text-[#999999] transition-all duration-300 transform origin-left pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-black"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    @click="togglePasswordVisibility"
                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-[#999999] hover:text-black transition-all duration-200 transform hover:scale-110"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  >
                    <v-icon :name="showPassword ? 'hi-eye-off' : 'hi-eye'" scale="1.4" />
                  </button>
                </div>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between pt-2">
                <label class="flex items-center group cursor-pointer">
                  <input
                    v-model="rememberMe"
                    type="checkbox"
                    class="mr-3 text-black focus:ring-black border-[#EBEBEB] rounded transition-all duration-200"
                  />
                  <span class="font-srProDisplay text-sm text-[#666666] group-hover:text-black transition-colors duration-200">Remember me</span>
                </label>
                <a href="#" class="font-srProDisplay text-sm text-[#666666] hover:text-black hover:underline transition-all duration-200">
                  Forgot password?
                </a>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-black text-white font-srProDisplay font-medium py-4 rounded-xl hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg mt-8"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
                <span v-else>Sign In</span>
              </button>
            </form>

            <!-- Sign Up Link -->
            <div class="mt-8 pt-6 border-t border-[#EBEBEB]">
              <p class="text-center font-srProDisplay text-sm text-[#666666]">
                Don't have an account?
                <RouterLink to="/register" class="font-medium text-black hover:underline ml-1 transition-all duration-200">Create one here</RouterLink>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="text-center mt-8">
            <p class="font-srProDisplay text-xs text-[#999999]">
              By signing in, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  </div>
</template>

<style scoped>
/* Entry animations */
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

/* Remove default focus outline */
button:focus {
  outline: none;
  box-shadow: none;
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out;
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

/* Floating input styles */
.floating-input:focus + .floating-label,
.floating-input:not(:placeholder-shown) + .floating-label {
  transform: translateY(-12px) scale(0.75);
  color: #000000;
}

/* Form group hover effects */
.form-group {
  transition: all 0.3s ease;
}

.form-group:hover {
  transform: translateY(-1px);
}

/* Password toggle button animation */
.floating-input + label + button:hover {
  transform: scale(1.1);
}

/* Smooth focus animation for inputs */
.floating-input:focus {
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  transform: scale(1.01);
}

/* Smooth label transitions */
.floating-label {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Staggered entry animation for form fields */
.form-group:nth-child(1) {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.form-group:nth-child(2) {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

/* Submit button animation */
button[type="submit"] {
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

/* Loading spinner animation */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Backdrop blur support */
@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
}

/* Hide toggle password visibility for Chrome, Edge & Safari */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear,
input[type="password"]::-webkit-credentials-auto-fill-button,
input[type="password"]::-webkit-input-password-toggle-button,
input[type="password"]::-webkit-input-clear-button {
  display: none !important;
}
input[type="text"]::-ms-reveal,
input[type="text"]::-ms-clear,
input[type="text"]::-webkit-credentials-auto-fill-button,
input[type="text"]::-webkit-input-password-toggle-button,
input[type="text"]::-webkit-input-clear-button {
  display: none !important;
}

</style>
