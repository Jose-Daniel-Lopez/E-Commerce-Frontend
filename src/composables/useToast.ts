import { useToastStore, type ToastOptions } from '@/stores/toast'

/**
 * Composable for using toast notifications throughout the application
 *
 * This composable provides a simple interface to the toast store
 * and includes additional utility functions for common use cases.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useToast } from '@/composables/useToast'
 *
 * const toast = useToast()
 *
 * const handleLogin = async () => {
 *   try {
 *     await login()
 *     toast.success('Welcome back!', { title: 'Login Successful' })
 *   } catch (error) {
 *     toast.error('Invalid credentials', { title: 'Login Failed' })
 *   }
 * }
 * </script>
 * ```
 */
export function useToast() {
  const toastStore = useToastStore()

  /**
   * Show a success toast with optional title and enhanced styling
   */
  const success = (
    message: string,
    options?: Omit<ToastOptions, 'message' | 'type'>
  ): string => {
    return toastStore.success(message, options)
  }

  /**
   * Show an error toast with optional title and longer duration
   */
  const error = (
    message: string,
    options?: Omit<ToastOptions, 'message' | 'type'>
  ): string => {
    return toastStore.error(message, options)
  }

  /**
   * Show a warning toast with optional title
   */
  const warning = (
    message: string,
    options?: Omit<ToastOptions, 'message' | 'type'>
  ): string => {
    return toastStore.warning(message, options)
  }

  /**
   * Show an info toast with optional title
   */
  const info = (
    message: string,
    options?: Omit<ToastOptions, 'message' | 'type'>
  ): string => {
    return toastStore.info(message, options)
  }

  /**
   * Show a custom toast with full control over options
   */
  const custom = (options: ToastOptions): string => {
    return toastStore.addToast(options)
  }

  /**
   * Remove a specific toast by ID
   */
  const remove = (id: string): void => {
    toastStore.removeToast(id)
  }

  /**
   * Clear all active toasts
   */
  const clear = (): void => {
    toastStore.clearAllToasts()
  }

  // --- Utility Methods for Common Use Cases ---

  /**
   * Show a loading toast that can be updated later
   * Returns an object with methods to update or complete the loading state
   */
  const loading = (message: string = 'Loading...') => {
    const toastId = info(message, {
      persistent: true,
      icon: 'hi-refresh',
    })

    return {
      id: toastId,
      /**
       * Update the loading message
       */
      update: (newMessage: string) => {
        remove(toastId)
        return info(newMessage, {
          persistent: true,
          icon: 'hi-refresh',
        })
      },
      /**
       * Complete loading with success
       */
      success: (successMessage: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
        remove(toastId)
        return success(successMessage, options)
      },
      /**
       * Complete loading with error
       */
      error: (errorMessage: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
        remove(toastId)
        return error(errorMessage, options)
      },
      /**
       * Dismiss the loading toast
       */
      dismiss: () => {
        remove(toastId)
      },
    }
  }

  /**
   * Show a confirmation toast with action buttons
   */
  const confirm = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    options?: Omit<ToastOptions, 'message' | 'type' | 'action'>
  ): string => {
    return warning(message, {
      ...options,
      persistent: true,
      action: {
        label: 'Confirm',
        handler: () => {
          onConfirm()
          if (onCancel) onCancel()
        },
      },
    })
  }

  /**
   * Show a toast for API responses with automatic type detection
   */
  const apiResponse = (
    response: { success: boolean; message: string; error?: string },
    successTitle?: string,
    errorTitle?: string
  ): string => {
    if (response.success) {
      return success(response.message, {
        title: successTitle || 'Success',
      })
    } else {
      return error(response.error || response.message || 'An error occurred', {
        title: errorTitle || 'Error',
      })
    }
  }

  /**
   * Show a toast for form validation errors
   */
  const validationError = (
    errors: string | string[],
    title: string = 'Validation Error'
  ): string => {
    const message = Array.isArray(errors) ? errors.join(', ') : errors
    return error(message, {
      title,
      duration: 6000,
    })
  }

  /**
   * Show a toast for network errors with retry action
   */
  const networkError = (
    onRetry?: () => void,
    customMessage?: string
  ): string => {
    const message = customMessage || 'Network error. Please check your connection.'

    return error(message, {
      title: 'Connection Error',
      duration: 8000,
      action: onRetry ? {
        label: 'Retry',
        handler: onRetry,
      } : undefined,
    })
  }

  /**
   * Show a persistent toast that doesn't auto-dismiss
   */
  const persistent = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    options?: Omit<ToastOptions, 'message' | 'type' | 'persistent'>
  ): string => {
    return toastStore.addToast({
      ...options,
      message,
      type,
      persistent: true,
    })
  }

  return {
    // Basic toast methods
    success,
    error,
    warning,
    info,
    custom,

    // Management methods
    remove,
    clear,

    // Utility methods
    loading,
    confirm,
    apiResponse,
    validationError,
    networkError,
    persistent,

    // Store access for advanced use cases
    store: toastStore,
  }
}
