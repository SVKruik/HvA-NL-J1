/// <reference types="Cypress" />

/**
 * Testing Profile
 * @author Emir Bay
 */

describe("Profile", () => {

    // Variables
    const profilePicture = ".profilePicture";
    const profileName = ".profileName";
    const profileUserName = ".profileUserName";
    const aboutMe = ".profileAboutMe";
    const postAmount = ".profilePosts";
    const likeAmount = ".profileLikes";
    const commentAmount = ".profileComments";
    const creditAmount = ".profileCredits";
    const profileDate = ".profileDate";
    const settingsButton = ".profileEdit";

    // Run before each test
    beforeEach(() => {

        cy.log("Running test spec: profile");

        //Set session for user
        //Using the 'email' key because passing the 'email' item in the 'session' key will not work
        const email = { 'email': "emir.bay@hva.nl" };
        localStorage.setItem("email", JSON.stringify(email));

        const userName = { "userName": "Emir" };
        localStorage.setItem("session", JSON.stringify(userName));

        cy.visit("#profile/Emir");

        cy.fixture("profile.json").then((res) => {
            cy.intercept('GET', "/profile/Emir", {
                statusCode: 200,
                body: res.data,
            }).as("profileRequest");
        });

        cy.login();

        // Await Stub
        cy.wait("@profileRequest");

        cy.wait(500);

    });

    // Test: Validate Profile information Components
    it("Validate Profile Components - Presence", () => {
        cy.get(profilePicture).should("exist");
        cy.get(profileName).should("exist");
        cy.get(profileUserName).should("exist");
        cy.get(aboutMe).should("exist");
        cy.get(postAmount).should("exist");
        cy.get(likeAmount).should("exist");
        cy.get(commentAmount).should("exist");
        cy.get(creditAmount).should("exist");
        cy.get(profileDate).should("exist");
        cy.get(settingsButton).should("exist");
        cy.get(settingsButton).should("not.be.visible.visible");
    });

    // Test: User is not on his own profile
    it("Edit button not visible - If user is not on his own profile", () => {

        if (JSON.parse(localStorage.getItem('email')).email == "guest@hotmail.com") {
            cy.get(settingsButton).invoke("show");
            cy.get(settingsButton).should("be.visible");
            cy.get(settingsButton).click();

        } else {
            cy.get(settingsButton).invoke("hide");
            cy.get(settingsButton).should("not.be.visible");
        }

        // Screenshot Test Result
        cy.screenshot("profile-edit-notvisible", { "overwrite": true });
    });

    // Test: User is on his own profile
    it("Edit button visible - If user is on his own profile", () => {
        if (JSON.parse(localStorage.getItem('email')).email == "emir.bay@hva.nl") {
            cy.get(settingsButton).invoke("show");
            cy.get(settingsButton).should("be.visible");
            cy.screenshot("profile-edit-visible", { "overwrite": true });

            cy.fixture("profile.json").then((res) => {
                cy.intercept('GET', `/navbar/userData?email=*`, {
                    statusCode: 200,
                    body: res.userData,
                      }).as("profileSettingsRequest");

                cy.intercept('GET', `/settings/getUserSettings?email=*`, {
                    statusCode: 200,
                    body: res.userAdvanced,
                }).as("settingsRequest");

            });

            cy.get(settingsButton).click();

            cy.wait("@settingsRequest");
            cy.wait("@profileSettingsRequest");


        } else {
            cy.get(settingsButton).invoke("hide");
            cy.get(settingsButton).should("not.be.visible");
        }

        // Screenshot End Result
        cy.screenshot("profile-edit-page", { "overwrite": true });
    });

});