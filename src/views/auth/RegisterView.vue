<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/axios'
import Wrapper from '@/components/shared/Wrapper.vue'

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
  }
}

const router = useRouter()

// Component state
const form = ref<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'CUSTOMER'
})
const loading = ref(false)
const error = ref('')
const showPwd = ref(false)
const showCP = ref(false)

// Available user roles
const roles = [
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'SELLER', label: 'Seller' },
  { value: 'ADMIN', label: 'Admin' }
]

// Form validation with user-friendly error messages
const validateForm = () => {
  if (!form.value.username) return error.value = 'Username is required', false
  if (form.value.username.length < 3) return error.value = 'Username too short', false
  if (!form.value.email) return error.value = 'Email is required', false
  if (!form.value.email.includes('@')) return error.value = 'Invalid email', false
  if (!form.value.password) return error.value = 'Password is required', false
  if (form.value.password.length < 6) return error.value = 'Password too short', false
  if (form.value.password !== form.value.confirmPassword)
    return error.value = 'Passwords do not match', false
  return true
}

// Handle form submission and API call
const handleSubmit = async () => {
  error.value = ''
  if (!validateForm()) return
  loading.value = true
  try {
    const { data } = await api.post<RegisterResponse>('/auth/register', {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      role: form.value.role
    })
    if (data.token) localStorage.setItem('authToken', data.token)
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
    router.push({ name: 'login' })
  } catch (err: unknown) {
    const error_obj = err as { response?: { status?: number } }
    if (error_obj.response?.status === 409) error.value = 'Email already exists'
    else if (error_obj.response?.status === 400) error.value = 'Bad registration data'
    else error.value = 'Registration failed'
  } finally {
    loading.value = false
  }
}

// Toggle password visibility
const togglePwd = () => showPwd.value = !showPwd.value
const toggleCP = () => showCP.value = !showCP.value
const clearErr = () => error.value = ''
</script>

<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black">
    <Wrapper class="py-8">

      <!-- Header -->
      <section class="max-w-7xl mx-auto mb-8">
        <h1 class="font-srProDisplay text-2xl font-semibold text-left text-black">Join us</h1>
      </section>

      <!-- Registration Content -->
      <section class="max-w-7xl mx-auto mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          <!-- Left Panel - Account Benefits -->
          <div class="bg-white rounded-lg p-6 h-full">
            <h2 class="font-srProDisplay text-xl font-semibold text-black mb-6">Why Create an Account?</h2>

            <div class="space-y-0">
              <!-- Faster Checkout -->
              <div class="flex items-start gap-4 py-8 border-b border-[#EBEBEB]">
                <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <v-icon name="hi-truck" scale="1.7" class="text-black" />
                </div>
                <div>
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">Faster Checkout</h3>
                  <p class="font-srProDisplay text-[#666666] text-sm mb-1">Save your information for quicker purchases</p>
                  <p class="font-srProDisplay text-[#666666] text-sm">Skip entering details every time</p>
                </div>
              </div>

              <!-- Order History -->
              <div class="flex items-start gap-4 py-12 border-b border-[#EBEBEB]">
                <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <v-icon name="hi-clipboard-list" scale="1.7" class="text-black" />
                </div>
                <div>
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">Order History</h3>
                  <p class="font-srProDisplay text-[#666666] text-sm mb-1">Track all your purchases in one place</p>
                  <p class="font-srProDisplay text-[#999999] text-xs">Easy returns and support</p>
                </div>
              </div>

              <!-- Exclusive Offers -->
              <div class="flex items-start gap-4 py-12 border-b border-[#EBEBEB]">
                <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <v-icon name="hi-gift" scale="1.7" class="text-black" />
                </div>
                <div>
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">Exclusive Offers</h3>
                  <p class="font-srProDisplay text-[#666666] text-sm mb-1">Get access to member-only deals</p>
                  <p class="font-srProDisplay text-[#666666] text-sm">Early access to sales and new products</p>
                </div>
              </div>

              <!-- Wishlist -->
              <div class="flex items-start gap-4 py-12">
                <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <v-icon name="hi-heart" scale="1.7" class="text-black" />
                </div>
                <div>
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">Save Favorites</h3>
                  <p class="font-srProDisplay text-[#666666] text-sm mb-1">Create wishlists and save items for later</p>
                  <p class="font-srProDisplay text-[#999999] text-xs">Never lose track of products you love</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panel - Registration Form -->
          <div class="animate-fadeInUp">
            <div class="bg-white border border-[#EBEBEB] rounded-lg p-6 h-full transition-all duration-300 hover:shadow-lg">
              <h2 class="font-srProDisplay text-xl font-semibold text-black mb-6">Registration Form</h2>

              <!-- Error Message -->
              <div v-if="error" class="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 animate-slideDown">
                <p class="font-srProDisplay text-sm text-red-700">{{ error }}</p>
                <button @click="clearErr" class="text-red-600 hover:underline text-sm transition-all duration-200 hover:scale-110">✕</button>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Username -->
                <div class="form-group">
                  <div class="relative">
                    <input
                      id="username"
                      v-model="form.username"
                      type="text"
                      autocomplete="username"
                      required
                      @input="clearErr"
                      class="floating-input peer w-full px-4 pt-6 pb-2 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black focus:outline-none focus:border-black transition-all duration-300 transform"
                      placeholder=" "
                    />
                    <label
                      for="username"
                      class="floating-label absolute left-4 top-4 font-srProDisplay text-[#999999] transition-all duration-300 transform origin-left pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-black"
                    >
                      Username
                    </label>
                  </div>
                </div>

                <!-- Email -->
                <div class="form-group">
                  <div class="relative">
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      autocomplete="email"
                      required
                      @input="clearErr"
                      class="floating-input peer w-full px-4 pt-6 pb-2 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black focus:outline-none focus:border-black transition-all duration-300 transform"
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

                <!-- Role -->
                <div class="form-group">
                  <div class="relative">
                    <select
                      id="role"
                      v-model="form.role"
                      class="floating-select peer w-full px-4 pt-6 pb-2 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black focus:outline-none focus:border-black transition-all duration-300 transform appearance-none"
                    >
                      <option v-for="r in roles" :key="r.value" :value="r.value">{{ r.label }}</option>
                    </select>
                    <label
                      for="role"
                      class="floating-label absolute left-4 top-2 text-xs font-srProDisplay text-black transition-all duration-300 transform origin-left pointer-events-none"
                    >
                      Account Type
                    </label>
                    <!-- Custom dropdown arrow -->
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg class="w-5 h-5 text-[#999999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Password -->
                <div class="form-group">
                  <div class="relative">
                    <input
                      id="password"
                      v-model="form.password"
                      :type="showPwd ? 'text' : 'password'"
                      autocomplete="new-password"
                      required
                      @input="clearErr"
                      class="floating-input peer w-full px-4 pt-6 pb-2 pr-12 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black focus:outline-none focus:border-black transition-all duration-300 transform"
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
                      @click="togglePwd"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-[#999999] hover:text-black transition-all duration-200 transform hover:scale-110"
                      :aria-label="showPwd ? 'Hide password' : 'Show password'"
                    >
                      <v-icon :name="showPwd ? 'hi-eye-off' : 'hi-eye'" scale="1.4" />
                    </button>
                  </div>
                </div>

                <!-- Confirm Password -->
                <div class="form-group">
                  <div class="relative">
                    <input
                      id="confirm"
                      v-model="form.confirmPassword"
                      type="password"
                      autocomplete="new-password"
                      required
                      @input="clearErr"
                      class="floating-input peer w-full px-4 pt-6 pb-2 pr-12 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black focus:outline-none focus:border-black transition-all duration-300 transform"
                      placeholder=" "
                    />
                    <label
                      for="confirm"
                      class="floating-label absolute left-4 top-4 font-srProDisplay text-[#999999] transition-all duration-300 transform origin-left pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-black"
                    >
                      Confirm Password
                    </label>
                  </div>
                </div>

                <!-- Divider -->
                <div class="border-t border-[#EBEBEB] pt-4">
                  <!-- Terms Agreement -->
                  <div class="mb-4">
                    <label class="flex items-start">
                      <input type="checkbox" required class="mr-3 mt-1 text-black" />
                      <span class="font-srProDisplay text-sm text-[#666666]">
                        I agree to the <a href="#" class="text-black hover:underline">Terms of Service</a> and
                        <a href="#" class="text-black hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-black text-white font-srProDisplay font-medium py-4 rounded-md hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
                >
                  <span v-if="loading" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                  <span v-else>Create Account</span>
                </button>
              </form>

              <!-- Sign In Link -->
              <div class="mt-6 pt-4 border-t border-[#EBEBEB]">
                <p class="text-center font-srProDisplay text-sm text-[#666666]">
                  Already have an account?
                  <RouterLink to="/login" class="font-medium text-black hover:underline ml-1">Sign in</RouterLink>
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
  animation: fadeInUp 0.6s ease-out;
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

.floating-select + .floating-label {
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
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
}

/* Smooth label transitions */
.floating-label {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Staggered entry animation for form fields */
.form-group:nth-child(1) {
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.form-group:nth-child(2) {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.form-group:nth-child(3) {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.form-group:nth-child(4) {
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.form-group:nth-child(5) {
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

/* Submit button animation */
button[type="submit"] {
  animation: fadeInUp 0.6s ease-out 0.6s both;
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

/* Custom select styling */
.floating-select {
  background-image: none;
}

/* Form container hover effect */
.form-container:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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
