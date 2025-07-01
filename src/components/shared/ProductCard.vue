<template>
  <div
    :class="`h-auto rounded-[9px] bg-[#f6f6f6] px-3 py-6 duration-500 hover:scale-[1.02] hover:shadow-md md:h-[435px] md:px-4 ${className}`"
  >
    <div class="flex flex-col gap-4">
      <div class="flex h-8 w-full justify-end">
        <a href="#" @click.prevent="toggleFavorite">
          <svg
            v-if="!isFavorite"
            class="w-6 h-6 text-gray-600 hover:text-red-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <svg
            v-else
            class="w-6 h-6 text-red-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </a>
      </div>
      <div class="flex items-center justify-center">
        <div class="h-[104px] w-[104px] md:h-[160px] md:w-[160px]">
          <img
            :src="product.image.url"
            :alt="product.image.altText"
            class="w-full h-full object-contain"
          />
        </div>
      </div>
      <div class="flex w-full flex-col gap-6">
        <div class="flex flex-col gap-4">
          <div class="h-[75px] sm:h-[50px]">
            <a href="#" @click.prevent>
              <h3 class="text-center font-srProDisplay text-base font-medium hover:text-indigo-600">
                {{ truncatedName }}
              </h3>
            </a>
          </div>

          <div class="flex justify-center gap-2">
            <span
              v-if="product.discountPrice !== ''"
              class="font-figtree text-xl font-semibold"
            >
              ${{ product.discountPrice }}
            </span>

            <span
              v-if="product.discountPrice === ''"
              class="font-figtree text-xl font-semibold"
            >
              {{ product.featureType === 'Up Coming...' ? 'N/A' : `$${product.originalPrice}` }}
            </span>

            <span
              v-else
              class="font-figtree text-xl font-semibold text-[#808080] line-through"
            >
              ${{ product.originalPrice }}
            </span>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <Button
            height="48px"
            width="183px"
            bg-color="black"
            text-color="white"
            text-size="14px"
            font-weight="500"
            hover-bg-color="#1a1a1a"
            :disabled="product.featureType === 'Up Coming...'"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './Button.vue'

export default {
  name: 'ProductCard',
  components: {
    Button
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isFavorite: false
    }
  },
  computed: {
    truncatedName() {
      return this.product.name.length <= 40
        ? this.product.name
        : `${this.product.name.slice(0, 40)}...`
    }
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
    }
  }
}
</script>
