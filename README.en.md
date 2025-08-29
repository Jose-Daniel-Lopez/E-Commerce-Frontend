# E-Commerce Frontend

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5.13-4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.2.4-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.10-38B2AC)
![Pinia](https://img.shields.io/badge/Pinia-3.0.1-ffd859)

Modern e-commerce web application built with Vue.js 3, TypeScript, Tailwind CSS, and reusable component architecture.

[Live Demo](https://tab-to-dev.click/tejon-tech/) • [Report Issues](../../issues)

</div>

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Theme System](#theme-system)
- [Internationalization](#internationalization)
- [Testing](#testing)
- [Build and Deploy](#build-and-deploy)
- [Development](#development)
- [Contributing](#contributing)

## Features

### Core E-Commerce Functionality

- **Product catalog** with advanced filtering and search capabilities
- **Shopping cart** with persistent state and quantity management
- **Wishlist system** for favorite products
- **Complete checkout process** with multiple payment methods
- **Order management** with status tracking
- **Product review system** with star ratings

### User Experience

- **Responsive design** optimized for mobile-first approach
- **Dark/light theme system** with smooth transitions
- **Internationalization (i18n)** supporting Spanish and English
- **Reusable component library** with consistent design
- **Smooth animations** and micro-interactions
- **Toast notifications** for user feedback

### Technical Features

- **JWT authentication** with persistent state management
- **Centralized state management** using Pinia
- **Lazy loading** for routes and components
- **Centralized icon system** with oh-vue-icons
- **Cloudinary integration** for image optimization
- **Automated testing** with Playwright

## Technology Stack

### Frontend Core

- **[Vue.js 3.5.13](https://vuejs.org/)** - Progressive framework with Composition API
- **[TypeScript 5.8.0](https://www.typescriptlang.org/)** - Static typing for JavaScript
- **[Vite 6.2.4](https://vitejs.dev/)** - Ultra-fast build tool with HMR
- **[Vue Router 4.5.0](https://router.vuejs.org/)** - SPA routing

### State Management and Data

- **[Pinia 3.0.1](https://pinia.vuejs.org/)** - Modern state management for Vue
- **[Axios 1.10.0](https://axios-http.com/)** - HTTP client for API communication
- **[Vue I18n 9.14.4](https://vue-i18n.intlify.dev/)** - Internationalization framework

### UI and Styling

- **[Tailwind CSS 4.1.10](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Heroicons](https://heroicons.com/)** - Beautifully crafted SVG icons
- **[oh-vue-icons](https://oh-vue-icons.js.org/)** - Icon library for Vue
- **[Swiper 11.2.10](https://swiperjs.com/)** - Modern touch slider

### Development Tools

- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Code linting and formatting
- **[OxLint](https://oxc.rs/docs/guide/usage/linter.html)** - Ultra-fast linter written in Rust
- **[Playwright](https://playwright.dev/)** - End-to-end testing framework
- **[Vue DevTools](https://devtools.vuejs.org/)** - Advanced debugging tools

### External Services

- **[EmailJS](https://www.emailjs.com/)** - Email sending service from frontend
- **[Cloudinary](https://cloudinary.com/)** - Image management and optimization

## Architecture

### Project Structure

```bash
src/
├── assets/              # Static assets and global styles
│   ├── styles/          # Global styles and theme definitions
│   └── themes.css       # CSS variables for themes
├── components/          # Reusable Vue components
│   ├── shared/          # Global components
│   ├── products/        # Product-related components
│   ├── cart/           # Shopping cart components
│   ├── user/           # User-related components
│   └── ...             # Other specific modules
├── views/              # Main pages and route components
│   ├── home/           # Home page components
│   ├── auth/           # Authentication pages
│   ├── catalog/        # Product catalog pages
│   ├── checkout/       # Checkout process
│   └── user/           # User profile pages
├── stores/             # Pinia state stores
├── router/             # Vue Router configuration
├── composables/        # Reusable composition functions
├── types/              # TypeScript type definitions
├── locales/            # i18n translation files
├── plugins/            # Vue plugin configurations
└── lib/               # Utilities and helper functions
```

### Architectural Patterns

- **Composition API**: Exclusive use of Vue 3's Composition API
- **Modular stores**: State divided by functionality (auth, cart, products, etc.)
- **Atomic components**: Design based on small, reusable components
- **Lazy loading**: Lazy loading of routes for performance optimization

## Installation

### Prerequisites

- Node.js 18+
- npm 8+ or yarn/pnpm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Jose-Daniel-Lopez/E-Commerce-Frontend.git
cd E-Commerce-Frontend
```

### 2. Install dependencies

```bash
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000

# Application Configuration
VITE_APP_NAME=E-Commerce Frontend
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false

# UI Configuration
VITE_DEFAULT_LANGUAGE=en
VITE_CURRENCY=USD
VITE_ITEMS_PER_PAGE=10

# EmailJS Configuration (optional)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 4. Run development server

```bash
npm run dev

# The application will be available at http://localhost:5173
```

## Configuration

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | ✅ | `http://localhost:8080/api` |
| `VITE_API_TIMEOUT` | HTTP request timeout | ❌ | `10000` |
| `VITE_APP_NAME` | Application name | ❌ | `E-Commerce Frontend` |
| `VITE_DEFAULT_LANGUAGE` | Default language | ❌ | `en` or `es` |
| `VITE_CURRENCY` | Default currency | ❌ | `USD` |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID | ❌ | For contact form |

### Vite Configuration

- **Base URL**: `/tejon-tech/` (configured for deployment)
- **Alias**: `@` points to `src/`
- **Plugins**: Vue, JSX, DevTools, Tailwind CSS

### Tailwind Configuration

- **Dark mode**: Class-based CSS (`dark`)
- **Custom breakpoints**: `xs: 420px`
- **CSS variables**: Integration with theme system
- **Custom fonts**: Figtree, SR Pro Display

## Usage

### Development Commands

```bash
npm run dev              # Development server with hot reload
npm run build            # Production build
npm run preview          # Preview production build
npm run type-check       # TypeScript type checking
```

### Code Quality

```bash
npm run lint             # Run all linters
npm run lint:eslint      # ESLint only
npm run lint:oxlint      # OxLint only
npm run format           # Format code with Prettier
```

### Testing Commands

```bash
npm run install-browsers # Install browsers for testing
npx playwright test      # Run E2E tests
npx playwright test --ui # Run tests with visual interface
```

### Migration Scripts

```bash
npm run migrate-images     # Migrate images to Cloudinary
npm run update-image-paths # Update image paths
npm run cloudinary-migration # Complete migration process
```

## Theme System

### Features

- Dark/light mode with smooth transitions
- Custom CSS variables for colors
- Theme persistence in localStorage
- Automatic system theme detection
- Centralized `useThemeClasses` composable

### Usage Example

```vue
<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { useThemeClasses } from '@/composables/useThemeClasses'

const themeStore = useThemeStore()
const { cardClasses, buttonClasses } = useThemeClasses()
</script>

<template>
  <button @click="themeStore.toggleTheme()">
    Toggle Theme
  </button>

  <div :class="cardClasses">
    <button :class="buttonClasses.primary">
      Themed Button
    </button>
  </div>
</template>
```

### Theme System Files

- `src/assets/themes.css` - CSS color variables
- `src/stores/theme.ts` - Theme management store
- `src/composables/useThemeClasses.ts` - Reusable CSS classes

## Internationalization

### Supported Languages

- **English (en)** - Default language
- **Spanish (es)** - Complete translations

### Using i18n

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const changeLanguage = (newLocale: string) => {
  locale.value = newLocale
}
</script>

<template>
  <h1>{{ t('home.welcome') }}</h1>
  <p>{{ t('products.description', { count: 5 }) }}</p>
</template>
```

### Translation Structure

```json
{
  "nav": {
    "home": "Home",
    "products": "Products",
    "cart": "Cart"
  },
  "products": {
    "title": "Products",
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock"
  }
}
```

## Testing

### End-to-End Testing with Playwright

```bash
# Run all tests
npx playwright test

# Run with visual interface
npx playwright test --ui

# Run specific test
npx playwright test tests/auth.spec.ts

# Generate HTML report
npx playwright show-report
```

### Test Structure

```bash
tests/
├── example.spec.ts         # Example test
└── tests-examples/         # Additional examples
```

## Build and Deploy

### Production Build

```bash
npm run build

# Built files are generated in dist/
ls dist/
```

### Deployment Configuration

- **Base URL**: Configured for `/tejon-tech/` in production
- **Asset optimization**: Automatic image and CSS optimization
- **Code splitting**: Automatic code splitting for efficient loading

## Development

### Pinia Store Structure

```typescript
├── auth.ts              # User authentication and session
├── userCart.ts          # Shopping cart management
├── products.ts          # Product catalog
├── categories.ts        # Product categories
├── orders.ts            # Order management
├── wishlist.ts          # Wishlist functionality
├── theme.ts             # Theme system
├── toast.ts             # Notifications
└── checkout.ts          # Payment process
```

### Available Composables

```typescript
├── useThemeClasses      # CSS classes for themes
├── useScrollToTop       # Automatic scrolling
├── useAuth              # Authentication logic
├── useCart              # Cart logic
└── useProducts          # Product logic
```

### Code Conventions

- **Naming**: PascalCase for components, camelCase for variables
- **Composition API**: Exclusive use of `<script setup>`
- **TypeScript**: Strict typing in all files
- **CSS**: Utility-first approach with Tailwind CSS
- **Commits**: Conventional commits for automated changelog

### Reusable Components

#### Base Components

- `Button.vue` - Buttons with variants and states
- `FloatingInput.vue` - Input fields with floating labels
- `LoadingState.vue` - Consistent loading states
- `ErrorAlert.vue` - Error handling components

#### E-Commerce Components

- `ProductCard.vue` - Product display cards
- `CategoryCard.vue` - Category display cards
- `CreditCard.vue` - Payment card display
- `UserAvatar.vue` - User avatar components

#### Navigation Components

- `MainHeader.vue` - Main navigation header
- `Subnav.vue` - Category sub-navigation
- `Breadcrumb.vue` - Breadcrumb navigation
- `Footer.vue` - Footer with important links

## API Integration

### Backend Connection

The application is designed to work with the **E-Commerce Backend API**:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // http://localhost:8080/api
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
})
```

### Main Endpoints

```typescript
// Authentication
POST /api/auth/login
POST /api/auth/register

// Products
GET /api/products
GET /api/products/{id}
GET /api/products/category/{categoryId}

// Shopping Cart
GET /api/cart/{userId}
POST /api/cartItems
PUT /api/cartItems/{id}/quantity

// Orders
GET /api/orders
POST /api/orders
GET /api/orders/{id}
```

## Available Scripts

### Development

```bash
npm run dev              # Development server with hot reload
npm run build            # Production build
npm run preview          # Preview production build
npm run type-check       # TypeScript type checking
```

### Code Quality Commands

```bash
npm run lint             # Run all linters
npm run lint:eslint      # ESLint only
npm run lint:oxlint      # OxLint only
npm run format           # Format code with Prettier
```

### Testing Commands

```bash
npm run install-browsers # Install Playwright browsers
npx playwright test      # Run E2E tests
```

### Automation

```bash
npm run start            # Automation script
npm run migrate-images   # Migrate images to Cloudinary
npm run update-image-paths # Update image paths
```

## Security Features

- **JWT authentication** with refresh token support
- **Route protection** with navigation guards
- **Input sanitization** to prevent XSS attacks
- **HTTPS enforcement** in production environment
- **Client-side rate limiting**

## E-Commerce Specific Features

### Shopping Cart

- Persistence in localStorage and database synchronization
- Automatic synchronization across devices
- Quantity and variant management
- Automatic total and discount calculations

### Wishlist System

- Add/remove favorite products
- Backend synchronization
- Responsive grid display

### Reviews and Ratings

- Star rating system (1-5 stars)
- Text comments
- Purchase verification

### Advanced Search

- Real-time search functionality
- Filters by category, price, and brand
- Automatic suggestions
- Search history

## Performance Optimizations

### Implemented Optimizations

- **Lazy loading** for routes and components
- **Automatic code splitting** by routes
- **Image optimization** with Cloudinary
- **HTTP request caching**
- **CSS and JavaScript minification**

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.0s

## Contributing

### Contribution Process

1. **Fork** the repository
2. **Create branch** for your feature (`git checkout -b feature/amazing-feature`)
3. **Develop** following established conventions
4. **Commit** with descriptive messages (`git commit -m 'feat: add amazing feature'`)
5. **Push** to your fork (`git push origin feature/amazing-feature`)
6. **Open Pull Request** with detailed description

### Commit Conventions

```bash
feat: new feature
fix: bug fix
docs: documentation changes
style: formatting changes (no logic impact)
refactor: code refactoring
test: add or modify tests
chore: maintenance tasks
```

### Pull Request Checklist

- [ ] Code formatted with Prettier
- [ ] Linting passes without errors
- [ ] TypeScript types are correct
- [ ] E2E tests pass
- [ ] Documentation updated
- [ ] Screenshots for UI changes

## Project Status

### Completed Features

- [x] Complete authentication system
- [x] Product catalog with filters
- [x] Functional shopping cart
- [x] Wishlist system
- [x] Checkout process
- [x] Dark/light theme system
- [x] Internationalization (EN/ES)
- [x] Cloudinary integration
- [x] Basic E2E tests

### In Development

- [ ] Push notification system
- [ ] Offline mode with service workers
- [ ] Analytics and metrics
- [ ] Unit tests with Vitest

## Troubleshooting

### Common Issues

**Backend connection error:**

```bash
# Verify backend is running
curl http://localhost:8080/api/products

# Check environment variables
echo $VITE_API_BASE_URL
```

**Dependency errors:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript type errors:**

```bash
# Check types
npm run type-check

# Regenerate declarations
npx vue-tsc --build
```

### Debugging and Logging

```bash
# Enable debug mode (in .env)
VITE_ENABLE_DEBUG=true

# View Vite logs
npm run dev --debug

# View build logs
npm run build --debug
```

## Documentation

### Specific Guides

- [`THEME_INTEGRATION_GUIDE.md`](THEME_INTEGRATION_GUIDE.md) - Complete theme integration guide
- [`SEARCH_IMPLEMENTATION.md`](SEARCH_IMPLEMENTATION.md) - Search system implementation
- [`I18N_README.md`](I18N_README.md) - Internationalization guide
- [`CLOUDINARY_MIGRATION.md`](CLOUDINARY_MIGRATION.md) - Image migration guide
- [`AVATAR_SYSTEM.md`](AVATAR_SYSTEM.md) - Avatar system documentation
- [`TOAST_DOCUMENTATION.md`](TOAST_DOCUMENTATION.md) - Toast notification system
- [`ERROR_HANDLING_DOCUMENTATION.md`](ERROR_HANDLING_DOCUMENTATION.md) - Error handling guide

### Technical References

- [`MIGRATION_COMPLETED.md`](MIGRATION_COMPLETED.md) - Migration history
- [`CLEANUP_GUIDE.md`](CLEANUP_GUIDE.md) - Code cleanup guide
- [`STYLE_OPTIMIZATION_GUIDE.md`](STYLE_OPTIMIZATION_GUIDE.md) - Style optimization
- [`todo.md`](todo.md) - Pending tasks

## Support

For help and support, check the specific documentation files or:

- **Issues**: [Report bugs or request features](../../issues)
- **Discussions**: [Community discussions](../../discussions)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Team

Developed by **Tejon Tech**

---

[Live Demo](https://tab-to-dev.click/tejon-tech/) • [Issues](../../issues) • [Wiki](../../wiki)

### Technologies Used

Built with Vue.js 3 + TypeScript + Tailwind CSS
