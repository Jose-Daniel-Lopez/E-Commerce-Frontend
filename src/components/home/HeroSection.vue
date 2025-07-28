<template>
  <section class="h-auto md:h-[472px] lg:h-[632px]" :style="sectionStyle">
    <Wrapper
      class="flex h-auto flex-col p-[88px_16px_0px_16px] md:h-[472px] md:flex-row md:gap-8 md:p-[0px_16px_0px_16px] lg:h-[632px] lg:gap-0"
    >
      <!-- left side start -->
      <div class="flex h-auto basis-[60%] flex-col justify-center gap-4 md:gap-8 md:px-2">
        <div class="flex flex-col text-center md:gap-3 md:text-left">
          <p
            class="font-figtree text-[25px] font-semibold"
            :style="{ color: data.left.smallTitleColor }"
          >
            {{ $t('hero.smallTitle') }}
          </p>
          <h1
            class="font-srProDisplay text-[75px] font-thin leading-[1.1] md:text-[60px] md:leading-[0.7] lg:text-[96px]"
            :style="{ color: data.left.bigTitleColor }"
          >
            {{ $t('hero.bigTitle') }}
            <span
              class="ml-2 font-srProDisplay font-semibold"
              :style="{ color: data.left.bigTitleBoldColor }"
            >
              {{ $t('hero.bigTitleBold') }}
            </span>
          </h1>
        </div>
        <p
          class="text-wrap text-center font-srProDisplay text-[19px] font-medium md:pr-3 md:text-left md:text-lg lg:pr-0"
          :style="{ color: data.left.descriptionColor }"
        >
          {{ $t('hero.description') }}
        </p>
        <div class="mt-4 flex w-full items-center justify-center md:justify-start">
          <Button
            v-if="data.left.isButton"
            width="181px"
            height="56px"
            font-weight="600"
            :bg-color="data.left.button.buttonBgColor"
            :text-color="data.left.button.buttonTextColor"
            :border-width="data.left.button.buttonBorderWidth"
            :border-color="data.left.button.buttonBorderColor"
            :hover-bg-color="data.left.button.buttonHoverBgColor"
            :hover-text-color="data.left.button.buttonHoverTextColor"
            @click="goToCatalog"
          >
            {{ $t('hero.buttonText') }}
          </Button>
        </div>
      </div>
      <!-- left side end -->

      <!-- right side start -->
      <div
        class="basis-[40%] overflow-hidden pb-[--padding-bottom] pt-[--padding-top]"
        :style="rightSideStyle"
      >
        <img
          :src="data.right.imageUrl"
          :alt="data.right.imageAlt"
          class="h-[289px] w-full object-fill object-center xs:object-contain md:h-full md:object-fill lg:w-[343px]"
        />
      </div>
      <!-- right side end -->
    </Wrapper>
  </section>
</template>

<script>
import Wrapper from '../shared/Wrapper.vue'
import Button from '../shared/Button.vue'

export default {
  name: 'HeroSection',
  components: {
    Wrapper,
    Button,
  },
  data() {
    return {
      data: {
        sectionBgColor: '',
        isGradient: true,
        gradientPosition: 'to right',
        gradientFrom: '#211c24',
        gradientTo: '#211c24',
        left: {
          smallTitle: '', // i18n
          smallTitleColor: '#909090',
          bigTitle: '', // i18n
          bigTitleColor: 'white',
          bigTitleBold: '', // i18n
          bigTitleBoldColor: 'white',
          description: '', // i18n
          descriptionColor: '#909090',
          isButton: true,
          button: {
            buttonBgColor: '',
            buttonText: '', // i18n
            buttonTextColor: 'white',
            buttonBorderWidth: '1px',
            buttonBorderColor: 'grey',
            buttonHoverBgColor: '#333333',
            buttonHoverTextColor: '',
          },
        },
        right: {
          imageUrl: '/images/iphone.png',
          imageAlt: 'iphone',
          paddingTop: '',
          paddingBottom: '',
        },
      },
    }
  },
  computed: {
    sectionStyle() {
      const styles = {}

      if (this.data.sectionBgColor !== '' && !this.data.isGradient) {
        styles.background = this.data.sectionBgColor
      }

      if (this.data.isGradient) {
        styles.backgroundImage = this.bgGradient(this.data)
      }

      return styles
    },
    rightSideStyle() {
      return {
        '--padding-top': this.data.right.paddingTop !== '' ? this.data.right.paddingTop : '0px',
        '--padding-bottom':
          this.data.right.paddingBottom !== '' ? this.data.right.paddingBottom : '0px',
      }
    },
  },
  methods: {
    bgGradient(data) {
      return `linear-gradient(${data.gradientPosition}, ${data.gradientFrom}, ${data.gradientTo})`
    },
    goToCatalog() {
      this.$router.push({ name: 'catalog' })
    },
  },
}
</script>
