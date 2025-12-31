import HeaderComponent from '../../components/HeaderComponent'

describe('Coverage Instrumentation Test', () => {
  it('should have coverage instrumentation available', () => {
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

    // Mock API response
    cy.intercept('GET', '**/categorias*', {
      statusCode: 200,
      body: {
        _embedded: {
          categorias: []
        }
      }
    }).as('getCategorias')

    // Mount component
    cy.mount(<HeaderComponent />)
    cy.wait('@getCategorias')

    // Check if coverage instrumentation is available
    cy.window().then((win) => {
      // Log coverage object for debugging
      cy.log('Coverage object:', win.__coverage__)
      
      if (win.__coverage__) {
        cy.log('✅ Coverage instrumentation is working!')
        cy.log('Instrumented files:', Object.keys(win.__coverage__))
      } else {
        cy.log('❌ Coverage instrumentation not found')
      }
      
      // This assertion will help us see what's happening
      expect(win.__coverage__).to.exist
    })
  })
})