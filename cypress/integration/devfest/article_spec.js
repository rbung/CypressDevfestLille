describe('Article page', function() {
  context('In an anonymous context', function() {
    it.skip('should display the article page', function() {
      // TODO Let's do some stubbing 😎
      cy.visit('/article/cypress-is-cool-oni8y2')
      cy.get('h1').should('contain', 'Cypress is cool')
      cy.get('.author').should('contain', 'Brice')
      cy.get('.date').should('contain', 'Wed Apr 11 2018')
      cy.get('.article-content').should('contain', 'Lorem Ipsum')
      cy.get('.tag-list').should('contain', 'e2e')

      cy.get('.card').as('comments')
      cy.get('@comments').should('have.length', 2)
      cy.get('@comments')
        .first()
        .should('contain', 'You definitely right !')
      cy.get('@comments')
        .eq(1)
        .should('contain', 'JavaScript is cool too ! ❤️')
    })

    it.skip('should display nothing when the article is not found', function() {
      // TODO Simulate a 404
      cy.visit('/article/unknown-oni8y2')
      cy.get('.navbar').should('exist')
    })

    it.skip('should display nothing when server internal error', function() {
      // TODO Simulate a 500
      cy.visit('/article/internal-error-oni8y2')
      cy.get('.navbar').should('exist')
    })

    it.skip('should display after a long request', function() {
      // Simulate a delay for each request 🐢
      cy.visit('/article/article2-oni8y2')
      cy.get('h1').should('contain', 'Cypress is cool')
      cy.get('.author').should('contain', 'Brice')
      cy.get('.date').should('contain', 'Wed Apr 11 2018')
      cy.get('.article-content').should('contain', 'Lorem Ipsum')
      cy.get('.tag-list').should('contain', 'e2e')
    })
  })

  context.skip('In an authenticated context', function() {
    beforeEach(function() {
      // TODO You can do better !
      cy.visit('/login')
      cy.get('input[type=email]').type('devfest@lille.fr')
      cy.get('input[type=password]').type('Lille1234{enter}')
      cy.contains('Devfest Lille').should('be.visible')

      cy.server()
      cy.route('/api/articles/*', 'fixture:/article/cypress-is-cool.json').as(
        'getArticle'
      )
      cy.route('/sockjs-node/**', {})
      cy.visit('/article/cypress-is-cool-oni8y2')
    })

    it('should display the article page', function() {
      cy.route(
        '/api/articles/*/comments',
        'fixture:/comments/cypress-is-cool.json'
      ).as('getArticleComments')
      cy.get('h1').should('contain', 'Cypress is cool')
      cy.get('.author').should('contain', 'Brice')
      cy.get('.date').should('contain', 'Wed Apr 11 2018')
      cy.get('.article-content').should('contain', 'Lorem Ipsum')
      cy.get('.tag-list').should('contain', 'e2e')

      cy.get('.card').as('comments')
      cy.get('@comments').should('have.length', 3)
      cy.get('@comments')
        .first()
        .should('contain', 'Post Comment')
      cy.get('@comments')
        .eq(1)
        .should('contain', 'You definitely right !')
      cy.get('@comments')
        .eq(2)
        .should('contain', 'JavaScript is cool too ! ❤️')
    })

    it('should allow user to post a comment', function() {
      const comment = 'Where is the documentation ?'
      cy.route('/api/articles/*/comments', { comments: [] })
      cy.route({
        method: 'POST',
        status: 201,
        url: '/api/articles/*/comments',
        response: {
          comment: {
            id: 36721,
            createdAt: '2019-03-16T23:33:59.621Z',
            updatedAt: '2019-03-16T23:33:59.621Z',
            body: comment,
            author: {
              username: 'Devfest Lille',
              bio: null,
              image:
                'https://static.productionready.io/images/smiley-cyrus.jpg',
              following: false,
            },
          },
        },
      })
      cy.get('textarea').type(comment)
      cy.get('button[type=submit]').click()
      cy.get('.card').should($cards => {
        expect($cards.length).to.eq(2)
        expect($cards[0].textContent, 'first card').to.contain('Post Comment')
        expect($cards[1].textContent, 'second card').to.contain(comment)
      })
    })

    it('should allow user to delete his comment', function() {
      cy.route(
        '/api/articles/*/comments',
        'fixture:/comments/cypress-is-cool-delete.json'
      ).as('getArticleComments')
      cy.route({
        url: '/api/articles/*/comments/*',
        response: {},
        method: 'DELETE',
        status: 204,
      }).as('getArticleComments')
      cy.contains('TO DELETE').should('be.visible')
      cy.get('.ion-trash-a').click()
      cy.contains('TO DELETE').should('not.exist')
    })
  })
})
