# Accesibilidad con pa11y — guía de uso y mantenimiento

Auditoría automática de accesibilidad de este frontend contra **WCAG 2.2 AA** con
[pa11y](https://github.com/pa11y/pa11y) + [pa11y-ci](https://github.com/pa11y/pa11y-ci) y
informes HTML con [pa11y-ci-reporter-html](https://gitlab.com/gitlab-ci-utils/pa11y-ci-reporter-html).

## Cadena de dependencias auditada

Versión trunkal (desde 2026-10-31, unificada con angular y vue3):

```
pa11y-ci 5.0.0 ──> pa11y 10.0.0 ──> puppeteer 25.x   (engines: ^22.13.0 || >=24)
        │
        └── reporters custom:
pa11y-ci-reporter-html 9.0.0 ──> pa11y-reporter-html-plus 6 ──> handlebars 4.7.10
   (engines: ^22.13.0 || ^24.11.0 || >=26; requiere pa11y-ci ^5.0.0 vía su propiedad `supports`)
```

- `pa11y` también está como devDependency directa para ejecuciones puntuales (`pnpm exec pa11y <url>`).
- Con `pa11y-ci@5` → puppeteer 25, el paquete `extract-zip` ya **no** aparece en el árbol de
  dependencias (con pa11y-ci 4 sí estaba vía `@puppeteer/browsers` 2.x). Si algún silencio de
  advisory apuntaba a esa ruta, debe retirarse.

## Cómo ejecutar

```bash
pnpm dev                # servir la app en :3000
pnpm a11y               # pa11y-ci sobre las URLs de .pa11yci
# (para datos reales de /categorias, /categoria/:id, /curso/:id: backend Spring Boot en :8080)
```

Salida: `reports/a11y/` (gitignored) con `index.html` (resumen), un HTML por URL y
`report.json` (`{ total, passes, errors, results: { "<url>": [issues] } }`).

Código de salida de `pa11y-ci`: `0` sin errores WCAG, `≠0` con errores o URLs fallidas.
**Es informativo**: no existe gate de a11y en el pipeline de PR.

### Ejecución puntual de una URL

```bash
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable pnpm exec pa11y http://localhost:3000/
```

La CLI de pa11y **no** lee `.pa11yci` (ni el `chromeLaunchConfig` ni `hideElements`): hay que pasar
lo que necesite por flags/env.

## Configuración (`.pa11yci` en la raíz)

| Opción | Valor aquí | Notas |
|---|---|---|
| `standard` | `WCAG2AA` | WCAG 2.2 AA |
| `runners` | `["htmlcs", "axe"]` | `axe` es el que detecta contraste de color |
| `levelCapWhenNeedsReview` | `warning` | issues "needs review" no suben de warning |
| `timeout` / `wait` | `60000` / `2000` ms | `wait` cubre el render de datos del backend |
| `hideElements` | `nextjs-portal` | excluye el overlay de Next dev del audit |
| `chromeLaunchConfig.executablePath` | `/usr/bin/google-chrome-stable` | puppeteer no descarga navegador en este proyecto |
| `reporters` | `cli`, `json`, `pa11y-ci-reporter-html` | ver matiz de reporter abajo |

**Matiz importante sobre el reporter**: el reporter HTML es `pa11y-ci-reporter-html`. El paquete
`pa11y-reporter-html` (suena igual) es un reporter de **pa11y**, no de **pa11y-ci**, y no funciona
dentro de la opción `reporters` de pa11y-ci (pa11y-ci descarta los valores de retorno de pa11y).

**El campo `supports` del reporter** (`^5.0.0` en v9; `^3.0.0 || ^4.0.0` en v8) es indicativo:
`pa11y-ci` **no lo valida** al cargar reporters. Una combinación incompatible puede funcionar o
fallar en runtime — lo único que demuestra compatibilidad es ejecutar `pnpm a11y`.

## Job de CI: `a11y.yml` (PoC)

- Trigger: semanal (lunes 03:00 UTC) + `workflow_dispatch`. **No** corre en PRs.
- Levanta la imagen `isidromerayo/postgres-tfg` (base de datos **vacía**; el backend
  `isidromerayo/spring-backend-tfg` crea el schema con `ddl-auto=update`) con
  `--network host`; después `pnpm dev` y `pnpm a11y`.
- **Estado PoC**: hasta que publiquemos una imagen de BD con los datos semilla
  (origen: `recursos/db/postgresql/0*.sql` del workspace), en CI las rutas dinámicas
  (`/categorias`, `/categoria/2`, `/curso/12`) se auditan en estado "sin datos"
  (lista vacía / recurso ausente). El audit **completo con datos reales** es el local:
  `../TFG_UNIR-backend/scripts/podman-pod.sh start` (monta los SQL la primera vez) +
  `pnpm dev` + `pnpm a11y`. Cuando la imagen de BD con datos exista, el job se actualiza
  a usarla y deja de ser PoC.
- Los errores WCAG **no** ponen el job rojo (paso con `continue-on-error`); se listan en el Step
  Summary y el detalle va al artifact `a11y-reports` (14 días). El job solo falla si la infra no
  levanta o si `report.json` no se genera (= toolchain roto).
- Tras fusionar cambios en `a11y.yml`, lanzar un `workflow_dispatch` manual para validar la primera
  corrida real.

## Política de upgrade del árbol pa11y

1. Subir **`pa11y-ci` y `pa11y-ci-reporter-html` juntos** en la misma rama (o en orden
   `pa11y-ci` → reporter, nunca al revés): el reporter 9 requiere `pa11y-ci` 5.
2. Usar `pnpm up 'pa11y-ci@^X' 'pa11y-ci-reporter-html@^Y'` y revisar el diff de `pnpm-lock.yaml`
   (los `pnpm.overrides` de seguridad deben sobrevivir — ver gotcha de Dependabot en `AGENTS.md`).
3. **Verificar ejecutando `pnpm a11y` contra dev server + backend** antes de fusionar: el verde de
   CI no prueba nada de pa11y.
4. Comprobar engines de Node (`pa11y-ci` 5: `^22.13.0 || >=24`; reporter 9: `^22.13.0 || ^24.11.0 || >=26`)
   contra la versión de `setup-node` en los workflows.
5. Revisar advisories aceptados que vivan bajo el árbol de pa11y (rutas con `puppeteer`,
   `extract-zip`, `handlebars`) y `pnpm security` en general.
6. Si un bump de Dependabot toca `pa11y-ci` o `pa11y-ci-reporter-html`, cerrar su PR y aplicar el
   bump manualmente en rama propia (política de lockfiles del repo).

## Historial

- 2026-10-17: auditoría inicial con `pa11y-ci@4` + `reporter-html@8` (feat: auditoría de accesibilidad con pa11y, PR #258).
- 2026-10-31: unificación de los tres frontends en `pa11y@10 / pa11y-ci@5 / reporter-html@9` + job
  CI `a11y.yml`. Se absorben y cierran las PRs de Dependabot #260 (pa11y-ci 5) y #267 (reporter 9).
  Registro de ejecución: `docs/plans/2026-10-31-pa11y-unificacion-y-docs.md`.
