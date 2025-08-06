<template>
  <section
    :id="sectionId"
    :class="['transition-colors duration-200', sectionContainerClasses]"
  >
    <div class="flex items-center justify-between mb-6">
      <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
        <span :class="sectionHeaderClasses">{{ $t('account.reviews.title') }}</span>
      </h2>
      <span :class="['text-sm font-medium', textSecondaryClasses]"
        >{{ reviews.length }} {{ $t('account.reviews.reviews') }}</span
      >
    </div>
    <div class="space-y-4">
      <div v-if="reviewsLoading" :class="['py-4 text-center', loadingTextClasses]">
        <span class="font-medium opacity-80">Loading reviews...</span>
      </div>
      <div v-else-if="reviewsError" class="p-4 text-red-700 border border-red-200 rounded-lg dark:text-red-400 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <span class="font-semibold">{{ reviewsError }}</span>
      </div>
      <div v-else-if="reviews.length === 0" class="py-8 text-center">
        <v-icon name="hi-annotation" scale="2" :class="['mb-4 opacity-80', emptyStateIconClasses]" />
        <p :class="['text-base font-srProDisplay', emptyStateTextClasses]">{{ $t('account.reviews.empty') }}</p>
      </div>
      <div v-else class="max-h-[400px] overflow-y-auto custom-scrollbar pr-2 space-y-4">
        <div
          v-for="review in reviews"
          :key="review.id"
          :class="reviewCardClasses"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <span :class="reviewHeaderClasses">{{ review.product }}</span>
              <span class="ml-2 text-yellow-500 dark:text-yellow-400">{{ '★'.repeat(review.rating) }}</span>
            </div>
            <span :class="reviewMetaClasses">{{ review.date }}</span>
          </div>
          <p :class="['text-sm font-srProDisplay', reviewBodyClasses]">
            {{ review.comment }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Review {
  id: number
  product: string
  rating: number
  comment: string
  date: string
}

interface Props {
  sectionId: string
  reviews: Review[]
  reviewsLoading: boolean
  reviewsError: string
  sectionContainerClasses: string
  textClasses: string
  sectionHeaderClasses: string
  textSecondaryClasses: string
  loadingTextClasses: string
  emptyStateIconClasses: string
  emptyStateTextClasses: string
  reviewCardClasses: string
  reviewHeaderClasses: string
  reviewMetaClasses: string
  reviewBodyClasses: string
}

defineProps<Props>()
</script>

<style scoped>
/* Optimized scrollbar styles with hardware acceleration */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
  transform: translateZ(0); /* Hardware acceleration */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 6px;
}
</style>
