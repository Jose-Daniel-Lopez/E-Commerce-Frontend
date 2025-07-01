<template>
  <button
    :style="buttonStyle"
    :class="buttonClass"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :disabled="disabled"
  >
    <slot />
    <svg
      v-if="icon"
      class="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>
  </button>
</template>

<script>
export default {
  name: 'Button',
  emits: ['click'],
  props: {
    icon: {
      type: Boolean,
      default: false
    },
    borderColor: {
      type: String,
      default: ''
    },
    hoverBgColor: {
      type: String,
      default: ''
    },
    hoverTextColor: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: 'black'
    },
    textSize: {
      type: String,
      default: '16px'
    },
    fontWeight: {
      type: String,
      default: '400'
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '40px'
    },
    borderWidth: {
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isHovered: false
    }
  },
  computed: {
    buttonStyle() {
      return {
        '--btn-height': this.height,
        '--btn-width': this.width,
        '--bg-color': this.bgColor,
        '--text-color': this.textColor,
        '--font-weight': this.fontWeight,
        '--hover-bg-color': this.hoverBgColor !== '' ? this.hoverBgColor : this.bgColor,
        '--hover-text-color': this.hoverTextColor !== '' ? this.hoverTextColor : this.textColor,
        border: `${this.borderWidth === '' ? '0px' : this.borderWidth} solid ${this.borderColor}`,
        fontSize: this.textSize,
        backgroundColor: this.isHovered && this.hoverBgColor ? this.hoverBgColor : this.bgColor,
        color: this.isHovered && this.hoverTextColor ? this.hoverTextColor : this.textColor
      }
    },
    buttonClass() {
      return 'flex h-[--btn-height] w-[--btn-width] items-center justify-center gap-2 rounded-md bg-[--bg-color] px-3 font-srProDisplay font-[--font-weight] text-[--text-color] outline-none hover:bg-[--hover-bg-color] hover:text-[--hover-text-color] disabled:bg-gray-600 transition-all duration-200'
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>
