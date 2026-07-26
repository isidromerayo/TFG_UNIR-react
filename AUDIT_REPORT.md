# Reporte de Auditoría de Seguridad - TFG_UNIR-react

**Fecha**: 26 de julio de 2026  
**Package Manager**: pnpm 10.30.1

## Resumen Ejecutivo

### Estado de Seguridad: BUENO

- **Vulnerabilidades Totales**: 2 (ambas en dev dependencies)
- **Vulnerabilidades Críticas**: 0
- **Vulnerabilidades Altas**: 2 (brace-expansion en jest/babel-plugin-istanbul)
- **Vulnerabilidades Moderadas**: 0
- **Vulnerabilidades Bajas**: 0

### Vulnerabilidades Resueltas (Sesión Actual)

**Fecha de resolución**: 26 de julio de 2026

Se resolvieron **18 vulnerabilidades** de las 20 iniciales:

1. **systeminformation (Alta)**: Command Injection en Linux
   - **Solución**: Override a `>=5.31.7`
   
2. **sharp (Alta)**: Vulnerabilidades en libvips
   - **Solución**: Override a `>=0.35.0`
   
3. **ws (Alta)**: Memory exhaustion DoS
   - **Solución**: Override a `>=8.21.0`
   
4. **js-yaml (Alta)**: DoS cuadrático en merge keys
   - **Solución**: Override a `>=4.3.0`
   
5. **postcss (Alta)**: Path Traversal a archivos .map
   - **Solución**: Override a `>=8.5.18`
   
6. **tmp (Alta)**: Path Traversal
   - **Solución**: Override a `>=0.2.6`
   
7. **form-data (Alta)**: CRLF Injection
   - **Solución**: Override a `>=4.0.6`
   
8. **qs (Moderada)**: DoS remoto
   - **Solución**: Override a `>=6.15.2`

9. **Dependencias directas actualizadas**:
   - next: 16.2.10 → 16.2.12
   - react/react-dom: 19.2.4 → 19.2.8
   - axios: 1.15.2 → 1.18.1
   - zustand: 5.0.11 → 5.0.14
   - react-hook-form: 7.71.1 → 7.83.0
   - sweetalert2: 11.26.18 → 11.26.25
   - cypress: 15.14.2 → 15.19.0
   - @babel/core: 7.29.0 → 7.29.7

### Vulnerabilidades Pendientes (No corregibles)

1. **brace-expansion (Alta)**: DoS via unbounded expansion
   - **Paquete afectado**: jest, babel-plugin-istanbul
   - **Razón**: La versión corregida (5.0.8) rompe compatibilidad con minimatch@9.0.9
   - **Impacto**: Solo afecta dependencias de desarrollo, no producción
   - **Mitigación**: El ataque requiere input controlado por el atacante en un test runner

### Dependencias

- **Total de dependencias**: 1024
- **Dependencias de producción**: 15
- **Dependencias de desarrollo**: 18

## Resultados de Auditoría

### pnpm audit

```
2 vulnerabilities found
Severity: 2 high
```

**Resultado**: 2 vulnerabilidades en dev dependencies (brace-expansion)

## Dependencias Principales - Estado Actualizado

### Producción

| Paquete | Versión Actual | Última Versión | Estado |
|---------|---------------|----------------|--------|
| next | 16.2.12 | 16.2.12 | Actualizado |
| react | 19.2.8 | 19.2.8 | Actualizado |
| react-dom | 19.2.8 | 19.2.8 | Actualizado |
| typescript | 5.9.3 | 7.0.2 | Actualización mayor disponible |
| axios | 1.18.1 | 1.18.1 | Actualizado |
| zustand | 5.0.14 | 5.0.14 | Actualizado |
| react-hook-form | 7.83.0 | 7.83.0 | Actualizado |

### Desarrollo

| Paquete | Versión Actual | Última Versión | Estado |
|---------|---------------|----------------|--------|
| cypress | 15.19.0 | 15.19.0 | Actualizado |
| jest | 30.2.0 | 30.4.2 | Actualización menor disponible |
| eslint | 9.39.3 | 10.8.0 | Actualización mayor disponible |
| @babel/core | 7.29.7 | 8.0.1 | Actualización mayor disponible |

## Análisis de Seguridad

### Riesgo Actual

- **Riesgo Crítico**: 0
- **Riesgo Alto**: 2 (dev dependencies solamente)
- **Riesgo Medio**: 0
- **Riesgo Bajo**: 0
- **Riesgo Total**: BAJO en producción

## Mejores Prácticas Implementadas

- **Lockfile estricto**: pnpm-lock.yaml actualizado
- **Auditoría automática**: Verificada con `pnpm audit`
- **Overrides de seguridad**: Configurados para forzar versiones seguras
- **Validación completa**: Build, Lint y Tests exitosos

## Comandos de Verificación

```bash
# Verificar vulnerabilidades
pnpm audit

# Validar integridad
pnpm lint && pnpm test-headless && pnpm cypress:component && pnpm build
```

---

**Generado**: 26 de julio de 2026  
**Estado**: SEGURO EN PRODUCCIÓN
