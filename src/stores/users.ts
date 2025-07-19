import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

interface Address {
  id: number
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault?: boolean
}



interface User {
  id: number
  username: string
  email: string
  avatar: string
  role: string
  verified: boolean
  _links?: {
    self?: { href: string }
    user?: { href: string }
    addresses?: { href: string }
    cart?: { href: string }
    wishlists?: { href: string }
    orders?: { href: string }
    productReviews?: { href: string }
  }
}

export type { User }

interface PaginationInfo {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  numberOfElements: number
}

interface UserStats {
  totalUsers: number
  adminUsers: number
  enabledUsers: number
  disabledUsers: number
}

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([])
  const selectedUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref('')
  const stats = ref<UserStats>({
    totalUsers: 0,
    adminUsers: 0,
    enabledUsers: 0,
    disabledUsers: 0,
  })
  const pagination = ref<PaginationInfo>({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    numberOfElements: 0,
  })

  // Addresses state for selected user
  const userAddresses = ref<Address[]>([])
  const addressesLoading = ref(false)
  const addressesError = ref('')
  // Fetch addresses for a user using HATEOAS link
  const fetchUserAddresses = async (user: User) => {
    addressesLoading.value = true
    addressesError.value = ''
    userAddresses.value = []
    try {
      const url = user._links?.addresses?.href
      if (!url) throw new Error('No address link found')
      const response = await api.get(url)
      // Ajusta según tu backend: puede ser response.data._embedded.addresses o response.data.content
      userAddresses.value = response.data._embedded
        ? response.data._embedded.addresses
        : response.data.content || []
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching addresses'
      addressesError.value = errorMessage
    } finally {
      addressesLoading.value = false
    }
  }

  // Getters
  const userCount = computed(() => users.value.length)
  const hasUsers = computed(() => users.value.length > 0)

  // Nuevo getter: usuarios por rol
  const adminUsers = computed(() => users.value.filter(user => user.role === 'ADMIN'))
  const customerUsers = computed(() => users.value.filter(user => user.role === 'CUSTOMER'))
  const verifiedUsers = computed(() => users.value.filter(user => user.verified))
  const unverifiedUsers = computed(() => users.value.filter(user => !user.verified))

  const usersByRole = computed(() => {
    const grouped: Record<string, User[]> = {}
    users.value.forEach((user) => {
      if (!grouped[user.role]) {
        grouped[user.role] = []
      }
      grouped[user.role].push(user)
    })
    return grouped
  })

  // Actions
  const fetchUsers = async (page = 0, size = 20) => {
    loading.value = true
    error.value = ''

    try {
      const response = await api.get('/users', {
        params: {
          page,
          size,
        },
      })

      // Si usas Spring Data REST, los usuarios están en response.data._embedded.users
      const data = response.data
      users.value = data._embedded ? data._embedded.users : data.content

      // Actualizar información de paginación
      pagination.value = {
        page: data.page?.number || data.number || page,
        size: data.page?.size || data.size || size,
        totalElements: data.page?.totalElements || data.totalElements || 0,
        totalPages: data.page?.totalPages || data.totalPages || 0,
        first: data.page?.first || data.first || true,
        last: data.page?.last || data.last || true,
        numberOfElements: data.page?.numberOfElements || data.numberOfElements || 0,
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      error.value = 'Error al cargar los usuarios'
    } finally {
      loading.value = false
    }
  }

  const fetchUserById = async (userId: string | number) => {
    loading.value = true
    error.value = ''
    try {
      const response = await api.get(`/users/${userId}`)
      selectedUser.value = response.data
    } catch (err) {
      console.error(`Error fetching user ${userId}:`, err)
      error.value = `Failed to fetch user ${userId}`
    } finally {
      loading.value = false
    }
  }

  const addUser = (user: User) => {
    users.value.push(user)
  }

  const removeUser = (userId: number) => {
    const index = users.value.findIndex((user) => user.id === userId)
    if (index > -1) {
      users.value.splice(index, 1)
    }
  }

  const getUserById = (userId: number) => {
    return users.value.find((user) => user.id === userId)
  }

  const clearUsers = () => {
    users.value = []
    error.value = ''
  }

  const clearSelectedUser = () => {
    selectedUser.value = null
  }

  // Pagination methods
  const goToPage = async (page: number) => {
    if (page >= 0 && page < pagination.value.totalPages) {
      await fetchUsers(page, pagination.value.size)
    }
  }

  const goToNextPage = async () => {
    if (!pagination.value.last) {
      await fetchUsers(pagination.value.page + 1, pagination.value.size)
    }
  }

  const goToPreviousPage = async () => {
    if (!pagination.value.first) {
      await fetchUsers(pagination.value.page - 1, pagination.value.size)
    }
  }

  const goToFirstPage = async () => {
    if (!pagination.value.first) {
      await fetchUsers(0, pagination.value.size)
    }
  }

  const goToLastPage = async () => {
    if (!pagination.value.last) {
      await fetchUsers(pagination.value.totalPages - 1, pagination.value.size)
    }
  }

  const changePageSize = async (newSize: number) => {
    await fetchUsers(0, newSize)
  }

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/users/stats')
      stats.value = response.data
    } catch (err) {
      console.error('Error fetching user stats:', err)
      // Fallback a estadísticas basadas en la información actual de paginación
      stats.value = {
        totalUsers: pagination.value.totalElements,
        adminUsers: 0,
        enabledUsers: 0,
        disabledUsers: 0,
      }
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'CUSTOMER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'MODERATOR':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const getStatusColor = (user: User) => {
    return user.verified
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }

  const getStatusText = (user: User) => {
    return user.verified ? 'Verified' : 'Unverified'
  }

  const getInitials = (displayName: string) => {
    return displayName
      .split(' ')
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return {
    // State
    users,
    selectedUser,
    loading,
    error,
    pagination,
    stats,
    userAddresses,
    addressesLoading,
    addressesError,
    // Getters
    userCount,
    hasUsers,
    adminUsers,
    customerUsers,
    verifiedUsers,
    unverifiedUsers,
    usersByRole,
    // Actions
    fetchUsers,
    fetchUserById,
    fetchUserStats,
    addUser,
    removeUser,
    getUserById,
    clearUsers,
    clearSelectedUser,
    fetchUserAddresses,
    // Pagination actions
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    changePageSize,
    // Utility functions
    getRoleColor,
    getStatusColor,
    getStatusText,
    getInitials,
  }
})
