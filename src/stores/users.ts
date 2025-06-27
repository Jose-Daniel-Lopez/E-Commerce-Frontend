import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

interface Authority {
  authority: string
}

interface User {
  id: number
  username: string
  email: string
  password: string
  avatar: string
  role: string
  enabled: boolean
  displayName: string
  accountNonExpired: boolean
  accountNonLocked: boolean
  admin: boolean
  authorities: Authority[]
  credentialsNonExpired: boolean
  _links?: {
    self?: {
      href: string
    }
    user?: {
      href: string
    }
    addresses?: {
      href: string
    }
    orders?: {
      href: string
    }
    cart?: {
      href: string
    }
    productReviews?: {
      href: string
    }
  }
}

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref('')

  // Getters
  const userCount = computed(() => users.value.length)
  const hasUsers = computed(() => users.value.length > 0)

  const adminUsers = computed(() => users.value.filter(user => user.admin))
  const enabledUsers = computed(() => users.value.filter(user => user.enabled))
  const disabledUsers = computed(() => users.value.filter(user => !user.enabled))
  const lockedAccounts = computed(() => users.value.filter(user => !user.accountNonLocked))
  const expiredAccounts = computed(() => users.value.filter(user => !user.accountNonExpired))

  const usersByRole = computed(() => {
    const grouped: Record<string, User[]> = {}
    users.value.forEach(user => {
      if (!grouped[user.role]) {
        grouped[user.role] = []
      }
      grouped[user.role].push(user)
    })
    return grouped
  })

  // Actions
  const fetchUsers = async () => {
    loading.value = true
    error.value = ''

    try {
      // Cambiar de 'http://localhost:8080/api/users' a solo '/users'
      const response = await api.get('/users')
      // Si usas Spring Data REST, los usuarios están en response.data._embedded.users
      users.value = response.data._embedded ? response.data._embedded.users : response.data
    } catch (err) {
      console.error('Error fetching users:', err)
      error.value = 'Error al cargar los usuarios'
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

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'USER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'MODERATOR':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const getStatusColor = (user: User) => {
    if (!user.enabled) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    if (!user.accountNonLocked) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    if (!user.accountNonExpired) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  }

  const getStatusText = (user: User) => {
    if (!user.enabled) return 'Disabled'
    if (!user.accountNonLocked) return 'Locked'
    if (!user.accountNonExpired) return 'Expired'
    return 'Active'
  }

  const getInitials = (displayName: string) => {
    return displayName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return {
    // State
    users,
    loading,
    error,
    // Getters
    userCount,
    hasUsers,
    adminUsers,
    enabledUsers,
    disabledUsers,
    lockedAccounts,
    expiredAccounts,
    usersByRole,
    // Actions
    fetchUsers,
    addUser,
    removeUser,
    getUserById,
    clearUsers,
    // Utility functions
    getRoleColor,
    getStatusColor,
    getStatusText,
    getInitials,
  }
})
