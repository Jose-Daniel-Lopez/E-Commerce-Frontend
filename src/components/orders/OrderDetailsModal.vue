<template>
  <Transition name="modal-overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-overlay backdrop-blur-md z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <Transition name="modal-content">
        <div
          v-if="isOpen"
          class="rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform theme-card border theme-border"
          @click.stop
        >
          <!-- Modal Header -->
      <div class="sticky top-0 backdrop-blur-sm border-b theme-border px-6 py-4 rounded-t-xl z-10 theme-surface">
            <div class="flex items-center justify-between">
              <div>
        <h2 class="font-srProDisplay text-2xl font-semibold theme-text">
                  Order #{{ order.id }}
                </h2>
        <p class="font-srProDisplay text-sm theme-muted-text mt-1">
                  Placed on {{ formatDate(order.date) }}
                </p>
              </div>
              <button
                @click="closeModal"
        class="p-2 hover:theme-card rounded-full transition-colors"
              >
        <v-icon name="hi-x" scale="1.4" class="theme-muted-text" />
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="p-6 space-y-8">
            <!-- Loading State -->
            <div v-if="order.shippingAddress.name === 'Loading...'" class="text-center py-8">
              <v-icon name="hi-refresh" scale="2" class="animate-spin mb-4" :style="{ color: 'var(--color-primary)' }" />
              <p class="font-srProDisplay theme-muted-text">Loading order details...</p>
            </div>

            <!-- Order Content (when loaded) -->
            <template v-else>
            <!-- Order Status and Progress -->
            <section>
              <h3 class="font-srProDisplay text-lg font-semibold theme-text mb-4">
                Order Status
              </h3>
              <div class="theme-surface rounded-lg p-6">
                <div class="flex items-center justify-between mb-6">
                  <span class="px-4 py-2 rounded-full text-sm font-medium" :style="getStatusStyle(order.status)">
                    {{ order.status }}
                  </span>
                  <span class="font-srProDisplay text-sm theme-muted-text">
                    Expected delivery: {{ order.expectedDelivery }}
                  </span>
                </div>

                <!-- Order Progress -->
                <div class="relative px-4">
                  <div class="flex items-center justify-between relative">
                    <div
                      v-for="step in orderSteps"
                      :key="step.id"
                      class="flex flex-col items-center"
                    >
                      <div
                        :class="['w-12 h-12 rounded-full flex items-center justify-center border-3 transition-all duration-500 shadow-lg', { pulse: step.current }]"
                        :style="getStepStyle(step)"
                      >
                        <v-icon
                          v-if="step.completed"
                          name="hi-check"
                          scale="1.4"
                          class="text-white"
                        />
                        <v-icon
                          v-else
                          :name="step.icon"
                          scale="1.4"
                          class=""
                        />
                      </div>
                      <span :class="['font-srProDisplay text-sm mt-3 text-center font-medium', step.completed || step.current ? 'theme-text' : 'theme-muted-text']">
                        {{ step.label }}
                      </span>
                      <span v-if="step.date" class="font-srProDisplay text-xs theme-muted-text mt-1">
                        {{ formatDate(step.date) }}
                      </span>
                    </div>
                  </div>
                  <!-- Progress line and connection dots removed as requested -->
                </div>
              </div>
            </section>

            <!-- Order Items -->
            <section>
              <h3 class="font-srProDisplay text-lg font-semibold text-foreground mb-4">Order Items</h3>
              <div class="space-y-4">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="flex items-center gap-4 p-4 bg-surface rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-16 h-16 object-contain rounded-lg bg-background"
                  />
                  <div class="flex-1">
                    <h4 class="font-srProDisplay font-medium text-foreground">{{ item.name }}</h4>
                    <p class="font-srProDisplay text-sm text-muted mt-1">
                      {{ item.description }}
                    </p>
                    <div class="flex items-center gap-4 mt-2">
                      <span class="font-srProDisplay text-sm text-muted">
                        Qty: {{ item.quantity }}
                      </span>
                      <span class="font-srProDisplay text-sm text-muted">
                        Unit Price: {{ formatPrice(item.price) }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="font-srProDisplay text-lg font-semibold text-foreground">
                      {{ formatPrice(item.price * item.quantity) }}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Order Summary -->
            <section>
              <h3 class="font-srProDisplay text-lg font-semibold text-foreground mb-4">
                Order Summary
              </h3>
              <div class="bg-surface rounded-lg p-6">
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="font-srProDisplay text-muted">Subtotal</span>
                    <span class="font-srProDisplay text-foreground">{{
                      formatPrice(order.subtotal)
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-srProDisplay text-muted">Shipping</span>
                    <span class="font-srProDisplay text-foreground">{{
                      formatPrice(order.shipping)
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-srProDisplay text-muted">Tax</span>
                    <span class="font-srProDisplay text-foreground">{{ formatPrice(order.tax) }}</span>
                  </div>
                  <div v-if="order.discount > 0" class="flex justify-between text-success">
                    <span class="font-srProDisplay">Discount</span>
                    <span class="font-srProDisplay">-{{ formatPrice(order.discount) }}</span>
                  </div>
                  <div class="border-t border-border pt-3 flex justify-between">
                    <span class="font-srProDisplay text-lg font-semibold text-foreground">Total</span>
                    <span class="font-srProDisplay text-lg font-semibold text-foreground">
                      {{ formatPrice(order.total) }}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Shipping Information -->
            <section>
              <h3 class="font-srProDisplay text-lg font-semibold text-foreground mb-4">
                Shipping Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Shipping Address -->
                <div class="bg-surface rounded-lg p-4">
                  <h4 class="font-srProDisplay font-medium text-foreground mb-2">Shipping Address</h4>
                  <div class="font-srProDisplay text-sm text-muted space-y-1">
                    <p>{{ order.shippingAddress.name }}</p>
                    <p>{{ order.shippingAddress.street }}</p>
                    <p>
                      {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }}
                      {{ order.shippingAddress.zipCode }}
                    </p>
                    <p>{{ order.shippingAddress.country }}</p>
                  </div>
                </div>

                <!-- Billing Address -->
                <div class="bg-surface rounded-lg p-4">
                  <h4 class="font-srProDisplay font-medium text-foreground mb-2">Billing Address</h4>
                  <div class="font-srProDisplay text-sm text-muted space-y-1">
                    <p>{{ order.billingAddress.name }}</p>
                    <p>{{ order.billingAddress.street }}</p>
                    <p>
                      {{ order.billingAddress.city }}, {{ order.billingAddress.state }}
                      {{ order.billingAddress.zipCode }}
                    </p>
                    <p>{{ order.billingAddress.country }}</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Payment Information -->
            <section>
              <h3 class="font-srProDisplay text-lg font-semibold text-foreground mb-4">
                Payment Information
              </h3>
              <div class="bg-surface rounded-lg p-4">
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-8 bg-primary rounded flex items-center justify-center"
                  >
                    <v-icon name="hi-credit-card" scale="1.2" class="text-primary-foreground" />
                  </div>
                  <div>
                    <p class="font-srProDisplay font-medium text-foreground">
                      {{ order.paymentMethod.type }}
                    </p>
                    <p class="font-srProDisplay text-sm text-muted">
                      **** **** **** {{ order.paymentMethod.lastFour }}
                    </p>
                  </div>
                  <div class="ml-auto">
                    <span :class="['px-3 py-1 rounded-full text-sm font-medium', getPaymentStatusClass(order.paymentStatus)]">
                      {{ order.paymentStatus }}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Tracking Information -->
            <section v-if="order.trackingNumber">
              <h3 class="font-srProDisplay text-lg font-semibold text-foreground mb-4">
                Tracking Information
              </h3>
              <div class="bg-surface border border-border rounded-lg p-4">
                <div class="flex items-center gap-3">
                  <v-icon name="hi-truck" scale="1.2" class="text-primary" />
                  <div>
                    <p class="font-srProDisplay font-medium text-foreground">
                      Tracking Number: {{ order.trackingNumber }}
                    </p>
                    <p class="font-srProDisplay text-sm text-muted">
                      Carrier: {{ order.carrier }}
                    </p>
                  </div>
                  <button
                    class="ml-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors text-sm font-medium"
                  >
                    Track Package
                  </button>
                </div>
              </div>
            </section>
            </template>
          </div>

          <!-- Modal Footer -->
          <div
            class="sticky bottom-0 bg-background/90 backdrop-blur-sm border-t border-border px-6 py-4 rounded-b-xl z-10"
          >
            <div class="flex gap-3 justify-end">
              <button
                @click="closeModal"
                class="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-surface-hover transition-colors font-medium"
              >
                Close
              </button>
              <button
                v-if="order.status !== 'Delivered' && order.status !== 'Cancelled'"
                class="px-6 py-2 bg-error text-primary-foreground rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                Cancel Order
              </button>
              <button
                class="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                Reorder
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

interface Order {
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
  isOpen: boolean
  order: Order
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const orderSteps = computed(() => {
  const steps = [
    {
      id: 'created',
      label: 'Order Created',
      icon: 'hi-clipboard-list',
      completed: true,
      current: false,
      date: props.order.date,
    },
    {
      id: 'paid',
      label: 'Payment Confirmed',
      icon: 'hi-credit-card',
      completed: ['Paid', 'Shipped', 'Delivered'].includes(props.order.status),
      current: props.order.status === 'Paid',
      date: ['Paid', 'Shipped', 'Delivered'].includes(props.order.status)
        ? props.order.date
        : null,
    },
    {
      id: 'shipped',
      label: 'Shipped',
      icon: 'hi-truck',
      completed: ['Shipped', 'Delivered'].includes(props.order.status),
      current: props.order.status === 'Shipped',
      date: ['Shipped', 'Delivered'].includes(props.order.status) ? props.order.date : null,
    },
    {
      id: 'delivered',
      label: 'Delivered',
      icon: 'hi-check-circle',
      completed: props.order.status === 'Delivered',
      current: props.order.status === 'Delivered',
      date: props.order.status === 'Delivered' ? props.order.expectedDelivery : null,
    },
  ]

  return steps
})

const getPaymentStatusClass = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'bg-success text-primary-foreground'
    case 'Pending':
      return 'bg-warning text-primary-foreground'
    case 'Failed':
      return 'bg-error text-primary-foreground'
    default:
      return 'bg-surface text-muted'
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Delivered':
      return {
        background: 'var(--color-success-bg)',
        color: 'var(--color-success)',
        borderColor: 'var(--color-success)'
      }
    case 'Shipped':
      return {
        background: 'var(--color-primary-bg)',
        color: 'var(--color-primary)',
        borderColor: 'var(--color-primary)'
      }
    case 'Paid':
      return {
        background: 'var(--color-warning-bg)',
        color: 'var(--color-warning)',
        borderColor: 'var(--color-warning)'
      }
    case 'Cancelled':
      return {
        background: 'var(--color-error-bg)',
        color: 'var(--color-error)',
        borderColor: 'var(--color-error)'
      }
    default:
      return {
        background: 'var(--surface-bg)',
        color: 'var(--color-muted-foreground)',
        borderColor: 'var(--color-border)'
      }
  }
}

const getStepStyle = (step: { completed: boolean; current: boolean }) => {
  if (step.completed) {
    return {
      background: 'var(--color-success)',
      borderColor: 'var(--color-success)',
      color: 'var(--color-primary-foreground)',
      boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.25)'
    }
  }

  if (step.current) {
    return {
      background: 'var(--color-primary)',
      borderColor: 'var(--color-primary)',
      color: 'var(--color-primary-foreground)',
      boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)'
    }
  }

  return {
    background: 'var(--surface-bg)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-muted-foreground)',
    boxShadow: '0 2px 8px 0 rgba(107, 114, 128, 0.06)'
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Enhanced backdrop-filter with fallbacks */
.backdrop-blur-md {
  /* Fallback para navegadores sin soporte */
  background: rgba(0, 0, 0, 0.6);

  /* Soporte nativo */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Detectar soporte para backdrop-filter y ajustar */
@supports (backdrop-filter: blur(8px)) or (-webkit-backdrop-filter: blur(8px)) {
  .backdrop-blur-md {
    background: rgba(0, 0, 0, 0.4);
  }
}

/* Progress Step Enhancements */
.pulse {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

/* Enhanced border width */
.border-3 {
  border-width: 3px;
}

/* Enhanced shadow effects for steps */
.shadow-green-200 {
  box-shadow: 0 4px 14px 0 rgba(34, 197, 94, 0.25);
}

.shadow-blue-200 {
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.25);
}

.shadow-gray-100 {
  box-shadow: 0 2px 8px 0 rgba(107, 114, 128, 0.15);
}

/* Modal Transitions */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

/* Custom shadow for modal with elevated appearance */
.shadow-2xl {
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Ensure modal appears above everything */
.z-50 {
  z-index: 9999;
}
</style>
