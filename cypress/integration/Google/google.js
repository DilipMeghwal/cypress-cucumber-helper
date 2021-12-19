import { Given, Then, After, Before } from "cypress-cucumber-preprocessor/steps";

Given("I open Google page", () => {
  cy.visit("https://www.google.com")
  cy.wrap(2).should("eq", 2)
  cy.takeScreenshot(window.testState)
  cy.wrap(2).should("eq", 3)
  cy.takeScreenshot(window.testState)
})

Then("I see {string} in the title", (title) => {
  cy.wrap(2).should("eq", 2)
  cy.takeScreenshot(window.testState)
  cy.wrap(2).should("eq", 3)
  cy.takeScreenshot(window.testState)
})
