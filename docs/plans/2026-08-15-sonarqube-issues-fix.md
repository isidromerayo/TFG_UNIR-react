# Plan: Corrección de issues de SonarQube

- **Fecha:** 2026-08-15
- **Herramienta/modelo:** opencode / big-pickle
- **Estado:** done (verificado: lint OK, 126/126 Jest, 14/14 Cypress, build OK)

## Objetivos

Resolver todos los code smells reportados por SonarQube en el frontend React (Next.js).

## Cambios de archivos

| Archivo | Línea | Issue | Solución |
| --- | --- | --- | --- |
| `components/HeaderComponent.tsx` | 82 | Fragment con un solo hijo | Eliminar el fragment `<>...</>` redundante |
| `components/SliderComponent.tsx` | 2, 10 | `FormEvent` deprecado en React 19 | Usar `SubmitEvent` (tipo no deprecado para `onSubmit`) |
| `pages/404.tsx` | 6 | Fragment con un solo hijo | Eliminar el fragment redundante |
| `pages/acceso.tsx` | 48 | Fragment con un solo hijo | Eliminar el fragment redundante |
| `pages/carrito.tsx` | 32 | Condición negada inesperada | Invertir la lógica `if (!getToken())` a `if (getToken())` con bloques intercambiados |
| `pages/registro.tsx` | 3 | Import sin especificadores (`import React, { }`) | Eliminar el import vacío (JSX transform automático) |
| `pages/valoracion/[id].tsx` | 55 | Aserción innecesaria (`id as string`) | Quitar la aserción (ya es `string` tras el guard) |
| `services/session.ts` | 6, 12, 19, 25, 31 | Preferir `globalThis.window` sobre `window` | Reemplazar `typeof window` por `typeof globalThis.window` |

## Verificación

1. `pnpm lint`
2. `pnpm test-headless`
3. `pnpm cypress:component`
4. `pnpm build`

## Decisiones de diseño

- **`SubmitEvent` en SliderComponent:** React 19 deprecia `FormEvent`/`FormEventHandler`. El prop `onSubmit` de `@types/react` 19 usa `SubmitEventHandler`, cuyo tipo de evento `SubmitEvent` no está deprecado y mantiene `target: EventTarget & HTMLFormElement`.
- **`globalThis.window`:** requiere ES2020, ya disponible en el tsconfig del proyecto.
- Los tests existentes no dependen de los internals cambiados (fragments, tipos), salvo `session.ts` que se verifica con la suite completa.

## Estado

- [x] planned
- [x] in progress
- [x] done
