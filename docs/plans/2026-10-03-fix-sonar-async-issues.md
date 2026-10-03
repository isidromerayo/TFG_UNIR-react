# Plan: Corregir 3 incidencias de SonarQube (async/promises)

- **Fecha**: 2026-10-03
- **Herramienta/modelo**: opencode (qwen3.8-flash)
- **Estado**: done

## Objetivos

Resolver las 3 incidencias abiertas detectadas por SonarQube (~15min esfuerzo total):

1. `pages/curso/[id].tsx:33` — *Promises must be awaited, end with .catch, or be marked as ignored with `void`* (Reliability, Medium).
2. `components/SliderComponent.tsx:10` — *Async function 'buscarCursos' has no 'await' expression* (Reliability Low / Maintainability Medium).
3. `pages/busqueda/[query].tsx:52` — *Async function 'getServerSideProps' has no 'await' expression* (Reliability Low / Maintainability Medium).

## Cambios

- `pages/curso/[id].tsx`: `fetchData();` → `void fetchData();` (el fetch interno ya tiene try/catch, no hay riesgo de rejection sin tratar; `void` marca intención ante la regla).
- `components/SliderComponent.tsx`: quitar `async` de `buscarCursos` (no consume `push` como Promise; el handler de `onSubmit` funciona igual en sincrónico).
- `pages/busqueda/[query].tsx`: quitar `async` de `getServerSideProps` (Next.js Pages Router acepta funciones no-async; los tests hacen `await` sobre el resultado, que funciona igual con retorno llano).

## Verificación

Tests existentes que cubren cada cambio (no hacen falta tests nuevos):

| Cambio | Test |
|---|---|
| `curso/[id].tsx` | `__tests__/pages/curso.spec.tsx` (loading, no-encontrado, render, carrito) |
| `SliderComponent.tsx` | `__tests__/component/SliderComponent.spec.tsx` (submit → push, espacios, vacío) |
| `busqueda/[query].tsx` | `__tests__/pages/busqueda.spec.tsx` (getServerSideProps: notFound/props) |

Flujo pre-commit obligatorio:

1. `pnpm lint`
2. `pnpm test-headless`
3. `pnpm cypress:component`
4. `pnpm build`

## Decisiones de diseño

- `void` en vez de `.catch()` en `fetchData()`: los errores ya se registran con `logger.error` dentro de la propia función; añadir otro catch sería redundante.
- Se descartó envolver `fetchData(query_string)` (línea 19 de `busqueda/[query].tsx`) en try/catch: no está detectado por SonarQube y se mantiene el cambio mínimo de esta PR (candidato a incidencia futura).

## Ramificación

`fix/sonar-async-issues` → PR a `main` (squash), según política de ramas.
