<template>
  <section
    :id="sectionId"
    :class="['transition-colors duration-200', sectionContainerClasses]"
  >
    <div class="flex items-center justify-between mb-6">
      <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
        <span :class="sectionHeaderClasses">{{ $t('account.orders.title') }}</span>
      </h2>
      <router-link
        to="/orders"
        :class="['text-sm font-medium transition-colors', linkClasses]"
      >
        {{ $t('account.orders.viewAll') }}
      </router-link>
    </div>
    <div class="space-y-4">
      <div v-if="orders.length === 0" class="py-8 text-center">
        <v-icon name="hi-clipboard-list" scale="2" :class="['mb-4 opacity-80', emptyStateIconClasses]" aria-hidden="true" />
        <p :class="['text-base font-srProDisplay', emptyStateTextClasses]">{{ $t('account.orders.emptyMessage') }}</p>
      </div>
      <div v-else>
        <div
          v-for="order in orders.slice(0, 5)"
          :key="order.id"
          :class="listItemClasses"
          role="listitem"
        >
          <div class="flex items-center gap-4">
            <div :class="iconContainerClasses">
              <v-icon name="hi-clipboard-list" scale="1.2" :class="iconInContainerClasses" />
            </div>
            <div>
              <p :class="['font-medium font-srProDisplay', textClasses]">
                {{ $t('account.orders.order') }} #{{ order.id }}
              </p>
              <p :class="['text-sm font-srProDisplay', textSecondaryClasses]">{{ order.date }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span :class="[statusBadgeClasses, getStatusThemeClass(order.status)]">{{ order.status }}</span>
            <Button
              @click="$emit('open-details', order)"
              bg-color="transparent"
              width="auto"
              height="auto"
              :class="['px-4', actionButtonClasses]"
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
  sectionContainerClasses: string
  textClasses: string
  sectionHeaderClasses: string
  linkClasses: string
  emptyStateIconClasses: string
  emptyStateTextClasses: string
  listItemClasses: string
  iconContainerClasses: string
  iconInContainerClasses: string
  textSecondaryClasses: string
  statusBadgeClasses: string
  actionButtonClasses: string
}

interface Emits {
  (e: 'open-details', order: OrderType): void
}

defineProps<Props>()
defineEmits<Emits>()

// Helper: return theme-aware badge classes
const getStatusThemeClass = (status: string) => {
  switch (status) {
    case 'Delivered':
      return 'theme-success-text theme-success-bg'
    case 'Shipped':
      return 'theme-text theme-surface'
    case 'Cancelled':
      return 'theme-error-text theme-error-bg'
    default:
      return 'theme-muted-text theme-surface'
  }
}
</script>
