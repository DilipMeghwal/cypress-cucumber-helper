import { Given, Then } from "cypress-cucumber-preprocessor/steps";


Given("I open Google page", () => {
  // const fs = require('fs')
  // const path = require('path');

  // const directoryPath = path.join(__dirname, 'screenshots\\Google.feature');
  // //passsing directoryPath and callback function
  // fs.readdirSync(directoryPath, function (err, files) {
  //   //handling error
  //   if (err) {
  //     return console.log('Unable to scan directory: ' + err);
  //   }
  //   //listing all files using forEach
  //   files.forEach(function (file) {
  //     // Do whatever you want to do with the file
  //     console.log(file);
  //   });
  // });
  // const directoryPath = path.join(__dirname, 'screenshots');
  // //passsing directoryPath and callback function
  // fs.readdir(directoryPath, function (err, files) {
  //   //handling error
  //   if (err) {
  //     return console.log('Unable to scan directory: ' + err);
  //   }
  //   //listing all files using forEach
  //   files.forEach(function (file) {
  //     // Do whatever you want to do with the file
  //     console.log(file);
  //   });
  // });
  cy.wrap(2).should("eq", 2)
  cy.takeScreenshot(window.testState)
})

Then("I see {string} in the title", (title) => {
  cy.wrap(2).should("eq", 2)
  cy.takeScreenshot(window.testState)
})