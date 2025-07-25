import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/Product'
import api from '@/lib/axios'

interface PaginationInfo {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  numberOfElements: number
}

interface ProductStats {
  totalProducts: number
  inStockProducts: number
  outOfStockProducts: number
  averagePrice: number
}

interface Brand {
  name: string
  checked: boolean
}

interface Memory {
  value: string
  checked: boolean
}

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const brands = ref<Brand[]>([])
  const memories = ref<Memory[]>([])
  const loading = ref(false)
  const error = ref('')
  const featuredProducts = ref<Product[]>([])
  const currentCategoryId = ref<number | null>(null)
  const stats = ref<ProductStats>({
    totalProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
    averagePrice: 0,
  })
  const pagination = ref<PaginationInfo>({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    numberOfElements: 0,
  })

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

  const fetchFeaturedProducts = async () => {
    loading.value = true
    error.value = ''
    try {
      const response = await api.get('/products/search/findByIsFeatured?isFeatured=true')
      featuredProducts.value = response.data._embedded?.products || []
    } catch (err) {
      console.error('Error fetching featured products:', err)
      error.value = 'Error al cargar los productos destacados'
    } finally {
      loading.value = false
    }
  }

  // Actions
  const fetchProducts = async (page = 0, size = 20) => {
    loading.value = true
    error.value = ''

    try {
      const response = await api.get('/products', {
        params: {
          page,
          size,
        },
      })

      const data = response.data
      products.value = data._embedded ? data._embedded.products : data.content
      currentCategoryId.value = null

      // Actualizar información de paginación
      pagination.value = {
        page: data.page?.number || data.number || page,
        size: data.page?.size || data.size || size,
        totalElements: data.page?.totalElements || data.totalElements || 0,
        totalPages: data.page?.totalPages || data.totalPages || 0,
        first: data.page?.first || data.first || true,
        last: data.page?.last || data.last || true,
        numberOfElements: data.page?.numberOfElements || data.numberOfElements || 0,
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      error.value = 'Error al cargar los productos'
    } finally {
      loading.value = false
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await api.get<string[]>('/products/brands')
      brands.value = response.data.map((name) => ({ name, checked: false }))
    } catch (err) {
      console.error('Error fetching brands:', err)
    }
  }

  const fetchMemories = async () => {
    try {
      const response = await api.get<string[]>('/products/memories')
      memories.value = response.data.map((value) => ({ value, checked: false }))
    } catch (err) {
      console.error('Error fetching memories:', err)
    }
  }

  const fetchProductsByCategory = async (categoryId: number, page = 0, size = 20) => {
    loading.value = true
    error.value = ''
    currentCategoryId.value = categoryId

    try {
      const response = await api.get(`/categories/${categoryId}/products`, {
        params: {
          page,
          size,
        },
      })

      const data = response.data
      products.value = data._embedded ? data._embedded.products : data.content

      // Actualizar información de paginación
      pagination.value = {
        page: data.page?.number || data.number || page,
        size: data.page?.size || data.size || size,
        totalElements: data.page?.totalElements || data.totalElements || 0,
        totalPages: data.page?.totalPages || data.totalPages || 0,
        first: data.page?.first || data.first || true,
        last: data.page?.last || data.last || true,
        numberOfElements: data.page?.numberOfElements || data.numberOfElements || 0,
      }
    } catch (err) {
      console.error(`Error fetching products for category ${categoryId}:`, err)
      error.value = 'Error al cargar los productos de la categoría'
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (productId: number) => {
    try {
      const response = await api.get(`/products/${productId}`)
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

  // Pagination methods
  const goToPage = async (page: number) => {
    if (page >= 0 && page < pagination.value.totalPages) {
      if (currentCategoryId.value) {
        await fetchProductsByCategory(currentCategoryId.value, page, pagination.value.size)
      } else {
        await fetchProducts(page, pagination.value.size)
      }
    }
  }

  const goToNextPage = async () => {
    if (!pagination.value.last) {
      if (currentCategoryId.value) {
        await fetchProductsByCategory(
          currentCategoryId.value,
          pagination.value.page + 1,
          pagination.value.size,
        )
      } else {
        await fetchProducts(pagination.value.page + 1, pagination.value.size)
      }
    }
  }

  const goToPreviousPage = async () => {
    if (!pagination.value.first) {
      if (currentCategoryId.value) {
        await fetchProductsByCategory(
          currentCategoryId.value,
          pagination.value.page - 1,
          pagination.value.size,
        )
      } else {
        await fetchProducts(pagination.value.page - 1, pagination.value.size)
      }
    }
  }

  const goToFirstPage = async () => {
    if (!pagination.value.first) {
      if (currentCategoryId.value) {
        await fetchProductsByCategory(currentCategoryId.value, 0, pagination.value.size)
      } else {
        await fetchProducts(0, pagination.value.size)
      }
    }
  }

  const goToLastPage = async () => {
    if (!pagination.value.last) {
      if (currentCategoryId.value) {
        await fetchProductsByCategory(
          currentCategoryId.value,
          pagination.value.totalPages - 1,
          pagination.value.size,
        )
      } else {
        await fetchProducts(pagination.value.totalPages - 1, pagination.value.size)
      }
    }
  }

  const changePageSize = async (newSize: number) => {
    if (currentCategoryId.value) {
      await fetchProductsByCategory(currentCategoryId.value, 0, newSize)
    } else {
      await fetchProducts(0, newSize)
    }
  }

  const fetchProductStats = async () => {
    try {
      const response = await api.get('/products/stats')
      stats.value = response.data
    } catch (err) {
      console.error('Error fetching product stats:', err)
      // Fallback a estadísticas basadas en la información actual de paginación
      stats.value = {
        totalProducts: pagination.value.totalElements,
        inStockProducts: 0,
        outOfStockProducts: 0,
        averagePrice: 0,
      }
    }
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
    featuredProducts,
    brands,
    memories,
    loading,
    error,
    currentCategoryId,
    pagination,
    stats,
    // Getters
    productCount,
    hasProducts,
    inStockProducts,
    outOfStockProducts,
    averagePrice,
    // Actions
    fetchProducts,
    fetchFeaturedProducts,
    fetchProductsByCategory,
    fetchProductById,
    fetchProductStats,
    addProduct,
    removeProduct,
    updateProduct,
    getProductById,
    searchProducts,
    filterProductsByPrice,
    filterProductsByStock,
    clearProducts,
    // Pagination actions
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    changePageSize,
    // Utility functions
    getStockStatus,
    formatPrice,
  }
})
