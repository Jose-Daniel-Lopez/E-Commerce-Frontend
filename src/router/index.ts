import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Main pages
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
    { path: '/shop', name: 'shop', component: () => import('../views/ShopView.vue') },

    // Catalog and product-related pages
    { path: '/catalog', name: 'catalog', component: () => import('../views/CatalogView.vue') },
    { path: '/catalog/smartphones', name: 'smartphones', component: () => import('../views/SmartphonesView.vue') },
    { path: '/catalog/smartphones/:productId', name: 'productDetails', component: () => import('../views/ProductDetailsView.vue') },
    { path: '/categories/:categoryId/products', name: 'categoryProducts', component: () => import('../views/CategoryProductsView.vue') },

    // Shopping cart and wishlist
    { path: '/cart', name: 'shoppingCart', component: () => import('../views/ShoppingCartView.vue'), meta: { requiresAuth: true } },
    { path: '/wishlist', name: 'wishlist', component: () => import('../views/WishlistView.vue'), meta: { requiresAuth: true } },

    // Checkout process
    { path: '/checkoutAddress', name: 'checkoutAddress', component: () => import('../views/CheckoutAddressView.vue'), meta: { requiresAuth: true } },
    { path: '/checkoutShipping', name: 'checkoutShipping', component: () => import('../views/CheckoutShippingView.vue'), meta: { requiresAuth: true } },
    { path: '/checkoutPayment', name: 'checkoutPayment', component: () => import('../views/CheckoutPaymentView.vue'), meta: { requiresAuth: true } },

    // User account and related pages
    { path: '/users', name: 'users', component: () => import('../views/UsersView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/users/:userId/addresses', name: 'userAddresses', component: () => import('../views/UserAddressesView.vue'), meta: { requiresAuth: true } },
    { path: '/users/:userId/orders', name: 'userOrders', component: () => import('../views/UserOrdersView.vue'), meta: { requiresAuth: true } },
    { path: '/users/:userId/productReviews', name: 'userReviews', component: () => import('../views/UserReviewsView.vue'), meta: { requiresAuth: true } },
    { path: '/users/:userId/cart', name: 'userCart', component: () => import('../views/UserCartView.vue'), meta: { requiresAuth: true } },

    { path: '/account', name: 'userAccount', component: () => import('../views/UserAccountView.vue'), meta: { requiresAuth: true } },

    // Orders, payments, coupons, and shipping
    { path: '/orders', name: 'orders', component: () => import('../views/OrdersView.vue'), meta: { requiresAuth: true } },
    { path: '/payments', name: 'payments', component: () => import('../views/PaymentsView.vue'), meta: { requiresAuth: true } },
    { path: '/coupons', name: 'coupons', component: () => import('../views/CouponsView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/shipping-addresses', name: 'shippingAddresses', component: () => import('../views/ShippingAddressesView.vue'), meta: { requiresAuth: true } },


    // Authentication
    { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
    { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue') },
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
