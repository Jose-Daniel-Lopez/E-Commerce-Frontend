<template>
  <div :class="['pt-[85px] lg:pt-0 animate-fadeInUp', pageBackgroundClasses]">
    <!-- Wrapper for layout consistency and responsive padding -->
    <Wrapper class="py-4">
      <!-- Breadcrumb navigation for user orientation -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <!-- Main cart title section -->
      <section class="py-6 mx-auto mb-6 max-w-7xl">
        <h1 :class="['font-srProDisplay text-2xl font-semibold text-left', textClasses]">
          {{ $t('cart.title') }}
        </h1>
      </section>

      <!-- Cart content: items and order summary -->
      <section class="mx-auto mb-16 max-w-7xl">
        <div class="grid items-start grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- Left Panel: Cart Items List -->
          <div :class="['rounded-lg p-6 h-full', cardClasses]">
            <!-- Loading state -->
            <div v-if="userCartStore.loading" :class="['text-center', textMutedClasses]">
              {{ $t('cart.loading') }}
            </div>

            <!-- Error state -->
            <div v-else-if="userCartStore.error" class="text-center theme-error-text">
              {{ $t('cart.error') }}
            </div>

            <!-- Empty cart state -->
            <div v-else-if="!userCartStore.hasItems" :class="['text-center', textMutedClasses]">
              {{ $t('cart.empty') }}
            </div>

            <!-- Render cart items when available -->
            <div v-else class="divide-theme-border">
              <CartItem v-for="item in userCartStore.cartItems" :key="item.id" :item="item" @increment="increment"
                @decrement="decrement" @remove="remove" />
            </div>
          </div>

          <!-- Right Panel: Order Summary with pricing and checkout action -->
          <div>
            <OrderSummary :subtotal="userCartStore.totalPrice" :estimated-tax="estimatedTax"
              :estimated-shipping="estimatedShipping" :discount="discount" :is-cart-empty="!userCartStore.hasItems"
              @checkout="checkout" @apply-discount="applyDiscount" />
          </div>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
// Core dependencies
import { ref, computed, onMounted } from 'vue'

// Internationalization and routing
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// UI components
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import CartItem from '@/components/cart/CartItem.vue'
import OrderSummary from '@/components/cart/OrderSummary.vue'

// State management stores
import { useUserCartStore } from '@/stores/userCart'
import { useAuthStore } from '@/stores/auth'

// Theme classes
import { useThemeClasses } from '@/composables/useThemeClasses'

/**
 * Setup and initialization
 */
const router = useRouter()
const userCartStore = useUserCartStore()
const authStore = useAuthStore()
const { t } = useI18n()

/**
 * Theme classes for dark mode support
 */
const {
  pageBackgroundClasses,
  cardClasses,
  textClasses,
  textMutedClasses
} = useThemeClasses()

/**
 * Breadcrumb navigation: current page only (as per design)
 * Note: This could be extended dynamically if multi-step navigation is added later
 */
const breadcrumbs = [{ label: t('cart.title') }]

/**
 * Discount state: holds applied discount value in euros
 * Controlled via `applyDiscount` method
 */
const discount = ref(0)

/**
 * Computed values for order summary
 * - Tax and shipping are currently static; could be made dynamic in the future
 * - Values are in dollars to align with the rest of the application
 */
const estimatedTax = computed(() => 50.00) // $50.00
const estimatedShipping = computed(() => 29.00) // $29.00

/**
 * Lifecycle: Fetch user cart on component mount if user is authenticated
 * Ensures cart data is up-to-date when entering the page
 */
onMounted(() => {
  if (authStore.user?.id) {
    userCartStore.fetchUserCart(authStore.user.id)
  }
})

/**
 * Cart item quantity management
 * - Increment: increases item quantity by 1
 * - Decrement: decreases item quantity by 1, minimum 1
 * - Remove: removes item from cart entirely
 */
function increment(itemId: number, currentQuantity: number) {
  userCartStore.updateItemQuantity(itemId, currentQuantity + 1)
}

function decrement(itemId: number, currentQuantity: number) {
  if (currentQuantity > 1) {
    userCartStore.updateItemQuantity(itemId, currentQuantity - 1)
  }
}

function remove(itemId: number) {
  userCartStore.removeItem(itemId)
}

/**
 * Discount application logic
 * - Currently supports a single hardcoded promo code 'SAVE10'
 * - Case-insensitive and trims whitespace
 * - Sets discount to 10 euros if valid, otherwise resets to 0
 */
function applyDiscount(code: string) {
  if (code.trim().toUpperCase() === 'SAVE10') {
    discount.value = 10 // 10 euros
  } else {
    discount.value = 0
  }
}

/**
 * Navigation handler for proceeding to checkout
 * Redirects to the address input step of the checkout flow
 */
const checkout = () => {
  router.push({ name: 'checkoutAddress' })
}
</script>
