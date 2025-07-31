import { nextTick } from 'vue'

/**
 * Composable for reliable scroll to top functionality
 * Provides multiple methods to ensure scroll works across different scenarios
 */
export function useScrollToTop() {
  /**
   * Scrolls to the top of the page with multiple fallback methods
   * @param smooth - Whether to use smooth scrolling (default: true)
   */
  const scrollToTop = async (smooth: boolean = true) => {
    // Wait for DOM to be updated
    await nextTick()

    const scrollOptions = smooth 
      ? { top: 0, behavior: 'smooth' as ScrollBehavior }
      : { top: 0, behavior: 'auto' as ScrollBehavior }

    try {
      // Method 1: Modern scroll with behavior
      window.scrollTo(scrollOptions)
      
      // Method 2: Fallback after short delay
      setTimeout(() => {
        if (window.pageYOffset > 0) {
          window.scrollTo(0, 0)
        }
      }, 100)

      // Method 3: Double-check with requestAnimationFrame
      requestAnimationFrame(() => {
        if (window.pageYOffset > 0) {
          window.scrollTo(0, 0)
        }
      })
    } catch (error) {
      // Fallback for older browsers
      console.warn('Smooth scroll not supported, using instant scroll:', error)
      window.scrollTo(0, 0)
    }
  }

  /**
   * Forces an immediate scroll to top without smooth animation
   */
  const forceScrollToTop = () => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  /**
   * Scrolls to a specific element
   * @param elementId - The ID of the element to scroll to
   * @param smooth - Whether to use smooth scrolling (default: true)
   */
  const scrollToElement = (elementId: string, smooth: boolean = true) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto',
        block: 'start'
      })
    }
  }

  return {
    scrollToTop,
    forceScrollToTop,
    scrollToElement
  }
}
