import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Toast types for different message categories
export type ToastType = 'success' | 'error' | 'warning' | 'info'

// Toast position options
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

// Toast interface defining the structure of a toast notification
export interface Toast {
  id: string
  title?: string
  message: string
  type: ToastType
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    handler: () => void
  }
  icon?: string
  createdAt: number
}

// Toast options for creating new toasts
export interface ToastOptions {
  title?: string
  message: string
  type?: ToastType
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    handler: () => void
  }
  icon?: string
}

// Store configuration interface
export interface ToastConfig {
  position: ToastPosition
  defaultDuration: number
  maxToasts: number
  pauseOnHover: boolean
  showProgressBar: boolean
}

/**
 * Toast Store for managing global toast notifications
 *
 * Features:
 * - Multiple toast types (success, error, warning, info)
 * - Configurable duration and positioning
 * - Action buttons with custom handlers
 * - Auto-dismissal with progress indicators
 * - Persistent toasts that don't auto-dismiss
 * - Hover to pause functionality
 * - Maximum toast limit with auto-cleanup
 * - TypeScript support with full type safety
 */
export const useToastStore = defineStore('toast', () => {
  // --- State ---
  const toasts = ref<Toast[]>([])
  const config = ref<ToastConfig>({
    position: 'top-right',
    defaultDuration: 5000,
    maxToasts: 5,
    pauseOnHover: true,
    showProgressBar: true,
  })

  // --- Getters ---
  const activeToasts = computed(() => toasts.value)
  const toastCount = computed(() => toasts.value.length)

  // --- Internal Helper Functions ---

  /**
   * Generates a unique ID for each toast
   */
  const generateId = (): string => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Default icons for each toast type
   */
  const getDefaultIcon = (type: ToastType): string => {
    const iconMap: Record<ToastType, string> = {
      success: 'hi-check-circle',
      error: 'hi-x-circle',
      warning: 'hi-exclamation-triangle',
      info: 'hi-information-circle',
    }
    return iconMap[type]
  }

  /**
   * Enforces maximum toast limit by removing oldest toasts
   */
  const enforceMaxToasts = (): void => {
    if (toasts.value.length > config.value.maxToasts) {
      const excess = toasts.value.length - config.value.maxToasts
      toasts.value.splice(0, excess)
    }
  }

  // --- Public Actions ---

  /**
   * Adds a new toast notification
   */
  const addToast = (options: ToastOptions): string => {
    const toast: Toast = {
      id: generateId(),
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration ?? config.value.defaultDuration,
      persistent: options.persistent || false,
      action: options.action,
      icon: options.icon || getDefaultIcon(options.type || 'info'),
      createdAt: Date.now(),
    }

    toasts.value.push(toast)
    enforceMaxToasts()

    // Auto-dismiss non-persistent toasts
    if (!toast.persistent && toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)
    }

    return toast.id
  }

  /**
   * Removes a toast by ID
   */
  const removeToast = (id: string): void => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  /**
   * Clears all toasts
   */
  const clearAllToasts = (): void => {
    toasts.value = []
  }

  /**
   * Updates store configuration
   */
  const updateConfig = (newConfig: Partial<ToastConfig>): void => {
    config.value = { ...config.value, ...newConfig }
  }

  // --- Convenience Methods for Different Toast Types ---

  /**
   * Shows a success toast
   */
  const success = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
    return addToast({
      ...options,
      message,
      type: 'success',
    })
  }

  /**
   * Shows an error toast
   */
  const error = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
    return addToast({
      ...options,
      message,
      type: 'error',
      duration: options?.duration ?? 7000, // Longer duration for errors
    })
  }

  /**
   * Shows a warning toast
   */
  const warning = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
    return addToast({
      ...options,
      message,
      type: 'warning',
      duration: options?.duration ?? 6000, // Slightly longer for warnings
    })
  }

  /**
   * Shows an info toast
   */
  const info = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
    return addToast({
      ...options,
      message,
      type: 'info',
    })
  }

  // --- Return Public Interface ---
  return {
    // State
    toasts: activeToasts,
    config: computed(() => config.value),

    // Getters
    toastCount,

    // Actions
    addToast,
    removeToast,
    clearAllToasts,
    updateConfig,

    // Convenience methods
    success,
    error,
    warning,
    info,
  }
})
