# DualRangeSlider Component

A reusable Vue 3 component for creating dual range sliders with customizable min/max values, step intervals, and value formatting.

## Features

- 🎯 **Dual thumb control** - Independent min/max value adjustment
- 🎨 **Customizable styling** - Easily themed with Tailwind CSS
- 📱 **Touch/mouse support** - Works on both desktop and mobile
- ♿ **Accessibility friendly** - Keyboard navigation and screen reader support
- 🎛️ **Drag range support** - Drag the selected range to move both values
- 🔢 **Input fields** - Direct numeric input with validation
- 🎨 **Custom formatting** - Format displayed values (currency, percentage, etc.)
- ⚡ **TypeScript support** - Fully typed for better development experience

## Usage

### Basic Example

```vue
<template>
  <div>
    <h3>Price Range</h3>
    <DualRangeSlider
      :min="0"
      :max="5000"
      :step="50"
      v-model="priceRange"
      :format-value="(value) => `$${value}`"
    />
    <p>Selected range: ${{ priceRange[0] }} - ${{ priceRange[1] }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DualRangeSlider from '@/components/shared/DualRangeSlider.vue'

const priceRange = ref<[number, number]>([100, 1000])
</script>
```

### Advanced Example

```vue
<template>
  <div>
    <h3>Age Range Filter</h3>
    <DualRangeSlider
      :min="18"
      :max="65"
      :step="1"
      v-model="ageRange"
      :disabled="loading"
      :format-value="formatAge"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DualRangeSlider from '@/components/shared/DualRangeSlider.vue'

const ageRange = ref<[number, number]>([25, 45])
const loading = ref(false)

const formatAge = (value: number) => {
  return value === 65 ? '65+' : `${value} years`
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min` | `number` | - | **Required.** Minimum value of the range |
| `max` | `number` | - | **Required.** Maximum value of the range |
| `modelValue` | `[number, number]` | - | **Required.** Array containing [min, max] selected values |
| `step` | `number` | `1` | Step interval for value changes |
| `disabled` | `boolean` | `false` | Disables the entire component |
| `formatValue` | `(value: number) => string` | `(value) => \`$${value}\`` | Function to format displayed values |

## Events

| Event | Type | Description |
|-------|------|-------------|
| `update:modelValue` | `[number, number]` | Emitted when the range values change |

## Styling

The component uses Tailwind CSS classes and can be customized by overriding the CSS variables or classes. Key styling points:

- **Track**: `.bg-gray-300` - The slider track background
- **Progress**: `.bg-black` - The selected range highlight
- **Thumbs**: Black circles with white borders
- **Inputs**: Standard input styling with focus states
- **Labels**: Gray text labels above inputs

### Custom Styling Example

```vue
<template>
  <div class="custom-range-slider">
    <DualRangeSlider
      :min="0"
      :max="100"
      v-model="range"
      :format-value="(value) => `${value}%`"
    />
  </div>
</template>

<style scoped>
.custom-range-slider :deep(.progress) {
  background-color: #3b82f6; /* Blue progress bar */
}

.custom-range-slider :deep(.slider-thumb-min::-webkit-slider-thumb),
.custom-range-slider :deep(.slider-thumb-max::-webkit-slider-thumb) {
  background: #3b82f6; /* Blue thumbs */
}
</style>
```

## Integration Notes

### With Pinia Stores

```typescript
// In your component
const { priceFilter } = storeToRefs(useProductStore())

// In template
<DualRangeSlider v-model="priceFilter" :min="0" :max="5000" />
```

### With Form Validation

```vue
<script setup lang="ts">
import { watch } from 'vue'

const range = ref<[number, number]>([0, 100])

// Validate range
watch(range, ([min, max]) => {
  if (min >= max) {
    console.warn('Minimum value cannot be greater than or equal to maximum')
  }
})
</script>
```

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Accessibility

The component includes:

- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast support

## Performance

- Minimal re-renders using computed properties
- Efficient event handling with proper cleanup
- TypeScript optimizations
- Small bundle size (~3KB gzipped)
