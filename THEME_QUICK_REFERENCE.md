# 🎨 Theme System Quick Reference

## 🚀 Most Common Classes

### Backgrounds
```
bg-background      /* Main page background */
bg-surface         /* Cards, panels */
bg-surface-secondary   /* Secondary surfaces */
bg-primary         /* Primary brand color */
```

### Text Colors
```
text-foreground    /* Primary text */
text-muted         /* Secondary text */
text-muted-foreground  /* Helper/tertiary text */
text-primary       /* Primary brand color text */
```

### Borders & States
```
border-border      /* Standard borders */
hover:bg-surface-hover  /* Hover backgrounds */
focus:border-primary    /* Focus states */
```

### Status Colors
```
bg-success, text-success    /* Success states */
bg-warning, text-warning    /* Warning states */
bg-error, text-error        /* Error states */
```

## 📝 Quick Integration Examples

### Basic Component
```vue
<template>
  <div class="bg-background text-foreground border border-border rounded-lg p-4">
    <h2 class="text-foreground text-xl font-semibold mb-2">Title</h2>
    <p class="text-muted">Description text</p>
    <button class="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90">
      Action
    </button>
  </div>
</template>
```

### Using Composable
```vue
<template>
  <div :class="cardClasses">
    <h2 :class="textClasses">Title</h2>
    <p :class="textSecondaryClasses">Description</p>
    <button :class="buttonPrimaryClasses">Action</button>
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

### Form Example
```vue
<template>
  <form :class="cardClasses">
    <label :class="formLabelClasses">Email</label>
    <input type="email" :class="formInputClasses" placeholder="Enter email">
    <button type="submit" :class="buttonPrimaryClasses">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'

const {
  cardClasses,
  formLabelClasses,
  formInputClasses,
  buttonPrimaryClasses
} = useThemeClasses()
</script>
```

## 🛠 Available Composable Classes

```typescript
// Containers
cardClasses              // Cards, sections
sectionContainerClasses  // Page sections
listItemClasses         // List items

// Text
textClasses             // Primary text
textSecondaryClasses    // Secondary text
textMutedClasses        // Muted text

// Buttons
buttonPrimaryClasses    // Primary buttons
buttonSecondaryClasses  // Secondary buttons
buttonOutlineClasses    // Outline buttons

// Forms
formInputClasses        // Form inputs
formLabelClasses        // Form labels

// Navigation
navClasses              // Navigation bars
linkClasses             // Links

// Status & Icons
statusBadgeClasses      // Status badges
iconContainerClasses    // Icon containers
emptyStateTextClasses   // Empty states
```

## 🎯 Migration Pattern

1. **Find hardcoded colors**: `bg-gray-50`, `text-black`, etc.
2. **Replace with theme classes**: `bg-surface`, `text-foreground`
3. **Add transitions**: `transition-colors duration-200`
4. **Test both themes**: Light and dark modes

## 💡 Pro Tips

- Always add `transition-colors duration-200` for smooth theme switching
- Use CSS variables in `:style` for dynamic coloring
- Prefer composable for complex components, direct classes for simple ones
- Test both light and dark modes after changes
