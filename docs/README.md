# 📚 Índice de documentación — TFG UNIR React

Todo el material documental vive bajo `docs/`. Este índice es el punto de entrada.

## Primeros pasos

- **[README.md](../README.md)** — Documentación principal del proyecto: tecnologías, instalación, scripts disponibles y guías de desarrollo
- **[AGENTS.md](../AGENTS.md)** — Contexto completo del proyecto para agentes IA (comandos, gates, convenciones)

## Guías

- **[guides/nextjs-16-upgrade.md](guides/nextjs-16-upgrade.md)** — Cambios de la actualización a Next.js 16 y validaciones realizadas
- **[guides/quickstart-pnpm.md](guides/quickstart-pnpm.md)** — Guía rápida de pnpm: comandos esenciales y equivalencias npm → pnpm
- **[guides/checklist-equipo.md](guides/checklist-equipo.md)** — Checklist del equipo: pasos post-merge, verificación de instalación, problemas comunes
- **[guides/sonarqube-setup.md](guides/sonarqube-setup.md)** — Configuración de SonarQube, comandos de cobertura e integración con CI/CD
- **[guides/dependency-update-guide.md](guides/dependency-update-guide.md)** — Guía de actualización de dependencias y gestión de overrides
- **[guides/versioning-guide.md](guides/versioning-guide.md)** — Versionado, ramas de release y etiquetado
- **[guides/security-setup.md](guides/security-setup.md)** — Configuración del flujo de seguridad (audit, Snyk, OSV, advisories aceptados)

## Seguridad

- **[security/security-audit-analysis.md](security/security-audit-analysis.md)** — Qué cubre y qué no cubre `pnpm audit`, y sus limitaciones
- **[security/accepted-advisories.md](security/accepted-advisories.md)** — Registro de advisories aceptados: solo aquellos sin versión parcheada publicada
- **[security/pnpm-audit-unfixable-cves.md](security/pnpm-audit-unfixable-cves.md)** — Cómo silenciar un CVE sin parche de forma quirúrgica

## Accesibilidad

- **[accessibility.md](accessibility.md)** — Auditoría pa11y (htmlcs + axe, WCAG2AA), política de upgrade del stack y job de CI

## Planes de trabajo

- **[plans/](plans/)** — Registros de ejecución de los cambios no triviales, con el formato `YYYY-MM-DD-descripción.md`

## Archivo histórico

- **[archive/](archive/)** — Documentación superada que se conserva por trazabilidad: migración a pnpm, changelog y resumen de la migración, reportes de auditoría de dependencias, análisis de PRs pendientes y plantillas de PR y de seguridad
