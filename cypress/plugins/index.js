/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const cucumber = require('cypress-cucumber-preprocessor').default
const fs = require('fs')
const path = require('path');
/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('file:preprocessor', cucumber())

  on('task', {
    getScreenshotNames({ folderName, identifier }) {
      return new Promise((resolve, reject) => {
        let names = []
        fs.readdir(folderName, (err, files) => {
          if (err) {
            return reject(err)
          }
          files.forEach(function (file) {
            if (file.includes(identifier)) {
              //console.log(file);
              names.push(file)
            }
          });
          resolve(names)
        })
      })
    },
  })

  on('task', {
    getScreenshotImage(fileName) {
      return new Promise((resolve, reject) => {
        fs.readdir(folderName, (err, file) => {
          if (err) {
            return reject(err)
          }
          resolve(file)
        })
      })
    },
  })

  on('task', {
    getScreenshotNames2({ folderName, feature, scenario, stepIndex }) {
      let rawdata = fs.readFileSync('reports\\cucumber-json\\Google.cucumber.json');
      let parcedData = JSON.parse(rawdata);
      console.log(parcedData);
      console.log("feature : " + feature)
      console.log("scenario : " + scenario)
      console.log("stepIndex : " + stepIndex)
      let featureData = parcedData.filter(f => {
        return f.name === feature
      })
      console.log('featureData : ' + JSON.stringify(featureData.elements))
      // let scenarioData = featureData.filter(s => s.name === scenario)
      // console.log('scenarioData : ' + scenarioData)
      // let stepData = scenarioData[stepIndex]
      // console.log('stepData : ' + stepData)
      return new Promise((resolve, reject) => {
        let names = []
        fs.readdir(folderName, (err, files) => {
          if (err) {
            return reject(err)
          }
          files.forEach(function (file) {
            if (file) {
              //console.log(file);
              names.push(file)
            }
          });
          resolve(names)
        })
      })
    },
  })

  // on('task', {
  //   printJSON() {
  //     let rawdata = fs.readFileSync('reports\\cucumber-json\\Google.cucumber.json');
  //     let parcedData = JSON.parse(rawdata);

  //     return new Promise((resolve, reject) => {
  //       resolve(parcedData)
  //     })
  //   },
  // })
}
