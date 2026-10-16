# Fix: `braces` counted as a production advisory in React (audit gate)

- **Fecha**: 2026-10-16
- **Herramienta/modelo**: opencode (deepseek-v4.1-flash)
- **Estado**: done (rama `fix/react-prod-audit-gate`, PR abierta)

## Objetivos

1. Eliminar la causa raíz por la que el gate duro `pnpm audit --prod` necesitaba tolerar `braces`
   en React.
2. Dejar `pnpm audit --prod` limpio sin excepciones, manteniendo el `ACCEPTED` del gate para no
   divergir de Angular y Vue3 (donde ya es código inerte).

## Contexto

Tras la unificación de workflows (#254) el gate de producción fallaba con:

```
Error: Found 1 production vulnerabilities. Fix them before merging.
```

El hallazgo era `braces` (`GHSA-vfj7-8cjw-p6xm`, `<= 3.0.3`, **sin parche upstream**) llegando por:

```
. > eslint-config-next > @next/eslint-plugin-next > fast-glob > micromatch > braces
```

`eslint` y `eslint-config-next` (tooling de lint, sólo necesario en desarrollo y en el build de CI)
estaban declarados en `dependencies`, así que `pnpm audit --prod` clasificaba `braces` como
advisory **de producción**, obligando al allowlist `ACCEPTED="braces"` del gate.

Comprobación previa (worktree limpio de `main`):

| Escenario | `pnpm audit --prod` |
|-----------|---------------------|
| React `main` (antes) | 1 high (`braces`) |
| React con el fix aplicado | No known vulnerabilities found |
| Angular (baseline del gate) | No known vulnerabilities found |
| Vue3 (tras #253) | No known vulnerabilities found |

## Cambios

- `package.json`: `eslint` y `eslint-config-next` pasan de `dependencies` a `devDependencies`
  (sin cambios de versión).
- `pnpm-lock.yaml`: regenerado; sólo se mueven esas dos entradas del bloque de dependencias del
  importer al bloque de devDependencies.
- `AGENTS.md`: nuevo quirks bullet — el tooling de lint es dev-only y por eso `braces` queda como
  advisory de desarrollo.
- `docs/plans/2026-10-16-unify-github-actions.md`: corregida la justificación del `ACCEPTED`
  (`braces` ya no llega por una dependencia de producción).

## Decisiones de diseño

- **No se toca `.github/workflows/security.yml`**: el allowlist `ACCEPTED="braces"` se mantiene
  (ya inerte) para que el gate siga siendo idéntico en los tres frontends y no colisionar con la
  PR de unificación pendiente en Angular (#278). Su retirada, si se decide, se hará en los tres
  repos a la vez.
- No se mueven al bloque dev `typescript` ni `@types/*` (no arrastran advisories y su ubicación no
  afecta al gate); el cambio se limita a lo que arregla el hallazgo.

## Verificación

- `pnpm audit --prod` → *No known vulnerabilities found*.
- `pnpm install --frozen-lockfile` → OK.
- `pnpm lint` → OK.
- `pnpm test-headless` → 25 suites / 131 tests OK.
- `pnpm cypress:component` → 2 specs / 14 tests OK.
- `pnpm build` (Next.js) → OK.
