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

const form = ref<LoginForm>({
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

// Validates the login form fields before submitting
const validateForm = () => {
  if (!form.value.email) return error.value = 'Email is required', false
  if (!form.value.email.includes('@')) return error.value = 'Please enter a valid email', false
  if (!form.value.password) return error.value = 'Password is required', false
  if (form.value.password.length < 6) return error.value = 'Password must be at least 6 characters', false
  return true
}

// Handles the login process and manages authentication feedback
const handleSubmit = async () => {
  error.value = ''
  if (!validateForm()) return
  loading.value = true

  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      email: form.value.email,
      password: form.value.password
    })

    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
    }
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    router.push({ name: 'users' })
  } catch (err: any) {
    if (err.response?.status === 401) error.value = 'Incorrect credentials'
    else if (err.response?.status === 404) error.value = 'User not found'
    else if (err.response?.status === 403) error.value = 'Account not verified. Please check your email for the verification link.'
    else error.value = 'Login error. Please try again.'
  } finally {
    loading.value = false
  }
}

// Toggles the visibility of the password input
const togglePasswordVisibility = () => showPassword.value = !showPassword.value

// Clears any displayed error message
const clearError = () => error.value = ''
</script>

<template>
  <div class="bg-[#f6f6f6] min-h-screen flex items-center justify-center">
    <!-- Centered card with two sections: image and form -->
    <div class="login-card flex w-[850px] max-w-full min-h-[520px] rounded-2xl shadow-2xl overflow-hidden bg-white">
      <!-- Left: welcoming image for visual appeal -->
      <div class="left-section flex-1 min-w-[320px] bg-cover bg-center" style="background-image: url('/images/login.webp');"></div>
      <!-- Right: login form for user authentication -->
      <div class="right-section flex-1 min-w-[320px] flex items-center justify-center bg-white">
        <Wrapper class="form-wrapper">
          <div class="w-full max-w-md animate-fadeInUp">
            <!-- Welcome header -->
            <div class="text-center mb-8">
              <h1 class="font-srProDisplay text-3xl font-semibold text-black mb-2">Welcome back</h1>
              <p class="font-srProDisplay text-[#666666] text-sm">Sign in to continue to your account</p>
            </div>
            <!-- Login form card -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 transition-all duration-500 hover:bg-white/90">
              <!-- Error message display -->
              <div v-if="error" class="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 animate-slideDown">
                <p class="font-srProDisplay text-sm text-red-700">{{ error }}</p>
                <button @click="clearError" class="text-red-600 hover:underline text-sm transition-all duration-200 hover:scale-110">✕</button>
              </div>
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Email input field -->
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
                <!-- Password input field with visibility toggle -->
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
                <!-- Remember me and forgot password options -->
                <div class="flex items-center justify-between">
                  <label class="flex items-center group cursor-pointer">
                    <input
                      v-model="rememberMe"
                      type="checkbox"
                      class="custom-checkbox mr-3 text-black focus:ring-black border-[#EBEBEB] rounded transition-all duration-200"
                    />
                    <span class="font-srProDisplay text-sm text-[#666666] group-hover:text-black transition-colors duration-200">Remember me</span>
                  </label>
                  <a href="#" class="font-srProDisplay text-sm text-[#666666] hover:text-black hover:underline transition-all duration-200">
                    Forgot password?
                  </a>
                </div>
                <!-- Sign in button with loading state -->
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
              <!-- Sign up link for new users -->
              <div class="mt-8 pt-6 border-t border-[#EBEBEB]">
                <p class="text-center font-srProDisplay text-sm text-[#666666]">
                  Don't have an account?
                  <RouterLink to="/register" class="font-medium text-black hover:underline ml-1 transition-all duration-200">Create one here</RouterLink>
                </p>
              </div>
            </div>
            <!-- Footer with terms and privacy notice -->
            <div class="text-center mt-8">
              <p class="font-srProDisplay text-xs text-[#999999]">
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
.login-card {
  /* Centers the card, adds shadow and rounded corners for a modern look */
  margin: 0 auto;
}

.left-section {
  background-image: url('/images/login.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.right-section {
  background: #fff;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 32px 24px;
  border-radius: 20px;
  background: #fff;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  border-radius: 10px;
}

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

.floating-input:focus + .floating-label,
.floating-input:not(:placeholder-shown) + .floating-label {
  transform: translateY(-12px) scale(0.75);
  color: #000000;
}

.form-group {
  transition: all 0.3s ease;
}

.form-group:hover {
  transform: translateY(-1px);
}

.floating-input + label + button:hover {
  transform: scale(1.1);
}

.floating-input:focus {
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  transform: scale(1.01);
}

.floating-label {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-group:nth-child(1) {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.form-group:nth-child(2) {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

button[type="submit"] {
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

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

@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
}

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

/* Responsive design: adapts layout for smaller screens */
@media (max-width: 900px) {
  .login-card {
    flex-direction: column;
    width: 100vw;
    height: auto;
    border-radius: 0;
  }
  .left-section {
    display: none;
  }
  .right-section {
    width: 100%;
    min-width: unset;
  }
}

/* Smooth transitions for interactive elements like checkboxes */
.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background-color: white;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
}

/* Checkbox hover effect for better feedback */
.custom-checkbox:hover {
  border-color: #9ca3af;
}

/* Checkbox checked state: shows a checkmark and dark background */
.custom-checkbox:checked {
  background-color: #000000;
  border-color: #000000;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M13.854 3.646L6.354 11.146a.5.5 0 01-.708 0L2.146 7.646a.5.5 0 11.708-.708L6 10.293l7.146-7.147a.5.5 0 01.708.708z'/%3e%3c/svg%3e");
  background-size: 8px 8px;
  background-position: center;
  background-repeat: no-repeat;
}
</style>

