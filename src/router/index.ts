import { createRouter, createWebHistory } from 'vue-router'


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
    { path: '/cart', name: 'shoppingCart', component: () => import('../views/ShoppingCartView.vue') },
    { path: '/wishlist', name: 'wishlist', component: () => import('../views/WishlistView.vue') },

    // Checkout process
    { path: '/checkoutAddress', name: 'checkoutAddress', component: () => import('../views/CheckoutAddressView.vue') },
    { path: '/checkoutShipping', name: 'checkoutShipping', component: () => import('../views/CheckoutShippingView.vue') },
    { path: '/checkoutPayment', name: 'checkoutPayment', component: () => import('../views/CheckoutPaymentView.vue') },

    // User account and related pages
    { path: '/users', name: 'users', component: () => import('../views/UsersView.vue') },
    { path: '/users/:userId/addresses', name: 'userAddresses', component: () => import('../views/UserAddressesView.vue') },
    { path: '/users/:userId/orders', name: 'userOrders', component: () => import('../views/UserOrdersView.vue') },
    { path: '/users/:userId/productReviews', name: 'userReviews', component: () => import('../views/UserReviewsView.vue') },
    { path: '/users/:userId/cart', name: 'userCart', component: () => import('../views/UserCartView.vue') },

    { path: '/account', name: 'userAccount', component: () => import('../views/UserAccountView.vue') },

    // Orders, payments, coupons, and shipping
    { path: '/orders', name: 'orders', component: () => import('../views/OrdersView.vue') },
    { path: '/payments', name: 'payments', component: () => import('../views/PaymentsView.vue') },
    { path: '/coupons', name: 'coupons', component: () => import('../views/CouponsView.vue') },
    { path: '/shipping-addresses', name: 'shippingAddresses', component: () => import('../views/ShippingAddressesView.vue') },


    // Authentication
    { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
    { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue') },
  ],
})

export default router
