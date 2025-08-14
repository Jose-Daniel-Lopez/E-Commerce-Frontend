<script setup lang="ts">
// =======================
// 📦 IMPORTS
// =======================
import { ref, computed, watch } from 'vue'

// =======================
// 🧩 PROPS
// =======================
interface Props {
  min: number
  max: number
  step?: number
  modelValue: [number, number]
  disabled?: boolean
  formatValue?: (value: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  disabled: false,
  formatValue: (value: number) => `$${value}`,
})

// =======================
// 🔤 EMITS
// =======================
interface Emits {
  (e: 'update:modelValue', value: [number, number]): void
}

const emit = defineEmits<Emits>()

// =======================
// 🧩 STATE
// =======================
const activeSlider = ref<'min' | 'max' | null>(null)
const draggingProgress = ref(false)
let dragStartX = 0
let initialMin = 0
let initialMax = 0

// =======================
// 🧮 COMPUTED PROPERTIES
// =======================
const progressLeft = computed(() =>
  ((props.modelValue[0] - props.min) / (props.max - props.min)) * 100
)

const progressRight = computed(() =>
  100 - ((props.modelValue[1] - props.min) / (props.max - props.min)) * 100
)

// =======================
// ⚙️ METHODS
// =======================
function updateMin(e: Event) {
  if (props.disabled) return

  activeSlider.value = 'min'
  const val = Number((e.target as HTMLInputElement).value)
  const newValue: [number, number] = val > props.modelValue[1]
    ? [props.modelValue[1], props.modelValue[1]]
    : [val, props.modelValue[1]]

  emit('update:modelValue', newValue)

  // Reset active state after a delay
  setTimeout(() => {
    activeSlider.value = null
  }, 100)
}

function updateMax(e: Event) {
  if (props.disabled) return

  activeSlider.value = 'max'
  const val = Number((e.target as HTMLInputElement).value)
  const newValue: [number, number] = val < props.modelValue[0]
    ? [props.modelValue[0], props.modelValue[0]]
    : [props.modelValue[0], val]

  emit('update:modelValue', newValue)

  // Reset active state after a delay
  setTimeout(() => {
    activeSlider.value = null
  }, 100)
}

function startDragProgress(e: MouseEvent) {
  if (props.disabled) return

  draggingProgress.value = true
  dragStartX = e.clientX
  initialMin = props.modelValue[0]
  initialMax = props.modelValue[1]

  window.addEventListener('mousemove', onDragProgress)
  window.addEventListener('mouseup', stopDragProgress)

  // Prevent text selection during drag
  e.preventDefault()
}

function onDragProgress(e: MouseEvent) {
  if (!draggingProgress.value || props.disabled) return

  const slider = (e.target as HTMLElement).closest('.dual-range-slider')
  if (!slider) return

  const sliderWidth = slider.clientWidth
  const delta = ((e.clientX - dragStartX) / sliderWidth) * (props.max - props.min)
  const rangeWidth = props.modelValue[1] - props.modelValue[0]

  let newMin = initialMin + delta
  let newMax = initialMax + delta

  // Constrain to bounds
  if (newMin < props.min) {
    newMin = props.min
    newMax = newMin + rangeWidth
  }
  if (newMax > props.max) {
    newMax = props.max
    newMin = newMax - rangeWidth
  }

  // Apply step rounding
  newMin = Math.round(newMin / props.step) * props.step
  newMax = Math.round(newMax / props.step) * props.step

  emit('update:modelValue', [newMin, newMax])
}

function stopDragProgress() {
  draggingProgress.value = false
  window.removeEventListener('mousemove', onDragProgress)
  window.removeEventListener('mouseup', stopDragProgress)
}

// =======================
// 🔁 WATCHERS
// =======================
// Validate props
watch(() => props.modelValue, (newValue) => {
  if (newValue[0] > newValue[1]) {
    console.warn('DualRangeSlider: min value cannot be greater than max value')
  }
  if (newValue[0] < props.min || newValue[1] > props.max) {
    console.warn('DualRangeSlider: values must be within min/max bounds')
  }
}, { immediate: true })
</script>

<template>
  <div class="dual-range-slider-container">
    <!-- Value Inputs -->
    <div class="flex items-center mb-6 space-x-4">
      <div class="flex-1">
        <label class="block mt-1 mb-2 text-xs text-gray-500 font-srProDisplay dark:text-gray-400">From</label>
        <input :value="modelValue[0]" @input="updateMin" type="number" :min="min" :max="max" :step="step"
          :disabled="disabled" placeholder="0"
          class="w-full px-2 py-2 text-[14px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" />
      </div>
      <span class="mt-6 text-gray-200 dark:text-gray-400 font-srProDisplay"> — </span>
      <div class="flex-1">
        <label class="block mt-1 mb-2 text-xs text-right text-gray-500 font-srProDisplay dark:text-gray-400">To</label>
        <input :value="modelValue[1]" @input="updateMax" type="number" :min="min" :max="max" :step="step"
          :disabled="disabled" :placeholder="max.toString()"
          class="w-full py-2 text-right text-[14px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" />
      </div>
    </div>

    <!-- Dual Range Slider -->
    <div class="relative px-2 dual-range-slider" :class="{ 'opacity-50 pointer-events-none': disabled }">
      <!-- Slider Track -->
      <div class="relative h-1 transition-colors duration-200 bg-gray-300 rounded-full slider dark:bg-gray-600">
        <!-- Progress bar that shows the selected range -->
        <div class="absolute h-1 transition-colors duration-200 bg-black rounded-full dark:bg-white progress"
          :class="{ 'cursor-pointer': !disabled }" :style="{ left: progressLeft + '%', right: progressRight + '%' }"
          @mousedown="startDragProgress"></div>

        <!-- Min range input -->
        <input type="range" :min="min" :max="max" :step="step" :value="modelValue[0]" :disabled="disabled"
          @input="updateMin" class="absolute w-full h-1 bg-transparent appearance-none cursor-pointer slider-thumb-min"
          :class="{ 'active': activeSlider === 'min' }" style="z-index: 2;" />

        <!-- Max range input -->
        <input type="range" :min="min" :max="max" :step="step" :value="modelValue[1]" :disabled="disabled"
          @input="updateMax" class="absolute w-full h-1 bg-transparent appearance-none cursor-pointer slider-thumb-max"
          :class="{ 'active': activeSlider === 'max' }" style="z-index: 1;" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide the slider tracks */
.slider-thumb-min,
.slider-thumb-max {
  pointer-events: none;
}

/* Min slider thumb styles */
.slider-thumb-min::-webkit-slider-thumb {
  pointer-events: all;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #000;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  border: 2px solid #fff;
  position: relative;
  z-index: 10;
}

@media (prefers-color-scheme: dark) {
  .slider-thumb-min::-webkit-slider-thumb {
    background: #fff;
    border: 2px solid #374151;
    box-shadow: 0 1px 3px rgba(255, 255, 255, 0.15);
  }
}

.slider-thumb-min::-moz-range-thumb {
  pointer-events: all;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #000;
  cursor: pointer;
  border: 2px solid #fff;
  z-index: 10;
}

.slider-thumb-min:disabled::-webkit-slider-thumb {
  background: #ccc;
  cursor: not-allowed;
}

.slider-thumb-min:disabled::-moz-range-thumb {
  background: #ccc;
  cursor: not-allowed;
}

/* Max slider thumb styles */
.slider-thumb-max::-webkit-slider-thumb {
  pointer-events: all;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #000;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  border: 2px solid #fff;
  position: relative;
  z-index: 10;
}

@media (prefers-color-scheme: dark) {
  .slider-thumb-max::-webkit-slider-thumb {
    background: #fff;
    border: 2px solid #374151;
    box-shadow: 0 1px 3px rgba(255, 255, 255, 0.15);
  }
}

.slider-thumb-max::-moz-range-thumb {
  pointer-events: all;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #000;
  cursor: pointer;
  border: 2px solid #fff;
  z-index: 10;
}

.slider-thumb-max:disabled::-webkit-slider-thumb {
  background: #ccc;
  cursor: not-allowed;
}

.slider-thumb-max:disabled::-moz-range-thumb {
  background: #ccc;
  cursor: not-allowed;
}

/* Hide the default slider tracks */
.slider-thumb-min::-webkit-slider-track,
.slider-thumb-max::-webkit-slider-track {
  background: transparent;
  border: none;
}

.slider-thumb-min::-moz-range-track,
.slider-thumb-max::-moz-range-track {
  background: transparent;
  border: none;
}

/* Progress bar styling */
.progress {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  transition: background-color 0.2s ease;
}

.progress:hover:not(.disabled) {
  background-color: #333;
}

@media (prefers-color-scheme: dark) {
  .progress:hover:not(.disabled) {
    background-color: #e5e7eb;
  }
}

/* Dynamic z-index for active thumbs */
.slider-thumb-min.active {
  z-index: 3 !important;
}

.slider-thumb-max.active {
  z-index: 3 !important;
}

/* Focus styles for accessibility */
.slider-thumb-min:focus,
.slider-thumb-max:focus {
  outline: none;
}

.slider-thumb-min:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.slider-thumb-max:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.slider-thumb-min:focus::-moz-range-thumb {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.slider-thumb-max:focus::-moz-range-thumb {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
