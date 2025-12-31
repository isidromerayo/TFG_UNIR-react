# CI/CD Configuration

Este directorio contiene la configuración de CI/CD para el proyecto TFG_UNIR-react.

## Workflows Disponibles

### 1. CI (node.js.yml)
Workflow principal que se ejecuta en push y PR a main:

- ✅ **Lint**: Verificación de código con ESLint
- ✅ **Build**: Compilación de la aplicación Next.js
- ✅ **Jest Tests**: Tests unitarios con cobertura
- ✅ **Cypress Component**: Tests de componentes
- ✅ **Security Audit**: Auditoría de vulnerabilidades
- ✅ **Coverage Upload**: Subida a Codecov
- ✅ **SonarQube**: Análisis de calidad de código

### 2. Tests (tests.yml)
Workflow especializado en testing con ejecución paralela:

#### Jobs Paralelos:
- **unit-tests**: Jest con cobertura (87 tests)
- **component-tests**: Cypress component testing (13 tests)
- **e2e-tests**: Cypress E2E testing
- **coverage-report**: Comentarios de cobertura en PRs
- **test-summary**: Dashboard de resultados

#### Beneficios:
- ⚡ **Ejecución paralela**: Reduce tiempo total de CI
- 📊 **Cobertura detallada**: Reportes automáticos en PRs
- 🎯 **Feedback rápido**: Resultados específicos por tipo de test
- 📈 **Métricas**: Dashboard con estado de todos los tests

## Configuración de Cobertura

### Umbrales Actuales
```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 45,     // 45.63% actual
    functions: 59,    // 59.37% actual
    lines: 63,        // 63.05% actual
    statements: 63,   // 63.88% actual
  }
}
```

### Reportes Generados
- **LCOV**: Para SonarQube y comentarios en PRs
- **HTML**: Reporte visual local (`coverage/lcov-report/index.html`)
- **JSON**: Para integración con SonarQube
- **Text Summary**: Para logs de CI

### Cobertura Fusionada (Jest + Cypress)
- **Jest**: Tests unitarios (`coverage/lcov.info`)
- **Cypress**: Tests de componentes (`coverage/cypress/lcov.info`)
- **Fusionada**: Reporte combinado (`coverage/merged/lcov.info`)

## Integración con Servicios Externos

### SonarQube
```yaml
- name: SonarQube Scan
  uses: SonarSource/sonarqube-scan-action@v6
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

**SonarQube maneja automáticamente**:
- ✅ **Cobertura de código**: Análisis completo de LCOV
- ✅ **Calidad de código**: Métricas y code smells
- ✅ **Seguridad**: Vulnerabilidades y hotspots
- ✅ **Mantenibilidad**: Deuda técnica y duplicación
- ✅ **Reliability**: Bugs y issues

### Coverage Comments en PRs
```yaml
- name: Comment coverage on PR
  uses: romeovs/lcov-reporter-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    lcov-file: ./coverage/merged/lcov.info
```

**Ahora incluye cobertura fusionada de Jest + Cypress**

## Secrets Requeridos

Para que los workflows funcionen completamente, configurar estos secrets en GitHub:

```bash
# SonarQube (requerido para análisis de calidad)
SONAR_TOKEN=your_sonar_token

# GitHub Token (automático)
GITHUB_TOKEN # Proporcionado automáticamente por GitHub
```

**Nota**: SonarQube maneja automáticamente la cobertura de código, métricas de calidad, seguridad y mantenibilidad. No se requieren servicios adicionales.

## Scripts de Testing

### Locales
```bash
# Tests unitarios con cobertura
pnpm test:coverage

# Tests para CI (formato optimizado)
pnpm test:coverage:ci

# Todos los tests (Jest + Cypress)
pnpm test:all

# Cypress component tests con cobertura
pnpm cypress:component:coverage

# Abrir Cypress en modo interactivo
pnpm cypress:component:open

# Ver reporte de cobertura
pnpm coverage:report
```

### CI/CD
```bash
# Jest con cobertura para CI
pnpm test:coverage:ci

# Cypress component tests (sin cobertura)
pnpm cypress:component

# Cypress component tests con cobertura
pnpm cypress:component:coverage

# Cypress E2E tests
pnpm cypress:e2e
```

## Estructura de Artefactos

Los workflows generan y suben estos artefactos:

```
artifacts/
├── jest-coverage/          # Reportes de cobertura Jest
│   ├── lcov.info
│   ├── coverage-final.json
│   └── lcov-report/
├── cypress-coverage/       # Reportes de cobertura Cypress
│   ├── lcov.info
│   ├── coverage-final.json
│   └── lcov-report/
├── cypress-artifacts/      # Screenshots y videos Cypress
│   ├── screenshots/
│   └── videos/
└── test-results/          # Resultados combinados
    ├── coverage/
    │   └── merged/        # Cobertura fusionada Jest + Cypress
    └── cypress/
```

## Optimizaciones de Performance

### Cache de pnpm
```yaml
- name: Setup pnpm cache
  uses: actions/cache@v4
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
```

### Ejecución Paralela
- **Unit tests**: ~8s
- **Component tests**: ~3s  
- **E2E tests**: ~15s (con build)
- **Total paralelo**: ~15s vs ~26s secuencial

### Cypress Binary Cache
Cypress se instala automáticamente y se cachea entre ejecuciones.

## Monitoreo y Alertas

### Status Checks
Todos los workflows son **required status checks** para merge a main:
- ✅ CI / build
- ✅ Tests / unit-tests
- ✅ Tests / component-tests
- ✅ Tests / e2e-tests

### Notificaciones
- 📧 **Email**: En fallos de CI
- 💬 **PR Comments**: Cobertura automática
- 📊 **Dashboard**: GitHub Actions tab

## Troubleshooting

### Tests Fallan en CI pero Pasan Localmente
```bash
# Verificar con las mismas condiciones de CI
pnpm test:coverage:ci
pnpm cypress:component

# Verificar dependencias
pnpm install --frozen-lockfile
```

### Problemas de Cobertura
```bash
# Ver cobertura detallada
pnpm test:coverage

# Abrir reporte HTML
pnpm coverage:report

# Verificar umbrales
# Editar jest.config.js si es necesario
```

### Cypress Issues
```bash
# Reinstalar Cypress
pnpm cypress install

# Verificar configuración
pnpm cypress verify

# Debug mode
DEBUG=cypress:* pnpm cypress:component
```

## Métricas Actuales

### Cobertura de Código
- **Statements**: 73.01% (322/441)
- **Branches**: 52.55% (72/137)  
- **Functions**: 72.91% (70/96)
- **Lines**: 72.66% (295/406)

### Tests
- **Jest Unit Tests**: 87 tests ✅
- **Cypress Component**: 13 tests ✅
- **Cypress E2E**: 1 test ✅
- **Total**: 101 tests

### Performance
- **Build Time**: ~30s
- **Test Time**: ~15s (paralelo)
- **Total CI Time**: ~2-3 minutos

## Roadmap

### Próximas Mejoras
- [ ] **Visual Regression Testing** con Percy/Chromatic
- [ ] **Performance Testing** con Lighthouse CI
- [ ] **Security Scanning** con CodeQL avanzado
- [ ] **Dependency Scanning** con Snyk
- [ ] **Bundle Analysis** automático

### Optimizaciones Futuras
- [ ] **Matrix Testing** (múltiples versiones Node.js)
- [ ] **Conditional Workflows** (solo cambios relevantes)
- [ ] **Incremental Testing** (solo archivos modificados)
- [ ] **Parallel E2E** con múltiples browsers