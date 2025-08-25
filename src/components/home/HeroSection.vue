<template>
  <section :class="pageBackgroundClasses" class="h-auto md:h-[472px] lg:h-[632px]" :style="sectionStyle">
    <Wrapper
      class="flex h-auto flex-col p-[88px_16px_0px_16px] md:h-[472px] md:flex-row md:gap-8 md:p-[0px_16px_0px_16px] lg:h-[632px] lg:gap-0"
    >
      <!-- left side start -->
      <div class="flex h-auto basis-[60%] flex-col justify-center gap-4 md:gap-8 md:px-2">
        <div class="flex flex-col text-center md:gap-3 md:text-left">
            <p
              :class="['font-figtree text-[25px] font-semibold', textMutedClasses]"
            >
            {{ $t('hero.smallTitle') }}
          </p>
            <h1
              :class="['font-srProDisplay text-[75px] font-thin leading-[1.1] md:text-[60px] md:leading-[0.7] lg:text-[96px]', textClasses]"
            >
            {{ $t('hero.bigTitle') }}
              <span
                :class="['ml-2 font-srProDisplay font-semibold', textClasses]"
              >
              {{ $t('hero.bigTitleBold') }}
            </span>
          </h1>
        </div>
          <p
            :class="['text-wrap text-center font-srProDisplay text-[19px] font-medium md:pr-3 md:text-left md:text-lg lg:pr-0', textMutedClasses]"
          >
          {{ $t('hero.description') }}
        </p>
        <div class="mt-4 flex w-full items-center justify-center md:justify-start">
          <CustomButton
            v-if="true"
            width="181px"
            height="56px"
            font-weight="600"
            bg-color="var(--color-primary)"
            text-color="var(--color-primary-foreground)"
            border-width="1px"
            border-color="var(--color-border)"
            hover-bg-color="var(--color-accent)"
            hover-text-color="var(--color-primary-foreground)"
            @click="goToCatalog"
          >
            {{ $t('hero.buttonText') }}
          </CustomButton>
        </div>
      </div>
      <!-- left side end -->

      <!-- right side start -->
      <div
        class="basis-[40%] overflow-hidden pb-[--padding-bottom] pt-[--padding-top]"
        :style="rightSideStyle"
      >
        <img
          src="/images/iphone.png"
          alt="iphone"
          class="h-[289px] w-full object-fill object-center xs:object-contain md:h-full md:object-fill lg:w-[343px] transition-all duration-200"
        />
      </div>
      <!-- right side end -->
    </Wrapper>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Wrapper from '../shared/Wrapper.vue'
import CustomButton from '../shared/Button.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

export default defineComponent({
  name: 'HeroSection',
  components: {
    Wrapper,
    CustomButton,
  },
  setup() {
    const {
      pageBackgroundClasses,
      heroTitleClasses,
      heroDescriptionClasses,
      textMutedClasses,
      textClasses,
      buttonPrimaryClasses
    } = useThemeClasses()

    return {
      pageBackgroundClasses,
      heroTitleClasses,
      heroDescriptionClasses,
      textMutedClasses,
      textClasses,
      buttonPrimaryClasses
    }
  },
  data() {
    return {
      data: {
        sectionBgColor: '',
        isGradient: true,
        gradientPosition: 'to right',
        gradientFrom: 'var(--color-background)',
        gradientTo: 'var(--color-surface-secondary)',
        left: {
          smallTitle: '', // i18n
          smallTitleColor: 'var(--color-muted)',
          bigTitle: '', // i18n
          bigTitleColor: 'var(--color-text)',
          bigTitleBold: '', // i18n
          bigTitleBoldColor: 'var(--color-text)',
          description: '', // i18n
          descriptionColor: 'var(--color-muted)',
          isButton: true,
          button: {
            buttonBgColor: 'var(--color-primary)',
            buttonText: '', // i18n
            buttonTextColor: 'var(--color-primary-foreground)',
            buttonBorderWidth: '1px',
            buttonBorderColor: 'var(--color-border)',
            buttonHoverBgColor: 'var(--color-accent)',
            buttonHoverTextColor: 'var(--color-primary-foreground)',
          },
        },
        right: {
          imageUrl: '/images/iphone.png',
          imageAlt: 'iphone',
          paddingTop: '',
          paddingBottom: '',
        },
      } as Record<string, unknown>,
    }
  },
  computed: {
    sectionStyle(): Record<string, string> {
      const styles: Record<string, string> = {}
      const data = this.data as Record<string, unknown>

      if ((data.sectionBgColor as string) !== '' && !(data.isGradient as boolean)) {
        styles.background = data.sectionBgColor as string
      }

      if (data.isGradient as boolean) {
        // Use theme-aware gradients for light and dark mode
        const isDark = document.documentElement.classList.contains('dark')
        if (isDark) {
          // Dark mode gradient using theme variables
          styles.backgroundImage = `linear-gradient(${data.gradientPosition as string}, var(--color-background), var(--surface-bg))`
        } else {
          // Light mode gradient using theme variables
          styles.backgroundImage = `linear-gradient(${data.gradientPosition as string}, var(--color-background), var(--color-surface-secondary))`
        }
      }

      return styles
    },
    rightSideStyle(): Record<string, string> {
      const data = this.data as Record<string, unknown>
      const rightData = data.right as Record<string, string>
      return {
        '--padding-top': rightData.paddingTop !== '' ? rightData.paddingTop : '0px',
        '--padding-bottom': rightData.paddingBottom !== '' ? rightData.paddingBottom : '0px',
      }
    },
  },
  methods: {
    bgGradient(data: Record<string, unknown>): string {
      return `linear-gradient(${data.gradientPosition}, ${data.gradientFrom}, ${data.gradientTo})`
    },
    goToCatalog(): void {
      this.$router.push({ name: 'catalog' })
    },
  },
})
</script>
