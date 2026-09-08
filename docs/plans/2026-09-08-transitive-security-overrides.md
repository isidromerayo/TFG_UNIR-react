# Plan: Parches de seguridad en dependencias transitivas (fast-uri, @humanfs/node, postcss-selector-parser)

- **Fecha:** 2026-09-08
- **Herramienta/modelo:** opencode / qwen3.8-flash
- **Estado:** done (verificado: lint OK, 131/131 Jest, 14/14 Cypress, build OK, `pnpm install --frozen-lockfile` OK)

## Objetivos

Cerrar las 6 alertas abiertas de Dependabot (todas en dependencias transitivas de `devDependencies`):

- `fast-uri` < 3.1.6 — 4 alertas HIGH: GHSA-jqff-g426-hqxp, GHSA-f65p-4m7j-42xc, GHSA-fph4-wmhf-6fwf, GHSA-5jgf-p345-68v8 (SSRF y host confusion). Resuelto: 3.1.7.
- `@humanfs/node` < 0.16.8 — MEDIUM: GHSA-p498-v437-472g (copia de symlinks fuera del árbol fuente). Resuelto: 0.16.8.
- `postcss-selector-parser` < 7.1.3 — LOW: GHSA-w9m9-85wc-3x92 (DoS por recursión AST). Resuelto: 7.1.6.

## Cambios de archivos

| Archivo | Cambio | Razón |
| --- | --- | --- |
| `package.json` | Override `fast-uri@<3.1.5` → `fast-uri@<3.1.6: ^3.1.6`; nuevos `@humanfs/node@<0.16.8: ^0.16.8` y `postcss-selector-parser@<7.1.3: ^7.1.3` | Forzar versiones corregidas de dependencias transitivas (patrón ya usado en el repo) |
| `pnpm-lock.yaml` | Regenerado con `pnpm install` | Bloqueo de versiones corregidas |
| `docs/plans/2026-09-08-transitive-security-overrides.md` | Documentación del plan y seguimiento | Regla de `AGENTS.md` |

## Verificación

1. `pnpm install --frozen-lockfile` (overrides coherentes con el lockfile)
2. `pnpm why` → fast-uri 3.1.7, @humanfs/node 0.16.8, postcss-selector-parser 7.1.6
3. `pnpm lint` (0 errores)
4. `pnpm test-headless` (131/131 tests pasados)
5. `pnpm cypress:component` (14/14 tests de componentes pasados)
6. `pnpm build` (compilado con éxito)

## Decisiones de diseño

- Se usan overrides de pnpm en lugar de esperar a que los paquetes padres publiquen actualizaciones, siguiendo el patrón existente (`ajv`, `brace-expansion`, etc.).
- Con el mismatch de overrides resuelto en `main`, se pedirá a Dependabot que regenere los PRs fallidos #203/#202/#199/#200 (`ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`).

## Estado

- [x] planned
- [x] in progress
- [x] done
