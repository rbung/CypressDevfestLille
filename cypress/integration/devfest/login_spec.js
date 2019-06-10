describe('Login page', function() {
  // TODO Refactor me to avoid duplication ! 😏

  it('should display nicely', function() {
    cy.visit('/login')
    cy.contains('Sign In').should('be.visible')
    cy.get('input[type=email]').should('be.visible')
    cy.get('input[type=password]').should('be.visible')
    cy.get('button[type=submit]').should('be.visible')
  })

  it('should display error message when empty email and password are submitted', function() {
    cy.visit('/login')
    cy.get('button[type=submit]').click()
    cy.contains('email or password is invalid').should('be.visible')
  })

  it('should display error message when password is empty', function() {
    cy.visit('/login')
    cy.get('input[type=email]').type('test@test.com{enter}')
    cy.contains('email or password is invalid').should('be.visible')
  })

  it('should display error message when email is empty', function() {
    cy.visit('/login')
    cy.get('input[type=password]').type('password{enter}')
    cy.contains('email or password is invalid').should('be.visible')
  })

  it('should display error message when login failed', function() {
    cy.visit('/login')
    cy.get('input[type=email]').type('breizh@camp.fr')
    cy.get('input[type=password]').type('wrong{enter}')
    cy.contains('email or password is invalid').should('be.visible')
  })

  it('should redirect to homepage when logging is successful', function() {
    cy.visit('/login')
    cy.get('input[type=email]').type('devfest@lille.fr')
    cy.get('input[type=password]').type('Lille1234{enter}')
    cy.url().should('contain', '/')
    cy.contains('Devfest Lille').should('be.visible')
  })
})
