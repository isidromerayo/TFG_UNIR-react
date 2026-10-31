# Configuración de Cypress Coverage + SonarQube

## 📋 Resumen

Se ha configurado Cypress para generar reportes de cobertura de código e integrarlos con SonarQube junto con los reportes existentes de Jest en el proyecto React/Next.js.

## 🔧 Configuración Implementada

### Dependencias Añadidas
```json
{
  "@cypress/code-coverage": "^3.13.4",
  "@istanbuljs/nyc-config-typescript": "^1.0.2", 
  "istanbul-lib-coverage": "^3.2.2",
  "lcov-result-merger": "^5.0.1",
  "nyc": "^17.1.0"
}
```

### Archivos Modificados

#### 1. `cypress.config.ts`
- Añadido `setupNodeEvents` con `@cypress/code-coverage/task` para E2E y component testing
- Configuración para instrumentación automática en ambos modos

#### 2. `cypress/support/component.ts`
- Importado `@cypress/code-coverage/support`
- Habilitado tracking automático de cobertura para tests de componentes

#### 3. `.nycrc.json` (nuevo)
- Configuración de NYC para TypeScript/JavaScript
- Inclusiones específicas para Next.js (components, pages, app, services, store, utils)
- Exclusiones apropiadas (tests, archivos de configuración, .next, cypress)
- Múltiples formatos de reporte (lcov, cobertura, json, text-summary)

#### 4. `package.json`
- Nuevo script `cypress:component:coverage` para tests con cobertura
- Nuevo script `cypress:component:open` para modo interactivo
- Dependencias de cobertura añadidas

#### 5. `sonar-project.properties`
- Actualizado para reconocer múltiples fuentes de cobertura
- Paths para reportes fusionados, Jest y Cypress individuales
- Exclusiones de archivos de test de Cypress (*.cy.*)

#### 6. `.github/workflows/node.js.yml`
- Paso para ejecutar Cypress con cobertura
- Fusión automática de reportes de Jest y Cypress
- Uso del reporte fusionado para comentarios en PRs

#### 7. `.github/workflows/tests.yml`
- Job de component-tests actualizado para generar cobertura
- Nuevo artefacto para cobertura de Cypress
- Job de coverage-report mejorado para fusionar ambas coberturas

## 🚀 Comandos Disponibles

```bash
# Tests de componentes Cypress (sin cobertura)
pnpm cypress:component

# Tests de componentes con cobertura
pnpm cypress:component:coverage

# Abrir Cypress en modo componente
pnpm cypress:component:open

# Todos los tests (Jest + Cypress)
pnpm test:all

# Setup inicial (instalar deps y verificar)
./setup-cypress-coverage.sh
```

## 📊 Reportes de Cobertura

### Ubicaciones
- `coverage/` - Cobertura de Jest (principal)
- `coverage/cypress/` - Cobertura de Cypress
- `coverage/merged/` - Cobertura fusionada para SonarQube

### Formatos Generados
- **LCOV**: Para SonarQube y herramientas de CI/CD
- **HTML**: Para visualización local
- **Cobertura**: Para Jenkins y otras herramientas
- **JSON**: Para procesamiento programático
- **Text Summary**: Para logs de CI

## 🔄 Flujo en CI/CD

### Workflow Principal (node.js.yml)
1. **Jest Tests**: Genera `coverage/lcov.info`
2. **Cypress Tests**: Genera `coverage/cypress/lcov.info`
3. **Merge**: Fusiona ambos en `coverage/merged/lcov.info`
4. **PR Comments**: Usa el reporte fusionado
5. **SonarQube**: Lee el reporte fusionado + individuales como fallback

### Workflow de Tests (tests.yml)
1. **Parallel Jobs**: Jest y Cypress ejecutan en paralelo
2. **Artifacts**: Cada job sube su cobertura como artefacto
3. **Coverage Job**: Descarga ambos artefactos y los fusiona
4. **PR Comments**: Comenta con cobertura fusionada

## 📈 Integración SonarQube

SonarQube está configurado para leer cobertura de múltiples fuentes:
```properties
sonar.typescript.lcov.reportPaths=coverage/merged/lcov.info,coverage/lcov.info,coverage/cypress/lcov.info
```

Esto asegura que:
- **Prioridad 1**: Reporte fusionado (Jest + Cypress)
- **Prioridad 2**: Reporte de Jest solo
- **Prioridad 3**: Reporte de Cypress solo
- **Máxima compatibilidad** y robustez

## 🧪 Tests Existentes

El proyecto ya tiene **13 tests de componentes Cypress** que ahora generarán cobertura:
- HeaderComponent tests
- Otros componentes según `README.md`

## ⚡ Configuración Específica para Next.js

### Inclusiones en `.nycrc.json`
```json
{
  "include": [
    "components/**/*.{js,jsx,ts,tsx}",
    "pages/**/*.{js,jsx,ts,tsx}",
    "app/**/*.{js,jsx,ts,tsx}",
    "services/**/*.{js,jsx,ts,tsx}",
    "store/**/*.{js,jsx,ts,tsx}",
    "utils/**/*.{js,jsx,ts,tsx}"
  ]
}
```

### Exclusiones Inteligentes
- Tests: `**/*.test.*`, `**/*.spec.*`, `**/*.cy.*`
- Next.js: `**/.next/**`, `next.config.js`
- Configuración: `*.config.js`, `*.config.ts`
- Cypress: `**/cypress/**`

## 🚀 Para Usar

### 1. Instalación y Setup
```bash
# Instalar dependencias y verificar
./setup-cypress-coverage.sh
```

### 2. Ejecutar Tests con Cobertura
```bash
# Solo Cypress con cobertura
pnpm cypress:component:coverage

# Jest + Cypress (sin fusión local)
pnpm test:all
```

### 3. Ver Reportes
```bash
# Jest coverage
open coverage/lcov-report/index.html

# Cypress coverage (después de ejecutar con cobertura)
open coverage/cypress/lcov-report/index.html
```

## 🔍 Verificación

### Comprobar que Funciona
```bash
# 1. Instalar dependencias
pnpm install

# 2. Ejecutar tests con cobertura
pnpm cypress:component:coverage

# 3. Verificar que se generaron los archivos
ls -la coverage/cypress/
ls -la coverage/cypress/lcov.info

# 4. Ver reporte
open coverage/cypress/lcov-report/index.html
```

### Troubleshooting

#### Error: "Cannot find module @cypress/code-coverage"
```bash
pnpm install
```

#### Coverage no se genera
- Verificar que los tests ejecuten código real (no solo mocks)
- Comprobar que los archivos están en las rutas incluidas en `.nycrc.json`
- Revisar que no están excluidos

#### SonarQube no detecta cobertura
- Verificar paths en `sonar-project.properties`
- Comprobar que los archivos `.lcov` existen
- Revisar logs de SonarQube para errores de parsing

## 📊 Beneficios de la Configuración

### Cobertura Completa
- **Jest**: Tests unitarios rápidos
- **Cypress**: Tests de componentes e integración
- **Fusionada**: Vista completa para SonarQube

### CI/CD Optimizado
- **Ejecución paralela**: Jest y Cypress en paralelo
- **Artefactos separados**: Fácil debugging
- **Fusión automática**: Sin intervención manual
- **Comentarios en PRs**: Feedback inmediato

### Robustez
- **Múltiples fallbacks**: Si falla la fusión, usa reportes individuales
- **Compatibilidad**: Funciona con herramientas existentes
- **Escalabilidad**: Fácil añadir más tipos de tests

## 🎯 Próximos Pasos

1. **Ejecutar setup**: `./setup-cypress-coverage.sh`
2. **Verificar tests**: `pnpm cypress:component:coverage`
3. **Revisar reportes**: Abrir archivos HTML de cobertura
4. **Commit cambios**: Los workflows de CI/CD ya están configurados
5. **Monitorear SonarQube**: Verificar que recibe la cobertura fusionada

La configuración está completa y lista para usar. Los workflows de CI/CD integrarán automáticamente la cobertura de Cypress con Jest para proporcionar métricas completas a SonarQube.