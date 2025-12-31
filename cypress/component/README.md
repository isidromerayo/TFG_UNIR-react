# Cypress Component Testing

Este directorio contiene tests de componentes React usando `@cypress/react`.

## ¿Qué es Component Testing?

Los tests de componentes permiten probar componentes React de forma aislada, similar a Jest + React Testing Library, pero con las ventajas del entorno visual de Cypress:

- **Navegador real**: Los componentes se ejecutan en un navegador real
- **Debugging visual**: Time-travel debugging y inspección visual
- **API familiar**: Usa la misma API de Cypress que conoces
- **Mocking avanzado**: Interceptación de requests y mocking de APIs

## Tests Disponibles

### HeaderComponent.cy.tsx

Test completo del componente de cabecera con **13 casos de prueba**:

- ✅ **Loading State**: Comportamiento durante carga de datos
- ✅ **Basic Rendering**: Elementos principales y navegación
- ✅ **Authentication States**: Usuario autenticado vs no autenticado
- ✅ **API Error Handling**: Manejo de errores de API
- ✅ **Mobile Navigation**: Elementos de navegación móvil
- ✅ **Accessibility**: Textos alt, estructura semántica
- ✅ **Logout Functionality**: Funcionalidad de cierre de sesión

## Comandos Disponibles

```bash
# Ejecutar todos los tests de componentes (headless)
pnpm cypress:component

# Abrir Cypress en modo interactivo
pnpm cypress:open

# Ejecutar test específico
pnpm cypress run --component --spec "cypress/component/HeaderComponent.cy.tsx"

# Ejecutar todos los tests (Jest + Cypress)
pnpm test:all
```

## Estructura de un Test de Componente

```typescript
import MyComponent from '../../components/MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    // Setup mocks, localStorage, etc.
    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  it('should render correctly', () => {
    // Mock API calls
    cy.intercept('GET', '/api/data', { fixture: 'data.json' }).as('getData')
    
    // Mount component
    cy.mount(<MyComponent />)
    
    // Wait for API call
    cy.wait('@getData')
    
    // Assertions
    cy.get('[data-cy=title]').should('be.visible')
    cy.contains('Expected Text').should('exist')
  })
})
```

## Mejores Prácticas

### 1. Mocking de APIs
```typescript
// Interceptar llamadas a API
cy.intercept('GET', '**/categorias*', {
  statusCode: 200,
  body: { _embedded: { categorias: [] } }
}).as('getCategorias')

// Esperar la llamada
cy.wait('@getCategorias')
```

### 2. Mocking de Next.js Router
```typescript
beforeEach(() => {
  cy.stub(require('next/router'), 'useRouter').returns({
    push: cy.stub(),
    pathname: '/',
    query: {},
    asPath: '/',
  })
})
```

### 3. Manejo de localStorage
```typescript
beforeEach(() => {
  cy.window().then((win) => {
    win.localStorage.clear()
    // o establecer valores específicos
    win.localStorage.setItem('token', 'fake-token')
  })
})
```

### 4. Testing de Estados de Autenticación
```typescript
context('Authenticated User', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token')
    })
    cy.mount(<HeaderComponent />)
  })

  it('should show private area', () => {
    cy.contains('Privado').should('be.visible')
  })
})
```

## Comparación: Component Tests vs Unit Tests

| Aspecto | Cypress Component | Jest + RTL |
|---------|-------------------|------------|
| **Entorno** | Navegador real | jsdom simulado |
| **Velocidad** | Más lento (~2s) | Más rápido (~11s para 87 tests) |
| **Debugging** | Visual, interactivo | Console logs |
| **Realismo** | Muy alto | Alto |
| **Mocking** | Interceptación real | Mocks de módulos |
| **Uso recomendado** | Componentes complejos | Tests unitarios rápidos |

## Cuándo Usar Component Tests

✅ **Usar para**:
- Componentes con lógica compleja de UI
- Integración con APIs
- Comportamientos de autenticación
- Flujos de navegación
- Testing visual de componentes

❌ **No usar para**:
- Lógica pura (utils, helpers)
- Tests unitarios simples
- Cobertura masiva de casos

## Configuración

La configuración está en:
- `cypress.config.ts`: Configuración principal
- `cypress/support/component.ts`: Setup de component testing
- `package.json`: Scripts de ejecución

## Próximos Pasos

Para expandir los tests de componentes:

1. **Crear tests para otros componentes**:
   - `FooterComponent.cy.tsx`
   - `SliderComponent.cy.tsx`
   - `MenuCategoriaComponent.cy.tsx`

2. **Agregar tests de integración**:
   - Flujos completos de usuario
   - Interacciones entre componentes

3. **Mejorar cobertura**:
   - Estados de error específicos
   - Casos edge
   - Responsive design

## Recursos

- [Cypress Component Testing Docs](https://docs.cypress.io/guides/component-testing/overview)
- [@cypress/react Documentation](https://github.com/cypress-io/cypress/tree/develop/npm/react)
- [Next.js + Cypress Guide](https://nextjs.org/docs/testing#cypress)