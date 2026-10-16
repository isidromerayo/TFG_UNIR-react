# Plan: advisories aceptados + revisión automática de parche

- **Fecha**: 2026-10-16
- **Herramienta/modelo**: opencode (deepseek-v4.1-flash)
- **Estado**: done (rama `chore/accepted-advisories-rule`, PR abierta)

## Objetivos

1. Fijar la regla: un advisory **sólo** se acepta si no hay versión parcheada publicada.
2. Registrar de forma única qué advisories están aceptados, con motivo, alcance y ruta.
3. Revisarlo en cada iteración de forma automática: fallar en cuanto exista solución.

## Contexto

Hasta ahora la aceptación vivía repartida: `pnpm.auditConfig.ignoreCves` en `package.json`, la lista
`ACCEPTED` de `.github/workflows/security.yml`, dismissals en Dependabot y notas en
`SECURITY_AUDIT_ANALYSIS.md` / `docs/plans/`. Nada avisaba cuando el upstream publicaba un parche,
así que el silencio podía quedarse "para siempre".

## Cambios

- `docs/security/accepted-advisories.md`: registro (bloque `json accepted-advisories`) + regla +
  checklist de aceptación y de revisión.
- `scripts/check-accepted-advisories.sh`: consulta OSV (`/v1/vulns/{id}` y `/v1/query`) por cada
  entrada y falla si hay un evento `fixed` publicado para nuestro paquete/ecosistema, o si el
  advisory ya no aplica a la versión registrada (registro obsoleto).
- `package.json`: script `security:accepted`.
- `.github/workflows/security.yml`: paso *Accepted advisories recheck (unpatched only)*.
- `AGENTS.md`: regla en *Quirks* + entrada en *Docs*.
- `docs/security/pnpm-audit-unfixable-cves.md`: apunta al registro como fuente de verdad.

## Decisiones de diseño

- **Chequeo contra OSV** (no contra `pnpm audit`): `pnpm` omite del JSON los CVE ignorados vía
  `ignoreCves`, y el GitHub Advisory DB puede ir por detrás. OSV es la fuente que ya usa el
  `osv-scanner` del propio workflow y expone `fixed` por paquete/ecosistema.
- **Sólo cuentan los `fixed` de nuestro paquete/ecosistema**: el fix de `sprintf-js` es un commit
  sin release en npm, así que el advisory sigue siendo "sin parche" y no debe fallar el chequeo.
- Si OSV no responde (sin red), el script avisa y sale 0 para no bloquear PRs por una caída externa.

## Verificación

- `./scripts/check-accepted-advisories.sh` → ✅ con el registro real (2 advisories, ambos sin parche).
- Caso negativo: registry de prueba con `lodash@4.17.10` (`GHSA-jf85-cpcp-j695`) → ❌ *YA HAY PARCHE
  publicado → 4.17.12* y exit code 1.
- Registro aceptado actual: `braces@3.0.3` (`GHSA-vfj7-8cjw-p6xm`) y `sprintf-js@1.0.3`
  (`GHSA-hp3w-g68c-fv3c`).
