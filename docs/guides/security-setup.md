# 🔒 Configuración de Seguridad del Proyecto

## 📋 Resumen

Este proyecto implementa una estrategia de seguridad multi-capa con múltiples herramientas y automatizaciones para detectar y prevenir vulnerabilidades.

## 🛡️ Estrategia de Seguridad

```
┌─────────────────────────────────────────┐
│  Capa 1: Auditoría Local                │
│  - pnpm audit                            │
│  - Script security-check.sh              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Capa 2: CI/CD Automatizado              │
│  - GitHub Actions (security.yml)         │
│  - Ejecución diaria + en cada PR         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Capa 3: Monitoreo Continuo              │
│  - Dependabot (actualizaciones auto)     │
│  - Snyk (detección avanzada)             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Capa 4: Alertas y Notificaciones        │
│  - Issues automáticos                    │
│  - Comentarios en PRs                    │
│  - Reportes en artifacts                 │
└─────────────────────────────────────────┘
```

## 🔧 Componentes Implementados

### 1. GitHub Actions Workflows

#### security.yml
**Ubicación**: `.github/workflows/security.yml`

**Características**:
- ✅ Ejecución diaria a las 2 AM UTC
- ✅ Ejecución en push a main y PRs
- ✅ Ejecución manual (workflow_dispatch)
- ✅ Múltiples herramientas de auditoría
- ✅ Generación de reportes JSON
- ✅ Creación automática de issues
- ✅ Comentarios en PRs
- ✅ Upload de artifacts

**Herramientas integradas**:
1. pnpm audit (npm Advisory Database)
2. npm audit (comparación)
3. pnpm outdated (dependencias desactualizadas)
4. Snyk (si está configurado)
5. OSV Scanner (Google)

**Triggers**:
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Diario a las 2 AM
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:  # Manual
```

#### node.js.yml
**Ubicación**: `.github/workflows/node.js.yml`

**Características**:
- ✅ CI/CD principal
- ✅ Lint, build, tests
- ✅ Auditoría básica con pnpm

### 2. Dependabot

**Ubicación**: `.github/dependabot.yml`

**Características**:
- ✅ Actualizaciones semanales (lunes 9 AM)
- ✅ Agrupación inteligente de dependencias
- ✅ Límite de 10 PRs abiertas
- ✅ Labels automáticos
- ✅ Commit messages estandarizados
- ✅ Ignorar actualizaciones mayores específicas

**Grupos configurados**:
- production-dependencies (minor + patch)
- development-dependencies (minor + patch)
- nextjs-ecosystem (next + eslint-config-next)
- react-ecosystem (react + react-dom + types)
- testing-tools (jest + cypress + testing-library)

**Actualizaciones ignoradas**:
- Next.js major versions (requieren revisión manual)
- Cypress major versions (requieren revisión manual)

### 3. Script Local de Seguridad

**Ubicación**: `scripts/security-check.sh`

**Características**:
- ✅ Ejecutable localmente
- ✅ Múltiples herramientas
- ✅ Output con colores
- ✅ Generación de reportes JSON
- ✅ Resumen visual
- ✅ Código de salida apropiado

**Uso**:
```bash
# Auditoría completa
pnpm security

# O directamente
./scripts/security-check.sh

# Con Snyk
export SNYK_TOKEN=your_token
pnpm security
```

**Herramientas**:
1. pnpm audit
2. npm audit (comparación)
3. pnpm outdated
4. Snyk (opcional)
5. OSV Scanner (opcional)
6. Verificación de versiones críticas

### 4. Scripts de npm

**Ubicación**: `package.json`

```json
{
  "scripts": {
    "security": "./scripts/security-check.sh",
    "security:audit": "pnpm audit",
    "security:outdated": "pnpm outdated"
  }
}
```

## 📊 Flujo de Trabajo

### Desarrollo Local

```bash
# 1. Antes de commit
pnpm security

# 2. Si hay vulnerabilidades
pnpm outdated
pnpm update

# 3. Verificar
pnpm lint
pnpm test-headless
pnpm build

# 4. Commit
git commit -m "fix: update dependencies"
```

### Pull Request

1. **Automático**:
   - Workflow de seguridad se ejecuta
   - Comentario en PR si hay vulnerabilidades
   - Artifacts con reportes detallados

2. **Manual**:
   - Revisar comentarios del bot
   - Revisar artifacts si es necesario
   - Corregir vulnerabilidades antes de merge

### Producción (main)

1. **Automático**:
   - Workflow de seguridad se ejecuta
   - Issue creado si hay vulnerabilidades críticas
   - Reportes guardados en artifacts

2. **Diario**:
   - Ejecución programada a las 2 AM
   - Detección temprana de nuevas vulnerabilidades
   - Notificación automática

## 🔐 Configuración de Herramientas

### Snyk

#### 1. Crear Cuenta
- Visitar: https://snyk.io/
- Registrarse con GitHub

#### 2. Obtener Token
- Ir a: https://app.snyk.io/account
- Copiar API Token

#### 3. Configurar en GitHub
```bash
# En GitHub:
# Settings → Secrets and variables → Actions → New repository secret
# Name: SNYK_TOKEN
# Value: [tu token]
```

#### 4. Configurar Localmente
```bash
# Instalar CLI
npm install -g snyk

# Autenticar
snyk auth

# O exportar token
export SNYK_TOKEN=your_token_here
```

### OSV Scanner

#### Instalación

**Linux/macOS**:
```bash
# Con Go
go install github.com/google/osv-scanner/cmd/osv-scanner@latest

# O descargar binario
# https://github.com/google/osv-scanner/releases
```

**Uso**:
```bash
osv-scanner --lockfile=pnpm-lock.yaml
```

## 📈 Monitoreo y Alertas

### Issues Automáticos

Cuando se detectan vulnerabilidades críticas:
- ✅ Issue creado automáticamente
- ✅ Label "security" y "automated"
- ✅ Resumen de vulnerabilidades
- ✅ Comandos de corrección
- ✅ Link al workflow run

### Comentarios en PRs

En pull requests con vulnerabilidades:
- ✅ Comentario automático
- ✅ Número de vulnerabilidades
- ✅ Comandos de corrección
- ✅ Bloqueo de merge (opcional)

### Artifacts

Reportes guardados por 30 días:
- pnpm-audit.json
- npm-audit.json
- snyk-report.json
- osv-report.json
- outdated.json

## 🎯 Mejores Prácticas

### ✅ Hacer

1. **Ejecutar auditoría antes de commit**
   ```bash
   pnpm security
   ```

2. **Revisar PRs de Dependabot semanalmente**
   - Verificar changelogs
   - Ejecutar tests
   - Merge si todo pasa

3. **Actualizar dependencias regularmente**
   ```bash
   pnpm outdated
   pnpm update
   ```

4. **Revisar issues de seguridad inmediatamente**
   - Priorizar vulnerabilidades críticas
   - Actualizar lo antes posible

5. **Mantener herramientas actualizadas**
   ```bash
   npm update -g snyk
   pnpm self-update
   ```

### ❌ No Hacer

1. **No ignorar alertas de seguridad**
   - Siempre investigar
   - Actualizar o documentar por qué no

2. **No confiar solo en una herramienta**
   - Usar múltiples scanners
   - Revisar manualmente cuando sea necesario

3. **No retrasar actualizaciones de seguridad**
   - Aplicar parches inmediatamente
   - Planificar actualizaciones mayores

4. **No hacer merge con vulnerabilidades críticas**
   - Corregir primero
   - Documentar excepciones

## 📚 Documentación Relacionada

- [AUDIT_REPORT.md](../archive/AUDIT_REPORT.md) - Reporte de auditoría actual
- [SECURITY_AUDIT_ANALYSIS.md](../security/security-audit-analysis.md) - Análisis de herramientas
- [DEPENDENCY_UPDATE_GUIDE.md](./dependency-update-guide.md) - Guía de actualización
- [PENDING_PRS_REPORT.md](../archive/PENDING_PRS_REPORT.md) - PRs pendientes
- [scripts/README.md](../../scripts/README.md) - Documentación de scripts

## 🔗 Enlaces Útiles

### Herramientas
- [pnpm audit](https://pnpm.io/cli/audit)
- [Snyk](https://snyk.io/)
- [OSV Scanner](https://google.github.io/osv-scanner/)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)

### Bases de Datos
- [npm Advisory Database](https://github.com/advisories)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)
- [GitHub Advisory Database](https://github.com/advisories)
- [OSV - Open Source Vulnerabilities](https://osv.dev/)
- [NVD - National Vulnerability Database](https://nvd.nist.gov/)

### Recursos
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE - Common Weakness Enumeration](https://cwe.mitre.org/)

## 🆘 Troubleshooting

### Workflow falla con "SNYK_TOKEN not found"

**Solución**: Snyk es opcional. El workflow continúa sin él.

Para configurarlo:
1. Obtener token en https://app.snyk.io/account
2. Agregar como secret en GitHub
3. Re-ejecutar workflow

### Script security-check.sh no ejecuta

**Solución**:
```bash
chmod +x scripts/security-check.sh
./scripts/security-check.sh
```

### pnpm audit no detecta vulnerabilidades conocidas

**Solución**: Ver [SECURITY_AUDIT_ANALYSIS.md](../security/security-audit-analysis.md)

pnpm audit solo consulta npm Advisory Database. Usar múltiples herramientas.

### Dependabot crea demasiadas PRs

**Solución**: Ajustar `.github/dependabot.yml`:
```yaml
open-pull-requests-limit: 5  # Reducir límite
```

## 📊 Métricas

### Estado Actual

- ✅ Workflows configurados: 2
- ✅ Herramientas integradas: 5
- ✅ Scripts locales: 1
- ✅ Dependabot: Configurado
- ✅ Documentación: Completa

### Cobertura

- ✅ npm Advisory Database (pnpm audit)
- ✅ Snyk Database (opcional)
- ✅ OSV Database (opcional)
- ✅ GitHub Advisory Database (Dependabot)
- ✅ Dependencias desactualizadas

---

**Última actualización**: 6 de diciembre de 2024  
**Versión**: 1.0.0  
**Mantenedor**: Proyecto TFG_UNIR-react
