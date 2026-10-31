# Plan: Revisión de PR abiertas — cierre de PR obsoletas y bumps manuales

- **Fecha**: 2026-10-31
- **Herramienta/modelo**: opencode (opencode-go/qwen3.8-flash)
- **Estado**: done

## Objetivo

Revisar las PR abiertas del repo (react) y dejar la lista vacía sin fusionar nada que no deba
fusionarse. Resultado: 3 PR abiertas → 0 (una fusionada, dos Dependabot aplicadas a mano y una
superada cerrada).

## Revisión

| PR | Autor | Estado | Veredicto |
|---|---|---|---|
| #266 · `@hookform/resolvers` 5.9.1 → 6.0.0 | dependabot | MERGEABLE/CLEAN, checks verdes | **No fusionar**: la rama parte de un `main` viejo (`axios: ^1.20.0` frente a `^1.21.0` actual) y su lockfile resuelve **`follow-redirects@1.16.1`**, por debajo del override `>=1.16.2` → reintroduciría **CVE-2026-116689 / GHSA-mrwp-f3q8-3g9p** (credenciales que siguen redirects cross-realm). Además `@hookform/resolvers` ya iba por 7.0.0 (publicado el 31/10) |
| #244 · `@cypress/react` 9.0.2 → 10.0.1 | dependabot | MERGEABLE/CLEAN, checks verdes | **No fusionar**: la dependencia **no se importa en ningún sitio**; `cypress/support/component.ts` usa `import { mount } from 'cypress/react'`, subpath del propio paquete `cypress`. La v10 rompe `Cypress.env()`, el override `env` por test y `allowCypressEnv` |
| #255 · mover eslint/eslint-config-next a devDependencies | propia | CONFLICTING | **Superada** por la #270 ya mergeada: `main` ya tiene eslint en `devDependencies`. Además toca `AGENTS.md`, reescrito después en la #276 |

Causa raíz común de #266 y #244: las PR de Dependabot arrastran lockfiles generados sobre bases
antiguas (600+ líneas de diferencia frente a `main`), que es exactamente el gotcha ya documentado
en `AGENTS.md`: **los bumps se aplican a mano sobre `main`** y después se cierra la PR del bot.

## Cambios (rama `chore/deps-refresh-resolvers-cypress-react`)

- `pnpm remove @cypress/react` → desaparece de `devDependencies` y del lockfile.
- `pnpm up @hookform/resolvers@6.0.2` → sube a la major estable (6.0.0, del 19/10) en lugar de la
  7.0.0 publicada el mismo día, y se queda en **6.0.2**, el último parche de la línea 6.x (6.0.1 y
  6.0.2 son correcciones de bug del 27 y 28/10). Los breaking changes de la v6 están **limitados al
  resolver `effect-ts`** (exige `effect@^4`), así que el `yupResolver` no se ve afectado. Peers de v6
  (`yup ^1.0.0`, `react-hook-form ^7.55.0`) satisfied; el `yupResolver` está ejercitado por los 11
  tests de `__tests__/pages/registro.spec.tsx`, que renderizan el componente real sin mockear
  `react-hook-form` y comprueban los mensajes de validación (`'nombre is a required field'`).
- `cypress/component/README.md`: se corrige la referencia obsoleta a `@cypress/react` (los tests
  montan con el subpath `cypress/react` que ya trae el propio paquete `cypress`).
- Diff resultante: **48 líneas de lockfile** (frente a las ~630 que traían las PR del bot).

## Verificación

| Comprobación | Resultado |
|---|---|
| `pnpm install --frozen-lockfile` | ✅ «Lockfile is up to date» (es el gate que rompía en CI) |
| `follow-redirects` resuelto | ✅ **1.16.2** (nunca 1.16.1) |
| Overrides | ✅ 30 en `package.json` y presentes en el lockfile |
| `pnpm lint` | ✅ 0 errores (1 warning preexistente en `_document.tsx`) |
| `pnpm test-headless` | ✅ 25 suites / 143 tests · branches 75,59% · lines 95,53% |
| `pnpm cypress:component` | ✅ 14/14 — confirma que `cypress/react` (subpath) sigue funcionando sin `@cypress/react` |
| `pnpm build` | ✅ 13 rutas |

## PR cerradas

- **#266** → el bump se aplicó a mano sobre `main`; su lockfile fijaba `follow-redirects@1.16.1`
  (CVE-2026-116689) y partía de `axios ^1.20.0`.
- **#244** → dependencia no usada, eliminada del árbol.
- **#255** → superada por la #270.
