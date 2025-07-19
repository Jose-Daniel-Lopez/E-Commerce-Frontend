<template>
  <div class="credit-card-visual">
    <div class="card-bg">
      <div class="card-chip"></div>
      <div class="card-number">{{ formattedNumber }}</div>
      <div class="card-details">
        <div class="card-holder">
          <span>Card Holder</span>
          <span class="card-holder-name">{{ name || 'FULL NAME' }}</span>
        </div>
        <div class="card-expiry">
          <span>Expires</span>
          <span>{{ formattedExpiration }}</span>
        </div>
        <div class="card-cvc">
          <span>CVV</span>
          <span class="cvc-value">{{ censoredCVC }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  name: String,
  number: String,
  expiration: String,
  cvc: String,
  focused: String,
})

const formattedNumber = computed(() => {
  if (!props.number) return '•••• •••• •••• ••••'
  return props.number
    .replace(/\D/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim()
})

const formattedExpiration = computed(() => {
  if (!props.expiration) return 'MM/YY'
  return props.expiration
})

const censoredCVC = computed(() => {
  if (!props.cvc) return '***'
  return '*'.repeat(props.cvc.length)
})
</script>

<style scoped>
.credit-card-visual {
  width: 340px;
  height: 210px;
  background: linear-gradient(135deg, #232340 60%, #4e54c8 100%);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 44, 84, 0.18);
  color: #fff;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'SF Pro Display', 'Geist', sans-serif;
}
.card-bg {
  width: 100%;
  height: 100%;
  position: relative;
}
.card-chip {
  width: 44px;
  height: 32px;
  background: #e0e0e0;
  border-radius: 8px;
  margin-bottom: 32px;
}
.card-number {
  font-size: 1.4rem;
  letter-spacing: 2px;
  margin-bottom: 32px;
}
.card-details {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Ensure horizontal alignment */
}
.card-holder,
.card-expiry,
.card-cvc {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center align text within each section */
}
.card-holder span:first-child,
.card-expiry span:first-child,
.card-cvc span:first-child {
  font-size: 0.7rem;
  color: #bdbdbd;
  display: block;
}
.card-holder span:last-child,
.card-expiry span:last-child,
.card-cvc span:last-child {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
}
.cvc-value {
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 2px;
}
.card-holder-name {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
</style>
