#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando archivos de cobertura...\n');

const coverageDir = path.join(__dirname, '..', 'coverage');
const expectedFiles = [
  'lcov.info',           // Jest coverage
  'cypress/lcov.info',   // Cypress coverage
  'merged/lcov.info'     // Merged coverage
];

let allFilesExist = true;

expectedFiles.forEach(file => {
  const filePath = path.join(coverageDir, file);
  const exists = fs.existsSync(filePath);
  
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    console.log(`   📊 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    
    // Verificar que el archivo no esté vacío
    if (stats.size === 0) {
      console.log(`   ⚠️  Archivo vacío`);
      allFilesExist = false;
    }
  } else {
    allFilesExist = false;
  }
  console.log('');
});

// Verificar contenido de archivos LCOV
console.log('📋 Verificando contenido de archivos LCOV...\n');

expectedFiles.forEach(file => {
  const filePath = path.join(coverageDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    const sfLines = lines.filter(line => line.startsWith('SF:'));
    
    console.log(`📄 ${file}:`);
    console.log(`   📝 Líneas totales: ${lines.length}`);
    console.log(`   📁 Archivos cubiertos: ${sfLines.length}`);
    
    if (sfLines.length > 0) {
      console.log(`   📂 Primer archivo: ${sfLines[0].replace('SF:', '')}`);
    }
    console.log('');
  }
});

// Verificar instrumentación en desarrollo
console.log('🔧 Verificando instrumentación...\n');

const babelrcPath = path.join(__dirname, '..', '.babelrc');
if (fs.existsSync(babelrcPath)) {
  console.log('✅ .babelrc existe');
  const babelConfig = JSON.parse(fs.readFileSync(babelrcPath, 'utf8'));
  const hasIstanbul = babelConfig.env?.development?.plugins?.some(plugin => 
    Array.isArray(plugin) && plugin[0] === 'istanbul'
  );
  console.log(`${hasIstanbul ? '✅' : '❌'} Plugin Istanbul configurado`);
} else {
  console.log('❌ .babelrc no encontrado');
  allFilesExist = false;
}

console.log('\n' + '='.repeat(50));
console.log(`🎯 Estado general: ${allFilesExist ? '✅ CORRECTO' : '❌ PROBLEMAS DETECTADOS'}`);

if (!allFilesExist) {
  console.log('\n💡 Sugerencias:');
  console.log('   1. Ejecutar: pnpm test-headless-cc');
  console.log('   2. Ejecutar: pnpm cypress:component:coverage');
  console.log('   3. Ejecutar: pnpm coverage:merge');
}

process.exit(allFilesExist ? 0 : 1);