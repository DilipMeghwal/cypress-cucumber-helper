
Cypress.Commands.add('takeScreenshot', (testState) => {
  cy.screenshot(`${testState.feature.name} -- ${testState.currentScenario.name} -- ${testState.currentStep} -- ${Date.now()}`, {
    capture: 'runner',
  })
})