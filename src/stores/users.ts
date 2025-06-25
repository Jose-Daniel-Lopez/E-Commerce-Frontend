import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

interface User {
  id: number
  username: string
  email: string
  role?: string
}

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref('')

  // Getters
  const userCount = computed(() => users.value.length)
  const hasUsers = computed(() => users.value.length > 0)

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

  return {
    // State
    users,
    loading,
    error,
    // Getters
    userCount,
    hasUsers,
    // Actions
    fetchUsers,
    addUser,
    removeUser,
    getUserById,
    clearUsers,
  }
})
