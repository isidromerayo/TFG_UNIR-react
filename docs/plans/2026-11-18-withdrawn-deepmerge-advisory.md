# Retirada del advisory aceptado CVE-2026-93753 (deepmerge)

**Fecha:** 2026-11-18
**Proyecto:** TFG_UNIR-react (Next.js 16.4.5 + React 19.3.1)
**Estado:** Done
**Rama/PR:** `security/remove-withdrawn-deepmerge-advisory`

---

## 🎯 Objetivo

Desbloquear el gate *Accepted advisories recheck* de `security.yml`, que falla desde el
2026-11-17 con:

```
⚠️  CVE-2026-93753 (deepmerge@4.3.1): OSV ya no lo asocia a esa versión. Revisa el registro.
```

## 🔎 Diagnóstico

- `https://api.osv.dev/v1/vulns/CVE-2026-93753` responde con `"withdrawn": "2026-11-17T07:03:42Z"`:
  el CNA (VulnCheck) **retiró el CVE** (prototype poisoning en `mergeObject()`, deepmerge ≤ 4.3.1).
- La consulta `POST /v1/query` por `deepmerge@4.3.1` (npm) devuelve `{"vulns": []}`: OSV ya no lo
  asocia a la versión → el script `scripts/check-accepted-advisories.sh` falla correctamente
  (registro obsoleto).
- **No hay parche**: 4.3.1 (2023) sigue siendo la última versión publicada de `deepmerge`, por lo
  que NO se sube la dependencia ni se añade override. Solo se limpia el registro y el silencio.

## 📝 Cambios

1. `package.json`: eliminado el bloque `pnpm.auditConfig.ignoreCves` (contenía únicamente
   `CVE-2026-93753`). `pnpm.overrides` intacto.
2. `docs/security/accepted-advisories.md`:
   - Registro JSON con `advisories: []` + nota de la retirada.
   - Nuevo caso en el checklist de revisión: advisory *withdrawn* → retirar silencio y borrar
     entrada sin subir la dependencia.

## ✅ Verificación

```bash
./scripts/check-accepted-advisories.sh   # → ✅ No hay advisories aceptados (exit 0)
pnpm install --frozen-lockfile           # lockfile sin cambios (auditConfig no afecta)
pnpm audit --prod                        # sin vulnerabilidades
pnpm audit                               # CVE-2026-93753 ya no aparece (retirado por OSV)
pnpm lint && pnpm test-headless && pnpm cypress:component && pnpm build
```

## 📌 Decisiones de diseño

- Se conserva la entrada histórica como nota en el registro (trazabilidad), no en el bloque JSON
  que parsea el gate.
- No se toca `docs/plans/2026-10-31-dependabot-alerts.md` (registro histórico de la iteración en
  la que se aceptó el advisory).
