// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import { Before } from 'cypress-cucumber-preprocessor/steps';
import './commands'
const fs = require('fs')
const path = require('path');
//import { After } from "cypress-cucumber-preprocessor/steps";

// Alternatively you can use CommonJS syntax:
// require('./commands')

Before(() => {
  const directoryPath = path.join(__dirname, 'screenshots\\Google.feature');
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return cy.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      cy.log(file);
    });
  });
})

afterEach(() => {
  const screenshotsFolder = Cypress.config("screenshotsFolder");
  if (window.cucumberJson?.generate) {
    const testState = window.testState;
    for (let i = 0; i < testState.runTests[testState.currentScenario.name].length; i++) {
      const stepResult = testState.runTests[testState.currentScenario.name][i];
      if (stepResult?.status === "failed") {
        const screenshotFileName = `${testState.feature.name} -- ${testState.currentScenario.name} (failed).png`;
        cy.readFile(
          `${screenshotsFolder}/${Cypress.spec.name}/${screenshotFileName}`,
          "base64"
        ).then((imgData) => {
          stepResult.attachment = {
            data: imgData,
            media: { type: "image/png" },
            index: i,
            testCase: testState.formatTestCase(testState.currentScenario),
          };
        });
      } else {
        const screenshotFileName = `${testState.feature.name} -- ${testState.currentScenario.name} -- ${i}.png`;
        cy.readFile(
          `${screenshotsFolder}/${Cypress.spec.name}/${screenshotFileName}`,
          "base64"
        ).then((imgData) => {
          stepResult.attachment = {
            data: imgData,
            media: { type: "image/png" },
            index: i,
            testCase: testState.formatTestCase(testState.currentScenario),
          };
        });
      }
    }
  }
});