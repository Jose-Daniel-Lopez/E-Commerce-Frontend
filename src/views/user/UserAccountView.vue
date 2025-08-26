<template>
  <div class="user-account-page animate-fadeInUp user-account-layout" :class="pageBackgroundClasses">
    <!-- Debug Panel - Only shown in development -->
    <DebugPanel
      :show-debug-panel="showDebugPanel"
      :debug-data="{
        username: user?.username,
        theme: themeStore.selectedTheme,
        wishlistCount: wishlistProducts.length,
        ordersCount: orders.length,
        refundsCount: refunds.length,
        addressesCount: addresses.length,
        reviewsCount: reviews.length
      }"
      @toggle="toggleDebugPanel"
    />
    <Wrapper class="py-8">
      <!-- SEO and Accessibility improvements -->
      <div class="sr-only">
        <h1>{{ $t('account.title') }} - User Account Dashboard</h1>
        <p>Manage your profile, orders, wishlist, addresses, reviews, and account settings</p>
      </div>

      <!-- Breadcrumb Navigation -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <!-- Page Header -->
      <header class="page-header">
        <h1 :class="['page-title', textClasses]">
          {{ $t('account.title') }}
        </h1>
      </header>

      <div class="account-layout">
        <div class="account-container">
          <!-- Sidebar Navigation -->
          <aside class="sidebar-navigation" role="navigation" aria-label="Account sections">
            <AccountNavigation
              :sections="sections"
              :active-section="activeSection"
              :is-mobile-nav-open="isMobileNavOpen"
              :nav-classes="navClasses"
              :text-classes="textClasses"
              :link-classes="linkClasses"
              @toggle-mobile="toggleMobileNav"
              @close-mobile="closeMobileNav"
            />
          </aside>

          <!-- Main Content -->
          <main class="main-content">
            <!-- Profile Section -->
            <ProfileSection
              :section-id="sections[0].id"
              :user="user"
              :editable-user="editableUser"
              :is-edit-profile-open="isEditProfileOpen"
              :section-container-classes="sectionContainerClasses"
              :text-classes="textClasses"
              :section-header-classes="sectionHeaderClasses"
              :button-outline-classes="buttonOutlineClasses"
              :button-text-classes="buttonTextClasses"
              :button-primary-classes="buttonPrimaryClasses"
              :text-secondary-classes="textSecondaryClasses"
              :input-classes="inputClasses"
              @toggle-edit="toggleEditProfile"
              @refresh-profile="refreshProfile"
              @save-profile="saveProfile"
              @cancel-edit="cancelEdit"
              @open-avatar-selector="openAvatarSelector"
              @update-field="updateEditableField"
            />

            <!-- Orders Section -->
            <OrdersSection
              :section-id="sections[1].id"
              :orders="orders"
              :section-container-classes="sectionContainerClasses"
              :text-classes="textClasses"
              :section-header-classes="sectionHeaderClasses"
              :link-classes="linkClasses"
              :empty-state-icon-classes="emptyStateIconClasses"
              :empty-state-text-classes="emptyStateTextClasses"
              :list-item-classes="listItemClasses"
              :icon-container-classes="iconContainerClasses"
              :icon-in-container-classes="iconInContainerClasses"
              :text-secondary-classes="textSecondaryClasses"
              :status-badge-classes="statusBadgeClasses"
              :action-button-classes="actionButtonClasses"
              @open-details="openOrderDetailsModal"
            />

            <!-- Refunds and Returns Section -->
            <RefundsSection
              :section-id="sections[2].id"
              :refunds="refunds"
              :section-container-classes="sectionContainerClasses"
              :text-classes="textClasses"
              :section-header-classes="sectionHeaderClasses"
              :empty-state-icon-classes="emptyStateIconClasses"
              :empty-state-text-classes="emptyStateTextClasses"
              :list-item-classes="listItemClasses"
              :icon-container-classes="iconContainerClasses"
              :icon-in-container-classes="iconInContainerClasses"
              :text-secondary-classes="textSecondaryClasses"
              :status-badge-classes="statusBadgeClasses"
              :action-button-classes="actionButtonClasses"
              @open-details="openOrderDetailsModal"
            />

            <!-- Wishlist Section -->
            <WishlistSection
              :section-id="sections[3].id"
              :wishlist-products="wishlistProducts"
              :wishlist-loading="wishlistLoading"
              :wishlist-error="wishlistError"
              :cart-item-loading="cartItemLoading"
              :remove-item-loading="removeItemLoading"
              :added-to-cart-items="addedToCartItems"
              :section-container-classes="sectionContainerClasses"
              :text-classes="textClasses"
              :section-header-classes="sectionHeaderClasses"
              :link-classes="linkClasses"
              :empty-state-icon-classes="emptyStateIconClasses"
              :empty-state-text-classes="emptyStateTextClasses"
              :list-item-classes="listItemClasses"
              :price-text-classes="priceTextClasses"
              @add-to-cart="addToCartFromWishlist"
              @remove-from-wishlist="removeFromWishlist"
            />

            <!-- Addresses Section -->
            <AddressesSection
              :section-id="sections[4].id"
              :user-id="authStore.user?.id || 0"
              :section-container-classes="sectionContainerClasses"
              :text-classes="textClasses"
              :section-header-classes="sectionHeaderClasses"
              :button-outline-classes="buttonOutlineClasses"
              :button-text-classes="buttonTextClasses"
              :button-primary-classes="buttonPrimaryClasses"
              :loading-text-classes="loadingTextClasses"
              :empty-state-icon-classes="emptyStateIconClasses"
              :empty-state-text-classes="emptyStateTextClasses"
              :list-item-classes="listItemClasses"
              :icon-color-classes="iconColorClasses"
              :interactive-icon-classes="interactiveIconClasses"
              :text-secondary-classes="textSecondaryClasses"
              @refresh-addresses="refreshAddresses"
            />

            <!-- Reviews Section -->
            <ReviewsSection
              :section-id="sections[5].id"
              :reviews="reviews"
              :reviews-loading="reviewsLoading"
              :reviews-error="reviewsError"
              :section-container-classes="sectionContainerClasses"
              :text-classes="textClasses"
              :section-header-classes="sectionHeaderClasses"
              :text-secondary-classes="textSecondaryClasses"
              :loading-text-classes="loadingTextClasses"
              :empty-state-icon-classes="emptyStateIconClasses"
              :empty-state-text-classes="emptyStateTextClasses"
              :review-card-classes="reviewCardClasses"
              :review-header-classes="reviewHeaderClasses"
              :review-meta-classes="reviewMetaClasses"
              :review-body-classes="reviewBodyClasses"
            />

            <!-- Settings Section -->
            <SettingsSection
              :section-id="sections[6].id"
              :current-locale="currentLocale"
              :available-locales="availableLocales"
              :selected-theme="themeStore.selectedTheme"
              :effective-theme="themeStore.effectiveTheme"
              :section-container-classes="sectionContainerClasses"
              :text-classes="textClasses"
              :section-header-classes="sectionHeaderClasses"
              :text-secondary-classes="textSecondaryClasses"
              :review-content-classes="reviewContentClasses"
              :icon-container-classes="iconContainerClasses"
              :icon-in-container-classes="iconInContainerClasses"
              :theme-button-base-classes="themeButtonBaseClasses"
              :theme-button-active-classes="themeButtonActiveClasses"
              :theme-button-inactive-classes="themeButtonInactiveClasses"
              :button-outline-classes="buttonOutlineClasses"
              :button-text-classes="buttonTextClasses"
              @language-change="handleLanguageChange"
              @theme-change="setTheme"
              @open-change-password="openChangePasswordModal"
            />
          </main>
        </div>
      </div>
    </Wrapper>

    <!-- Order Details Modal -->
    <OrderDetailsModal
      :is-open="isOrderDetailsModalOpen"
      :order="selectedOrder"
      @close="closeOrderDetailsModal"
    />

    <!-- Avatar Selector Modal -->
    <AvatarSelector
      v-if="isAvatarSelectorOpen"
      :current-avatar="authStore.user?.avatar || ''"
      :user-name="authStore.user?.username || ''"
      :user-id="authStore.user?.id || 0"
      @close="closeAvatarSelector"
      @save="saveAvatar"
    />

    <!-- Change Password Modal -->
    <ChangePasswordModal
      v-if="isChangePasswordModalOpen"
      :is-open="isChangePasswordModalOpen"
      @close="closeChangePasswordModal"
      @success="onPasswordChangeSuccess"
    />
  </div>
</template>

<!-- Script section -->
<script setup lang="ts">
/**
 * UserAccountView - Optimized according to Style Optimization Guide
 *
 * Key optimizations implemented:
 * ✅ Global theme-aware styles moved to base.css utilities
 * ✅ Component-specific styles kept in this file
 * ✅ Uses useThemeClasses composable for consistent theming
 * ✅ Performance optimized with hardware acceleration
 * ✅ Semantic class names for maintainability
 * ✅ Smooth theme transitions via CSS variables
 */
import '@/assets/base.css'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { useLanguage } from '@/composables/useLanguage'
import { useToast } from '@/composables/useToast'
import { useThemeClasses } from '@/composables/useThemeClasses'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'

// Lazy load heavy components for better performance
import { defineAsyncComponent } from 'vue'
const OrderDetailsModal = defineAsyncComponent(() => import('@/components/orders/OrderDetailsModal.vue'))
const AvatarSelector = defineAsyncComponent(() => import('@/components/users/AvatarSelector.vue'))
const ChangePasswordModal = defineAsyncComponent(() => import('@/components/users/ChangePasswordModal.vue'))

// Import new refactored components
import DebugPanel from '@/components/user/DebugPanel.vue'
import AccountNavigation from '@/components/user/AccountNavigation.vue'
import ProfileSection from '@/components/user/ProfileSection.vue'
import OrdersSection from '@/components/user/OrdersSection.vue'
import RefundsSection from '@/components/user/RefundsSection.vue'
import WishlistSection from '@/components/user/WishlistSection.vue'
import AddressesSection from '@/components/user/AddressesSection.vue'
import ReviewsSection from '@/components/user/ReviewsSection.vue'
import SettingsSection from '@/components/user/SettingsSection.vue'

import axios from '@/lib/axios'
import type { ShippingAddress } from '@/types/shippingAddress'

// Performance optimizations
const showDebug = ref(import.meta.env.DEV) // Debug toggle state - show by default in dev mode
const showDebugPanel = computed(() => import.meta.env.DEV && showDebug.value) // Only show in dev mode

// Language composable for global language sync
const { currentLocale, availableLocales, changeLanguage } = useLanguage()

// Toast notifications
const toast = useToast()

// Theme classes composable for consistent styling
// Destructuring only required classes for optimal performance
const {
  pageBackgroundClasses,
  textClasses,
  navClasses,
  buttonPrimaryClasses,
  buttonOutlineClasses,
  buttonTextClasses,
  inputClasses,
  linkClasses,
  themeButtonBaseClasses,
  themeButtonActiveClasses,
  themeButtonInactiveClasses,
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
  textSecondaryClasses
} = useThemeClasses()

const { t } = useI18n()
const authStore = useAuthStore()
const usersStore = useUsersStore()

// Memoized breadcrumbs
const breadcrumbs = computed(() => [
  { label: t('breadcrumbs.home'), to: '/' },
  { label: t('breadcrumbs.account'), to: '/account' },
])

// Memoized sections with performance optimization
const sections = computed(() => [
  { id: 'profile', label: t('account.profile.title'), icon: 'fa-user-circle' },
  { id: 'orders', label: t('account.orders.title'), icon: 'hi-clipboard-list' },
  { id: 'refunds', label: t('account.refunds.title'), icon: 'hi-arrow-left' },
  { id: 'wishlist', label: t('account.wishlist.title'), icon: 'hi-heart' },
  { id: 'addresses', label: t('account.addresses.title'), icon: 'hi-location-marker' },
  { id: 'reviews', label: t('account.reviews.title'), icon: 'bi-star-fill' },
  { id: 'settings', label: t('account.settings.title'), icon: 'hi-adjustments' },
])

// User state with performance optimization
const user = computed(() => (authStore.user ?? {}) as User)

// Orders state - lazy loaded imports for better performance
import { useOrdersStore } from '@/stores/orders'
import { useWishlistStore } from '@/stores/wishlist'
import { useUserCartStore } from '@/stores/userCart'
import { useProductVariantsStore } from '@/stores/productVariants'
import { useThemeStore } from '@/stores/theme'

const ordersStore = useOrdersStore()
const themeStore = useThemeStore()
const { wishlistProducts, wishlistLoading, wishlistError, fetchUserWishlist } = useWishlistStore()
const userCartStore = useUserCartStore()
const productVariantsStore = useProductVariantsStore()

// Reactive reference to orders from the store (excluding RETURNED and REFUNDED orders)
const orders = computed(() =>
  ordersStore.orders
    .filter(order => order.status !== 'RETURNED' && order.status !== 'REFUNDED')
    .map(order => {
      // Format the status for display
      const displayStatus = order.status === 'CREATED' ? 'Created' :
                           order.status === 'PAID' ? 'Paid' :
                           order.status === 'SHIPPED' ? 'Shipped' :
                           order.status === 'DELIVERED' ? 'Delivered' :
                           order.status === 'CANCELED' ? 'Cancelled' :
                           order.status

      // Calculate expected delivery (7 days from order date)
      const orderDate = new Date(order.orderDate)
      const expectedDelivery = new Date(orderDate.getTime() + (7 * 24 * 60 * 60 * 1000))

      return {
        id: order.id.toString(),
        date: new Date(order.orderDate).toISOString().split('T')[0],
        status: displayStatus,
        expectedDelivery: expectedDelivery.toISOString().split('T')[0],
        items: order.orderItems?.map(item => ({
          id: item.id,
          name: item.product?.name || 'Product',
          description: item.product?.description || '',
          image: 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp', // Placeholder; will be loaded in detail view
          price: item.unitPrice,
          quantity: item.quantity,
        })) || [],
        subtotal: order.orderItems?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || order.totalAmount,
        shipping: 0, // Will be calculated in detail view if needed
        tax: 0, // Will be calculated in detail view if needed
        discount: order.hasDiscount ? (order.totalAmount * 0.1) : 0, // Assuming 10% if hasDiscount is true
        total: order.totalAmount,
        shippingAddress: {
          name: user.value?.username || 'N/A',
          street: 'Will be loaded...',
          city: 'N/A',
          state: 'N/A',
          zipCode: 'N/A',
          country: 'N/A'
        },
        billingAddress: {
          name: user.value?.username || 'N/A',
          street: 'Will be loaded...',
          city: 'N/A',
          state: 'N/A',
          zipCode: 'N/A',
          country: 'N/A'
        },
        paymentMethod: {
          type: order.payment?.paymentMethod || 'Credit Card',
          lastFour: '****'
        },
        paymentStatus: order.payment?.paymentStatus || (order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'Paid' : 'Pending'),
        trackingNumber: `TN${order.id}`,
        carrier: 'Standard Shipping'
      }
    })
)

// Refunds state - computed from orders with RETURNED and REFUNDED status
const refunds = computed(() =>
  ordersStore.returnsAndRefunds.map(order => {
    // Calculate expected delivery (7 days from order date)
    const orderDate = new Date(order.orderDate)
    const expectedDelivery = new Date(orderDate.getTime() + (7 * 24 * 60 * 60 * 1000))

    return {
      id: order.id.toString(),
      date: new Date(order.orderDate).toISOString().split('T')[0],
      status: order.status === 'RETURNED' ? 'Returned' : 'Refunded',
      expectedDelivery: expectedDelivery.toISOString().split('T')[0],
      items: order.orderItems?.map(item => ({
        id: item.id,
        name: item.product?.name || 'Product',
        description: item.product?.description || '',
        image: 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
        price: item.unitPrice,
        quantity: item.quantity,
      })) || [],
      subtotal: order.orderItems?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || order.totalAmount,
      shipping: 0,
      tax: 0,
      discount: order.hasDiscount ? (order.totalAmount * 0.1) : 0,
      total: order.totalAmount,
      shippingAddress: {
        name: user.value?.username || 'N/A',
        street: 'Will be loaded...',
        city: 'N/A',
        state: 'N/A',
        zipCode: 'N/A',
        country: 'N/A'
      },
      billingAddress: {
        name: user.value?.username || 'N/A',
        street: 'Will be loaded...',
        city: 'N/A',
        state: 'N/A',
        zipCode: 'N/A',
        country: 'N/A'
      },
      paymentMethod: {
        type: order.payment?.paymentMethod || 'Credit Card',
        lastFour: '****'
      },
      paymentStatus: order.payment?.paymentStatus || 'Refunded',
      trackingNumber: `TN${order.id}`,
      carrier: 'Standard Shipping'
    }
  })
)

const addresses = computed(() => usersStore.userAddresses)

interface Review {
  id: number
  product: string
  rating: number
  comment: string
  date: string
}
const reviews = ref<Review[]>([])
const reviewsLoading = ref(false)
const reviewsError = ref('')

const fetchUserReviews = async (userId: number) => {
  reviewsLoading.value = true
  reviewsError.value = ''
  try {
    const res = await axios.get(`/users/${userId}/productReviews`)
    const rawReviews = res.data._embedded?.productReviews || []
    const reviewPromises = rawReviews.map(async (review: { id: number; rating: number; comment: string; createdAt: string; _links: { product: { href: string } } }) => {
      let productName = ''
      try {
        const productRes = await axios.get(review._links.product.href)
        productName = productRes.data.name
      } catch {
        productName = 'Unknown Product'
      }
      return {
        id: review.id,
        product: productName,
        rating: review.rating,
        comment: review.comment,
        date: new Date(review.createdAt).toLocaleDateString(),
      }
    })
    reviews.value = await Promise.all(reviewPromises)
  } catch (err: unknown) {
    reviewsError.value = (err as Error)?.message || 'Failed to load reviews.'
    toast.error('Failed to load your reviews', {
      title: 'Loading Error',
      duration: 4000
    })
  } finally {
    reviewsLoading.value = false
  }
}

// Logic for the Edit Profile inline form
const isEditProfileOpen = ref(false)
const editableUser = ref({
  name: '',
  email: '',
  location: '', // Keep for form compatibility
  avatar: '',
  role: '',
  isVerified: false,
})

const toggleEditProfile = () => {
  isEditProfileOpen.value = !isEditProfileOpen.value
  if (isEditProfileOpen.value) {
    // Copy current data for editing (using authStore.user since it has the properties we need)
    editableUser.value = {
      name: authStore.user?.username || '',
      email: authStore.user?.email || '',
      location: authStore.user?.location || '',
      avatar: authStore.user?.avatar || '',
      role: authStore.user?.role || '',
      isVerified: authStore.user?.isVerified || false,
    }
  }
}

const cancelEdit = () => {
  isEditProfileOpen.value = false
  // Restore original data using authStore.user properties
  editableUser.value = {
    name: authStore.user?.username || '',
    email: authStore.user?.email || '',
    location: authStore.user?.location || '',
    avatar: authStore.user?.avatar || '',
    role: authStore.user?.role || '',
    isVerified: authStore.user?.isVerified || false,
  }
}

const updateEditableField = (field: string, value: string) => {
  switch (field) {
    case 'name':
      editableUser.value.name = value
      break
    case 'location':
      editableUser.value.location = value
      break
    case 'avatar':
      editableUser.value.avatar = value
      break
    default:
      console.warn(`Unknown field: ${field}`)
  }
}

const saveProfile = async () => {
  try {
    // Save changes using the store
    if (authStore.user) {
      const result = await authStore.updateUserProfile({
        username: editableUser.value.name,
        avatar: editableUser.value.avatar,
        location: editableUser.value.location,
      })

      if (result.success) {
        toast.success('Profile updated successfully!', {
          title: 'Profile Saved',
          duration: 3000
        })
        isEditProfileOpen.value = false
      } else {
        toast.error(result.error || 'Failed to update profile', {
          title: 'Update Failed',
          duration: 4000
        })
      }
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    toast.error('An unexpected error occurred while updating your profile', {
      title: 'Update Error',
      duration: 4000
    })
  }
}

// State for user settings
// const theme = ref('system') // Replaced by themeStore

// Logic for mobile navigation.
const isMobileNavOpen = ref(false)

// Order Details Modal state
const isOrderDetailsModalOpen = ref(false)
const isAvatarSelectorOpen = ref(false)
const isChangePasswordModalOpen = ref(false)
const selectedOrder = ref<OrderType>({
  id: '',
  date: '',
  status: '',
  expectedDelivery: '',
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  discount: 0,
  total: 0,
  shippingAddress: {
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  billingAddress: {
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  paymentMethod: {
    type: '',
    lastFour: '',
  },
  paymentStatus: '',
  trackingNumber: '',
  carrier: '',
})

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value
  // Prevent body from scrolling when the mobile navigation is open.
  if (isMobileNavOpen.value) {
    document.body.classList.add('nav-open')
  } else {
    document.body.classList.remove('nav-open')
  }
}

const closeMobileNav = () => {
  isMobileNavOpen.value = false
  document.body.classList.remove('nav-open')
}

const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
  themeStore.setTheme(newTheme)
}

// Language change wrapper with toast
const handleLanguageChange = (newLocale: string) => {
  changeLanguage(newLocale)
}

const activeSection = ref('profile')

// Order Details Modal Methods
interface OrderItem {
  id: number
  name: string
  description: string
  image: string
  price: number
  quantity: number
}

interface Address {
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentMethod {
  type: string
  lastFour: string
}

interface OrderType {
  id: string
  date: string
  status: string
  expectedDelivery: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  paymentStatus: string
  trackingNumber?: string
  carrier?: string
}

// Backend API interfaces
interface BackendOrderItem {
  id: number
  quantity: number
  unitPrice: number
  _links: {
    self: { href: string }
    orderItem: { href: string }
    order: { href: string }
    productVariant: { href: string }
  }
}

const openOrderDetailsModal = async (order: OrderType) => {
  try {
    // Show loading state while fetching detailed order data
    const loadingOrder: OrderType = {
      ...order,
      items: [],
      shippingAddress: {
        name: 'Loading...',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      billingAddress: {
        name: 'Loading...',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      }
    }
    selectedOrder.value = loadingOrder
    isOrderDetailsModalOpen.value = true
    document.body.style.overflow = 'hidden'

    // Fetch detailed order information
    const detailedOrder = await fetchDetailedOrderInfo(parseInt(order.id))
    selectedOrder.value = detailedOrder
  } catch (error) {
    console.error('Error fetching order details:', error)
    toast.error('Failed to load order details', {
      title: 'Loading Error',
      duration: 4000
    })
    closeOrderDetailsModal()
  }
}

const closeOrderDetailsModal = () => {
  isOrderDetailsModalOpen.value = false
  selectedOrder.value = {
    id: '',
    date: '',
    status: '',
    expectedDelivery: '',
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
    shippingAddress: {
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    billingAddress: {
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    paymentMethod: {
      type: '',
      lastFour: '',
    },
    paymentStatus: '',
    trackingNumber: '',
    carrier: '',
  }
  // Restore body scrolling
  document.body.style.overflow = 'auto'
}

// Avatar Selector Modal Methods
const openAvatarSelector = () => {
  isAvatarSelectorOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeAvatarSelector = () => {
  isAvatarSelectorOpen.value = false
  document.body.style.overflow = 'auto'
}

// Change Password Modal Methods
const openChangePasswordModal = () => {
  isChangePasswordModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeChangePasswordModal = () => {
  isChangePasswordModalOpen.value = false
  document.body.style.overflow = 'auto'
}

const onPasswordChangeSuccess = () => {
  toast.success('Password changed successfully!', {
    title: 'Security Update',
    duration: 3000
  })
  console.log('Password changed successfully!')
}

const saveAvatar = async (avatarUrl: string) => {
  try {
    // Update the user's avatar in the auth store
    if (authStore.user) {
      console.log('Saving avatar:', avatarUrl)
      console.log('Current user before update:', authStore.user)
      console.log('LocalStorage before update:', localStorage.getItem('user'))

      const result = await authStore.updateUserProfile({
        username: authStore.user.username,
        avatar: avatarUrl,
        location: authStore.user.location || ''
      })

      console.log('Update result:', result)

      if (result.success) {
        // Fetch fresh user data from server to ensure we have the latest
        await authStore.fetchCurrentUser()
        console.log('Current user after refresh:', authStore.user)
        console.log('LocalStorage after update:', localStorage.getItem('user'))

        // Update the editable user if edit mode is open
        if (isEditProfileOpen.value) {
          editableUser.value.avatar = avatarUrl
        }

        // Close the modal
        closeAvatarSelector()

        // Show success toast
        toast.success('Profile picture updated successfully!', {
          title: 'Avatar Saved',
          duration: 3000
        })
      } else {
        console.error('Failed to update avatar:', result.error)
        toast.error(result.error || 'Failed to update profile picture', {
          title: 'Update Failed',
          duration: 4000
        })
      }
    }
  } catch (error) {
    console.error('Error saving avatar:', error)
    toast.error('An unexpected error occurred while updating your profile picture', {
      title: 'Update Error',
      duration: 4000
    })
  }
}

// Fetch detailed order information from backend
const fetchDetailedOrderInfo = async (orderId: number): Promise<OrderType> => {
  try {
    // 1. Fetch basic order info
    const orderResponse = await axios.get(`/orders/${orderId}`)
    const orderData = orderResponse.data

    // 2. Fetch order items
    const orderItemsResponse = await axios.get(`/orders/${orderId}/orderItems`)
    const orderItems = orderItemsResponse.data._embedded?.orderItems || []

    // 3. Fetch shipping address
    const shippingAddressResponse = await axios.get(`/orders/${orderId}/shippingAddress`)
    const shippingAddressData = shippingAddressResponse.data

    // 4. Fetch detailed product information for each order item
    const detailedItems: OrderItem[] = await Promise.all(
      orderItems.map(async (item: BackendOrderItem) => {
        try {
          // Fetch product variant details
          const variantResponse = await axios.get(item._links.productVariant.href)
          const variantData = variantResponse.data

          // Fetch product details
          const productResponse = await axios.get(variantData._links.product.href)
          const productData = productResponse.data

          return {
            id: item.id,
            name: productData.name,
            description: productData.description || '',
            image: productData.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
            price: item.unitPrice,
            quantity: item.quantity,
          }
        } catch (error) {
          console.error(`Error fetching product details for item ${item.id}:`, error)
          return {
            id: item.id,
            name: 'Unknown Product',
            description: '',
            image: 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
            price: item.unitPrice,
            quantity: item.quantity,
          }
        }
      })
    )

    // 5. Calculate totals
    const subtotal = detailedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = 0 // You can enhance this if shipping cost is available
    const tax = 0 // You can enhance this if tax is available
    const discount = orderData.hasDiscount ? (subtotal * 0.1) : 0 // Assuming 10% discount if hasDiscount is true
    const total = orderData.totalAmount

    // 6. Determine expected delivery date
    const orderDate = new Date(orderData.orderDate)
    const expectedDelivery = new Date(orderDate.getTime() + (7 * 24 * 60 * 60 * 1000)) // 7 days from order date

    // 7. Build the complete order object
    const detailedOrder: OrderType = {
      id: orderId.toString(),
      date: new Date(orderData.orderDate).toISOString().split('T')[0],
      status: orderData.status === 'CREATED' ? 'Created' :
              orderData.status === 'PAID' ? 'Paid' :
              orderData.status === 'SHIPPED' ? 'Shipped' :
              orderData.status === 'DELIVERED' ? 'Delivered' :
              orderData.status === 'CANCELED' ? 'Cancelled' :
              orderData.status,
      expectedDelivery: expectedDelivery.toISOString().split('T')[0],
      items: detailedItems,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      shippingAddress: {
        name: shippingAddressData.user?.displayName || shippingAddressData.user?.username || 'N/A',
        street: shippingAddressData.street || 'N/A',
        city: shippingAddressData.city || 'N/A',
        state: shippingAddressData.state || 'N/A',
        zipCode: shippingAddressData.zipCode || 'N/A',
        country: shippingAddressData.country || 'N/A'
      },
      billingAddress: {
        // Using shipping address as billing address for now
        name: shippingAddressData.user?.displayName || shippingAddressData.user?.username || 'N/A',
        street: shippingAddressData.street || 'N/A',
        city: shippingAddressData.city || 'N/A',
        state: shippingAddressData.state || 'N/A',
        zipCode: shippingAddressData.zipCode || 'N/A',
        country: shippingAddressData.country || 'N/A'
      },
      paymentMethod: {
        type: 'Credit Card', // Default for now, you can enhance this
        lastFour: '****' // You can enhance this when payment details are available
      },
      paymentStatus: orderData.status === 'PAID' || orderData.status === 'SHIPPED' || orderData.status === 'DELIVERED' ? 'Paid' : 'Pending',
      trackingNumber: `TN${orderId}`,
      carrier: 'Standard Shipping'
    }

    return detailedOrder
  } catch (error) {
    console.error('Error fetching detailed order info:', error)
    throw new Error('Failed to fetch order details')
  }
}

// Debug panel toggle function
const toggleDebugPanel = () => {
  showDebug.value = !showDebug.value
  console.log(`🛠️ Debug panel ${showDebug.value ? 'enabled' : 'disabled'}`)
}

// Keyboard shortcut handler for debug panel
const handleDebugKeyboard = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'd' && import.meta.env.DEV) {
    event.preventDefault()
    toggleDebugPanel()
  }
}

onMounted(async () => {
  // Theme initialization is now handled by the store in main.ts

  // Add keyboard shortcut for debug panel (Ctrl+D or Cmd+D)
  if (import.meta.env.DEV) {
    document.addEventListener('keydown', handleDebugKeyboard)
  }

  // Performance optimization: Load critical data first, then lazy load other sections
  if (authStore.isAuthenticated && authStore.user?.id) {
    try {
      // Priority 1: Load user profile data first (most important)
      await authStore.fetchCurrentUser()

      // Priority 2: Load user details and addresses
      const userPromise = usersStore.fetchUserById(authStore.user.id)

      // Wait for user data before loading addresses
      await userPromise

      // Priority 3: Load secondary data in parallel with lower priority
      const secondaryDataPromises = []

      if (usersStore.selectedUser) {
        secondaryDataPromises.push(usersStore.fetchUserAddresses(usersStore.selectedUser))
      }

      // Lazy load orders, wishlist, and reviews with staggered timing to reduce initial load
      setTimeout(() => {
        if (authStore.user?.id) {
          ordersStore.fetchOrdersByUser(authStore.user.id)
        }
      }, 500)

      setTimeout(() => {
        if (authStore.user?.id) {
          fetchUserWishlist(authStore.user.id)
        }
      }, 1000)

      setTimeout(() => {
        if (authStore.user?.id) {
          fetchUserReviews(authStore.user.id)
        }
      }, 1500)

      // Initialize cart after other critical operations
      setTimeout(async () => {
        if (authStore.user?.id) {
          console.log('🟣 [USER ACCOUNT] Initializing cart for user:', authStore.user.id)
          await userCartStore.fetchUserCart(authStore.user.id)
          checkWishlistProductsInCart()
        }
      }, 2000)

      // Wait for secondary data
      await Promise.allSettled(secondaryDataPromises)

    } catch (error) {
      console.error('Error loading account data:', error)
      toast.error('Some account data could not be loaded', {
        title: 'Loading Error',
        duration: 4000
      })
    }
  }

  // Set up intersection observer for navigation (low priority)
  setTimeout(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id
          }
        })
      },
      { threshold: 0.5 },
    )

    sections.value.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })
  }, 100)
})

// Watch for changes in wishlist and re-check cart status
watch(() => wishlistProducts.value, () => {
  checkWishlistProductsInCart()
}, { deep: true })

// Clean up side effects when the component is unmounted.
onUnmounted(() => {
  document.body.classList.remove('nav-open')
  // Restore body scrolling in case modal was open
  document.body.style.overflow = 'auto'

  // Remove keyboard event listener for debug panel
  if (import.meta.env.DEV) {
    document.removeEventListener('keydown', handleDebugKeyboard)
  }
})

const refreshProfile = async () => {
  try {
    await authStore.fetchCurrentUser()
    // También refrescar las direcciones
    if (authStore.user?.id) {
      await usersStore.fetchUserById(authStore.user.id)
      if (usersStore.selectedUser) {
        await usersStore.fetchUserAddresses(usersStore.selectedUser)
      }
    }

    toast.success('Profile data refreshed!', {
      duration: 2500
    })
  } catch (error) {
    console.error('Error al refrescar perfil:', error)
    toast.error('Failed to refresh profile data', {
      title: 'Refresh Failed',
      duration: 4000
    })
  }
}

const refreshAddresses = async () => {
  try {
    if (authStore.user?.id) {
      await usersStore.fetchUserById(authStore.user.id)
      if (usersStore.selectedUser) {
        await usersStore.fetchUserAddresses(usersStore.selectedUser)
      }
    }

    toast.success('Addresses refreshed!', {
      duration: 2500
    })
  } catch (error) {
    console.error('Error al refrescar direcciones:', error)
    toast.error('Failed to refresh addresses', {
      title: 'Refresh Failed',
      duration: 4000
    })
  }
}

// ===========================
// Address Management
// ===========================

const handleCreateAddress = () => {
  // TODO: Implement address creation modal or navigation
  toast.info('Create address functionality coming soon!', {
    duration: 3000
  })
}

const handleEditAddress = (address: any) => {
  // TODO: Implement address editing modal or navigation
  console.log('Edit address:', address)
  toast.info('Edit address functionality coming soon!', {
    duration: 3000
  })
}

const handleAddressDeleted = (addressId: number) => {
  toast.success(`Address ${addressId} deleted successfully!`, {
    duration: 2500
  })
}

// ===========================
// �🛒 Cart Functionality
// ===========================

// Loading states for cart operations
const cartItemLoading = ref<{ [key: number]: boolean }>({})
const removeItemLoading = ref<{ [key: number]: boolean }>({})
const addedToCartItems = ref<{ [key: number]: boolean }>({})

/**
 * Check which wishlist products are already in the user's cart
 * and mark them as "Added to Cart" to maintain state across page refreshes
 */
const checkWishlistProductsInCart = async () => {
  if (!userCartStore.cart || !wishlistProducts.value.length) {
    return
  }

  try {
    // Get all product IDs from cart items
    const cartProductIds = new Set<number>()

    for (const cartItem of userCartStore.cart.cartItems || []) {
      if (cartItem.productVariant?._links?.product?.href) {
        // Extract product ID from the product link
        const productUrl = cartItem.productVariant._links.product.href
        const productId = parseInt(productUrl.split('/').pop() || '0')
        if (productId) {
          cartProductIds.add(productId)
        }
      }
    }

    // Mark wishlist products that are in cart as "added"
    wishlistProducts.value.forEach(wishlistProduct => {
      if (cartProductIds.has(wishlistProduct.id)) {
        addedToCartItems.value[wishlistProduct.id] = true
      }
    })

    console.log('🟣 [USER ACCOUNT] Cart check complete. Products in cart:', Array.from(cartProductIds))
  } catch (error) {
    console.error('🔴 [USER ACCOUNT] Error checking cart products:', error)
  }
}

const addToCartFromWishlist = async (productId: number, productName: string) => {
  console.log('🟡 [USER ACCOUNT] Add to Cart clicked for product:', productId)

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    toast.error('Please log in to add products to your cart', {
      title: 'Authentication Required',
      duration: 4000
    })
    return
  }

  // Set loading state for this specific product
  cartItemLoading.value[productId] = true

  try {
    // Step 1: Fetch product variants to get a valid productVariantId
    await productVariantsStore.fetchVariantsByProduct(productId)

    if (productVariantsStore.variants.length === 0) {
      toast.error('This product has no available variants. Please contact support.', {
        title: 'Product Not Available',
        duration: 4000
      })
      return
    }

    // Step 2: Use the first available variant or find one with stock
    const availableVariant = productVariantsStore.variants.find(variant => variant.stock > 0) || productVariantsStore.variants[0]

    if (!availableVariant) {
      toast.error('This product is currently out of stock', {
        title: 'Out of Stock',
        duration: 4000
      })
      return
    }

    // Step 3: Ensure cart is loaded
    if (!userCartStore.cart && authStore.user?.id) {
      console.log('🟡 [USER ACCOUNT] Loading user cart first...')
      await userCartStore.fetchUserCart(authStore.user.id)
    }

    // Step 4: Add product to cart using the variant ID
    const result = await userCartStore.addProductToCart(availableVariant.id)

    if (result.success) {
      console.log('🟢 [USER ACCOUNT] Product added to cart successfully')

      // Mark product as added to cart (permanent until page refresh)
      addedToCartItems.value[productId] = true

      // Refresh cart state to ensure consistency
      setTimeout(() => {
        checkWishlistProductsInCart()
      }, 500)

      toast.success(`${productName} added to your cart!`, {
        title: 'Added to Cart',
        duration: 3000
      })
    } else {
      console.error('🔴 [USER ACCOUNT] Failed to add to cart:', result.error)
      toast.error(result.error || 'Failed to add product to cart', {
        title: 'Cart Error',
        duration: 4000
      })
    }
  } catch (error) {
    console.error('🔴 [USER ACCOUNT] Error adding to cart:', error)
    toast.error('An unexpected error occurred while adding to cart', {
      title: 'Cart Error',
      duration: 4000
    })
  } finally {
    cartItemLoading.value[productId] = false
  }
}

const removeFromWishlist = async (productId: number, productName: string) => {
  console.log('🟡 [USER ACCOUNT] Remove from Wishlist clicked for product:', productId)

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    toast.error('Please log in to manage your wishlist', {
      title: 'Authentication Required',
      duration: 4000
    })
    return
  }

  // Set loading state for this specific product
  removeItemLoading.value[productId] = true

  try {
    // For now, we'll just remove from the local array since the backend method isn't available
    // In a real implementation, you'd call an API to remove the item from the wishlist

    // Remove from local wishlist array
    const index = wishlistProducts.value.findIndex(item => item.id === productId)
    if (index > -1) {
      wishlistProducts.value.splice(index, 1)
      toast.success(`${productName} removed from your wishlist`, {
        title: 'Removed from Wishlist',
        duration: 3000
      })
    } else {
      toast.error('Product not found in wishlist', {
        title: 'Remove Failed',
        duration: 4000
      })
    }
  } catch (error) {
    console.error('🔴 [USER ACCOUNT] Error removing from wishlist:', error)
    toast.error('An unexpected error occurred while removing from wishlist', {
      title: 'Wishlist Error',
      duration: 4000
    })
  } finally {
    removeItemLoading.value[productId] = false
  }
}
</script>

<style scoped>
/* =================================
   UserAccountView Component Styles
   Only component-specific styles here
   ================================= */

/* Main page container */
.user-account-page {
  padding-top: 85px; /* Mobile header offset */
}

@media (min-width: 1024px) {
  .user-account-page {
    padding-top: 0; /* Remove mobile padding on desktop */
  }
}

/* Page layout structure */
.page-header {
  margin: 0 auto 2rem auto;
  max-width: 80rem; /* 7xl equivalent */
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: left;
  font-family: var(--font-sr-pro-display, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
}

.account-layout {
  margin: 0 auto;
  max-width: 80rem; /* 7xl equivalent */
}

.account-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .account-container {
    flex-direction: row;
  }
}

/* Sidebar navigation */
.sidebar-navigation {
  align-self: flex-start;
  width: 100%;
  margin-bottom: 1rem;
}

@media (min-width: 1024px) {
  .sidebar-navigation {
    width: 25%; /* 1/4 equivalent */
    margin-bottom: 0;
  }
}

/* Main content area */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .main-content {
    margin-left: 0;
  }
}

/* Performance optimizations for component-specific interactions */
.animate-spin {
  transform: translateZ(0); /* Hardware acceleration */
}

/* Hover performance optimization */
.group:hover .group-hover\:opacity-100 {
  will-change: opacity;
}

/* Accessibility focus states */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Legacy debug transitions - keep for compatibility */
.fade-debug-enter-active,
.fade-debug-leave-active {
  transition: opacity 0.15s ease-out;
}

.fade-debug-enter-from,
.fade-debug-leave-to {
  opacity: 0;
}
</style>
