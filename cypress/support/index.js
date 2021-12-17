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
import './commands'
import { After } from "cypress-cucumber-preprocessor/steps";
// const fs = require("fs-extra");
// const path = require("path");

// const cucumberJsonDir = path.resolve(process.cwd(), "reports\\cucumber-json\\Google.cucumber.json");

// Alternatively you can use CommonJS syntax:
// require('./commands')

// afterEach(() => {
//     const { EventEmitter } = require("events");
//     const eventBroadcaster = new EventEmitter();
//     const screenshotsFolder = Cypress.config("screenshotsFolder");
//     if (window.cucumberJson?.generate) {
//         for (let i = 0; i < window.testState.runTests[window.testState.currentScenario.name].length; i++) {
//             cy.task('getScreenshotNames2', {
//                 folderName: `${screenshotsFolder}/${Cypress.spec.name}`,
//                 feature: `${testState.feature.name}`,
//                 scenario: `${testState.currentScenario.name}`,
//                 stepIndex: `${i}`
//             })
//         }
//     }
//     cy.log(window.testState)
// })

// afterEach(() => {
//     const screenshotsFolder = Cypress.config("screenshotsFolder");
//     if (!window.cucumberJson?.generate) {
//         var testState = window.testState;
//         for (let i = 0; i < testState.runTests[testState.currentScenario.name].length; i++) {

//             let stepResult = testState.runTests[testState.currentScenario.name][i];
//             if (stepResult?.status === "failed") {
//                 const screenshotFileName = `${testState.feature.name} -- ${testState.currentScenario.name} -- ${i} (failed).png`;
//                 cy.task('getScreenshotNames', {
//                     folderName: `${screenshotsFolder}/${Cypress.spec.name}`, identifier: `${testState.feature.name} -- ${testState.currentScenario.name} -- ${i}`
//                 }).then(files => {
//                     files.forEach(fileName => {
//                         cy.log("fileName " + fileName)
//                         cy.wait(2000)
//                     });
//                 })
//                 cy.readFile(
//                     `${screenshotsFolder}/${Cypress.spec.name}/${screenshotFileName}`,
//                     "base64"
//                 ).then((imgData) => {
//                     stepResult.attachment = {
//                         data: "imgData failed",
//                         media: { type: "image/png" },
//                         index: i,
//                         testCase: testState.formatTestCase(testState.currentScenario),
//                     };
//                 });
//             } else {
//                 //stepResult.attachment = []
//                 const screenshotFileName = `${testState.feature.name} -- ${testState.currentScenario.name} -- ${i}.png`;
//                 cy.task('getScreenshotNames', {
//                     folderName: `${screenshotsFolder}/${Cypress.spec.name}`, identifier: `${testState.feature.name} -- ${testState.currentScenario.name} -- ${i}`
//                 }).then(files => {
//                     files.forEach((fileName, index) => {
//                         cy.log('length 1: ' + JSON.stringify(testState.runTests[testState.currentScenario.name][i]))
//                         cy.log("fileName " + fileName)
//                         //cy.wait(2000)
//                         cy.readFile(
//                             `${screenshotsFolder}/${Cypress.spec.name}/${screenshotFileName}`,
//                             "base64"
//                         ).then((imgData) => {
//                             stepResult.attachment = {
//                                 data: "data test " + index,
//                                 media: { type: "image/png" },
//                                 index: i,
//                                 testCase: testState.formatTestCase(testState.currentScenario),
//                             };
//                             cy.log('step result : ' + JSON.stringify(stepResult))
//                             testState.runTests[testState.currentScenario.name][i] = stepResult
//                             cy.log('length 2: ' + JSON.stringify(testState.runTests[testState.currentScenario.name][i]))
//                             window.cucumberJson = { generate: true };
//                         });
//                         //cy.log(testState)
//                     });
//                 })

//             }
//         }
        
//     }
//     cy.log(testState) 
//     //window.cucumberJson = { generate: true };
    
// });

// afterEach(() => {
//     cy.readFile('cypress\\cucumber-json\\Google.cucumber.json').then(file => {
//         cy.log('file : ' + JSON.stringify(file))
//     })
// })

// function printJSON() {
//     // const fs = require('fs')
//     // const path = require('path');
//     // let rawdata = fs.readFileSync('reports\\cucumber-json\\Google.cucumber.json');
//     // let parcedData = JSON.parse(rawdata);
//     cy.readFile('reports\\cucumber-json\\Google.cucumber.json').then(json => {
//         cy.log("json : " + JSON.stringify(json))
//     })
// }