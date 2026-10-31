# Plan: Limpieza de la raíz del repo (documentación y artefactos obsoletos)

- **Fecha**: 2026-10-31
- **Herramienta/modelo**: opencode (opencode-go/minimax-m3.1-flash)
- **Estado**: done

## Objetivo

La raíz del repo acumula 21 ficheros `.md` históricos (migración a pnpm, reportes de auditoría,
plantillas de PR) mezclados con los dos que de verdad son punto de entrada (`README.md`,
`AGENTS.md`), más artefactos que ya no sirven para nada. El objetivo es que la raíz solo contenga
lo vigente y que el histórico quede trazable pero fuera de vista.

## Cambios

### Documentación movida (con `git mv`, se conserva el historial)

| Origen | Destino |
|---|---|
| `NEXTJS_16_UPGRADE.md` | `docs/guides/nextjs-16-upgrade.md` |
| `SONARQUBE_SETUP.md` | `docs/guides/sonarqube-setup.md` |
| `DEPENDENCY_UPDATE_GUIDE.md` | `docs/guides/dependency-update-guide.md` |
| `VERSIONING_GUIDE.md` | `docs/guides/versioning-guide.md` |
| `QUICKSTART_PNPM.md` | `docs/guides/quickstart-pnpm.md` |
| `SECURITY_SETUP.md` | `docs/guides/security-setup.md` |
| `CHECKLIST_EQUIPO.md` | `docs/guides/checklist-equipo.md` |
| `SECURITY_AUDIT_ANALYSIS.md` | `docs/security/security-audit-analysis.md` |
| `DOCS_INDEX.md` | `docs/README.md` (reescrito como índice de `docs/`) |
| 12 `.md` históricos + `migrate-to-pnpm.sh` | `docs/archive/` (mismo nombre) |

### Artefactos eliminados

- `audit-report.json` (310 B, salida de una ejecución de auditoría, sin referencias).
- `package-lock.json.backup` (426 KB): **nunca estuvo versionado** (ya estaba en `.gitignore`), era
  un resto local de la migración a npm. Se borró del disco, no del historial.

### Enlaces

- Script de reescritura que calcula la ruta relativa correcta desde la nueva ubicación de cada
  fichero: 5 ficheros con enlaces actualizados (`README.md`, `docs/README.md`,
  `docs/guides/security-setup.md`, `docs/guides/checklist-equipo.md`,
  `docs/archive/DOCUMENTATION_UPDATE_SUMMARY.md`).
- Verificador de enlaces markdown: **0 enlaces rotos** en los 44 ficheros `.md` (antes había 4
  introducidos por el propio movimiento, ya corregidos).
- `.github/workflows/security.yml`: los 3 mensajes y 2 comentarios que apuntaban a
  `SECURITY_AUDIT_ANALYSIS.md` ahora apuntan a `docs/security/security-audit-analysis.md`.
- `README.md`: sección «Documentación» reescrita con la estructura nueva y el índice en
  `docs/README.md`.
- `AGENTS.md`: la sección «Docs» apunta al índice y a las carpetas `guides/` y `archive/`.

## Verificación

| Comprobación | Resultado |
|---|---|
| Verificador de enlaces markdown | ✅ 0 rotos en 44 ficheros |
| `pnpm lint` | ✅ 0 errores (1 warning preexistente en `_document.tsx`) |
| `pnpm test-headless` | ✅ 25 suites / 143 tests |
| `pnpm cypress:component` | ✅ 14/14 |
| `pnpm build` | ✅ 13 rutas |

## Fuera de alcance

- No se borra el histórico: todo se mueve con `git mv`, así que `git log --follow` sigue funcionando.
- No se tocan los `.md` de los repos hermano (angular, vue3, backend): cada uno tiene su propio
  árbol y su propio `AGENTS.md`.
- No se reescribe el contenido de los documentos archivados más allá de sus enlaces.
