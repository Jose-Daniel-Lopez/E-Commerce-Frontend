<template>
  <div class="user-cart-view">
    <!-- Header -->
    <div class="cart-header">
      <h1 class="cart-title">Shopping Cart</h1>
      <p v-if="userCartStore.hasItems" class="cart-subtitle">
        {{ userCartStore.totalQuantity }} items in your cart
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="userCartStore.loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading your cart...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="userCartStore.error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{{ userCartStore.error }}</p>
      <button @click="loadCart" class="retry-button">
        Try Again
      </button>
    </div>

    <!-- Empty Cart -->
    <div v-else-if="!userCartStore.hasItems" class="empty-cart">
      <div class="empty-cart-icon">🛒</div>
      <h3>Your cart is empty</h3>
      <p>Add some items to your cart to get started!</p>
      <router-link to="/products" class="shop-now-button">
        Start Shopping
      </router-link>
    </div>

    <!-- Cart Content -->
    <div v-else class="cart-content">
      <!-- Cart Items -->
      <div class="cart-items">
        <div
          v-for="item in userCartStore.cartItems"
          :key="item.id"
          class="cart-item"
        >
          <!-- Product Image -->
          <div class="item-image">
            <img
              :src="`https://placehold.co/80x80/EFEFEF/AAAAAA&text=No+Image`"
              :alt="item.product?.name || 'Product'"
            />
          </div>

          <!-- Product Details -->
          <div class="item-details">
            <h4 class="item-name">{{ item.product?.name || 'Unknown Product' }}</h4>
            <p class="item-description">{{ item.product?.description }}</p>

            <!-- Variant Details -->
            <div v-if="item.productVariant" class="variant-details">
              <span v-if="item.productVariant.color" class="variant-color">
                Color: {{ item.productVariant.color }}
              </span>
              <span v-if="item.productVariant.size" class="variant-size">
                Size: {{ item.productVariant.size }}
              </span>
              <span class="variant-sku">SKU: {{ item.productVariant.sku }}</span>
            </div>

            <!-- Stock Status -->
            <div v-if="item.productVariant" class="stock-status">
              <span
                :class="[
                  'stock-badge',
                  item.productVariant.stock > 0 ? 'in-stock' : 'out-of-stock'
                ]"
              >
                {{ item.productVariant.stock > 0 ? 'In Stock' : 'Out of Stock' }}
                ({{ item.productVariant.stock }} available)
              </span>
            </div>
          </div>

          <!-- Quantity Controls -->
          <div class="item-quantity">
            <label class="quantity-label">Quantity:</label>
            <div class="quantity-controls">
              <button
                @click="decreaseQuantity(item)"
                :disabled="item.quantity <= 1 || userCartStore.loading"
                class="quantity-button decrease"
              >
                -
              </button>
              <input
                v-model.number="item.quantity"
                @change="updateQuantity(item)"
                type="number"
                min="1"
                :max="item.productVariant?.stock || 999"
                class="quantity-input"
              />
              <button
                @click="increaseQuantity(item)"
                :disabled="item.quantity >= (item.productVariant?.stock || 999) || userCartStore.loading"
                class="quantity-button increase"
              >
                +
              </button>
            </div>
          </div>

          <!-- Price -->
          <div class="item-price">
            <div class="unit-price">
              {{ userCartStore.formatPrice(item.product?.basePrice || 0) }} each
            </div>
            <div class="total-price">
              {{ userCartStore.formatPrice((item.product?.basePrice || 0) * item.quantity) }}
            </div>
          </div>

          <!-- Remove Button -->
          <div class="item-actions">
            <button
              @click="removeItem(item.id)"
              :disabled="userCartStore.loading"
              class="remove-button"
              title="Remove item"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary">
        <div class="summary-card">
          <h3>Order Summary</h3>

          <div class="summary-row">
            <span>Items ({{ userCartStore.totalQuantity }})</span>
            <span>{{ userCartStore.formatPrice(userCartStore.totalPrice) }}</span>
          </div>

          <div class="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div class="summary-row total">
            <span>Total</span>
            <span>{{ userCartStore.formatPrice(userCartStore.totalPrice) }}</span>
          </div>

          <div class="summary-actions">
            <button class="checkout-button" :disabled="userCartStore.loading">
              Proceed to Checkout
            </button>
            <router-link to="/products" class="continue-shopping">
              Continue Shopping
            </router-link>
          </div>
        </div>

        <!-- Cart Meta Info -->
        <div v-if="userCartStore.cart" class="cart-meta">
          <p class="cart-created">
            Cart created: {{ userCartStore.formatDate(userCartStore.cart.createdAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserCartStore } from '@/stores/userCart'
import type { CartItem } from '@/stores/userCart'

const route = useRoute()
const userCartStore = useUserCartStore()

const loadCart = async () => {
  const userId = route.params.userId as string
  if (userId) {
    await userCartStore.fetchUserCart(userId)
  }
}

const updateQuantity = async (item: CartItem) => {
  if (item.quantity > 0) {
    await userCartStore.updateItemQuantity(item.id, item.quantity)
  }
}

const increaseQuantity = async (item: CartItem) => {
  const maxStock = item.productVariant?.stock || 999
  if (item.quantity < maxStock) {
    await userCartStore.updateItemQuantity(item.id, item.quantity + 1)
  }
}

const decreaseQuantity = async (item: CartItem) => {
  if (item.quantity > 1) {
    await userCartStore.updateItemQuantity(item.id, item.quantity - 1)
  }
}

const removeItem = async (itemId: number) => {
  if (confirm('Are you sure you want to remove this item from your cart?')) {
    await userCartStore.removeItem(itemId)
  }
}

onMounted(() => {
  loadCart()
})
</script>

<style scoped>
.user-cart-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.cart-header {
  text-align: center;
  margin-bottom: 2rem;
}

.cart-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.cart-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.retry-button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #dc2626;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-cart-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.shop-now-button {
  display: inline-block;
  background-color: #3b82f6;
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.shop-now-button:hover {
  background-color: #2563eb;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.item-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.item-description {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.variant-details {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.stock-status {
  margin-top: 0.5rem;
}

.stock-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.stock-badge.in-stock {
  background-color: #d1fae5;
  color: #065f46;
}

.stock-badge.out-of-stock {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Quantity Controls */
.item-quantity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.quantity-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
}

.quantity-button {
  background-color: #f9fafb;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.quantity-button:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.quantity-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  border: none;
  width: 60px;
  text-align: center;
  padding: 0.5rem;
  font-size: 1rem;
}

/* Price */
.item-price {
  text-align: right;
}

.unit-price {
  font-size: 0.875rem;
  color: #6b7280;
}

.total-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

/* Remove Button */
.remove-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.remove-button:hover:not(:disabled) {
  background-color: #fee2e2;
}

.remove-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Cart Summary */
.summary-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.summary-row.total {
  border-bottom: none;
  font-weight: 600;
  font-size: 1.125rem;
  color: #1f2937;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
}

.summary-actions {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkout-button {
  background-color: #059669;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkout-button:hover:not(:disabled) {
  background-color: #047857;
}

.checkout-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.continue-shopping {
  text-align: center;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  transition: color 0.2s;
}

.continue-shopping:hover {
  color: #2563eb;
}

.cart-meta {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.cart-created {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}
</style>
