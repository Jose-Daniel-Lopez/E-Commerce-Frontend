<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Product API Test</h1>

    <button @click="testAPI" class="bg-blue-500 text-white px-4 py-2 rounded mb-4">
      Test Product API (ID: 3)
    </button>

    <div v-if="loading" class="text-gray-600">Loading...</div>
    <div v-if="error" class="text-red-600">Error: {{ error }}</div>

    <div v-if="productData" class="bg-gray-100 p-4 rounded">
      <h2 class="font-bold mb-2">Raw API Response:</h2>
      <pre class="text-xs">{{ JSON.stringify(productData, null, 2) }}</pre>

      <h2 class="font-bold mt-4 mb-2">Category Detection:</h2>
      <div>Category Name: {{ productData.categoryName }}</div>
      <div>Is Mobile/Compute: {{ isMobileCompute }}</div>
      <div>Should show specs: {{ shouldShowSpecs }}</div>

      <h2 class="font-bold mt-4 mb-2">Specifications:</h2>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div>Screen Size: {{ productData.screenSize }}</div>
        <div>CPU: {{ productData.cpu }}</div>
        <div>GPU: {{ productData.gpu }}</div>
        <div>RAM: {{ productData.ram }}GB</div>
        <div>Storage: {{ productData.storage }}</div>
        <div>Refresh Rate: {{ productData.refreshRate }}Hz</div>
        <div>Camera: {{ productData.camera }}</div>
        <div>Front Camera: {{ productData.frontCamera }}</div>
        <div>Battery: {{ productData.battery }}</div>
        <div>OS: {{ productData.os }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/products'

const productStore = useProductStore()
const loading = ref(false)
const error = ref('')
const productData = ref<any>(null)

const isMobileCompute = computed(() => {
  const categoryName = productData.value?.categoryName
  return categoryName && ['Smartphones', 'Tablets', 'Laptops', 'Handhelds', 'Computers'].includes(categoryName)
})

const shouldShowSpecs = computed(() => {
  const specs = productData.value
  return specs?.screenSize || specs?.cpu || specs?.gpu || specs?.ram ||
         specs?.storage || specs?.refreshRate || specs?.camera ||
         specs?.frontCamera || specs?.battery || specs?.os
})

const testAPI = async () => {
  loading.value = true
  error.value = ''
  productData.value = null

  try {
    const result = await productStore.fetchProductById(3)
    productData.value = result
    console.log('🔍 [TestProductAPI] API Response:', result)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
    console.error('🔍 [TestProductAPI] Error:', err)
  } finally {
    loading.value = false
  }
}
</script>
