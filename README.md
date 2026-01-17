# TFG UNIR - Frontend React/Next.js

[![CI](https://github.com/isidromerayo/TFG_UNIR-react/actions/workflows/node.js.yml/badge.svg)](https://github.com/isidromerayo/TFG_UNIR-react/actions/workflows/node.js.yml)
[![Tests](https://github.com/isidromerayo/TFG_UNIR-react/actions/workflows/tests.yml/badge.svg)](https://github.com/isidromerayo/TFG_UNIR-react/actions/workflows/tests.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-react&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-react)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-react&metric=coverage)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-react)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-react&metric=bugs)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-react)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-react&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-react)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-react&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-react)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-react&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-react)

Aplicación web frontend desarrollada en React con Next.js para un sistema de gestión de cursos online.

> 📊 **Estado de Cobertura**: El proyecto mantiene un objetivo de cobertura superior al **80% en código nuevo**, validado a través de SonarQube, utilizando una combinación de Jest para lógica/estructura y Cypress para componentes críticos y flujos E2E.

## 🚀 Tecnologías

- **Framework**: Next.js 15.5.9
- **Librería**: React 19.2.3
- **Lenguaje**: TypeScript 5.9.3
- **Package Manager**: pnpm
- **State Management**: Zustand 5.0.9
- **Forms**: React Hook Form 7.69.0 + Yup 1.7.1
- **HTTP Client**: Axios 1.13.2
- **UI/Alerts**: SweetAlert2 11.4.8
- **Testing**: Jest + Testing Library, Cypress

## 📦 Instalación

### Prerequisitos

- Node.js 20.x o superior
- pnpm 8.0.0 o superior

### Instalar pnpm

```bash
npm install -g pnpm
```

### Instalar Dependencias

```bash
pnpm install
```

## 🛠️ Desarrollo

### Servidor de Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build de Producción

```bash
pnpm build
```

### Servidor de Producción

```bash
pnpm start
```

### Linter

```bash
pnpm lint
```

## 🧪 Testing

### Tests Unitarios

```bash
# Con watch mode
pnpm test

# Headless (CI/CD)
pnpm test-headless

# Con coverage
pnpm test-headless-cc
```

### Tests E2E & Componentes (Cypress)

```bash
# Interactivo (E2E)
pnpm run cypress:open

# Headless (E2E)
pnpm run cypress:run

# Interactivo (Componentes)
pnpm run cypress:component:open

# Headless (Componentes)
pnpm run cypress:component
```

## 📁 Estructura del Proyecto

```
TFG_UNIR-react/
├── components/          # Componentes reutilizables
├── pages/              # Páginas (routing automático)
│   ├── api/           # API routes
│   ├── busqueda/      # Búsqueda de cursos
│   ├── categoria/     # Vista de categoría
│   ├── curso/         # Detalle de curso
│   └── valoracion/    # Sistema de valoraciones
├── services/          # Servicios API
├── store/             # Estado global (Zustand)
├── styles/            # Estilos CSS/SCSS
├── utils/             # Utilidades
├── public/            # Assets estáticos
├── __tests__/         # Tests unitarios
└── cypress/           # Tests E2E
```

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Servidor de producción |
| `pnpm test` | Tests con watch mode |
| `pnpm test-headless` | Tests headless |
| `pnpm test-headless-cc` | Tests con coverage |
| `pnpm lint` | Linter de Next.js |
| `pnpm cypress:open` | Abrir Cypress interactivo (E2E) |
| `pnpm cypress:run` | Ejecutar Cypress headless (E2E) |
| `pnpm cypress:component` | Ejecutar tests de componentes (Cypress) |

## 📚 Documentación

- **[AGENTS.md](./AGENTS.md)** - Contexto completo del proyecto para agentes IA
- **[SONARQUBE_SETUP.md](./SONARQUBE_SETUP.md)** - Configuración de SonarQube y métricas
- **[MIGRATION_TO_PNPM.md](./MIGRATION_TO_PNPM.md)** - Guía de migración a pnpm
- **[CHANGELOG_PNPM.md](./CHANGELOG_PNPM.md)** - Changelog de la migración
- **[AUDIT_REPORT.md](./AUDIT_REPORT.md)** - Reporte de auditoría de seguridad
- **[SECURITY_AUDIT_ANALYSIS.md](./SECURITY_AUDIT_ANALYSIS.md)** - Análisis de herramientas de auditoría
- **[DEPENDENCY_UPDATE_GUIDE.md](./DEPENDENCY_UPDATE_GUIDE.md)** - Guía de actualización de dependencias
- **[PENDING_PRS_REPORT.md](./PENDING_PRS_REPORT.md)** - Análisis de PRs pendientes
- **[PULL_REQUEST.md](./PULL_REQUEST.md)** - Guía para la creación de Pull Requests
- **[DOCS_INDEX.md](./DOCS_INDEX.md)** - Índice general de la documentación

## � Se/guridad y Mantenimiento

### Auditoría de Seguridad

```bash
# Verificar vulnerabilidades
pnpm audit

# Auditoría con detalles en JSON
pnpm audit --json

# Auditoría con nivel específico
pnpm audit --audit-level=moderate
```

**Estado actual**: ✅ 0 vulnerabilidades conocidas

⚠️ **Importante**: `pnpm audit` solo consulta la npm Advisory Database. Para una seguridad completa:
- Revisar PRs de Snyk y Dependabot
- Monitorear security advisories de paquetes críticos
- Usar múltiples herramientas de auditoría

Ver [AUDIT_REPORT.md](./AUDIT_REPORT.md) para el reporte completo.  
Ver [SECURITY_AUDIT_ANALYSIS.md](./SECURITY_AUDIT_ANALYSIS.md) para entender las limitaciones de `pnpm audit`.

### Verificar Dependencias Desactualizadas

```bash
# Ver todas las dependencias desactualizadas
pnpm outdated

# Ver solo dependencias de producción
pnpm outdated --prod

# Ver en formato JSON
pnpm outdated --json
```

### Actualizar Dependencias

```bash
# Actualizar todas (respetando semver en package.json)
pnpm update

# Actualizar a últimas versiones (ignora semver)
pnpm update --latest

# Actualizar una dependencia específica
pnpm update <package>

# Actualizar dependencias interactivamente
pnpm update --interactive

# Actualizar solo dependencias de producción
pnpm update --prod
```

### Recomendaciones de Actualización

**Actualizaciones seguras** (parches y menores):
```bash
pnpm update @types/node eslint react react-dom typescript
```

**Actualizaciones mayores** (requieren revisión):
```bash
# Next.js 16 - Revisar breaking changes primero
pnpm update next eslint-config-next --latest

# Cypress 15 - Revisar changelog
pnpm update cypress --latest
```

**Después de actualizar, siempre verificar**:
```bash
pnpm lint
pnpm test-headless
pnpm build
```

## 🚀 CI/CD

### GitHub Actions

El proyecto incluye un workflow de CI/CD configurado en `.github/workflows/node.js.yml` que se ejecuta automáticamente en:

- Push a `main`
- Pull requests a `main`

#### Pipeline

1. **Checkout** - Descarga el código
2. **Setup Node.js** - Configura Node.js 20.x
3. **Install pnpm** - Instala pnpm 10.x
4. **Cache** - Cachea el store de pnpm para builds más rápidos
5. **Install** - Instala dependencias con `--frozen-lockfile`
6. **Lint** - Ejecuta el linter
7. **Build** - Compila el proyecto
8. **Test** - Ejecuta tests con coverage
9. **Audit** - Verifica vulnerabilidades de seguridad

#### Beneficios

- ✅ Builds reproducibles con lockfile congelado
- ✅ Instalación rápida con caché de pnpm
- ✅ Verificación automática de calidad de código
- ✅ Detección temprana de errores

## 🔄 Migración a pnpm

Este proyecto ha sido migrado de npm a pnpm. Para más información, consulta [MIGRATION_TO_PNPM.md](./MIGRATION_TO_PNPM.md).

### Ejecutar Migración

```bash
chmod +x migrate-to-pnpm.sh
./migrate-to-pnpm.sh
```

## 🤝 Contribución

### Workflow de Desarrollo

1. Crear rama para tu feature
2. Hacer cambios
3. Ejecutar linter: `pnpm lint`
4. Ejecutar tests: `pnpm test-headless`
5. Verificar build: `pnpm build`
6. Commit y push
7. Crear Pull Request

### Checklist Pre-Commit

- [ ] ✅ Linter pasa: `pnpm lint`
- [ ] ✅ Tests pasan: `pnpm test-headless`
- [ ] ✅ Build exitoso: `pnpm build`
- [ ] ✅ Sin errores de TypeScript

## 📖 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [pnpm Documentation](https://pnpm.io/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [React Hook Form](https://react-hook-form.com/)

## 📄 Licencia

Este proyecto es parte del TFG de UNIR - Frameworks frontend JavaScript: Análisis y estudio práctico.

---

**Versión**: 0.1.0  
**Node.js**: 20.x  
**Package Manager**: pnpm
