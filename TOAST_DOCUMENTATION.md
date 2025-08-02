# Toast Notification System

A comprehensive toast notification system for the Vue.js e-commerce application, providing beautiful, accessible, and feature-rich notifications.

## Features

- 🎨 **Beautiful Design**: Glassmorphism effects with smooth animations
- 🎯 **Multiple Types**: Success, Error, Warning, and Info notifications
- ⚡ **Auto-dismiss**: Configurable duration with progress indicators
- 🖱️ **Interactive**: Hover to pause, action buttons, manual dismiss
- 📱 **Responsive**: Works perfectly on all screen sizes
- ♿ **Accessible**: ARIA labels, proper roles, and keyboard navigation
- 🔧 **Configurable**: Position, duration, max count, and more
- 🎭 **TypeScript**: Full type safety throughout

## Quick Start

### Basic Usage

```vue
<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const toast = useToast()

// Simple success notification
const handleSuccess = () => {
  toast.success('Operation completed successfully!')
}

// Error with title
const handleError = () => {
  toast.error('Something went wrong', {
    title: 'Error',
    duration: 6000,
  })
}

// Warning with action
const handleWarning = () => {
  toast.warning('Are you sure you want to continue?', {
    title: 'Confirmation Required',
    persistent: true,
    action: {
      label: 'Yes, Continue',
      handler: () => {
        // Handle confirmation
        toast.success('Action confirmed!')
      },
    },
  })
}
</script>
```

### Authentication Integration

The toast system is already integrated with the login flow:

```typescript
// In LoginView.vue
if (result?.success) {
  toast.success('Welcome back! You have been successfully logged in.', {
    title: 'Login Successful',
    duration: 4000,
  })

  setTimeout(async () => {
    await router.push({ name: 'userAccount' })
  }, 500)
}
```

## Toast Types

### Success Toasts

```typescript
toast.success('Data saved successfully!')
toast.success('Welcome back!', { title: 'Login Successful' })
```

### Error Toasts

```typescript
toast.error('Failed to save data')
toast.error('Invalid credentials', { title: 'Authentication Error' })
```

### Warning Toasts

```typescript
toast.warning('This action cannot be undone')
toast.warning('Please review your input', { title: 'Validation Warning' })
```

### Info Toasts

```typescript
toast.info('New features available!')
toast.info('Check your email for verification', { title: 'Email Sent' })
```

## Advanced Features

### Loading States

```typescript
const loader = toast.loading('Saving data...')

try {
  await saveData()
  loader.success('Data saved successfully!')
} catch (error) {
  loader.error('Failed to save data')
}
```

### API Response Handling

```typescript
const response = await api.post('/data', payload)
toast.apiResponse(response, 'Data Saved', 'Save Failed')
```

### Network Error with Retry

```typescript
toast.networkError(() => {
  // Retry function
  fetchData()
}, 'Failed to load data. Check your connection.')
```

### Persistent Notifications

```typescript
toast.persistent('System maintenance in progress', 'warning', {
  icon: 'hi-wrench',
})
```

### Form Validation Errors

```typescript
const errors = ['Email is required', 'Password too short']
toast.validationError(errors, 'Please fix the following issues')
```

## Configuration

### Global Configuration

```typescript
import { useToast } from '@/composables/useToast'

const toast = useToast()

// Update global settings
toast.store.updateConfig({
  position: 'bottom-right',
  defaultDuration: 4000,
  maxToasts: 3,
  pauseOnHover: true,
  showProgressBar: true,
})
```

### Available Positions

- `top-right` (default)
- `top-left`
- `bottom-right`
- `bottom-left`
- `top-center`
- `bottom-center`

## Toast Options

```typescript
interface ToastOptions {
  title?: string // Optional title
  message: string // Main message (required)
  type?: ToastType // 'success' | 'error' | 'warning' | 'info'
  duration?: number // Auto-dismiss time in ms
  persistent?: boolean // Prevent auto-dismiss
  action?: {
    // Action button
    label: string
    handler: () => void
  }
  icon?: string // Custom icon name (oh-vue-icons)
}
```

## Styling Customization

The toast system uses Tailwind CSS classes and follows your design system:

```vue
<!-- Custom toast styling example -->
<style>
.custom-toast {
  @apply bg-gradient-to-r from-purple-500 to-pink-500;
  @apply text-white border-none;
}
</style>
```

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Live Regions**: Announcements for dynamic content
- **Keyboard Navigation**: Focus management and escape key support
- **High Contrast**: Readable in all color modes
- **Motion Preferences**: Respects `prefers-reduced-motion`

## Best Practices

### 1. Appropriate Timing

```typescript
// Short for confirmations
toast.success('Saved!', { duration: 2000 })

// Longer for errors that need attention
toast.error('Please fix the errors below', { duration: 7000 })

// Persistent for critical information
toast.error('Payment failed', { persistent: true })
```

### 2. Clear Messaging

```typescript
// ❌ Vague
toast.error('Error')

// ✅ Specific
toast.error('Failed to update profile. Please check your internet connection.')
```

### 3. Action-Oriented

```typescript
// ✅ Provide actions when helpful
toast.error('Failed to save changes', {
  action: {
    label: 'Retry',
    handler: () => saveChanges(),
  },
})
```

### 4. Consistent Types

```typescript
// Use consistent types for similar actions
toast.success('Product added to cart')
toast.success('Item removed from wishlist')
toast.error('Failed to add to cart')
```

## Examples in Different Contexts

### E-commerce Actions

```typescript
// Add to cart
toast.success('Added to cart!', {
  title: 'Product Added',
  action: {
    label: 'View Cart',
    handler: () => router.push('/cart'),
  },
})

// Checkout
const checkout = toast.loading('Processing payment...')
try {
  await processPayment()
  checkout.success('Payment successful! Order confirmed.')
} catch (error) {
  checkout.error('Payment failed. Please try again.')
}

// Wishlist
toast.info('Added to wishlist', {
  icon: 'hi-heart',
  duration: 3000,
})
```

### User Account Actions

```typescript
// Profile update
toast.success('Profile updated successfully!')

// Password change
toast.success('Password changed successfully', {
  title: 'Security Update',
  icon: 'hi-shield-check',
})

// Email verification
toast.info('Verification email sent. Please check your inbox.', {
  title: 'Email Verification',
  duration: 8000,
})
```

## Performance Considerations

- **Automatic Cleanup**: Old toasts are automatically removed
- **Maximum Limit**: Prevents memory leaks with `maxToasts` setting
- **Efficient Rendering**: Uses Vue's `TransitionGroup` for smooth animations
- **Timer Management**: Proper cleanup of intervals and timeouts

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Troubleshooting

### Toast Not Appearing

1. Ensure `ToastContainer` is in your `App.vue`
2. Check the toast position configuration
3. Verify z-index isn't being overridden

### Styling Issues

1. Ensure Tailwind CSS is properly configured
2. Check for conflicting CSS rules
3. Verify `oh-vue-icons` is set up correctly

### TypeScript Errors

1. Ensure all types are imported correctly
2. Check the toast options match the interface
3. Verify Pinia store is properly configured

## Contributing

When adding new toast features:

1. Update the TypeScript interfaces
2. Add corresponding documentation
3. Include accessibility considerations
4. Test across different screen sizes
5. Follow the existing code patterns
