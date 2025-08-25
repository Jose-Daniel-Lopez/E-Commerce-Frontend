import { computed } from 'vue'

/**
 * Composable: useThemeClasses
 *
 * Provides a centralized collection of Tailwind CSS utility classes
 * that are theme-aware (light/dark mode) via CSS variables.
 *
 * ✅ Purpose:
 * - Ensures visual consistency across components
 * - Abstracts styling logic away from templates
 * - Enables easy theming using semantic class names
 * - Leverages CSS transitions for smooth color changes
 *
 * 💡 Implementation Notes:
 * - All classes use semantic color tokens (e.g., `bg-background`, `text-foreground`)
 *   defined in `base.css` as CSS variables for dynamic theming.
 * - Transitions are applied consistently (`duration-200`, `transition-colors`)
 * - Avoids fixed colors (like `bg-blue-500`) in favor of theme tokens
 *
 * 📦 Usage:
 *   const { buttonPrimaryClasses, cardClasses } = useThemeClasses()
 *
 * @returns {Object} - Reactive class strings via computed properties
 */
export const useThemeClasses = () => {
  // ===========================================================================
  // 🔲 Base Layout & Structure
  // ===========================================================================

  /**
   * Standard container for cards, sections, and panels.
   * Includes background, border, and subtle transition.
   */
  const cardClasses = computed(() => 'border border-border text-foreground transition-colors duration-200')

  /**
   * Full-page background with consistent text color.
   */
  const pageBackgroundClasses = computed(() => 'bg-background text-foreground transition-colors duration-200')

  /**
   * Section-level container with padding, border, and shadow.
   */
  const sectionContainerClasses = computed(() => 'bg-surface border border-border shadow-md rounded-2xl p-3 transition-colors duration-200')

  /**
   * Header style for sections (uppercase, muted, small font).
   */
  const sectionHeaderClasses = computed(() => 'text-base font-bold tracking-tight text-muted uppercase')

  /**
   * Title style for major sections (centered, large, prominent).
   */
  const sectionTitleClasses = computed(() => 'font-srProDisplay text-3xl font-medium text-center mb-12 text-foreground transition-colors duration-200')

  // ===========================================================================
  // 📝 Typography & Text
  // ===========================================================================

  /**
   * Default text color (primary content).
   */
  const textClasses = computed(() => 'text-foreground')

  /**
   * Secondary text (e.g., metadata, captions).
   */
  const textSecondaryClasses = computed(() => 'text-muted')

  /**
   * Muted foreground text (less emphasis than secondary).
   */
  const textMutedClasses = computed(() => 'text-muted-foreground')

  /**
   * Hero section title (large, bold, prominent).
   */
  const heroTitleClasses = computed(() => 'font-srProDisplay text-5xl font-medium mb-6 text-foreground transition-colors duration-200')

  /**
   * Hero section description (medium emphasis, subdued color).
   */
  const heroDescriptionClasses = computed(() => 'font-srProDisplay text-lg text-muted-foreground mb-8 leading-relaxed transition-colors duration-200')

  /**
   * CTA section title (white text for contrast on dark background).
   */
  const ctaTitleClasses = computed(() => 'font-srProDisplay text-3xl font-medium mb-4 text-white transition-colors duration-200')

  /**
   * CTA section description (light gray on dark).
   */
  const ctaDescriptionClasses = computed(() => 'font-srProDisplay text-gray-300 dark:text-gray-200 mb-8 leading-relaxed transition-colors duration-200')

  /**
   * Review-specific header text.
   */
  const reviewHeaderClasses = computed(() => 'text-muted dark:text-gray-200 font-medium')

  /**
   * Review body content (readable line height and subdued tone).
   */
  const reviewBodyClasses = computed(() => 'text-muted-foreground dark:text-gray-300 leading-relaxed')

  /**
   * Review metadata (dates, ratings, small text).
   */
  const reviewMetaClasses = computed(() => 'text-muted-foreground dark:text-gray-400 text-sm')

  /**
   * Loading state text appearance.
   */
  const loadingTextClasses = computed(() => 'text-muted-foreground')

  /**
   * Empty state text (subtle hint text when no data).
   */
  const emptyStateTextClasses = computed(() => 'text-muted-foreground')

  // ===========================================================================
  // 🎨 Buttons & Interactive Elements
  // ===========================================================================

  /**
   * Primary button: solid fill, high contrast, hover opacity.
   */
  const buttonPrimaryClasses = computed(() => 'bg-primary text-primary-foreground hover:bg-accent transition-colors duration-200')

  /**
   * Secondary button: surface background, subtle hover.
   */
  const buttonSecondaryClasses = computed(() => 'bg-surface-secondary text-foreground hover:bg-surface-tertiary transition-colors duration-200')

  /**
   * Outline button: transparent background with border.
   */
  const buttonOutlineClasses = computed(() => 'bg-transparent border border-border text-foreground hover:bg-surface-hover transition-colors duration-200')

  /**
   * Base text styling for buttons (consistent text color).
   */
  const buttonTextClasses = computed(() => 'text-foreground')

  /**
   * Theme toggle base classes: padding, border, focus ring, transform.
   */
  const themeButtonBaseClasses = computed(() => 'p-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transform')

  /**
   * Theme toggle inactive state: light/dark neutral appearance.
   */
  const themeButtonInactiveClasses = computed(() => 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-400 hover:scale-105')

  /**
   * Theme toggle active state: blue highlight with shadow and scale.
   */
  const themeButtonActiveClasses = computed(() => 'bg-primary text-white border-primary shadow-lg scale-110 ring-2 ring-primary-bg')

  /**
   * Action buttons in lists (small, subtle, interactive).
   */
  const actionButtonClasses = computed(() => 'text-muted hover:text-foreground transition-colors duration-200 cursor-pointer text-xs font-light')

  /**
   * FAQ accordion toggle button.
   */
  const faqButtonClasses = computed(() => 'w-full px-6 py-4 text-left font-srProDisplay font-medium text-foreground hover:bg-surface-hover transition-colors duration-200 flex items-center justify-between bg-surface-secondary')

  /**
   * Pagination button (default state).
   */
  const catalogPaginationButtonClasses = computed(() => 'px-3 py-2 rounded-md text-sm font-medium bg-surface text-foreground hover:bg-surface-hover border border-border transition-colors duration-200')

  /**
   * Pagination button (active/current page).
   */
  const catalogPaginationActiveClasses = computed(() => 'px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground')

  /**
   * Clear filter button (small, subtle text).
   */
  const catalogClearFilterClasses = computed(() => 'text-xs text-muted-foreground hover:text-foreground transition-colors duration-200')

  // ===========================================================================
  // 📥 Forms & Inputs
  // ===========================================================================

  /**
   * Standard input field styling (full width, padding, border).
   */
  const inputClasses = computed(() => 'w-full px-4 py-3 border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200')

  /**
   * Form-specific input (with rounded corners).
   */
  const formInputClasses = computed(() => 'w-full px-4 py-3 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200')

  /**
   * Form label (block, small, medium weight).
   */
  const formLabelClasses = computed(() => 'block font-srProDisplay text-sm font-medium text-foreground mb-2')

  /**
   * Catalog search input (used in filtering UI).
   */
  const catalogSearchInputClasses = computed(() => 'w-full text-foreground font-srProDisplay text-sm font-medium placeholder-muted-foreground outline-none rounded-lg transition-colors duration-200')

  /**
   * Catalog sort select dropdown.
   */
  const catalogSortSelectClasses = computed(() => 'font-srProDisplay border border-border rounded-md px-3 py-2.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200')

  /**
   * Checkbox inputs in catalog filters.
   */
  const catalogCheckboxClasses = computed(() => 'w-4 h-4 accent-primary dark:accent-white rounded transition-colors duration-200')

  // ===========================================================================
  // 🖼️ Icons & Visual Elements
  // ===========================================================================

  /**
   * Container for icons (e.g., circular background).
   */
  const iconContainerClasses = computed(() => 'flex items-center justify-center w-10 h-10 rounded-lg bg-surface text-primary')

  /**
   * Icon color when inside a container.
   */
  const iconInContainerClasses = computed(() => 'text-primary')

  /**
   * Generic icon color (muted, consistent across theme).
   */
  const iconColorClasses = computed(() => 'text-muted-foreground')

  /**
   * Interactive icons (e.g., clickable icons with hover effect).
   */
  const interactiveIconClasses = computed(() => 'text-muted-foreground hover:text-foreground transition-colors duration-200')

  /**
   * Empty state icon appearance.
   */
  const emptyStateIconClasses = computed(() => 'text-muted-foreground opacity-80')

  /**
   * Background for icons in info cards.
   */
  const iconBackgroundClasses = computed(() => 'w-12 h-12 bg-surface-secondary rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200')

  /**
   * Background for value icons in about section.
   */
  const aboutValueIconBgClasses = computed(() => 'w-16 h-16 mx-auto mb-4 bg-surface-secondary rounded-full flex items-center justify-center transition-colors duration-200')

  /**
   * Icon inside value cards.
   */
  const aboutValueIconClasses = computed(() => 'w-8 h-8 text-primary transition-colors duration-200')

  // ===========================================================================
  // 🧩 Cards & Content Blocks
  // ===========================================================================

  /**
   * Review card styling (rounded, border, hover shadow).
   */
  const reviewCardClasses = computed(() => 'bg-surface border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-lg')

  /**
   * Review content section (light gray background).
   */
  const reviewContentClasses = computed(() => 'bg-surface-secondary border border-border rounded-xl')

  /**
   * Info card (e.g., contact blocks).
   */
  const infoCardClasses = computed(() => 'bg-surface border border-border rounded-lg p-6 h-full transition-colors duration-200')

  /**
   * Value card in about page (centered, padded).
   */
  const aboutValueCardClasses = computed(() => 'text-center p-6 bg-surface border border-border rounded-lg transition-colors duration-200')

  /**
   * Title for about/value cards
   */
  const aboutValueTitleClasses = computed(() => 'text-lg font-medium text-foreground')

  /**
   * Featured product card (used in homepage).
   */
  const featuredProductCardClasses = computed(() => 'bg-surface-secondary border border-border rounded-[15px] p-8 text-center hover:shadow-lg transition-all duration-300')

  /**
   * Featured product title (used in About/Featured components)
   */
  const featuredProductTitleClasses = computed(() => 'text-xl font-semibold text-foreground')

  /**
   * Featured product description (used in About/Featured components)
   */
  const featuredProductDescriptionClasses = computed(() => 'text-muted-foreground')

  /**
   * Catalog product card (individual items).
   */
  const catalogProductCardClasses = computed(() => 'relative h-auto rounded-lg border border-border bg-surface px-3 py-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-md')

  // ===========================================================================
  // 🧭 Navigation & Links
  // ===========================================================================

  /**
   * Navigation bar base classes.
   */
  const navClasses = computed(() => 'bg-background text-foreground transition-colors duration-200')

  /**
   * Standard link styling (subtle color, hover to foreground).
   */
  const linkClasses = computed(() => 'text-muted hover:text-foreground transition-colors duration-200')

  /**
   * Footer-specific link style.
   */
  const footerLinkClasses = computed(() => 'text-muted hover:text-foreground transition-colors duration-200')

  // ===========================================================================
  // 🧰 Miscellaneous & Utility
  // ===========================================================================

  /**
   * Hover effect for list items and interactive areas.
   */
  const hoverClasses = computed(() => 'hover:bg-surface-hover hover:border-border transition-all duration-200')

  /**
   * List item base (flex, border, hover shadow).
   */
  const listItemClasses = computed(() => 'flex items-center justify-between p-4 border border-border rounded-xl bg-surface hover:shadow-lg transition-all duration-200')

  /**
   * Status badge/pill (small, rounded).
   */
  const statusBadgeClasses = computed(() => 'px-3 py-1 text-sm font-medium rounded-full bg-primary-bg text-primary')

  /**
   * Divider line (used in borders between sections).
   */
  const dividerClasses = computed(() => 'border-border')

  /**
   * Price text (bold, prominent).
   */
  const priceTextClasses = computed(() => 'text-foreground font-semibold')

  /**
   * Overlay for modals, dialogs, backdrops.
   */
  const overlayClasses = computed(() => 'bg-overlay backdrop-blur-sm')

  /**
   * High-contrast background (e.g., warning/debug).
   */
  const contrastBgClasses = computed(() => 'bg-warning text-primary-foreground')

  /**
   * FAQ content panel (below the toggle button).
   */
  const faqContentClasses = computed(() => 'px-6 pb-4 py-4 bg-surface')

  /**
   * CTA section wrapper (dark background, rounded, padded).
   */
  const ctaSectionClasses = computed(() => 'max-w-4xl mx-auto text-center bg-surface dark:bg-gray-700 rounded-[15px] p-12 text-primary-foreground transition-colors duration-200')

  // ===========================================================================
  // 🔍 Catalog-Specific UI
  // ===========================================================================

  /**
   * Catalog filter section wrapper.
   */
  const catalogFilterSectionClasses = computed(() => 'bg-surface border border-border rounded-lg p-4 mb-6 transition-colors duration-200')

  /**
   * Catalog filter header (flex with border bottom).
   */
  const catalogFilterHeaderClasses = computed(() => 'flex items-center justify-between border-b border-border mb-4 pb-3')

  /**
   * Catalog filter title (section header in filters).
   */
  const catalogFilterTitleClasses = computed(() => 'font-srProDisplay text-lg font-semibold text-foreground transition-colors duration-200')

  /**
   * Mobile filter container.
   */
  const catalogMobileFilterClasses = computed(() => 'bg-surface border border-border rounded-lg p-4 mb-4 space-y-6 transition-colors duration-200')

  /**
   * Filter label text.
   */
  const catalogFilterLabelClasses = computed(() => 'text-sm font-srProDisplay text-foreground transition-colors duration-200')

  /**
   * Filter summary section (applied filters preview).
   */
  const catalogFilterSummaryClasses = computed(() => 'p-4 bg-surface-secondary border border-border rounded-lg transition-colors duration-200')

  /**
   * Debug panel in catalog (yellow highlight for dev tools).
   */
  const catalogDebugPanelClasses = computed(() => 'bg-warning-bg border border-warning rounded-lg shadow-lg p-3 sm:p-4')

  /**
   * Text inside debug panel (small, readable, contrast).
   */
  const catalogDebugTextClasses = computed(() => 'text-xs text-warning-foreground space-y-2 max-h-40 overflow-y-auto')

  // ===========================================================================
  // 📊 Progress & Rating Elements
  // ===========================================================================

  /**
   * Progress bar background (neutral background for rating bars).
   */
  const progressBarBgClasses = computed(() => 'bg-muted rounded-full transition-colors duration-200')

  /**
   * Progress bar fill (active portion).
   */
  const progressBarFillClasses = computed(() => 'bg-primary rounded-full transition-all duration-200')

  /**
   * Rating text (used for rating labels).
   */
  const ratingTextClasses = computed(() => 'text-muted transition-colors duration-200')

  /**
   * Rating count text (smaller, more muted).
   */
  const ratingCountClasses = computed(() => 'text-muted-foreground transition-colors duration-200')

  // ===========================================================================
  // ✅ Return all theme-aware classes
  // ===========================================================================

  return {
    // Layout
    cardClasses,
    pageBackgroundClasses,
    sectionContainerClasses,
    sectionHeaderClasses,
    sectionTitleClasses,

    // Text
    textClasses,
    textSecondaryClasses,
    textMutedClasses,
    heroTitleClasses,
    heroDescriptionClasses,
    ctaTitleClasses,
    ctaDescriptionClasses,
    reviewHeaderClasses,
    reviewBodyClasses,
    reviewMetaClasses,
    loadingTextClasses,
    emptyStateTextClasses,

    // Buttons
    buttonPrimaryClasses,
    buttonSecondaryClasses,
    buttonOutlineClasses,
    buttonTextClasses,
    themeButtonBaseClasses,
    themeButtonInactiveClasses,
    themeButtonActiveClasses,
    actionButtonClasses,
    faqButtonClasses,
    catalogPaginationButtonClasses,
    catalogPaginationActiveClasses,
    catalogClearFilterClasses,

    // Forms
    inputClasses,
    formInputClasses,
    formLabelClasses,
    catalogSearchInputClasses,
    catalogSortSelectClasses,
    catalogCheckboxClasses,
    catalogFilterLabelClasses,

    // Icons
    iconContainerClasses,
    iconInContainerClasses,
    iconColorClasses,
    interactiveIconClasses,
    emptyStateIconClasses,
    iconBackgroundClasses,
    aboutValueIconBgClasses,
    aboutValueIconClasses,

    // Cards
    reviewCardClasses,
    reviewContentClasses,
    infoCardClasses,
    aboutValueCardClasses,
  aboutValueTitleClasses,
    featuredProductCardClasses,
  featuredProductTitleClasses,
  featuredProductDescriptionClasses,
    catalogProductCardClasses,

    // Navigation
    navClasses,
    linkClasses,
    footerLinkClasses,

    // Utilities
    hoverClasses,
    listItemClasses,
    statusBadgeClasses,
    dividerClasses,
    priceTextClasses,
    overlayClasses,
    contrastBgClasses,
    faqContentClasses,
    ctaSectionClasses,

    // Catalog UI
    catalogFilterSectionClasses,
    catalogFilterHeaderClasses,
    catalogFilterTitleClasses,
    catalogMobileFilterClasses,
    catalogFilterSummaryClasses,
    catalogDebugPanelClasses,
    catalogDebugTextClasses,

    // Progress & Rating
    progressBarBgClasses,
    progressBarFillClasses,
    ratingTextClasses,
    ratingCountClasses,
  }
}
