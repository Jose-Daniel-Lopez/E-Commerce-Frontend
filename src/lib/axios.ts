import axios from 'axios'

/**
 * Pre-configured Axios instance for API requests
 * 
 * Features:
 * - Base URL pointing to the backend API
 * - Automatic cookie inclusion for authentication
 * - JSON content type headers
 * - Response interceptor for handling authentication errors
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  withCredentials: true, // Include cookies in all requests
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Response interceptor to handle authentication errors
 * 
 * @description Automatically redirects to login page when receiving 401 status codes
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api