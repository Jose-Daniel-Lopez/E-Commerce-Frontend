# 🎨 Theme Integration Guide

A comprehensive guide for integrating the centralized theme system using `useThemeClasses.ts` composable and `themes.css` color variables.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Migration Checklist](#quick-migration-checklist)
3. [Integration Approaches](#integration-approaches)
4. [Color System Reference](#color-system-reference)
5. [Component Examples](#component-examples)
6. [Common Patterns](#common-patterns)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Our theme system consists of three layers:

1. **`themes.css`** - CSS variables for colors and design tokens
2. **`base.css`** - Utility classes that reference CSS variables
3. **`useThemeClasses.ts`** - Composable with pre-built class combinations

### Architecture Diagram
```
Component → useThemeClasses → Utility Classes → CSS Variables
    ↓            ↓               ↓              ↓
  Vue File   →  Composable   →   base.css   →  themes.css
```

---

## ✅ Quick Migration Checklist

### Replace These Hardcoded Classes:
- ❌ `bg-gray-50` → ✅ `bg-surface`
- ❌ `bg-gray-100` → ✅ `bg-surface-secondary` 
- ❌ `bg-gray-200` → ✅ `bg-surface-tertiary`
- ❌ `text-black` → ✅ `text-foreground`
- ❌ `text-gray-600` → ✅ `text-muted`
- ❌ `text-gray-400` → ✅ `text-muted-foreground`
- ❌ `border-gray-300` → ✅ `border-border`
- ❌ `bg-white` → ✅ `bg-background`

### Replace Complex Dark Mode Classes:
- ❌ `bg-gray-50 dark:bg-gray-800` → ✅ `bg-surface`
- ❌ `text-gray-600 dark:text-gray-200` → ✅ `text-muted`
- ❌ `border-gray-200 dark:border-gray-600` → ✅ `border-border`

---

## 🔧 Integration Approaches

### Approach 1: Direct Utility Classes (Recommended for Simple Components)

```vue
<template>
  <div class="bg-background text-foreground border border-border">
    <h1 class="text-foreground">Title</h1>
    <p class="text-muted">Description</p>
    <button class="bg-primary text-primary-foreground hover:opacity-90">
      Click me
    </button>
  </div>
</template>
```

### Approach 2: useThemeClasses Composable (Recommended for Complex Components)

```vue
<template>
  <div :class="cardClasses">
    <h1 :class="textClasses">Title</h1>
    <p :class="textSecondaryClasses">Description</p>
    <button :class="buttonPrimaryClasses">Click me</button>
  </div>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'

const {
  cardClasses,
  textClasses,
  textSecondaryClasses,
  buttonPrimaryClasses
} = useThemeClasses()
</script>
```

### Approach 3: Hybrid (Best of Both Worlds)

```vue
<template>
  <div :class="cardClasses">
    <h1 class="text-foreground text-2xl font-bold">Title</h1>
    <p class="text-muted mb-4">Description</p>
    <button :class="buttonPrimaryClasses">Click me</button>
  </div>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'

const { cardClasses, buttonPrimaryClasses } = useThemeClasses()
</script>
```

---

## 🎨 Color System Reference

### Primary Colors
```css
/* Available CSS Variables */
--color-primary          /* Main brand color */
--color-secondary        /* Secondary brand color */
--color-accent          /* Accent/hover color */

/* Utility Classes */
.bg-primary             /* Background: primary color */
.text-primary           /* Text: primary color */
.border-primary         /* Border: primary color */
```

### Background Colors
```css
/* Variables */
--color-background      /* Main page background */
--surface-bg           /* Card/panel background */
--color-surface-secondary  /* Secondary surface */
--color-surface-tertiary   /* Tertiary surface */
--color-surface-hover      /* Hover state background */

/* Utility Classes */
.bg-background         /* Main background */
.bg-surface           /* Card/panel background */
.bg-surface-secondary /* Secondary surface */
.bg-surface-tertiary  /* Tertiary surface */
.bg-surface-hover     /* Hover background */
```

### Text Colors
```css
/* Variables */
--color-text              /* Primary text */
--color-muted            /* Secondary text */
--color-muted-foreground /* Tertiary/helper text */

/* Utility Classes */
.text-foreground         /* Primary text */
.text-muted             /* Secondary text */
.text-muted-foreground  /* Tertiary text */
```

### Status Colors
```css
/* Variables */
--color-success, --color-success-bg
--color-warning, --color-warning-bg  
--color-error, --color-error-bg

/* Utility Classes */
.bg-success, .text-success
.bg-warning, .text-warning
.bg-error, .text-error
.bg-success-bg, .bg-warning-bg, .bg-error-bg
```

---

## 🧩 Component Examples

### Example 1: Card Component Migration

**Before:**
```vue
<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Card Title</h3>
    <p class="text-gray-600 dark:text-gray-300">Card description here.</p>
    <button class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
      Action
    </button>
  </div>
</template>
```

**After (Approach 1 - Utility Classes):**
```vue
<template>
  <div class="bg-background border border-border rounded-lg p-6 transition-colors duration-200">
    <h3 class="text-lg font-semibold text-foreground mb-2">Card Title</h3>
    <p class="text-muted">Card description here.</p>
    <button class="mt-4 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded transition-colors duration-200">
      Action
    </button>
  </div>
</template>
```

**After (Approach 2 - Composable):**
```vue
<template>
  <div :class="cardClasses">
    <h3 :class="['text-lg font-semibold mb-2', textClasses]">Card Title</h3>
    <p :class="textSecondaryClasses">Card description here.</p>
    <button :class="['mt-4 px-4 py-2 rounded', buttonPrimaryClasses]">
      Action
    </button>
  </div>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'

const {
  cardClasses,
  textClasses,
  textSecondaryClasses,
  buttonPrimaryClasses
} = useThemeClasses()
</script>
```

### Example 2: Form Component

```vue
<template>
  <form :class="cardClasses">
    <div class="mb-4">
      <label :class="formLabelClasses">Email Address</label>
      <input 
        type="email" 
        :class="formInputClasses"
        placeholder="Enter your email"
      >
    </div>
    
    <div class="mb-6">
      <label :class="formLabelClasses">Password</label>
      <input 
        type="password" 
        :class="formInputClasses"
        placeholder="Enter your password"
      >
    </div>
    
    <div class="flex gap-3">
      <button type="button" :class="buttonOutlineClasses">
        Cancel
      </button>
      <button type="submit" :class="buttonPrimaryClasses">
        Sign In
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'

const {
  cardClasses,
  formLabelClasses,
  formInputClasses,
  buttonOutlineClasses,
  buttonPrimaryClasses
} = useThemeClasses()
</script>
```

### Example 3: Navigation Component

```vue
<template>
  <nav :class="navClasses">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <img src="/logo.png" alt="Logo" class="h-8 w-auto">
        </div>
        
        <div class="hidden md:flex space-x-8">
          <router-link 
            v-for="item in navigation" 
            :key="item.name"
            :to="item.href"
            :class="linkClasses"
          >
            {{ item.name }}
          </router-link>
        </div>
        
        <button :class="buttonSecondaryClasses">
          Sign In
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'

const {
  navClasses,
  linkClasses,
  buttonSecondaryClasses
} = useThemeClasses()

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
]
</script>
```

### Example 4: Status Badge Component

```vue
<template>
  <span :class="[statusBadgeClasses, getStatusColor(status)]">
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'

interface Props {
  status: 'success' | 'warning' | 'error' | 'pending'
}

defineProps<Props>()

const { statusBadgeClasses } = useThemeClasses()

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-success text-primary-foreground'
    case 'warning':
      return 'bg-warning text-primary-foreground'
    case 'error':
      return 'bg-error text-primary-foreground'
    default:
      return 'bg-surface text-muted'
  }
}
</script>
```

---

## 🎯 Common Patterns

### Pattern 1: Conditional Styling with Theme

```vue
<template>
  <div :class="getCardVariant(variant)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'

interface Props {
  variant?: 'default' | 'elevated' | 'outlined'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const { cardClasses } = useThemeClasses()

const getCardVariant = (variant: string) => {
  const baseClasses = 'transition-colors duration-200'
  
  switch (variant) {
    case 'elevated':
      return `${cardClasses.value} ${baseClasses} shadow-lg hover:shadow-xl`
    case 'outlined':
      return `bg-transparent border-2 border-border text-foreground ${baseClasses}`
    default:
      return `${cardClasses.value} ${baseClasses}`
  }
}
</script>
```

### Pattern 2: Dynamic Theme-Aware Styling

```vue
<template>
  <button 
    :class="buttonClasses"
    :style="dynamicStyles"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
})

const { buttonPrimaryClasses, buttonSecondaryClasses } = useThemeClasses()

const buttonClasses = computed(() => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const variantClasses = {
    primary: buttonPrimaryClasses.value,
    secondary: buttonSecondaryClasses.value,
    danger: 'bg-error text-primary-foreground hover:opacity-90 transition-colors duration-200'
  }
  
  return `${variantClasses[props.variant]} ${sizeClasses[props.size]} rounded-lg font-medium`
})

const dynamicStyles = computed(() => {
  // Use CSS variables for dynamic styling
  return {
    '--button-shadow': 'var(--color-primary)',
    boxShadow: props.variant === 'primary' ? '0 0 0 2px var(--button-shadow)' : 'none'
  }
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>
```

### Pattern 3: Composable Extension

```vue
<!-- MyCustomComponent.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

// Extend the theme composable with custom classes
const useCustomTheme = () => {
  const baseTheme = useThemeClasses()
  
  // Add custom component-specific classes
  const customCardClasses = computed(() => 
    `${baseTheme.cardClasses.value} custom-gradient`
  )
  
  const customButtonClasses = computed(() => 
    `${baseTheme.buttonPrimaryClasses.value} transform hover:scale-105`
  )
  
  return {
    ...baseTheme,
    customCardClasses,
    customButtonClasses
  }
}

const {
  customCardClasses,
  customButtonClasses,
  textClasses
} = useCustomTheme()
</script>

<style scoped>
.custom-gradient {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
}
</style>
```

---

## ✨ Best Practices

### 1. **Use CSS Variables for Dynamic Styling**
```vue
<template>
  <div 
    class="bg-primary text-primary-foreground"
    :style="{ 
      '--custom-opacity': opacity,
      backgroundColor: `rgba(var(--color-primary), var(--custom-opacity))` 
    }"
  >
    Dynamic opacity content
  </div>
</template>
```

### 2. **Prefer Composable for Complex Components**
Use `useThemeClasses` when your component has:
- Multiple themed elements
- Complex conditional styling
- Reusable class combinations

### 3. **Use Direct Classes for Simple Elements**
```vue
<!-- Simple elements - direct classes -->
<p class="text-muted text-sm">Simple text</p>
<div class="bg-surface border border-border rounded">Simple container</div>
```

### 4. **Consistent Transitions**
Always include transition classes for smooth theme switching:
```vue
<div class="bg-background text-foreground transition-colors duration-200">
  Content with smooth theme transitions
</div>
```

### 5. **Status Colors Pattern**
```vue
<script setup lang="ts">
const getStatusClasses = (status: string) => {
  const statusMap = {
    success: 'bg-success text-primary-foreground',
    warning: 'bg-warning text-primary-foreground',
    error: 'bg-error text-primary-foreground',
    info: 'bg-primary text-primary-foreground'
  }
  return statusMap[status] || 'bg-surface text-muted'
}
</script>
```

---

## 🐛 Troubleshooting

### Issue 1: Colors Not Updating in Dark Mode
**Problem:** Components still show light colors in dark mode
**Solution:** Check that you're using CSS variables, not hardcoded colors

```vue
<!-- ❌ Wrong -->
<div class="bg-white text-black">

<!-- ✅ Correct -->
<div class="bg-background text-foreground">
```

### Issue 2: Missing Transitions
**Problem:** Theme switching is abrupt
**Solution:** Add transition classes

```vue
<!-- ❌ Without transitions -->
<div class="bg-background text-foreground">

<!-- ✅ With transitions -->
<div class="bg-background text-foreground transition-colors duration-200">
```

### Issue 3: Inconsistent Styling
**Problem:** Some components look different from others
**Solution:** Use the composable for consistency

```vue
<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'

// Use composable classes instead of custom ones
const { cardClasses, textClasses } = useThemeClasses()
</script>
```

### Issue 4: Performance Issues
**Problem:** Too many computed properties
**Solution:** Destructure only what you need

```vue
<script setup lang="ts">
// ❌ Import everything
const themeClasses = useThemeClasses()

// ✅ Import only what you need
const { cardClasses, buttonPrimaryClasses } = useThemeClasses()
</script>
```

---

## 🎯 Migration Checklist

### Step 1: Identify Components to Migrate
- [ ] Components with hardcoded colors
- [ ] Components with `dark:` classes
- [ ] Form components
- [ ] Button components
- [ ] Card/container components

### Step 2: Choose Integration Approach
- [ ] Simple components → Direct utility classes
- [ ] Complex components → useThemeClasses composable
- [ ] Mixed approach for optimal balance

### Step 3: Test Theme Switching
- [ ] Test light/dark mode switching
- [ ] Verify color consistency
- [ ] Check transition smoothness
- [ ] Validate accessibility contrast

### Step 4: Update Documentation
- [ ] Document custom theme extensions
- [ ] Update component prop interfaces
- [ ] Add usage examples

---

## 📚 Additional Resources

- **CSS Variables Reference:** `/src/assets/themes.css`
- **Utility Classes:** `/src/assets/base.css`
- **Composable Documentation:** `/src/composables/useThemeClasses.ts`
- **Example Components:** `/src/components/orders/OrderDetailsModal.vue`

---

## 🎉 You're Ready!

With this guide, you can now integrate the centralized theme system into any component. Remember:

1. **Start simple** - Use direct utility classes for basic elements
2. **Scale up** - Use the composable for complex components  
3. **Stay consistent** - Always use the theme system for colors
4. **Test thoroughly** - Verify both light and dark modes work properly

Happy theming! 🎨✨
