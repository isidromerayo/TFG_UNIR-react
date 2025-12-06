# 📦 Guía de Actualización de Dependencias

## 🎯 Objetivo

Esta guía explica cómo verificar, analizar y actualizar las dependencias del proyecto de forma segura.

## 🔍 Verificar Estado de Dependencias

### Ver Dependencias Desactualizadas

```bash
# Ver todas las dependencias desactualizadas
pnpm outdated

# Solo dependencias de producción
pnpm outdated --prod

# Solo dependencias de desarrollo
pnpm outdated --dev

# Formato JSON (para scripts)
pnpm outdated --json
```

### Ejemplo de Salida

```
┌────────────────────┬─────────┬─────────┐
│ Package            │ Current │ Latest  │
├────────────────────┼─────────┼─────────┤
│ @types/node        │ 24.0.3  │ 24.10.1 │
├────────────────────┼─────────┼─────────┤
│ react              │ 19.1.0  │ 19.2.1  │
└────────────────────┴─────────┴─────────┘
```

## 📊 Tipos de Actualizaciones

### 1. Actualizaciones de Parche (Patch)

**Ejemplo**: 1.2.3 → 1.2.4

- **Riesgo**: Muy bajo
- **Contiene**: Bug fixes, parches de seguridad
- **Acción**: Actualizar inmediatamente

```bash
pnpm update <package>
```

### 2. Actualizaciones Menores (Minor)

**Ejemplo**: 1.2.3 → 1.3.0

- **Riesgo**: Bajo
- **Contiene**: Nuevas features, mejoras
- **Acción**: Actualizar después de revisar changelog

```bash
pnpm update <package>
```

### 3. Actualizaciones Mayores (Major)

**Ejemplo**: 1.2.3 → 2.0.0

- **Riesgo**: Medio-Alto
- **Contiene**: Breaking changes
- **Acción**: Revisar changelog, planificar migración

```bash
pnpm update <package> --latest
```

## 🚀 Proceso de Actualización

### Paso 1: Verificar Estado Actual

```bash
# Ver dependencias desactualizadas
pnpm outdated

# Auditoría de seguridad
pnpm audit
```

### Paso 2: Clasificar Actualizaciones

**Actualizaciones Seguras** (parches y menores):
- @types/node
- eslint
- react + react-dom (parches)
- typescript (menores)

**Actualizaciones que Requieren Revisión** (mayores):
- next (15 → 16)
- cypress (14 → 15)
- eslint-config-next (15 → 16)

### Paso 3: Actualizar Dependencias Seguras

```bash
# Actualizar dependencias seguras
pnpm update @types/node eslint react react-dom typescript

# Verificar que todo funciona
pnpm lint
pnpm test-headless
pnpm build
```

### Paso 4: Actualizar Dependencias Mayores (Opcional)

#### Next.js 15 → 16

1. **Revisar changelog**:
   ```bash
   # Ver changelog en navegador
   open https://nextjs.org/blog/next-16
   ```

2. **Revisar breaking changes**:
   - Cambios en API Routes
   - Cambios en configuración
   - Deprecaciones

3. **Actualizar**:
   ```bash
   pnpm update next eslint-config-next --latest
   ```

4. **Verificar**:
   ```bash
   pnpm lint
   pnpm test-headless
   pnpm build
   pnpm dev  # Probar manualmente
   ```

#### Cypress 14 → 15

1. **Revisar changelog**:
   ```bash
   open https://docs.cypress.io/guides/references/changelog
   ```

2. **Actualizar**:
   ```bash
   pnpm update cypress --latest
   ```

3. **Verificar tests E2E**:
   ```bash
   pnpm run cypress:run
   ```

## 🔄 Comandos de Actualización

### Actualización Básica

```bash
# Actualizar todas las dependencias (respeta semver)
pnpm update

# Actualizar solo producción
pnpm update --prod

# Actualizar solo desarrollo
pnpm update --dev
```

### Actualización Avanzada

```bash
# Actualizar a últimas versiones (ignora semver)
pnpm update --latest

# Actualizar interactivamente (elige qué actualizar)
pnpm update --interactive

# Actualizar una dependencia específica
pnpm update <package>

# Actualizar a versión específica
pnpm update <package>@<version>
```

### Actualización con Verificación

```bash
# Script completo de actualización segura
pnpm update && \
pnpm lint && \
pnpm test-headless && \
pnpm build && \
echo "✅ Actualización exitosa"
```

## ✅ Checklist de Actualización

### Pre-Actualización

- [ ] Hacer commit de cambios actuales
- [ ] Crear rama para actualización: `git checkout -b update-dependencies`
- [ ] Verificar estado actual: `pnpm outdated`
- [ ] Revisar auditoría: `pnpm audit`

### Durante Actualización

- [ ] Actualizar dependencias seguras primero
- [ ] Ejecutar tests: `pnpm test-headless`
- [ ] Ejecutar build: `pnpm build`
- [ ] Ejecutar linter: `pnpm lint`
- [ ] Probar aplicación: `pnpm dev`

### Post-Actualización

- [ ] Verificar que todo funciona
- [ ] Revisar warnings en consola
- [ ] Actualizar documentación si es necesario
- [ ] Commit de cambios: `git commit -m "chore: update dependencies"`
- [ ] Crear PR para revisión

## 📋 Estrategias de Actualización

### Estrategia Conservadora (Recomendada)

1. Actualizar solo parches y menores
2. Verificar exhaustivamente
3. Actualizar mayores en PRs separados
4. Revisar changelog de cada mayor

```bash
# Solo actualizaciones seguras
pnpm update
```

### Estrategia Agresiva

1. Actualizar todo a últimas versiones
2. Arreglar breaking changes
3. Requiere más tiempo de testing

```bash
# Actualizar todo
pnpm update --latest
```

### Estrategia Interactiva (Recomendada para Mayores)

1. Revisar cada actualización
2. Decidir qué actualizar
3. Control total del proceso

```bash
# Elegir qué actualizar
pnpm update --interactive
```

## 🛡️ Mejores Prácticas

### 1. Actualizar Regularmente

- **Frecuencia recomendada**: Cada 2-4 semanas
- **Parches de seguridad**: Inmediatamente
- **Actualizaciones mayores**: Planificar con tiempo

### 2. Leer Changelogs

Antes de actualizar versiones mayores:

```bash
# Next.js
open https://nextjs.org/blog

# React
open https://react.dev/blog

# Cypress
open https://docs.cypress.io/guides/references/changelog
```

### 3. Probar Exhaustivamente

```bash
# Suite completa de verificación
pnpm lint && \
pnpm test-headless && \
pnpm build && \
pnpm audit && \
echo "✅ Todo OK"
```

### 4. Actualizar en Ramas Separadas

```bash
# Crear rama para actualizaciones
git checkout -b update-dependencies-$(date +%Y%m%d)

# Hacer cambios
pnpm update

# Commit y PR
git add pnpm-lock.yaml package.json
git commit -m "chore: update dependencies"
git push origin update-dependencies-$(date +%Y%m%d)
```

### 5. Documentar Cambios

Si hay breaking changes, actualizar:
- README.md
- CHANGELOG.md
- Documentación de equipo

## 🔧 Troubleshooting

### Problema: Conflictos de Peer Dependencies

```bash
# Ver conflictos
pnpm install

# Solución 1: Actualizar peer dependency
pnpm update <peer-dependency>

# Solución 2: Usar overrides en package.json
{
  "pnpm": {
    "overrides": {
      "package": "version"
    }
  }
}
```

### Problema: Tests Fallan Después de Actualizar

```bash
# Limpiar caché
rm -rf node_modules .next
pnpm install

# Limpiar caché de Jest
pnpm test --clearCache

# Ejecutar tests
pnpm test-headless
```

### Problema: Build Falla

```bash
# Limpiar build
rm -rf .next

# Reinstalar dependencias
rm -rf node_modules
pnpm install

# Build limpio
pnpm build
```

### Problema: Actualización Rompe la Aplicación

```bash
# Revertir cambios
git checkout pnpm-lock.yaml package.json

# Reinstalar versiones anteriores
pnpm install

# Investigar qué paquete causó el problema
# Actualizar uno por uno
```

## 📊 Estado Actual del Proyecto

### Dependencias Desactualizadas (6 dic 2024)

| Paquete | Actual | Disponible | Tipo | Prioridad |
|---------|--------|------------|------|-----------|
| @types/node | 24.0.3 | 24.10.1 | Minor | Media |
| eslint | 9.31.0 | 9.39.1 | Patch | Alta |
| react | 19.1.0 | 19.2.1 | Patch | Alta |
| react-dom | 19.1.0 | 19.2.1 | Patch | Alta |
| typescript | 5.8.3 | 5.9.3 | Minor | Media |
| cypress | 14.5.4 | 15.7.1 | Major | Baja |
| next | 15.5.7 | 16.0.7 | Major | Baja |
| eslint-config-next | 15.5.7 | 16.0.7 | Major | Baja |

### Recomendación Inmediata

```bash
# Actualizar parches y menores (seguro)
pnpm update @types/node eslint react react-dom typescript

# Verificar
pnpm lint && pnpm test-headless && pnpm build
```

## 🔄 Automatización

### Script de Actualización Automática

Crear `scripts/update-deps.sh`:

```bash
#!/bin/bash
set -e

echo "🔍 Verificando dependencias desactualizadas..."
pnpm outdated

echo ""
echo "🔒 Auditoría de seguridad..."
pnpm audit

echo ""
echo "📦 Actualizando dependencias seguras..."
pnpm update

echo ""
echo "✅ Ejecutando tests..."
pnpm lint
pnpm test-headless
pnpm build

echo ""
echo "✨ ¡Actualización completada!"
```

### Configurar Dependabot (GitHub)

Crear `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    versioning-strategy: increase
```

## 📚 Recursos

- [pnpm update docs](https://pnpm.io/cli/update)
- [Semantic Versioning](https://semver.org/)
- [Next.js Upgrade Guide](https://nextjs.org/docs/upgrading)
- [React Changelog](https://react.dev/blog)

---

**Última actualización**: 6 de diciembre de 2024  
**Próxima revisión recomendada**: Enero 2025
