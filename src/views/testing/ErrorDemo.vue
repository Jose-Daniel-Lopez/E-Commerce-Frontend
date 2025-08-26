<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4 font-srProDisplay">
          Error Pages Demo
        </h1>
        <p class="text-lg text-gray-600 font-srProDisplay">
          Test all the different error page scenarios and error handling functionality.
        </p>
      </div>

      <!-- Error Pages Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div
          v-for="errorConfig in errorConfigs"
          :key="errorConfig.code"
          class="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div class="flex items-center mb-4">
            <div :class="`${errorConfig.iconBg} p-3 rounded-full mr-4`">
              <v-icon
                :name="errorConfig.icon"
                :class="errorConfig.iconColor"
                scale="1.5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 font-srProDisplay">
                {{ errorConfig.code }}
              </h3>
              <p class="text-sm text-gray-600 font-srProDisplay">
                {{ errorConfig.title }}
              </p>
            </div>
          </div>

          <p class="text-gray-700 text-sm mb-4 font-srProDisplay">
            {{ errorConfig.description }}
          </p>

          <div class="space-y-2">
            <!-- Navigate to Error Page -->
            <SharedButton
              :bg-color="errorConfig.buttonColor"
              text-color="white"
              hover-bg-color="rgba(0, 0, 0, 0.8)"
              height="40px"
              width="100%"
              font-weight="500"
              @click="navigateToError(errorConfig.code)"
            >
              View {{ errorConfig.code }} Page
            </SharedButton>

            <!-- Show Toast -->
            <SharedButton
              bg-color="white"
              text-color="#374151"
              hover-bg-color="#f9fafb"
              border-color="#d1d5db"
              border-width="1px"
              height="36px"
              width="100%"
              font-weight="500"
              @click="showErrorToast(errorConfig.code)"
            >
              Show Toast
            </SharedButton>
          </div>
        </div>
      </div>

      <!-- Error Handler Testing -->
      <div class="bg-gray-50 rounded-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 font-srProDisplay">
          Error Handler Testing
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- API Error Simulation -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800 font-srProDisplay">
              Simulate API Errors
            </h3>

            <div class="space-y-2">
              <SharedButton
                bg-color="#ef4444"
                text-color="white"
                hover-bg-color="#dc2626"
                height="40px"
                width="100%"
                font-weight="500"
                @click="simulateApiError(400)"
              >
                Simulate 400 Bad Request
              </SharedButton>

              <SharedButton
                bg-color="#f59e0b"
                text-color="white"
                hover-bg-color="#d97706"
                height="40px"
                width="100%"
                font-weight="500"
                @click="simulateApiError(401)"
              >
                Simulate 401 Unauthorized
              </SharedButton>

              <SharedButton
                bg-color="#8b5cf6"
                text-color="white"
                hover-bg-color="#7c3aed"
                height="40px"
                width="100%"
                font-weight="500"
                @click="simulateApiError(500)"
              >
                Simulate 500 Server Error
              </SharedButton>
            </div>
          </div>

          <!-- Network Error Simulation -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800 font-srProDisplay">
              Network Error Testing
            </h3>

            <div class="space-y-2">
              <SharedButton
                bg-color="#6b7280"
                text-color="white"
                hover-bg-color="#4b5563"
                height="40px"
                width="100%"
                font-weight="500"
                @click="simulateNetworkError"
              >
                Simulate Network Error
              </SharedButton>

              <SharedButton
                bg-color="#059669"
                text-color="white"
                hover-bg-color="#047857"
                height="40px"
                width="100%"
                font-weight="500"
                @click="simulateTimeoutError"
              >
                Simulate Timeout Error
              </SharedButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Error Testing -->
      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 font-srProDisplay">
          Custom Error Page Testing
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 font-srProDisplay">
              Error Code
            </label>
            <select
              v-model="customErrorCode"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-srProDisplay"
            >
              <option value="400">400 - Bad Request</option>
              <option value="401">401 - Unauthorized</option>
              <option value="403">403 - Forbidden</option>
              <option value="404">404 - Not Found</option>
              <option value="500">500 - Internal Server Error</option>
              <option value="502">502 - Bad Gateway</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 font-srProDisplay">
              Custom Title (Optional)
            </label>
            <input
              v-model="customTitle"
              type="text"
              placeholder="Enter custom error title..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-srProDisplay"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 font-srProDisplay">
              Custom Description (Optional)
            </label>
            <textarea
              v-model="customDescription"
              rows="3"
              placeholder="Enter custom error description..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-srProDisplay"
            ></textarea>
          </div>

          <SharedButton
            bg-color="#3b82f6"
            text-color="white"
            hover-bg-color="#2563eb"
            height="44px"
            width="200px"
            font-weight="600"
            @click="navigateToCustomError"
          >
            Test Custom Error
          </SharedButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SharedButton from '@/components/shared/Button.vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { handleApiError, navigateToError: navigateToErrorPage } = useErrorHandler()
const { error: showToastError, networkError } = useToast()

// Custom error form
const customErrorCode = ref<400 | 401 | 403 | 404 | 500 | 502>(404)
const customTitle = ref('')
const customDescription = ref('')

// Error configurations for the grid
const errorConfigs = [
  {
    code: 400,
    title: 'Bad Request',
    description: 'Invalid request parameters or malformed data.',
    icon: 'hi-exclamation-circle',
    iconColor: 'text-red-500',
    iconBg: 'bg-red-100',
    buttonColor: '#ef4444'
  },
  {
    code: 401,
    title: 'Unauthorized',
    description: 'Authentication required to access this resource.',
    icon: 'hi-shield-check',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100',
    buttonColor: '#3b82f6'
  },
  {
    code: 403,
    title: 'Forbidden',
    description: 'Access denied due to insufficient permissions.',
    icon: 'hi-x-circle',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-100',
    buttonColor: '#f59e0b'
  },
  {
    code: 404,
    title: 'Not Found',
    description: 'The requested resource could not be found.',
    icon: 'hi-question-mark-circle',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-100',
    buttonColor: '#10b981'
  },
  {
    code: 500,
    title: 'Server Error',
    description: 'An internal server error has occurred.',
    icon: 'bi-exclamation-triangle',
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    buttonColor: '#dc2626'
  },
  {
    code: 502,
    title: 'Bad Gateway',
    description: 'The server received an invalid response.',
    icon: 'hi-server',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-100',
    buttonColor: '#7c3aed'
  }
] as const

// Navigate to error page
const navigateToError = (errorCode: 400 | 401 | 403 | 404 | 500 | 502) => {
  router.push(`/error/${errorCode}`)
}

// Show error toast
const showErrorToast = (errorCode: number) => {
  const config = errorConfigs.find(c => c.code === errorCode)
  if (config) {
    showToastError(`${config.title}: ${config.description}`, {
      title: `Error ${errorCode}`,
      duration: 5000
    })
  }
}

// Simulate API error
const simulateApiError = (errorCode: number) => {
  const mockError = {
    response: {
      status: errorCode,
      data: {
        message: `This is a simulated ${errorCode} error for testing purposes.`
      }
    },
    message: `HTTP ${errorCode} Error`
  }

  handleApiError(mockError, {
    showToast: true,
    skipRedirect: false
  })
}

// Simulate network error
const simulateNetworkError = () => {
  networkError(
    () => {
      showToastError('Retry functionality would go here.')
    },
    'This is a simulated network error for testing purposes.'
  )
}

// Simulate timeout error
const simulateTimeoutError = () => {
  const mockTimeoutError = {
    code: 'ECONNABORTED',
    message: 'timeout of 5000ms exceeded'
  }

  handleApiError(mockTimeoutError, {
    showToast: true,
    skipRedirect: true
  })
}

// Navigate to custom error
const navigateToCustomError = () => {
  navigateToErrorPage(
    customErrorCode.value,
    customTitle.value || undefined,
    customDescription.value || undefined
  )
}
</script>
