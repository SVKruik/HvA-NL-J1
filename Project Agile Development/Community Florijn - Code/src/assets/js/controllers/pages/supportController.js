/**
 * Controller responsible for all events in the 'support' view.
 * @author Stefan Kruik
 */
import { Controller } from "../controller.js";
import { SupportRepository } from "../../repositories/supportRepository.js";
import { App } from "../../app.js";
import { VerifyRepository } from "../../repositories/verifyRepository.js";

export class SupportController extends Controller {
    #supportView;
    #supportRepository;
    #verifyRepository;
    #App

    constructor() {
        super();
        this.#supportRepository = new SupportRepository();
        this.#verifyRepository = new VerifyRepository();
        this.#App = App;
        this.#setupView();
    }

    async #setupView() {
        this.#supportView = await super.loadHtmlIntoContent("html_views/support.html");
        super.translateView(true, "Support");
        const calibratedHeight = 28;

        // FAQ Profile Link
        const profileLink = this.#supportView.querySelector("#support-profile-link");
        if (this.#App.sessionManager.get("email")) {
            profileLink.href = `${baseUrl}/#profile/${this.#App.sessionManager.get("userName")}`;
        };

        // Email
        const emailInput = this.#supportView.querySelector("#support-email-input");
        let emailStatus = 0;
        if (this.#App.sessionManager.get("email")) {
            emailStatus = (await this.#verifyRepository.getStatus(this.#App.sessionManager.get("email"))).result[0].status;
            if (emailStatus === 1) emailInput.parentElement.style.display = "none";
        };
        emailInput.addEventListener("keydown", () => {
            if (emailInput.classList.contains("invalid")) emailInput.classList.remove("invalid");
            emailInput.style.border = "1px solid var(--gray)";
        });

        // Subject
        const subjectInput = this.#supportView.querySelector("#support-subject-input");
        const subjectCharCounter = this.#supportView.querySelector("#support-subject-counter");
        subjectInput.addEventListener("focusin", () => { subjectCharCounter.style.opacity = "1"; });
        subjectInput.addEventListener("focusout", () => { if (subjectInput.value.length === 0) subjectCharCounter.style.opacity = "0"; });
        subjectInput.addEventListener("keydown", event => {
            if (subjectInput.classList.contains("invalid")) subjectInput.classList.remove("invalid");
            super.commentInputController(event, subjectInput, subjectCharCounter, 10, "font");
        });

        // Category
        const categoryInput = this.#supportView.querySelector("#support-category-input");

        // Message
        const messageInput = this.#supportView.querySelector("#support-message-input");
        const messageCharCounter = this.#supportView.querySelector("#support-message-counter");
        messageInput.addEventListener("focusin", () => { messageCharCounter.style.opacity = "1"; });
        messageInput.addEventListener("focusout", () => { if (messageInput.value.length === 0) messageCharCounter.style.opacity = "0"; });
        messageInput.addEventListener("keydown", event => {
            if (messageInput.classList.contains("invalid")) messageInput.classList.remove("invalid");
            super.commentInputController(event, messageInput, messageCharCounter, 2900, "font");
        });

        // Submit
        const submitButton = this.#supportView.getElementsByClassName("support-form-submit")[0];
        submitButton.addEventListener("click", async event => {
            const invalidInputs = document.querySelectorAll(".invalid");
            invalidInputs.forEach(input => {
                input.classList.remove("invalid");
            });
            event.preventDefault();

            // Basic Field Checking
            let error = 0;
            let email = "";
            if (emailStatus === 0 && emailInput.value.length < 5) {
                setTimeout(() => {
                    emailInput.classList.add("invalid");
                }, 10);
                error = 1;
            };
            if (subjectInput.value.length === 0) {
                setTimeout(() => {
                    subjectInput.classList.add("invalid");
                }, 10);
                error = 1;
            };
            if (messageInput.value.length === 0) {
                setTimeout(() => {
                    messageInput.classList.add("invalid");
                }, 10);
                error = 1;
            };
            if (error === 1) {
                return super.customAlert(null, await super.translateComponent("story-read-empty"), null, null);
            };

            // Email Status
            if (emailStatus === 1) {
                email = this.#App.sessionManager.get("email");
            } else {
                email = emailInput.value;
            };

            // Disable Button
            submitButton.disabled = true;
            document.body.style.cursor = "wait";

            // Complete
            await this.#supportRepository.supportForm(email, subjectInput.value, categoryInput.value, messageInput.value,
                "", await super.dateFormat(Date.now(), "long"), await super.translateComponent("email-support-general"), await super.translateComponent("email-general"),
                await super.translateComponent("email-support-user"), await super.translateComponent("email-support-staff", "en-US"), Date.now(),
                await super.translateComponent("email-support-general", "en-US"), await super.translateComponent("email-general", "en-US"));
            super.customAlert(null, await super.translateComponent("support-form-confirm"), "confirmation", null);

            // Reset Inputs and Button
            const remaining = await super.translateComponent("input-remaining-chars");
            emailInput.value = "";
            subjectInput.value = "";
            this.#supportView.querySelector("#support-subject-counter").innerHTML = `50 ${remaining}`;
            categoryInput.selectedIndex = "0";
            messageInput.value = "";
            this.#supportView.querySelector("#support-message-counter").innerHTML = `3000 ${remaining}`;
            submitButton.disabled = false;
            document.body.style.cursor = "pointer";
        });

        // Info Box
        const infoButton = this.#supportView.getElementsByClassName("support-info-button")[0];
        infoButton.addEventListener("click", () => {
            infoButton.parentElement.style.opacity = "0";
            setTimeout(() => {
                infoButton.parentElement.style.display = "none";
            }, 500);
        });

        // FAQs
        const faqContainers = this.#supportView.getElementsByClassName("support-faq-container");
        for (let i = 0; i < faqContainers.length; i++) {
            faqContainers[i].childNodes[1].addEventListener("click", () => {
                this.#toggleFold(i, calibratedHeight)
            });
        };

        // Title Height Dependent Parent Height
        setTimeout(() => {
            for (let i = 0; i < this.#supportView.getElementsByClassName("support-faq-container").length; i++) {
                const foldOut = this.#supportView.querySelector(`#fold-out-parent-${i}`);
                const foldOutTitle = this.#supportView.querySelector(`#fold-out-title-${i}`);
                foldOut.style.maxHeight = `${foldOutTitle.offsetHeight + calibratedHeight}px`;
            };
        }, 550);
    };

    /**
     * FAQ container collapsible.
     * @param {number} index - Current FAQ container number.
     * @param {number} calibratedHeight - Added height to the title height to make it seamless.
     */
    #toggleFold(index, calibratedHeight) {
        const foldOut = this.#supportView.querySelector(`#fold-out-parent-${index}`);
        const foldOutIcon = this.#supportView.querySelector(`#fold-out-icon-${index}`);
        const foldOutTitle = this.#supportView.querySelector(`#fold-out-title-${index}`);
        if (foldOut.style.maxHeight === "1200px") {
            foldOut.style.maxHeight = `${foldOutTitle.offsetHeight + calibratedHeight}px`;
            foldOutIcon.style.rotate = "90deg";
        } else {
            foldOutIcon.style.rotate = "0deg";
            foldOut.style.maxHeight = "1200px";
        };
    };
};