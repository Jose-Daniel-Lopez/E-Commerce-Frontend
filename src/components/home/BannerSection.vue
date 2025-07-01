<template>
  <section class="h-[448px] w-full bg-[url('/images/banner-2.png')] bg-cover bg-center bg-no-repeat md:bg-[url('/images/banner.png')]">
    <Wrapper class="flex h-[448px] items-center justify-center">
      <div>
        <h1 class="text-center font-srProDisplay text-[48px] font-thin text-white md:text-[72px]">
          Big Summer
          <span class="font-srProDisplay text-[48px] font-medium text-white md:text-[72px]">
            Sale
          </span>
        </h1>
        <p class="text-center font-srProDisplay text-base font-normal text-[#787878]">
          Commodo fames vitae vitae leo mauris in. Eu consequat.
        </p>
        <div class="mt-[40px] flex justify-center">
          <Button
            height="56px"
            width="184px"
            border-width="1px"
            border-color="grey"
            text-color="white"
            hover-bg-color="#333333"
          >
            Shop Now
          </Button>
        </div>
      </div>
    </Wrapper>
  </section>
</template>

<script>
import Wrapper from '../shared/Wrapper.vue'
import Button from '../shared/Button.vue'

export default {
  name: 'BannerSection',
  components: {
    Wrapper,
    Button
  }
}
</script>
