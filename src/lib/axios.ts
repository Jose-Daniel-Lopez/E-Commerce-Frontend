import axios from 'axios'

/**
 * Pre-configured Axios instance for API requests
 *
 * Features:
 * - Base URL pointing to the backend API
 * - Automatic token inclusion for authentication
 * - JSON content type headers
 * - Response interceptor for handling authentication errors
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor to add authentication token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

/**
 * Response interceptor to handle authentication errors
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('🔴 [AXIOS] 401 Unauthorized response received:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        message: error.response?.data?.message || 'No message provided'
      })

      // Clear stored auth data and redirect to login
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')

      // Only redirect if not already on login page to avoid infinite loops
      if (window.location.pathname !== '/login' && !window.location.pathname.includes('/login')) {
        console.warn('🔴 [AXIOS] Redirecting to login due to 401 error')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
