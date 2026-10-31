# 🔖 Guía de Gestión de Versiones

Este documento describe las opciones y el flujo de trabajo recomendado para gestionar el versionado del proyecto **TFG UNIR - Frontend React (Next.js)**.

## 📊 Estado Actual
- **Versión Actual**: `0.2.2` (definida en `package.json`)
- **Tags existentes**: `v0.2.2`, `v0.2.0`
- **Convención de Mensajes**: Se recomienda seguir [Conventional Commits](https://www.conventionalcommits.org/).

> ⚠️ **Gotcha**: el tag `v0.2.1` fue eliminado (local y remoto) porque estaba mal etiquetado — apuntaba a un commit cuya `package.json` aún decía `0.2.0`. No recrear tags a la ligera.

---

## 🛠️ Opciones de Gestión

### 1. Gestión Manual (Básica) — la usada en este proyecto
Ideal para control total sin dependencias extra.

*   **Comandos**:
    ```bash
    # Bump patch (Correcciones): 0.2.0 -> 0.2.1
    pnpm version patch
    # Bump minor (Nuevas funcionalidades): 0.2.0 -> 0.3.0
    pnpm version minor
    # Bump major (Breaking changes): 0.2.0 -> 1.0.0
    pnpm version major
    ```
*   **Procedimiento seguido en la práctica** (evita colisiones con tags existentes):
    ```bash
    # 1. Fijar la versión explícitamente SIN crear commit/tag automático
    pnpm version 0.2.2 --no-git-tag-version

    # 2. Commit y tag manuales
    git add package.json
    git commit -m "chore(release): 0.2.2"
    git tag v0.2.2

    # 3. Subir main y el tag
    git push origin main
    git push origin v0.2.2
    ```
    **Ojo**: `pnpm version patch` sobre `0.2.0` produce `0.2.1`. Si ya existe un tag `v0.2.1` (aunque sea malo), usar siempre `pnpm version <X.Y.Z>` explícito para evitarlo.
*   **Pros**: Simple, sin configuración.
*   **Contras**: No hay CHANGELOG automático.

### 2. Automatización Local (Alternativa)
Uso de `standard-version` para automatizar el versionado y el historial de cambios.

*   **Instalación**: `pnpm add -D standard-version`
*   **Script en package.json**: `"release": "standard-version"`
*   **Uso**:
    ```bash
    pnpm run release
    ```
*   **Qué hace**:
    1. Analiza commits desde el último tag.
    2. Sube la versión según el tipo de cambios (`feat`, `fix`).
    3. Genera/Actualiza `CHANGELOG.md`.
    4. Crea commit y tag de Git.
*   **Pros**: Historial profesional y automático.

### 3. Automatización Total (CI/CD)
Uso de `semantic-release` en GitHub Actions.

*   **Flujo**: Al hacer merge en `main`, un runner de GitHub gestiona todo.
*   **Pros**: Elimina la necesidad de gestionar versiones localmente. Totalmente desatendido.
*   **Contras**: Configuración inicial más compleja.

---

## 🚀 Flujo de Trabajo Sugerido

Para este proyecto se recomienda la **Opción 1** (manual) combinada con **Conventional Commits**:

1.  **Desarrollo**: Realizar commits descriptivos:
    - `feat: añadir sistema de valoraciones`
    - `fix(security): resolver vulnerabilidad en ...`
2.  **Release**: Cuando el código esté listo en `main`:
    ```bash
    pnpm version <X.Y.Z> --no-git-tag-version
    git add package.json && git commit -m "chore(release): X.Y.Z"
    git tag vX.Y.Z
    git push origin main
    git push origin vX.Y.Z
    ```

---

## ✅ Checklist para una Release
- [ ] Todos los tests pasan (`pnpm test-headless`)
- [ ] El build es exitoso (`pnpm run build`)
- [ ] `pnpm lint` pasa
- [ ] La rama está al día con la principal (`main`)
- [ ] `package.json` y el tag `vX.Y.Z` coinciden en versión

> **Nota**: `pnpm audit` está retirado en este proyecto (HTTP 410). Para dependencias desactualizadas usar `pnpm outdated`. Para parches de seguridad de transitivas, usar `pnpm.overrides` en `package.json` (ver `AGENTS.md`).
