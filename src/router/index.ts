import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Main pages
    { path: '/', name: 'home', component: () => import('../views/home/HomeView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/home/AboutView.vue') },
    { path: '/contact', name: 'contact', component: () => import('../views/home/ContactView.vue') },

    // Catalog and product-related pages
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/catalog/CatalogView.vue'),
    },
    {
      path: '/catalog/smartphones',
      name: 'smartphones',
      component: () => import('../views/catalog/CatalogSmartphonesView.vue'),
    },
    {
      path: '/catalog/smartphones/:productId',
      name: 'productDetails',
      component: () => import('../views/catalog/CatalogProductDetailsView.vue'),
    },

    // Shopping cart and wishlist
    {
      path: '/cart',
      name: 'shoppingCart',
      component: () => import('../views/cart/ShoppingCartView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('../views/home/WishlistView.vue'),
      meta: { requiresAuth: true },
    },

    // Checkout process
    {
      path: '/checkoutAddress',
      name: 'checkoutAddress',
      component: () => import('../views/checkout/CheckoutAddressView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/checkoutShipping',
      name: 'checkoutShipping',
      component: () => import('../views/checkout/CheckoutShippingView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/checkoutPayment',
      name: 'checkoutPayment',
      component: () => import('../views/checkout/CheckoutPaymentView.vue'),
      meta: { requiresAuth: true },
    },

    // User account and related pages
    {
      path: '/account',
      name: 'userAccount',
      component: () => import('../views/user/UserAccountView.vue'),
      meta: { requiresAuth: true },
    },

    // Authentication
    { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
    },
    { path: '/verify', name: 'verify', component: () => import('../views/auth/VerifyView.vue') },
  ],
})

// Navigation guard to protect authenticated routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if the route requires authentication and user is not authenticated
    next({ name: 'login' })
    return
  }

  // Check if route requires admin role
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    // Redirect to account if user doesn't have admin role
    next({ name: 'userAccount' })
    return
  }

  // Redirect authenticated users away from login page
  if (to.name === 'login' && authStore.isAuthenticated) {
    // Redirect to account if user is already authenticated and trying to access login
    next({ name: 'userAccount' })
    return
  }

  next()
})

export default router
