import 'cypress-file-upload';
/**
 * Custom Cypress Commands
 * Add pieces of Cypress code that you
 * can easily call from a spec.
 * 
 * This can come in handy for code you use multiple
 * times or in multiple different specs.
 * @see https://docs.cypress.io/api/cypress-api/custom-commands
 */

/**
 * Custom command: cy.login();
 * This command catches the userData and userSettings
 * request, as these are used across multiple views.
 * Check the fixtures to see the mocked response.
 * @author Stefan Kruik
 */
Cypress.Commands.add('login', () => {
    cy.fixture("user.json").then((res) => {
        cy.intercept("navbar/userData?email=*", {
            statusCode: 200,
            body: res.data
        }).as("userDataRequest");
        cy.intercept("settings/getUserSettings?email=*", {
            statusCode: 200,
            body: res.settings
        }).as("userSettingsRequest");
    });
    cy.wait("@userDataRequest");
    cy.wait("@userSettingsRequest")
});