# Plan: Fix PR #209 y vulnerabilidades abiertas

- **Fecha**: 2026-09-12
- **Herramienta/modelo**: opencode (claude)
- **Estado**: done

## Objetivos

1. Desbloquear el fix de `sharp` (PR #209 de Dependabot con CI rojo por `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`).
2. Cubrir la alerta GHSA-2883-xcg3-v3hh (`js-yaml` >=3.0.0 <3.15.2, high, dev) que no tenía PR.

## Cambios

- `package.json`:
  - override `js-yaml@>=3.0.0 <3.15.1: ^3.15.1` → `js-yaml@>=3.0.0 <3.15.2: ^3.15.2`
  - override `sharp: >=0.35.0` → `sharp: >=0.35.4` (fuerza versión parcheada del GHSA-rgj7-g3m4-5g8c / libheif)
- `pnpm-lock.yaml`: regenerado con `pnpm install --no-frozen-lockfile` (pnpm 10.29.3, node 22.19.0) para que `overrides` quede consistente y `--frozen-lockfile` vuelva a pasar en CI.

## Verificación

- `pnpm install --frozen-lockfile` — OK (causa raíz del fallo de #209)
- `pnpm lint` — OK
- `pnpm test-headless` — 25 suites / 131 tests OK, 91.85% líneas
- `pnpm cypress:component` — 14/14 OK
- `pnpm build` — OK
- Versiones resueltas: sharp 0.35.4, js-yaml 3.15.2

## Decisiones de diseño

- Un solo PR (aprobado por el usuario) en rama `fix/security-patched-versions`, merge squash; se cierra #209 al coincidir la versión en `main`.
- Se actualizan los overrides en lugar de solo el lockfile, siguiendo el patrón de `fix(security)` previo (#204).
