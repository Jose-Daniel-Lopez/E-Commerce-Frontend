<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full text-center">
      <!-- Error Icon with Animation -->
      <div class="mb-8 flex justify-center">
        <div class="error-icon-container" :class="iconContainerClass">
          <v-icon
            :name="errorConfig.icon"
            :scale="3.5"
            :class="iconClass"
          />
        </div>
      </div>

      <!-- Error Code and Title -->
      <div class="mb-6">
        <h1 class="text-6xl sm:text-7xl font-bold text-gray-900 mb-2 font-srProDisplay">
          {{ errorCode }}
        </h1>
        <h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 font-srProDisplay">
          {{ errorConfig.title }}
        </h2>
        <p class="text-gray-600 text-lg leading-relaxed font-srProDisplay">
          {{ errorConfig.description }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
        <!-- Primary Action Button -->
        <SharedButton
          :bg-color="errorConfig.primaryButtonColor"
          text-color="white"
          hover-bg-color="rgba(0, 0, 0, 0.8)"
          height="48px"
          width="200px"
          font-weight="600"
          @click="handlePrimaryAction"
          class="mb-3 sm:mb-0"
        >
          <v-icon :name="errorConfig.primaryIcon" class="mr-2" />
          {{ errorConfig.primaryButtonText }}
        </SharedButton>

        <!-- Secondary Action Button -->
        <SharedButton
          bg-color="white"
          text-color="#374151"
          hover-bg-color="#f9fafb"
          border-color="#d1d5db"
          border-width="1px"
          height="48px"
          width="200px"
          font-weight="600"
          @click="handleSecondaryAction"
        >
          <v-icon :name="errorConfig.secondaryIcon" class="mr-2" />
          {{ errorConfig.secondaryButtonText }}
        </SharedButton>
      </div>

      <!-- Additional Help Text -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-sm text-gray-500 font-srProDisplay">
          {{ errorConfig.helpText }}
        </p>

        <!-- Contact Support Link for Server Errors -->
        <div v-if="isServerError" class="mt-4">
          <router-link
            to="/contact"
            class="text-sm text-blue-600 hover:text-blue-800 underline font-srProDisplay transition-colors duration-200"
          >
            Contact Support
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SharedButton from '@/components/shared/Button.vue'

interface Props {
  errorCode: 400 | 401 | 403 | 404 | 500 | 502
  customTitle?: string
  customDescription?: string
  customPrimaryAction?: () => void
  customSecondaryAction?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  errorCode: 404
})

const router = useRouter()
const route = useRoute()

// Error configuration mapping
const errorConfigurations = {
  400: {
    title: 'Bad Request',
    description: 'The request could not be understood or was missing required parameters. Please check your input and try again.',
    icon: 'hi-exclamation-circle',
    primaryButtonText: 'Go Back',
    primaryButtonColor: '#ef4444', // red-500
    primaryIcon: 'hi-arrow-left',
    secondaryButtonText: 'Home',
    secondaryIcon: 'hi-home',
    helpText: 'If you believe this is an error, please contact our support team.',
    iconColor: 'text-red-500',
    containerColor: 'bg-red-100 border-red-200'
  },
  401: {
    title: 'Unauthorized',
    description: 'You need to be logged in to access this page. Please sign in to your account to continue.',
    icon: 'hi-shield-check',
    primaryButtonText: 'Sign In',
    primaryButtonColor: '#3b82f6', // blue-500
    primaryIcon: 'hi-key',
    secondaryButtonText: 'Home',
    secondaryIcon: 'hi-home',
    helpText: 'Don\'t have an account? Sign up to get started.',
    iconColor: 'text-blue-500',
    containerColor: 'bg-blue-100 border-blue-200'
  },
  403: {
    title: 'Forbidden',
    description: 'You don\'t have permission to access this resource. Contact an administrator if you believe this is an error.',
    icon: 'hi-x-circle',
    primaryButtonText: 'Go Back',
    primaryButtonColor: '#f59e0b', // amber-500
    primaryIcon: 'hi-arrow-left',
    secondaryButtonText: 'Home',
    secondaryIcon: 'hi-home',
    helpText: 'Access to this resource is restricted based on your current permissions.',
    iconColor: 'text-amber-500',
    containerColor: 'bg-amber-100 border-amber-200'
  },
  404: {
    title: 'Page Not Found',
    description: 'The page you\'re looking for doesn\'t exist. It might have been moved, deleted, or you entered the wrong URL.',
    icon: 'hi-question-mark-circle',
    primaryButtonText: 'Browse Products',
    primaryButtonColor: '#10b981', // emerald-500
    primaryIcon: 'hi-view-grid',
    secondaryButtonText: 'Home',
    secondaryIcon: 'hi-home',
    helpText: 'Try checking the URL for typos or browse our catalog to find what you\'re looking for.',
    iconColor: 'text-emerald-500',
    containerColor: 'bg-emerald-100 border-emerald-200'
  },
  500: {
    title: 'Internal Server Error',
    description: 'Something went wrong on our end. Our team has been notified and is working to fix the issue.',
    icon: 'bi-exclamation-triangle',
    primaryButtonText: 'Try Again',
    primaryButtonColor: '#dc2626', // red-600
    primaryIcon: 'hi-refresh',
    secondaryButtonText: 'Home',
    secondaryIcon: 'hi-home',
    helpText: 'This is usually temporary. Please try again in a few minutes.',
    iconColor: 'text-red-600',
    containerColor: 'bg-red-100 border-red-200'
  },
  502: {
    title: 'Bad Gateway',
    description: 'Our servers are temporarily unavailable. We\'re working to restore service as quickly as possible.',
    icon: 'hi-server',
    primaryButtonText: 'Try Again',
    primaryButtonColor: '#7c3aed', // violet-600
    primaryIcon: 'hi-refresh',
    secondaryButtonText: 'Home',
    secondaryIcon: 'hi-home',
    helpText: 'Service should be restored shortly. Thank you for your patience.',
    iconColor: 'text-violet-600',
    containerColor: 'bg-violet-100 border-violet-200'
  }
}

const errorConfig = computed(() => {
  const config = errorConfigurations[props.errorCode]

  // Use props first, then query parameters, then defaults
  const title = props.customTitle ||
                (typeof route.query.title === 'string' ? route.query.title : '') ||
                config.title

  const description = props.customDescription ||
                     (typeof route.query.description === 'string' ? route.query.description : '') ||
                     config.description

  return {
    ...config,
    title,
    description
  }
})

const iconClass = computed(() => errorConfig.value.iconColor)
const iconContainerClass = computed(() =>
  `${errorConfig.value.containerColor} border-2 rounded-full p-6 inline-flex animate-pulse`
)

const isServerError = computed(() => [500, 502].includes(props.errorCode))

const handlePrimaryAction = () => {
  if (props.customPrimaryAction) {
    props.customPrimaryAction()
    return
  }

  switch (props.errorCode) {
    case 400:
    case 403:
      router.back()
      break
    case 401:
      router.push('/login')
      break
    case 404:
      router.push('/catalog')
      break
    case 500:
    case 502:
      window.location.reload()
      break
    default:
      router.push('/')
  }
}

const handleSecondaryAction = () => {
  if (props.customSecondaryAction) {
    props.customSecondaryAction()
    return
  }

  router.push('/')
}

// Analytics tracking for error pages
onMounted(() => {
  // Track error page views for analytics
  console.info(`Error page viewed: ${props.errorCode} - ${errorConfig.value.title}`)

  // Set page title
  document.title = `${props.errorCode} - ${errorConfig.value.title} | E-Commerce`
})
</script>

<style scoped>
.error-icon-container {
  animation: gentle-bounce 2s ease-in-out infinite;
}

@keyframes gentle-bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

/* Responsive text scaling */
@media (max-width: 640px) {
  .error-icon-container {
    transform: scale(0.8);
  }
}
</style>
