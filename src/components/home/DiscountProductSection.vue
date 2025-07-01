<template>
  <section class="h-auto w-full">
    <Wrapper class="flex h-fit w-full flex-col gap-8 py-[80px]">
      <div class="relative flex h-9 w-full items-center justify-between">
        <h3 class="font-srProDisplay text-2xl font-medium">
          Discountable Products
        </h3>
        <!-- Botones de paginación estilo ProductsSection -->
        <div class="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2 z-20">
          <button
            class="custom-swiper-button-prev-discount flex items-center justify-center bg-transparent p-0 transition disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
            aria-label="Previous slide"
            :disabled="!canGoPrev"
            style="transform: scaleX(-1);"
            @click="goPrev"
          >
            <svg :width="'1.2em'" :height="'1.2em'" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
            </svg>
          </button>
          <button
            class="custom-swiper-button-next-discount flex items-center justify-center bg-transparent p-0 transition disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
            aria-label="Next slide"
            :disabled="!canGoNext"
            @click="goNext"
          >
            <svg :width="'1.2em'" :height="'1.2em'" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="relative">
        <Swiper
          :modules="modules"
          :slides-per-view="4"
          :space-between="16"
          :navigation="{
            prevEl: '.custom-swiper-button-prev-discount',
            nextEl: '.custom-swiper-button-next-discount',
          }"
          :breakpoints="breakpoints"
          class="discountProduct flex w-full items-center pt-3"
          @swiper="onSwiperInit"
        >
          <SwiperSlide
            v-for="product in data"
            :key="product.id"
          >
            <ProductCard
              :product="product"
              class="mb-4 w-[163.5px] xs:w-[190px] sm:w-[298px] md:mb-0 md:w-[240px] xl:w-[268px]"
            />
          </SwiperSlide>

          <SwiperSlide v-if="data.length >= 16">
            <ViewMoreCard />
          </SwiperSlide>
        </Swiper>
      </div>
    </Wrapper>
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import Wrapper from '../shared/Wrapper.vue'
import ProductCard from '../shared/ProductCard.vue'
import ViewMoreCard from '../shared/ViewMoreCard.vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

export default {
  name: 'DiscountProductSection',
  components: {
    Swiper,
    SwiperSlide,
    Wrapper,
    ProductCard,
    ViewMoreCard
  },
  data() {
    return {
      swiperInstance: null,
      modules: [Navigation],
      data: [
        {
          id: 1,
          name: "Apple iPhone 14 Pro Max 512GB Gold(MQ233)",
          originalPrice: "1437",
          discountPrice: "1350",
          image: {
            url: "/images/Iphone-14-pro-Gold.png",
            altText: "Iphone-14-pro-Gold",
          },
        },
        {
          id: 2,
          name: "AirPods Max Silver",
          originalPrice: "549",
          discountPrice: "510",
          image: {
            url: "/images/Apple-airPods.png",
            altText: "Apple-airPods",
          },
        },
        {
          id: 3,
          name: "Apple Watch Series 9 GPS 41mm Starlight Aluminum Case",
          originalPrice: "399",
          discountPrice: "350",
          image: {
            url: "/images/Apple-Watch.png",
            altText: "Apple-Watch",
          },
        },
        {
          id: 4,
          name: "Apple iPhone 14 Pro 1TB Gold (MQ2V3)",
          originalPrice: "1499",
          discountPrice: "1450",
          image: {
            url: "/images/Iphone-14-pro-Gold.png",
            altText: "Iphone-14-pro-Gold",
          },
        },
      ],
      breakpoints: {
        359: {
          slidesPerView: 1,
          spaceBetween: 8,
          grid: {
            rows: 2,
            fill: 'row'
          }
        },
        767: {
          slidesPerView: 2,
          spaceBetween: 12,
          grid: {
            rows: this.data?.length > 3 ? 2 : 1,
            fill: 'row'
          }
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 16
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 16
        }
      },
      canGoPrev: false,
      canGoNext: false
    }
  },
  methods: {
    onSwiperInit(swiper) {
      this.swiperInstance = swiper
      this.updateNavState()
      swiper.on('slideChange', this.updateNavState)
      swiper.on('reachBeginning', this.updateNavState)
      swiper.on('reachEnd', this.updateNavState)
    },
    updateNavState() {
      if (!this.swiperInstance) return
      this.canGoPrev = !this.swiperInstance.isBeginning
      this.canGoNext = !this.swiperInstance.isEnd
    },
    goPrev() {
      if (this.swiperInstance && this.canGoPrev) this.swiperInstance.slidePrev()
    },
    goNext() {
      if (this.swiperInstance && this.canGoNext) this.swiperInstance.slideNext()
    }
  }
}
</script>

<style scoped>
/* Botones de paginación estilo ProductsSection */
.custom-swiper-button-prev-discount,
.custom-swiper-button-next-discount {
  width: 1.2em;
  height: 1.2em;
  background: transparent;
  border: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: opacity 0.2s;
}
.custom-swiper-button-prev-discount:disabled,
.custom-swiper-button-next-discount:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
