import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export interface ProductVariant {
  id: number
  size: string
  color: string
  stock: number
  sku: string
  _links?: {
    self?: {
      href: string
    }
    productVariant?: {
      href: string
    }
    product?: {
      href: string
    }
  }
}

export interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  totalStock: number
}

export const useProductVariantsStore = defineStore('productVariants', () => {
  // State
  const variants = ref<ProductVariant[]>([])
  const loading = ref(false)
  const error = ref('')
  const currentProductId = ref<number | null>(null)

  // Getters
  const variantCount = computed(() => variants.value.length)
  const hasVariants = computed(() => variants.value.length > 0)

  const totalVariantStock = computed(() => {
    return variants.value.reduce((total, variant) => total + variant.stock, 0)
  })

  const lowStockVariants = computed(() => {
    return variants.value.filter((variant) => variant.stock <= 5)
  })

  const outOfStockVariants = computed(() => {
    return variants.value.filter((variant) => variant.stock === 0)
  })

  const inStockVariants = computed(() => {
    return variants.value.filter((variant) => variant.stock > 0)
  })

  const variantsByColor = computed(() => {
    const grouped: Record<string, ProductVariant[]> = {}
    variants.value.forEach((variant) => {
      if (!grouped[variant.color]) {
        grouped[variant.color] = []
      }
      grouped[variant.color].push(variant)
    })
    return grouped
  })

  const variantsBySize = computed(() => {
    const grouped: Record<string, ProductVariant[]> = {}
    variants.value.forEach((variant) => {
      if (!grouped[variant.size]) {
        grouped[variant.size] = []
      }
      grouped[variant.size].push(variant)
    })
    return grouped
  })

  const uniqueColors = computed(() => {
    return [...new Set(variants.value.map((variant) => variant.color))]
  })

  const uniqueSizes = computed(() => {
    return [...new Set(variants.value.map((variant) => variant.size))]
  })

  // Actions
  const fetchVariants = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await api.get('/productVariants')
      variants.value = response.data._embedded
        ? response.data._embedded.productVariants
        : response.data
    } catch (err) {
      console.error('Error fetching product variants:', err)
      error.value = 'Error loading product variants'
    } finally {
      loading.value = false
    }
  }

  const fetchVariantsByProduct = async (productId: number) => {
    loading.value = true
    error.value = ''
    currentProductId.value = productId

    try {
      const response = await api.get(`/products/${productId}/productVariants`)
      variants.value = response.data._embedded
        ? response.data._embedded.productVariants
        : response.data
    } catch (err) {
      console.error(`Error fetching variants for product ${productId}:`, err)
      error.value = 'Error loading product variants'
    } finally {
      loading.value = false
    }
  }

  const fetchVariantById = async (variantId: number) => {
    try {
      const response = await api.get(`/productVariants/${variantId}`)
      return response.data
    } catch (err) {
      console.error(`Error fetching variant ${variantId}:`, err)
      throw err
    }
  }

  const addVariant = (variant: ProductVariant) => {
    variants.value.push(variant)
  }

  const removeVariant = (variantId: number) => {
    const index = variants.value.findIndex((variant) => variant.id === variantId)
    if (index > -1) {
      variants.value.splice(index, 1)
    }
  }

  const updateVariant = (variantId: number, updatedVariant: Partial<ProductVariant>) => {
    const index = variants.value.findIndex((variant) => variant.id === variantId)
    if (index > -1) {
      variants.value[index] = { ...variants.value[index], ...updatedVariant }
    }
  }

  const getVariantById = (variantId: number) => {
    return variants.value.find((variant) => variant.id === variantId)
  }

  const clearVariants = () => {
    variants.value = []
    error.value = ''
    currentProductId.value = null
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' }
    if (stock <= 5) return { text: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100' }
  }

  const getColorClass = (color: string) => {
    const colorLower = color.toLowerCase()
    if (colorLower.includes('negro') || colorLower.includes('black')) return 'bg-gray-800'
    if (colorLower.includes('blanco') || colorLower.includes('white')) return 'bg-gray-100'
    if (colorLower.includes('rojo') || colorLower.includes('red')) return 'bg-red-500'
    if (colorLower.includes('azul') || colorLower.includes('blue')) return 'bg-blue-500'
    if (colorLower.includes('verde') || colorLower.includes('green')) return 'bg-green-500'
    if (colorLower.includes('amarillo') || colorLower.includes('yellow')) return 'bg-yellow-500'
    if (colorLower.includes('rosa') || colorLower.includes('pink')) return 'bg-pink-500'
    if (colorLower.includes('púrpura') || colorLower.includes('purple')) return 'bg-purple-500'
    if (colorLower.includes('naranja') || colorLower.includes('orange')) return 'bg-orange-500'
    return 'bg-gray-400'
  }

  const getSizeIcon = (size: string) => {
    const sizeLower = size.toLowerCase()
    if (sizeLower.includes('gb') || sizeLower.includes('tb')) return 'hi-cube'
    if (sizeLower.includes('xl') || sizeLower.includes('large')) return 'hi-arrows-expand'
    if (sizeLower.includes('small') || sizeLower.includes('xs')) return 'hi-minus'
    return 'hi-adjustments'
  }

  return {
    // State
    variants,
    loading,
    error,
    currentProductId,
    // Getters
    variantCount,
    hasVariants,
    totalVariantStock,
    lowStockVariants,
    outOfStockVariants,
    inStockVariants,
    variantsByColor,
    variantsBySize,
    uniqueColors,
    uniqueSizes,
    // Actions
    fetchVariants,
    fetchVariantsByProduct,
    fetchVariantById,
    addVariant,
    removeVariant,
    updateVariant,
    getVariantById,
    clearVariants,
    getStockStatus,
    getColorClass,
    getSizeIcon,
  }
})
