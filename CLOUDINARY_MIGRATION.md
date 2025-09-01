# Migración de Imágenes a Cloudinary

Este proyecto incluye scripts automatizados para migrar todas las imágenes estáticas a Cloudinary y actualizar automáticamente las referencias en el código.

## 🚀 Uso Rápido

```bash
# Migración completa (recomendado)
npm run cloudinary-migration
```

## 📋 Scripts Disponibles

### 1. Migración Completa
```bash
npm run cloudinary-migration
```
Ejecuta todo el proceso automáticamente:
- Sube todas las imágenes a Cloudinary
- Actualiza todas las rutas en el código
- Genera mapeo de URLs

### 2. Solo Subir Imágenes
```bash
npm run migrate-images
```
Solo sube las imágenes a Cloudinary y genera el archivo de mapeo.

### 3. Solo Actualizar Rutas
```bash
npm run update-image-paths
```
Solo actualiza las rutas en el código (requiere que se hayan subido las imágenes primero).

## 📁 Archivos Generados

- `cloudinary-mapping.json`: Mapeo de rutas antiguas → URLs de Cloudinary
- `src/composables/useCloudinaryImages.ts`: Helper para futuras imágenes

## 🎯 Lo Que Se Actualiza Automáticamente

El script busca y reemplaza automáticamente:

### Rutas de Imágenes
- `/images/imagen.png` → URL de Cloudinary
- `/public/images/imagen.png` → URL de Cloudinary
- `images/imagen.png` → URL de Cloudinary
- `public/images/imagen.png` → URL de Cloudinary

### Tipos de Referencias
- Atributos `src` y `:src`
- URLs en CSS (`url()`)
- Clases de Tailwind (`bg-[url()]`)
- Strings en JavaScript/TypeScript

### Archivos Procesados
- `src/**/*.vue`
- `src/**/*.js`
- `src/**/*.ts`
- `ignore_me/**/*.vue` (si existe)

## 🔧 Helper para Futuras Imágenes

Usa `src/composables/useCloudinaryImages.ts` para nuevas imágenes:

```typescript
import { 
  getCloudinaryUrl, 
  getProductImage, 
  getCategoryImage,
  getAvatarImage,
  getLogoImage 
} from '@/composables/useCloudinaryImages'

// Imagen optimizada con transformaciones
const imageUrl = getCloudinaryUrl('mi-imagen', {
  width: 300,
  height: 200,
  quality: 'auto',
  format: 'webp'
})

// Imagen de producto con fallback
const productImg = getProductImage('iPhone 14 Pro')

// Logo según tema
const logo = getLogoImage(isDarkMode)
```

## 📊 Funciones del Helper

### `getCloudinaryUrl(imageId, options)`
Genera URL optimizada de Cloudinary con transformaciones.

**Opciones:**
- `width`: Ancho en píxeles
- `height`: Alto en píxeles
- `quality`: Calidad ('auto', número, o string)
- `format`: Formato ('auto', 'webp', 'jpg', etc.)
- `crop`: Tipo de recorte ('fill', 'fit', 'scale', etc.)

### `getProductImage(productName, options)`
Obtiene imagen de producto basada en el nombre, con fallback al logo.

### `getCategoryImage(category, options)`
Obtiene imagen de categoría basada en el nombre.

### `getAvatarImage(avatarUrl, options)`
Maneja avatares de usuario con fallback.

### `getLogoImage(isDark, options)`
Obtiene el logo según el tema (claro/oscuro).

## ⚠️ Verificación Post-Migración

1. **Revisar cambios:**
   ```bash
   git diff
   ```

2. **Probar en desarrollo:**
   ```bash
   npm run dev
   ```

3. **Probar build:**
   ```bash
   npm run build
   ```

4. **Verificar que todas las imágenes cargan correctamente**

## 🗑️ Limpieza (Opcional)

Una vez verificado que todo funciona, puedes eliminar las imágenes locales:

```bash
# ⚠️ Solo después de verificar que todo funciona
rm -rf public/images
```

## 🔐 Variables de Entorno

Las credenciales de Cloudinary se toman del archivo `.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=tejon-tech
VITE_CLOUDINARY_API_KEY=tu_api_key
VITE_CLOUDINARY_API_SECRET=tu_api_secret
```

## 🐛 Solución de Problemas

### Error de credenciales
Verifica que las variables de entorno estén correctas en `.env`.

### Falló subida de algunas imágenes
El script mostrará qué archivos fallaron y por qué. Revisa el log de errores.

### No se encontraron cambios
Verifica que el archivo `cloudinary-mapping.json` se haya generado correctamente.

## 🚀 Ventajas de Cloudinary

- **Optimización automática**: Compresión y formato automático
- **CDN global**: Carga rápida desde cualquier parte del mundo
- **Transformaciones**: Redimensionado dinámico sin generar múltiples archivos
- **Formatos modernos**: Conversión automática a WebP/AVIF
- **Menor tamaño del repositorio**: No más imágenes en git
