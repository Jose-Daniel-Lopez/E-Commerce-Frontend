<template>
  <section class="overflow-hidden h-[640px] w-full theme-surface transition-colors duration-200">
    <Swiper
      :modules="modules"
      :slides-per-view="4"
      :space-between="0"
      :speed="500"
      :loop="false"
      :initial-slide="0"
      :pagination="paginationConfig"
      :breakpoints="breakpoints"
      class="bannerOne w-full"
    >
      <SwiperSlide>
  <div class="h-[640px] theme-card pb-[56px] transition-colors duration-200">
          <div class="h-[338px] w-full overflow-hidden">
            <img
              src="/images/Smart-watch.png"
              alt=""
              class="object-contain object-center w-full h-[338px] transition-opacity duration-200"
            />
          </div>
          <div class="flex flex-col gap-4 p-[38px_32px_56px_32px]">
            <h3
              class="text-center font-srProDisplay text-[33px] font-light theme-text lg:text-left transition-colors duration-200"
            >
              Popular Products
            </h3>
            <p
              class="text-center font-srProDisplay text-sm font-medium theme-muted-text lg:text-left transition-colors duration-200"
            >
              iPad combines a magnificent 10.2-inch Retina display, incredible performance,
              multitasking and ease of use.
            </p>
            <div class="flex w-full items-center justify-center lg:justify-start">
              <Button
                height="56px"
                width="184px"
                border-width="1px"
                border-color="var(--color-border)"
                text-color="var(--color-primary-foreground)"
                bg-color="var(--color-primary)"
              >
                Comprar Ahora
              </Button>
            </div>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
  <div class="h-[640px] theme-surface pb-[56px] transition-colors duration-200">
          <div class="h-[338px] w-full overflow-hidden">
            <img
              src="/images/apple-tablet.png"
              alt=""
              class="object-contain object-center w-full h-[338px]"
            />
          </div>
          <div class="flex flex-col gap-4 p-[38px_32px_56px_32px]">
            <h3
              class="text-center font-srProDisplay text-[33px] font-light theme-text lg:text-left transition-colors duration-200"
            >
              Ipad Pro
            </h3>
            <p
              class="text-center font-srProDisplay text-sm font-medium theme-muted-text lg:text-left transition-colors duration-200"
            >
              iPad combines a magnificent 10.2-inch Retina display, incredible performance,
              multitasking and ease of use.
            </p>
            <div class="flex w-full items-center justify-center lg:justify-start">
              <Button
                height="56px"
                width="184px"
                border-width="1px"
                border-color="var(--color-border)"
                text-color="var(--color-primary-foreground)"
                bg-color="var(--color-primary)"
              >
                Comprar Ahora
              </Button>
            </div>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
  <div class="h-[640px] theme-surface pb-[56px] transition-colors duration-200">
          <div class="h-[338px] w-full overflow-hidden">
            <img
              src="/images/Apple-phone.png"
              alt=""
              class="object-contain object-center w-full h-[338px] transition-opacity duration-200"
            />
          </div>
          <div class="flex flex-col gap-4 p-[38px_32px_56px_32px]">
            <h3
              class="text-center font-srProDisplay text-[33px] font-light theme-text lg:text-left transition-colors duration-200"
            >
              Samsung Galaxy
            </h3>
            <p
              class="text-center font-srProDisplay text-sm font-medium text-[#909090] dark:text-gray-400 lg:text-left transition-colors duration-200"
            >
              iPad combines a magnificent 10.2-inch Retina display, incredible performance,
              multitasking and ease of use.
            </p>
            <div class="flex w-full items-center justify-center lg:justify-start">
              <Button
                height="56px"
                width="184px"
                border-width="1px"
                border-color="var(--color-border)"
                text-color="var(--color-primary-foreground)"
                bg-color="var(--color-primary)"
              >
                Comprar Ahora
              </Button>
            </div>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
  <div class="h-[640px] theme-card pb-[56px] transition-colors duration-200">
          <div class="h-[338px] w-full overflow-hidden">
            <img
              src="/images/Macbook.png"
              alt=""
              class="object-contain object-center w-full h-[338px] transition-opacity duration-200"
            />
          </div>
          <div class="flex flex-col gap-4 p-[38px_32px_56px_32px]">
            <h3
              class="text-center font-srProDisplay text-[33px] font-light theme-text lg:text-left transition-colors duration-200"
            >
              Macbook Pro
            </h3>
            <p
              class="text-center font-srProDisplay text-sm font-medium text-[#909090] dark:text-gray-400 lg:text-left transition-colors duration-200"
            >
              iPad combines a magnificent 10.2-inch Retina display, incredible performance,
              multitasking and ease of use.
            </p>
            <div class="flex w-full items-center justify-center lg:justify-start">
              <Button
                height="56px"
                width="184px"
                border-width="1px"
                border-color="var(--color-border)"
                text-color="var(--color-primary-foreground)"
                bg-color="var(--color-primary)"
              >
                Comprar Ahora
              </Button>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import Button from '../shared/Button.vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

// Modules
const modules = [Pagination]

// Configuración de paginación dinámica (dots: false por defecto, true en responsive)
const paginationConfig = computed(() => ({
  clickable: true,
  enabled: false, // Se habilita dinámicamente en breakpoints
}))

// Breakpoints exactos del original
const breakpoints = {
  // Por defecto (1500px+): 4 slides, sin dots
  1500: {
    slidesPerView: 4,
    spaceBetween: 0,
    pagination: {
      enabled: false,
    },
  },
  // 1173px: 3 slides, con dots
  1173: {
    slidesPerView: 3,
    spaceBetween: 0,
    pagination: {
      enabled: true,
      clickable: true,
    },
  },
  // 880px: 2 slides, con dots
  880: {
    slidesPerView: 2,
    spaceBetween: 0,
    pagination: {
      enabled: true,
      clickable: true,
    },
  },
  // 640px: 1 slide, con dots
  640: {
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
      enabled: true,
      clickable: true,
    },
  },
}
</script>

<style scoped>
/* Estilos de paginación para que coincidan con React Slick */
.bannerOne :deep(.swiper-pagination) {
  bottom: 20px;
}

.bannerOne :deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: rgba(0, 0, 0, 0.2);
  opacity: 1;
  margin: 0 4px;
}

.bannerOne :deep(.swiper-pagination-bullet-active) {
  background: #000;
}

/* Forzar ancho de slide al 25% y responsive */
.bannerOne :deep(.swiper-slide) {
  flex: 0 0 auto;
  width: 25% !important;
}
@media (max-width: 1499px) {
  .bannerOne :deep(.swiper-slide) {
    width: 25% !important;
  }
}
@media (max-width: 1172px) {
  .bannerOne :deep(.swiper-slide) {
    width: 33.333% !important;
  }
}
@media (max-width: 879px) {
  .bannerOne :deep(.swiper-slide) {
    width: 50% !important;
  }
}
@media (max-width: 639px) {
  .bannerOne :deep(.swiper-slide) {
    width: 100% !important;
  }
}

/* Ocultar paginación en desktop (1500px+) */
@media (min-width: 1500px) {
  .bannerOne :deep(.swiper-pagination) {
    display: none;
  }
}
</style>
