# Pull Request: Security Audit - Dependency Updates

## Resumen

Actualización de dependencias para corregir vulnerabilidades de seguridad detectadas por `pnpm audit`.

**PR**: https://github.com/isidromerayo/TFG_UNIR-react/pull/147  
**Rama**: `chore/deps-security-audit`  
**Fecha**: 26 de julio de 2026

## Cambios Realizados

### Dependencias Directas Actualizadas

| Paquete | Antes | Ahora | Tipo |
|---------|-------|-------|------|
| next | 16.2.10 | 16.2.12 | Patch |
| react/react-dom | 19.2.4 | 19.2.8 | Patch |
| axios | 1.15.2 | 1.18.1 | Patch |
| zustand | 5.0.11 | 5.0.14 | Patch |
| react-hook-form | 7.71.1 | 7.83.0 | Minor |
| sweetalert2 | 11.26.18 | 11.26.25 | Patch |
| cypress | 15.14.2 | 15.19.0 | Minor |
| @babel/core | 7.29.0 | 7.29.7 | Patch |

### Overrides de Seguridad Agregados

Se agregaron overrides en `package.json` para forzar versiones seguras en dependencias transitive:

| Paquete | Versión Mínima | Vulnerabilidad |
|---------|---------------|----------------|
| systeminformation | >=5.31.7 | Command Injection en Linux |
| sharp | >=0.35.0 | Vulnerabilidades libvips |
| ws | >=8.21.0 | Memory exhaustion DoS |
| js-yaml | >=4.3.0 | DoS cuadrático en merge keys |
| postcss | >=8.5.18 | Path Traversal a archivos .map |
| tmp | >=0.2.6 | Path Traversal |
| form-data | >=4.0.6 | CRLF Injection |
| qs | >=6.15.2 | DoS remoto |

## Resultado de Vulnerabilidades

| Métrica | Antes | Ahora |
|---------|-------|-------|
| Total | 20 | 2 |
| High | 15 | 2 |
| Moderate | 4 | 0 |
| Low | 1 | 0 |

### Vulnerabilidades Pendientes

Las 2 vulnerabilidades restantes están en dependencias de desarrollo (`brace-expansion` via `jest` y `babel-plugin-istanbul`). La versión corregida (5.0.8) rompe compatibilidad con `minimatch@9.0.9`. No afectan producción.

## Verificación

Pre-commit flow completado exitosamente:
- `pnpm lint` - Sin errores
- `pnpm test-headless` - 126 tests pasando
- `pnpm cypress:component` - 14 tests pasando
- `pnpm build` - Build exitoso

## Documentación Actualizada

- `README.md` - Versiones de dependencias
- `AUDIT_REPORT.md` - Reporte de auditoría actualizado
- `AGENTS.md` - Versiones de dependencias

## Archivos Modificados

- `package.json` - Dependencias actualizadas + overrides de seguridad
- `pnpm-lock.yaml` - Lockfile actualizado
- `README.md` - Versiones actualizadas
- `AUDIT_REPORT.md` - Reporte de auditoría
- `AGENTS.md` - Versiones de dependencias

## Checklist

- [x] Pre-commit flow exitoso (lint, test, cypress, build)
- [x] Documentación actualizada
- [x] Sin breaking changes
- [x] Vulnerabilidades reducidas de 20 a 2

---

**Generado**: 26 de julio de 2026
