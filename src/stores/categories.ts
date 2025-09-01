import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'
import type { Product } from '@/types/Product'

export interface Category {
  id: number
  name: string
  icon: string
  products?: Array<Product>
}

export const useCategoriesStore = defineStore('categories', () => {
  // State
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref('')

  // Getters
  const categoryCount = computed(() => categories.value.length)
  const hasCategories = computed(() => categories.value.length > 0)

  const totalProducts = computed(() => {
    return categories.value.reduce((total, category) => {
      return total + (category.products ? category.products.length : 0)
    }, 0)
  })

  // Actions
  const fetchCategories = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await api.get('/categories')

      // Check if response contains embedded categories
      categories.value = response.data._embedded
        ? response.data._embedded.categories
        : response.data

      // Load products for each category
      for (const category of categories.value) {
        try {
          await fetchCategoryWithProducts(category.id)
        } catch (err) {
          console.warn(`Could not load products for category ${category.id}:`, err)
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      error.value = 'Error loading categories'
    } finally {
      loading.value = false
    }
  }

  const fetchCategoryWithProducts = async (categoryId: number) => {
    try {
      const response = await api.get(`/categories/${categoryId}/products`)
      const products = response.data._embedded ? response.data._embedded.products : response.data

      // Actualizar la categoría con sus productos
      const categoryIndex = categories.value.findIndex((cat) => cat.id === categoryId)
      if (categoryIndex > -1) {
        categories.value[categoryIndex].products = products
      }

      return products
    } catch (err) {
      console.error(`Error fetching products for category ${categoryId}:`, err)
      throw err
    }
  }

  const addCategory = (category: Category) => {
    categories.value.push(category)
  }

  const removeCategory = (categoryId: number) => {
    const index = categories.value.findIndex((category) => category.id === categoryId)
    if (index > -1) {
      categories.value.splice(index, 1)
    }
  }

  const updateCategory = (categoryId: number, updatedCategory: Partial<Category>) => {
    const index = categories.value.findIndex((category) => category.id === categoryId)
    if (index > -1) {
      categories.value[index] = { ...categories.value[index], ...updatedCategory }
    }
  }

  const getCategoryById = (categoryId: number) => {
    return categories.value.find((category) => category.id === categoryId)
  }

  const getProductCount = (categoryId: number) => {
    const category = getCategoryById(categoryId)
    return category?.products ? category.products.length : 0
  }

  const clearCategories = () => {
    categories.value = []
    error.value = ''
  }

  return {
    // State
    categories,
    loading,
    error,
    // Getters
    categoryCount,
    hasCategories,
    totalProducts,
    // Actions
    fetchCategories,
    fetchCategoryWithProducts,
    addCategory,
    removeCategory,
    updateCategory,
    getCategoryById,
    getProductCount,
    clearCategories,
  }
})
