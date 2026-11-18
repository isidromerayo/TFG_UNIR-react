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
- 🚫 Si OSV ha **retirado (withdrawn)** el advisory, o ya no lo devuelve para esa versión: no hace
  falta subir nada (puede no existir parche); basta con retirar el silencio y borrar la entrada del
  registro en la misma PR. El gate `check-accepted-advisories.sh` lo detecta y falla hasta limpiarlo.

## Registro

```json accepted-advisories
{
  "ecosystem": "npm",
  "advisories": []
}
```

> 2026-11-18: se retiró la entrada `CVE-2026-93753` (`deepmerge@4.3.1`, dev-only vía
> `jest/jest-config`) porque el CVE fue **withdrawn** por el CNA (VulnCheck) el 2026-11-17 y OSV ya
> no lo asocia a la versión. No existe parche de `deepmerge` (4.3.1 sigue siendo la última
> publicada), así que no se subió la dependencia; se retiró también el silencio en
> `pnpm.auditConfig.ignoreCves`. Registro en `docs/plans/2026-11-18-withdrawn-deepmerge-advisory.md`.
