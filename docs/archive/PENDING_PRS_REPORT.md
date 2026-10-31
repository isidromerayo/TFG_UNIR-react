# 🔔 Reporte de Pull Requests Pendientes

**Fecha**: 6 de diciembre de 2024  
**Proyecto**: TFG_UNIR-react  
**Rama actual**: migrate-to-pnpm

## ⚠️ CRÍTICO - Acción Inmediata Requerida

### PR #15: [Snyk] Security upgrade next from 15.4.7 to 15.4.8

**Estado**: 🔴 ABIERTA  
**Prioridad**: 🔥 CRÍTICA  
**Creada**: Hace 2 días  
**URL**: https://github.com/isidromerayo/TFG_UNIR-react/pull/15

#### Vulnerabilidad

- **Tipo**: Arbitrary Code Injection
- **Severidad**: 🔴 CRÍTICA
- **Score**: 893/1000
- **CVE**: SNYK-JS-NEXT-14173355
- **Paquete afectado**: next
- **Versión actual**: 15.4.7
- **Versión segura**: 15.4.8

#### Descripción

Vulnerabilidad de inyección de código arbitrario en Next.js que permite a un atacante ejecutar código malicioso.

#### Acción Recomendada

**URGENTE**: Actualizar Next.js inmediatamente

```bash
# En la rama migrate-to-pnpm
pnpm update next@15.4.8

# Verificar
pnpm lint
pnpm test-headless
pnpm build

# Commit
git add pnpm-lock.yaml package.json
git commit -m "security: update next to 15.4.8 (fix critical vulnerability SNYK-JS-NEXT-14173355)"
```

**Alternativa**: Hacer merge de la PR #15 después de migrar a pnpm

---

## 📋 Otras Pull Requests Pendientes

### PR #14: [Snyk] Security upgrade axios

**Estado**: 🟡 ABIERTA  
**Prioridad**: Media  
**Creada**: Hace 2 meses  
**Paquete**: axios

**Nota**: Axios ya está actualizado a 1.13.2 en nuestra migración a pnpm

---

### PR #13: build(deps): bump axios

**Estado**: 🟡 ABIERTA  
**Prioridad**: Media  
**Creada**: Hace 2 meses  
**Paquete**: axios

**Nota**: Duplicado de #14, ya resuelto en migración a pnpm

---

### PR #12: [Snyk] Upgrade react-hook-form

**Estado**: 🟡 ABIERTA  
**Prioridad**: Baja  
**Creada**: Hace 2 meses  
**Paquete**: react-hook-form

**Estado actual**: Ya actualizado a 7.68.0 en migración a pnpm

---

### PR #11: [Snyk] Upgrade @types/node

**Estado**: � ABIERTA  
**Prioridad**: Baja  
**Creada**: Hace 2 meses  
**Paquete**: @types/node

**Estado actual**: Versión 24.0.3, disponible 24.10.1 (actualización menor)

---

### PR #10: [Snyk] Upgrade eslint-config-next

**Estado**: 🟡 ABIERTA  
**Prioridad**: Baja  
**Creada**: Hace 2 meses  
**Paquete**: eslint-config-next

**Estado actual**: Versión 15.5.7, disponible 16.0.7 (actualización mayor)

---

### PR #9: [Snyk] Upgrade sweetalert2

**Estado**: 🟡 ABIERTA  
**Prioridad**: Baja  
**Creada**: Hace 2 meses  
**Paquete**: sweetalert2

**Estado actual**: Ya actualizado a 11.26.4 en migración a pnpm

---

### PR #8: [Snyk] Upgrade typescript

**Estado**: 🟡 ABIERTA  
**Prioridad**: Baja  
**Creada**: Hace 2 meses  
**Paquete**: typescript

**Estado actual**: Versión 5.8.3, disponible 5.9.3 (actualización menor)

---

### PR #7: [Snyk] Upgrade jest

**Estado**: 🟡 ABIERTA  
**Prioridad**: Baja  
**Creada**: Hace 3 meses  
**Paquete**: jest

**Estado actual**: Ya actualizado a 30.2.0 en migración a pnpm

---

### PR #6: build(deps): bump next from 15.3.4 to 15.4.7

**Estado**: ✅ MERGED  
**Prioridad**: Alta  
**Creada**: Hace 3 meses  
**Paquete**: next

**Nota**: Ya mergeada, pero necesita actualización adicional a 15.4.8 (ver PR #15)

---

## 📊 Resumen de Estado

### Por Prioridad

| Prioridad | Cantidad | Estado |
|-----------|----------|--------|
| � Crítica | 1 | Pendiente (PR #15) |
| 🟡 Media | 2 | Resueltas en migración |
| 🟢 Baja | 6 | Mayoría resueltas en migración |

### Por Paquete

| Paquete | PRs | Estado Actual | Acción |
|---------|-----|---------------|--------|
| next | 2 (#15, #6) | 15.5.7 → 15.4.8 | ⚠️ ACTUALIZAR URGENTE |
| axios | 2 (#14, #13) | 1.13.2 | ✅ Actualizado |
| react-hook-form | 1 (#12) | 7.68.0 | ✅ Actualizado |
| @types/node | 1 (#11) | 24.0.3 → 24.10.1 | 🟡 Actualizar (menor) |
| eslint-config-next | 1 (#10) | 15.5.7 → 16.0.7 | 🟡 Revisar (mayor) |
| sweetalert2 | 1 (#9) | 11.26.4 | ✅ Actualizado |
| typescript | 1 (#8) | 5.8.3 → 5.9.3 | 🟡 Actualizar (menor) |
| jest | 1 (#7) | 30.2.0 | ✅ Actualizado |

## 🎯 Plan de Acción

### Inmediato (Hoy)

1. **Actualizar Next.js a 15.4.8** (CRÍTICO)
   ```bash
   pnpm update next@15.4.8
   pnpm lint && pnpm test-headless && pnpm build
   git commit -m "security: update next to 15.4.8"
   ```

2. **Cerrar PRs obsoletas**
   - #14, #13 (axios ya actualizado)
   - #12 (react-hook-form ya actualizado)
   - #9 (sweetalert2 ya actualizado)
   - #7 (jest ya actualizado)

### Corto Plazo (Esta Semana)

3. **Actualizar dependencias menores**
   ```bash
   pnpm update @types/node typescript
   pnpm lint && pnpm test-headless && pnpm build
   ```

4. **Revisar PR #10** (eslint-config-next)
   - Evaluar impacto de actualización mayor
   - Decidir si actualizar ahora o esperar

### Medio Plazo (Próximas 2 Semanas)

5. **Configurar Dependabot/Snyk**
   - Configurar auto-merge para parches de seguridad
   - Configurar notificaciones para vulnerabilidades críticas

6. **Establecer proceso de revisión**
   - Revisar PRs de seguridad semanalmente
   - Actualizar dependencias mensualmente

## 🔒 Impacto en Migración a pnpm

### PRs que Afectan la Migración

**PR #15 (Next.js 15.4.8)**: 
- ⚠️ Debe aplicarse DESPUÉS de completar la migración a pnpm
- Conflicto: PR usa package-lock.json, nosotros usamos pnpm-lock.yaml
- Solución: Actualizar manualmente con pnpm

### PRs Resueltas por la Migración

Las siguientes PRs ya están resueltas en nuestra rama `migrate-to-pnpm`:
- ✅ #14, #13 (axios)
- ✅ #12 (react-hook-form)
- ✅ #9 (sweetalert2)
- ✅ #7 (jest)

## 📝 Comandos para Cerrar PRs

```bash
# Cerrar PRs obsoletas (después de verificar)
gh pr close 14 --comment "Resuelto en migración a pnpm (axios 1.13.2)"
gh pr close 13 --comment "Resuelto en migración a pnpm (axios 1.13.2)"
gh pr close 12 --comment "Resuelto en migración a pnpm (react-hook-form 7.68.0)"
gh pr close 9 --comment "Resuelto en migración a pnpm (sweetalert2 11.26.4)"
gh pr close 7 --comment "Resuelto en migración a pnpm (jest 30.2.0)"
```

## ⚠️ Advertencias

### Conflictos con package-lock.json

Todas las PRs de Snyk/Dependabot modifican `package-lock.json`, pero nuestra migración usa `pnpm-lock.yaml`.

**Solución**:
1. NO hacer merge directo de las PRs
2. Aplicar actualizaciones manualmente con pnpm
3. Cerrar PRs con comentario explicativo

### Versión de Next.js

**IMPORTANTE**: Nuestra versión actual (15.5.7) es MÁS NUEVA que la de la PR #15 (15.4.8), pero la PR #15 corrige una vulnerabilidad crítica que podría estar presente en 15.5.7.

**Acción**: Verificar si 15.5.7 incluye el fix de la vulnerabilidad SNYK-JS-NEXT-14173355

```bash
# Verificar changelog de Next.js 15.5.x
open https://github.com/vercel/next.js/releases
```

## 🔍 Verificación de Vulnerabilidades

### Comando para Verificar

```bash
# Con pnpm
pnpm audit

# Verificar Next.js específicamente
pnpm why next
```

### Estado Actual

Según nuestra auditoría:
- ✅ 0 vulnerabilidades conocidas
- ⚠️ Pero PR #15 indica vulnerabilidad crítica en Next.js

**Acción**: Re-auditar después de actualizar Next.js

## 📚 Referencias

- [Snyk Vulnerability Database](https://snyk.io/vuln/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [GitHub Security Advisories](https://github.com/advisories)
- [CVE Details](https://www.cvedetails.com/)

---

**Generado**: 6 de diciembre de 2024  
**Última actualización**: 6 de diciembre de 2024  
**Próxima revisión**: 7 de diciembre de 2024
