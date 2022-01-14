const report = require("multiple-cucumber-html-reporter");
const fs = require("fs-extra");
const path = require("path");

const cucumberJsonDir = path.resolve(process.cwd(), "./reports/cucumber-json");
const cucumberReportFileMap = {};
const cucumberReportMap = {};
const jsonIndentLevel = 2;
const htmlReportDir = path.resolve(process.cwd(), "./reports/cucumber-html-report");
const screenshotsDir = path.resolve(process.cwd(), "cypress/screenshots");

getCucumberReportMaps();
addScreenshots();
generateReport();

/*
Description : Getting the cucumber report.
*/
function getCucumberReportMaps() {
    filenames = fs.readdirSync(cucumberJsonDir);
    const files = fs.readdirSync(cucumberJsonDir).filter((file) => {
        return file.indexOf(".json") > -1;
    });
    files.forEach((file) => {
        const json = JSON.parse(fs.readFileSync(path.join(cucumberJsonDir, file)));
        if (!json[0]) {
            return;
        }
        const [feature] = json[0].uri.split("/").reverse();
        cucumberReportFileMap[feature] = file;
        cucumberReportMap[feature] = json;
    });
}


/*
Description : Capture the failed and passed screenshot names from directory.
*/
function addScreenshots() {
    if (fs.existsSync(screenshotsDir)) {
        //only if screenshots exists
        const prependPathSegment = (pathSegment) => (location) =>
            path.join(pathSegment, location);

        const readdirPreserveRelativePath = (location) =>
            fs.readdirSync(location).map(prependPathSegment(location));

        const readdirRecursive = (location) =>
            readdirPreserveRelativePath(location).reduce(
                (result, currentValue) =>
                    fs.statSync(currentValue).isDirectory()
                        ? result.concat(readdirRecursive(currentValue))
                        : result.concat(currentValue),
                []
            );

        //Capture pass screenshot names
        const screenshotsPass = readdirRecursive(path.resolve(screenshotsDir)).filter(
            (file) => {
                return file.search(/\d+.png/gm) > -1;
            }
        );

        //Capture fail screenshot names
        const screenshotsfail = readdirRecursive(path.resolve(screenshotsDir)).filter(
            (file) => {
                return file.indexOf("(failed).png") > -1;
            }
        );

        //call to add the screenshots to the json
        attachPassImages(screenshotsPass)
        attachFailImages(screenshotsfail)
    }
}

/*
Description : Add the passed screenshots to the json file.
*/
function attachPassImages(screenshots) {
    const featuresList = Array.from(
        new Set(screenshots.map((x) => x.match(/[\w-_.]+.feature/g)[0]))
    );

    featuresList.forEach((feature) => {
        screenshots.forEach((screenshot) => {
            //If the screenshot does not belongs to the same feature skip it.
            if (!screenshot.includes(feature)) {
                return
            }

            /*
             extracting the file name and other part will be removed.
             src string - screenshot : C:\Workspace\cypress-cucumber-helper\cypress\screenshots\Login.feature\Validate parabank login feature -- Validate user is able to login in (example #8) (failed).png
             final string -  Validate parabank login feature -- Validate user is able to login in (example #8) (failed).png
             */
            var filename = screenshot.replace(/^.*[\\\/]/, "");
            const fileNameSplit = filename.split("--")

            //if the feature file contains scenario outlien and examples
            if (filename.includes('example #')) {
                const exampleRegEx = /(?<=example #)\d+/g
                if (exampleRegEx.exec(fileNameSplit[1].trim())) {
                    //we will access the scenarios and steps in feature file with indexes
                    let scenarioIndex = parseInt(fileNameSplit[1].trim().match(exampleRegEx)) - 1
                    let stepIndex = parseInt(fileNameSplit[2].trim())
                    let step = cucumberReportMap[feature][0].elements[scenarioIndex].steps[stepIndex]
                    //read screenshot
                    const data = fs.readFileSync(screenshot);
                    if (data) {
                        //convert the image to base64 string
                        const base64Image = Buffer.from(data, "binary").toString("base64");
                        if (step.embeddings) {
                            step.embeddings.push({
                                data: base64Image,
                                mime_type: "image/png",
                            });
                        } else {
                            step.embeddings = [];
                            step.embeddings.push({
                                data: base64Image,
                                mime_type: "image/png",
                            });
                        }
                    }
                }
            } else {
                let scenarioIndex
                cucumberReportMap[feature][0].elements.forEach((sc, index) => {
                    if (sc.name == fileNameSplit[1].trim()) {
                        scenarioIndex = index
                    }
                });
                if (scenarioIndex !== undefined) {
                    let stepIndex = parseInt(fileNameSplit[2].trim())
                    let step = cucumberReportMap[feature][0].elements[parseInt(scenarioIndex)].steps[stepIndex]
                    //read screenshot
                    const data = fs.readFileSync(screenshot);
                    if (data) {
                        //convert the screenshot to base 64 string
                        const base64Image = Buffer.from(data, "binary").toString("base64");
                        if (step.embeddings) {
                            step.embeddings.push({
                                data: base64Image,
                                mime_type: "image/png",
                            });
                        } else {
                            step.embeddings = [];
                            step.embeddings.push({
                                data: base64Image,
                                mime_type: "image/png",
                            });
                        }
                    }
                }

            }
            //Write JSON with screenshot back to report file.
            fs.writeFileSync(
                path.join(cucumberJsonDir, cucumberReportFileMap[feature]),
                JSON.stringify(cucumberReportMap[feature], null, jsonIndentLevel)
            );
        });
    });
}


/*
Description : Add the failed screenshots to the json file.
*/
function attachFailImages(screenshots) {
    const featuresList = Array.from(
        new Set(screenshots.map((x) => x.match(/[\w-_.]+.feature/g)[0]))
    );

    featuresList.forEach((feature) => {
        screenshots.forEach((screenshot) => {
            //If the screenshot does not belongs to the same feature skip it.
            if (!screenshot.includes(feature)) {
                return
            }
            var filename = screenshot.replace(/^.*[\\\/]/, "");
            const fileNameSplit = filename.split("--")

            //scenario outline with examples
            if (filename.includes('example #')) {
                const exampleRegEx = /(?<=example #)\d+/g
                const stepRegEx = /(?<=\) -- )\d+/g
                if (exampleRegEx.exec(fileNameSplit[1].trim())) {
                    let scenarioIndex = parseInt(fileNameSplit[1].trim().match(exampleRegEx)) - 1
                    if (fileNameSplit[1].trim().includes("(failed)")) {
                        cucumberReportMap[feature][0].elements[scenarioIndex].steps.forEach(step => {
                            if (step.result.status === "failed") {
                                //read failed screenshot
                                const data = fs.readFileSync(screenshot);
                                if (data) {
                                    const base64Image = Buffer.from(data, "binary").toString("base64");
                                    if (step.embeddings) {
                                        step.embeddings.push({
                                            data: base64Image,
                                            mime_type: "image/png",
                                        });
                                    } else {
                                        step.embeddings = [];
                                        step.embeddings.push({
                                            data: base64Image,
                                            mime_type: "image/png",
                                        });
                                    }
                                }
                            }
                        })
                    }
                }
            } else {
                let scenarioIndex
                cucumberReportMap[feature][0].elements.forEach((sc, index) => {
                    if (sc.name == fileNameSplit[1].replace("(failed).png", "").trim()) {
                        scenarioIndex = index
                    }
                });
                if (scenarioIndex !== undefined) {
                    if (fileNameSplit[1].trim().includes("(failed)")) {
                        cucumberReportMap[feature][0].elements[scenarioIndex].steps.forEach(step => {
                            if (step.result.status === "failed") {
                                const data = fs.readFileSync(screenshot);
                                if (data) {
                                    const base64Image = Buffer.from(data, "binary").toString("base64");
                                    if (step.embeddings) {
                                        step.embeddings.push({
                                            data: base64Image,
                                            mime_type: "image/png",
                                        });
                                    } else {
                                        step.embeddings = [];
                                        step.embeddings.push({
                                            data: base64Image,
                                            mime_type: "image/png",
                                        });
                                    }
                                }
                            }
                        })
                    }
                }

            }
            //Write JSON with screenshot back to report file.
            fs.writeFileSync(
                path.join(cucumberJsonDir, cucumberReportFileMap[feature]),
                JSON.stringify(cucumberReportMap[feature], null, jsonIndentLevel)
            );
        });
    });
}

/*
Description : Generate the report from json
Note : change the parameters as pe your need
*/
function generateReport() {
    if (!fs.existsSync(cucumberJsonDir)) {
        console.warn("REPORT CANNOT BE CREATED!");
    } else {
        report.generate({
            jsonDir: cucumberJsonDir,
            reportPath: htmlReportDir,
            displayDuration: true,
            useCDN: true,
            pageTitle: "Cypress Helper",
            reportName: `Cypress Helper - ${new Date().toLocaleString()}`,
            metadata: {
                app: {
                    name: "Cypress Helper",
                    version: "1",
                },
                browser: {
                    name: "Chrome",
                },
                device: "Desktop",
                platform: {
                    name: "Windows",
                },
            },
            customData: {
                title: "Run info",
                data: [
                    { label: "Project", value: "Cypress Helper" },
                    { label: "Release", value: "1" },
                    {
                        label: "Execution Start Time",
                        value: `${new Date().toLocaleString()}`,
                    },
                    {
                        label: "Execution End Time",
                        value: `${new Date().toLocaleString()}`,
                    },
                ],
            },
        });
    }
}