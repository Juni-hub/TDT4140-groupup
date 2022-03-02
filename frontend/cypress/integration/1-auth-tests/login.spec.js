/// <reference types="cypress" />

describe('Login form', () => {
    beforeEach(() => {
      cy.visit('localhost:3000/loginPage')
    })
  
    it('displays a form for login', () => {
      cy.get('form').should('contain.text', 'Brukernavn');
      cy.get('form').should('contain.text', 'Passord');
    })
  
    it('enables submit when the form is filled in', () => {
       //ACT
       cy.get('input[name="username"]').type('jason');
       cy.get('input[name="password"]').type('password');
       
       //ASSERT
       cy.get('form').get('button[name="signIn"').click();
    })
  })