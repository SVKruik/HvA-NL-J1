/// <reference types="Cypress" />
import 'cypress-file-upload';
/**
 * Test context: Story Posting Page
 * @author: Donovan Tjokrodimedjo
 */
describe("Story Posting Page", () => {
    // Variables
    const inputTitle = "#story-title";
    const inputContent = "#story-content";
    const dropdownTags = ".story-tags-dropdown";
    const tagAddButton = ".richtext-button.add";
    const inputImage = "#story-img-input";
    const inputYear = "#story-year";
    const postButton = "#button-post";
    const checkboxAnon = 'input[value="anonymous"]';
    const checkboxExplicit = 'input[value="explicit"]';
    const checkboxComments = 'input[value="disable-comments"]';
    const checkboxVotes = 'input[value="disable-votes"]';
    const richtextBold = '.richtext-button[data-element="bold"]';
    const richtextItalic = '.richtext-button[data-element="italic"]';
    const richtextUnderline = '.richtext-button[data-element="underline"]';
    const richtextStrikethrough = '.richtext-button[data-element="strikethrough"]';
    const richtextLink = '.richtext-button[data-element="createLink"]';
    // Run before each test
    beforeEach(() => {
        cy.log("Running test spec: story-posting");
        cy.visit("#post/new");
        cy.fixture("post.json").then((res) => {
            cy.intercept('GET', '/post/getTags', {
                statusCode: 200,
                body: res.tags,
            }).as("getAllTags");
            cy.intercept('GET', "/post/checkUser", {
                statusCode: 200,
                body: res.checkUser
            }).as("checkUser");
        });
        cy.login();
        cy.wait(500);
    });
    // Test: Validate Form Components
    it("Validate Form Components - Presence", () => {
        cy.get(inputTitle).should("exist");
        cy.get(inputContent).should("exist");
        cy.get(dropdownTags).should("exist");
        cy.get(inputImage).should("exist");
        cy.get(inputYear).should("exist");
        cy.get(postButton).should("exist");
        cy.get(checkboxAnon).should("not.exist");
        cy.get(checkboxExplicit).should("exist");
        cy.get(checkboxComments).should("exist");
        cy.get(checkboxVotes).should("exist");
    });
    // Test: Input Fields
    it("Input Fields - Correct", () => {
        // Stub Requests
        cy.fixture("post.json").then((res) => {
            cy.intercept("/post/postStory", {
                statusCode: 200,
                body: res.story
            }).as("postStory");
            cy.intercept("/post/getStoryId?url=*", {
                statusCode: 200,
                body: res.storyId
            }).as("getStoryId");
            cy.intercept("/post/storyTags", {
                statusCode: 200,
                body: res.storyTags
            }).as("storyTags");
            cy.intercept("/file/upload", {
                statusCode: 200,
                body: res.fileUpload
            }).as("fileUpload");
            cy.intercept('GET', "/settings/user-achievement?email=*&id=*", {
                statusCode: 200,
                body: res.userAchievement
            }).as("userDataRequest");
            cy.intercept('GET', "/story/story-info?sortColumn=*&sortType=*&tagArray=*&title=*&content=*&author=*&year=*&url=*&explicit=*&verified=*", {
                statusCode: 200,
                body: res.storyRead
            }).as("storyReadRequest");
            cy.intercept('GET', "/verify/status?email=*", {
                statusCode: 200,
                body: res.empty
            }).as("verifyRequest");
            cy.intercept('GET', "/story-read/comments?storyId=*&sort=*", {
                statusCode: 200,
                body: res.empty
            }).as("commentRequest");

            cy.intercept('GET', "/story-read/check-like?userEmail=*&typeId=*&type=*", {
                statusCode: 200,
                body: res.empty
            }).as("checkLikeRequest");
            cy.intercept('GET', "/story-read/translate?text=*&language=*", {
                statusCode: 200,
                body: res.empty
            }).as("translateRequest");
            cy.intercept('PUT', '/settings/updateCredits', {
                statusCode: 200,
                body: res.empty,
            }).as("updateCreditsRequest");
        });
        // Input title
        cy.get(inputTitle).type('Dit is een test titel').should('have.value', 'Dit is een test titel');
        // Input content
        cy.get(inputContent).type('Dit is een test verhaal').should('have.text', 'Dit is een test verhaal');
        // Input year
        cy.get(inputYear).type('2023').should('have.value', '2023');
        // Input three tags
        cy.get(dropdownTags).select(2);
        cy.get(tagAddButton).click();
        cy.get(dropdownTags).select(0);
        cy.get(tagAddButton).click();
        cy.get(dropdownTags).select(0);
        cy.get(tagAddButton).click();
        // Check if tag can be removed
        cy.get('.story-tag[id="9"]').find('.remove').click();
        cy.get('.story-tag[id="9"]').should('not.exist');
        cy.get(dropdownTags).select(0);
        cy.get(tagAddButton).click();
        // Check if image can be uploaded
        cy.get(inputImage).attachFile('media/beluga.jpg');
        // Check if settings can be set
        cy.get(checkboxExplicit).check().should('be.checked');
        cy.get(checkboxComments).check().should('be.checked');
        cy.get(checkboxVotes).check().should('be.checked');
        // Check if post button works
        cy.get(postButton).click();
        cy.wait("@fileUpload");
        cy.wait("@postStory");
        cy.screenshot("post-story-posted", { "overwrite": true });
    });
    // Test: Input Fields
    it("Input Fields - Incorrect", () => {
        cy.get(inputYear).clear();
        // Check if post button works
        cy.wait(500);
        cy.get(postButton).click();
        // Check if incorrect input fields have the invalid class
        cy.get(inputTitle).should("have.class", "invalid");
        cy.get(inputContent).should("have.class", "invalid");
        cy.get(inputYear).should("have.class", "invalid");
        cy.get(dropdownTags).should("have.class", "invalid");
    });
    // Check rich text functionality
    it('Rich Text Functionality', () => {
        cy.wait(1500);
        cy.get(richtextBold).click();
        cy.get(inputContent).type("Bold{enter}");
        cy.get(richtextItalic).click();
        cy.get(inputContent).type("Italic{enter}");
        cy.get(richtextUnderline).click();
        cy.get(inputContent).type("Underline{enter}");
        cy.get(richtextStrikethrough).click();
        cy.get(inputContent).type("Strikethrough{enter}");
        cy.get(richtextLink).click();
        cy.get(inputContent).type("youtube.com{enter}");
    });
});