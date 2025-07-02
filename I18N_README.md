# Internacionalización (i18n) - Documentación

## Resumen

Se ha implementado un sistema completo de internacionalización utilizando Vue I18n 9, que permite a la aplicación soportar múltiples idiomas de manera dinámica.

## Configuración

### Archivos principales:

1. **Plugin i18n**: `src/plugins/i18n.ts`
   - Configuración principal de Vue I18n
   - Detección automática del idioma del navegador
   - Persistencia en localStorage
   - Funciones para cambiar idioma

2. **Traducciones**: `src/locales/`
   - `es.json` - Traducciones en español
   - `en.json` - Traducciones en inglés
   - `index.ts` - Exporta configuración y mensajes

3. **Composable**: `src/composables/useLanguage.ts`
   - Hook reutilizable para manejo de idiomas
   - Funciones para cambiar idioma y obtener estado actual

4. **Componente selector**: `src/components/shared/LanguageSelector.vue`
   - Dropdown para cambiar idioma
   - Se puede usar en cualquier parte de la aplicación

## Uso

### En templates:
```vue
<template>
  <h1>{{ $t('about.title') }}</h1>
  <p>{{ $t('about.description') }}</p>
</template>
```

### En componentes con script setup:
```typescript
import { useLanguage } from '@/composables/useLanguage'

const { t, changeLanguage, currentLocale } = useLanguage()

// Usar en código
console.log(t('about.title'))

// Cambiar idioma
changeLanguage('en')
```

### Para breadcrumbs:
```typescript
// El BreadcrumbNav detecta automáticamente claves de traducción
const breadcrumbs = [
  { label: 'about.title' } // Se traducirá automáticamente
]
```

## Idiomas soportados

- **Español (es)**: Idioma por defecto
- **Inglés (en)**: Idioma alternativo

## Características

1. **Detección automática**: Detecta el idioma del navegador al cargar
2. **Persistencia**: Guarda la preferencia en localStorage
3. **Fallback**: Si falta una traducción, usa el idioma por defecto
4. **Componentes actualizados**: Header, AboutView y BreadcrumbNav ya usan traducciones
5. **Selector visual**: Dropdown en el header para cambiar idioma

## Agregar nuevas traducciones

1. Agregar la clave en `src/locales/es.json`:
```json
{
  "newSection": {
    "title": "Nuevo Título",
    "description": "Nueva descripción"
  }
}
```

2. Agregar la misma clave en `src/locales/en.json`:
```json
{
  "newSection": {
    "title": "New Title",
    "description": "New description"
  }
}
```

3. Usar en componentes:
```vue
<h2>{{ $t('newSection.title') }}</h2>
<p>{{ $t('newSection.description') }}</p>
```

## Agregar nuevos idiomas

1. Crear archivo de traducción: `src/locales/fr.json` (por ejemplo)
2. Agregar al `src/locales/index.ts`:
```typescript
import fr from './fr.json'

export const messages = {
  es,
  en,
  fr
}

export const availableLocales = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' }
]
```

## Estructura de traducciones actuales

```
nav: {
  home, categories, products, about, contact, cart, orders, profile
}
about: {
  title, description,
  values: { quality, innovation, support },
  featuredProducts: { iphone, macbook, airpods },
  cta: { title, description, shopNow, contact }
}
common: {
  loading, error, success, cancel, confirm, save, edit, delete,
  search, filter, sort, price, category, brand, stock,
  addToCart, buyNow
}
```
