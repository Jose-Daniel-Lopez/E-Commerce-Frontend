# 🗑️ Archivos para Eliminar Post-Migración

## ✅ Ya Eliminados
- ~~`scripts/cloudinary-migration.js`~~ ✅
- ~~`scripts/migrate-images-to-cloudinary.js`~~ ✅ 
- ~~`scripts/update-image-paths.js`~~ ✅

## 📂 Archivos que Pueden Eliminarse (Opcionales)

### 📷 Imágenes Locales
```bash
# ⚠️ SOLO después de verificar que todo funciona correctamente
rm -rf public/images/
```

**Archivos a eliminar:**
- `public/images/` - **2.5MB aprox.** (64 archivos)
  - Todas las imágenes PNG/WebP ya están en Cloudinary
  - Ya no se usan en el código
  - Se pueden eliminar después de verificar funcionamiento

### 📄 Archivo de Mapeo (Opcional)
```bash
# Opcional: eliminar después de verificar que no hay problemas
rm cloudinary-mapping.json
```

**Consideraciones:**
- ✅ **Mantener** si quieres tener referencia de URLs
- ✅ **Eliminar** si ya no necesitas el mapeo

## 📋 Verificaciones Antes de Eliminar

### 1. Probar Desarrollo
```bash
npm run dev
```
- ✅ Verificar que todas las imágenes cargan
- ✅ Comprobar CatalogView (categorías)
- ✅ Revisar CartItem (productos)
- ✅ Validar Footer/Header (logos)

### 2. Probar Build
```bash
npm run build
```
- ✅ Build exitoso (ya verificado)
- ✅ Sin errores de TypeScript

### 3. Probar Producción
```bash
npm run preview
```
- ✅ Verificar que funciona en modo producción

## 🎯 Beneficios de Eliminar `public/images/`

### Rendimiento Git
- **Repositorio más ligero**: -2.5MB
- **Clones más rápidos**: Menos archivos que descargar
- **Pushes más rápidos**: Menos datos que subir

### CI/CD
- **Builds más rápidos**: Menos archivos que procesar
- **Deploy más eficiente**: Menos archivos que transferir

### Desarrollo
- **Workspace más limpio**: Solo archivos de código
- **Foco en CDN**: Todas las imágenes centralizadas

## ⚠️ Recomendación

**Orden sugerido:**
1. ✅ Hacer commit de los cambios actuales
2. ✅ Probar en desarrollo (`npm run dev`)
3. ✅ Probar en producción (`npm run preview`)
4. ✅ Si todo funciona bien → eliminar `public/images/`
5. ✅ Hacer commit final de limpieza

## 📝 Comando Final de Limpieza

```bash
# Una vez verificado que todo funciona
git add .
git commit -m "feat: migrate all images to Cloudinary CDN

- Upload 64 images to Cloudinary with optimization
- Update all image references to use CDN URLs
- Add useCloudinaryImages helper for future images
- Remove legacy image handling code
- Improve performance with auto-optimization and global CDN"

# Limpieza opcional
rm -rf public/images/
rm cloudinary-mapping.json

git add .
git commit -m "chore: remove local images after Cloudinary migration"
```

## 📊 Resumen

| Archivo/Carpeta | Tamaño | Estado | Acción |
|---|---|---|---|
| `scripts/*.js` | ~15KB | ✅ Eliminado | Ya limpio |
| `public/images/` | ~2.5MB | ⏳ Pendiente | Eliminar después de verificar |
| `cloudinary-mapping.json` | ~5KB | ⏳ Opcional | Mantener como referencia o eliminar |

**Total a liberar**: ~2.5MB de archivos innecesarios
