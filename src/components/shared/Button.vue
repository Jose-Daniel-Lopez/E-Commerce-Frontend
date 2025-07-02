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
      default: 'auto'
    },
    height: {
      type: String,
      default: '40px' // Cambiar a un valor más grande si es necesario
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
        height: this.height,
        width: this.width,
        backgroundColor: this.isHovered && this.hoverBgColor ? this.hoverBgColor : this.bgColor,
        color: this.isHovered && this.hoverTextColor ? this.hoverTextColor : this.textColor,
        border: `${this.borderWidth === '' ? '0px' : this.borderWidth} solid ${this.borderColor}`,
        fontSize: this.textSize,
        fontWeight: this.fontWeight
      }
    },
    buttonClass() {
      return [
        'flex items-center justify-center gap-2 rounded-md px-3',
        'font-srProDisplay outline-none transition-all duration-200',
        this.disabled ? 'bg-gray-600 cursor-not-allowed' : '',
        // Agregar clases de hover solo si no está disabled
        !this.disabled ? 'hover:transition-all hover:duration-200' : ''
      ].filter(Boolean).join(' ')
    }
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  }
}
</script>
