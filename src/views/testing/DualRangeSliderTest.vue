<script setup lang="ts">
import { ref } from 'vue'
import DualRangeSlider from '../../components/shared/DualRangeSlider.vue'

// Test different scenarios
const priceRange = ref<[number, number]>([500, 2000])
const discountRange = ref<[number, number]>([10, 50])
const ageRange = ref<[number, number]>([25, 45])

const formatPrice = (value: number) => `$${value.toLocaleString()}`
const formatPercent = (value: number) => `${value}%`
const formatAge = (value: number) => value === 65 ? '65+' : `${value} years`
</script>

<template>
  <div class="p-8 space-y-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-center mb-8">DualRangeSlider Test Page</h1>

    <!-- Price Range Test -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold mb-4">Price Range Filter</h2>
      <DualRangeSlider
        :min="0"
        :max="5000"
        :step="50"
        v-model="priceRange"
        :format-value="formatPrice"
      />
      <div class="mt-4 text-sm text-gray-600">
        <strong>Current Range:</strong> {{ formatPrice(priceRange[0]) }} - {{ formatPrice(priceRange[1]) }}
      </div>
    </div>

    <!-- Discount Range Test -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold mb-4">Discount Percentage</h2>
      <DualRangeSlider
        :min="0"
        :max="100"
        :step="5"
        v-model="discountRange"
        :format-value="formatPercent"
      />
      <div class="mt-4 text-sm text-gray-600">
        <strong>Current Range:</strong> {{ formatPercent(discountRange[0]) }} - {{ formatPercent(discountRange[1]) }}
      </div>
    </div>

    <!-- Age Range Test -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold mb-4">Age Range</h2>
      <DualRangeSlider
        :min="18"
        :max="65"
        :step="1"
        v-model="ageRange"
        :format-value="formatAge"
      />
      <div class="mt-4 text-sm text-gray-600">
        <strong>Current Range:</strong> {{ formatAge(ageRange[0]) }} - {{ formatAge(ageRange[1]) }}
      </div>
    </div>

    <!-- Raw Values Display -->
    <div class="bg-gray-50 p-4 rounded-lg text-xs font-mono">
      <h3 class="font-semibold mb-2">Raw Values (for debugging):</h3>
      <div>Price Range: {{ JSON.stringify(priceRange) }}</div>
      <div>Discount Range: {{ JSON.stringify(discountRange) }}</div>
      <div>Age Range: {{ JSON.stringify(ageRange) }}</div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add some custom styling to test the component */
</style>
