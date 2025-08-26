import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

/**
 * Interface for HTTP error objects
 */
interface HttpError {
  response?: {
    status: number
    data?: {
      message?: string
    }
  }
  status?: number
  statusText?: string
  message?: string
  code?: string
}

/**
 * Interface for error handler options
 */
interface ErrorHandlerOptions {
  customMessage?: string
  skipRedirect?: boolean
  showToast?: boolean
}

/**
 * Composable for handling HTTP errors and redirecting to appropriate error pages.
 * Provides consistent error handling across the application.
 */
export function useErrorHandler() {
  const router = useRouter()
  const { error: showErrorToast, networkError: showNetworkError } = useToast()

  /**
   * Handle HTTP error responses and redirect to appropriate error pages
   * @param error - The error object or HTTP status code
   * @param customMessage - Optional custom error message
   * @param skipRedirect - If true, shows toast instead of redirecting
   */
  const handleError = (
    error: Error | HttpError | number,
    customMessage?: string,
    skipRedirect = false
  ) => {
    let errorCode: number
    let errorMessage: string = customMessage || ''

    // Extract error code from different error formats
    if (typeof error === 'number') {
      errorCode = error
    } else if ('response' in error && error.response?.status) {
      // Axios error format
      errorCode = error.response.status
      errorMessage = errorMessage || error.response.data?.message || error.message || ''
    } else if ('status' in error && error.status) {
      // Fetch error format
      errorCode = error.status
      errorMessage = errorMessage || error.statusText || error.message || ''
    } else if ('message' in error && error.message) {
      // Generic error with message
      errorCode = 500
      errorMessage = errorMessage || error.message
    } else {
      // Unknown error
      errorCode = 500
      errorMessage = errorMessage || 'An unexpected error occurred'
    }

    // Log error for debugging
    console.error(`HTTP Error ${errorCode}:`, error)

    // Handle specific error codes
    switch (errorCode) {
      case 400:
        if (skipRedirect) {
          showErrorToast(errorMessage || 'Bad request. Please check your input.')
        } else {
          router.push(`/error/${errorCode}`)
        }
        break

      case 401:
        if (skipRedirect) {
          showErrorToast(errorMessage || 'Please log in to continue.')
        } else {
          // For 401 errors, usually redirect to login instead of error page
          router.push('/login')
        }
        break

      case 403:
        if (skipRedirect) {
          showErrorToast(errorMessage || 'Access denied.')
        } else {
          router.push(`/error/${errorCode}`)
        }
        break

      case 404:
        if (skipRedirect) {
          showErrorToast(errorMessage || 'Resource not found.')
        } else {
          router.push(`/error/${errorCode}`)
        }
        break

      case 500:
        if (skipRedirect) {
          showErrorToast(errorMessage || 'Server error. Please try again later.')
        } else {
          router.push(`/error/${errorCode}`)
        }
        break

      case 502:
        if (skipRedirect) {
          showErrorToast(errorMessage || 'Service temporarily unavailable.')
        } else {
          router.push(`/error/${errorCode}`)
        }
        break

      default:
        // For other error codes, show a generic error
        if (skipRedirect) {
          showErrorToast(errorMessage || 'An error occurred. Please try again.')
        } else {
          router.push('/error/500')
        }
    }
  }

  /**
   * Handle network errors (no internet connection, server down, etc.)
   * @param error - The network error
   */
  const handleNetworkError = (error: HttpError | Error) => {
    console.error('Network Error:', error)

    if (!navigator.onLine) {
      showNetworkError(undefined, 'No internet connection. Please check your network and try again.')
    } else {
      showNetworkError(undefined, 'Network error. Please check your connection and try again.')
    }
  }

  /**
   * Check if an error is a network error (no response from server)
   * @param error - The error to check
   * @returns True if it's a network error
   */
  const isNetworkError = (error: HttpError | Error): boolean => {
    const httpError = error as HttpError
    return (
      !httpError.response &&
      (httpError.code === 'NETWORK_ERROR' ||
        httpError.code === 'ECONNABORTED' ||
        Boolean(error.message?.includes('Network Error')) ||
        Boolean(error.message?.includes('timeout')))
    )
  }

  /**
   * Generic error handler that determines the best way to handle an error
   * @param error - The error to handle
   * @param options - Configuration options
   */
  const handleApiError = (
    error: HttpError | Error | number,
    options: ErrorHandlerOptions = {}
  ) => {
    const { customMessage, skipRedirect = false, showToast = true } = options

    // Check if it's a network error first
    if (typeof error !== 'number' && isNetworkError(error)) {
      if (showToast) {
        handleNetworkError(error)
      }
      return
    }

    // Handle HTTP errors
    handleError(error, customMessage, skipRedirect || !showToast)
  }

  /**
   * Navigate to a specific error page programmatically
   * @param errorCode - The HTTP error code
   * @param customTitle - Optional custom title
   * @param customDescription - Optional custom description
   */
  const navigateToError = (
    errorCode: 400 | 401 | 403 | 404 | 500 | 502,
    customTitle?: string,
    customDescription?: string
  ) => {
    const query: Record<string, string> = {}
    if (customTitle) query.title = customTitle
    if (customDescription) query.description = customDescription

    router.push({
      path: `/error/${errorCode}`,
      query: Object.keys(query).length > 0 ? query : undefined
    })
  }

  return {
    handleError,
    handleNetworkError,
    handleApiError,
    isNetworkError,
    navigateToError
  }
}
