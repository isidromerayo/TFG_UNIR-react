# Plan: Corregir 6 incidencias de SonarQube (floating promises + autoFocus)

- **Fecha**: 2026-10-31
- **Herramienta/modelo**: opencode (opencode-go/qwen3.8-flash)
- **Rama / PR**: `fix/sonarqube-floating-promises`
- **Estado**: done

## Objetivos

Cerrar las 6 incidencias abiertas reportadas por SonarQube (5 de Reliability Medium por promesas
sin tratar + 1 de Maintainability Low/accessibility por `autoFocus`):

| # | Fichero | Línea | Regla | Situación antes del cambio |
|---|---------|-------|-------|---------------------------|
| 1 | `components/HeaderComponent.tsx` | 61 | *Promises must be awaited / .catch / `void`* | `fetchData()` ya tenía `try/catch/finally`: faltaba solo marcar la intención |
| 2 | `pages/acceso.tsx` | 54 | *Remove this `autoFocus` attribute* | `autoFocus` en el input de email |
| 3 | `pages/busqueda/[query].tsx` | 19 | Promises must be awaited… | `fetchData(query_string)` sin `catch`; además `setLoading(false)` se ejecutaba **antes** de resolver |
| 4 | `pages/categoria/[id].tsx` | 20 | Promises must be awaited… | `fetchData(data.id)` sin `catch`; si fallaba, `setLoading(false)` no llegaba a ejecutarse → spinner eterno |
| 5 | `pages/categorias.tsx` | 20 | Promises must be awaited… | `fetchData()` sin `catch`, acceso sin guarda a `.data._embedded.categorias` y mismo riesgo de spinner eterno |
| 6 | `pages/index.tsx` | 46 | Promises must be awaited… | `fetchData()` ya con `try/catch/finally`: faltaba solo marcar la intención |

Antecedente: `docs/plans/2026-10-03-fix-sonar-async-issues.md` dejó `pages/busqueda/[query].tsx:19`
como «candidato a incidencia futura». La incidencia ya está abierta, así que se ha abordado con el
`try/catch` que entonces se aplazó.

## Cambios ejecutados

### Código

- `components/HeaderComponent.tsx`: `fetchData();` → `void fetchData();`
- `pages/index.tsx`: `fetchData();` → `void fetchData();`
- `pages/acceso.tsx`: eliminado `autoFocus` del `<input type="email" id="inputEmail">`. La cadena
  `api.post(...).then(...).catch(...)` ya cumplía la regla de promesas y no se ha tocado.
- `pages/busqueda/[query].tsx`: `fetchData` con `try/catch/finally`; guarda
  `Array.isArray(result.data?._embedded?.cursos)`; `setLoading(false)` movido al `finally`
  (desaparece el `setLoading(false)` prematuro de la antigua L18); llamada marcada con `void`.
  Nuevos imports: `ApiError` desde `../../types` y `logger` desde `../../utils/logger`.
- `pages/categoria/[id].tsx`: mismo patrón (`try/catch/finally`, guarda sobre `_embedded`,
  `setLoading(false)` en el `finally`, `void fetchData(data.id)`). Se mantiene la lista de
  dependencias `[data.id, router.isReady]`, que no forma parte del reporte.
- `pages/categorias.tsx`: sustituida la doble expresión awaited
  `await (await api(...)).data._embedded.categorias` por `const response = await api(...)` + guarda,
  con `try/catch/finally` y `void fetchData()`.

### Tests

- `__tests__/pages/busqueda.spec.tsx`: pasa de probar solo `getServerSideProps` a renderizar el
  componente (mock de `utils/api` y `utils/logger`). Añadidos 4 casos: carga pendiente, éxito con
  `_embedded.cursos`, respuesta sin `_embedded`, y rechazo (afirma `logger.error` y el aviso de «sin
  resultados»).
- `__tests__/pages/categoria.spec.tsx`: conservados los 3 tests de `getServerSideProps` y añadidos 4
  de componente (carga, éxito, sin `_embedded`, rechazo con `logger.error`). Requiere
  `jest.mock('next/router')` devolviendo `{ isReady: true }`.
- `__tests__/pages/categorias.spec.tsx`: a los 2 tests existentes añadidos los casos de respuesta sin
  `_embedded` y de rechazo; el de éxito afirma ahora que `logger.error` no se invoca.

## Verificación ejecutada

| Paso | Resultado |
|---|---|
| `pnpm lint` | ✅ 0 errores (1 warning preexistente en `pages/_document.tsx`, `@next/next/no-title-in-document-head`) |
| `pnpm test-headless` | ✅ 25 suites / **143 tests** (antes 137) |
| Cobertura Jest | ✅ statements 95,23%, **branches 75,73%** (antes 68,71%), functions 97,11%, lines 95,53% (antes 90,92%) — por encima de los umbrales globales (63/45/59/63) |
| Cobertura de los ficheros tocados | `pages/categorias.tsx` 100/100/100/100 · `pages/categoria/[id].tsx` 100/100/100/100 · `pages/busqueda/[query].tsx` 100/92,85/100/100 (rama residual: `cursos === null`, preexistente) |
| `pnpm cypress:component` | ✅ 14/14 (`CoverageTest.cy.tsx` 1/1, `HeaderComponent.cy.tsx` 13/13) |
| `pnpm build` | ✅ 13 rutas, sin errores |

## Decisiones de diseño

- **`void` en lugar de `await`**: el callback de `useEffect` no puede ser `async`; `void` es el
  operador que recomienda la propia regla y ya se usaba en el repo (`pages/curso/[id].tsx:33`).
- **`void` + `try/catch` en lugar de `.catch()` encadenado**: el estilo dominante para efectos es la
  `fetchData` interna con `try/catch/finally`; se ha añadido donde faltaba para mantener coherencia.
- **Quitar `autoFocus` sin sustituto**: recuperarlo con `ref` + `useEffect` reproduciría el mismo
  secuestro de foco que denuncia Sonar. El formulario de acceso tiene un solo `<input>` visible antes
  del botón, así que el orden DOM ya lleva al usuario al campo.
- **`setLoading(false)` en el `finally`**: corrige dos defectos funcionales reales (parpadeo del
  bloque «sin resultados» en `/busqueda/...` y spinner infinito en `/categoria/[id]` y `/categorias`
  si la API fallaba), no solo el humo del análisis estático.
- **No se baja ningún umbral de cobertura ni se añaden exclusiones**: los `catch` nuevos se cubren
  con tests.
- **No se activa `@typescript-eslint/no-floating-promises` en ESLint**: `eslint.config.mjs` no usa
  type-aware linting y activarlo obligaría a reconfigurar el parser y destapar incidencias fuera de
  alcance. La detención la sigue haciendo SonarQube.

## Trabajo futuro detectado

- `next/router` tipa `push(...)` como `Promise<boolean>`, así que Sonar puede reportar en próximos
  análisis las llamadas flotantes de `components/HeaderComponent.tsx:76`, `pages/acceso.tsx:39`,
  `components/SliderComponent.tsx:15`, `pages/carrito.tsx:41/50` y `pages/registro.tsx:51`, además de
  varios `Swal.fire(...)`. Descartado en esta PR por alcance.
- `pages/categoria/[id].tsx:21` mantiene `router.isReady` en las dependencias del efecto con
  `getServerSideProps`: provoca una segunda petición al pasar de `false` a `true`. Candidato a
  limpieza aparte.
- `pages/categoria/[id].tsx:59` (`getServerSideProps`) no comprueba `res.ok` antes de `res.json()`.

## Ramificación

`fix/sonarqube-floating-promises` → PR a `main` con squash merge, commit en Conventional Commits.
