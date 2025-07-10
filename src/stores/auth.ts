import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

interface User {
  id: number
  username: string
  email: string
  avatar: string
  role: string
  isVerified: boolean
}

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  message: string
  token: string
  user: {
    id: number
    username: string
    email: string
    role: string
  }
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref('')

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isSeller = computed(() => user.value?.role === 'SELLER')
  const isCustomer = computed(() => user.value?.role === 'CUSTOMER')

  // Actions
  const initializeAuth = () => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        console.error('Error parsing saved user data:', e)
        clearAuth()
      }
    }
  }

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = ''

    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials)

      if (response.data.token && response.data.user) {
        token.value = response.data.token
        // Map backend user response to frontend user format
        user.value = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
          avatar: '', // Backend doesn't provide avatar in login response
          isVerified: true // If user can login, they're verified
        }

        // Save to localStorage
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('user', JSON.stringify(user.value))

        return { success: true }
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err: unknown) {
      let errorMessage = 'Login failed. Please try again.'

      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } }
        if (axiosError.response?.status === 401) {
          errorMessage = 'Invalid email or password'
        } else if (axiosError.response?.status === 403) {
          errorMessage = 'Account not verified. Please check your email.'
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message
        }
      }

      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    clearAuth()
    // Redirect to login page
    window.location.href = '/login'
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    error.value = ''
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return

    loading.value = true
    try {
      const response = await api.get<User>('/api/users/me')
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (err: unknown) {
      console.error('Error fetching current user:', err)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number } }
        if (axiosError.response?.status === 401) {
          clearAuth()
        }
      }
    } finally {
      loading.value = false
    }
  }

  const updateUser = (updatedUser: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  // Initialize auth on store creation
  initializeAuth()

  return {
    // State
    user,
    token,
    loading,
    error,

    // Getters
    isAuthenticated,
    isAdmin,
    isSeller,
    isCustomer,

    // Actions
    login,
    logout,
    clearAuth,
    fetchCurrentUser,
    updateUser,
    initializeAuth
  }
})
