# Style Optimization Guide

## Overview

This guide provides comprehensive instructions for optimizing styles across all components and views in the e-commerce frontend application. The optimization follows a clear separation of concerns: **global theme-aware styles** go in `base.css`, while **component-specific styles** remain in individual component files.

## Table of Contents

1. [Style Architecture](#style-architecture)
2. [Global vs Component Specific Styles](#global-vs-component-specific-styles)
3. [Available Global Theme Classes](#available-global-theme-classes)
4. [Migration Steps](#migration-steps)
5. [Best Practices](#best-practices)
6. [Examples](#examples)
7. [Common Patterns](#common-patterns)

## Style Architecture

### File Structure

```text
src/
├── assets/
│   ├── base.css        # Global styles, theme utilities, reusable classes
│   └── themes.css      # Color palette and theme variables
└── components/views/
    └── *.vue           # Component-specific styles only
```

### Design Philosophy

- **Global First**: Use theme-aware classes for consistent theming
- **Component Specific**: Only component-unique styles in `.vue` files
- **Reusability**: Promote style reuse across components
- **Maintainability**: Centralized theme management

## Global vs Component Specific Styles

### Move to base.css (Global Styles)

#### Theme-Aware Classes

```css
.theme-text          /* Text color based on theme */
.theme-surface       /* Surface background */
.theme-card          /* Card styling with theme borders */
.theme-muted-text    /* Muted text color */
.theme-border        /* Theme-aware borders */
.theme-input         /* Input styling with theme colors */
```

#### Utility Classes

```css
.transition-all      /* Standard transition timing */
.hover-scale         /* Scale on hover effect */
.hover-lift          /* Lift on hover effect */
.hover-avatar        /* Avatar hover effect */
```

#### Input and Form Styles

```css
input::placeholder   /* Global placeholder styling */
button:focus         /* Global focus reset */
```

### Keep in Component Files (Component-Specific)

#### Component-Unique Interactions

- Product-specific hover effects
- Custom animations for specific features
- Layout-specific transitions
- Component-unique responsive behavior

#### Examples of Component-Specific Styles

```css
.product-image-hover     /* Product gallery specific */
.color-button           /* Product color selection */
.cart-animation         /* Shopping cart specific */
.modal-slide-in         /* Modal-specific animations */
```

## Available Global Theme Classes

### Text and Typography

```css
.theme-text                 /* Primary text color */
.theme-muted-text          /* Secondary text color */
.theme-muted-foreground    /* Tertiary/helper text */
```

### Backgrounds and Surfaces

```css
.theme-surface             /* Card/panel backgrounds */
.theme-card               /* Card with border styling */
.theme-icon-container     /* Icon container backgrounds */
```

### Interactive States

```css
.theme-error-bg           /* Error background with text */
.theme-error-text         /* Error text color */
.theme-warning-bg         /* Warning background */
.theme-warning-text       /* Warning text color */
.theme-success-text       /* Success text color */
```

### Form Elements

```css
.theme-input              /* Input field styling */
.theme-border             /* Theme-aware borders */
```

### Utilities

```css
.theme-fade-overlay       /* Gradient fade overlay */
.theme-debug-bg          /* Debug panel styling */
```

## Migration Steps

### Step 1: Audit Component Styles

For each component, identify:

```vue
<!-- BEFORE: Mixed global and component styles -->
<style scoped>
/* Global theme styles - MOVE TO base.css */
.theme-text { color: var(--color-text); }
.theme-card { background: var(--color-background); }

/* Component-specific - KEEP HERE */
.product-card-hover { transform: scale(1.02); }
.category-specific-animation { /* ... */ }
</style>
```

### Step 2: Move Global Styles

Move theme-aware styles to `base.css`:

```css
/* In base.css - Add to utilities section */
@layer utilities {
  /* Component-specific theme classes */
  .component-theme-text { color: var(--color-text) !important; }
  .component-theme-card { 
    background: var(--color-background) !important;
    border-color: var(--color-border) !important;
  }
}
```

### Step 3: Update Component Templates

Replace hardcoded theme classes with global ones:

```vue
<!-- BEFORE -->
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">

<!-- AFTER -->
<div :class="cardClasses">
<!-- OR -->
<div class="theme-card theme-text">
```

### Step 4: Clean Component Styles

Keep only component-specific styles:

```vue
<!-- AFTER: Clean component styles -->
<style scoped>
/* Only component-specific interactions */
.product-card-hover {
  transition: transform 0.3s ease;
}

.product-card-hover:hover {
  transform: scale(1.02);
}

.category-animation {
  /* Component-unique animation */
}
</style>
```

## Best Practices

### 1. Use Composables for Theme Classes

```typescript
// In component script
import { useThemeClasses } from '@/composables/useThemeClasses'

const {
  cardClasses,
  textClasses,
  buttonPrimaryClasses
} = useThemeClasses()
```

### 2. Prefer Global Classes Over Inline Styles

```vue
<!-- ❌ Don't do this -->
<div :style="{ color: isDark ? '#fff' : '#000' }">

<!-- ✅ Do this -->
<div class="theme-text">
```

### 3. Use CSS Custom Properties

```css
/* ✅ Good - Uses theme variables */
.component-button {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

/* ❌ Avoid - Hardcoded colors */
.component-button {
  background: #3b82f6;
  color: #ffffff;
}
```

### 4. Organize Component Styles

```vue
<style scoped>
/* 1. Component layout */
.component-container { /* ... */ }

/* 2. Interactive states */
.component-hover:hover { /* ... */ }

/* 3. Animations */
@keyframes componentAnimation { /* ... */ }

/* 4. Responsive styles */
@media (min-width: 768px) { /* ... */ }
</style>
```

## Examples

### Example 1: Product Card Component

```vue
<!-- ProductCard.vue -->
<template>
  <div :class="['product-card', cardClasses]">
    <img :class="productImageClasses" />
    <h3 :class="textClasses">{{ product.name }}</h3>
    <p :class="textMutedClasses">{{ product.price }}</p>
    <button :class="buttonPrimaryClasses">Add to Cart</button>
  </div>
</template>

<style scoped>
/* Only component-specific styles */
.product-card {
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-image {
  transition: opacity 0.2s ease;
}

.product-image:hover {
  opacity: 0.8;
}
</style>
```

### Example 2: Modal Component

```vue
<!-- Modal.vue -->
<template>
  <div class="modal-overlay">
    <div :class="['modal-content', cardClasses]">
      <header :class="['modal-header', borderClasses]">
        <h2 :class="textClasses">{{ title }}</h2>
      </header>
      <main :class="textClasses">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
}

.modal-content {
  position: relative;
  max-width: 500px;
  margin: 2rem auto;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
```

## Common Patterns

### 1. Form Components

```vue
<template>
  <div :class="formGroupClasses">
    <label :class="textClasses">{{ label }}</label>
    <input :class="['form-input', inputClasses]" />
    <span v-if="error" :class="errorTextClasses">{{ error }}</span>
  </div>
</template>

<style scoped>
.form-input {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
```

### 2. Navigation Components

```vue
<template>
  <nav :class="['navigation', surfaceClasses]">
    <a 
      v-for="item in items" 
      :key="item.id"
      :class="['nav-item', textClasses]"
      class="nav-link"
    >
      {{ item.label }}
    </a>
  </nav>
</template>

<style scoped>
.nav-link {
  transition: color 0.2s ease, background-color 0.2s ease;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.nav-link:hover {
  background: var(--color-muted);
}

.nav-link.active {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}
</style>
```

### 3. Card Components

```vue
<template>
  <article :class="['card', cardClasses, 'card-hover']">
    <header v-if="title" :class="['card-header', borderClasses]">
      <h3 :class="textClasses">{{ title }}</h3>
    </header>
    <div class="card-content">
      <slot />
    </div>
  </article>
</template>

<style scoped>
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  border-bottom-width: 1px;
}
</style>
```

## Benefits of This Approach

### 1. Consistency

- Unified theming across all components
- Automatic dark/light mode support
- Consistent spacing and typography

### 2. Maintainability

- Centralized theme management
- Easy to update colors globally
- Reduced code duplication

### 3. Performance

- Smaller component bundles
- Better CSS caching
- Reduced runtime style calculations

### 4. Developer Experience

- Clear separation of concerns
- Reusable style patterns
- Type-safe theme classes with composables

## Validation Checklist

Before considering a component optimized, ensure:

- [ ] All theme-related colors use CSS custom properties
- [ ] No hardcoded colors (except component-specific brand colors)
- [ ] Global interactions moved to `base.css`
- [ ] Component styles are truly component-specific
- [ ] Uses theme composables where applicable
- [ ] Responsive design uses consistent breakpoints
- [ ] Animations are smooth and purposeful
- [ ] Accessibility is maintained (focus states, contrast)

## Notes

- Always test in both light and dark themes
- Consider mobile-first responsive design
- Maintain accessibility standards
- Document any custom component-specific theme extensions
- Use semantic class names that describe purpose, not appearance

*This guide should be followed for all new components and used as a reference when refactoring existing ones. Consistent application of these principles will result in a more maintainable, scalable, and cohesive design system.*
