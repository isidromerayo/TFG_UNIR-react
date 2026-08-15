# Plan: SonarCloud como job dedicado en CI (como Angular)

- **Fecha:** 2026-08-15
- **Herramienta/modelo:** opencode / big-pickle
- **Estado:** done

## Objetivos

Que SonarQube se ejecute en TFG_UNIR-react igual que en TFG_UNIR-angular:
un job dedicado "SonarCloud Analysis" visible en las PRs, con cobertura reportada
y sin fallos silenciosos.

## Problema detectado

- El análisis se lanzaba dentro del job `build` de `node.js.yml` con
  `continue-on-error: true`, ocultando el fallo real: HTTP 403 al consultar
  `api.sonarcloud.io/analysis/jres` (token inválido).
- No aparecía check `SonarCloud Analysis` en las PRs.
- No se descargaba la cobertura Jest/Cypress para reportarla.
- Codacy marcaba falso positivo de "API Key detected" en los workflows.

## Cambios de archivos

| Archivo | Cambio |
| --- | --- |
| `.github/workflows/tests.yml` | Nuevo job `sonarqube` (SonarCloud Analysis): descarga `jest-coverage` y `cypress-coverage`, los fusiona en `coverage/merged/lcov.info` y ejecuta `SonarQube Scan` con guard `if: env.SONAR_TOKEN != ''` y `fetch-depth: 0` |
| `.github/workflows/node.js.yml` | Eliminado el paso `SonarQube Scan` del job `build` (duplicado y silencioso) |
| `.codacy.yaml` | Excluye `.github/workflows/**` del detector de secrets (falso positivo en CI), igual que TFG_UNIR-angular |

## Verificación

- YAML validado con PyYAML (6 jobs: unit-tests, component-tests, e2e-tests, coverage-report, test-summary, sonarqube)
- Checks de la PR: CodeQL ✓, Analyze ✓, Unit Tests ✓, Snyk ✓

## Pendiente del usuario

- Regenerar/verificar `SONAR_TOKEN` en Settings → Secrets del repo `TFG_UNIR-react`
  (el actual devuelve HTTP 403 en SonarCloud).

## Estado

- [x] planned
- [x] in progress
- [x] done
