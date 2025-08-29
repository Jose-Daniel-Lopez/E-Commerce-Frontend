# Frontend de E-Commerce

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5.13-4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.2.4-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.10-38B2AC)
![Pinia](https://img.shields.io/badge/Pinia-3.0.1-ffd859)

Aplicación web moderna de e-commerce construida con Vue.js 3, TypeScript, Tailwind CSS y arquitectura de componentes reutilizables.

[Demo en Vivo](https://tab-to-dev.click/tejon-tech/) • [Reportar Problemas](../../issues)

</div>

## Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Sistema de Tema](#sistema-de-tema)
- [Internacionalización](#internacionalización)
- [Pruebas](#pruebas)
- [Construir y Desplegar](#construir-y-desplegar)
- [Desarrollo](#desarrollo)
- [Contribuyendo](#contribuyendo)

## Características

### Funcionalidad Core de E-Commerce

- **Catálogo de productos** con capacidades avanzadas de filtrado y búsqueda
- **Carrito de compras** con estado persistente y gestión de cantidades
- **Sistema de lista de deseos** para productos favoritos
- **Proceso completo de checkout** con múltiples métodos de pago
- **Gestión de pedidos** con seguimiento de estado
- **Sistema de reseñas de productos** con calificaciones por estrellas

### Experiencia de Usuario

- **Diseño responsivo** optimizado para enfoque mobile-first
- **Sistema de tema oscuro/claro** con transiciones suaves
- **Internacionalización (i18n)** soportando español e inglés
- **Biblioteca de componentes reutilizables** con diseño consistente
- **Animaciones suaves** e interacciones micro
- **Notificaciones toast** para retroalimentación del usuario

### Características Técnicas

- **Autenticación JWT** con gestión de estado persistente
- **Gestión centralizada de estado** usando Pinia
- **Carga diferida** para rutas y componentes
- **Sistema centralizado de iconos** con oh-vue-icons
- **Integración con Cloudinary** para optimización de imágenes
- **Pruebas automatizadas** con Playwright

## Stack Tecnológico

### Núcleo del Frontend

- **[Vue.js 3.5.13](https://vuejs.org/)** - Framework progresivo con Composition API
- **[TypeScript 5.8.0](https://www.typescriptlang.org/)** - Tipado estático para JavaScript
- **[Vite 6.2.4](https://vitejs.dev/)** - Herramienta de construcción ultra-rápida con HMR
- **[Vue Router 4.5.0](https://router.vuejs.org/)** - Enrutamiento SPA

### Gestión de Estado y Datos

- **[Pinia 3.0.1](https://pinia.vuejs.org/)** - Gestión moderna de estado para Vue
- **[Axios 1.10.0](https://axios-http.com/)** - Cliente HTTP para comunicación API
- **[Vue I18n 9.14.4](https://vue-i18n.intlify.dev/)** - Framework de internacionalización

### UI y Estilos

- **[Tailwind CSS 4.1.10](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Heroicons](https://heroicons.com/)** - Iconos SVG bellamente elaborados a mano
- **[oh-vue-icons](https://oh-vue-icons.js.org/)** - Biblioteca de iconos para Vue
- **[Swiper 11.2.10](https://swiperjs.com/)** - Slider táctil moderno

### Herramientas de Desarrollo

- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Linting y formateo de código
- **[OxLint](https://oxc.rs/docs/guide/usage/linter.html)** - Linter ultra-rápido escrito en Rust
- **[Playwright](https://playwright.dev/)** - Framework de pruebas end-to-end
- **[Vue DevTools](https://devtools.vuejs.org/)** - Herramientas avanzadas de depuración

### Servicios Externos

- **[EmailJS](https://www.emailjs.com/)** - Servicio de envío de emails desde el frontend
- **[Cloudinary](https://cloudinary.com/)** - Gestión y optimización de imágenes

## Arquitectura

### Estructura del Proyecto

```bash
src/
├── assets/              # Recursos estáticos y estilos globales
│   ├── styles/          # Estilos globales y definiciones de tema
│   └── themes.css       # Variables CSS para temas
├── components/          # Componentes Vue reutilizables
│   ├── shared/          # Componentes globales
│   ├── products/        # Componentes relacionados con productos
│   ├── cart/           # Componentes del carrito de compras
│   ├── user/           # Componentes relacionados con usuario
│   └── ...             # Otros módulos específicos
├── views/              # Páginas principales y componentes de ruta
│   ├── home/           # Componentes de la página principal
│   ├── auth/           # Páginas de autenticación
│   ├── catalog/        # Páginas del catálogo de productos
│   ├── checkout/       # Proceso de checkout
│   └── user/           # Páginas de perfil de usuario
├── stores/             # Stores de estado Pinia
├── router/             # Configuración de Vue Router
├── composables/        # Funciones de composición reutilizables
├── types/              # Definiciones de tipos TypeScript
├── locales/            # Archivos de traducciones i18n
├── plugins/            # Configuración de plugins Vue
└── lib/               # Utilidades y funciones auxiliares
```

### Patrones Arquitectónicos

- **Composition API**: Uso exclusivo del Composition API de Vue 3
- **Stores modulares**: Estado dividido por funcionalidad (auth, cart, products, etc.)
- **Componentes atómicos**: Diseño basado en componentes pequeños y reutilizables
- **Carga diferida**: Carga diferida de rutas para optimización de rendimiento

## Instalación

### Prerrequisitos

- Node.js 18+
- npm 8+ o yarn/pnpm
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/Jose-Daniel-Lopez/E-Commerce-Frontend.git
cd E-Commerce-Frontend
```

### 2. Instalar dependencias

```bash
npm install

# O usando yarn
yarn install

# O usando pnpm
pnpm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tu configuración:

```env
# Configuración de API
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000

# Configuración de Aplicación
VITE_APP_NAME=Frontend de E-Commerce
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Flags de Características
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false

# Configuración de UI
VITE_DEFAULT_LANGUAGE=en
VITE_CURRENCY=USD
VITE_ITEMS_PER_PAGE=10

# Configuración de EmailJS (opcional)
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

### 4. Ejecutar servidor de desarrollo

```bash
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

## Configuración

### Variables de Entorno

| Variable | Descripción | Requerida | Ejemplo |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | URL base de la API backend | ✅ | `http://localhost:8080/api` |
| `VITE_API_TIMEOUT` | Tiempo de espera de solicitudes HTTP | ❌ | `10000` |
| `VITE_APP_NAME` | Nombre de la aplicación | ❌ | `Frontend de E-Commerce` |
| `VITE_DEFAULT_LANGUAGE` | Idioma por defecto | ❌ | `en` o `es` |
| `VITE_CURRENCY` | Moneda por defecto | ❌ | `USD` |
| `VITE_EMAILJS_SERVICE_ID` | ID de servicio EmailJS | ❌ | Para formulario de contacto |

### Configuración de Vite

- **URL Base**: `/tejon-tech/` (configurada para despliegue)
- **Alias**: `@` apunta a `src/`
- **Plugins**: Vue, JSX, DevTools, Tailwind CSS

### Configuración de Tailwind

- **Modo oscuro**: Basado en clase CSS (`dark`)
- **Breakpoints personalizados**: `xs: 420px`
- **Variables CSS**: Integración con sistema de temas
- **Fuentes personalizadas**: Figtree, SR Pro Display

## Uso

### Comandos de Desarrollo

```bash
npm run dev              # Servidor de desarrollo con recarga en caliente
npm run build            # Construcción para producción
npm run preview          # Vista previa de construcción de producción
npm run type-check       # Verificación de tipos TypeScript
```

### Calidad de Código

```bash
npm run lint             # Ejecutar todos los linters
npm run lint:eslint      # Solo ESLint
npm run lint:oxlint      # Solo OxLint
npm run format           # Formatear código con Prettier
```

### Comandos de Pruebas

```bash
npm run install-browsers # Instalar navegadores para pruebas
npx playwright test      # Ejecutar pruebas E2E
npx playwright test --ui # Ejecutar pruebas con interfaz visual
```

### Scripts de Migración

```bash
npm run migrate-images     # Migrar imágenes a Cloudinary
npm run update-image-paths # Actualizar rutas de imágenes
npm run cloudinary-migration # Proceso completo de migración
```

## Sistema de Tema

### Características

- Modo oscuro/claro con transiciones suaves
- Variables CSS personalizadas para colores
- Persistencia de tema en localStorage
- Detección automática de tema del sistema
- Composable centralizado `useThemeClasses`

### Ejemplo de Uso

```vue
<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { useThemeClasses } from '@/composables/useThemeClasses'

const themeStore = useThemeStore()
const { cardClasses, buttonClasses } = useThemeClasses()
</script>

<template>
  <button @click="themeStore.toggleTheme()">
    Cambiar Tema
  </button>

  <div :class="cardClasses">
    <button :class="buttonClasses.primary">
      Botón con Tema
    </button>
  </div>
</template>
```

### Archivos del Sistema de Tema

- `src/assets/themes.css` - Variables de color CSS
- `src/stores/theme.ts` - Store de gestión de tema
- `src/composables/useThemeClasses.ts` - Clases CSS reutilizables

## Internacionalización

### Idiomas Soportados

- **Inglés (en)** - Idioma por defecto
- **Español (es)** - Traducciones completas

### Uso de i18n

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

### Estructura de Traducciones

```json
{
  "nav": {
    "home": "Inicio",
    "products": "Productos",
    "cart": "Carrito"
  },
  "products": {
    "title": "Productos",
    "addToCart": "Agregar al Carrito",
    "outOfStock": "Agotado"
  }
}
```

## Pruebas

### Pruebas End-to-End con Playwright

```bash
# Ejecutar todas las pruebas
npx playwright test

# Ejecutar con interfaz visual
npx playwright test --ui

# Ejecutar prueba específica
npx playwright test tests/auth.spec.ts

# Generar reporte HTML
npx playwright show-report
```

### Estructura de Pruebas

```bash
tests/
├── example.spec.ts         # Prueba de ejemplo
└── tests-examples/         # Ejemplos adicionales
```

## Construir y Desplegar

### Construcción para Producción

```bash
npm run build

# Los archivos construidos se generan en dist/
ls dist/
```

### Configuración de Despliegue

- **URL Base**: Configurada para `/tejon-tech/` en producción
- **Optimización de assets**: Optimización automática de imágenes y CSS
- **División de código**: División automática de código para carga eficiente

## Desarrollo

### Estructura de Stores Pinia

```typescript
├── auth.ts              # Autenticación y sesión de usuario
├── userCart.ts          # Gestión del carrito de compras
├── products.ts          # Catálogo de productos
├── categories.ts        # Categorías de productos
├── orders.ts            # Gestión de pedidos
├── wishlist.ts          # Funcionalidad de lista de deseos
├── theme.ts             # Sistema de tema
├── toast.ts             # Notificaciones
└── checkout.ts          # Proceso de pago
```

### Composables Disponibles

```typescript
├── useThemeClasses      # Clases CSS para temas
├── useScrollToTop       # Desplazamiento automático
├── useAuth              # Lógica de autenticación
├── useCart              # Lógica del carrito
└── useProducts          # Lógica de productos
```

### Convenciones de Código

- **Nomenclatura**: PascalCase para componentes, camelCase para variables
- **Composition API**: Uso exclusivo de `<script setup>`
- **TypeScript**: Tipado estricto en todos los archivos
- **CSS**: Enfoque utility-first con Tailwind CSS
- **Commits**: Commits convencionales para changelog automatizado

### Componentes Reutilizables

#### Componentes Base

- `Button.vue` - Botones con variantes y estados
- `FloatingInput.vue` - Campos de entrada con etiquetas flotantes
- `LoadingState.vue` - Estados de carga consistentes
- `ErrorAlert.vue` - Componentes de manejo de errores

#### Componentes de E-Commerce

- `ProductCard.vue` - Tarjetas de visualización de productos
- `CategoryCard.vue` - Tarjetas de visualización de categorías
- `CreditCard.vue` - Visualización de tarjetas de pago
- `UserAvatar.vue` - Componentes de avatar de usuario

#### Componentes de Navegación

- `MainHeader.vue` - Cabecera de navegación principal
- `Subnav.vue` - Sub-navegación de categorías
- `Breadcrumb.vue` - Navegación de migas de pan
- `Footer.vue` - Pie de página con enlaces importantes

## Integración con API

### Conexión con Backend

La aplicación está diseñada para trabajar con la **API de Backend de E-Commerce**:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // http://localhost:8080/api
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
})
```

### Endpoints Principales

```typescript
// Autenticación
POST /api/auth/login
POST /api/auth/register

// Productos
GET /api/products
GET /api/products/{id}
GET /api/products/category/{categoryId}

// Carrito de Compras
GET /api/cart/{userId}
POST /api/cartItems
PUT /api/cartItems/{id}/quantity

// Pedidos
GET /api/orders
POST /api/orders
GET /api/orders/{id}
```

## Scripts Disponibles

### Desarrollo

```bash
npm run dev              # Servidor de desarrollo con recarga en caliente
npm run build            # Construcción para producción
npm run preview          # Vista previa de construcción de producción
npm run type-check       # Verificación de tipos TypeScript
```

### Comandos de Calidad de Código

```bash
npm run lint             # Ejecutar todos los linters
npm run lint:eslint      # Solo ESLint
npm run lint:oxlint      # Solo OxLint
npm run format           # Formatear código con Prettier
```

### Comandos de Testing

```bash
npm run install-browsers # Instalar navegadores para Playwright
npx playwright test      # Ejecutar pruebas E2E
```

### Automatización

```bash
npm run start            # Script de automatización
npm run migrate-images   # Migrar imágenes a Cloudinary
npm run update-image-paths # Actualizar rutas de imágenes
```

## Características de Seguridad

- **Autenticación JWT** con soporte de token de refresco
- **Protección de rutas** con guards de navegación
- **Saneamiento de entradas** para prevenir ataques XSS
- **Aplicación HTTPS** en entorno de producción
- **Limitación de tasa del lado cliente**

## Características Específicas de E-Commerce

### Carrito de Compras

- Persistencia en localStorage y sincronización con base de datos
- Sincronización automática entre dispositivos
- Gestión de cantidades y variantes
- Cálculo automático de totales y descuentos

### Sistema de Lista de Deseos

- Agregar/quitar productos favoritos
- Sincronización con backend
- Visualización en grid responsivo

### Reseñas y Calificaciones

- Sistema de calificación por estrellas (1-5 estrellas)
- Comentarios de texto
- Verificación de compra

### Búsqueda Avanzada

- Funcionalidad de búsqueda en tiempo real
- Filtros por categoría, precio y marca
- Sugerencias automáticas
- Historial de búsqueda

## Optimizaciones de Rendimiento

### Optimizaciones Implementadas

- **Carga diferida** para rutas y componentes
- **División automática de código** por rutas
- **Optimización de imágenes** con Cloudinary
- **Cache de solicitudes HTTP**
- **Minificación de CSS y JavaScript**

### Objetivos de Rendimiento

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.0s

## Contribuyendo

### Proceso de Contribución

1. **Fork** el repositorio
2. **Crear rama** para tu característica (`git checkout -b feature/caracteristica-increible`)
3. **Desarrollar** siguiendo las convenciones establecidas
4. **Commit** con mensajes descriptivos (`git commit -m 'feat: agregar caracteristica increible'`)
5. **Push** a tu fork (`git push origin feature/caracteristica-increible`)
6. **Abrir Pull Request** con descripción detallada

### Convenciones de Commit

```bash
feat: nueva característica
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato (sin impacto en lógica)
refactor: refactorización de código
test: agregar o modificar pruebas
chore: tareas de mantenimiento
```

### Lista de Verificación de Pull Request

- [ ] Código formateado con Prettier
- [ ] Linting pasa sin errores
- [ ] Tipos TypeScript son correctos
- [ ] Pruebas E2E pasan
- [ ] Documentación actualizada
- [ ] Capturas de pantalla para cambios de UI

## Estado del Proyecto

### Características Completadas

- [x] Sistema completo de autenticación
- [x] Catálogo de productos con filtros
- [x] Carrito de compras funcional
- [x] Sistema de lista de deseos
- [x] Proceso de checkout
- [x] Sistema de tema oscuro/claro
- [x] Internacionalización (ES/EN)
- [x] Integración con Cloudinary
- [x] Pruebas E2E básicas

### En Desarrollo

- [ ] Sistema de notificaciones push
- [ ] Modo offline con service workers
- [ ] Analytics y métricas
- [ ] Pruebas unitarias con Vitest

## Solución de Problemas

### Problemas Comunes

**Error de conexión con backend:**

```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:8080/api/products

# Verificar variables de entorno
echo $VITE_API_BASE_URL
```

**Errores de dependencias:**

```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

**Errores de tipos TypeScript:**

```bash
# Verificar tipos
npm run type-check

# Regenerar declaraciones
npx vue-tsc --build
```

### Depuración y Logging

```bash
# Habilitar modo debug (en .env)
VITE_ENABLE_DEBUG=true

# Ver logs de Vite
npm run dev --debug

# Ver logs de construcción
npm run build --debug
```

## Documentación

### Guías Específicas

- [`THEME_INTEGRATION_GUIDE.md`](THEME_INTEGRATION_GUIDE.md) - Guía completa de integración de tema
- [`SEARCH_IMPLEMENTATION.md`](SEARCH_IMPLEMENTATION.md) - Implementación del sistema de búsqueda
- [`I18N_README.md`](I18N_README.md) - Guía de internacionalización
- [`CLOUDINARY_MIGRATION.md`](CLOUDINARY_MIGRATION.md) - Guía de migración de imágenes
- [`AVATAR_SYSTEM.md`](AVATAR_SYSTEM.md) - Documentación del sistema de avatar
- [`TOAST_DOCUMENTATION.md`](TOAST_DOCUMENTATION.md) - Sistema de notificaciones toast
- [`ERROR_HANDLING_DOCUMENTATION.md`](ERROR_HANDLING_DOCUMENTATION.md) - Guía de manejo de errores

### Referencias Técnicas

- [`MIGRATION_COMPLETED.md`](MIGRATION_COMPLETED.md) - Historial de migraciones
- [`CLEANUP_GUIDE.md`](CLEANUP_GUIDE.md) - Guía de limpieza de código
- [`STYLE_OPTIMIZATION_GUIDE.md`](STYLE_OPTIMIZATION_GUIDE.md) - Optimización de estilos
- [`todo.md`](todo.md) - Tareas pendientes

## Soporte

Para ayuda y soporte, consulta los archivos de documentación específicos o:

- **Issues**: [Reportar bugs o solicitar características](../../issues)
- **Discusiones**: [Discusiones de la comunidad](../../discussions)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Equipo

Desarrollado por **Tejon Tech**

---

[Demo en Vivo](https://tab-to-dev.click/tejon-tech/) • [Issues](../../issues) • [Wiki](../../wiki)

### Tecnologías Utilizadas

Construido con Vue.js 3 + TypeScript + Tailwind CSS
