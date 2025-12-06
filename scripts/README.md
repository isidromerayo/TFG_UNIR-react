# 🔧 Scripts del Proyecto

Scripts de utilidad para el proyecto TFG_UNIR-react.

## 📋 Scripts Disponibles

### security-check.sh

Script de auditoría de seguridad multi-herramienta que ejecuta múltiples scanners para detectar vulnerabilidades.

#### Uso

```bash
# Ejecutar auditoría completa
./scripts/security-check.sh

# Con Snyk (requiere token)
export SNYK_TOKEN=your_token_here
./scripts/security-check.sh
```

#### Herramientas que Ejecuta

1. **pnpm audit** - npm Advisory Database
2. **npm audit** - Comparación con npm
3. **Outdated check** - Dependencias desactualizadas
4. **Snyk** - Base de datos de Snyk (si está configurado)
5. **OSV Scanner** - Open Source Vulnerabilities (si está instalado)
6. **Package versions** - Verificación de paquetes críticos

#### Salida

El script genera:
- Reportes JSON de cada herramienta
- Resumen visual con colores
- Código de salida 0 (éxito) o 1 (vulnerabilidades encontradas)

#### Reportes Generados

- `pnpm-audit.json` - Resultado de pnpm audit
- `npm-audit.json` - Resultado de npm audit
- `snyk-report.json` - Resultado de Snyk (si configurado)
- `osv-report.json` - Resultado de OSV Scanner (si instalado)

#### Requisitos

**Obligatorios**:
- pnpm
- Node.js 20.x

**Opcionales** (para auditoría completa):
- npm
- Snyk CLI: `npm install -g snyk`
- OSV Scanner: https://google.github.io/osv-scanner/installation/

#### Configuración de Snyk

```bash
# 1. Instalar Snyk CLI
npm install -g snyk

# 2. Autenticar
snyk auth

# 3. Obtener token
# Visitar: https://app.snyk.io/account
# Copiar el token

# 4. Exportar token
export SNYK_TOKEN=your_token_here

# 5. Ejecutar script
./scripts/security-check.sh
```

#### Integración con CI/CD

Este script puede ser usado en pipelines de CI/CD:

```yaml
- name: Security Audit
  run: ./scripts/security-check.sh
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

#### Ejemplo de Salida

```
╔════════════════════════════════════════════════════════════╗
║  🔒 Auditoría de Seguridad Multi-Herramienta             ║
║  Proyecto: TFG_UNIR-react                                 ║
╚════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1️⃣  pnpm audit (npm Advisory Database)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ pnpm audit: No vulnerabilities found

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 Resumen Final
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Herramientas ejecutadas:
  • pnpm audit: ✅
  • npm audit: ✅
  • Outdated check: ✅
  • Snyk: ✅
  • OSV Scanner: ⚠️  (not installed)

Resultados:
✅ No vulnerabilities detected by any tool

╔════════════════════════════════════════════════════════════╗
║  ✨ Security audit passed successfully!                   ║
╚════════════════════════════════════════════════════════════╝
```

## 🔄 Agregar Nuevos Scripts

Para agregar nuevos scripts:

1. Crear el archivo en `scripts/`
2. Dar permisos de ejecución: `chmod +x scripts/nombre.sh`
3. Documentar en este README
4. Agregar al package.json si es necesario

## 📚 Recursos

- [pnpm audit](https://pnpm.io/cli/audit)
- [Snyk CLI](https://docs.snyk.io/snyk-cli)
- [OSV Scanner](https://google.github.io/osv-scanner/)
- [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit)
