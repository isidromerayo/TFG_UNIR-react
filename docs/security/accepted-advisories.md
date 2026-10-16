# 📌 Advisories aceptados (sin parche upstream)

**Regla**: un advisory sólo se "acepta" cuando **no existe** versión parcheada publicada. Se registra
aquí y se **vuelve a revisar en cada iteración** (cualquier PR que toque dependencias/seguridad y la
ejecución programada de `security.yml`). En cuanto haya parche, se retira el silencio y se actualiza
la dependencia **en la misma PR**.

**Chequeo automático**: `./scripts/check-accepted-advisories.sh` (`pnpm security:accepted`, paso
*Accepted advisories recheck* de `security.yml`). Consulta OSV y **falla** si algún advisory aceptado
ya tiene versión parcheada, o si ya no aplica a la versión registrada.

**Un advisory CON parche nunca se acepta**: se corrige con un override (`pnpm.overrides` /
`pnpm-workspace.yaml`) — ver `AGENTS.md` → Quirks → *pnpm overrides*.

## Cómo se acepta (checklist)

1. Comprobar que es *unfixable*: `first_patched_version: null` / `patched_versions: <0.0.0`, y que
   OSV no publique un evento `fixed` para nuestro paquete/ecosistema.
2. Silenciarlo de forma quirúrgica (nunca por severidad ni con un `--ignore-unfixable` global):
   `pnpm.auditConfig.ignoreCves`, lista `ACCEPTED` del gate, o `dismissed_reason` en Dependabot.
3. Añadir la entrada al bloque JSON de abajo con motivo, alcance (dev/prod) y ruta de dependencia.
4. Registrar la decisión en el plan de `docs/plans/` de la iteración.

## Cómo se revisa (cada iteración)

```bash
pnpm security:accepted          # o: ./scripts/check-accepted-advisories.sh
```

- ✅ Si sigue sin parche: nada que hacer.
- ❌ Si ya hay parche, o si ya no aplica a la versión registrada: subir la dependencia, retirar el
  silencio (`ignoreCves` / `ACCEPTED` / dismissal) y **borrar la entrada de este registro**.

## Registro

```json accepted-advisories
{
  "ecosystem": "npm",
  "advisories": [
    {
      "id": "GHSA-vfj7-8cjw-p6xm",
      "aliases": ["CVE-2026-93687"],
      "package": "braces",
      "version": "3.0.3",
      "scope": "dev",
      "route": "eslint-config-next > @next/eslint-plugin-next > fast-glob > micromatch > braces",
      "acceptedOn": "2026-10-15",
      "mutedBy": "ACCEPTED=\"braces\" in .github/workflows/security.yml + pnpm.auditConfig.ignoreCves",
      "reason": "Todas las versiones publicadas (<= 3.0.3) están afectadas y no hay parche upstream. Tooling de lint, sin entrada controlada por atacante."
    },
    {
      "id": "GHSA-hp3w-g68c-fv3c",
      "aliases": ["CVE-2026-97058"],
      "package": "sprintf-js",
      "version": "1.0.3",
      "scope": "dev",
      "route": "js-yaml@3.15.2 > argparse@1.0.10 > sprintf-js",
      "acceptedOn": "2026-10-15",
      "mutedBy": "pnpm.auditConfig.ignoreCves (CVE-2026-97058) + Dependabot dismissal",
      "reason": "1.1.3 es la última versión publicada y está afectada; el fix upstream existe sólo como commit, sin release en npm. Dev-only (formateo de errores de argparse)."
    }
  ]
}
```
