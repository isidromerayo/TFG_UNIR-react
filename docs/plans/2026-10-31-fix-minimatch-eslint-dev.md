# Plan: corregir follow-redirects y minimatch en el gate de producción

- **Fecha**: 2026-10-31
- **Herramienta/modelo**: opencode (deepseek-v4.1-flash)
- **Estado**: done (rama `fix/security-minimatch-eslint-dev`, PR abierta)

## Objetivos

1. Desbloquear el gate duro `pnpm audit (production gate)` de `security.yml`, en rojo desde la
   ejecución programada del 2026-10-31.
2. Corregir —no silenciar— el advisory de `follow-redirects` (tiene parche publicado).
3. Dejar de auditar como producción lo que es toolchain de lint (`eslint`, `eslint-config-next`).

## Contexto

La ejecución programada [41182114693](https://github.com/isidromerayo/TFG_UNIR-react/actions/runs/41182114693)
falló con `Found 3 production vulnerabilities`. Los dos advisories se publicaron el 2026-10-30
(22:59 y 23:09 UTC), después de la última ejecución verde, así que no hay cambios de código detrás.

| Paquete | Versión | Advisory | Ruta |
|---|---|---|---|
| follow-redirects | 1.16.1 | `GHSA-mrwp-f3q8-3g9p` / `CVE-2026-116689` (high, 5.9) | `.>axios>follow-redirects` |
| minimatch | 3.1.5 | `GHSA-g3hv-75wg-m249` / `CVE-2026-118764` (moderate) | `.>eslint>minimatch` |
| minimatch | 10.2.6 | ídem | `eslint-config-next>…>@typescript-eslint/typescript-estree>minimatch` |

Dos causas distintas:

1. El override `"follow-redirects": ">=1.16.1"` permitía justo la versión vulnerable. Parche: 1.16.2.
2. `eslint` y `eslint-config-next` estaban en `dependencies`, así que sus minimatch contaban como
   superficie de producción. El único parche de minimatch es la **11.x**, un major que elimina
   `makeRe()`, `AST`, `Minimatch#regexp` y cambia el tipo de `Minimatch.set`: `eslint` (9 y 10) y
   `@typescript-eslint/typescript-estree` dependen de `^10.2.x` y `glob@13` consume `set`/`globParts`.
   Forzar el override rompería el toolchain; no hay versión compatible todavía.

## Cambios

- `package.json`: override `follow-redirects` `>=1.16.1` → `>=1.16.2`.
- `package.json`: `eslint` y `eslint-config-next` pasan de `dependencies` a `devDependencies`
  (mismas versiones). Solo los usa `pnpm lint`; Next 16 ya no ejecuta ESLint en `next build`.
- `pnpm-lock.yaml`: `follow-redirects` 1.16.2 y nuevas marcas `dev` en el árbol de eslint.
- `AGENTS.md`: se corrige la nota de que `pnpm audit` estaba retirado (HTTP 410); vuelve a responder
  y es el gate de producción.
- `docs/plans/2026-10-31-…` (este documento).

## Decisiones de diseño

- **No se silencia nada**: minimatch sigue apareciendo en el paso *pnpm audit (dev warning)* del
  workflow y en `pnpm audit` local. No se añade a `auditConfig.ignoreCves` (tiene parche) ni al
  registro `accepted-advisories.md` (el chequeo automático fallaría porque OSV ya publica `fixed`).
- La reclasificación no es cosmética: el gate `--prod` debe medir el runtime real, y ESLint no se
  ejecuta en producción.
- No se toca `eslint` a la 10.x: seguiría arrastrando minimatch `^10.2.6`, vulnerable, sin arreglar
  nada.

## Verificación

- `pnpm install` → `follow-redirects@1.16.2` en el lockfile.
- `pnpm audit --prod` → `No known vulnerabilities found`.
- `pnpm audit` → sigue avisando de dev-only (14 vulnerabilidades, incluidas las dos de minimatch):
  comportamiento esperado, el paso del workflow es `continue-on-error`.
- `pnpm lint` → 0 errores (1 warning preexistente en `pages/_document.tsx`).
- `pnpm test-headless` → 25 suites / 131 tests OK.
- `pnpm cypress:component` → 14 tests OK.
- `pnpm build` → OK (confirma que no hace falta eslint en runtime/build).
- Pendiente: `workflow_dispatch` de `Security Audit` tras el merge.
