# Pull Request: Resolución de 35 Vulnerabilidades de Seguridad

## 🛡️ Resumen de Seguridad

Esta Pull Request soluciona todas las vulnerabilidades de seguridad detectadas en el proyecto (35 en total), incluyendo una vulnerabilidad crítica en `handlebars` y vulnerabilidades moderadas en la dependencia directa `next`.

### Estado de Vulnerabilidades (pnpm audit)
- **Antes**: 35 vulnerabilidades (1 crítica, 18 altas, 14 moderadas, 2 bajas).
- **Después**: **0 vulnerabilidades** ✅

---

## 🔧 Cambios Realizados

### 1. Actualización de Dependencias Directas
Se han actualizado las siguientes dependencias a sus versiones parcheadas para solucionar fallos de seguridad (HTTP request smuggling, DoS, bypass de CSRF):
- `next`: ^16.1.6 → **^16.1.7**
- `eslint-config-next`: ^16.1.6 → **^16.1.7**

### 2. Implementación de pnpm Overrides
Para solucionar vulnerabilidades en dependencias transitivas (de desarrollo y sub-dependencias) que no se actualizan automáticamente, se han forzado las versiones seguras en el `package.json`:

| Paquete | Versión Forzada | Vulnerabilidades Corregidas |
|---------|-----------------|-----------------------------|
| `handlebars` | `^4.7.9` | Inyección de JS (Crítica), Prototype Pollution |
| `systeminformation` | `^5.31.0` | Inyección de Comandos (Alta) |
| `lodash` | `^4.18.1` | Inyección de Código, Prototype Pollution |
| `minimatch` | `^3.1.4` / `^9.0.7` | ReDoS (Alta) |
| `picomatch` | `^2.3.2` / `^4.0.4` | ReDoS (Alta) |
| `ajv` | `^6.14.0` / `^8.18.0` | ReDoS (Moderada) |
| `brace-expansion` | `^1.1.13` / `^2.0.3` | DoS / Process Hang (Moderada) |
| `flatted` | `^3.4.2` | Prototype Pollution / Unbounded Recursion |
| `serialize-javascript` | `^7.0.5` | RCE / CPU Exhaustion |

### 3. Limpieza de package.json
- Se eliminó la sección `overrides` redundante de la raíz (destinada a npm) para centralizar la configuración en la sección `pnpm.overrides`, acorde al gestor de paquetes utilizado en el proyecto.

---

## ✅ Validación Técnica

Se han ejecutado los procesos de validación obligatorios para asegurar la estabilidad del proyecto tras las actualizaciones:

- **Auditoría de Seguridad**: `pnpm audit` finalizado con éxito (0 vulnerabilidades).
- **Linter**: `pnpm lint` sin errores.
- **Tests Unitarios**: 126 tests pasados (100% éxito) con una cobertura de sentencias del **91.7%**.
- **Build de Producción**: `pnpm build` generado correctamente con Next.js 16.1.7.

---

## 🚀 Instrucciones para Revisión

1. Verificar que el archivo `package.json` contiene los `overrides` necesarios en la sección `pnpm`.
2. Comprobar que `pnpm-lock.yaml` refleja las versiones seguras mencionadas.
3. Ejecutar `pnpm install` y `pnpm audit` localmente para confirmar el estado de seguridad.
4. Ejecutar `pnpm test-headless` para validar que no hay regresiones.

---

## 📋 Checklist Pre-Merge

- [x] pnpm audit (0 vulnerabilidades)
- [x] pnpm lint (Pass)
- [x] pnpm test (126/126 Pass)
- [x] pnpm build (Success)
- [x] Sin cambios en la lógica de negocio, solo actualizaciones de seguridad.
