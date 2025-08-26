# Error Handling System Documentation

## Overview

This application includes a comprehensive error handling system with dedicated error pages for different HTTP status codes and a reusable error handling composable.

## Error Pages

### Supported Error Codes

The error view supports the following HTTP status codes:

- **400 Bad Request** - Invalid request parameters or malformed data
- **401 Unauthorized** - Authentication required to access the resource
- **403 Forbidden** - Access denied due to insufficient permissions
- **404 Not Found** - The requested resource could not be found
- **500 Internal Server Error** - An internal server error has occurred
- **502 Bad Gateway** - The server received an invalid response

### Error Page Features

Each error page includes:

- **Animated Error Icon** - Visual representation of the error type
- **Error Code & Title** - Clear identification of the error
- **Descriptive Message** - User-friendly explanation of what went wrong
- **Action Buttons** - Primary and secondary actions for error recovery
- **Help Text** - Additional guidance for users
- **Contact Support Link** - For server errors (500, 502)
- **Responsive Design** - Works across all device sizes

### Using Error Pages

#### Direct Navigation

```typescript
// Navigate to specific error page
router.push('/error/404')
router.push('/error/500')
```

#### With Custom Content

```typescript
// Using query parameters
router.push({
  path: '/error/404',
  query: {
    title: 'Custom Error Title',
    description: 'Custom error description'
  }
})
```

#### Programmatic Navigation

```typescript
import { useErrorHandler } from '@/composables/useErrorHandler'

const { navigateToError } = useErrorHandler()

// Navigate with custom content
navigateToError(404, 'Custom Title', 'Custom Description')
```

## Error Handler Composable

The `useErrorHandler` composable provides consistent error handling across the application.

### Basic Usage

```typescript
import { useErrorHandler } from '@/composables/useErrorHandler'

const { handleApiError, handleError } = useErrorHandler()

// Handle API errors automatically
try {
  const response = await api.getData()
} catch (error) {
  handleApiError(error) // Automatically routes to appropriate error page
}

// Handle specific error codes
handleError(404, 'Custom message', false) // Navigates to error page
handleError(404, 'Custom message', true)  // Shows toast instead
```

### Advanced Error Handling

```typescript
// Handle with options
handleApiError(error, {
  customMessage: 'Something went wrong',
  skipRedirect: false,  // Set to true to show toast instead
  showToast: true      // Set to false to handle silently
})

// Check if error is network-related
if (isNetworkError(error)) {
  handleNetworkError(error)
}
```

### Error Types

The composable handles different error formats:

```typescript
// Axios errors
{
  response: {
    status: 404,
    data: { message: 'Not found' }
  }
}

// Fetch errors
{
  status: 500,
  statusText: 'Internal Server Error'
}

// Network errors
{
  code: 'NETWORK_ERROR',
  message: 'Network Error'
}

// Simple error codes
404
500
```

## Router Integration

### Error Routes

The router includes dedicated error routes:

```typescript
// Specific error codes
'/error/400' -> ErrorView with errorCode: 400
'/error/404' -> ErrorView with errorCode: 404
'/error/500' -> ErrorView with errorCode: 500

// Catch-all for 404
'/:pathMatch(.*)' -> ErrorView with errorCode: 404
```

### Route Props

Error routes accept props and query parameters:

```typescript
// Props (programmatic navigation)
{ errorCode: 404, customTitle: 'Custom Title' }

// Query parameters (URL-based)
'/error/404?title=Custom%20Title&description=Custom%20Description'
```

### Navigation Guards

The error system integrates with router navigation guards for automatic error handling:

```typescript
router.beforeEach((to, from, next) => {
  // Authentication errors automatically redirect to appropriate pages
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/error/401') // or '/login'
  }
  next()
})
```

## Toast Integration

Error handling integrates with the toast system for non-blocking error notifications:

```typescript
import { useToast } from '@/composables/useToast'

const { error, networkError } = useToast()

// Show error toast
error('Something went wrong', { title: 'Error' })

// Show network error with retry
networkError(() => retryFunction(), 'Connection failed')
```

## Best Practices

### When to Use Error Pages vs Toasts

**Use Error Pages for:**
- Navigation errors (404, 403)
- Authentication errors (401)
- Critical system errors (500, 502)
- Errors that prevent page functionality

**Use Toasts for:**
- Form validation errors
- API call failures that don't break the page
- Network connectivity issues
- Non-critical errors

### Error Page Customization

```typescript
// Custom error page with actions
<ErrorView
  :error-code="404"
  custom-title="Product Not Found"
  custom-description="The product you're looking for is no longer available."
  :custom-primary-action="() => router.push('/catalog')"
  :custom-secondary-action="() => router.push('/')"
/>
```

### API Integration

```typescript
// API service with error handling
class ApiService {
  private errorHandler = useErrorHandler()

  async get(url: string) {
    try {
      return await fetch(url)
    } catch (error) {
      this.errorHandler.handleApiError(error, {
        skipRedirect: false, // Navigate to error page
        showToast: false    // Don't show toast (page handles it)
      })
      throw error
    }
  }
}
```

## Testing

### Error Demo Page

Visit `/error-demo` to test all error scenarios:

- View all error pages
- Test error handler functionality
- Simulate API and network errors
- Test custom error page content

### Unit Testing

```typescript
// Test error handler
describe('useErrorHandler', () => {
  it('should navigate to 404 page for 404 errors', () => {
    const { handleError } = useErrorHandler()
    handleError(404)
    expect(router.push).toHaveBeenCalledWith('/error/404')
  })
})
```

## Accessibility

Error pages include accessibility features:

- **ARIA Labels** - Screen reader support
- **Semantic HTML** - Proper heading hierarchy
- **Focus Management** - Keyboard navigation support
- **High Contrast** - Error state visual indicators
- **Clear Language** - Plain English error messages

## Internationalization

Error messages support i18n:

```typescript
// In error configurations
title: t('errors.404.title'),
description: t('errors.404.description')
```

## Performance

- **Lazy Loading** - Error pages are loaded on demand
- **Code Splitting** - Error handling code is bundled separately
- **Minimal Dependencies** - Lightweight error handling logic
- **Caching** - Error pages are cached for quick access
