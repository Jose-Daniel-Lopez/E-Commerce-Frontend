import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export const useUserDropdown = () => {
  const showUserDropdown = ref(false)
  const authStore = useAuthStore()
  const router = useRouter()

  const userOptions = [
    { label: 'Profile', route: '/account', hash: '#profile' },
    { label: 'My orders', route: '/account', hash: '#orders' },
    { label: 'Refunds and drawbacks', route: '/account', hash: '#refunds' },
    { label: 'My wishlist', route: '/account', hash: '#wishlist' },
    { label: 'My addresses', route: '/account', hash: '#addresses' },
    { label: 'My reviews', route: '/account', hash: '#reviews' },
    { label: 'Settings', route: '/account', hash: '#settings' },
    { label: 'Log out', route: '/login', isLogout: true },
  ]

  const toggleUserDropdown = () => {
    showUserDropdown.value = !showUserDropdown.value
  }

  const closeUserDropdown = () => {
    showUserDropdown.value = false
  }

  const selectUserOption = async (option: {
    label: string
    route: string | null
    hash?: string
    isLogout?: boolean
  }) => {
    closeUserDropdown()

    if (option.isLogout) {
      await handleLogout()
    } else if (option.route) {
      // Navigate to the route with hash
      if (option.hash) {
        router.push({ path: option.route, hash: option.hash })
      } else {
        router.push(option.route)
      }
    }
  }

  const handleLogout = async () => {
    try {
      // Use the auth store logout method instead of direct fetch
      authStore.logout()
    } catch (error) {
      console.error('Error during logout:', error)
      // Fallback: clear auth and redirect manually
      authStore.clearAuth()
      router.push('/login')
    }
  }

  return {
    showUserDropdown,
    userOptions,
    toggleUserDropdown,
    closeUserDropdown,
    selectUserOption,
    handleLogout,
  }
}
