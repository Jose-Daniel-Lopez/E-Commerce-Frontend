import { ref } from 'vue'
import axios from '@/lib/axios'

export interface Review {
  id: number
  product: string
  rating: number
  comment: string
  date: string
}

export function useReviewsStore() {
  const reviews = ref<Review[]>([])
  const reviewsLoading = ref(false)
  const reviewsError = ref('')

  const fetchUserReviews = async (userId: number) => {
    reviewsLoading.value = true
    reviewsError.value = ''
    try {
      const res = await axios.get(`/users/${userId}/productReviews`)
      const rawReviews = res.data._embedded?.productReviews || []
      const reviewPromises = rawReviews.map(async (review: any) => {
        let productName = ''
        try {
          const productRes = await axios.get(review._links.product.href)
          productName = productRes.data.name
        } catch (e) {
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
    } catch (err: any) {
      reviewsError.value = err?.message || 'Failed to load reviews.'
    } finally {
      reviewsLoading.value = false
    }
  }

  return {
    reviews,
    reviewsLoading,
    reviewsError,
    fetchUserReviews,
  }
}
