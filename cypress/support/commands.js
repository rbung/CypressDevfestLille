Cypress.Commands.add('login', (email, password) => {
  cy.request({
    log: false,
    method: 'POST',
    url: 'https://conduit.productionready.io/api/users/login',
    body: {
      user: {
        email,
        password,
      },
    },
  }).then(response => {
    const { token, username } = response.body.user
    window.localStorage.setItem('jwt', token)
    cy.log('Logged now with ' + username)
  })
})
