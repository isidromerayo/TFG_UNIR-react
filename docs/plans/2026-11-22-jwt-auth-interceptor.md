# 2026-11-22 — JWT en la cabecera Authorization + mapeo 401/403/429

**Fecha:** 2026-11-22
**Herramienta / modelo:** OpenCode (Qwen3.8 Flash)
**Origen:** `TFG_UNIR-backend/docs/security/plan-impacto-frontends-2026-11-10.md` §4.3 y el
incidente del alta en producción (contrato de contraseña ya cubierto en #295/#303).

## Estado

**done** (rama `fix/auth-token-interceptor`, PR #297). La parte de contraseña (min 8 / max 72
con fuente única `utils/passwordPolicy.ts`) ya estaba en `main`.

## Qué fallaba

El backend devolvía el JWT **solo en el cuerpo** de `POST /api/auth` (`AuthResponse`) y exigía
`Authorization: Bearer` en toda ruta no pública. Este frontend nunca enviaba la cabecera:
`mis-cursos` fallaba con 401 aunque el usuario estuviera logueado.

## Cambios

| Archivo | Cambio |
|---------|--------|
| `utils/api.ts` | Request interceptor: añade `Authorization: Bearer <token>` (`getToken()` de `services/session`) salvo POST `/auth`, POST `/usuarios` y GETs de catálogo público (`/categorias`, `/cursos`, `/valoraciones`) — evita preflights CORS inútiles —, sin token o con el legado `'undefined'`. Response interceptor de sesión: 401 → limpiar sesión + SweetAlert + `/acceso`; 403 → aviso sin logout; el 401/403 del login se delega a la página (sin alertas duplicadas). |
| `utils/api-error.ts` (nuevo) | `retryAfterSeconds()`/`authErrorMessage()`: espejo del util de Angular (mapeo compartido de errores, P1 del plan de CI 2026-11-20). |
| `pages/acceso.tsx` | Mensajes específicos 401/403/429 (con `Retry-After`) en lugar del genérico. |
| `pages/mis-cursos.tsx` | El fetch ya no gestiona cabeceras manuales. |
| tests | `__tests__/utils/api.spec.ts` (+8), `__tests__/utils/api-error.spec.ts` (nuevo, 9), `__tests__/pages/acceso.spec.tsx` (+4), `__tests__/pages/mis-cursos.spec.tsx` (+1 assert). |

## Decisión de diseño

La redirección de sesión pasa por una costurilla exportada `sesionFallback.redirigirAAcceso()`
(`window.location.assign('/acceso')`, protegida para SSR): jsdom 26 define `window.location`
no configurable y no se puede espiar sin ella.

## Verificación

- `pnpm lint` → 0 errores (1 warning preexistente).
- `pnpm test-headless` → 173/173 (27 suites; cobertura Br 78.9%, sube desde 75.6%).
- `pnpm cypress:component` → 14/14. `pnpm build` → OK.
- `pnpm-lock.yaml`/`pnpm-workspace.yaml`/`package.json` intactos.
