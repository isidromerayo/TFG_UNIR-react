# SonarQube Configuration for React/Next.js Project

Este documento explica la configuración de SonarQube para el proyecto React/Next.js frontend.

## Archivos de Configuración

### `sonar-project.properties`
Configuración principal de SonarQube con:
- **Proyecto**: `isidromerayo_TFG_UNIR-react`
- **Organización**: `isidromerayo` (⚠️ **CRÍTICO**: Esta propiedad es obligatoria para SonarQube Cloud)
- Exclusión de regla S2068 (hard-coded passwords) para archivos de test
- Configuración de rutas LCOV para cobertura de código
- Exclusiones de cobertura para archivos de test, API routes y configuración

**Configuración actual**:
```properties
sonar.projectKey=isidromerayo_TFG_UNIR-react
sonar.organization=isidromerayo
sonar.projectName=TFG UNIR React Frontend
sonar.projectVersion=1.0

# Source and test directories (Next.js structure)
sonar.sources=pages,components,services,store,utils
sonar.tests=__tests__
```

### `jest.config.js`
Configuración actualizada de Jest con:
- Reporter LCOV habilitado para SonarQube
- Directorio de cobertura: `coverage/`
- Múltiples formatos: text, LCOV, HTML, JSON
- Umbrales de cobertura configurados según métricas actuales
- Exclusiones apropiadas para Next.js

### `.sonarignore`
Patrones de archivos a ignorar completamente por SonarQube.

## Comandos Útiles

### Ejecutar Tests con Cobertura
```bash
# Generar reporte de cobertura completo
pnpm run test-headless-cc
```

### Verificar Archivos de Cobertura
```bash
# Ver archivo LCOV generado
cat coverage/lcov.info

# Abrir reporte HTML
open coverage/index.html
```

## Integración con SonarQube Cloud

### Configuración en CI/CD
Para que SonarQube Cloud reciba la cobertura correctamente:

1. **Ejecutar tests con cobertura** antes del análisis de SonarQube
2. **Verificar que existe** `coverage/lcov.info`
3. **Configurar las variables** de entorno necesarias

### Variables de Entorno Requeridas
```bash
SONAR_TOKEN=your_sonar_token
SONAR_HOST_URL=https://sonarcloud.io
```

### Configuración Actual de GitHub Actions
El proyecto tiene configurado un workflow en `.github/workflows/node.js.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0  # ⚠️ Requerido por SonarQube
    
    - name: Setup Node.js & pnpm
      # ... configuración completa de entorno con caché
    
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: Lint
      run: pnpm lint
    
    - name: Build
      run: pnpm build
    
    - name: Run tests with coverage
      run: pnpm run test-headless-cc
    
    - name: Audit vulnerabilities
      run: pnpm audit || true
    
    - name: SonarQube Scan
      uses: SonarSource/sonarqube-scan-action@v6
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Enlaces Importantes
- **SonarQube Cloud**: https://sonarcloud.io/project/overview?id=isidromerayo_TFG_UNIR-react
- **GitHub Actions**: Ver pestaña "Actions" del repositorio
- **Project Key**: `isidromerayo_TFG_UNIR-react`
- **Organization**: `isidromerayo`

## Métricas de Cobertura Actuales

- **Cobertura de Statements**: 19.55%
- **Cobertura de Branches**: 4.61%
- **Cobertura de Functions**: 23.88%
- **Cobertura de Lines**: 18.39%
- **Tests**: 25 tests pasando

### Estado de Tests por Archivo
**Componentes con tests completos**:
- ✅ FooterComponent.tsx (100% cobertura)
- ✅ SliderComponent.tsx (100% statements, 50% branches)

**Páginas con tests**:
- ✅ acceso.tsx (95.83% statements)
- ✅ carrito.tsx (75.67% statements)

**Servicios con tests**:
- ✅ session service
- ✅ useCartStore (Zustand store)

### Archivos sin Cobertura (0%)
**Componentes**:
- HeaderComponent.tsx
- HomeComponent.tsx
- LayoutComponent.tsx
- MenuCategoriaComponent.tsx

**Páginas**:
- 404.tsx
- categorias.tsx
- index.tsx (home)
- mis-cursos.tsx
- mis-datos.tsx
- registro.tsx
- busqueda/[query].tsx
- categoria/[id].tsx
- curso/[id].tsx
- valoracion/[id].tsx

## Resolución de Problemas

<<<<<<< HEAD
### Error: "The folder 'src' does not exist" en SonarQube Scan
**Causa**: Configuración incorrecta de directorios en `sonar-project.properties` para proyecto Next.js

**Solución**:
```properties
# Configuración correcta para Next.js (no usar 'src' si no existe)
sonar.sources=pages,components,services,store,utils
sonar.tests=__tests__
```

### Error: "Organization not found" en GitHub Actions
**Causa**: Falta la propiedad `sonar.organization` en `sonar-project.properties`

**Solución**:
```properties
# Añadir esta línea obligatoria para SonarQube Cloud
sonar.organization=isidromerayo
```

### Cobertura No Aparece en SonarQube
1. Verificar que `coverage/lcov.info` existe
2. Comprobar rutas en `sonar-project.properties`
3. Asegurar que el análisis se ejecuta después de los tests
4. **Verificar que `sonar.organization` está configurado**
5. Verificar que la ruta LCOV coincide con la estructura de directorios

### Reglas de Seguridad en Tests
- Los archivos de test están excluidos de la regla S2068
- Usar comentarios `// NOSONAR` para casos específicos
- Mantener constantes de test claramente marcadas

### Problemas con Jest
```bash
# Si los tests fallan, limpiar y reinstalar
rm -rf node_modules coverage .next
pnpm install
pnpm run test-headless-cc
```

### Warning de Next.js sobre Lockfiles
El warning sobre múltiples lockfiles es normal en un monorepo. Para silenciarlo:

```javascript
// next.config.js
module.exports = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  // ... resto de configuración
}
```

## Comandos de Verificación

```bash
# Verificar configuración de SonarQube
cat sonar-project.properties

# Verificar que LCOV se genera
pnpm run test-headless-cc && ls -la coverage/lcov.info

# Ver estadísticas de cobertura
pnpm run test-headless-cc | grep "% Stmts"

# Verificar estructura de archivos de cobertura
ls -la coverage/
```

## Mejoras Recomendadas

### Aumentar Cobertura de Tests
1. **Agregar tests para componentes principales**:
   - HeaderComponent.tsx (navegación y autenticación)
   - HomeComponent.tsx (página principal)
   - LayoutComponent.tsx (layout base)

2. **Agregar tests para páginas críticas**:
   - index.tsx (home page)
   - registro.tsx (registro de usuarios)
   - mis-datos.tsx (perfil de usuario)

3. **Tests de integración**:
   - Flujos completos de usuario
   - Navegación entre páginas
   - Estados de Zustand

### Objetivos de Cobertura
- **Statements**: Objetivo 60% (actual 19.55%)
- **Branches**: Objetivo 40% (actual 4.61%)
- **Functions**: Objetivo 50% (actual 23.88%)
- **Lines**: Objetivo 60% (actual 18.39%)

## Integración con Flujo de Desarrollo

### Workflow Recomendado
Según `AGENTS.md`, el flujo obligatorio es:

```bash
# 1. Ejecutar linter
pnpm lint

# 2. Ejecutar tests
pnpm test-headless

# 3. Verificar build
pnpm build

# 4. Solo entonces hacer commit
git add .
git commit -m "descripción"
```

### Para Cobertura en CI/CD
```bash
# Comando completo con cobertura
pnpm lint && pnpm run test-headless-cc && pnpm build
```

## Archivos Importantes

- `jest.config.js` - Configuración de testing y cobertura
- `sonar-project.properties` - Configuración de SonarQube
- `.sonarignore` - Exclusiones de SonarQube
- `coverage/lcov.info` - Archivo de cobertura para SonarQube
- `coverage/index.html` - Reporte HTML de cobertura
- `__tests__/` - Directorio de tests

## Tecnologías y Configuración

### Stack Tecnológico
- **Framework**: Next.js 15.5.7
- **React**: 19.1.8
- **Testing**: Jest + React Testing Library
- **Estado**: Zustand
- **Formularios**: React Hook Form
- **Package Manager**: pnpm

### Configuración Específica de Next.js
- Exclusión de `pages/api/**` (API routes)
- Exclusión de `pages/_app.tsx` y `pages/_document.tsx`
- Configuración de `next/jest` para compatibilidad
- Soporte para JSX/TSX en tests