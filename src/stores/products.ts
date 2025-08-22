import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/Product'
import api from '@/lib/axios'

// =======================
// 🔧 Interfaces
// =======================

/**
 * Pagination metadata returned from the backend.
 * Matches Spring Data REST's page structure.
 */
interface PaginationInfo {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  numberOfElements: number
}

/**
 * Aggregated statistics about products (e.g., totals, averages).
 */
interface ProductStats {
  totalProducts: number
  inStockProducts: number
  outOfStockProducts: number
  averagePrice: number
}

/**
 * Brand filter option with selection state.
 */
interface Brand {
  name: string
  checked: boolean
}

/**
 * Backend response structure for a single product.
 * May be partial or inconsistent; transformation is required.
 */
interface BackendProductResponse {
  id?: number
  name?: string
  description?: string
  brand?: string
  isFeatured?: boolean
  imageUrl?: string | null
  basePrice?: number
  totalStock?: number
  cpu?: string
  memory?: string
  camera?: string
  createdAt?: string
  rating?: number | null
  categoryName?: string // Add optional categoryName
}

/**
 * Simplified backend response for category-based product listing.
 * Does not include all fields (e.g., rating may be missing).
 */
interface BackendCategoryProductResponse {
  id?: number
  name?: string
  basePrice?: number
  imageUrl?: string | null
  description?: string
  brand?: string
  isFeatured?: boolean
  totalStock?: number
  cpu?: string
  memory?: string
  camera?: string
  createdAt?: string
  rating?: number
}

// =======================
// 🛒 Product Store Definition
// =======================

/**
 * Centralized store for managing product state, including:
 * - Product listings (all, featured, by category)
 * - Filters (brands, memory, price, stock)
 * - Pagination
 * - Statistics
 * - Utility functions
 *
 * This store uses Axios via `api` to interact with the backend.
 */
export const useProductStore = defineStore('product', () => {
  // =======================
  // 📦 State
  // =======================

  /**
   * List of currently displayed products (e.g., all, filtered, or by category).
   */
  const products = ref<Product[]>([])

  /**
   * Available brand filter options, fetched from backend.
   * Each has a `checked` flag for UI selection.
   */
  const brands = ref<Brand[]>([])

  /**
   * Loading state to control UI spinners or disable interactions.
   */
  const loading = ref(false)

  /**
   * Error message to display to the user (e.g., network failure).
   */
  const error = ref('')

  /**
   * List of featured products (highlighted on homepage).
   */
  const featuredProducts = ref<Product[]>([])

  /**
   * Tracks the currently active category ID for context-aware operations.
   * `null` means no category is selected (e.g., viewing all products).
   */
  const currentCategoryId = ref<number | null>(null)

  /**
   * Aggregated product statistics (total, in stock, avg price).
   * Fetched separately from product lists for performance.
   */
  const stats = ref<ProductStats>({
    totalProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
    averagePrice: 0,
  })

  /**
   * Pagination metadata for the current product list.
   * Updated after each fetch to support navigation.
   */
  const pagination = ref<PaginationInfo>({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    numberOfElements: 0,
  })

  // =======================
  // 🔍 Getters (Computed State)
  // =======================

  /**
   * Total number of currently loaded products.
   */
  const productCount = computed(() => products.value.length)

  /**
   * Whether any products are currently loaded.
   */
  const hasProducts = computed(() => products.value.length > 0)

  /**
   * Products that are in stock (totalStock > 0).
   */
  const inStockProducts = computed(() => {
    return products.value.filter((product) => product.totalStock > 0)
  })

  /**
   * Products that are out of stock (totalStock === 0).
   */
  const outOfStockProducts = computed(() => {
    return products.value.filter((product) => product.totalStock === 0)
  })

  /**
   * Average base price of all currently loaded products.
   * Rounded to 2 decimal places.
   */
  const averagePrice = computed(() => {
    if (products.value.length === 0) return 0
    const total = products.value.reduce((sum, product) => sum + product.basePrice, 0)
    return Math.round((total / products.value.length) * 100) / 100
  })

  // =======================
  // ⚙️ Actions (Methods)
  // =======================

  /**
   * Fetches a paginated list of all products from the backend.
   * Transforms the response to ensure consistent `Product` structure.
   * Handles both HAL (_embedded) and plain JSON formats.
   *
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   */
  const fetchProducts = async (page = 0, size = 20) => {
    loading.value = true
    error.value = ''
    try {
      const response = await api.get('/products', {
        params: { page, size },
      })
      const data = response.data
      const rawProducts = data._embedded ? data._embedded.products : data.content

      // 🔍 Debug: Inspect raw API response structure
      console.log('🔍 [fetchProducts] Raw response structure:', {
        hasEmbedded: !!data._embedded,
        hasContent: !!data.content,
        rawProductsLength: rawProducts?.length || 0,
        firstProduct: rawProducts?.[0],
        firstProductRating: rawProducts?.[0]?.rating,
        ratingType: typeof rawProducts?.[0]?.rating,
      })

      // Transform backend data into consistent frontend Product objects
      const transformedProducts = (rawProducts || []).map((product: BackendProductResponse, index: number) => {
        // Log if product is missing ID to help debug data issues
        if (!product.id) {
          console.warn(`🔍 [fetchProducts] Product at index ${index} missing ID:`, product.name)
        }

        console.log(`🔍 [fetchProducts] Product ${index}:`, {
          id: product.id,
          name: product.name,
          rating: product.rating,
          ratingType: typeof product.rating,
          fullProduct: product,
        })

        return {
          id: product.id ?? index + 1, // Keep fallback for general products list
          name: product.name ?? 'Unknown Product',
          description: product.description ?? '',
          brand: product.brand ?? 'Unknown',
          isFeatured: product.isFeatured ?? false,
          imageUrl: product.imageUrl ?? 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
          basePrice: product.basePrice ?? 0,
          totalStock: product.totalStock ?? 10,
          cpu: product.cpu ?? '',
          memory: product.memory ?? '',
          camera: product.camera ?? '',
          createdAt: product.createdAt ?? new Date().toISOString(),
          rating: typeof product.rating === 'number' ? product.rating : 0,
        }
      })

      console.log('🔍 [fetchProducts] Transformed products:', transformedProducts.map((p: Product) => ({ id: p.id, name: p.name, rating: p.rating })))

      products.value = transformedProducts
      currentCategoryId.value = null // Reset category context

      // Update pagination state from response
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

  /**
   * Fetches all products with pagination specifically optimized for the all products view.
   * Similar to fetchProducts but with additional category information for filtering.
   *
   * @param page - Page number (1-indexed for backend compatibility)
   * @param size - Number of items per page (default 20 for all products view)
   */
  const fetchAllProducts = async (page = 1, size = 20) => {
    loading.value = true
    error.value = ''
    try {
      const response = await api.get('/products', {
        params: { page, size },
      })
      const data = response.data
      const rawProducts = data._embedded ? data._embedded.products : data.content

      console.log('🔍 [fetchAllProducts] Raw response structure:', {
        hasEmbedded: !!data._embedded,
        hasContent: !!data.content,
        rawProductsLength: rawProducts?.length || 0,
        totalElements: data.page?.totalElements || data.totalElements || 0,
        requestedPage: page,
        requestedSize: size,
        fullPaginationData: data.page || data,
      })

      // Transform backend data and fetch category names for each product
      const transformedProducts = await Promise.all((rawProducts || []).map(async (product: BackendProductResponse, index: number) => {
        if (!product.id) {
          console.warn(`🔍 [fetchAllProducts] Product at index ${index} missing ID:`, product.name)
        }

        // Fetch category name for the product if it has category link
        let categoryName = 'Unknown'
        try {
          if (product.id) {
            const categoryResponse = await api.get(`/products/${product.id}/category`)
            categoryName = categoryResponse.data?.name || 'Unknown'
          }
        } catch (err) {
          console.warn(`Could not fetch category for product ${product.id}:`, err)
        }

        return {
          id: product.id ?? index + 1,
          name: product.name ?? 'Unknown Product',
          description: product.description ?? '',
          brand: product.brand ?? 'Unknown',
          isFeatured: product.isFeatured ?? false,
          imageUrl: product.imageUrl ?? 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
          basePrice: product.basePrice ?? 0,
          totalStock: product.totalStock ?? 10,
          cpu: product.cpu ?? '',
          memory: product.memory ?? '',
          camera: product.camera ?? '',
          createdAt: product.createdAt ?? new Date().toISOString(),
          rating: typeof product.rating === 'number' ? product.rating : 0,
          categoryName, // Add category name for filtering
        }
      }))

      console.log('🔍 [fetchAllProducts] Transformed products with categories:',
        transformedProducts.map((p: Product & { categoryName?: string }) => ({ id: p.id, name: p.name, category: p.categoryName }))
      )

      products.value = transformedProducts
      currentCategoryId.value = null // Reset category context

      // Update pagination state from response
      pagination.value = {
        page: data.page?.number || data.number || page,
        size: data.page?.size || data.size || size,
        totalElements: data.page?.totalElements || data.totalElements || 0,
        totalPages: data.page?.totalPages || data.totalPages || 0,
        first: data.page?.first || data.first || true,
        last: data.page?.last || data.last || true,
        numberOfElements: data.page?.numberOfElements || data.numberOfElements || 0,
      }

      console.log('🔍 [fetchAllProducts] Updated pagination state:', pagination.value)
    } catch (err) {
      console.error('Error fetching all products:', err)
      error.value = 'Error al cargar todos los productos'
    } finally {
      loading.value = false
    }
  }  /**
   * Fetches all featured products (isFeatured = true).
   * Used on the homepage or promotional sections.
   */
  const fetchFeaturedProducts = async () => {
    loading.value = true
    error.value = ''
    try {
      const response = await api.get('/products/search/findByIsFeatured?isFeatured=true')
      const rawProducts = response.data._embedded?.products || []

      featuredProducts.value = rawProducts.map((product: BackendProductResponse, index: number) => ({
        id: product.id ?? index + 1,
        name: product.name ?? 'Unknown Product',
        description: product.description ?? '',
        brand: product.brand ?? 'Unknown',
        isFeatured: product.isFeatured ?? false,
        imageUrl: product.imageUrl ?? 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
        basePrice: product.basePrice ?? 0,
        totalStock: product.totalStock ?? 10,
        cpu: product.cpu ?? '',
        memory: product.memory ?? '',
        camera: product.camera ?? '',
        createdAt: product.createdAt ?? new Date().toISOString(),
        rating: typeof product.rating === 'number' ? product.rating : 0,
      }))
    } catch (err) {
      console.error('Error fetching featured products:', err)
      error.value = 'Error al cargar los productos destacados'
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetches new products (endpoint-specific logic).
   * Returns a promise with transformed products (does not update main list).
   *
   * @returns Promise<Product[]> - List of new products
   */
  const fetchNewProducts = async (): Promise<Product[]> => {
    loading.value = true
    error.value = ''
    try {
      const response = await api.get('/products/new')
      const backendProducts: BackendProductResponse[] = response.data || []

      console.log(`🔍 [fetchNewProducts] Received ${backendProducts.length} products from backend`)

      // Transform backend data and fetch category names for each product
      const transformedProducts = await Promise.all(backendProducts.map(async (product, index) => {
        console.log(`🔍 [fetchNewProducts] Processing product ${index}:`, {
          id: product.id,
          name: product.name,
          basePrice: product.basePrice
        })

        // Fetch category name for the product if it has an ID
        let categoryName = 'smartphones' // Default fallback
        try {
          if (product.id) {
            const categoryResponse = await api.get(`/products/${product.id}/category`)
            categoryName = categoryResponse.data?.name?.toLowerCase() || 'smartphones'
          }
        } catch (err) {
          console.warn(`Could not fetch category for product ${product.id}:`, err)
        }

        return {
          id: product.id ?? index, // Keep fallback just in case
          name: product.name ?? 'Unknown Product',
          description: product.description ?? '',
          brand: product.brand ?? 'Unknown',
          isFeatured: product.isFeatured ?? false,
          imageUrl: product.imageUrl ?? 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
          basePrice: product.basePrice ?? 0,
          totalStock: product.totalStock ?? 10,
          cpu: product.cpu ?? '',
          memory: product.memory ?? '',
          camera: product.camera ?? '',
          createdAt: product.createdAt ?? new Date().toISOString(),
          rating: typeof product.rating === 'number' ? product.rating : 0,
          categoryName: categoryName, // Add fetched categoryName
        }
      }))

      return transformedProducts
    } catch (err) {
      console.error('Error fetching new products:', err)
      error.value = 'Error al cargar los productos nuevos'
      return []
    } finally {
      loading.value = false
    }
  }  /**
   * Fetches unique brand names from the backend and initializes filter options.
   */
  const fetchBrands = async () => {
    try {
      const response = await api.get<string[]>('/products/brands')
      brands.value = response.data.map((name) => ({ name, checked: false }))
    } catch (err) {
      console.error('Error fetching brands:', err)
    }
  }

  /**
   * Fetches products belonging to a specific category (by ID).
   *
   * @param categoryId - ID of the category
   * @param page - Page number
   * @param size - Page size
   */
  const fetchProductsByCategory = async (categoryId: number, page = 0, size = 20) => {
    loading.value = true
    error.value = ''
    currentCategoryId.value = categoryId
    try {
      const response = await api.get(`/categories/${categoryId}/products`, {
        params: { page, size },
      })
      const data = response.data
      const rawProducts = data._embedded ? data._embedded.products : data.content

      console.log('🔍 [fetchProductsByCategory] Raw response structure:', {
        categoryId,
        hasEmbedded: !!data._embedded,
        hasContent: !!data.content,
        rawProductsLength: rawProducts?.length || 0,
        firstProduct: rawProducts?.[0],
        firstProductRating: rawProducts?.[0]?.rating,
        ratingType: typeof rawProducts?.[0]?.rating,
      })

      const transformedProducts = (rawProducts || []).map((product: BackendProductResponse, index: number) => {
        console.log(`🔍 [fetchProductsByCategory] Product ${index}:`, {
          id: product.id,
          name: product.name,
          rating: product.rating,
          ratingType: typeof product.rating,
          fullProduct: product,
        })
        return {
          id: product.id ?? index + 1,
          name: product.name ?? 'Unknown Product',
          description: product.description ?? '',
          brand: product.brand ?? 'Unknown',
          isFeatured: product.isFeatured ?? false,
          imageUrl: product.imageUrl ?? 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
          basePrice: product.basePrice ?? 0,
          totalStock: product.totalStock ?? 10,
          cpu: product.cpu ?? '',
          memory: product.memory ?? '',
          camera: product.camera ?? '',
          createdAt: product.createdAt ?? new Date().toISOString(),
          rating: typeof product.rating === 'number' ? product.rating : 0,
        }
      })

      console.log('🔍 [fetchProductsByCategory] Transformed products:', transformedProducts.map((p: Product) => ({ id: p.id, name: p.name, rating: p.rating })))

      products.value = transformedProducts

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

  /**
   * Fetches products by category name. Used in category landing pages.
   * Some responses may lack ratings, so we fetch them individually.
   *
   * @param categoryName - Name of the category (e.g., "Smartphones")
   * @param page - Page number
   * @param size - Page size
   */
  const fetchProductsByCategoryName = async (categoryName: string, page = 0, size = 9) => {
    loading.value = true
    error.value = ''
    try {
      // First, find the category by name to get its ID
      const categoriesResponse = await api.get('/categories')
      const categories = categoriesResponse.data._embedded?.categories || []
      const category = categories.find((cat: { name: string; id: number }) => cat.name === categoryName)

      if (!category) {
        throw new Error(`Category "${categoryName}" not found`)
      }

      // Use the standard categories/{id}/products endpoint which includes full product data
      const response = await api.get(`/categories/${category.id}/products`, {
        params: { page, size },
      })
      const data = response.data

      console.log('🔍 [fetchProductsByCategoryName] Raw response structure:', {
        categoryName,
        hasEmbedded: !!data._embedded,
        dataStructure: data,
        rawProductsLength: (data._embedded?.products || [])?.length || 0,
        firstProduct: (data._embedded?.products || [])?.[0],
        firstProductRating: (data._embedded?.products || [])?.[0]?.rating,
        ratingType: typeof (data._embedded?.products || [])?.[0]?.rating,
      })

      // Extract products from HAL response (_embedded.products)
      const rawProducts = data._embedded?.products || []

      // Log full structure of first product for debugging API inconsistencies
      if (rawProducts[0]) {
        console.log('🔍 [fetchProductsByCategoryName] Full first product structure:',
          JSON.stringify(rawProducts[0], null, 2)
        )
        console.log('🔍 [fetchProductsByCategoryName] Available fields:',
          Object.keys(rawProducts[0])
        )
      }

      // Step 1: Map basic product data - DON'T use index fallback for ID!
      const initialProducts = rawProducts.map((product: BackendCategoryProductResponse) => {
        if (!product.id) {
          console.warn('🔍 [fetchProductsByCategoryName] Product missing ID:', product)
        }
        return {
          id: product.id!, // Use actual product ID (required)
          name: product.name || 'Unknown Product',
          description: product.description || '',
          brand: product.brand || 'Unknown',
          isFeatured: product.isFeatured || false,
          imageUrl: product.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
          basePrice: product.basePrice || 0,
          totalStock: product.totalStock || 10,
          cpu: product.cpu || '',
          memory: product.memory || '',
          camera: product.camera || '',
          createdAt: product.createdAt || new Date().toISOString(),
          rating: typeof product.rating === 'number' ? product.rating : 0, // Use existing rating if available
        }
      })

      console.log('🔍 [fetchProductsByCategoryName] Products mapped:', initialProducts.length)
      console.log('🔍 [fetchProductsByCategoryName] Final products:',
        initialProducts.map((p: Product) => ({ id: p.id, name: p.name, rating: p.rating }))
      )

      products.value = initialProducts

      // Update pagination (fallback logic if backend doesn't return full metadata)
      pagination.value = {
        page: data.page?.number || data.number || page,
        size: data.page?.size || data.size || size,
        totalElements: data.page?.totalElements || data.totalElements || initialProducts.length,
        totalPages: data.page?.totalPages || data.totalPages || Math.ceil(initialProducts.length / size),
        first: data.page?.first || data.first || page === 0,
        last: data.page?.last || data.last || page >= Math.ceil(initialProducts.length / size) - 1,
        numberOfElements: data.page?.numberOfElements || data.numberOfElements || initialProducts.length,
      }
    } catch (err) {
      console.error(`Error fetching products for category "${categoryName}":`, err)
      error.value = 'Error al cargar los productos de la categoría'
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetches a single product by ID (full details).
   *
   * @param productId - ID of the product
   * @returns Promise<Product> - The product data
   * @throws Error if the request fails
   */
  const fetchProductById = async (productId: number) => {
    try {
      const response = await api.get(`/products/${productId}`)
      return response.data
    } catch (err) {
      console.error(`Error fetching product ${productId}:`, err)
      throw err
    }
  }

  /**
   * Adds a product to the local list (e.g., after creation).
   */
  const addProduct = (product: Product) => {
    products.value.push(product)
  }

  /**
   * Removes a product from the local list by ID.
   */
  const removeProduct = (productId: number) => {
    const index = products.value.findIndex((p) => p.id === productId)
    if (index > -1) {
      products.value.splice(index, 1)
    }
  }

  /**
   * Updates a product by merging new data.
   */
  const updateProduct = (productId: number, updatedProduct: Partial<Product>) => {
    const index = products.value.findIndex((p) => p.id === productId)
    if (index > -1) {
      products.value[index] = { ...products.value[index], ...updatedProduct }
    }
  }

  /**
   * Finds a product by ID in the current list.
   */
  const getProductById = (productId: number) => {
    return products.value.find((p) => p.id === productId)
  }

  /**
   * Filters products by name or description (case-insensitive).
   * @deprecated Use searchProductsAPI for server-side search instead
   */
  const searchProducts = (searchTerm: string) => {
    if (!searchTerm.trim()) return products.value
    const term = searchTerm.toLowerCase()
    return products.value.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term),
    )
  }

  /**
   * Searches products using the backend search API.
   * Supports searching across product names, brands, descriptions, and category names.
   *
   * @param searchTerm - The search query
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @param sort - Sort criteria (e.g., 'name,asc', 'basePrice,desc')
   */
  const searchProductsAPI = async (searchTerm: string, page = 0, size = 20, sort = 'name,asc') => {
    loading.value = true
    error.value = ''
    try {
      const response = await api.get('/products/search', {
        params: {
          q: searchTerm.trim(),
          page,
          size,
          sort
        },
      })
      const data = response.data
      const rawProducts = data._embedded ? data._embedded.products : data.content

      console.log('🔍 [searchProductsAPI] Raw response structure:', {
        searchTerm,
        hasEmbedded: !!data._embedded,
        hasContent: !!data.content,
        rawProductsLength: rawProducts?.length || 0,
        totalElements: data.page?.totalElements || data.totalElements || 0,
      })

      // Transform backend data and fetch category names for each product
      const transformedProducts = await Promise.all((rawProducts || []).map(async (product: BackendProductResponse, index: number) => {
        if (!product.id) {
          console.warn(`🔍 [searchProductsAPI] Product at index ${index} missing ID:`, product.name)
        }

        // Fetch category name for the product if it has category link
        let categoryName = 'Unknown'
        try {
          if (product.id) {
            const categoryResponse = await api.get(`/products/${product.id}/category`)
            categoryName = categoryResponse.data?.name || 'Unknown'
          }
        } catch (err) {
          console.warn(`Could not fetch category for product ${product.id}:`, err)
        }

        return {
          id: product.id ?? index + 1,
          name: product.name ?? 'Unknown Product',
          description: product.description ?? '',
          brand: product.brand ?? 'Unknown',
          isFeatured: product.isFeatured ?? false,
          imageUrl: product.imageUrl ?? 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
          basePrice: product.basePrice ?? 0,
          totalStock: product.totalStock ?? 10,
          cpu: product.cpu ?? '',
          memory: product.memory ?? '',
          camera: product.camera ?? '',
          createdAt: product.createdAt ?? new Date().toISOString(),
          rating: typeof product.rating === 'number' ? product.rating : 0,
          categoryName, // Add category name for filtering
        }
      }))

      console.log('🔍 [searchProductsAPI] Transformed search results:',
        transformedProducts.map((p: Product & { categoryName?: string }) => ({ id: p.id, name: p.name, category: p.categoryName }))
      )

      products.value = transformedProducts
      currentCategoryId.value = null // Reset category context for search results

      // Update pagination state from response
      pagination.value = {
        page: data.page?.number || data.number || page,
        size: data.page?.size || data.size || size,
        totalElements: data.page?.totalElements || data.totalElements || 0,
        totalPages: data.page?.totalPages || data.totalPages || 0,
        first: data.page?.first || data.first || true,
        last: data.page?.last || data.last || true,
        numberOfElements: data.page?.numberOfElements || data.numberOfElements || 0,
      }

      console.log('🔍 [searchProductsAPI] Updated pagination state:', pagination.value)
      return transformedProducts
    } catch (err) {
      console.error('Error searching products:', err)
      error.value = 'Error al buscar productos'
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Advanced search using the backend advanced search API.
   * Allows searching by specific criteria like name, category, brand.
   *
   * @param params - Search parameters
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @param sort - Sort criteria
   */
  const advancedSearchProductsAPI = async (
    params: { name?: string; category?: string; brand?: string },
    page = 0,
    size = 20,
    sort = 'name,asc'
  ) => {
    loading.value = true
    error.value = ''
    try {
      const searchParams = new URLSearchParams()
      if (params.name) searchParams.append('name', params.name)
      if (params.category) searchParams.append('category', params.category)
      if (params.brand) searchParams.append('brand', params.brand)
      searchParams.append('page', page.toString())
      searchParams.append('size', size.toString())
      searchParams.append('sort', sort)

      const response = await api.get(`/products/search/advanced?${searchParams}`)
      const data = response.data
      const rawProducts = data._embedded ? data._embedded.products : data.content

      console.log('🔍 [advancedSearchProductsAPI] Raw response structure:', {
        params,
        hasEmbedded: !!data._embedded,
        hasContent: !!data.content,
        rawProductsLength: rawProducts?.length || 0,
        totalElements: data.page?.totalElements || data.totalElements || 0,
      })

      // Transform backend data similar to other methods
      const transformedProducts = await Promise.all((rawProducts || []).map(async (product: BackendProductResponse, index: number) => {
        if (!product.id) {
          console.warn(`🔍 [advancedSearchProductsAPI] Product at index ${index} missing ID:`, product.name)
        }

        // Fetch category name for the product if it has category link
        let categoryName = 'Unknown'
        try {
          if (product.id) {
            const categoryResponse = await api.get(`/products/${product.id}/category`)
            categoryName = categoryResponse.data?.name || 'Unknown'
          }
        } catch (err) {
          console.warn(`Could not fetch category for product ${product.id}:`, err)
        }

        return {
          id: product.id ?? index + 1,
          name: product.name ?? 'Unknown Product',
          description: product.description ?? '',
          brand: product.brand ?? 'Unknown',
          isFeatured: product.isFeatured ?? false,
          imageUrl: product.imageUrl ?? 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
          basePrice: product.basePrice ?? 0,
          totalStock: product.totalStock ?? 10,
          cpu: product.cpu ?? '',
          memory: product.memory ?? '',
          camera: product.camera ?? '',
          createdAt: product.createdAt ?? new Date().toISOString(),
          rating: typeof product.rating === 'number' ? product.rating : 0,
          categoryName, // Add category name for filtering
        }
      }))

      console.log('🔍 [advancedSearchProductsAPI] Transformed advanced search results:',
        transformedProducts.map((p: Product & { categoryName?: string }) => ({ id: p.id, name: p.name, category: p.categoryName }))
      )

      products.value = transformedProducts
      currentCategoryId.value = null // Reset category context for search results

      // Update pagination state from response
      pagination.value = {
        page: data.page?.number || data.number || page,
        size: data.page?.size || data.size || size,
        totalElements: data.page?.totalElements || data.totalElements || 0,
        totalPages: data.page?.totalPages || data.totalPages || 0,
        first: data.page?.first || data.first || true,
        last: data.page?.last || data.last || true,
        numberOfElements: data.page?.numberOfElements || data.numberOfElements || 0,
      }

      return transformedProducts
    } catch (err) {
      console.error('Error performing advanced search:', err)
      error.value = 'Error en búsqueda avanzada'
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Filters products by price range.
   */
  const filterProductsByPrice = (minPrice: number, maxPrice: number) => {
    return products.value.filter(
      (product) => product.basePrice >= minPrice && product.basePrice <= maxPrice,
    )
  }

  /**
   * Filters products by stock status.
   */
  const filterProductsByStock = (inStock: boolean) => {
    return inStock ? inStockProducts.value : outOfStockProducts.value
  }

  /**
   * Clears all product-related state (useful for resets or logout).
   */
  const clearProducts = () => {
    products.value = []
    error.value = ''
    currentCategoryId.value = null
  }

  // =======================
  // 📖 Pagination Actions
  // =======================

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
      const nextPage = pagination.value.page + 1
      if (currentCategoryId.value) {
        await fetchProductsByCategory(currentCategoryId.value, nextPage, pagination.value.size)
      } else {
        await fetchProducts(nextPage, pagination.value.size)
      }
    }
  }

  const goToPreviousPage = async () => {
    if (!pagination.value.first) {
      const prevPage = pagination.value.page - 1
      if (currentCategoryId.value) {
        await fetchProductsByCategory(currentCategoryId.value, prevPage, pagination.value.size)
      } else {
        await fetchProducts(prevPage, pagination.value.size)
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
      const lastPage = pagination.value.totalPages - 1
      if (currentCategoryId.value) {
        await fetchProductsByCategory(currentCategoryId.value, lastPage, pagination.value.size)
      } else {
        await fetchProducts(lastPage, pagination.value.size)
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

  /**
   * Fetches related products for a given product ID.
   *
   * @param productId - ID of the product to find related products for
   * @param limit - Maximum number of related products to return (default: 3, max: 10)
   * @returns Promise<RelatedProduct[]> - List of related products
   */
  const fetchRelatedProducts = async (productId: number, limit = 3): Promise<{ name: string; imageUrl: string; basePrice: number }[]> => {
    try {
      const response = await api.get(`/products/${productId}/related`, {
        params: {
          limit: Math.min(limit, 10) // Ensure we don't exceed max of 10
        }
      })

      const relatedProducts = response.data || []

      console.log(`🔍 [fetchRelatedProducts] Fetched ${relatedProducts.length} related products for product ${productId}`)

      return relatedProducts
    } catch (err) {
      console.error(`Error fetching related products for product ${productId}:`, err)
      throw err
    }
  }

  // =======================
  // 🧮 Utility Functions
  // =======================

  /**
   * Determines stock status and returns display-friendly info.
   */
  const getStockStatus = (product: Product) => {
    if (product.totalStock === 0) return { status: 'out-of-stock', text: 'Sin stock', color: 'red' }
    if (product.totalStock <= 5) return { status: 'low-stock', text: 'Stock bajo', color: 'yellow' }
    return { status: 'in-stock', text: 'En stock', color: 'green' }
  }

  /**
   * Formats a number as a localized currency string (e.g., €129.99).
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  // =======================
  // 📤 Expose Everything
  // =======================

  return {
    // State
    products,
    featuredProducts,
    brands,
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
    fetchAllProducts,
    fetchFeaturedProducts,
    fetchNewProducts,
    fetchBrands,
    fetchProductsByCategory,
    fetchProductsByCategoryName,
    fetchProductById,
    fetchRelatedProducts,
    addProduct,
    removeProduct,
    updateProduct,
    getProductById,
    searchProducts,
    searchProductsAPI,
    advancedSearchProductsAPI,
    filterProductsByPrice,
    filterProductsByStock,
    clearProducts,

    // Pagination
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    changePageSize,

    // Utilities
    getStockStatus,
    formatPrice,
  }
})
