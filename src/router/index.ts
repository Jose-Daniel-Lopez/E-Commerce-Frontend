import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Creates a Vue Router instance with lazy-loaded routes and navigation guards.
 * Uses HTML5 history mode for clean URLs (e.g., /catalog instead of #/catalog).
 *
 * Routes are grouped by functionality (e.g., main pages, catalog, auth).
 * Some routes require authentication or specific roles, enforced via `meta` fields.
 */
const router = createRouter({
  // Uses HTML5 history mode; base URL is set from environment variable
  history: createWebHistory(import.meta.env.BASE_URL),

  /**
   * Handles scroll position for all navigations.
   * @param to - The target route.
   * @param from - The route being left.
   * @param savedPosition - The saved scroll position (if any) from browser back/forward.
   * @returns The desired scroll position.
   */
  scrollBehavior(to, from, savedPosition) {
    // If a saved position exists (from back/forward buttons), use it.
    if (savedPosition) {
      return savedPosition
    }
    // Otherwise, scroll to the top of the page.
    return { top: 0, behavior: 'smooth' }
  },

  routes: [
    // ========================
    // Main Static Pages
    // ========================
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/HomeView.vue'),
      meta: { title: 'Home' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/home/AboutView.vue'),
      meta: { title: 'About Us' }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/home/ContactView.vue'),
      meta: { title: 'Contact' }
    },

    // ========================
    // Product Catalog & Details
    // ========================
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/catalog/CatalogView.vue'),
      meta: { title: 'Product Catalog' }
    },
    {
      path: '/catalog/all-products',
      name: 'allProducts',
      component: () => import('../views/catalog/CatalogAllProductsView.vue'),
      meta: { title: 'All Products' }
    },
    {
      path: '/catalog/:categoryName',
      name: 'categoryProducts',
      component: () => import('../views/catalog/CatalogCategoryView.vue'),
      meta: { title: 'Category Products' },
      props: true
    },
    {
      path: '/catalog/:categoryName/:productId',
      name: 'productDetails',
      component: () => import('../views/catalog/CatalogProductDetailsView.vue'),
      meta: { title: 'Product Details' },
      props: true // Pass route params (like productId) as props to the component
    },

    // ========================
    // Shopping Cart & Wishlist
    // ========================
    {
      path: '/cart',
      name: 'shoppingCart',
      component: () => import('../views/cart/ShoppingCartView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Shopping Cart'
      }
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('../views/home/WishlistView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Wishlist'
      }
    },

    // ========================
    // Checkout Process (Multi-Step)
    // ========================
    {
      path: '/checkoutAddress',
      name: 'checkoutAddress',
      component: () => import('../views/checkout/CheckoutAddressView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Shipping Address'
      }
    },
    {
      path: '/checkoutShipping',
      name: 'checkoutShipping',
      component: () => import('../views/checkout/CheckoutShippingView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Shipping Method'
      }
    },
    {
      path: '/checkoutPayment',
      name: 'checkoutPayment',
      component: () => import('../views/checkout/CheckoutPaymentView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Payment'
      }
    },

    // ========================
    // User Account & Profile
    // ========================
    {
      path: '/account',
      name: 'userAccount',
      component: () => import('../views/user/UserAccountView.vue'),
      meta: {
        requiresAuth: true,
        title: 'My Account'
      }
    },

    // ========================
    // Authentication Routes
    // ========================
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { title: 'Log In' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { title: 'Create Account' }
    },
    {
      path: '/verify',
      name: 'verify',
      component: () => import('../views/auth/VerifyView.vue'),
      meta: { title: 'Verify Email' }
    },

    // ========================
    // Test and Demo Routes
    // ========================
    {
      path: '/toast-demo',
      name: 'toastDemo',
      component: () => import('../views/testing/ToastDemo.vue'),
      meta: { title: 'Toast Demo' }
    }
  ]
})

// ========================
// Global Navigation Guard
// ========================
// Protects routes based on authentication and role using the `meta` field
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 1. Redirect unauthenticated users trying to access protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.warn(`Access denied to ${to.fullPath}: authentication required`)
    return next({ name: 'login' })
  }

  // 2. Redirect non-admin users trying to access admin-only routes
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    console.warn(`Access denied to ${to.fullPath}: admin role required`)
    return next({ name: 'userAccount' })
  }

  // 3. Redirect authenticated users away from login/register pages
  if (['login', 'register'].includes(to.name as string) && authStore.isAuthenticated) {
    console.info(`Authenticated user redirected from ${String(to.name)} to account`)
    return next({ name: 'userAccount' })
  }

  // 4. Allow navigation to proceed
  next()
})

// ========================
// Robust Scroll to Top Handler
// ========================
// Ensures scroll to top works reliably with all types of navigation
router.afterEach((to, from) => {
  // Skip if navigating to the same route
  if (to.path === from.path) {
    return
  }

  // Use multiple fallbacks to ensure scroll works
  const scrollToTop = () => {
    // Method 1: Standard scroll
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Method 2: Fallback for browsers that don't support smooth behavior
    setTimeout(() => {
      if (window.pageYOffset > 0) {
        window.scrollTo(0, 0)
      }
    }, 100)
  }

  // Execute immediately
  scrollToTop()

  // Also execute after a short delay to handle slow-loading components
  setTimeout(scrollToTop, 150)

  // Final fallback using requestAnimationFrame
  requestAnimationFrame(() => {
    setTimeout(scrollToTop, 50)
  })
})

/**
 * Export the configured router instance for use in the Vue app.
 * Ensures consistent routing behavior with lazy loading, authentication checks,
 * and semantic route organization.
 */
export default router
