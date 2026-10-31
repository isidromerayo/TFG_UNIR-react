# 2026-10-31 — Revisión de axios en React (unificación de instancia + bump 1.21.0)

**Fecha:** 2026-10-31
**Herramienta / modelo:** OpenCode (GLM-5.3-Flash)

## Objetivo

1. Subir axios de `1.20.0` (lockfile) a `1.21.0` (última publicada, 23-oct-2026).
2. Unificar el acceso HTTP: 6 páginas usaban axios raw saltándose la instancia
   `utils/api.ts` (sin timeout ni interceptors) mientras `mis-cursos.tsx` y
   `HeaderComponent.tsx` sí la usaban.
3. Corregir la política de reintentos: el interceptor reintentaba **todos** los
   errores hasta 3 veces, incluidos 4xx (400/401) en peticiones no idempotentes
   (`POST /auth`, `POST /usuarios`).
4. Preservar estructura del error (response/status/code) en el interceptor de
   errores: antes hacía `throw new Error(msg)` y perdía `status`, dejando a las
   páginas sin poder distinguir 401 de 500.

## Cambios

| Archivo | Cambio |
|---------|--------|
| `package.json` | `axios ^1.20.0` → `^1.21.0`; overrides intactos (30), axios no estaba en overrides/auditConfig |
| `pnpm-lock.yaml` | resuelto a 1.21.0 |
| `utils/api.ts` | Retry solo con métodos idempotentes (get/head/options) y errores transitorios (sin respuesta/red, 429, 5xx); nunca en cancelaciones ni 4xx. Backoff incremental 0.5/1/1.5 s (`retryDelay: 500`). El interceptor de errores enriquece `error.message` y devuelve `Promise.reject(error)` original (conserva `response`, `status`, `code`). `??` en defaults y callback tipado (`AxiosError`) para el gate de Codacy. |
| `pages/index.tsx` | `axios.get` → `api.get` (3 llamadas) |
| `pages/categorias.tsx` | `axios(...)` → `api(...)` |
| `pages/categoria/[id].tsx` | `axios(...)` → `api(...)` |
| `pages/busqueda/[query].tsx` | `axios(...)` → `api(...)` |
| `pages/acceso.tsx` | `axios.post` → `api.post` |
| `pages/registro.tsx` | `axios.post` → `api.post`; headers duplicados eliminados (la instancia ya los define) |
| `__tests__/pages/{index,categorias,registro}.spec.tsx` | Mock de axios raw → mock de `utils/api` (patrón de `mis-cursos.spec.tsx`) |
| `__tests__/pages/acceso.spec.tsx` | Reemplazado el hack de `XMLHttpRequest` por mocks de la instancia; +1 test nuevo de camino de error (Swal + no navegación). Los handles de los mocks se obtienen vía `jest.requireMock` tipado (evita `unbound-method`/`no-unsafe-member-access` de Codacy) |
| `cypress.config.ts` | `e2e.defaultCommandTimeout: 8000` — el fallback de lỗi tarda ~1.5 s con el retry cuando no hay backend (CI), antes del aumento el test `app.cy.js` agotaba el default de 4 s |

## Silencios / overrides

- axios no aparece en `pnpm.auditConfig` ni `pnpm.overrides`; no hay silencios que retirar.

## Verificación

- `pnpm install --frozen-lockfile` → OK tras el bump.
- `pnpm lint` → 0 errores (1 warning previo de `_document.tsx`, no relacionado).
- `pnpm test-headless` → 25 suites / **133 tests** pasando (antes 131; +2 por coverage del error en acceso); cobertura con thresholds exigidos al completo.
- `pnpm cypress:component` → 14/14.
- `pnpm build` → OK.
- `pnpm audit --prod` → sin vulnerabilidades.

## Decisiones de diseño

- Breaking change de axios 1.21.0 (reconocimiento de header defaults) **no afecta**: la
  instancia pasa un plain object literal y nadie usa clases custom como defaults.
- `getServerSideProps` (lado servidor/Node) sigue con `fetch`: la instancia está pensada
  para el navegador y no hay necesidad de exponerla al runtime del servidor.
- Los errores del interceptor ahora re-lanzan el objeto original
  (con `message` enriquecido) en vez de un `new Error`: los tests de
  `__tests__/utils/api.spec.ts` seguían pasando sin cambios (mensajes de error por
  `error.message`) y las páginas pueden seguir leyendo `response.data.message` (registro)
  o `code === 'ECONNABORTED'`.
- Backoff 0.5/1/1.5 s (antes 1/2/3/6 s): el E2E `app.cy.js` corría contra un dev server
  sin backend; con el fallen instantáneo el fallback arrivaba < 4 s, pero el reintentado
  a 1/2/3 s lo empujaba fuera del `defaultCommandTimeout` de Cypress. Se corrige por
  ambos lados (backoff más corto + timeout 8 s) — mejor UX igualmente (error en ~1.5 s).

## Estado

- **Planned** → ejecutado y verificado en la iteración 2026-10-31; ajustes de 2ª ronda
  (backoff, timeout E2E y hallazgos de Codacy) incorporados en commits posteriores.
- PR: `fix/api-unify-axios-instance` (branch) → PR a `main` vía squash merge.
