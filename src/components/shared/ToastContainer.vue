<template>
  <div
    :class="[
      'fixed z-50 pointer-events-none transition-all duration-300',
      positionClasses,
    ]"
  >
    <TransitionGroup
      name="toast"
      tag="div"
      class="space-y-3 pointer-events-auto"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'relative overflow-hidden rounded-xl border backdrop-blur-sm shadow-lg max-w-sm w-full transform transition-all duration-300 hover:scale-105',
          getToastClasses(toast.type),
          { 'hover:shadow-xl': toastStore.config.pauseOnHover }
        ]"
        @mouseenter="pauseTimer(toast.id)"
        @mouseleave="resumeTimer(toast.id)"
        role="alert"
        :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
      >
        <!-- Progress Bar -->
        <div
          v-if="!toast.persistent && toastStore.config.showProgressBar"
          :class="[
            'absolute top-0 left-0 h-1 transition-all duration-100 ease-linear',
            getProgressBarColor(toast.type)
          ]"
          :style="{ width: getProgressWidth(toast.id) + '%' }"
        ></div>

        <!-- Toast Content -->
        <div class="p-4">
          <div class="flex items-start space-x-3">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <v-icon
                :name="toast.icon"
                :class="[
                  'transition-all duration-200',
                  getIconClasses(toast.type)
                ]"
                scale="1.4"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <!-- Title -->
              <h4
                v-if="toast.title"
                :class="[
                  'font-srProDisplay text-sm font-semibold leading-tight mb-1',
                  getTitleClasses(toast.type)
                ]"
              >
                {{ toast.title }}
              </h4>

              <!-- Message -->
              <p
                :class="[
                  'font-srProDisplay text-sm leading-relaxed',
                  getMessageClasses(toast.type)
                ]"
              >
                {{ toast.message }}
              </p>

              <!-- Action Button -->
              <button
                v-if="toast.action"
                @click="handleAction(toast)"
                :class="[
                  'mt-3 font-srProDisplay text-xs font-medium underline transition-colors duration-200',
                  getActionClasses(toast.type)
                ]"
              >
                {{ toast.action.label }}
              </button>
            </div>

            <!-- Close Button -->
            <button
              @click="closeToast(toast.id)"
              :class="[
                'flex-shrink-0 p-1 rounded-md transition-all duration-200 hover:scale-110',
                getCloseButtonClasses(toast.type)
              ]"
              :aria-label="`Close ${toast.type} notification`"
            >
              <v-icon
                name="hi-x"
                scale="1.2"
                :class="getCloseIconClasses(toast.type)"
              />
            </button>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useToastStore, type Toast, type ToastType } from '@/stores/toast'

const toastStore = useToastStore()

// --- Local State ---
const timers = ref<Map<string, number>>(new Map())
const progressTimers = ref<Map<string, number>>(new Map())
const progressValues = ref<Map<string, number>>(new Map())

// --- Computed Properties ---

/**
 * Get reactive toast list from store
 */
const toasts = computed(() => toastStore.toasts)

/**
 * Get positioning classes based on configuration
 */
const positionClasses = computed(() => {
  const position = toastStore.config.position
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  }
  return positions[position] || positions['top-right']
})

// --- Style Classes ---

/**
 * Get toast container classes based on type
 */
const getToastClasses = (type: ToastType): string => {
  const classes = {
    success: 'bg-green-50/90 border-green-200 text-green-800',
    error: 'bg-red-50/90 border-red-200 text-red-800',
    warning: 'bg-yellow-50/90 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50/90 border-blue-200 text-blue-800',
  }
  return classes[type]
}

/**
 * Get icon classes based on type
 */
const getIconClasses = (type: ToastType): string => {
  const classes = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  }
  return classes[type]
}

/**
 * Get title classes based on type
 */
const getTitleClasses = (type: ToastType): string => {
  const classes = {
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-blue-900',
  }
  return classes[type]
}

/**
 * Get message classes based on type
 */
const getMessageClasses = (type: ToastType): string => {
  const classes = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
  }
  return classes[type]
}

/**
 * Get action button classes based on type
 */
const getActionClasses = (type: ToastType): string => {
  const classes = {
    success: 'text-green-800 hover:text-green-900',
    error: 'text-red-800 hover:text-red-900',
    warning: 'text-yellow-800 hover:text-yellow-900',
    info: 'text-blue-800 hover:text-blue-900',
  }
  return classes[type]
}

/**
 * Get close button classes based on type
 */
const getCloseButtonClasses = (type: ToastType): string => {
  const classes = {
    success: 'hover:bg-green-100',
    error: 'hover:bg-red-100',
    warning: 'hover:bg-yellow-100',
    info: 'hover:bg-blue-100',
  }
  return classes[type]
}

/**
 * Get close icon classes based on type
 */
const getCloseIconClasses = (type: ToastType): string => {
  const classes = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  }
  return classes[type]
}

/**
 * Get progress bar color based on type
 */
const getProgressBarColor = (type: ToastType): string => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }
  return classes[type]
}

// --- Methods ---

/**
 * Get progress width for a specific toast
 */
const getProgressWidth = (toastId: string): number => {
  return progressValues.value.get(toastId) || 100
}

/**
 * Handle action button click
 */
const handleAction = (toast: Toast): void => {
  if (toast.action) {
    toast.action.handler()
    closeToast(toast.id)
  }
}

/**
 * Close a specific toast
 */
const closeToast = (toastId: string): void => {
  clearTimer(toastId)
  clearProgressTimer(toastId)
  toastStore.removeToast(toastId)
}

/**
 * Pause auto-dismiss timer (for hover functionality)
 */
const pauseTimer = (toastId: string): void => {
  if (!toastStore.config.pauseOnHover) return

  const timerId = timers.value.get(toastId)
  const progressTimerId = progressTimers.value.get(toastId)

  if (timerId) {
    clearTimeout(timerId)
  }
  if (progressTimerId) {
    clearInterval(progressTimerId)
  }
}

/**
 * Resume auto-dismiss timer
 */
const resumeTimer = (toastId: string): void => {
  if (!toastStore.config.pauseOnHover) return

  const toast = toasts.value.find(t => t.id === toastId)
  if (!toast || toast.persistent) return

  const currentProgress = progressValues.value.get(toastId) || 100
  const remainingTime = toast.duration ? (toast.duration * currentProgress) / 100 : 0

  if (remainingTime > 0) {
    startTimer(toastId, remainingTime)
  }
}

/**
 * Start auto-dismiss timer for a toast
 */
const startTimer = (toastId: string, duration: number): void => {
  // Clear existing timers
  clearTimer(toastId)
  clearProgressTimer(toastId)

  // Set initial progress
  progressValues.value.set(toastId, 100)

  // Start countdown timer
  const timerId = window.setTimeout(() => {
    closeToast(toastId)
  }, duration)

  timers.value.set(toastId, timerId)

  // Start progress bar animation
  if (toastStore.config.showProgressBar) {
    const progressInterval = 50 // Update every 50ms
    const totalSteps = duration / progressInterval
    let currentStep = 0

    const progressTimerId = window.setInterval(() => {
      currentStep++
      const progress = Math.max(0, 100 - (currentStep / totalSteps) * 100)
      progressValues.value.set(toastId, progress)

      if (progress <= 0) {
        clearInterval(progressTimerId)
        progressTimers.value.delete(toastId)
      }
    }, progressInterval)

    progressTimers.value.set(toastId, progressTimerId)
  }
}

/**
 * Clear timer for a specific toast
 */
const clearTimer = (toastId: string): void => {
  const timerId = timers.value.get(toastId)
  if (timerId) {
    clearTimeout(timerId)
    timers.value.delete(toastId)
  }
}

/**
 * Clear progress timer for a specific toast
 */
const clearProgressTimer = (toastId: string): void => {
  const progressTimerId = progressTimers.value.get(toastId)
  if (progressTimerId) {
    clearInterval(progressTimerId)
    progressTimers.value.delete(toastId)
  }
  progressValues.value.delete(toastId)
}

// --- Lifecycle ---

/**
 * Set up timers for existing toasts when component mounts
 */
onMounted(() => {
  toasts.value.forEach((toast) => {
    if (!toast.persistent && toast.duration) {
      const elapsed = Date.now() - toast.createdAt
      const remaining = Math.max(0, toast.duration - elapsed)

      if (remaining > 0) {
        startTimer(toast.id, remaining)
      } else {
        closeToast(toast.id)
      }
    }
  })
})

/**
 * Clean up timers when component unmounts
 */
onUnmounted(() => {
  timers.value.forEach((timerId) => clearTimeout(timerId))
  progressTimers.value.forEach((progressTimerId) => clearInterval(progressTimerId))
  timers.value.clear()
  progressTimers.value.clear()
  progressValues.value.clear()
})
</script>

<style scoped>
/* Toast transition animations */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Enhanced glassmorphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px) saturate(180%);
}

/* Smooth hover animations */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Progress bar animations */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus styles for accessibility */
button:focus {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}

/* Custom scrollbar for toast container (if needed) */
.space-y-3::-webkit-scrollbar {
  width: 4px;
}

.space-y-3::-webkit-scrollbar-track {
  background: transparent;
}

.space-y-3::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}
</style>
