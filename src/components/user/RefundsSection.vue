<template>
  <section
    :id="sectionId"
    :class="['transition-colors duration-200', sectionContainerClasses]"
  >
    <div class="flex items-center justify-between mb-6">
      <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
        <span :class="sectionHeaderClasses">{{ $t('account.refunds.title') }}</span>
      </h2>
    </div>
    <div v-if="refunds.length === 0" class="py-8 text-center">
      <v-icon name="hi-arrow-left" scale="2" :class="['mb-4 opacity-80', emptyStateIconClasses]" />
      <p :class="['text-base font-srProDisplay', emptyStateTextClasses]">{{ $t('account.refunds.empty') }}</p>
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="refund in refunds.slice(0, 5)"
        :key="refund.id"
        :class="listItemClasses"
        role="listitem"
      >
        <div class="flex items-center gap-4">
          <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconContainerClasses]">
            <v-icon name="hi-arrow-left" scale="1.2" :class="iconInContainerClasses" />
          </div>
          <div>
            <p :class="['font-medium font-srProDisplay', textClasses]">
              {{ refund.status === 'Returned' ? 'Return' : 'Refund' }} #{{ refund.id }}
            </p>
            <p :class="['text-sm font-srProDisplay', textSecondaryClasses]">{{ refund.date }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span :class="[statusBadgeClasses, getRefundStatusTheme(refund.status)]">{{ refund.status }}</span>
          <Button
            @click="$emit('open-details', refund)"
            bg-color="transparent"
            width="auto"
            height="auto"
            :class="['px-4', actionButtonClasses]"
          >
            {{ $t('account.refunds.viewDetails') }}
          </Button>
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

interface RefundType {
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
  refunds: RefundType[]
  sectionContainerClasses: string
  textClasses: string
  sectionHeaderClasses: string
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
  (e: 'open-details', refund: RefundType): void
}

defineProps<Props>()
defineEmits<Emits>()

// Theme-aware refund status
const getRefundStatusTheme = (status: string) => {
  switch (status) {
    case 'Completed':
    case 'Refunded':
      return 'theme-success-text theme-success-bg'
    case 'Processing':
    case 'Returned':
      return 'theme-warning-text theme-warning-bg'
    default:
      return 'theme-muted-text theme-surface'
  }
}
</script>
