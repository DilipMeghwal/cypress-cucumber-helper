const report = require("multiple-cucumber-html-reporter");
report.generate({
    jsonDir: "./reports/cucumber-json",  // ** Path of .json file **//
    reportPath: "./reports/cucumber-html-report",
    metadata: {
        browser: {
            name: "chrome",
            version: "95",
        },
        device: "Local test machine",
        platform: {
            name: "windows",
            version: "10",
        },
    },
});