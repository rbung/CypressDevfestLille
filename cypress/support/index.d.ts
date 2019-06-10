/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Allow to authenticate to the app
     * @example
     * cy.login('john', 'veryStrongPassword')
     */
    login(email: string, password: string): Chainable<any>
  }
}
