import HeaderComponent from '../../components/HeaderComponent'

describe('HeaderComponent', () => {
  beforeEach(() => {
    // Mock Next.js router
    cy.stub(require('next/router'), 'useRouter').returns({
      push: cy.stub(),
      pathname: '/',
      query: {},
      asPath: '/',
    })
    
    // Clear localStorage
    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  context('Loading State', () => {
    it('should show loading message initially', () => {
      // Intercept API call with delay to see loading state
      cy.intercept('GET', '**/categorias*', {
        delay: 500,
        body: {
          _embedded: {
            categorias: []
          }
        }
      }).as('getCategorias')

      cy.mount(<HeaderComponent />)
      
      // Should show loading message initially
      cy.contains('...Data Loading.....').should('be.visible')
      
      // Wait for API call to complete
      cy.wait('@getCategorias')
      
      // Loading should disappear
      cy.contains('...Data Loading.....').should('not.exist')
    })
  })

  context('Basic Rendering', () => {
    beforeEach(() => {
      // Mock successful API response
      cy.intercept('GET', '**/categorias*', {
        statusCode: 200,
        body: {
          _embedded: {
            categorias: [
              {
                id: 1,
                nombre: 'Desarrollo Web',
                descripcion: 'Cursos de desarrollo web'
              }
            ]
          }
        }
      }).as('getCategorias')

      cy.mount(<HeaderComponent />)
      cy.wait('@getCategorias')
    })

    it('should render main header elements', () => {
      // Check header structure
      cy.get('header#header').should('be.visible')
      cy.get('nav#navbar').should('be.visible')
      
      // Check logos
      cy.get('img[alt="Logo React"]').should('be.visible')
      cy.get('img[alt="Logo UNIR"]').should('be.visible')
      
      // Check title
      cy.contains('TFG - FFJ: AEP').should('be.visible')
    })

    it('should render navigation menu', () => {
      cy.get('nav#navbar ul').should('exist')
      
      // Check main navigation items
      cy.contains('Home').should('be.visible')
      cy.contains('Categorias').should('be.visible')
      cy.get('a[href="/carrito"]').should('be.visible')
    })

    it('should show navigation elements', () => {
      // Check that navigation exists and has expected structure
      cy.get('nav#navbar ul').should('exist')
      
      // Should have either authenticated or unauthenticated menu
      cy.get('nav#navbar').should('contain.text', 'Home')
      cy.get('nav#navbar').should('contain.text', 'Categorias')
      
      // Should have either "Registro" or "Privado" (depending on auth state)
      cy.get('nav#navbar').then(($nav) => {
        const text = $nav.text()
        expect(text).to.satisfy((str: string) => 
          str.includes('Registro') || str.includes('Privado')
        )
      })
    })
  })

  context('Authenticated User State', () => {
    beforeEach(() => {
      // Set token in localStorage to simulate authenticated user
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-jwt-token')
      })

      cy.intercept('GET', '**/categorias*', {
        statusCode: 200,
        body: {
          _embedded: {
            categorias: []
          }
        }
      }).as('getCategorias')

      cy.mount(<HeaderComponent />)
      cy.wait('@getCategorias')
    })

    it('should show private area for authenticated users', () => {
      // Should show private area
      cy.contains('Privado').should('be.visible')
      
      // Should not show registration/login links
      cy.get('a[href="/registro"]').should('not.exist')
      cy.get('a[href="/acceso"]').should('not.exist')
    })

    it('should have private area links', () => {
      // Check that private area dropdown exists
      cy.get('a[href="/mis-datos"]').should('exist')
      cy.get('a[href="/mis-cursos"]').should('exist')
      cy.contains('desconectar').should('exist')
    })
  })

  context('API Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Mock API error
      cy.intercept('GET', '**/categorias*', {
        statusCode: 500,
        body: { message: 'Internal Server Error' }
      }).as('getCategorias')

      cy.mount(<HeaderComponent />)
      cy.wait('@getCategorias')

      // Component should still render main elements (it shows loading state on error)
      cy.contains('...Data Loading.....').should('be.visible')
    })

    it('should handle empty categories response', () => {
      cy.intercept('GET', '**/categorias*', {
        statusCode: 200,
        body: {
          _embedded: {
            categorias: []
          }
        }
      }).as('getCategorias')

      cy.mount(<HeaderComponent />)
      cy.wait('@getCategorias')

      // Component should render normally
      cy.get('nav#navbar').should('be.visible')
      cy.contains('Categorias').should('be.visible')
    })
  })

  context('Mobile Navigation Elements', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/categorias*', {
        statusCode: 200,
        body: { _embedded: { categorias: [] } }
      }).as('getCategorias')

      cy.mount(<HeaderComponent />)
      cy.wait('@getCategorias')
    })

    it('should have mobile navigation toggles', () => {
      // Check mobile navigation elements exist
      cy.get('.mobile-nav-toggle.mobile-nav-show').should('exist')
      cy.get('.mobile-nav-toggle.mobile-nav-hide').should('exist')
    })
  })

  context('Accessibility Features', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/categorias*', {
        statusCode: 200,
        body: { _embedded: { categorias: [] } }
      }).as('getCategorias')

      cy.mount(<HeaderComponent />)
      cy.wait('@getCategorias')
    })

    it('should have proper image alt texts', () => {
      cy.get('img[alt="Logo React"]').should('exist')
      cy.get('img[alt="Logo UNIR"]').should('exist')
    })

    it('should have proper link titles', () => {
      cy.get('a[href="/carrito"]').should('have.attr', 'title', 'carrito de la compra')
    })

    it('should have proper semantic structure', () => {
      cy.get('header#header').should('exist')
      cy.get('nav#navbar').should('exist')
      cy.get('nav#navbar ul').should('exist')
    })
  })

  context('Logout Functionality', () => {
    it('should have logout link when authenticated', () => {
      // Set up authenticated state
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-jwt-token')
      })

      cy.intercept('GET', '**/categorias*', {
        statusCode: 200,
        body: { _embedded: { categorias: [] } }
      }).as('getCategorias')

      cy.mount(<HeaderComponent />)
      cy.wait('@getCategorias')

      // Should have logout link
      cy.contains('desconectar').should('be.visible')
      
      // Should be clickable
      cy.contains('desconectar').should('not.be.disabled')
    })
  })
})