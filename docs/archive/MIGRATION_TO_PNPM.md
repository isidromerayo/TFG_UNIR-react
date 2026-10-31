# Guía de Migración de npm a pnpm - Proyecto React/Next.js

## 📋 Resumen

Este documento describe el proceso de migración del proyecto React/Next.js de npm a pnpm.

## 🎯 Objetivos de la Migración

1. **Seguridad**: Prevenir phantom dependencies
2. **Velocidad**: Instalación ~2x más rápida
3. **Espacio**: Uso eficiente de disco con hard links
4. **Consistencia**: Lockfile más estricto y confiable
5. **Monorepo**: Mejor soporte para estructuras monorepo

## 📦 Comparación npm vs pnpm

| Característica | npm | pnpm |
|---------------|-----|------|
| Velocidad instalación | Baseline | ~2x más rápido |
| Espacio en disco | Duplica paquetes | Hard links (ahorro ~50%) |
| Phantom dependencies | Posible | Prevenido |
| Lockfile | package-lock.json | pnpm-lock.yaml |
| Monorepo support | Workspaces | Workspaces mejorado |
| Seguridad | Buena | Excelente |

## 🚀 Proceso de Migración

### Prerequisitos

1. **Instalar pnpm**:
   ```bash
   npm install -g pnpm
   ```

2. **Verificar versión**:
   ```bash
   pnpm --version
   # Debe ser >= 8.0.0
   ```

### Migración Automática

Usa el script proporcionado:

```bash
# Dar permisos de ejecución
chmod +x migrate-to-pnpm.sh

# Ejecutar migración
./migrate-to-pnpm.sh
```

### Migración Manual

Si prefieres hacerlo paso a paso:

#### 1. Backup
```bash
# Backup de package-lock.json
cp package-lock.json package-lock.json.backup

# Backup de node_modules (opcional)
mv node_modules node_modules.backup
```

#### 2. Limpiar
```bash
# Eliminar node_modules y lockfile
rm -rf node_modules
rm -f package-lock.json
```

#### 3. Crear configuración de pnpm
```bash
# Crear .npmrc (ya incluido en el proyecto)
# Ver contenido en .npmrc
```

#### 4. Instalar con pnpm
```bash
pnpm install
```

#### 5. Verificar
```bash
# Verificar que se creó pnpm-lock.yaml
ls -la pnpm-lock.yaml

# Verificar instalación
pnpm list

# Auditoría de seguridad
pnpm audit
```

#### 6. Probar el proyecto
```bash
# Dev server
pnpm dev

# Build
pnpm build

# Tests
pnpm test-headless
```

## 📝 Archivos Creados/Modificados

### Nuevos Archivos

1. **pnpm-workspace.yaml**
   - Configuración de workspace de pnpm
   - Define los paquetes del monorepo

2. **.npmrc**
   - Configuración específica de pnpm
   - Hoist patterns para Next.js/React
   - Configuración de peer dependencies

3. **pnpm-lock.yaml**
   - Lockfile de pnpm (generado automáticamente)
   - Reemplaza package-lock.json

4. **migrate-to-pnpm.sh**
   - Script de migración automática
   - Incluye verificaciones y validaciones

5. **MIGRATION_TO_PNPM.md** (este archivo)
   - Documentación del proceso de migración

### Archivos Eliminados

1. **package-lock.json**
   - Reemplazado por pnpm-lock.yaml
   - Backup guardado como package-lock.json.backup

2. **node_modules/**
   - Reinstalado con pnpm
   - Estructura diferente (más segura)

### Archivos Sin Cambios

1. **package.json**
   - Sin cambios en dependencias
   - Scripts funcionan igual
   - Compatible con pnpm

## 🔧 Configuración de pnpm

### .npmrc Explicado

```ini
# Hoist para compatibilidad con Next.js
shamefully-hoist=true
# Permite que algunos paquetes sean accesibles desde node_modules raíz

# Auto-instalar peer dependencies
auto-install-peers=true
# Instala automáticamente peer dependencies faltantes

# Strict peer dependencies
strict-peer-dependencies=false
# No falla si hay conflictos de peer dependencies

# Hoist patterns específicos
public-hoist-pattern[]=*@next*
public-hoist-pattern[]=*@babel*
public-hoist-pattern[]=*react*
# Patrones de paquetes que deben ser hoisted
```

### pnpm-workspace.yaml Explicado

```yaml
packages:
  - '.'
# Define que el directorio actual es un paquete del workspace
```

## 📊 Comandos Equivalentes

| npm | pnpm | Descripción |
|-----|------|-------------|
| `npm install` | `pnpm install` | Instalar dependencias |
| `npm install <pkg>` | `pnpm add <pkg>` | Agregar paquete |
| `npm install -D <pkg>` | `pnpm add -D <pkg>` | Agregar dev dependency |
| `npm uninstall <pkg>` | `pnpm remove <pkg>` | Remover paquete |
| `npm update` | `pnpm update` | Actualizar dependencias |
| `npm run <script>` | `pnpm <script>` | Ejecutar script |
| `npm audit` | `pnpm audit` | Auditoría de seguridad |
| `npm list` | `pnpm list` | Listar dependencias |

## 🧪 Verificación Post-Migración

### Checklist de Verificación

- [ ] ✅ pnpm-lock.yaml creado
- [ ] ✅ node_modules instalado correctamente
- [ ] ✅ `pnpm dev` funciona
- [ ] ✅ `pnpm build` exitoso
- [ ] ✅ `pnpm test-headless` pasa
- [ ] ✅ `pnpm lint` sin errores
- [ ] ✅ `pnpm audit` sin vulnerabilidades críticas
- [ ] ✅ Aplicación funciona en navegador

### Comandos de Verificación

```bash
# 1. Verificar instalación
pnpm list

# 2. Verificar dev server
pnpm dev
# Abrir http://localhost:3000

# 3. Verificar build
pnpm build

# 4. Verificar tests
pnpm test-headless

# 5. Verificar linter
pnpm lint

# 6. Auditoría de seguridad
pnpm audit
```

## 🐛 Problemas Comunes y Soluciones

### Problema 1: "Cannot find module"

**Causa**: Phantom dependency que funcionaba con npm pero no con pnpm

**Solución**:
```bash
# Agregar la dependencia explícitamente
pnpm add <missing-package>
```

### Problema 2: "Peer dependency not installed"

**Causa**: Peer dependency faltante

**Solución**:
```bash
# Ya configurado en .npmrc con auto-install-peers=true
# Si persiste, instalar manualmente:
pnpm add <peer-dependency>
```

### Problema 3: Build falla después de migración

**Causa**: Caché de Next.js

**Solución**:
```bash
# Limpiar caché de Next.js
rm -rf .next
pnpm build
```

### Problema 4: Tests fallan

**Causa**: Configuración de Jest

**Solución**:
```bash
# Verificar jest.config.js
# Asegurar que moduleNameMapper está correcto
# Limpiar caché de Jest
pnpm test --clearCache
```

### Problema 5: ESLint no encuentra módulos

**Causa**: Configuración de ESLint

**Solución**:
```bash
# Verificar .eslintrc.json
# Reinstalar dependencias de ESLint
pnpm add -D eslint eslint-config-next
```

## 🔄 Rollback (Si es necesario)

Si necesitas volver a npm:

```bash
# 1. Eliminar archivos de pnpm
rm -rf node_modules
rm -f pnpm-lock.yaml
rm -f .npmrc
rm -f pnpm-workspace.yaml

# 2. Restaurar package-lock.json
cp package-lock.json.backup package-lock.json

# 3. Reinstalar con npm
npm install

# 4. Verificar
npm run dev
```

## 📈 Beneficios Observados

Después de la migración, deberías ver:

1. **Instalación más rápida**
   - npm: ~30-60 segundos
   - pnpm: ~15-30 segundos

2. **Menos espacio en disco**
   - npm: ~200-300 MB por proyecto
   - pnpm: ~100-150 MB (con hard links)

3. **Mayor seguridad**
   - Prevención de phantom dependencies
   - Lockfile más estricto

4. **Mejor experiencia de desarrollo**
   - Instalaciones más rápidas
   - Menos errores de dependencias

## 🎓 Mejores Prácticas con pnpm

### 1. Usar pnpm en lugar de npm

```bash
# ❌ No usar
npm install

# ✅ Usar
pnpm install
```

### 2. Agregar dependencias correctamente

```bash
# Producción
pnpm add <package>

# Desarrollo
pnpm add -D <package>

# Global
pnpm add -g <package>
```

### 3. Actualizar dependencias

```bash
# Actualizar todas
pnpm update

# Actualizar una específica
pnpm update <package>

# Actualizar a última versión
pnpm update --latest
```

### 4. Limpiar caché

```bash
# Limpiar store de pnpm
pnpm store prune

# Verificar store
pnpm store status
```

### 5. Auditoría regular

```bash
# Auditoría de seguridad
pnpm audit

# Arreglar vulnerabilidades
pnpm audit --fix
```

## 📚 Recursos Adicionales

- [Documentación oficial de pnpm](https://pnpm.io/)
- [Migración de npm a pnpm](https://pnpm.io/installation#using-npm)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Next.js con pnpm](https://nextjs.org/docs/getting-started/installation)

## 🤝 Soporte

Si encuentras problemas durante la migración:

1. Revisar este documento
2. Consultar [pnpm troubleshooting](https://pnpm.io/faq)
3. Revisar issues en GitHub del proyecto
4. Contactar al equipo de desarrollo

---

**Fecha de migración**: 6 de diciembre de 2024  
**Versión de pnpm**: 10.24.0  
**Versión de Node.js**: 20.x  
**Proyecto**: TFG_UNIR-react
