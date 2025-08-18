<template>
  <div class="pt-[85px] lg:pt-0 bg-background text-foreground animate-fadeInUp">
    <!-- Wrapper for layout consistency and responsive padding -->
    <Wrapper class="py-4">
      <!-- Breadcrumb navigation for user orientation -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <!-- Main cart title section -->
      <section class="max-w-7xl mx-auto py-6 mb-6">
        <h1 class="font-srProDisplay text-2xl font-semibold text-left text-black">
          {{ $t('cart.title') }}
        </h1>
      </section>

      <!-- Cart content: items and order summary -->
      <section class="max-w-7xl mx-auto mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <!-- Left Panel: Cart Items List -->
          <div class="bg-white rounded-lg p-6 h-full">
            <!-- Loading state -->
            <div v-if="userCartStore.loading" class="text-center text-[#666666]">
              {{ $t('cart.loading') }}
            </div>

            <!-- Error state -->
            <div v-else-if="userCartStore.error" class="text-center text-red-600">
              {{ $t('cart.error') }}
            </div>

            <!-- Empty cart state -->
            <div v-else-if="!userCartStore.hasItems" class="text-center text-[#666666]">
              {{ $t('cart.empty') }}
            </div>

            <!-- Render cart items when available -->
            <div v-else class="divide-y divide-border">
              <CartItem
                v-for="item in userCartStore.cartItems"
                :key="item.id"
                :item="item"
                @increment="increment"
                @decrement="decrement"
                @remove="remove"
              />
            </div>
          </div>

          <!-- Right Panel: Order Summary with pricing and checkout action -->
          <div>
            <OrderSummary
              :subtotal="userCartStore.totalPrice"
              :estimated-tax="estimatedTax"
              :estimated-shipping="estimatedShipping"
              :discount="discount"
              :is-cart-empty="!userCartStore.hasItems"
              @checkout="checkout"
              @apply-discount="applyDiscount"
            />
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

/**
 * Setup and initialization
 */
const router = useRouter()
const userCartStore = useUserCartStore()
const authStore = useAuthStore()
const { t } = useI18n()

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
 * - Values are in cents to align with monetary best practices (avoiding float arithmetic)
 */
const estimatedTax = computed(() => 5000) // 50.00 € in cents
const estimatedShipping = computed(() => 2900) // 29.00 € in cents

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
