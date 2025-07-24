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
    <svg v-if="icon" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineOptions({
  name: 'SharedButton', // "Button" is too generic and can cause conflicts, so we use a more specific name
})

const emit = defineEmits<{
  click: []
}>()

const props = withDefaults(defineProps<{
  icon?: boolean
  borderColor?: string
  hoverBgColor?: string
  hoverTextColor?: string
  textColor?: string
  textSize?: string
  fontWeight?: string
  width?: string
  height?: string
  borderWidth?: string
  bgColor?: string
  disabled?: boolean
}>(), {
  icon: false,
  borderColor: '',
  hoverBgColor: '',
  hoverTextColor: '',
  textColor: 'black',
  textSize: '16px',
  fontWeight: '400',
  width: 'auto',
  height: '40px',
  borderWidth: '',
  bgColor: '',
  disabled: false,
})

const isHovered = ref(false)

const buttonStyle = computed(() => {
  return {
    height: props.height,
    width: props.width,
    backgroundColor: isHovered.value && props.hoverBgColor ? props.hoverBgColor : props.bgColor,
    color: isHovered.value && props.hoverTextColor ? props.hoverTextColor : props.textColor,
    border: `${props.borderWidth === '' ? '0px' : props.borderWidth} solid ${props.borderColor}`,
    fontSize: props.textSize,
    fontWeight: props.fontWeight,
  }
})

const buttonClass = computed(() => {
  return [
    'flex items-center justify-center gap-2 rounded-md px-3',
    'font-srProDisplay outline-none transition-all duration-200',
    props.disabled ? 'bg-gray-600 cursor-not-allowed' : 'cursor-pointer',
    // if the button is not disabled, apply hover styles
    !props.disabled ? 'hover:transition-all hover:duration-200' : '',
  ]
    .filter(Boolean)
    .join(' ')
})

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>
