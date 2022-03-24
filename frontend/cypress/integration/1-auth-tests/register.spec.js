/// <reference types="cypress" />

describe('Register form', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/register')
  })

  it('displays a form for registering', () => {
    cy.get('form').should('contain.text', 'Brukernavn')
  })

  it('enables submit when the form is filled in', () => {
     //ACT
     cy.get('input[name="username"]').type('jason');
     cy.get('input[name="firstName"]').type('jason');
     cy.get('input[name="lastName"]').type('derulo');
     cy.get('input[name="age"]').type('25')
     cy.get('input[name="email"]').type('jason@derulo.com');
     cy.get('input[name="password"]').type('password');
     
     //ASSERT
     cy.get('form').get('button').click();
  })

  it('displays warning when age is under 18', () => {
    //ACT
    cy.get('input[name="username"]').type('jason');
    cy.get('input[name="firstName"]').type('jason');
    cy.get('input[name="lastName"]').type('derulo');
    cy.get('input[name="age"]').type('16');
    cy.get('input[name="email"]').type('jason@derulo.com');
    cy.get('form').should('contain.text', 'Alder må være 18 eller høyere');  
 })
})