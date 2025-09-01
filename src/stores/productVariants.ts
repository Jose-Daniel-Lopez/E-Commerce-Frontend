import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

// =======================
// 🧩 Interfaces
// =======================

/**
 * Represents a specific variation of a product (e.g., size, color).
 * Used for inventory tracking and customer selection.
 *
 * Example: A smartphone in "128GB / Black" or "256GB / Blue".
 */
export interface ProductVariant {
  id: number
  size: string        // e.g., "64GB", "XL", "Medium"
  color: string       // e.g., "Black", "Blanco", "Rojo"
  stock: number       // Available units for this variant
  sku: string         // Unique stock-keeping unit identifier
  _links?: {
    self?: { href: string }           // Self-reference (HAL)
    productVariant?: { href: string } // Link to this variant
    product?: { href: string }        // Link to parent product
  }
}

/**
 * Minimal product reference used when variants are grouped under a product.
 * Only essential fields are included for lightweight data transfer.
 */
export interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  totalStock: number
}

// =======================
// 🛒 Product Variants Store
// =======================

/**
 * Manages the state of product variants in the application.
 *
 * This store handles:
 * - Fetching variants (all or by product)
 * - Variant inventory status (stock levels)
 * - Grouping and filtering (by color, size)
 * - Utility functions for UI (color classes, icons)
 *
 * Designed to work with Spring Data REST HAL responses.
 */
export const useProductVariantsStore = defineStore('productVariants', () => {
  // =======================
  // 📦 State
  // =======================

  /**
   * List of currently loaded product variants.
   * Populated via API calls (e.g., by product ID).
   */
  const variants = ref<ProductVariant[]>([])

  /**
   * Loading state to control spinners or disable UI during async operations.
   */
  const loading = ref(false)

  /**
   * Error message to display if an API call fails.
   */
  const error = ref('')

  /**
   * Tracks the currently active product ID.
   * Useful for context-aware operations (e.g., filtering, navigation).
   */
  const currentProductId = ref<number | null>(null)

  // =======================
  // 🔍 Getters (Computed State)
  // =======================

  /**
   * Total number of loaded variants.
   */
  const variantCount = computed(() => variants.value.length)

  /**
   * Whether any variants are currently loaded.
   */
  const hasVariants = computed(() => variants.value.length > 0)

  /**
   * Sum of stock across all variants.
   * Reflects total available inventory for the current product.
   */
  const totalVariantStock = computed(() => {
    return variants.value.reduce((total, variant) => total + variant.stock, 0)
  })

  /**
   * Variants with critically low stock (5 or fewer units).
   * Used for inventory alerts or dashboard highlights.
   */
  const lowStockVariants = computed(() => {
    return variants.value.filter((variant) => variant.stock <= 5)
  })

  /**
   * Variants that are completely out of stock.
   * Useful for filtering or reporting.
   */
  const outOfStockVariants = computed(() => {
    return variants.value.filter((variant) => variant.stock === 0)
  })

  /**
   * Variants that are currently in stock.
   * Can be used to show available options in UI.
   */
  const inStockVariants = computed(() => {
    return variants.value.filter((variant) => variant.stock > 0)
  })

  /**
   * Groups variants by color for display in filters or selectors.
   * @returns Record<string, ProductVariant[]> - e.g., { "Black": [...], "Blue": [...] }
   */
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

  /**
   * Groups variants by size for filtering or UI layout.
   * @returns Record<string, ProductVariant[]> - e.g., { "64GB": [...], "128GB": [...] }
   */
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

  /**
   * List of unique colors across all variants.
   * Useful for rendering color filters or swatches.
   */
  const uniqueColors = computed(() => {
    return [...new Set(variants.value.map((variant) => variant.color))]
  })

  /**
   * List of unique sizes across all variants.
   * Used in size dropdowns or filter chips.
   */
  const uniqueSizes = computed(() => {
    return [...new Set(variants.value.map((variant) => variant.size))]
  })

  // =======================
  // ⚙️ Actions (Methods)
  // =======================

  /**
   * Fetches all product variants from the backend.
   * Handles both HAL (_embedded) and plain JSON responses.
   */
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

  /**
   * Fetches all variants associated with a specific product.
   * Updates `currentProductId` for context tracking.
   *
   * @param productId - ID of the parent product
   */
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

  /**
   * Fetches a single variant by ID.
   * Used when editing or viewing detailed variant info.
   *
   * @param variantId - ID of the variant
   * @returns Promise<ProductVariant> - The fetched variant
   * @throws Error if the request fails
   */
  const fetchVariantById = async (variantId: number) => {
    try {
      const response = await api.get(`/productVariants/${variantId}`)
      return response.data
    } catch (err) {
      console.error(`Error fetching variant ${variantId}:`, err)
      throw err
    }
  }

  /**
   * Adds a new variant to the local list (e.g., after creation).
   */
  const addVariant = (variant: ProductVariant) => {
    variants.value.push(variant)
  }

  /**
   * Removes a variant from the list by ID.
   */
  const removeVariant = (variantId: number) => {
    const index = variants.value.findIndex((variant) => variant.id === variantId)
    if (index > -1) {
      variants.value.splice(index, 1)
    }
  }

  /**
   * Updates an existing variant with partial data.
   */
  const updateVariant = (variantId: number, updatedVariant: Partial<ProductVariant>) => {
    const index = variants.value.findIndex((variant) => variant.id === variantId)
    if (index > -1) {
      variants.value[index] = { ...variants.value[index], ...updatedVariant }
    }
  }

  /**
   * Finds a variant by ID in the current list.
   *
   * @param variantId - ID of the variant
   * @returns ProductVariant | undefined
   */
  const getVariantById = (variantId: number) => {
    return variants.value.find((variant) => variant.id === variantId)
  }

  /**
   * Clears all variant-related state (useful for resets or route changes).
   */
  const clearVariants = () => {
    variants.value = []
    error.value = ''
    currentProductId.value = null
  }

  // =======================
  // 🎨 Utility Functions
  // =======================

  /**
   * Determines the stock status and returns display-friendly text and Tailwind classes.
   *
   * @param stock - Current stock level
   * @returns Object with `text`, `color`, and `bgColor` for UI rendering
   */
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' }
    if (stock <= 5) return { text: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100' }
  }

  /**
   * Maps a color name to a corresponding Tailwind CSS background class.
   * Supports both English and Spanish names.
   *
   * @param color - Color name (e.g., "Black", "Negro")
   * @returns Tailwind class (e.g., "bg-gray-800")
   */
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

  /**
   * Returns an appropriate icon name based on the size value.
   * Used in UI to visually represent variant types.
   *
   * @param size - Size string (e.g., "64GB", "XL")
   * @returns Hero Icon name (e.g., "hi-cube", "hi-arrows-expand")
   */
  const getSizeIcon = (size: string) => {
    const sizeLower = size.toLowerCase()
    if (sizeLower.includes('gb') || sizeLower.includes('tb')) return 'hi-cube'           // Storage
    if (sizeLower.includes('xl') || sizeLower.includes('large')) return 'hi-arrows-expand' // Large size
    if (sizeLower.includes('small') || sizeLower.includes('xs')) return 'hi-minus'         // Small size
    return 'hi-adjustments'                                                               // Default
  }

  // =======================
  // 📤 Expose Everything
  // =======================

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

    // Utilities
    getStockStatus,
    getColorClass,
    getSizeIcon,
  }
})
