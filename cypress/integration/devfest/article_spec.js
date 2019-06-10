describe('Article page', function() {
  context('In an anonymous context', function() {
    it('should display the article page', function() {
      cy.server()
      cy.route('/api/articles/*', 'fixture:/article/cypress-is-cool.json').as(
        'getArticle'
      )
      cy.route(
        '/api/articles/*/comments',
        'fixture:/comments/cypress-is-cool.json'
      ).as('getArticleComments')
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

    it('should display nothing when the article is not found', function() {
      cy.server()
      cy.route({
        url: '/api/articles/**',
        response: { status: '404', error: 'Not Found' },
        status: 404,
      }).as('getArticle')

      cy.visit('/article/unknown-oni8y2')
      cy.get('.navbar').should('exist')
    })

    it('should display nothing when server internal error', function() {
      cy.server()
      cy.route({
        url: '/api/articles/**',
        response: { status: '500', error: 'Internal error' },
        status: 500,
      }).as('getArticle')

      cy.visit('/article/internal-error-oni8y2')
      cy.get('.navbar').should('exist')
    })

    it('should display after a long request', function() {
      cy.server()
      cy.route({
        url: '/api/articles/*',
        response: 'fixture:/article/cypress-is-cool.json',
        delay: 500,
      }).as('getArticle')
      cy.route({
        url: '/api/articles/*/comments',
        response: 'fixture:/comments/cypress-is-cool.json',
        delay: 2000,
      }).as('getArticleComments')

      cy.visit('/article/article2-oni8y2')
      cy.get('h1').should('contain', 'Cypress is cool')
      cy.get('.author').should('contain', 'Brice')
      cy.get('.date').should('contain', 'Wed Apr 11 2018')
      cy.get('.article-content').should('contain', 'Lorem Ipsum')
      cy.get('.tag-list').should('contain', 'e2e')
    })
  })

  context('In an authenticated context', function() {
    beforeEach(function() {
      cy.login('devfest@lille.fr', 'Lille1234')

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
      cy.get('.card').as('comments')
      cy.get('@comments').should('have.length', 2)
      cy.get('@comments')
        .first()
        .should('contain', 'Post Comment')
      cy.get('@comments')
        .eq(1)
        .should('contain', comment)
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
