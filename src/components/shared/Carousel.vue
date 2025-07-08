<template>
  <div class="relative px-2">
    <Swiper
      :modules="modules"
      :slides-per-view="6"
      :space-between="16"
      :navigation="true"
      :breakpoints="breakpoints"
      class="category-carousel"
      :watch-overflow="true"
    >
      <SwiperSlide
        v-for="category in categories"
        :key="category.id"
        class="!overflow-visible"
      >
        <div class="px-1 py-2">
          <CategoryCard :category="category" />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>


<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Grid } from 'swiper/modules';
import CategoryCard from './CategoryCard.vue';
import SwiperNavButtons from './SwiperNavButtons.vue';

// 1. Define the props this component receives
defineProps({
  categories: {
    type: Array,
    required: true
  }
});

// 2. Define data as constants
const modules = [Navigation, Grid];

const breakpoints = {
  320: {
    slidesPerView: 1,
    spaceBetween: 16,
    grid: { rows: 3, fill: 'row' }
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 16,
    grid: { rows: 3, fill: 'row' }
  },
  990: {
    slidesPerView: 4,
    spaceBetween: 16
  },
  1500: {
    slidesPerView: 6,
    spaceBetween: 16
  }
};

// 3. The computed here is static, so it can be a constant
const gridSettings = {
  rows: 1,
  fill: 'row'
};
</script>
