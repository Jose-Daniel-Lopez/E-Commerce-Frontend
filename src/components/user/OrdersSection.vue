<template>
  <section
    :id="sectionId"
    class="transition-colors duration-200 bg-background border border-border shadow-md rounded-2xl p-6"
  >
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold font-srProDisplay text-foreground">
        <span class="text-base font-bold tracking-tight text-muted uppercase">{{ $t('account.orders.title') }}</span>
      </h2>
      <router-link
        to="/orders"
        class="text-sm font-medium transition-colors text-muted hover:text-foreground"
      >
        {{ $t('account.orders.viewAll') }}
      </router-link>
    </div>
    <div class="space-y-4">
      <div v-if="orders.length === 0" class="py-8 text-center">
        <v-icon name="hi-clipboard-list" scale="2" class="mb-4 opacity-80 text-muted-foreground" aria-hidden="true" />
        <p class="text-base font-srProDisplay text-muted-foreground">{{ $t('account.orders.emptyMessage') }}</p>
      </div>
      <div v-else>
        <div
          v-for="order in orders.slice(0, 5)"
          :key="order.id"
          class="flex items-center justify-between p-4 transition-all duration-200 border border-border rounded-xl bg-surface hover:shadow-lg"
          role="listitem"
        >
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-surface text-primary-foreground">
              <v-icon name="hi-clipboard-list" scale="1.2" class="text-primary-foreground" />
            </div>
            <div>
              <p class="font-medium font-srProDisplay text-foreground">
                {{ $t('account.orders.order') }} #{{ order.id }}
              </p>
              <p class="text-sm font-srProDisplay text-muted">{{ order.date }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span :class="['px-3 py-1 text-sm font-medium rounded-full', getStatusThemeClass(order.status)]">{{ order.status }}</span>
            <Button
              @click="$emit('open-details', order)"
              bg-color="transparent"
              width="auto"
              height="auto"
              class="px-4 text-muted hover:text-foreground transition-colors duration-200 cursor-pointer text-xs font-light"
            >
              {{ $t('account.orders.viewDetails') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '@/components/shared/Button.vue'

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

interface Props {
  sectionId: string
  orders: OrderType[]
}

interface Emits {
  (e: 'open-details', order: OrderType): void
}

defineProps<Props>()
defineEmits<Emits>()

// Helper: return theme-aware badge classes
const getStatusThemeClass = (status: string) => {
  // Use theme-backed utility classes from base.css / themes.css.
  // Delivered -> success background with readable foreground
  // Shipped -> neutral surface with theme text
  // Cancelled -> error background with readable foreground
  switch (status) {
    case 'Delivered':
      return 'bg-success text-primary-foreground'
    case 'Shipped':
      return 'bg-surface theme-text'
    case 'Cancelled':
      return 'bg-error text-primary-foreground'
    default:
      return 'bg-surface theme-muted-text'
  }
}
</script>
