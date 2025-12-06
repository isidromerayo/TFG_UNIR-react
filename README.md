# TFG UNIR - Frontend React/Next.js

Aplicación web frontend desarrollada en React con Next.js para un sistema de gestión de cursos online.

## 🚀 Tecnologías

- **Framework**: Next.js 15.3.4
- **Librería**: React 19.1.0
- **Lenguaje**: TypeScript 5.8.3
- **Package Manager**: pnpm
- **State Management**: Zustand 5.0.5
- **Forms**: React Hook Form 7.58.1 + Yup 1.6.1
- **HTTP Client**: Axios 1.10.0
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

### Tests E2E (Cypress)

```bash
# Interactivo
pnpm run cypress:open

# Headless
pnpm run cypress:run
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

## 📚 Documentación

- **[AGENTS.md](./AGENTS.md)** - Contexto completo del proyecto para agentes IA
- **[MIGRATION_TO_PNPM.md](./MIGRATION_TO_PNPM.md)** - Guía de migración a pnpm
- **[CHANGELOG_PNPM.md](./CHANGELOG_PNPM.md)** - Changelog de la migración

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
