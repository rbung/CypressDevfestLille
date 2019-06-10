describe('Navigation', function() {
  it('should navigate through all the pages', function() {
    cy.log('Visit homepage')
    cy.visit('/')
    cy.title().should('eq', 'Conduit')
    cy.get('.article-meta').should('have.length', 10)
    cy.get('.tag-list').should('have.length.above', 1)

    // TODO Add some assertions ! You can play with the selector playground.
    cy.log('Visit author page')
    cy.get('.author')
      .first()
      .click()

    cy.log('Visit article page')
    cy.visit('/')
    cy.get('.preview-link > h1')
      .eq(2)
      .click()
    cy.url().should('contain', 'article')
    cy.get('.banner').should('exist')
    cy.get('.article-content').should('exist')

    cy.log('Logging in')
    cy.visit('/login')
    cy.get('input[type=email]').type('devfest@lille.fr')
    cy.get('input[type=password]').type('Lille1234{enter}')
    cy.url().should('contain', '/')
    cy.contains('Devfest Lille').should('exist')
  })
})
