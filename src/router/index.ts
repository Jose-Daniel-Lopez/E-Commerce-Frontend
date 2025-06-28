import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
    },
    {
      path: '/users/:userId/addresses',
      name: 'userAddresses',
      component: () => import('../views/UserAddressesView.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
    },
    {
      path: '/products/:productId',
      name: 'productDetails',
      component: () => import('../views/ProductDetailsView.vue'),
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoriesView.vue'),
    },
    {
      path: '/categories/:categoryId/products',
      name: 'categoryProducts',
      component: () => import('../views/CategoryProductsView.vue'),
    },
    {
      path: '/users/:userId/productReviews',
      name: 'userReviews',
      component: () => import('../views/UserReviewsView.vue'),
    },
    {
      path: '/users/:userId/cart',
      name: 'userCart',
      component: () => import('../views/UserCartView.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
    },
    {
      path: '/coupons',
      name: 'coupons',
      component: () => import('../views/CouponsView.vue'),
    },
    {
      path: '/payments',
      name: 'payments',
      component: () => import('../views/PaymentsView.vue'),
    },
    {
      path: '/shipping-addresses',
      name: 'shippingAddresses',
      component: () => import('../views/ShippingAddressesView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
    }
  ],
})

export default router
