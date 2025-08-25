#!/usr/bin/env node

const { migrateImages } = require('./migrate-images-to-cloudinary.cjs');
const { updateImagePaths } = require('./update-image-paths.cjs');

async function fullMigration() {
  console.log('🚀 Iniciando migración completa a Cloudinary...\n');
  
  try {
    // Paso 1: Subir imágenes a Cloudinary
    console.log('📤 Paso 1: Subiendo imágenes a Cloudinary...');
    const mapping = await migrateImages();
    
    if (Object.keys(mapping).length === 0) {
      console.log('❌ No se pudo crear el mapeo de imágenes. Abortando...');
      return;
    }
    
    console.log('\n⏳ Esperando 2 segundos antes del siguiente paso...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Paso 2: Actualizar rutas en archivos
    console.log('\n🔄 Paso 2: Actualizando rutas en archivos...');
    await updateImagePaths();
    
    console.log('\n🎉 ¡Migración completa exitosa!');
    console.log('\n📋 Próximos pasos recomendados:');
    console.log('1. git add . && git commit -m "Migrate images to Cloudinary"');
    console.log('2. npm run dev (verificar que las imágenes cargan)');
    console.log('3. npm run build (verificar que el build funciona)');
    console.log('4. Considerar eliminar /public/images una vez confirmado');
    
    console.log('\n💡 Helper creado en src/composables/useCloudinaryImages.ts');
    console.log('   Úsalo para futuras imágenes con optimizaciones automáticas');
    
  } catch (error) {
    console.error('💥 Error en la migración completa:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  fullMigration();
}

module.exports = { fullMigration };
