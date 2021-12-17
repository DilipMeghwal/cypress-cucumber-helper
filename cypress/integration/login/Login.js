import { Given, When } from "cypress-cucumber-preprocessor/steps";

Given("I open parabank home page", () => {
    cy.wrap(2).should("eq", 2)
    cy.takeScreenshot(window.testState)
    cy.wrap(2).should("eq", 2)
    cy.takeScreenshot(window.testState)
});

When("I enter {string} and {string}", (username, password) => {
    cy.wrap(2).should("eq", 2)
    cy.log('username : ' + username)
    cy.log('password : ' + password)
    cy.takeScreenshot(window.testState)
    cy.wrap(2).should("eq", 2)
    cy.log('username : ' + username)
    cy.log('password : ' + password)
    cy.takeScreenshot(window.testState)
});