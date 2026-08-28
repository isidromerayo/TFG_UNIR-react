# Plan: Actualización de seguridad de Next.js (GHSA-2xp9-vwfh-vxw4 / AIKIDO-2026-553733)

- **Fecha:** 2026-08-28
- **Herramienta/modelo:** Antigravity / Gemini 3.6 Flash
- **Estado:** done (verificado: lint OK, 131/131 Jest, 14/14 Cypress, build Next.js 16.3.3 OK)

## Objetivos

Corregir la vulnerabilidad crítica reportada por Aikido (GHSA-2xp9-vwfh-vxw4 / AIKIDO-2026-553733) en Next.js actualizando `next` y `eslint-config-next` de la versión `16.2.12` a `16.3.3` en el proyecto `TFG_UNIR-react`.

## Cambios de archivos

| Archivo | Cambio | Razón |
| --- | --- | --- |
| `package.json` | `next`: `16.3.3`, `eslint-config-next`: `16.3.3` | Actualización a versión corregida de la CVE |
| `pnpm-lock.yaml` | Actualizado mediante `pnpm install` | Bloqueo de versiones |
| `tsconfig.json` | Añadidos `"__tests__"`, `"cypress"`, `"coverage"` en `exclude` | Evitar que TypeScript en `next build` procese tipos globales de tests |
| `docs/plans/2026-08-28-nextjs-security-update.md` | Documentación del plan y seguimiento | Regla de `AGENTS.md` |

## Verificación

1. `pnpm lint` (0 errores)
2. `pnpm test-headless` (131/131 tests pasados)
3. `pnpm cypress:component` (14/14 tests componentes pasados)
4. `pnpm build` (Compilado con éxito con Next.js 16.3.3)

## Decisiones de diseño

- Mantener la alineación de versiones entre `next` y `eslint-config-next` en `16.3.3`.
- Seguir el flujo de ramas de Git estricto: crear rama `fix/security-nextjs-ghsa-2xp9-vwfh-vxw4`, ejecutar la suite completa de tests, hacer push a remote y crear Pull Request para revisión del usuario (sin hacer merge directo a `main`).

## Estado

- [x] planned
- [x] in progress
- [x] done
