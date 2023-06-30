/// <reference types="Cypress" />

/**
 * Test context: Support
 * @author Stefan Kruik
 */
describe("Support", () => {
    // Variables
    const endpoint = "/support/form";
    const inputEmail = "#support-email-input";
    const inputSubject = "#support-subject-input";
    const inputCategory = "#support-category-input";
    const inputMessage = "#support-message-input";
    const inputSubmit = ".support-form-submit";

    // Run before each test
    beforeEach(() => {
        cy.log("Running test spec: support");
        cy.visit("#support");
        cy.login();
        cy.wait(500);
    });

    // Test: Validate Form Components
    it("Validate Form Components - Presence", () => {
        cy.get(inputEmail).should("exist");
        cy.get(inputSubject).should("exist");
        cy.get(inputCategory).should("exist");
        cy.get(inputMessage).should("exist");
        cy.get(inputSubmit).should("exist");
    });

    // Test: Wrong Form Submission
    it("Form Submission - Wrong", () => {
        cy.get(inputSubmit).click();
        cy.get(inputSubject).should("have.class", "invalid");
        cy.get(inputMessage).should("have.class", "invalid");
        cy.screenshot("support-inputs-invalid", { "overwrite": true });

        cy.get(inputSubject).type("Cypress - Subject").should("not.have.class", "invalid");
        cy.get(inputMessage).type("Cypress - Message").should("not.have.class", "invalid");
    });

    // Test: Correct Form Submission
    it("Form Submission - Correct", () => {
        // Stub Request
        cy.fixture("support.json").then((res) => {
            cy.intercept('POST', endpoint, {
                statusCode: 200,
                body: res.support,
            }).as('supportRequest');
        });

        // Fill & Submit
        cy.get(inputEmail).type("stefan.kruik@hva.nl");
        cy.get(inputSubject).type("Cypress - Subject");
        cy.get(inputCategory).select(1);
        cy.get(inputMessage).type("Cypress - Message");
        cy.screenshot("support-inputs-filled", { "overwrite": true });
        cy.get(inputSubmit).click();

        // Await Stub
        cy.wait("@supportRequest");

        // Check Stub
        cy.get("@supportRequest").should((xhr) => {
            const body = xhr.request.body;

            // Match Inputs
            expect(body.email).equals("stefan.kruik@hva.nl");
            expect(body.subject).equals("Cypress - Subject");
            expect(body.category).equal("Technische problemen");
            expect(body.message).equals("Cypress - Message");
        });

        // Screenshot End Result
        cy.screenshot("support-inputs-submitted", { "overwrite": true });
    });
});