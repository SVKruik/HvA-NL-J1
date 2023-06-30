/**
 * Config file for Cypress
 * Use a projectId in combination with
 * a reporter key to connect with the Cypress Cloud.
 * @author Stefan Kruik
 */

const { defineConfig } = require('cypress');
module.exports = defineConfig({
    projectId: "ib72nr",
    e2e: {
        baseUrl: 'http://localhost:8080',
        supportFile: "cypress/support/index.js",
        specPattern: "cypress/integration/pad"
    },
    video: false,
    reporter: "junit",
    reporterOptions: {
        mochaFile: "cypress/results/test-output.xml",
        toConsole: true,
        overwrite: false,
        html: false,
        json: true,
    },
});