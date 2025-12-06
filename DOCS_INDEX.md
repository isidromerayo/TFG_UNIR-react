# 📚 Índice de Documentación - TFG UNIR React

## 📖 Documentación Principal

### Para Empezar

1. **[README.md](./README.md)** - Documentación principal del proyecto
   - Tecnologías utilizadas
   - Instalación y configuración
   - Scripts disponibles
   - Guías de desarrollo

2. **[QUICKSTART_PNPM.md](./QUICKSTART_PNPM.md)** - Guía rápida de pnpm
   - Comandos esenciales
   - Equivalencias npm → pnpm
   - Tips y trucos

3. **[CHECKLIST_EQUIPO.md](./CHECKLIST_EQUIPO.md)** - Checklist para el equipo
   - Pasos post-merge
   - Verificación de instalación
   - Problemas comunes

---

## 🔄 Migración a pnpm

### Documentación de Migración

1. **[MIGRATION_TO_PNPM.md](./MIGRATION_TO_PNPM.md)** - Guía completa de migración
   - Por qué pnpm
   - Proceso de migración
   - Comparativa npm vs pnpm
   - Troubleshooting

2. **[CHANGELOG_PNPM.md](./CHANGELOG_PNPM.md)** - Changelog de la migración
   - Cambios realizados
   - Breaking changes
   - Nuevas features

3. **[RESUMEN_MIGRACION_PNPM.md](./RESUMEN_MIGRACION_PNPM.md)** - Resumen ejecutivo
   - Resultados de la migración
   - Métricas
   - Estado actual

---

## 🔒 Seguridad

### Documentación de Seguridad

1. **[SECURITY_SETUP.md](./SECURITY_SETUP.md)** - Configuración de seguridad
   - Infraestructura multi-capa
   - Workflows de GitHub Actions
   - Scripts locales
   - Dependabot

2. **[SECURITY_AUDIT_ANALYSIS.md](./SECURITY_AUDIT_ANALYSIS.md)** - Análisis de herramientas
   - Comparativa de herramientas de auditoría
   - Limitaciones de pnpm audit
   - Por qué necesitamos múltiples herramientas
   - Estrategia recomendada

3. **[AUDIT_REPORT.md](./AUDIT_REPORT.md)** - Reporte de auditoría
   - Estado actual de vulnerabilidades
   - Vulnerabilidades corregidas
   - Historial de auditorías

4. **[DEPENDENCY_UPDATE_GUIDE.md](./DEPENDENCY_UPDATE_GUIDE.md)** - Guía de actualizaciones
   - Estrategias de actualización
   - Comandos útiles
   - Checklist de verificación
   - Mejores prácticas

5. **[PENDING_PRS_REPORT.md](./PENDING_PRS_REPORT.md)** - Análisis de PRs pendientes
   - PRs de Dependabot
   - Recomendaciones de merge
   - Priorización

---

## 🤖 Para Agentes IA

1. **[AGENTS.md](./AGENTS.md)** - Contexto completo del proyecto
   - Arquitectura del proyecto
   - Estructura de archivos
   - Convenciones de código
   - Guías de desarrollo
   - Contexto técnico completo

---

## 📋 Pull Request

1. **[PULL_REQUEST.md](./PULL_REQUEST.md)** - Documentación de la PR
   - Descripción de cambios
   - Métricas
   - Checklist
   - Guía de revisión

---

## 📂 Estructura de Documentación

```
TFG_UNIR-react/
├── README.md                          # Documentación principal
├── DOCS_INDEX.md                      # Este archivo - Índice de documentación
│
├── Migración a pnpm/
│   ├── MIGRATION_TO_PNPM.md          # Guía completa
│   ├── CHANGELOG_PNPM.md             # Changelog
│   ├── RESUMEN_MIGRACION_PNPM.md     # Resumen ejecutivo
│   └── QUICKSTART_PNPM.md            # Guía rápida
│
├── Seguridad/
│   ├── SECURITY_SETUP.md             # Configuración
│   ├── SECURITY_AUDIT_ANALYSIS.md    # Análisis de herramientas
│   ├── AUDIT_REPORT.md               # Reporte de auditoría
│   ├── DEPENDENCY_UPDATE_GUIDE.md    # Guía de actualizaciones
│   └── PENDING_PRS_REPORT.md         # PRs pendientes
│
├── Equipo/
│   └── CHECKLIST_EQUIPO.md           # Checklist post-merge
│
├── Agentes IA/
│   └── AGENTS.md                     # Contexto completo
│
└── Pull Request/
    └── PULL_REQUEST.md               # Documentación de PR
```

---

## 🎯 Guías por Rol

### Para Desarrolladores

**Primeros pasos**:
1. [README.md](./README.md) - Visión general
2. [QUICKSTART_PNPM.md](./QUICKSTART_PNPM.md) - Comandos básicos
3. [CHECKLIST_EQUIPO.md](./CHECKLIST_EQUIPO.md) - Setup inicial

**Desarrollo diario**:
- [README.md](./README.md) - Scripts y comandos
- [DEPENDENCY_UPDATE_GUIDE.md](./DEPENDENCY_UPDATE_GUIDE.md) - Actualizar dependencias

### Para DevOps/SRE

**Infraestructura**:
1. [SECURITY_SETUP.md](./SECURITY_SETUP.md) - Configuración de seguridad
2. [MIGRATION_TO_PNPM.md](./MIGRATION_TO_PNPM.md) - Detalles técnicos
3. [SECURITY_AUDIT_ANALYSIS.md](./SECURITY_AUDIT_ANALYSIS.md) - Estrategia de seguridad

**Monitoreo**:
- [AUDIT_REPORT.md](./AUDIT_REPORT.md) - Estado de seguridad
- [PENDING_PRS_REPORT.md](./PENDING_PRS_REPORT.md) - PRs pendientes

### Para Tech Leads

**Revisión**:
1. [PULL_REQUEST.md](./PULL_REQUEST.md) - Resumen de cambios
2. [RESUMEN_MIGRACION_PNPM.md](./RESUMEN_MIGRACION_PNPM.md) - Métricas
3. [SECURITY_SETUP.md](./SECURITY_SETUP.md) - Estrategia de seguridad

**Planificación**:
- [DEPENDENCY_UPDATE_GUIDE.md](./DEPENDENCY_UPDATE_GUIDE.md) - Estrategia de actualizaciones
- [PENDING_PRS_REPORT.md](./PENDING_PRS_REPORT.md) - Trabajo pendiente

### Para Agentes IA

**Contexto completo**:
1. [AGENTS.md](./AGENTS.md) - Contexto técnico completo
2. [README.md](./README.md) - Documentación principal
3. Todos los demás documentos según necesidad

---

## 📊 Estadísticas de Documentación

| Categoría | Archivos | Tamaño Total |
|-----------|----------|--------------|
| Migración | 4 | ~17 KB |
| Seguridad | 5 | ~40 KB |
| Equipo | 1 | ~5 KB |
| Agentes IA | 1 | ~15 KB |
| Pull Request | 1 | ~12 KB |
| **Total** | **12** | **~89 KB** |

---

## 🔄 Mantenimiento de Documentación

### Actualizar Documentación

Cuando hagas cambios significativos:

1. Actualiza el documento relevante
2. Actualiza el CHANGELOG si aplica
3. Actualiza este índice si añades/eliminas documentos
4. Actualiza README.md si cambian comandos o scripts

### Documentos Vivos

Estos documentos deben actualizarse regularmente:

- **AUDIT_REPORT.md** - Después de cada auditoría
- **PENDING_PRS_REPORT.md** - Cuando cambien las PRs
- **CHANGELOG_PNPM.md** - Con cada cambio relacionado a pnpm

---

## 📞 Contacto y Soporte

Si encuentras errores en la documentación o necesitas aclaraciones:

1. Revisa primero el documento relevante
2. Consulta la sección de Troubleshooting
3. Pregunta en el canal del equipo
4. Crea un issue en GitHub

---

**Última actualización**: 6 de diciembre de 2025  
**Versión**: 1.0.0  
**Mantenedor**: @isidromerayo
