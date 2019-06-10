import Banner from '../../../src/components/Home/Banner'
import React from 'react'
import { mount } from 'cypress-react-unit-test'

describe('Banner component', function() {
  it('should display banner given user is not authenticated', function() {
    mount(<Banner appName={'appName'} />)
    cy.contains('appname').should('exist')
    cy.contains('A place to share your knowledge.').should('exist')
  })

  it('should not display banner given user is authenticated', function() {
    mount(<Banner appName={'appName'} token={'token'} />)
    cy.contains('appname').should('not.exist')
    cy.contains('A place to share your knowledge.').should('not.exist')
  })
})
