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

        const screenshotsPass = readdirRecursive(path.resolve(screenshotsDir)).filter(
            (file) => {
                return file.search(/\d+.png/gm) > -1;
            }
        );

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

    featuresList.forEach(feature => {
        console.log("test : " + feature)
    })

    featuresList.forEach((feature) => {
        console.log('feature : ' + feature)
        screenshots.forEach((screenshot) => {
            //If the screenshot does not belongs to the same feature skip it.
            if (!screenshot.includes(feature)) {
                return
            }
            console.log('screenshot : ' + screenshot)

            var filename = screenshot.replace(/^.*[\\\/]/, "");
            console.log('filename : ' + [filename])
            const fileNameSplit = filename.split("--")
            console.log("DilipMeghwal : " + cucumberReportMap[feature][0].name)

            if (filename.includes('example #')) {
                const exampleRegEx = /(?<=example #)\d+/g
                const stepRegEx = /(?<=\) -- )\d+/g
                if (exampleRegEx.exec(fileNameSplit[1].trim())) {
                    let scenarioIndex = parseInt(fileNameSplit[1].trim().match(exampleRegEx)) - 1
                    console.log(scenarioIndex)
                    //if (stepRegEx.exec(fileNameSplit[2].trim())) {
                    let stepIndex = parseInt(fileNameSplit[2].trim())
                    console.log(stepIndex)
                    //}
                    //console.log("scenario : " + JSON.stringify(cucumberReportMap[feature][0].elements[scenarioIndex].steps[stepIndex]))
                    let step = cucumberReportMap[feature][0].elements[scenarioIndex].steps[stepIndex]
                    const data = fs.readFileSync(screenshot);
                    console.log('data = ' + path.resolve(screenshot))
                    if (data) {
                        const base64Image = path.resolve(screenshot)//Buffer.from(data, "binary").toString("base64");
                        //const base64Image = Buffer.from(data, "binary").toString("base64");
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
                    console.log("name " + sc.name)
                    console.log("file Name2 : " + fileNameSplit[1].replace("(failed).png", "").trim())
                    if (sc.name == fileNameSplit[1].replace("(failed).png", "").trim()) {
                        console.log("index " + index)
                        scenarioIndex = index
                    }
                });
                if (scenarioIndex !== undefined) {
                    console.log(parseInt(scenarioIndex))
                    let stepIndex = parseInt(fileNameSplit[2].trim())
                    console.log(stepIndex)
                    let step = cucumberReportMap[feature][0].elements[parseInt(scenarioIndex)].steps[stepIndex]
                    const data = fs.readFileSync(screenshot);
                    console.log('data = ' + path.resolve(screenshot))
                    if (data) {
                        const base64Image = path.resolve(screenshot)//Buffer.from(data, "binary").toString("base64");
                        //const base64Image = Buffer.from(data, "binary").toString("base64");
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

    featuresList.forEach(feature => {
        console.log("test : " + feature)
    })

    featuresList.forEach((feature) => {
        console.log('feature : ' + feature)
        screenshots.forEach((screenshot) => {
            //If the screenshot does not belongs to the same feature skip it.
            if (!screenshot.includes(feature)) {
                return
            }
            console.log('screenshot : ' + screenshot)

            var filename = screenshot.replace(/^.*[\\\/]/, "");
            console.log('filename : ' + [filename])
            const fileNameSplit = filename.split("--")
            console.log("DilipMeghwal : " + cucumberReportMap[feature][0].name)

            if (filename.includes('example #')) {
                const exampleRegEx = /(?<=example #)\d+/g
                const stepRegEx = /(?<=\) -- )\d+/g
                if (exampleRegEx.exec(fileNameSplit[1].trim())) {
                    let scenarioIndex = parseInt(fileNameSplit[1].trim().match(exampleRegEx)) - 1
                    console.log(scenarioIndex)
                    if (fileNameSplit[1].trim().includes("(failed)")) {
                        console.log("adding failed one")
                        cucumberReportMap[feature][0].elements[scenarioIndex].steps.forEach(step => {
                            if (step.result.status === "failed") {
                                const data = fs.readFileSync(screenshot);
                                console.log('data = ' + path.resolve(screenshot))
                                if (data) {
                                    const base64Image = path.resolve(screenshot)//Buffer.from(data, "binary").toString("base64");
                                    //const base64Image = Buffer.from(data, "binary").toString("base64");
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
                    console.log("name " + sc.name)
                    console.log("file Name2 : " + fileNameSplit[1].replace("(failed).png", "").trim())
                    if (sc.name == fileNameSplit[1].replace("(failed).png", "").trim()) {
                        console.log("index " + index)
                        scenarioIndex = index
                    }
                });
                if (scenarioIndex !== undefined) {
                    console.log(parseInt(scenarioIndex))
                    if (fileNameSplit[1].trim().includes("(failed)")) {
                        console.log("adding failed one")
                        cucumberReportMap[feature][0].elements[scenarioIndex].steps.forEach(step => {
                            if (step.result.status === "failed") {
                                const data = fs.readFileSync(screenshot);
                                console.log('data = ' + path.resolve(screenshot))
                                if (data) {
                                    const base64Image = path.resolve(screenshot)//Buffer.from(data, "binary").toString("base64");
                                    //const base64Image = Buffer.from(data, "binary").toString("base64");
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
            pageTitle: "Simulacion de Credito Online",
            reportName: `Simulacion de Credito Online - ${new Date().toLocaleString()}`,
            metadata: {
                app: {
                    name: "Simulacion de Credito Online",
                    version: "1",
                },
                browser: {
                    name: "electron",
                },
                device: "EMULATOR",
                platform: {
                    name: "linux",
                },
            },
            customData: {
                title: "Run info",
                data: [
                    { label: "Project", value: "Simulacion de Credito" },
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