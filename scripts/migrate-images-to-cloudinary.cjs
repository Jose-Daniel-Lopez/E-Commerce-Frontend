#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME || 'tejon-tech',
  api_key: process.env.VITE_CLOUDINARY_API_KEY || '632519766196147',
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET || '17MjDsrxyor0AjCXYuE4PXLWQxU'
});

const IMAGES_DIR = path.join(__dirname, '../public/images');
const MAPPING_FILE = path.join(__dirname, '../cloudinary-mapping.json');

// Función para subir una imagen a Cloudinary
async function uploadImage(filePath, publicId) {
  try {
    console.log(`Subiendo ${filePath}...`);
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder: 'e-commerce',
      resource_type: 'auto',
      overwrite: true
    });
    
    console.log(`✅ Subido: ${publicId} -> ${result.secure_url}`);
    return {
      originalPath: filePath,
      publicId: publicId,
      cloudinaryUrl: result.secure_url,
      success: true
    };
  } catch (error) {
    console.error(`❌ Error subiendo ${filePath}:`, error.message);
    return {
      originalPath: filePath,
      publicId: publicId,
      error: error.message,
      success: false
    };
  }
}

// Función principal
async function migrateImages() {
  try {
    console.log('🚀 Iniciando migración de imágenes a Cloudinary...\n');
    
    // Leer archivos de imágenes
    const files = fs.readdirSync(IMAGES_DIR);
    const imageFiles = files.filter(file => 
      /\.(png|jpe?g|gif|svg|webp)$/i.test(file)
    );
    
    console.log(`📁 Encontrados ${imageFiles.length} archivos de imagen\n`);
    
    const results = [];
    const urlMapping = {};
    
    // Subir cada imagen
    for (const file of imageFiles) {
      const filePath = path.join(IMAGES_DIR, file);
      const publicId = file.replace(/\.[^/.]+$/, ''); // Remove extension
      
      const result = await uploadImage(filePath, publicId);
      results.push(result);
      
      if (result.success) {
        // Crear mapeo de rutas
        const oldPaths = [
          `/images/${file}`,
          `/public/images/${file}`,
          `images/${file}`,
          `public/images/${file}`
        ];
        
        oldPaths.forEach(oldPath => {
          urlMapping[oldPath] = result.cloudinaryUrl;
        });
      }
      
      // Pequeña pausa para no saturar la API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Guardar mapeo en archivo JSON
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(urlMapping, null, 2));
    
    // Mostrar resumen
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log('\n📊 Resumen de migración:');
    console.log(`✅ Exitosas: ${successful}`);
    console.log(`❌ Fallidas: ${failed}`);
    console.log(`📄 Mapeo guardado en: ${MAPPING_FILE}`);
    
    if (failed > 0) {
      console.log('\n❌ Archivos que fallaron:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.originalPath}: ${r.error}`);
      });
    }
    
    return urlMapping;
    
  } catch (error) {
    console.error('💥 Error en la migración:', error);
    process.exit(1);
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  migrateImages().then((mapping) => {
    console.log('\n🎉 ¡Migración completada!');
    console.log('\nPróximo paso: Ejecutar el script de actualización de archivos');
    console.log('npm run update-image-paths');
  });
}

module.exports = { migrateImages };
