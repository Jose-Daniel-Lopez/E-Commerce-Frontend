import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { Product } from './categories'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref('')
  const currentCategoryId = ref<number | null>(null)

  // Getters
  const productCount = computed(() => products.value.length)
  const hasProducts = computed(() => products.value.length > 0)

  const inStockProducts = computed(() => {
    return products.value.filter((product) => product.totalStock > 0)
  })

  const outOfStockProducts = computed(() => {
    return products.value.filter((product) => product.totalStock === 0)
  })

  const averagePrice = computed(() => {
    if (products.value.length === 0) return 0
    const total = products.value.reduce((sum, product) => sum + product.basePrice, 0)
    return Math.round((total / products.value.length) * 100) / 100
  })

  // Actions
  const fetchProducts = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await axios.get('http://localhost:8080/api/products')
      products.value = response.data._embedded ? response.data._embedded.products : response.data
      currentCategoryId.value = null
    } catch (err) {
      console.error('Error fetching products:', err)
      error.value = 'Error al cargar los productos'
    } finally {
      loading.value = false
    }
  }

  const fetchProductsByCategory = async (categoryId: number) => {
    loading.value = true
    error.value = ''
    currentCategoryId.value = categoryId

    try {
      const response = await axios.get(
        `http://localhost:8080/api/categories/${categoryId}/products`,
      )
      products.value = response.data._embedded ? response.data._embedded.products : response.data
    } catch (err) {
      console.error(`Error fetching products for category ${categoryId}:`, err)
      error.value = 'Error al cargar los productos de la categoría'
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (productId: number) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/products/${productId}`)
      return response.data
    } catch (err) {
      console.error(`Error fetching product ${productId}:`, err)
      throw err
    }
  }

  const addProduct = (product: Product) => {
    products.value.push(product)
  }

  const removeProduct = (productId: number) => {
    const index = products.value.findIndex((product) => product.id === productId)
    if (index > -1) {
      products.value.splice(index, 1)
    }
  }

  const updateProduct = (productId: number, updatedProduct: Partial<Product>) => {
    const index = products.value.findIndex((product) => product.id === productId)
    if (index > -1) {
      products.value[index] = { ...products.value[index], ...updatedProduct }
    }
  }

  const getProductById = (productId: number) => {
    return products.value.find((product) => product.id === productId)
  }

  const searchProducts = (searchTerm: string) => {
    if (!searchTerm.trim()) return products.value

    const term = searchTerm.toLowerCase()
    return products.value.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term),
    )
  }

  const filterProductsByPrice = (minPrice: number, maxPrice: number) => {
    return products.value.filter(
      (product) => product.basePrice >= minPrice && product.basePrice <= maxPrice,
    )
  }

  const filterProductsByStock = (inStock: boolean) => {
    return inStock ? inStockProducts.value : outOfStockProducts.value
  }

  const clearProducts = () => {
    products.value = []
    error.value = ''
    currentCategoryId.value = null
  }

  const getStockStatus = (product: Product) => {
    if (product.totalStock === 0) return { status: 'out-of-stock', text: 'Sin stock', color: 'red' }
    if (product.totalStock <= 5) return { status: 'low-stock', text: 'Stock bajo', color: 'yellow' }
    return { status: 'in-stock', text: 'En stock', color: 'green' }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  return {
    // State
    products,
    loading,
    error,
    currentCategoryId,
    // Getters
    productCount,
    hasProducts,
    inStockProducts,
    outOfStockProducts,
    averagePrice,
    // Actions
    fetchProducts,
    fetchProductsByCategory,
    fetchProductById,
    addProduct,
    removeProduct,
    updateProduct,
    getProductById,
    searchProducts,
    filterProductsByPrice,
    filterProductsByStock,
    clearProducts,
    getStockStatus,
    formatPrice,
  }
})
