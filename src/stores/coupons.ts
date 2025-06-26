import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export interface DiscountCode {
  id: number
  code: string
  discountAmount: number
  expiryDate: string
  active: boolean
  _links?: {
    self?: {
      href: string
    }
    orders?: {
      href: string
    }
  }
}

export const useCouponsStore = defineStore('coupons', () => {
  // State
  const coupons = ref<DiscountCode[]>([])
  const loading = ref(false)
  const error = ref('')

  // Getters
  const couponCount = computed(() => coupons.value.length)
  const hasCoupons = computed(() => coupons.value.length > 0)
  const activeCoupons = computed(() => coupons.value.filter(coupon => coupon.active))
  const expiredCoupons = computed(() =>
    coupons.value.filter(coupon => new Date(coupon.expiryDate) < new Date())
  )
  const validCoupons = computed(() =>
    coupons.value.filter(coupon =>
      coupon.active && new Date(coupon.expiryDate) >= new Date()
    )
  )

  // Actions
  const fetchCoupons = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await api.get('/discountCodes')
      // Handle Spring Data REST response format
      coupons.value = response.data._embedded
        ? response.data._embedded.discountCodes
        : response.data
    } catch (err) {
      console.error('Error fetching discount codes:', err)
      error.value = 'Error loading discount codes'
    } finally {
      loading.value = false
    }
  }

  const getCouponById = (couponId: number) => {
    return coupons.value.find((coupon) => coupon.id === couponId)
  }

  const addCoupon = (coupon: DiscountCode) => {
    coupons.value.push(coupon)
  }

  const removeCoupon = (couponId: number) => {
    const index = coupons.value.findIndex((coupon) => coupon.id === couponId)
    if (index > -1) {
      coupons.value.splice(index, 1)
    }
  }

  const updateCoupon = (couponId: number, updatedCoupon: Partial<DiscountCode>) => {
    const index = coupons.value.findIndex((coupon) => coupon.id === couponId)
    if (index > -1) {
      coupons.value[index] = { ...coupons.value[index], ...updatedCoupon }
    }
  }

  const clearCoupons = () => {
    coupons.value = []
    error.value = ''
  }

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  const isExpiringSoon = (expiryDate: string, days: number = 7) => {
    const expiry = new Date(expiryDate)
    const soon = new Date()
    soon.setDate(soon.getDate() + days)
    return expiry <= soon && expiry >= new Date()
  }

  const getStatusColor = (coupon: DiscountCode) => {
    if (!coupon.active) return 'bg-gray-100 text-gray-600'
    if (isExpired(coupon.expiryDate)) return 'bg-red-100 text-red-600'
    if (isExpiringSoon(coupon.expiryDate)) return 'bg-yellow-100 text-yellow-600'
    return 'bg-green-100 text-green-600'
  }

  const getStatusText = (coupon: DiscountCode) => {
    if (!coupon.active) return 'Inactive'
    if (isExpired(coupon.expiryDate)) return 'Expired'
    if (isExpiringSoon(coupon.expiryDate)) return 'Expiring Soon'
    return 'Active'
  }

  return {
    // State
    coupons,
    loading,
    error,
    // Getters
    couponCount,
    hasCoupons,
    activeCoupons,
    expiredCoupons,
    validCoupons,
    // Actions
    fetchCoupons,
    getCouponById,
    addCoupon,
    removeCoupon,
    updateCoupon,
    clearCoupons,
    isExpired,
    isExpiringSoon,
    getStatusColor,
    getStatusText,
  }
})
