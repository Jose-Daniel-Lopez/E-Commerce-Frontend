import { computed } from 'vue'

/**
 * Composable that provides consistent Tailwind CSS classes
 * for UI elements that need to support dark mode.
 * Uses variable-backed utility classes added to `base.css`.
 */
export const useThemeClasses = () => {
  // Classes for main containers (cards, sections)
  const cardClasses = computed(() => 'bg-background text-foreground border border-border transition-colors duration-200')

  // Classes for primary text
  const textClasses = computed(() => 'text-foreground')

  // Classes for secondary text
  const textSecondaryClasses = computed(() => 'text-muted')

  // Classes for tertiary/muted text
  const textMutedClasses = computed(() => 'text-muted-foreground')

  // Classes for primary buttons (use semantic primary token)
  const buttonPrimaryClasses = computed(() => 'bg-primary text-primary-foreground hover:opacity-90 transition-colors duration-200')

  // Classes for secondary buttons
  const buttonSecondaryClasses = computed(() => 'bg-surface-secondary text-foreground hover:bg-surface-tertiary transition-colors duration-200')

  // Classes for inputs
  const inputClasses = computed(() => 'w-full px-4 py-3 border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200')

  // Classes for navigation
  const navClasses = computed(() => 'bg-background text-foreground transition-colors duration-200')

  // Classes for hover effects on items
  const hoverClasses = computed(() => 'hover:bg-surface-hover hover:border-border transition-all duration-200')

  // Classes for contrast backgrounds (like debug panel)
  const contrastBgClasses = computed(() => 'bg-warning text-primary-foreground')

  // Classes for overlays/modals
  const overlayClasses = computed(() => 'bg-overlay backdrop-blur-sm')

  // Classes for outline buttons (secondary with border)
  const buttonOutlineClasses = computed(() => 'bg-transparent border border-border text-foreground hover:bg-surface-hover transition-colors duration-200')

  // Classes for button text that adapts to theme
  const buttonTextClasses = computed(() => 'text-foreground')

  // Classes for links/router-links
  const linkClasses = computed(() => 'text-muted hover:text-foreground transition-colors duration-200')

  // Classes for theme toggle buttons (inactive state)
  const themeButtonInactiveClasses = computed(() => 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-400 hover:scale-105')

  // Classes for theme toggle buttons (active state)
  const themeButtonActiveClasses = computed(() => 'bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 shadow-lg scale-110 ring-2 ring-blue-200 dark:ring-blue-800')

  // Classes for theme toggle buttons (base)
  const themeButtonBaseClasses = computed(() => 'p-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transform')

  // Classes for review cards (dark theme consistent)
  const reviewCardClasses = computed(() => 'bg-background dark:bg-surface border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all duration-200 hover:shadow-lg')

  // Classes for review content sections
  const reviewContentClasses = computed(() => 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl')

  // Classes for review header text
  const reviewHeaderClasses = computed(() => 'text-gray-700 dark:text-gray-200 font-medium')

  // Classes for review body text
  const reviewBodyClasses = computed(() => 'text-gray-600 dark:text-gray-300 leading-relaxed')

  // Classes for review metadata (dates, ratings)
  const reviewMetaClasses = computed(() => 'text-gray-500 dark:text-gray-400 text-sm')

  // Classes for section containers with consistent dark theme
  const sectionContainerClasses = computed(() => 'bg-background border border-border shadow-md rounded-2xl p-6 transition-colors duration-200')

  // Classes for section headers with consistent styling
  const sectionHeaderClasses = computed(() => 'text-base font-bold tracking-tight text-muted uppercase')

  // Classes for list items with hover effects
  const listItemClasses = computed(() => 'flex items-center justify-between p-4 transition-all duration-200 border border-border rounded-xl bg-surface hover:shadow-lg')

  // Classes for status badges/pills
  const statusBadgeClasses = computed(() => 'px-3 py-1 text-sm font-medium rounded-full')

  // Classes for action buttons in list items
  const actionButtonClasses = computed(() => 'text-muted hover:text-foreground transition-colors duration-200 cursor-pointer text-xs font-light')

  // Classes for icon containers (like in order items)
  const iconContainerClasses = computed(() => 'flex items-center justify-center w-10 h-10 rounded-lg bg-surface text-primary-foreground')

  // Classes for icon colors inside containers
  const iconInContainerClasses = computed(() => 'text-primary-foreground')

  // Classes for empty state text
  const emptyStateTextClasses = computed(() => 'text-muted-foreground')

  // Classes for empty state icons
  const emptyStateIconClasses = computed(() => 'text-muted-foreground opacity-80')

  // Classes for loading text
  const loadingTextClasses = computed(() => 'text-muted')

  // Classes for icon colors (generic)
  const iconColorClasses = computed(() => 'text-muted-foreground')

  // Classes for interactive icons (buttons)
  const interactiveIconClasses = computed(() => 'text-muted-foreground hover:text-foreground transition-colors duration-200')

  // Classes for price text
  const priceTextClasses = computed(() => 'text-foreground font-semibold')

  // Classes for footer sections
  const footerLinkClasses = computed(() => 'text-muted hover:text-foreground transition-colors duration-200')

  // Classes for page background
  const pageBackgroundClasses = computed(() => 'bg-background text-foreground transition-colors duration-200')

  // Classes for form inputs
  const formInputClasses = computed(() => 'w-full px-4 py-3 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200')

  // Classes for form labels
  const formLabelClasses = computed(() => 'block font-srProDisplay text-sm font-medium text-foreground mb-2')

  // Classes for FAQ buttons
  const faqButtonClasses = computed(() => 'w-full px-6 py-4 text-left font-srProDisplay font-medium text-foreground hover:bg-surface-hover transition-colors duration-200 flex items-center justify-between bg-surface-secondary')

  // Classes for FAQ content
  const faqContentClasses = computed(() => 'px-6 pb-4 py-4 bg-background')

  // Classes for info cards (contact information blocks)
  const infoCardClasses = computed(() => 'bg-background dark:bg-surface rounded-lg p-6 h-full transition-colors duration-200')

  // Classes for icon backgrounds in info cards
  const iconBackgroundClasses = computed(() => 'w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200')

  // Classes for dividers/borders
  const dividerClasses = computed(() => 'border-gray-200 dark:border-gray-700')

  // Classes for hero section titles
  const heroTitleClasses = computed(() => 'font-srProDisplay text-5xl font-medium mb-6 text-foreground transition-colors duration-200')

  // Classes for hero section descriptions
  const heroDescriptionClasses = computed(() => 'font-srProDisplay text-lg text-gray-500 dark:text-gray-300 mb-8 leading-relaxed transition-colors duration-200')

  // Classes for value cards in about page
  const aboutValueCardClasses = computed(() => 'text-center p-6 bg-background dark:bg-surface rounded-lg transition-colors duration-200')

  // Classes for value card icons background
  const aboutValueIconBgClasses = computed(() => 'w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200')

  // Classes for value card icons
  const aboutValueIconClasses = computed(() => 'w-8 h-8 text-foreground transition-colors duration-200')

  // Classes for value card titles
  const aboutValueTitleClasses = computed(() => 'font-srProDisplay text-xl font-medium mb-3 text-foreground transition-colors duration-200')

  // Classes for featured product cards
  const featuredProductCardClasses = computed(() => 'bg-gray-100 dark:bg-gray-800 rounded-[15px] p-8 text-center hover:shadow-lg dark:hover:shadow-gray-900/30 transition-all duration-300')

  // Classes for featured product titles
  const featuredProductTitleClasses = computed(() => 'font-srProDisplay text-lg font-medium mb-2 text-foreground transition-colors duration-200')

  // Classes for featured product descriptions
  const featuredProductDescriptionClasses = computed(() => 'font-srProDisplay text-gray-500 dark:text-gray-300 text-sm transition-colors duration-200')

  // Classes for CTA section
  const ctaSectionClasses = computed(() => 'max-w-4xl mx-auto text-center bg-gray-800 dark:bg-gray-700 rounded-[15px] p-12 transition-colors duration-200')

  // Classes for CTA titles
  const ctaTitleClasses = computed(() => 'font-srProDisplay text-3xl font-medium mb-4 text-white transition-colors duration-200')

  // Classes for CTA descriptions
  const ctaDescriptionClasses = computed(() => 'font-srProDisplay text-gray-300 dark:text-gray-200 mb-8 leading-relaxed transition-colors duration-200')

  // Classes for section titles
  const sectionTitleClasses = computed(() => 'font-srProDisplay text-3xl font-medium text-center mb-12 text-foreground transition-colors duration-200')

  // Classes for catalog filter sections
  const catalogFilterSectionClasses = computed(() => 'bg-background dark:bg-surface rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600 transition-colors duration-200')

  // Classes for catalog filter headers
  const catalogFilterHeaderClasses = computed(() => 'flex items-center justify-between border-b border-gray-200 dark:border-gray-600 mb-4 pb-3')

  // Classes for catalog filter titles
  const catalogFilterTitleClasses = computed(() => 'font-srProDisplay text-lg font-semibold text-foreground transition-colors duration-200')

  // Classes for catalog search inputs
  const catalogSearchInputClasses = computed(() => 'w-full bg-gray-100 dark:bg-gray-700 p-2 font-srProDisplay text-sm font-medium text-foreground outline-none rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-300')

  // Classes for catalog product cards
  const catalogProductCardClasses = computed(() => 'relative h-auto rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-6 duration-500 hover:scale-[1.02] hover:shadow-md dark:hover:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 transition-all duration-200')

  // Classes for catalog mobile filter controls
  const catalogMobileFilterClasses = computed(() => 'bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 space-y-6 border border-gray-200 dark:border-gray-600 transition-colors duration-200')

  // Classes for catalog sort select
  const catalogSortSelectClasses = computed(() => 'font-srProDisplay border border-gray-200 dark:border-gray-600 rounded-md px-3 py-2.5 bg-background dark:bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors duration-200')

  // Classes for catalog debug panel
  const catalogDebugPanelClasses = computed(() => 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600/50 rounded-lg shadow-lg p-3 sm:p-4')

  // Classes for catalog debug text
  const catalogDebugTextClasses = computed(() => 'text-xs text-yellow-900 dark:text-yellow-100 space-y-2 max-h-40 overflow-y-auto')

  // Classes for catalog pagination buttons
  const catalogPaginationButtonClasses = computed(() => 'px-3 py-2 rounded-md text-sm font-medium bg-background text-foreground hover:opacity-95 border border-gray-200 dark:border-gray-600 transition-colors duration-200')

  // Classes for catalog pagination active button
  const catalogPaginationActiveClasses = computed(() => 'px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground')

  // Classes for catalog checkbox inputs
  const catalogCheckboxClasses = computed(() => 'w-4 h-4 accent-black dark:accent-white rounded transition-colors duration-200')

  // Classes for catalog filter labels
  const catalogFilterLabelClasses = computed(() => 'text-sm font-srProDisplay text-foreground transition-colors duration-200')

  // Classes for catalog clear filter buttons
  const catalogClearFilterClasses = computed(() => 'text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200')

  // Classes for catalog filter summary sections
  const catalogFilterSummaryClasses = computed(() => 'p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200')

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
    footerLinkClasses,
    pageBackgroundClasses,
    formInputClasses,
    formLabelClasses,
    faqButtonClasses,
    faqContentClasses,
    infoCardClasses,
    iconBackgroundClasses,
    dividerClasses,
    heroTitleClasses,
    heroDescriptionClasses,
    aboutValueCardClasses,
    aboutValueIconBgClasses,
    aboutValueIconClasses,
    aboutValueTitleClasses,
    featuredProductCardClasses,
    featuredProductTitleClasses,
    featuredProductDescriptionClasses,
    ctaSectionClasses,
    ctaTitleClasses,
    ctaDescriptionClasses,
    sectionTitleClasses,
    catalogFilterSectionClasses,
    catalogFilterHeaderClasses,
    catalogFilterTitleClasses,
    catalogSearchInputClasses,
    catalogProductCardClasses,
    catalogMobileFilterClasses,
    catalogSortSelectClasses,
    catalogDebugPanelClasses,
    catalogDebugTextClasses,
    catalogPaginationButtonClasses,
    catalogPaginationActiveClasses,
    catalogCheckboxClasses,
    catalogFilterLabelClasses,
    catalogClearFilterClasses,
    catalogFilterSummaryClasses,
  }
}
