# Plan: Revisión de PRs abiertas y vulnerabilidades de seguridad

- **Fecha**: 2026-09-22
- **Herramienta/modelo**: opencode (deepseek-v4.1-flash)
- **Estado**: in progress

## Objetivos

1. Revisar las PRs abiertas y el estado de vulnerabilidades de seguridad del repositorio.
2. Resolver el bloqueo de las PRs de CodeQL (#223 y #225) que fallan por mezclar versiones de `github/codeql-action`.
3. Mergear por PR (squash) las PRs verdes y las de CodeQL una vez resueltas.

## Contexto

PRs abiertas (todas de Dependabot):

| # | Contenido | CI |
|---|-----------|-----|
| #221 | `SonarSource/sonarqube-scan-action` 8.2.1→8.2.2 | verde |
| #222 | `google/osv-scanner-action` 2.5.1→2.6.0 | verde |
| #223 | `codeql-action/init` 4.38.0→4.38.1 | falla |
| #224 | `next` 16.3.5, `react`/`react-dom` 19.3.0, `eslint-config-next`, `@types/node` | verde |
| #225 | `codeql-action/analyze` 4.38.0→4.38.1 | falla |

Causa del fallo de #223/#225: CodeQL exige que **todos** los pasos `github/codeql-action` usen la misma versión. Bumpear solo `init` (#223) o solo `analyze` (#225) produce:

```
#223: Loaded a configuration file for version '4.38.1', but running version '4.38.0'
#225: Loaded a configuration file for version '4.38.0', but running version '4.38.1'
```

## Estado de seguridad (2026-09-22)

- Dependabot alerts abiertas: **0**. CodeQL code-scanning abiertas: **0**. Issues `security` abiertas: **0**.
- Último workflow `Security Audit` en `main`: success.
- Overrides de `package.json` intactos; `sharp` en 0.35.4 y `qs` >= 6.16.0.

## Cambios

- `docs/plans/2026-09-22-revision-prs-seguridad.md` (este documento).
- Merge squash de #221, #222, #224.
- Merge secuencial de #223 y #225 (Opción B, aprobada por el usuario): primero `init`, luego `analyze`; se actualiza la rama de #225 para re-ejecutar CI y confirmar verde antes del segundo merge.

## Verificación

- `gh pr checks <n>` verde en cada PR antes de mergear.
- Tras el merge final, workflow `codeql.yml` en `main` con `Analyze (javascript-typescript)` success.
- `gh api .../dependabot/alerts?state=open` y `code-scanning/alerts?state=open` = 0.

## Decisiones de diseño

- Merge vía PR con squash (policy del repo; nunca push directo a `main`).
- Opción B elegida por el usuario frente a la Opción A (PR única) para #223/#225.
- Sin limpieza de ramas remotas en este plan (queda como tarea opcional).

## Resultado

_(pendiente)_
