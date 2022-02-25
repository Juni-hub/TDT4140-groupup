/// <reference types="cypress" />



describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/registerPage')
  })

  it('displays a form for registering', () => {
    cy.get('form').should('contain.text', 'Brukernavn')
  })
})