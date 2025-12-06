# ✅ Checklist para el Equipo - Migración a pnpm

## 🎯 Después del Merge a Main

### 1. Preparación (5 minutos)

- [ ] **Instalar pnpm globalmente**
  ```bash
  npm install -g pnpm
  ```

- [ ] **Verificar instalación**
  ```bash
  pnpm --version
  # Debe mostrar: 10.x.x o superior
  ```

### 2. Actualizar Repositorio Local (2 minutos)

- [ ] **Pull de main**
  ```bash
  git checkout main
  git pull origin main
  ```

- [ ] **Verificar que estás en la versión correcta**
  ```bash
  git log --oneline -1
  # Debe mostrar el último commit de la migración
  ```

### 3. Limpiar Instalación Anterior (1 minuto)

- [ ] **Eliminar node_modules y lockfile de npm**
  ```bash
  rm -rf node_modules package-lock.json
  ```

- [ ] **Verificar que se eliminaron**
  ```bash
  ls -la | grep -E "(node_modules|package-lock)"
  # No debe mostrar nada
  ```

### 4. Instalar con pnpm (2 minutos)

- [ ] **Instalar dependencias**
  ```bash
  pnpm install
  ```

- [ ] **Verificar instalación exitosa**
  ```bash
  # Debe mostrar: "881 packages installed"
  # Debe crear: node_modules/ y pnpm-lock.yaml
  ```

### 5. Verificar Funcionamiento (5 minutos)

- [ ] **Ejecutar linter**
  ```bash
  pnpm lint
  ```
  ✅ Debe pasar sin errores (4 warnings pre-existentes son normales)

- [ ] **Ejecutar tests**
  ```bash
  pnpm test-headless
  ```
  ✅ Debe mostrar: "25/25 tests passed"

- [ ] **Ejecutar build**
  ```bash
  pnpm build
  ```
  ✅ Debe completar sin errores

- [ ] **Ejecutar servidor de desarrollo**
  ```bash
  pnpm dev
  ```
  ✅ Debe abrir en http://localhost:3000

### 6. Verificar Seguridad (2 minutos)

- [ ] **Ejecutar auditoría**
  ```bash
  pnpm audit
  ```
  ✅ Debe mostrar: "0 vulnerabilities"

- [ ] **Verificar dependencias desactualizadas**
  ```bash
  pnpm outdated
  ```
  ℹ️ Puede mostrar algunas dependencias desactualizadas (normal)

---

## 📝 Comandos Nuevos a Recordar

### Instalación y Gestión de Paquetes

```bash
# Instalar dependencias
pnpm install

# Añadir dependencia de producción
pnpm add <paquete>

# Añadir dependencia de desarrollo
pnpm add -D <paquete>

# Eliminar dependencia
pnpm remove <paquete>

# Actualizar dependencias
pnpm update

# Actualizar a últimas versiones
pnpm update --latest
```

### Scripts del Proyecto

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Producción
pnpm start

# Tests
pnpm test              # Con watch mode
pnpm test-headless     # Sin watch mode
pnpm test-headless-cc  # Con coverage

# Linter
pnpm lint

# Seguridad
pnpm security          # Auditoría completa
pnpm security:audit    # Solo pnpm audit
pnpm security:outdated # Dependencias desactualizadas
```

---

## 🚨 Problemas Comunes

### Problema 1: "pnpm: command not found"

**Solución**:
```bash
npm install -g pnpm
```

### Problema 2: "ENOENT: no such file or directory, open 'pnpm-lock.yaml'"

**Solución**:
```bash
git pull origin main
pnpm install
```

### Problema 3: "Lockfile is up to date, resolution step is skipped"

**Esto es normal** - pnpm es más eficiente y solo reinstala si es necesario.

### Problema 4: Tests fallan después de la migración

**Solución**:
```bash
# Limpiar completamente
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm test-headless
```

### Problema 5: "Warning: Found multiple lockfiles"

**Solución**:
```bash
# Verificar que no haya package-lock.json
ls -la | grep package-lock
# Si existe, eliminarlo
rm package-lock.json
```

---

## 📚 Recursos

- **Guía rápida**: [QUICKSTART_PNPM.md](./QUICKSTART_PNPM.md)
- **Guía completa**: [MIGRATION_TO_PNPM.md](./MIGRATION_TO_PNPM.md)
- **Seguridad**: [SECURITY_SETUP.md](./SECURITY_SETUP.md)
- **Documentación pnpm**: https://pnpm.io/

---

## ✅ Confirmación Final

Una vez completados todos los pasos:

- [ ] ✅ pnpm instalado globalmente
- [ ] ✅ Repositorio actualizado a main
- [ ] ✅ node_modules y package-lock.json eliminados
- [ ] ✅ pnpm install ejecutado exitosamente
- [ ] ✅ Linter pasa
- [ ] ✅ Tests pasan (25/25)
- [ ] ✅ Build exitoso
- [ ] ✅ Servidor de desarrollo funciona
- [ ] ✅ Sin vulnerabilidades de seguridad

**¡Listo para trabajar con pnpm! 🎉**

---

## 💬 Soporte

Si tienes problemas:

1. Revisa la sección "Problemas Comunes" arriba
2. Consulta [MIGRATION_TO_PNPM.md](./MIGRATION_TO_PNPM.md) - Sección Troubleshooting
3. Pregunta en el canal del equipo
4. Revisa los logs de error y compártelos

---

**Tiempo estimado total**: ~15-20 minutos  
**Última actualización**: 6 de diciembre de 2025
