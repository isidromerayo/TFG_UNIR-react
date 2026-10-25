# 🎯 Fijar los CVE sin parche en `pnpm.auditConfig.ignoreCves`

## 💡 Convention

Cuando Dependabot (o `pnpm audit`) reporta un advisory **sin versión parcheada** —`security_vulnerability.first_patched_version` es `null` y `patched_versions` es `<0.0.0`— no existe override posible: subir la dependencia no lo arregla porque **todas** las versiones publicadas son vulnerables. En ese caso se aplica esta convención:

1. Añadir el CVE a `pnpm.auditConfig.ignoreCves` en `package.json`, junto a un comentario en la alerta que lo justifique.
2. Dismissar la alerta de Dependabot con `dismissed_reason` (`not_used` o `tolerable_risk`) y un `dismissed_comment` (máximo **280 caracteres**) que explique por qué no es alcanzable o por qué el riesgo es aceptable: alcance (dev/runtime), ruta de dependencia y si hay entrada controlada por atacante.
3. Registrar la decisión en el plan correspondiente de `docs/plans/`.

Los advisories **con** parche nunca se silencian: se corrigen con un `pnpm.overrides` (ver `AGENTS.md` → Quirks → *pnpm overrides*).

⚠️ **Efecto colateral verificado:** `pnpm audit --ignore-unfixable` escribe él solo el CVE ignorado en `pnpm.auditConfig.ignoreCves`. Es decir, el fichero `package.json` se modifica al ejecutar el workflow/auditoría. Revisa siempre `git diff package.json` después de auditar y decide si ese CVE ignorado se mantiene (explícito y versionado) o se revierte.

## 🏆 Benefits

- `pnpm audit` **sin flags** sale con exit code 0, así que el gate local (`pnpm security` / pre-commit) no falla por algo que nadie puede arreglar.
- La decisión queda auditable y versionada: el CVE está en el repo y la alerta dismissada conserva el motivo en GitHub.
- Evita re-litigar la misma alerta cada semana y la fatiga de alertas.
- El silencio es **quirúrgico** (un CVE concreto), no un `--ignore-unfixable` global ni un filtro por severidad que podría tapar vulnerabilidades nuevas.

## 👀 Examples

### ✅ Good: CVE sin parche fijado, con la alerta justificada

`package.json`:

```json
"auditConfig": {
  "ignoreCves": [
    "CVE-2026-97058"
  ]
}
```

Dismissal con motivo y justificación (≤ 280 caracteres):

```bash
gh api -X PATCH repos/<owner>/<repo>/dependabot/alerts/151 \
  -f state=dismissed \
  -f dismissed_reason=tolerable_risk \
  -f dismissed_comment="Sin parche upstream: todas las versiones (<=1.1.3) son vulnerables y 1.1.3 es la ultima. Dev-only (js-yaml>argparse>sprintf-js). Solo afecta al formateo de errores con precision no acotada; formatos estaticos, sin entrada de atacante."
```

Resultado: `pnpm audit` → exit 0 sin flags, y `pnpm install --frozen-lockfile` sigue pasando.

### ❌ Bad: silenciar un CVE que sí tiene parche

```json
"overrides": { "handlebars": "^4.7.9" },
"auditConfig": { "ignoreCves": ["CVE-2026-106446"] }
```

`handlebars` tiene parche (4.7.10): lo correcto es subir el override, no ignorarlo. Ignorar aquí deja código vulnerable en el lockfile.

### ❌ Bad: dejar el audit en rojo o dismissar sin justificar

```bash
# Sin CVE en ignoreCves -> pnpm audit sigue saliendo 1 y `pnpm security` falla
pnpm audit

# Dismissal sin motivo ni comentario: nadie sabrá por qué se aceptó el riesgo
gh api -X PATCH repos/<owner>/<repo>/dependabot/alerts/151 \
  -f state=dismissed -f dismissed_reason=not_used
```

## 🧐 Real world examples

- `package.json` → `pnpm.auditConfig.ignoreCves` (`CVE-2026-97058` de `sprintf-js`, #251).
- `.github/workflows/security.yml:66` → `pnpm audit --json --ignore-unfixable` (cubre CI, pero no el audit local sin flags).
- `docs/plans/2026-10-15-dependabot-alerts-octubre.md` y `docs/plans/2026-10-03-revision-prs-seguridad.md` → decisiones registradas.

## 🔗 Related agreements

- `docs/security/accepted-advisories.md` — registro de los advisories ya aceptados y revisión automática (`pnpm security:accepted`) para retirarlos en cuanto aparezca un parche; esa es la fuente de verdad de *qué* está aceptado hoy.
- `AGENTS.md` → *Quirks* → **pnpm overrides** y *CI/CD* → `security.yml`.
- `AGENTS.md` → *Plan Mode & Execution Records* y `docs/plans/` (toda decisión no trivial se registra y se actualiza su estado).

Doc crafted by 🐢 💨 (Turbotuga™, [Codely](https://codely.com)'s mascot)

📚 Aprende más sobre IA en el [Curso de Programación Agéntica con IA: Fundamentos Prácticos](https://codely.com/cursos/programacion-agentica-con-ia-fundamentos-practicos-ag3n).
