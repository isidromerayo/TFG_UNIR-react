# Plan: Alertas de Dependabot y auditoría de dependencias (react)

- **Fecha**: 2026-10-31
- **Herramienta/modelo**: opencode (opencode-go/minimax-m3.1-flash)
- **Rama**: `security/dependabot-alerts-2026-10`
- **Estado**: done

## Objetivo

Cerrar las 7 alertas abiertas de Dependabot del repo y, de paso, las que `pnpm audit` detecta pero
Dependabot todavía no había abierto. Regla aplicada: **un advisory con parche se corrige con
`pnpm.overrides`; uno sin parche se acepta, se registra y se re-revisa en cada iteración**
(`docs/security/accepted-advisories.md`).

## Diagnóstico

| Alerta | Paquete | Ruta en el árbol | Versión instalada | Arreglo |
|---|---|---|---|---|
| #166 · #164 · #165 | `systeminformation` | `.>cypress>systeminformation` | 5.33.1 | override `>=5.33.16` (fixes CVE-2026-116576, -116673 y -116674) |
| #162 | `qs` | `.>cypress>@cypress/request>qs` | 6.16.0 | override `>=6.16.1` (fixes CVE-2026-110816) |
| #163 | `deepmerge` | `.>jest>@jest/core>jest-config>deepmerge` | 4.3.1 | **sin parche upstream** → aceptado y registrado |
| #156 · #157 | `extract-zip` | — | **no está en el árbol** | alertas residuales de un lockfile antiguo → se descartan |

Además, `pnpm audit` reportaba tres advisories más que Dependabot aún no había abierto:

| Paquete | Ruta | Versión | Arreglo |
|---|---|---|---|
| `zod` | `.>pa11y>puppeteer>chromium-bidi>zod` | 4.6.5 | override `>=4.6.6` |
| `minimatch` | `.>eslint>minimatch`, `.>babel-plugin-istanbul>test-exclude>…` | 9.0.9 / 10.2.6 | override `>=11.0.1` (fixes CVE-2026-118764) |
| `glob` | `.>babel-plugin-istanbul>test-exclude>glob`, `.>jest>@jest/core>@jest/reporters>glob` | 10.5.0 / 13.0.6 | override `glob@>=9.0.0 <14.0.2` → `^14.0.3` (fixes CVE-2026-118773) |

## El problema de `minimatch` (y por qué hizo falta tocar `globby`)

CVE-2026-118764 afecta a **todas** las versiones de `minimatch` `< 11.0.1`, así que el override tiene
que cubrir también las ramas antiguas. Pero el árbol contenía `minimatch@3.1.5` bajo `glob@7.2.3`,
y **glob 7 es incompatible con minimatch 11**: usa `minimatch.Minimatch` esperando el `globSet` de
la v3, y con la v11 lanza `TypeError: Cannot read properties of undefined (reading 'charAt')`.

Un smoke test de esa ruta lo detectó antes de commitear:

```
glob.js:386  var dotOk = this.dot || rawGlob.charAt(0)
TypeError: Cannot read properties of undefined (reading 'charAt')
```

La rama deprecated venía de `globby@7.1.1 ← pa11y-ci@5.0.0`, y `globby 7` usa la **API de callback**
de `glob` (`pify(glob)`), que glob 14 ya no ofrece. Solución: subir `globby` a `11.1.0` (CJS, con
`.sync`, que es lo que usa `pa11y-ci`: `globby.sync(args, { nonull: true })`) → desaparecen
`glob@7.2.3`, `minimatch@3.1.5` e `inflight@1.0.6` del árbol, y el override global de `minimatch`
a `>=11.0.1` queda seguro.

Verificación de compatibilidad hecha antes de aplicar nada:

- Todos los consumidores de `minimatch` en el árbol usan `minimatch.Minimatch` (acceso por
  propiedad): `glob 7`, `glob 13`, `eslint` (`@eslint/config-array`), `test-exclude`. La v11
  mantiene ese export ✓
- `glob 14` sigue exportando `glob`, `globSync`, `hasMagic`… y los consumidores modernos
  (`nyc`, `rimraf 6`, `test-exclude 7/8`) usan `const { glob } = require('glob')` (API de promesas) ✓
- `glob 7.2.3` queda fuera del rango vulnerable de CVE-2026-118773 (`>=9.0.0`) ✓

## Cambios

### `package.json`

```json
"pnpm": {
  "overrides": {
    "qs": ">=6.16.1",
    "systeminformation": ">=5.33.16",
    "zod": ">=4.6.6",
    "minimatch": ">=11.0.1",
    "globby": "^11.1.0",
    "glob@>=9.0.0 <14.0.2": "^14.0.3"
  },
  "auditConfig": { "ignoreCves": ["CVE-2026-93753"] }
}
```

Los dos overrides por rango de `minimatch` (`minimatch@<3.1.3` y `minimatch@>=9.0.0 <9.0.7`) se
sustituyen por el global `>=11.0.1`: el advisory actual cubre todas las versiones anteriores, y los
rangos antiguos ya no tienen sentido.

### `docs/security/accepted-advisories.md`

Registro de `CVE-2026-93753` (`deepmerge@4.3.1`, dev-only vía `jest/jest-config`): la última
versión publicada (4.3.1, de 2023) sigue siendo vulnerable, `patched <0.0.0`, y `mergeObject()`
solo se usa con la configuración local del runner de tests, sin entrada controlada por atacante.
`pnpm auditConfig.ignoreCves` lo silencia de forma quirúrgica (un CVE concreto, no un
`--ignore-unfixable` global).

## Verificación

| Comprobación | Resultado |
|---|---|
| `pnpm audit` | ✅ exit 0 — «1 vulnerabilities found · 1 low (1 ignored)» (solo el advisory aceptado) |
| `pnpm audit --prod` | ✅ «No known vulnerabilities found» |
| `pnpm security:accepted` | ✅ OSV confirma que `CVE-2026-93753` sigue sin parche |
| `pnpm install --frozen-lockfile` | ✅ «Lockfile is up to date» |
| Smoke test ruta pa11y (`globby.sync`) | ✅ 2 ficheros listados |
| `pnpm lint` | ✅ 0 errores (1 warning preexistente en `_document.tsx`) |
| `pnpm test-headless` | ✅ 25 suites / 143 tests · branches 75,59% · lines 95,53% |
| `pnpm cypress:component:coverage` | ✅ 14/14 (ruta `nyc → glob 14 → minimatch 11`) |
| `pnpm build` | ✅ 13 rutas |

Árbol tras los overrides: `minimatch 11.0.3` (única instancia), `glob 14.0.3` (única instancia),
`globby 11.1.0`, `systeminformation 5.33.18`, `qs 6.17.1`, `zod 4.6.7`. Desaparecen `glob@7.2.3`,
`minimatch@3.1.5`, `minimatch@9.0.9`, `minimatch@10.2.6`, `glob@10.5.0`, `glob@13.0.6` e
`inflight@1.0.6`.

## Alertas de Dependabot

- **#163 (`deepmerge`)**: dismissed como `tolerable_risk` con el motivo y la ruta.
- **#156 y #157 (`extract-zip`)**: dismissed como `not_used` — el paquete salió del árbol con el
  upgrade a `pa11y-ci 5` (puppeteer 25 ya no lo trae); las alertas seguían abiertas desde hace dos
  semanas.
- **#166, #164, #165 (`systeminformation`) y #162 (`qs`)**: se cierran solas al re-escanear
  Dependabot con el lockfile nuevo (la versión corregida ya está instalada).

## Fuera de alcance

- No se toca el repo `vue3`: ya está saneado (`systeminformation 5.33.19`, `qs 6.17.1`, sin
  `extract-zip`).
- No se actualizan las dependencias directas que siguen en sus rangos actuales: el objetivo de esta
  iteración son los advisories, no la actualización general.
