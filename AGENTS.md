# AGENTS.md - Contexto del Proyecto Frontend React

## 📋 Información General del Proyecto

### Descripción
Aplicación web frontend desarrollada en React con Next.js para un sistema de gestión de cursos online. Permite a los usuarios navegar, buscar, comprar y gestionar cursos educativos.

### Tecnologías Principales
- **Framework**: Next.js 15.3.4
- **Librería**: React 19.1.0
- **Lenguaje**: TypeScript 5.8.3
- **Package Manager**: pnpm (migrado desde npm)
- **Testing**: Jest + Testing Library, Cypress
- **State Management**: Zustand 5.0.5
- **Forms**: React Hook Form 7.58.1 + Yup 1.6.1
- **HTTP Client**: Axios 1.10.0
- **UI/Alerts**: SweetAlert2 11.4.8

### Versión
- **Versión actual**: 0.1.0
- **Generado con**: create-next-app
- **React**: 19.1.0 (última versión estable)
- **Next.js**: 15.3.4

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
TFG_UNIR-react/
├── components/              # Componentes reutilizables
│   ├── FooterComponent.tsx
│   ├── HeaderComponent.tsx
│   ├── HomeComponent.tsx
│   ├── LayoutComponent.tsx
│   ├── MenuCategoriaComponent.tsx
│   └── SliderComponent.tsx
├── pages/                   # Páginas de Next.js (routing automático)
│   ├── busqueda/           # Búsqueda de cursos
│   ├── categoria/          # Vista de categoría
│   ├── curso/              # Detalle de curso
│   ├── valoracion/         # Sistema de valoraciones
│   ├── _app.tsx            # App wrapper
│   ├── _document.tsx       # Document HTML
│   ├── 404.tsx             # Página 404
│   ├── acceso.tsx          # Login
│   ├── carrito.tsx         # Carrito de compras
│   ├── categorias.tsx      # Lista de categorías
│   ├── index.tsx           # Home
│   ├── mis-cursos.tsx      # Cursos del usuario
│   ├── mis-datos.tsx       # Perfil del usuario
│   └── registro.tsx        # Registro de usuarios
├── services/               # Servicios API
├── store/                  # Estado global (Zustand)
├── styles/                 # Estilos CSS/SCSS
├── utils/                  # Utilidades y helpers
├── public/                 # Assets estáticos
├── __tests__/              # Tests unitarios
└── cypress/                # Tests E2E
```

## 🎯 Funcionalidades Principales

### Módulos de Usuario
1. **Autenticación y Registro**
   - Login de usuarios (`pages/acceso.tsx`)
   - Registro de nuevos usuarios (`pages/registro.tsx`)
   - Gestión de sesión con Zustand

2. **Catálogo de Cursos**
   - Navegación por categorías (`pages/categorias.tsx`, `pages/categoria/`)
   - Búsqueda de cursos (`pages/busqueda/`)
   - Detalle de curso con información completa (`pages/curso/`)
   - Sistema de valoraciones (`pages/valoracion/`)

3. **Gestión de Compras**
   - Carrito de compras (`pages/carrito.tsx`)
   - Estado del carrito con Zustand
   - Mis cursos adquiridos (`pages/mis-cursos.tsx`)

4. **Perfil de Usuario**
   - Gestión de datos personales (`pages/mis-datos.tsx`)
   - Historial de cursos

## 🔧 Configuración del Proyecto

### Package Manager: pnpm
El proyecto está siendo migrado de npm a pnpm por:
- Mayor seguridad (prevención de phantom dependencies)
- Instalación ~2x más rápida
- Uso eficiente de espacio en disco
- Mejor soporte para monorepos
- Compatibilidad con Next.js

### Scripts Disponibles
```bash
pnpm dev                # Dev server en localhost:3000
pnpm build              # Build de producción
pnpm start              # Servidor de producción
pnpm test               # Tests con watch mode
pnpm lint               # Linter de Next.js
pnpm test-headless      # Tests headless (CI/CD)
pnpm test-headless-cc   # Tests con code coverage
```

### Configuración de pnpm
Ver `.npmrc` para configuración específica de Next.js/React:
- `shamefully-hoist=true` para compatibilidad
- `auto-install-peers=true` para peer dependencies
- Patrones de hoist para @next, @babel, react, jest, cypress

## 📝 Guías de Desarrollo

### Buenas Prácticas React 19 + Next.js 15

#### 1. Componentes
- **Usar componentes funcionales** con hooks
- **Preferir Server Components** (default en Next.js 15)
- Usar `'use client'` solo cuando sea necesario (interactividad, hooks de navegador)
- **Evitar prop drilling**: usar Zustand para estado global
- **Memoización**: usar `React.memo()`, `useMemo()`, `useCallback()` cuando sea apropiado

#### 2. Estado
- **Estado local**: `useState()` para estado de componente
- **Estado global**: Zustand para estado compartido (carrito, usuario, etc.)
- **Estado de servidor**: Next.js Server Components o SWR/React Query
- **Forms**: React Hook Form + Yup para validación

#### 3. Routing
- **File-based routing**: Next.js automático desde `/pages`
- **Dynamic routes**: `[id].tsx` para rutas dinámicas
- **Navigation**: usar `next/link` y `useRouter()`
- **API Routes**: `/pages/api` para endpoints backend

#### 4. Performance
- **Image Optimization**: usar `next/image` para imágenes
- **Code Splitting**: automático con Next.js
- **Lazy Loading**: `React.lazy()` + `Suspense` para componentes pesados
- **Static Generation**: usar `getStaticProps` cuando sea posible

#### 5. TypeScript
- **Tipado estricto**: `strict: true` en tsconfig.json
- **Interfaces**: definir tipos para props, estado, API responses
- **Type inference**: dejar que TypeScript infiera cuando sea obvio
- **Evitar `any`**: usar `unknown` o tipos específicos

#### 6. Accesibilidad
- **Semantic HTML**: usar elementos HTML apropiados
- **ARIA labels**: cuando sea necesario
- **Keyboard navigation**: asegurar navegación por teclado
- **Contraste**: cumplir WCAG AA mínimos

## 🔒 Seguridad

### Estado Actual
- Dependencias actualizadas a versiones recientes
- React 19.1.0 (última versión estable)
- Next.js 15.3.4 (incluye mejoras de seguridad)

### Auditoría y Mantenimiento

```bash
# Auditoría de seguridad
pnpm audit

# Verificar dependencias desactualizadas
pnpm outdated

# Actualizar dependencias (respetando semver)
pnpm update

# Actualizar a últimas versiones
pnpm update --latest

# Actualizar interactivamente
pnpm update --interactive
```

**Estado actual**: 0 vulnerabilidades, 8 paquetes con actualizaciones disponibles

### Autenticación
- Gestión de sesiones con Zustand
- Protección de rutas en cliente
- Tokens de autenticación con Axios

## 🧪 Testing

### Unit Tests (Jest + Testing Library)
- Framework: Jest 30.0.2
- Testing Library: React 16.3.0
- Environment: jsdom
- Configuración: `jest.config.js`, `jest.setup.js`

### Comandos de Testing
```bash
pnpm test                    # Tests con watch mode
pnpm test-headless           # Tests headless (CI/CD)
pnpm test-headless-cc        # Tests con code coverage
```

### E2E Tests (Cypress)
- Cypress 14.5.0
- Configurado con `@cypress/react`
- Tests interactivos: `pnpm run cypress:open`
- Tests CI/CD: `pnpm run cypress:run`

### Estructura de Tests
```
__tests__/
├── components/
│   ├── FooterComponent.test.tsx
│   ├── HeaderComponent.test.tsx
│   └── [otros componentes]
├── pages/
│   ├── index.test.tsx
│   └── [otras páginas]
└── services/
    └── [servicios]

cypress/
├── e2e/
├── fixtures/
└── support/
```

## 🚀 CI/CD

### GitHub Actions
Workflow configurado en `.github/workflows/node.js.yml`:
- Checkout del código (actions/checkout@v4)
- Setup de Node.js 20.x (actions/setup-node@v4)
- Instalación de pnpm (pnpm/action-setup@v4)
- Caché de pnpm store para builds más rápidos
- Instalación de dependencias con `--frozen-lockfile`
- Linter (pnpm lint)
- Build del proyecto (pnpm build)
- Ejecución de tests (pnpm test-headless-cc)
- Auditoría de seguridad (pnpm audit)

### Triggers
- Push a `main`
- Pull requests a `main`

### Optimizaciones
- Caché de pnpm store reduce tiempo de instalación
- `--frozen-lockfile` asegura builds reproducibles
- Actions actualizadas a v4 para mejor performance

## 📦 Dependencias Clave

### Producción
- `next` 15.3.4 - Framework React con SSR/SSG
- `react` 19.1.0 - Librería UI
- `react-dom` 19.1.0 - React DOM renderer
- `zustand` 5.0.5 - State management
- `react-hook-form` 7.58.1 - Gestión de formularios
- `yup` 1.6.1 - Validación de esquemas
- `axios` 1.10.0 - Cliente HTTP
- `sweetalert2` 11.4.8 - Alertas y modales
- `@hookform/resolvers` 5.1.1 - Resolvers para react-hook-form

### Desarrollo
- `typescript` 5.8.3 - Lenguaje
- `jest` 30.0.2 - Testing framework
- `@testing-library/react` 16.3.0 - Testing utilities
- `@testing-library/jest-dom` 6.6.3 - Jest matchers
- `cypress` 14.5.0 - E2E testing
- `eslint` 9.31.0 - Linter
- `eslint-config-next` 15.4.1 - ESLint config para Next.js

## 🔄 Migración a pnpm

### Proceso de Migración
El proyecto está siendo migrado de npm a pnpm. Archivos creados:
- `pnpm-workspace.yaml` - Configuración de workspace
- `.npmrc` - Configuración de pnpm
- `migrate-to-pnpm.sh` - Script de migración automática

### Ejecutar Migración
```bash
# Dar permisos de ejecución
chmod +x migrate-to-pnpm.sh

# Ejecutar migración
./migrate-to-pnpm.sh
```

### Pasos del Script
1. Verificar instalación de pnpm
2. Backup de package-lock.json
3. Limpiar node_modules y lockfile
4. Instalar con pnpm
5. Auditoría de seguridad
6. Verificar build

## 🎨 Estilos y Assets

### CSS/SCSS
- Estilos globales en `styles/`
- CSS Modules soportado por Next.js
- Styled JSX incluido en Next.js

### Imágenes
- Ubicación: `public/`
- Usar `next/image` para optimización automática
- Formatos: WebP, AVIF soportados

### Assets Estáticos
- Servidos desde `public/`
- Accesibles desde `/` en la URL

## 🔄 Flujo de Desarrollo

### Workflow Recomendado

**IMPORTANTE**: Antes de hacer cualquier commit, SIEMPRE ejecutar:

```bash
# 1. Ejecutar linter
pnpm lint

# 2. Ejecutar tests
pnpm test-headless

# 3. Verificar build
pnpm build

# 4. Si todo pasa, hacer commit
git add .
git commit -m "descripción del cambio"
```

### Checklist Pre-Commit

- [ ] ✅ Linter pasa: `pnpm lint`
- [ ] ✅ Tests pasan: `pnpm test-headless`
- [ ] ✅ Build exitoso: `pnpm build`
- [ ] ✅ Sin errores de TypeScript
- [ ] ✅ Sin vulnerabilidades: `pnpm audit`
- [ ] ✅ Código formateado correctamente

### Flujo Completo de Desarrollo

1. **Crear/Modificar código**
   ```bash
   # Trabajar en tu feature/componente/página
   ```

2. **Verificar durante desarrollo**
   ```bash
   pnpm dev  # Dev server con hot reload en localhost:3000
   ```

3. **Ejecutar linter**
   ```bash
   pnpm lint
   # DEBE completar sin errores
   ```

4. **Ejecutar tests**
   ```bash
   pnpm test-headless
   # DEBE mostrar: Tests passed
   ```

5. **Verificar build**
   ```bash
   pnpm build
   # DEBE completar sin errores
   ```

6. **Verificar seguridad**
   ```bash
   pnpm audit
   # Revisar vulnerabilidades
   ```

7. **Commit solo si todo pasa**
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   ```

### ⚠️ Reglas Importantes

- **NUNCA** hacer commit si el linter falla
- **NUNCA** hacer commit si los tests fallan
- **NUNCA** hacer commit si el build falla
- **SIEMPRE** ejecutar linter antes de commit
- **SIEMPRE** ejecutar tests antes de commit
- **SIEMPRE** verificar que el build funciona
- **SIEMPRE** revisar errores de TypeScript

### Para Agentes IA

**FLUJO OBLIGATORIO**:

1. **Después de generar/modificar código**:
   ```bash
   pnpm lint
   ```
   - Si falla: Arreglar el código
   - Si pasa: Continuar al paso 2

2. **Ejecutar tests**:
   ```bash
   pnpm test-headless
   ```
   - Si falla: Arreglar tests o código
   - Si pasa: Continuar al paso 3

3. **Verificar build**:
   ```bash
   pnpm build
   ```
   - Si falla: Arreglar errores de compilación
   - Si pasa: Continuar al paso 4

4. **Solo entonces hacer commit**:
   ```bash
   git add .
   git commit -m "descripción"
   ```

### Comandos de Verificación Rápida

```bash
# Verificación completa (ejecutar antes de commit)
pnpm lint && pnpm test-headless && pnpm build && echo "✅ Todo OK - Listo para commit"

# Si falla, verás el error específico
```

## 🤝 Contribución

### Para Desarrolladores
1. Instalar pnpm: `npm install -g pnpm`
2. Clonar repositorio
3. Instalar dependencias: `pnpm install`
4. Ejecutar dev server: `pnpm dev`
5. **Seguir el flujo de desarrollo** (ver sección anterior)

### Para Agentes IA
1. **SIEMPRE** usar sintaxis moderna de React 19
2. **PREFERIR** Server Components cuando sea posible
3. **USAR** `'use client'` solo cuando sea necesario
4. **SIEMPRE** tipar con TypeScript
5. **USAR** Zustand para estado global
6. **USAR** React Hook Form para formularios
7. **SIEMPRE** usar pnpm para gestión de paquetes
8. **SIEMPRE** ejecutar linter, tests y build antes de commit

## 📚 Recursos

### Documentación
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Docs](https://docs.pmnd.rs/zustand/)
- [React Hook Form](https://react-hook-form.com/)
- [pnpm Docs](https://pnpm.io/)
- [Cypress Docs](https://docs.cypress.io/)

### Archivos Importantes
- `package.json` - Dependencias y scripts
- `next.config.js` - Configuración de Next.js
- `tsconfig.json` - Configuración de TypeScript
- `.npmrc` - Configuración de pnpm
- `jest.config.js` - Configuración de tests
- `cypress.config.ts` - Configuración de E2E
- `.eslintrc.json` - Configuración de ESLint

## 🐛 Troubleshooting

### Problemas Comunes

**Error: Module not found**
```bash
rm -rf node_modules .next
pnpm install
```

**Tests fallan**
```bash
pnpm test-headless-cc
# Revisar logs de coverage
```

**Build falla**
```bash
pnpm build
# Verificar errores de TypeScript
```

**Problemas con pnpm**
- Verificar `.npmrc`
- Reinstalar: `rm -rf node_modules && pnpm install`
- Limpiar caché: `pnpm store prune`

**Next.js no inicia**
```bash
rm -rf .next
pnpm dev
```

## 📊 Métricas del Proyecto

- **Componentes**: 6 componentes principales
- **Páginas**: 10+ páginas
- **Servicios**: Múltiples (en `services/`)
- **Estado**: Zustand stores (en `store/`)
- **Framework**: Next.js 15.3.4 (App Router)
- **React**: 19.1.0 (última versión)
- **TypeScript**: Strict mode habilitado

## 🎯 Roadmap y TODOs

### Mejoras Pendientes
- [ ] Completar migración a pnpm
- [ ] Agregar más tests unitarios
- [ ] Implementar tests E2E con Cypress
- [ ] Mejorar cobertura de tests
- [ ] Optimizar bundle size
- [ ] Implementar ISR (Incremental Static Regeneration)
- [ ] Agregar PWA support
- [ ] Implementar i18n (internacionalización)

### Modernización
- [ ] Migrar a Server Components donde sea posible
- [ ] Implementar Suspense boundaries
- [ ] Usar Server Actions para mutations
- [ ] Optimizar imágenes con next/image
- [ ] Implementar streaming SSR
- [ ] Agregar error boundaries

### Testing
- [ ] Agregar tests para todos los componentes
- [ ] Agregar tests para todas las páginas
- [ ] Agregar tests de integración
- [ ] Aumentar cobertura a >80%
- [ ] Agregar tests E2E para flujos críticos
- [ ] Implementar visual regression testing

### Performance
- [ ] Implementar code splitting estratégico
- [ ] Optimizar bundle size
- [ ] Implementar lazy loading
- [ ] Agregar service worker
- [ ] Optimizar Core Web Vitals

---

**Última actualización**: 6 de diciembre de 2024  
**Versión de Next.js**: 15.3.4  
**Versión de React**: 19.1.0  
**Package Manager**: pnpm (en migración)  
**Node.js**: 20.x
