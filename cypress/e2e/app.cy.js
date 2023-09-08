describe('Navigation', () => {
    it('should navigate to the home page', () => {
      // Start from the index page
      cy.visit('http://localhost:3000/')
   
      cy.get('h2').contains('Encuentra tu curso')
    })
  })