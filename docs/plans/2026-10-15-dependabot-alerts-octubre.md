# Plan: Corrección de alertas Dependabot (octubre 2026)

- **Fecha**: 2026-10-15
- **Herramienta/modelo**: opencode (deepseek-v4.1-flash)
- **Estado**: done

## Objetivos

1. Resolver las 5 alertas Dependabot abiertas en el repositorio mediante overrides de `pnpm`.
2. Dismissar con justificación documentada la única alerta sin parche upstream (`sprintf-js`).
3. Dejar `pnpm audit` limpio antes de seguir con la alineación de Cypress y de workflows entre frontends.

## Contexto

Estado a 2026-10-15 (`gh api .../dependabot/alerts`) — 5 alertas abiertas, todas en `pnpm-lock.yaml`, confirmadas por `pnpm audit`:

| Alerta | Paquete | Sev. | Instalada | Parcheada | Vía | Alcance |
|--------|---------|------|-----------|-----------|-----|---------|
| #154 | handlebars | critical | 4.7.9 | 4.7.10 | `ts-jest` | dev |
| #155 | handlebars | moderate | 4.7.9 | 4.7.10 | `ts-jest` | dev |
| #150 | source-map-js | high | 1.2.1 | 1.2.2 | `next` / `@cypress/code-coverage` → `postcss` | runtime |
| #152 | sharp | high | 0.35.4 | 0.35.5 | `next` | runtime |
| #151 | sprintf-js | moderate | 1.0.3 | **sin parche** | `js-yaml` → `argparse` | dev |

Notas:

- `handlebars` arrastra además un tercer advisory crítico (`GHSA-p8wg-vrv2-v86f`, "Own Property Check Bypass") que todavía no aparece en Dependabot pero sí en `pnpm audit`; se corrige con el mismo bump a 4.7.10.
- `sprintf-js` (`CVE-2026-97058`): todas las versiones publicadas (`<= 1.1.3`) son vulnerables; 1.1.3 es la última. Dev-only (formateo de errores de `argparse`), entrada no controlada por atacante.
- Code scanning: 0 alertas abiertas. Secret scanning: 0 alertas. No requieren acción.
- Fuera de alcance por decisión del usuario: `@cypress/react` 9→10 (PR #244, requiere alineación de Cypress entre React/Angular/Vue3) y los bumps de GitHub Actions (#246, #250, requieren alineación de workflows entre los tres frontends).

## Cambios

- `package.json` → `pnpm.overrides`:
  - `handlebars`: `^4.7.9` → `^4.7.10`.
  - `sharp`: `>=0.35.4` → `>=0.35.5`.
  - Nuevo `source-map-js@<1.2.2`: `^1.2.2`.
- `package.json` → `pnpm.auditConfig.ignoreCves`: añadir `CVE-2026-97058` (mismo criterio que `CVE-2026-93687` de `braces` en #241). Lo escribe `pnpm audit --ignore-unfixable` al ejecutarlo, y se mantiene de forma explícita.
- `pnpm-lock.yaml`: regenerado con `pnpm install --no-frozen-lockfile`.
- `docs/plans/2026-10-15-dependabot-alerts-octubre.md` (este documento).

## Verificación

- `pnpm install --frozen-lockfile` (el lockfile regenerado no debe provocar `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`).
- `pnpm audit` → sin vulnerabilidades.
- `pnpm lint && pnpm test-headless && pnpm cypress:component && pnpm build`.
- Post-merge: alertas #150, #152, #154 y #155 cerradas automáticamente; quedan solo #149 (`braces`) y #151 (`sprintf-js`), ambas dismissadas y justificadas.
- Alerta #151: `gh api -X PATCH .../dependabot/alerts/151 -f state=dismissed -f dismissed_reason=tolerable_risk`.

## Decisiones de diseño

- Todo por rama + PR con squash (política del repo; nunca push directo a `main`).
- Overrides en lugar de bumps directos: los cuatro paquetes afectados son transitivos, Dependabot no puede actualizarlos.
- `sprintf-js`: riesgo residual aceptado (dev-only, sin parche upstream), documentado y dismissado; mismo tratamiento que `braces`.
- No se toca Cypress ni los workflows: quedan pendientes de alineación entre los tres frontends.

## Resultado

- `package.json`: `handlebars ^4.7.10`, `sharp >=0.35.5`, nuevo override `source-map-js@<1.2.2 → ^1.2.2`, y `CVE-2026-97058` añadido a `auditConfig.ignoreCves`.
- `pnpm-lock.yaml` regenerado: `handlebars` 4.7.9→4.7.10, `sharp` 0.35.4→0.35.5 (con todos los `@img/sharp-*` y `@img/sharp-libvips-*` 1.3.3→1.3.4), `source-map-js` 1.2.1→1.2.2.
- Verificación local OK:
  - `pnpm install --frozen-lockfile` → OK (sin `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`).
  - `pnpm audit` → exit 0; solo quedan `braces` (high) y `sprintf-js` (moderate), ambos ignorados vía `auditConfig.ignoreCves`.
  - `pnpm lint` → OK.
  - `pnpm test-headless` → 131/131 (25 suites).
  - `pnpm cypress:component` → 14/14.
  - `pnpm build` → OK.
- Alerta #151 dismissada como `tolerable_risk`.
- Pendiente (fuera de este PR): PR #244 (`@cypress/react` 9→10) y #246/#250 (GitHub Actions), a la espera de la alineación de Cypress y workflows entre React, Angular y Vue3.
