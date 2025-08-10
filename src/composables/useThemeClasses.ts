import { computed } from 'vue'

/**
 * Composable that provides consistent Tailwind CSS classes
 * for UI elements that need to support dark mode
 */
export const useThemeClasses = () => {
  // Classes for main containers (cards, sections)
  const cardClasses = computed(() =>
    'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 transition-colors duration-200'
  )

  // Classes for primary text
  const textClasses = computed(() =>
    'text-black dark:text-white'
  )

  // Classes for secondary text
  const textSecondaryClasses = computed(() =>
    'text-gray-600 dark:text-gray-200'
  )

  // Classes for tertiary/muted text
  const textMutedClasses = computed(() =>
    'text-gray-500 dark:text-gray-300'
  )

  // Classes for primary buttons
  const buttonPrimaryClasses = computed(() =>
    'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200'
  )

  // Classes for secondary buttons
  const buttonSecondaryClasses = computed(() =>
    'bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200'
  )

  // Classes for inputs
  const inputClasses = computed(() =>
    'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200'
  )

  // Classes for navigation
  const navClasses = computed(() =>
    'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 shadow-lg transition-colors duration-200'
  )

  // Classes for hover effects on items
  const hoverClasses = computed(() =>
    'hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200'
  )

  // Classes for contrast backgrounds (like debug panel)
  const contrastBgClasses = computed(() =>
    'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600/50'
  )

  // Classes for overlays/modals
  const overlayClasses = computed(() =>
    'bg-black/50 dark:bg-black/80 backdrop-blur-sm'
  )

  // Classes for outline buttons (secondary with border)
  const buttonOutlineClasses = computed(() =>
    'bg-transparent border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-400'
  )

  // Classes for button text that adapts to theme
  const buttonTextClasses = computed(() =>
    'text-gray-700 dark:text-gray-100'
  )

  // Classes for links/router-links
  const linkClasses = computed(() =>
    'text-gray-600 dark:text-gray-200 hover:text-black dark:hover:text-white'
  )

  // Classes for theme toggle buttons (inactive state)
  const themeButtonInactiveClasses = computed(() =>
    'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-400 hover:scale-105'
  )

  // Classes for theme toggle buttons (active state)
  const themeButtonActiveClasses = computed(() =>
    'bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 shadow-lg scale-110 ring-2 ring-blue-200 dark:ring-blue-800'
  )

  // Classes for theme toggle buttons (base)
  const themeButtonBaseClasses = computed(() =>
    'p-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transform'
  )

  // Classes for review cards (dark theme consistent)
  const reviewCardClasses = computed(() =>
    'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700'
  )

  // Classes for review content sections
  const reviewContentClasses = computed(() =>
    'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl'
  )

  // Classes for review header text
  const reviewHeaderClasses = computed(() =>
    'text-gray-700 dark:text-gray-200 font-medium'
  )

  // Classes for review body text
  const reviewBodyClasses = computed(() =>
    'text-gray-600 dark:text-gray-300 leading-relaxed'
  )

  // Classes for review metadata (dates, ratings)
  const reviewMetaClasses = computed(() =>
    'text-gray-500 dark:text-gray-400 text-sm'
  )

  // Classes for section containers with consistent dark theme
  const sectionContainerClasses = computed(() =>
    'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl p-6 transition-colors duration-200'
  )

  // Classes for section headers with consistent styling
  const sectionHeaderClasses = computed(() =>
    'text-base font-bold tracking-tight text-gray-700 uppercase dark:text-gray-300'
  )

  // Classes for list items with hover effects
  const listItemClasses = computed(() =>
    'flex items-center justify-between p-4 transition-all duration-200 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg hover:bg-white dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
  )

  // Classes for status badges/pills
  const statusBadgeClasses = computed(() =>
    'px-3 py-1 text-sm font-medium rounded-full'
  )

  // Classes for action buttons in list items
  const actionButtonClasses = computed(() =>
    'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 cursor-pointer text-xs font-light'
  )

  // Classes for icon containers (like in order items)
  const iconContainerClasses = computed(() =>
    'flex items-center justify-center w-10 h-10 rounded-lg bg-black dark:bg-white'
  )

  // Classes for icon colors inside containers
  const iconInContainerClasses = computed(() =>
    'text-white dark:text-black'
  )

  // Classes for empty state text
  const emptyStateTextClasses = computed(() =>
    'text-gray-500 dark:text-gray-400'
  )

  // Classes for empty state icons
  const emptyStateIconClasses = computed(() =>
    'text-gray-300 dark:text-gray-600 opacity-80'
  )

  // Classes for loading text
  const loadingTextClasses = computed(() =>
    'text-gray-600 dark:text-gray-300'
  )

  // Classes for icon colors (generic)
  const iconColorClasses = computed(() =>
    'text-gray-500 dark:text-gray-400'
  )

  // Classes for interactive icons (buttons)
  const interactiveIconClasses = computed(() =>
    'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200'
  )

  // Classes for price text
  const priceTextClasses = computed(() =>
    'text-black dark:text-white font-semibold'
  )

  // Classes for footer sections
  const footerLinkClasses = computed(() =>
  "transition-colors hover:text-orange-400 text-gray-300 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
  )

  return {
    cardClasses,
    textClasses,
    textSecondaryClasses,
    textMutedClasses,
    buttonPrimaryClasses,
    buttonSecondaryClasses,
    buttonOutlineClasses,
    buttonTextClasses,
    inputClasses,
    navClasses,
    hoverClasses,
    contrastBgClasses,
    overlayClasses,
    linkClasses,
    themeButtonInactiveClasses,
    themeButtonActiveClasses,
    themeButtonBaseClasses,
    reviewCardClasses,
    reviewContentClasses,
    reviewHeaderClasses,
    reviewBodyClasses,
    reviewMetaClasses,
    sectionContainerClasses,
    sectionHeaderClasses,
    listItemClasses,
    statusBadgeClasses,
    actionButtonClasses,
    iconContainerClasses,
    iconInContainerClasses,
    emptyStateTextClasses,
    emptyStateIconClasses,
    loadingTextClasses,
    iconColorClasses,
    interactiveIconClasses,
    priceTextClasses,
    footerLinkClasses
  }
}
