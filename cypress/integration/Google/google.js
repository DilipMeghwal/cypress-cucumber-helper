import { Then } from "cypress-cucumber-preprocessor/steps";

Given(`I open Google page`, () => {
    cy.visit("https://www.google.com")
  })

Then(`I see {string} in the title`, (title) => {
  cy.title().should('include', title)
  cy.wrap(3).should("eq", 2)
})