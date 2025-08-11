import { ref } from 'vue'
import axios from '@/lib/axios'

export interface Review {
  id: number
  product: string
  rating: number
  comment: string
  date: string
}

export interface ProductReview {
  id: number
  rating: number
  comment: string
  date: string
  userName?: string
  userAvatar?: string
}

export function useReviewsStore() {
  const reviews = ref<Review[]>([])
  const productReviews = ref<ProductReview[]>([])
  const reviewsLoading = ref(false)
  const productReviewsLoading = ref(false)
  const reviewsError = ref('')
  const productReviewsError = ref('')

  const fetchUserReviews = async (userId: number) => {
    reviewsLoading.value = true
    reviewsError.value = ''
    try {
      const res = await axios.get(`/users/${userId}/productReviews`)
      const rawReviews = res.data._embedded?.productReviews || []
      const reviewPromises = rawReviews.map(async (review: { id: number; rating: number; comment: string; createdAt: string; _links: { product: { href: string } } }) => {
        let productName = ''
        try {
          const productRes = await axios.get(review._links.product.href)
          productName = productRes.data.name
        } catch {
          productName = 'Unknown Product'
        }
        return {
          id: review.id,
          product: productName,
          rating: review.rating,
          comment: review.comment,
          date: new Date(review.createdAt).toLocaleDateString(),
        }
      })
      reviews.value = await Promise.all(reviewPromises)
    } catch (err) {
      reviewsError.value = err instanceof Error ? err.message : 'Failed to load reviews.'
    } finally {
      reviewsLoading.value = false
    }
  }

  const fetchProductReviews = async (productId: number) => {
    productReviewsLoading.value = true
    productReviewsError.value = ''
    try {
      const res = await axios.get(`/products/${productId}/productReviews`)
      const rawReviews = res.data._embedded?.productReviews || []

      const reviewPromises = rawReviews.map(async (review: { id: number; rating: number; comment: string; createdAt: string; _links: { user: { href: string } } }) => {
        let userName = 'Anonymous'
        let userAvatar = ''
        try {
          const userRes = await axios.get(review._links.user.href)
          userName = userRes.data.name || userRes.data.username || 'Anonymous'
          userAvatar = userRes.data.avatar || ''
        } catch {
          userName = 'Anonymous'
          userAvatar = ''
        }

        return {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          date: new Date(review.createdAt).toLocaleDateString(),
          userName,
          userAvatar,
        }
      })

      productReviews.value = await Promise.all(reviewPromises)
    } catch (err) {
      productReviewsError.value = err instanceof Error ? err.message : 'Failed to load product reviews.'
    } finally {
      productReviewsLoading.value = false
    }
  }

  return {
    reviews,
    productReviews,
    reviewsLoading,
    productReviewsLoading,
    reviewsError,
    productReviewsError,
    fetchUserReviews,
    fetchProductReviews,
  }
}
