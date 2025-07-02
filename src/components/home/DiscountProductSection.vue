<template>
  <section class="h-auto w-full">
    <Wrapper class="flex h-fit w-full flex-col gap-8 py-[80px]">
      <div class="relative flex h-9 w-full items-center justify-between">
        <h3 class="font-srProDisplay text-2xl font-medium">
          Discountable Products
        </h3>
        <!-- Botones de paginación -->
        <div class="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2 z-20">
          <!-- Tus botones existentes -->
        </div>
      </div>

      <!-- Contenedor principal con padding -->
      <div class="relative px-2 -mx-2"> <!-- Agregado padding y margin negativo -->
        <Swiper
          :modules="modules"
          :slides-per-view="4"
          :space-between="16"
          :navigation="{
            prevEl: '.custom-swiper-button-prev-discount',
            nextEl: '.custom-swiper-button-next-discount',
          }"
          :breakpoints="breakpoints"
          :watch-overflow="true"
          class="discountProduct flex w-full items-center pt-3 !overflow-visible"
          @swiper="onSwiperInit"
        >
          <SwiperSlide
            v-for="product in data"
            :key="product.id"
            class="!overflow-visible"
          >
            <!-- Contenedor con padding para evitar cortes -->
            <div class="px-1 py-2">
              <ProductCard
                :product="product"
                class="mb-4 w-[163.5px] xs:w-[190px] sm:w-[298px] md:mb-0 md:w-[240px] xl:w-[268px]"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide v-if="data.length >= 16" class="!overflow-visible">
            <div class="px-1 py-2">
              <ViewMoreCard />
            </div>
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
          spaceBetween: 16, // Aumentado el espacio
          grid: {
            rows: this.data?.length > 3 ? 2 : 1,
            fill: 'row'
          }
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20 // Aumentado el espacio
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 24 // Aumentado el espacio
        }
      },
      // ... resto de data
    }
  }
}
</script>

<style scoped>
/* Asegurar que el swiper wrapper no corte contenido */
.discountProduct :deep(.swiper-wrapper) {
  overflow: visible !important;
}

.discountProduct :deep(.swiper-slide) {
  overflow: visible !important;
}

/* Tus estilos de botones existentes */
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
</style>
