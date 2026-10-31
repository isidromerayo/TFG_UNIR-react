# Unificación del stack pa11y (ci 5 + reporter 9) + docs + job a11y.yml

- **Fecha**: 2026-10-31
- **Herramienta/modelo**: OpenCode · Qwen3.8 Flash
- **Estado**: in progress

## Contexto

Dependabot abrió en este repo las PRs #260 (`pa11y-ci` 4.1.1→5.0.0) y #267
(`pa11y-ci-reporter-html` 8.1.1→9.0.0). Son dos mitades del mismo upgrade mayor:
el reporter 9 requiere `pa11y-ci` 5 (propiedad `supports`), y ninguna de las dos
combinaciones mixtas está cubierta por CI (ningún workflow de PR ejecuta pa11y).
Angular ya tenía `pa11y-ci@5` desde el 2026-10-15 (PR #276) con `reporter 8.1.1`
funcionando — evidencia empírica del combo intermedio.

**Decisión del usuario**: cerrar las PRs de Dependabot y aplicar ambos bumps en una
sola rama propia, incluyendo la documentación de pa11y y un job CI `a11y.yml`
informativo en la misma PR.

## Objetivos

1. `pa11y@10` + `pa11y-ci@5` + `pa11y-ci-reporter-html@9` lockados y verificados con `pnpm a11y` real.
2. Documentación: sección a11y en README, guía completa en `docs/accessibility.md`, política de upgrade en AGENTS.md.
3. Job `a11y.yml`: semanal + dispatch, backend + imagen de BD del proyecto en contenedor (PoC: BD sin datos semilla hasta publicar imagen poblada), artifact de informes, sin gate de merge.
4. Cerrar #260 y #267 referenciando esta PR.

## Cambios

| Archivo | Cambio |
|---|---|
| `package.json` + `pnpm-lock.yaml` | `pnpm up 'pa11y-ci@^5.0.0' 'pa11y-ci-reporter-html@^9.0.0'` |
| `.github/workflows/a11y.yml` | Nuevo: schedule lunes 03:00 UTC + `workflow_dispatch`; imagen `isidromerayo/postgres-tfg:1.1` (BD vacía — PoC) + backend `isidromerayo/spring-backend-tfg:0.7.1` (host network), `pnpm dev`, `pnpm a11y` con `continue-on-error`, resumen `jq` en Step Summary, artifact `a11y-reports` 14 días. Actions pinneadas por SHA de 40 chars. |
| `ci/a11y/seed-postgres/01..03-create.sql` | Nuevo: fixture de schema+datos copiado de `recursos/db/postgresql/` (origen canónico local), con cabecera de procedencia |
| `README.md` | Sección «♿ a11y: Auditoría de accesibilidad (pa11y)» + enlace en Documentación |
| `AGENTS.md` | CI/CD: `a11y.yml`; Gotchas: stack pa11y unificado, `supports` no validado, política de upgrade |
| `docs/accessibility.md` | Nuevo: referencia completa (cadena de dependencias, config `.pa11yci`, job CI, política de upgrade, historial) |

## Decisiones de diseño

- Un solo PR: evita el conflicto de lockfile entre #260 y #267 y deja el repo en el
  estado coherente final (5+9) de una vez.
- Seed **no** vendorizado (revisado el mismo día): el job arranca la imagen `postgres-tfg`
  con BD vacía — **PoC** a la espera de publicar una imagen de BD que se pueble en su propia
  creación; entonces el job pasa a auditar con datos reales sin más cambios. El audit completo
  con datos se verificó localmente en esta PR (podman-pod + `recursos/db`, 8/8).
- `a11y.yml` informativo: `continue-on-error` en el audit; el job solo se pone rojo si
  la infra no levanta o si no se genera `report.json` (toolchain roto), no si hay
  issues WCAG. Sin permisos `issues: write` ni `pull-requests: write`.
- Imagen del backend fijada a `0.7.1` (la del `docker-compose.yml` actual del backend).

## Verificación realizada

- `pnpm install --frozen-lockfile` ✅ (overrides de seguridad intactos en el diff del lock).
- `pnpm a11y` real (pa11y-ci 5 + reporter 9) contra dev server :3000 + backend podman :8080
  con seed: **8/8 URLs, 0 errors**, `reports/a11y/` con index.html + 8 HTML + report.json ✅.
- `pnpm lint` ✅ (1 warning preexistente: `<title>` en `_document.tsx`).
- `pnpm test-headless` ✅ 25 suites / 131 tests.
- `pnpm cypress:component` ✅ 14/14.
- `pnpm build` ✅.
- `a11y.yml`: YAML válido, comando `jq` del resumen probado contra el `report.json` real.

## Pendiente al cerrar

- [ ] Primera corrida `workflow_dispatch` de `a11y.yml` tras el merge.
- [ ] Cerrar PRs #260 y #267 con referencia a esta PR.
- [ ] Actualizar submodule `react/` del monorepo.
