<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Toast Notification System Demo
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Test all the different types of toast notifications and see how they work in your application.
          This demo shows the complete functionality of the toast system.
        </p>
      </div>

      <!-- Configuration Panel -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Configuration
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Position -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <select
              v-model="selectedPosition"
              @change="updatePosition"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-center">Top Center</option>
              <option value="bottom-center">Bottom Center</option>
            </select>
          </div>

          <!-- Default Duration -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Default Duration (ms)
            </label>
            <input
              v-model.number="defaultDuration"
              @change="updateDuration"
              type="number"
              min="1000"
              max="10000"
              step="500"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Max Toasts -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Max Toasts
            </label>
            <input
              v-model.number="maxToasts"
              @change="updateMaxToasts"
              type="number"
              min="1"
              max="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Options -->
        <div class="flex gap-6 mt-4">
          <label class="flex items-center">
            <input
              v-model="pauseOnHover"
              @change="updatePauseOnHover"
              type="checkbox"
              class="mr-2"
            />
            <span class="text-sm text-gray-700">Pause on Hover</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="showProgressBar"
              @change="updateProgressBar"
              type="checkbox"
              class="mr-2"
            />
            <span class="text-sm text-gray-700">Show Progress Bar</span>
          </label>
        </div>
      </div>

      <!-- Basic Toast Types -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Basic Toast Types
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            @click="showSuccess"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Success Toast
          </button>
          <button
            @click="showError"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Error Toast
          </button>
          <button
            @click="showWarning"
            class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Warning Toast
          </button>
          <button
            @click="showInfo"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Info Toast
          </button>
        </div>
      </div>

      <!-- Advanced Features -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Advanced Features
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            @click="showWithTitle"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Toast with Title
          </button>
          <button
            @click="showWithAction"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Toast with Action
          </button>
          <button
            @click="showPersistent"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Persistent Toast
          </button>
          <button
            @click="showLoading"
            class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Loading Toast
          </button>
          <button
            @click="showNetworkError"
            class="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Network Error
          </button>
          <button
            @click="showValidationError"
            class="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            Validation Error
          </button>
        </div>
      </div>

      <!-- E-commerce Examples -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          E-commerce Examples
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            @click="addToCart"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Add to Cart
          </button>
          <button
            @click="addToWishlist"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Add to Wishlist
          </button>
          <button
            @click="simulateCheckout"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Simulate Checkout
          </button>
          <button
            @click="simulateLogin"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Simulate Login
          </button>
          <button
            @click="simulateOrderUpdate"
            class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Order Update
          </button>
          <button
            @click="simulatePromoCode"
            class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Promo Code
          </button>
        </div>
      </div>

      <!-- Management Actions -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Management Actions
        </h2>
        <div class="flex gap-4">
          <button
            @click="clearAll"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear All Toasts
          </button>
          <button
            @click="showMultiple"
            class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Show Multiple
          </button>
          <div class="flex items-center ml-auto">
            <span class="text-sm text-gray-600 mr-2">Active Toasts:</span>
            <span class="px-2 py-1 bg-gray-100 rounded text-sm font-medium">
              {{ toastCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import type { ToastPosition } from '@/stores/toast'

const toast = useToast()

// Configuration state
const selectedPosition = ref<ToastPosition>('top-right')
const defaultDuration = ref(5000)
const maxToasts = ref(5)
const pauseOnHover = ref(true)
const showProgressBar = ref(true)

// Computed for toast count
const toastCount = toast.store.toastCount

// Configuration methods
const updatePosition = () => {
  toast.store.updateConfig({ position: selectedPosition.value })
}

const updateDuration = () => {
  toast.store.updateConfig({ defaultDuration: defaultDuration.value })
}

const updateMaxToasts = () => {
  toast.store.updateConfig({ maxToasts: maxToasts.value })
}

const updatePauseOnHover = () => {
  toast.store.updateConfig({ pauseOnHover: pauseOnHover.value })
}

const updateProgressBar = () => {
  toast.store.updateConfig({ showProgressBar: showProgressBar.value })
}

// Basic toast methods
const showSuccess = () => {
  toast.success('Operation completed successfully!')
}

const showError = () => {
  toast.error('Something went wrong. Please try again.')
}

const showWarning = () => {
  toast.warning('Please review your input before proceeding.')
}

const showInfo = () => {
  toast.info('Here is some helpful information for you.')
}

// Advanced features
const showWithTitle = () => {
  toast.success('Your changes have been saved successfully!', {
    title: 'Success!',
    duration: 6000,
  })
}

const showWithAction = () => {
  toast.warning('You have unsaved changes. Do you want to save them?', {
    title: 'Unsaved Changes',
    persistent: true,
    action: {
      label: 'Save Changes',
      handler: () => {
        toast.success('Changes saved successfully!')
      },
    },
  })
}

const showPersistent = () => {
  toast.persistent('This notification will stay until you close it manually.', 'info', {
    title: 'Persistent Notification',
  })
}

const showLoading = () => {
  const loader = toast.loading('Processing your request...')

  setTimeout(() => {
    if (Math.random() > 0.5) {
      loader.success('Request processed successfully!')
    } else {
      loader.error('Request failed. Please try again.')
    }
  }, 3000)
}

const showNetworkError = () => {
  toast.networkError(() => {
    toast.info('Retrying request...')
  })
}

const showValidationError = () => {
  const errors = [
    'Email is required',
    'Password must be at least 8 characters',
    'Please accept the terms and conditions'
  ]
  toast.validationError(errors)
}

// E-commerce examples
const addToCart = () => {
  toast.success('Product added to cart!', {
    title: 'Cart Updated',
    action: {
      label: 'View Cart',
      handler: () => {
        toast.info('Redirecting to cart...')
      },
    },
  })
}

const addToWishlist = () => {
  toast.info('Product added to wishlist', {
    icon: 'hi-heart',
    duration: 3000,
  })
}

const simulateCheckout = () => {
  const checkout = toast.loading('Processing payment...')

  setTimeout(() => {
    if (Math.random() > 0.3) {
      checkout.success('Payment successful! Order #12345 confirmed.', {
        title: 'Order Confirmed',
      })
    } else {
      checkout.error('Payment failed. Please check your payment method.', {
        title: 'Payment Error',
      })
    }
  }, 4000)
}

const simulateLogin = () => {
  toast.success('Welcome back! You have been successfully logged in.', {
    title: 'Login Successful',
    duration: 4000,
  })
}

const simulateOrderUpdate = () => {
  toast.info('Your order #12345 has been shipped and is on its way!', {
    title: 'Order Update',
    icon: 'hi-truck',
    duration: 6000,
  })
}

const simulatePromoCode = () => {
  if (Math.random() > 0.5) {
    toast.success('Promo code applied! You saved $15.99', {
      title: 'Discount Applied',
      icon: 'hi-tag',
    })
  } else {
    toast.error('Invalid promo code. Please check and try again.', {
      title: 'Invalid Code',
    })
  }
}

// Management actions
const clearAll = () => {
  toast.clear()
  toast.info('All notifications cleared.')
}

const showMultiple = () => {
  toast.success('First notification')
  setTimeout(() => toast.info('Second notification'), 500)
  setTimeout(() => toast.warning('Third notification'), 1000)
  setTimeout(() => toast.error('Fourth notification'), 1500)
}
</script>
