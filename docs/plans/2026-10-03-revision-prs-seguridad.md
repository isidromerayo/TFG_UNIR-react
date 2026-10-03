# Plan: Revisión de PRs abiertas y vulnerabilidades de seguridad

- **Fecha**: 2026-10-03
- **Herramienta/modelo**: opencode (deepseek-v4.1-flash)
- **Estado**: in progress

## Objetivos

1. Revisar las PRs abiertas (Dependabot y CodeQL) y el estado de vulnerabilidades del repositorio.
2. Mergear las PRs verdes y resolver el bloqueo de las PRs de CodeQL (#229/#230) por mismatch de versión.
3. Corregir las vulnerabilidades detectadas por `pnpm audit` mediante overrides y actualización de `next`.
4. Eliminar el falso positivo del workflow `Security Audit` que genera la issue #228 en cada ejecución.

## Contexto

PRs abiertas (todas de Dependabot):

| # | Contenido | CI |
|---|-----------|-----|
| #231 | prod deps: `next`/`eslint-config-next` 16.3.5→16.3.6, `@types/node` 26.6.1→26.6.2 | verde |
| #232 | dev deps: `jest*` 30.5.1→30.5.2, `ts-jest` →29.4.13 | verde |
| #229 | `codeql-action/analyze` 4.38.1→4.38.2 | falla |
| #230 | `codeql-action/init` 4.38.1→4.38.2 | falla |

Causa del fallo de #229/#230: CodeQL exige que **todos** los pasos `github/codeql-action` usen la misma versión.

Estado de `pnpm audit` (2026-10-03): **1 critical, 7 high, 4 moderate**.

| Severidad | Paquete | Versión instalada | Rango vulnerable | Parcheado |
|-----------|---------|-------------------|------------------|-----------|
| critical | next | 16.3.5 | >=16.2.0 <16.3.6 | >=16.3.6 |
| high/moderate | brace-expansion | 1.1.18 | <1.1.21 | >=1.1.21 |
| high/moderate | brace-expansion | 2.1.4 | >=2.0.0 <2.1.7 | >=2.1.7 |
| high/moderate | brace-expansion | 5.0.9 | >=4.0.0 <5.0.12 | >=5.0.12 |
| moderate | js-yaml | 5.2.2 | >=5.0.0 <=5.4.0 | >=5.4.1 |
| high | braces | 3.0.3 | <=3.0.3 | (sin parche) |

- Dependabot alert abierta: **#137** (`js-yaml`). CodeQL code-scanning: 0 abiertas.
- `braces` (GHSA-vfj7-8cjw-p6xm): sin versión parcheada; transitiva dev-only (`lcov-result-merger`/`eslint-config-next` → `fast-glob` → `micromatch`). Se acepta como riesgo residual.
- Issue #228 es un falso positivo: el `jq` de `security.yml` (`add` sobre un objeto) devuelve vacío y la condición `vulnerabilities != '0'` se cumple con vacío.

## Cambios

- `docs/plans/2026-10-03-revision-prs-seguridad.md` (este documento).
- Merge squash de #231 y #232.
- PR única para CodeQL: cerrar #229/#230 y subir `init` **y** `analyze` a 4.38.2.
- PR de seguridad: `next`/`eslint-config-next` a 16.3.8; overrides `brace-expansion` (`<1.1.21`, `>=2.0.0 <2.1.7`, `>=4.0.0 <5.0.12`) y `js-yaml` (`>=5.0.0 <5.4.1`).
- `security.yml`: corregir contadores `jq` y condición de creación de issue; cerrar #228.

## Verificación

- `gh pr checks <n>` verde en cada PR antes de mergear.
- Por rama: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm test-headless`, `pnpm cypress:component`, `pnpm build`, `pnpm audit`.
- Tras Fase 3: `pnpm audit` solo debe reportar `braces`.
- Tras Fase 2: workflow `codeql.yml` en `main` success con 4.38.2.

## Decisiones de diseño

- Todo por rama + PR con squash (policy del repo; nunca push directo a `main`).
- CodeQL: opción PR única (bump de `init` y `analyze` juntos) para no dejar `main` en rojo.
- `next` a 16.3.8 (última) en la PR de seguridad, aunque #231 ya parchee (16.3.6).
- `braces`: documentar y aceptar el riesgo residual (dev-only, sin parche disponible).

## Resultado

- Pendiente de ejecución.
