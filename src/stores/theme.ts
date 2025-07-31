import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  // User selected theme state
  const selectedTheme = ref<Theme>('system')

  // Current theme state (resolved based on system preference if 'system')
  const currentTheme = ref<'light' | 'dark'>('light')

  // Media query to detect system preference
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // Computed to get the effective theme
  const effectiveTheme = computed(() => {
    if (selectedTheme.value === 'system') {
      return mediaQuery.matches ? 'dark' : 'light'
    }
    return selectedTheme.value
  })

  // Function to apply theme to DOM
  const applyTheme = (theme: 'light' | 'dark') => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
    }

    currentTheme.value = theme
  }

  // Function to change theme
  const setTheme = (newTheme: Theme) => {
    selectedTheme.value = newTheme
    localStorage.setItem('theme', newTheme)

    // Apply effective theme immediately
    applyTheme(effectiveTheme.value)
  }

  // Function to initialize theme
  const initializeTheme = () => {
    // Load theme from localStorage or use 'system' by default
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      selectedTheme.value = savedTheme
    }

    // Apply initial theme
    applyTheme(effectiveTheme.value)

    // Listen to system preference changes
    mediaQuery.addEventListener('change', (e) => {
      if (selectedTheme.value === 'system') {
        applyTheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  // Watcher for effective theme changes
  watch(effectiveTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  // Function to get theme icon
  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case 'light':
        return 'hi-sun'
      case 'dark':
        return 'hi-moon'
      case 'system':
        return 'hi-desktop-computer'
      default:
        return 'hi-desktop-computer'
    }
  }

  // Function to get theme label
  const getThemeLabel = (theme: Theme) => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'System'
      default:
        return 'System'
    }
  }

  return {
    selectedTheme,
    currentTheme,
    effectiveTheme,
    setTheme,
    initializeTheme,
    getThemeIcon,
    getThemeLabel
  }
})
