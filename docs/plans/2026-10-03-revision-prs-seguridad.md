# Plan: Revisión de PRs abiertas y vulnerabilidades de seguridad

- **Fecha**: 2026-10-03
- **Herramienta/modelo**: opencode (deepseek-v4.1-flash)
- **Estado**: done

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
| #235 | `next` 16.3.5→16.3.6 (security update, creada tras #231) | conflicto |

Causa del fallo de #229/#230: CodeQL exige que **todos** los pasos `github/codeql-action` usen la misma versión.

#235 apareció más tarde (actualización de seguridad de `next`) y quedó en conflicto porque #231 ya había subido `next`; se decidió consolidar todo en una única PR.

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
- Causa raíz de `js-yaml` 5.2.2: el override previo `"js-yaml@>=4.0.0 <4.3.0": ">=4.3.0"` no tenía cota superior, así que al resolver `^4.1.1` saltó al major 5 (5.2.2), que es el vulnerable. Acotarlo a `^4.3.2` elimina la rama 5.x.

## Cambios

- `docs/plans/2026-10-03-revision-prs-seguridad.md` (este documento).
- Merge squash de #231 (prod deps: `next` 16.3.6, fix crítico).
- PR única CodeQL: cerrada #229/#230, bump de `init` **y** `analyze` a 4.38.2 (PR #234).
- PR consolidada `chore/deps-security-consolidated`: incorpora #232 (dev deps `jest*` 30.5.2, `ts-jest` 29.4.14), sube `next`/`eslint-config-next` a 16.3.8, arregla overrides de `brace-expansion` (`<1.1.21`, `>=2.0.0 <2.1.7`, `>=4.0.0 <5.0.12`) y de `js-yaml` (cota `^4.3.2`), todo en una sola PR. Cierra #232 y #235.
- `security.yml`: corregir contadores `jq`, añadir output booleano `has_vulnerabilities` y usarlo en las condiciones; cerrar #228.
- `README.md`: actualizar versiones documentadas (Next.js 16.3.8, React 19.3.0, Zustand 5.0.15, React Hook Form 7.88.0, Yup 1.7.1, Axios 1.20.0) y la nota de estado de seguridad.

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
- Consolidar #232 y #235 en una única PR (petición del usuario tras los conflictos de #235).

## Resultado

- `main`: #233 (plan), #234 (CodeQL 4.38.2, cierra #229/#230) y #231 (prod deps, `next` 16.3.6) mergeados por squash.
- PR consolidada abierta: dev deps (`jest*` 30.5.2, `ts-jest` 29.4.14), `next`/`eslint-config-next` 16.3.8, overrides `brace-expansion` y `js-yaml`, y fix de `security.yml`; cierra #232 y #235.
- `pnpm audit`: pasa de 1 critical/7 high/4 moderate a **1 high** (`braces`, sin parche, aceptado).
- Verificación local OK: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm test-headless` (131/131), `pnpm cypress:component` (14/14) y `pnpm build`.
- Falso positivo #228 corregido en el workflow; se cierra al mergear la PR consolidada.
- `main`: #232 se auto-mergeó; `#237` se rebasó sobre `main` para resolver el conflicto de `package.json`/`pnpm-lock.yaml` y se mergeó. #236 (Snyk) cerrada por quedar superseded.
- `braces` genera la issue #238 (detección real, ya no falso positivo). Decisión final: usar `pnpm audit --ignore-unfixable` en `security.yml` para no abrir issues por vulnerabilidades sin parche; se cierra #238.
