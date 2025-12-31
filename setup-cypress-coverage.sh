#!/bin/bash

echo "🔧 Configurando Cypress Coverage para React/Next.js..."

# Cambiar al directorio del proyecto
cd "$(dirname "$0")"

# Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# Verificar que las dependencias están instaladas
echo "✅ Verificando instalación..."
if pnpm list @cypress/code-coverage > /dev/null 2>&1; then
    echo "✅ @cypress/code-coverage instalado correctamente"
else
    echo "❌ Error: @cypress/code-coverage no está instalado"
    exit 1
fi

if pnpm list nyc > /dev/null 2>&1; then
    echo "✅ nyc instalado correctamente"
else
    echo "❌ Error: nyc no está instalado"
    exit 1
fi

if pnpm list lcov-result-merger > /dev/null 2>&1; then
    echo "✅ lcov-result-merger instalado correctamente"
else
    echo "❌ Error: lcov-result-merger no está instalado"
    exit 1
fi

# Crear directorios de coverage si no existen
mkdir -p coverage/cypress
mkdir -p coverage/merged

echo "🧪 Ejecutando test de prueba..."
# Ejecutar un test rápido para verificar que funciona
pnpm cypress:component || echo "⚠️  Tests fallaron, pero la configuración está lista"

echo "📊 Generando reporte de cobertura..."
pnpm cypress:component:coverage || echo "⚠️  Coverage falló, pero la configuración está lista"

echo ""
echo "🎉 Configuración completada!"
echo ""
echo "📋 Comandos disponibles:"
echo "  pnpm cypress:component                - Ejecutar tests de componentes"
echo "  pnpm cypress:component:open           - Abrir Cypress en modo componente"
echo "  pnpm cypress:component:coverage       - Ejecutar tests con cobertura"
echo "  pnpm test:all                         - Ejecutar Jest + Cypress"
echo ""
echo "📁 Reportes de cobertura:"
echo "  coverage/                    - Cobertura de Jest"
echo "  coverage/cypress/            - Cobertura de Cypress"
echo "  coverage/merged/             - Cobertura fusionada para SonarQube"
echo ""
echo "🔍 Ver reportes:"
echo "  open coverage/lcov-report/index.html        - Jest coverage"
echo "  open coverage/cypress/lcov-report/index.html - Cypress coverage"
echo ""