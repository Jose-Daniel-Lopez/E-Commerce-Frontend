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
    // Determine the actual scrolling element (html or body depending on CSS)
  // Detect the actual element used for scrolling. Some layouts keep html overflow hidden
  // and make body the scroll container. Prefer an element that currently has scroll
  // or one whose scrollHeight exceeds its clientHeight.
  const detectScroller = (): HTMLElement | null => {
    const scrollingElement = (document.scrollingElement as HTMLElement) || null
    const body = document.body as HTMLElement | null
    const docEl = document.documentElement as HTMLElement | null

    const candidates: Array<HTMLElement | null> = [scrollingElement, body, docEl]

    // If any has a non-zero scrollTop, pick that one
    for (const c of candidates) {
      if (c && (c.scrollTop ?? 0) > 0) return c
    }

    // Otherwise pick the first whose scrollHeight > clientHeight
    for (const c of candidates) {
      if (c && c.scrollHeight > c.clientHeight) return c
    }

    // Fallback order
    return scrollingElement || docEl || body
  }

  const scroller: HTMLElement | null = detectScroller()
  console.debug('[useScrollToTop] detected scroller:', scroller && (scroller === document.body ? 'body' : scroller === document.documentElement ? 'documentElement' : 'scrollingElement/other'))

    const scrollOptions = smooth
      ? { top: 0, behavior: 'smooth' as ScrollBehavior }
      : { top: 0, behavior: 'auto' as ScrollBehavior }

    // Try to scroll the best candidate scroller first
    if (typeof scroller?.scrollTo === 'function') {
      scroller.scrollTo(scrollOptions)
    } else {
      // Fallback to window
      window.scrollTo(scrollOptions)
    }

    // Return a promise that resolves when the scroll reaches top, or rejects by timeout
    return new Promise<void>((resolve, reject) => {
      const start = performance.now()
      const timeout = 1200 // ms to wait for smooth scroll to complete

      const check = () => {
        // Read from the most reliable sources: if scroller is body use its scrollTop,
        // otherwise fall back to documentElement/window.
        const current = (scroller && (scroller.scrollTop ?? 0)) || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        if (current <= 0) {
          resolve()
          return
        }
        if (performance.now() - start > timeout) {
          reject(new Error('scroll timeout'))
          return
        }
        requestAnimationFrame(check)
      }

      requestAnimationFrame(check)
    })
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
