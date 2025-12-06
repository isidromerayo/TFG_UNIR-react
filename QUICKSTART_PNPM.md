# 🚀 Quick Start - Migración a pnpm

## Para Empezar Rápido

### 1. Instalar pnpm
```bash
npm install -g pnpm
```

### 2. Ejecutar Migración
```bash
./migrate-to-pnpm.sh
```

### 3. Verificar
```bash
pnpm dev
```

## ¿Qué hace el script?

1. ✅ Verifica que pnpm está instalado
2. ✅ Hace backup de package-lock.json
3. ✅ Limpia node_modules y lockfile
4. ✅ Instala con pnpm
5. ✅ Ejecuta auditoría de seguridad
6. ✅ Verifica que el build funciona

## Comandos Básicos

```bash
# Instalar dependencias
pnpm install

# Dev server
pnpm dev

# Build
pnpm build

# Tests
pnpm test-headless

# Linter
pnpm lint

# Agregar paquete
pnpm add <package>

# Remover paquete
pnpm remove <package>
```

## Si Algo Sale Mal

### Rollback a npm
```bash
rm -rf node_modules pnpm-lock.yaml
cp package-lock.json.backup package-lock.json
npm install
```

### Limpiar y Reinstalar
```bash
rm -rf node_modules .next
pnpm install
pnpm build
```

## 🔒 Mantenimiento

### Verificar Seguridad
```bash
# Auditoría de vulnerabilidades
pnpm audit

# Ver dependencias desactualizadas
pnpm outdated
```

### Actualizar Dependencias
```bash
# Actualizar todas (seguro)
pnpm update

# Actualizar a últimas versiones
pnpm update --latest

# Actualizar una específica
pnpm update <package>
```

**Después de actualizar**:
```bash
pnpm lint && pnpm test-headless && pnpm build
```

## 📚 Más Información

- **RESUMEN_MIGRACION_PNPM.md** - Resumen completo
- **MIGRATION_TO_PNPM.md** - Guía detallada
- **AGENTS.md** - Contexto del proyecto
- **AUDIT_REPORT.md** - Reporte de seguridad

---

**¿Listo?** Ejecuta: `./migrate-to-pnpm.sh`
