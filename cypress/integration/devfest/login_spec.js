describe('Login page', function() {
  beforeEach(function() {
    cy.visit('/login')
  })

  function shouldShowErrorMessage() {
    cy.contains('email or password is invalid').should('be.visible')
  }

  it('should display nicely', function() {
    cy.contains('Sign In').should('exist')
    cy.get('input[type=email]').should('be.visible')
    cy.get('input[type=password]').should('be.visible')
    cy.get('button[type=submit]').should('be.visible')
  })

  it('should display error message when empty email and password are submitted', function() {
    cy.get('button[type=submit]').click()
    shouldShowErrorMessage()
  })

  it('should display error message when password is empty', function() {
    cy.get('input[type=email]').type('test@test.com{enter}')
    shouldShowErrorMessage()
  })

  it('should display error message when email is empty', function() {
    cy.get('input[type=password]').type('password{enter}')
    shouldShowErrorMessage()
  })

  it('should display error message when login failed', function() {
    cy.get('input[type=email]').type('test@test.com')
    cy.get('input[type=password]').type('wrong{enter}')
    shouldShowErrorMessage()
  })

  it('should redirect to homepage when logging is successful', function() {
    cy.get('input[type=email]').type('devfest@lille.fr')
    cy.get('input[type=password]').type('Lille1234{enter}')
    cy.url().should('contain', '/')
    cy.contains('Devfest Lille').should('exist')
  })
})
