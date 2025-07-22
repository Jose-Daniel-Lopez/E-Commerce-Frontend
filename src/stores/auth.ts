import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export interface User {
  id: number
  username: string
  email: string
  avatar: string
  role: string
  isVerified: boolean
  location?: string
}

interface Address {
  id: number
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
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

  // Addresses
  const addresses = ref<Address[]>([])
  const addressesLoading = ref(false)
  const addressesError = ref('')

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isSeller = computed(() => user.value?.role === 'SELLER')
  const isCustomer = computed(() => user.value?.role === 'CUSTOMER')

  // Actions
  const initializeAuth = () => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('user')

    console.log('Initializing auth...')
    console.log('Saved token exists:', !!savedToken)
    console.log('Saved user data:', savedUser)

    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        const parsedUser = JSON.parse(savedUser)
        user.value = parsedUser
        console.log('Auth initialized with user:', parsedUser)
      } catch (e) {
        console.error('Error parsing saved user data:', e)
        clearAuth()
      }
    } else {
      console.log('No saved auth data found')
    }
  }

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = ''

    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials)

      if (response.data.token && response.data.user) {
        token.value = response.data.token

        // First, set basic user data from login response
        user.value = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
          avatar: '', // Will be fetched below
          isVerified: true, // If user can login, they're verified
        }

        // Save token immediately
        localStorage.setItem('authToken', response.data.token)

        // Now fetch complete user data including avatar
        try {
          const userDataResponse = await api.get<User>('/users/me')
          user.value = userDataResponse.data
          console.log('Complete user data fetched after login:', userDataResponse.data)
        } catch (fetchError) {
          console.warn('Could not fetch complete user data after login:', fetchError)
          // Continue with basic user data if fetch fails
        }

        // Save complete user data to localStorage
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

  // Clear addresses when clearing auth
  const clearAuth = () => {
    user.value = null
    token.value = null
    error.value = ''

    // Clear addresses state
    addresses.value = []
    addressesError.value = ''

    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return

    loading.value = true
    try {
      console.log('Fetching current user from server...')
      const response = await api.get<User>('/users/me')
      console.log('Fetched user data from server:', response.data)

      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))

      console.log('User data saved to localStorage:', response.data)
      return { success: true }
    } catch (err: unknown) {
      console.error('Error fetching current user:', err)

      // Handle authentication errors
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number } }
        if (axiosError.response?.status === 401) {
          clearAuth()
          return { success: false, error: 'Session expired. Please login again.' }
        }
      }

      return { success: false, error: 'Failed to fetch user data.' }
    } finally {
      loading.value = false
    }
  }

  // Enhanced error handling and validation
  const fetchUserAddresses = async () => {
    if (!token.value || !user.value) {
      addressesError.value = 'User not authenticated'
      return { success: false, error: 'User not authenticated' }
    }

    // Prevent multiple simultaneous requests
    if (addressesLoading.value) {
      return { success: false, error: 'Request already in progress' }
    }

    addressesLoading.value = true
    addressesError.value = ''

    try {
      const response = await api.get<{ addresses: Address[] }>(`/users/${user.value.id}`)

      if (response.data.addresses) {
        addresses.value = response.data.addresses
      } else {
        addresses.value = []
      }

      return { success: true }
    } catch (err: unknown) {
      console.error('Error fetching user addresses:', err)

      let errorMessage = 'Failed to load addresses.'

      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } }

        if (axiosError.response?.status === 401) {
          errorMessage = 'Session expired. Please login again.'
          clearAuth()
        } else if (axiosError.response?.status === 403) {
          errorMessage = 'Access denied. You do not have permission to view addresses.'
        } else if (axiosError.response?.status === 404) {
          errorMessage = 'User not found.'
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message
        }
      }

      addressesError.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      addressesLoading.value = false
    }
  }

  const updateUser = (updatedUser: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  // Better error handling and validation
  const updateUserProfile = async (updatedData: Partial<User>) => {
    if (!user.value) {
      return { success: false, error: 'User not authenticated' }
    }

    loading.value = true
    error.value = ''

    try {
      // Only allow permitted fields
      const allowedFields = {
        username: updatedData.username,
        location: updatedData.location,
        avatar: updatedData.avatar,
      }

      console.log('Updating user profile with data:', allowedFields)

      const url = `/users/${user.value.id}`
      const response = await api.patch(url, allowedFields)

      console.log('Server response:', response.data)

      // Verify that the avatar was actually updated in the response
      if (allowedFields.avatar && response.data.avatar !== allowedFields.avatar) {
        console.warn('Server response avatar does not match sent avatar')
        console.warn('Sent:', allowedFields.avatar)
        console.warn('Received:', response.data.avatar)
      }

      // Update local user data with the response from server
      user.value = { ...user.value, ...response.data }
      localStorage.setItem('user', JSON.stringify(user.value))

      console.log('Updated user data saved to localStorage:', user.value)

      return { success: true }
    } catch (err: unknown) {
      console.error('Error updating user profile:', err)

      let errorMessage = 'Failed to update profile.'

      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } }

        if (axiosError.response?.status === 401) {
          errorMessage = 'Session expired. Please login again.'
          clearAuth()
        } else if (axiosError.response?.status === 403) {
          errorMessage = 'Access denied. You do not have permission to update profile.'
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

  // Utility function to refresh addresses
  const refreshAddresses = async () => {
    return await fetchUserAddresses()
  }

  // Check if user has addresses
  const hasAddresses = computed(() => addresses.value.length > 0)

  // Initialize auth on store creation
  initializeAuth()

  return {
    // State
    user,
    token,
    loading,
    error,

    // Addresses State
    addresses,
    addressesLoading,
    addressesError,

    // Getters
    isAuthenticated,
    isAdmin,
    isSeller,
    isCustomer,
    hasAddresses,

    // Actions
    login,
    logout,
    clearAuth,
    fetchCurrentUser,
    fetchUserAddresses,
    refreshAddresses,
    updateUser,
    updateUserProfile,
    initializeAuth,
  }
})
