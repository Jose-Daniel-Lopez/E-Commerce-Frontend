<template>
  <section
    class="h-[448px] w-full bg-[url('/images/banner-2.png')] bg-cover bg-center bg-no-repeat md:bg-[url('/images/banner.png')] transition-all duration-200"
  >
    <Wrapper class="flex h-[448px] items-center justify-center">
      <div>
        <h1 class="text-center font-srProDisplay text-[48px] font-thin theme-text md:text-[72px] transition-colors duration-200">
          Gran Venta de
          <span class="font-srProDisplay text-[48px] font-medium theme-text md:text-[72px] transition-colors duration-200">
            Verano
          </span>
        </h1>
        <p class="text-center font-srProDisplay text-base font-normal theme-muted-text transition-colors duration-200">
          Descubre las mejores ofertas de la temporada en todos nuestros productos.
        </p>
        <div class="mt-[40px] flex justify-center">
          <CustomButton
            height="56px"
            width="184px"
            border-width="1px"
            border-color="grey"
            text-color="white"
            hover-bg-color="#333333"
          >
            Explorar Ofertas
          </CustomButton>
        </div>
      </div>
    </Wrapper>
  </section>
</template>

<script lang="ts">
import Wrapper from '../shared/Wrapper.vue'
import CustomButton from '../shared/Button.vue'

export default {
  name: 'BannerSection',
  components: {
    Wrapper,
    CustomButton,
  },
}
</script>
