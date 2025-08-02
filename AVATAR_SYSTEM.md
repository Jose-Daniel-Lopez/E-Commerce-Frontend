# 🖼️ Avatar System Documentation

## Overview

The avatar system allows users to select and display custom profile pictures throughout the application. The system uses the RoboHash API to generate unique robot avatars and displays them in the header and user profile sections.

## Components

### 1. UserAvatar Component (`/src/components/shared/UserAvatar.vue`)

A reusable component that displays the user's avatar or a fallback icon.

**Features:**

- Automatically shows user avatar when authenticated
- Falls back to default user icon when not authenticated or no avatar set
- Includes error handling for failed image loads
- Optional online status indicator
- Responsive design with hover effects
- TypeScript support

**Props:**

```typescript
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' // Size variant (future enhancement)
  showStatus?: boolean // Show online status indicator
  iconScale?: number // Scale for fallback icon
  fallbackToIcon?: boolean // Whether to show icon on error
}
```

**Usage:**

```vue
<UserAvatar :show-status="true" :icon-scale="1.7" />
```

### 2. AvatarSelector Component (`/src/components/users/AvatarSelector.vue`)

A modal component for selecting and generating new avatars.

**Features:**

- Generates 8 unique robot avatars using RoboHash API
- Shows current avatar
- Allows regenerating new options
- Saves selected avatar to user profile
- Loading states and error handling

## Integration Points

### Header Integration

The `UserAvatar` component is integrated into:

- `IconMenu.vue` - Shows in the main navigation
- `MainHeader.vue` - Used via IconMenu component

### User Account Integration

The avatar system is fully integrated with the user account system:

- `UserAccountView.vue` - Profile management
- `auth.ts` store - User data persistence
- Backend API - Avatar URL storage

## Data Flow

1. **Avatar Selection:**

   ```
   UserAccountView → AvatarSelector → RoboHash API → saveAvatar()
   ```

2. **Avatar Display:**

   ```
   Auth Store → UserAvatar Component → Header Display
   ```

3. **Data Persistence:**
   ```
   Frontend → Backend API → Database → LocalStorage Cache
   ```

## Avatar Generation

Avatars are generated using the RoboHash API:

```javascript
const generateAvatarUrl = (seed: string, set: string = 'set1') => {
  return `https://robohash.org/${encodeURIComponent(seed)}?set=${set}&size=200x200&bgset=bg1`
}
```

**Parameters:**

- `seed`: Unique identifier (username + userId + timestamp + random)
- `set`: Robot style (set1, set2, set3, set4)
- `size`: Image dimensions (200x200)
- `bgset`: Background style (bg1)

## State Management

The avatar system uses Pinia stores for state management:

### Auth Store (`/src/stores/auth.ts`)

```typescript
interface User {
  id: number
  username: string
  email: string
  avatar: string // <- Avatar URL stored here
  role: string
  isVerified: boolean
  location?: string
}
```

**Key Methods:**

- `updateUserProfile()` - Updates user avatar
- `fetchCurrentUser()` - Refreshes user data
- `initializeAuth()` - Loads cached user data

## API Integration

### Update Avatar Endpoint

```
PATCH /users/:id
Body: { avatar: "https://robohash.org/..." }
```

### Get User Data Endpoint

```
GET /users/me
Response: { avatar: "https://robohash.org/..." }
```

## Error Handling

The system includes comprehensive error handling:

1. **Image Load Errors:** Falls back to default icon
2. **API Errors:** Shows toast notifications
3. **Network Errors:** Graceful degradation
4. **Cache Failures:** Automatic retry mechanisms

## Accessibility

- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Alternative text for images

## Performance Considerations

- **Lazy Loading:** Images load only when visible
- **Caching:** Browser caches avatar images
- **Optimization:** 200x200 size balance between quality and performance
- **CDN:** RoboHash provides global CDN delivery

## Security

- **URL Validation:** Avatar URLs are validated
- **XSS Prevention:** Proper image source handling
- **CORS:** RoboHash API supports cross-origin requests
- **Input Sanitization:** Seeds are properly encoded

## Future Enhancements

1. **Custom Uploads:** Allow users to upload their own images
2. **Avatar Editor:** In-app avatar customization
3. **Multiple Providers:** Support for Gravatar, custom services
4. **Size Variants:** Dynamic sizing based on context
5. **Animation:** Smooth transitions and loading states

## Troubleshooting

### Common Issues

1. **Avatar Not Showing:**

   - Check network connectivity
   - Verify user is authenticated
   - Check browser console for errors

2. **Avatar Not Updating:**

   - Clear browser cache
   - Check localStorage for stale data
   - Verify API response

3. **Performance Issues:**
   - Check image loading times
   - Monitor network requests
   - Consider image optimization

### Debug Tools

```javascript
// Check current user avatar
console.log('Current avatar:', authStore.user?.avatar)

// Check localStorage
console.log('Cached user:', localStorage.getItem('user'))

// Force refresh user data
await authStore.fetchCurrentUser()
```

## Dependencies

- **Vue 3:** Composition API and reactivity
- **Pinia:** State management
- **TypeScript:** Type safety
- **oh-vue-icons:** Fallback icons
- **RoboHash API:** Avatar generation
- **Tailwind CSS:** Styling

## Contributing

When modifying the avatar system:

1. Update TypeScript interfaces if needed
2. Test with different user states (authenticated/non-authenticated)
3. Verify responsive design on mobile
4. Check accessibility compliance
5. Update this documentation
