#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const MAPPING_FILE = path.join(__dirname, '../cloudinary-mapping.json');
const SRC_DIR = path.join(__dirname, '../src');
const IGNORE_ME_DIR = path.join(__dirname, '../ignore_me');

// Patrones de archivos a procesar
const FILE_PATTERNS = [
  '**/*.vue',
  '**/*.js',
  '**/*.ts',
  '**/*.json'
];

function loadMapping() {
  if (!fs.existsSync(MAPPING_FILE)) {
    console.error(`❌ No se encontró el archivo de mapeo: ${MAPPING_FILE}`);
    console.log('Ejecuta primero: npm run migrate-images');
    process.exit(1);
  }
  
  return JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
}

function updateFileContent(filePath, mapping) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    const changes = [];
    
    // Buscar y reemplazar todas las rutas de imágenes
    for (const [oldPath, newUrl] of Object.entries(mapping)) {
      // Escapar caracteres especiales para regex
      const escapedOldPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Diferentes patrones para capturar las rutas
      const patterns = [
        // Strings simples con comillas
        new RegExp(`['"\`]${escapedOldPath}['"\`]`, 'g'),
        // URLs en CSS/SCSS
        new RegExp(`url\\(['"\`]${escapedOldPath}['"\`]\\)`, 'g'),
        // Background images
        new RegExp(`bg-\\[url\\(['"\`]${escapedOldPath}['"\`]\\)\\]`, 'g'),
        // src attributes
        new RegExp(`src=['"\`]${escapedOldPath}['"\`]`, 'g'),
        // :src attributes
        new RegExp(`:src=['"\`]${escapedOldPath}['"\`]`, 'g')
      ];
      
      patterns.forEach(pattern => {
        if (pattern.test(content)) {
          const oldContent = content;
          content = content.replace(pattern, (match) => {
            return match.replace(oldPath, newUrl);
          });
          
          if (oldContent !== content) {
            hasChanges = true;
            changes.push(`${oldPath} → ${newUrl}`);
          }
        }
      });
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Actualizado: ${path.relative(process.cwd(), filePath)}`);
      changes.forEach(change => console.log(`   ${change}`));
      return changes.length;
    }
    
    return 0;
    
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return 0;
  }
}

async function updateImagePaths() {
  console.log('🔄 Actualizando rutas de imágenes en archivos...\n');
  
  const mapping = loadMapping();
  let totalChanges = 0;
  let filesModified = 0;
  
  // Procesar archivos en src/
  console.log('📁 Procesando archivos en src/...');
  for (const pattern of FILE_PATTERNS) {
    const files = glob.sync(pattern, { 
      cwd: SRC_DIR,
      absolute: true,
      ignore: ['**/node_modules/**']
    });
    
    for (const file of files) {
      const changes = updateFileContent(file, mapping);
      if (changes > 0) {
        filesModified++;
        totalChanges += changes;
      }
    }
  }
  
  // Procesar archivos en ignore_me/ si existe
  if (fs.existsSync(IGNORE_ME_DIR)) {
    console.log('\n📁 Procesando archivos en ignore_me/...');
    for (const pattern of FILE_PATTERNS) {
      const files = glob.sync(pattern, { 
        cwd: IGNORE_ME_DIR,
        absolute: true
      });
      
      for (const file of files) {
        const changes = updateFileContent(file, mapping);
        if (changes > 0) {
          filesModified++;
          totalChanges += changes;
        }
      }
    }
  }
  
  console.log('\n📊 Resumen de actualización:');
  console.log(`📝 Archivos modificados: ${filesModified}`);
  console.log(`🔄 Total de cambios: ${totalChanges}`);
  
  if (totalChanges > 0) {
    console.log('\n🎉 ¡Rutas de imágenes actualizadas exitosamente!');
    console.log('\n💡 Recomendaciones:');
    console.log('1. Revisar los cambios con git diff');
    console.log('2. Probar la aplicación para verificar que las imágenes cargan');
    console.log('3. Considerar eliminar /public/images después de verificar');
  } else {
    console.log('\n ℹ️  No se encontraron rutas para actualizar');
  }
}

// Instalar glob si no está disponible
try {
  require.resolve('glob');
} catch (e) {
  console.log('📦 Instalando dependencia glob...');
  require('child_process').execSync('npm install glob', { stdio: 'inherit' });
  console.log('✅ Dependencia instalada\n');
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  updateImagePaths().catch(error => {
    console.error('💥 Error actualizando rutas:', error);
    process.exit(1);
  });
}

module.exports = { updateImagePaths };
