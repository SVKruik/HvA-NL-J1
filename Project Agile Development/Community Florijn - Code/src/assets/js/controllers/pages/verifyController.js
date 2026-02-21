/**
 * Controller responsible for all events in the 'verify' view.
 * @author Stefan Kruik
 */

import { VerifyRepository } from "../../repositories/verifyRepository.js";
import { Controller } from "../controller.js";
import { App } from "../../app.js";

export class VerifyController extends Controller {
    #verifyView;
    #verifyRepository;
    #App

    /**
     * Constructor of the view.
     */
    constructor() {
        super();
        this.#verifyRepository = new VerifyRepository();
        this.#App = App;
        this.#setupView();
    };

    /**
     * Load all the elements and data into the view.
     * @async
     * @private
     */
    async #setupView() {
        const email = await this.#App.sessionManager.get("email");
        if (!email) {
            window.location.href = `${baseUrl}/#home`;
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            return;
        };

        const status = await this.#verifyRepository.getStatus(email);
        if (window.location.hash !== "#verify/succes" && status.result[0].status === 1) {
            window.location.href = `${baseUrl}/#verify/verified`;
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        };

        if (window.location.hash === "#verify/resend") {
            this.#verifyView = await super.loadHtmlIntoContent("html_views/components/verify-resend.html");
            this.#verifyView.getElementsByClassName("email")[0].innerHTML = `${await super.translateComponent("verify-description-2-2")} ${email}`;

            // Support Page Button
            this.#verifyView.querySelector("#contact").addEventListener("click", () => {
                window.location.href = `${baseUrl}/#support`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });

            // Resend Button
            const resendButton = this.#verifyView.querySelector("#resend");
            let sessionTime = this.#App.sessionManager.get("resend-button-timeout");
            if (!sessionTime || sessionTime <= 1) {
                sessionTime = 60;
            };
            resendButton.addEventListener("click", async () => {
                if (this.#App.sessionManager.get("resend-button-timeout") <= 1) super.customAlert(null, await super.translateComponent("verify-error-5"), "confirmation", null);
                this.#countdown(sessionTime, await super.translateComponent("verify-button-2-2"), true, resendButton, true, email, false);
            });

            // Wrong Email Button
            this.#verifyView.getElementsByClassName("wrong-email")[0].addEventListener("click", () => {
                window.location.href = `${baseUrl}/#verify/redo`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });
        } else if (window.location.hash === "#verify/input") {
            this.#verifyView = await super.loadHtmlIntoContent("html_views/components/verify-input.html");
            const errorContainer = this.#verifyView.getElementsByClassName("error-message-container")[0];

            // Inputs
            const verifyInputs = this.#verifyView.getElementsByClassName("verify-input");
            verifyInputs[0].focus();
            for (let i = 0; i < verifyInputs.length; i++) {
                verifyInputs[i].addEventListener("keyup", event => {
                    if (isNaN(verifyInputs[i].value)) {
                        verifyInputs[i].value = "";
                    } else {
                        if (errorContainer) {
                            errorContainer.style.opacity = 0;
                            errorContainer.style.transform = "scale(0)";
                        };
                        autotab(verifyInputs[i], event);
                    };

                    // Submit
                    if (verifyInputs[i].id === "input-6" && event.key === "Enter") {
                        this.#verifyInput(verifyInputs, email);
                    };
                });
            };

            /**
             * Auto tab to next input.
             * @param {Element} input - Current input
             * @param {Object} event - Key
             * @returns - If there is no previous or next element.
             */
            function autotab(input, event) {
                if (event.key == "ArrowRight" || event.key == "ArrowUp" || !isNaN(event.key)) {
                    if (!input.nextElementSibling) return;
                    input.nextElementSibling.value = "";
                    input.nextElementSibling.focus();
                } else if (event.key == "ArrowLeft" || event.key == "ArrowDown" || event.key == "Backspace") {
                    if (!input.previousElementSibling) return;
                    input.previousElementSibling.value = "";
                    input.previousElementSibling.focus();
                };
            };

            // Submit
            this.#verifyView.getElementsByClassName("verify-submit")[0].addEventListener("click", () => {
                this.#verifyInput(verifyInputs, email);
            });
        } else if (window.location.hash === "#verify/succes") {
            this.#verifyView = await super.loadHtmlIntoContent("html_views/components/verify-succes.html");

            if (status.result[0].status === 0) {
                window.location.href = `${baseUrl}/#verify`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            };

            const doneButton = this.#verifyView.querySelector("#done");
            doneButton.addEventListener("click", () => {
                window.location.href = `${baseUrl}/#home`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });
        } else if (window.location.hash === "#verify/verified") {
            this.#verifyView = await super.loadHtmlIntoContent("html_views/components/verify-verified.html");

            const countdown = this.#verifyView.getElementsByClassName("countdown")[0];
            this.#countdown(10, "", false, countdown, false, undefined, true);
        } else if (window.location.hash === "#verify/redo" || window.location.hash === "#verify/redo?invalid=") {
            this.#verifyView = await super.loadHtmlIntoContent("html_views/components/verify-redo.html");

            const inputButton = this.#verifyView.querySelector("#email-done");
            const emailInput = this.#verifyView.querySelector("#input-email");
            const errorMessage = this.#verifyView.getElementsByClassName("error-message-container")[0];
            if (window.location.hash === "#verify/redo?invalid=") {
                errorMessage.style.display = "flex";
                errorMessage.style.opacity = 1;
                errorMessage.style.transform = "scale(1)";
                errorMessage.childNodes[1].innerHTML = await super.translateComponent("verify-error-3");
            };

            inputButton.addEventListener("click", async () => {
                if (emailInput.value.length < 5) {
                    emailInput.style.borderColor = "var(--error)";

                    // Animate Show Error Message
                    errorMessage.style.display = "flex";
                    errorMessage.style.opacity = 1;
                    errorMessage.style.transform = "scale(1)";
                    errorMessage.childNodes[1].innerHTML = await super.translateComponent("verify-error-3");
                } else {
                    const updateData = await this.#verifyRepository.updateEmail(emailInput.value, email);
                    if (updateData.result === "Invalid Email") {
                        errorMessage.style.display = "flex";
                        errorMessage.style.opacity = 1;
                        errorMessage.style.transform = "scale(1)";
                        errorMessage.childNodes[1].innerHTML = await super.translateComponent("verify-error-4");
                        return;
                    };
                    this.#App.sessionManager.set("email", emailInput.value);
                    this.#App.sessionManager.set("emailSent", 0);
                    window.location.href = `${baseUrl}/#verify`;
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                };
            });
            emailInput.addEventListener("keydown", () => {
                errorMessage.style.opacity = 0;
                errorMessage.style.transform = "scale(0)";
                emailInput.style.borderColor = "var(--main)";
            });
        } else if (window.location.hash === "#verify") {
            this.#verifyView = await super.loadHtmlIntoContent("html_views/verify.html");
            this.#verifyView.getElementsByClassName("email")[0].innerHTML = email;

            const status = await this.#verifyRepository.getStatus(email);
            const sendStatus = this.#App.sessionManager.get("emailSent");
            if (status.result[0].status === 0 && sendStatus === 0) {
                const emailData = await this.#sendMail(email);
                if (emailData.result === "Invalid Email") {
                    window.location.href = `${baseUrl}/#verify/redo?invalid=`;
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                } else {
                    this.#App.sessionManager.set("emailSent", 1);
                };
            };

            this.#verifyView.getElementsByClassName("wrong-email")[0].addEventListener("click", () => {
                window.location.href = `${baseUrl}/#verify/redo`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });
        };

        // Language
        super.translateView(true, "Verify");

        const resend = this.#verifyView.querySelector("#not-received");
        const received = this.#verifyView.querySelector("#received");
        const inputBack = this.#verifyView.getElementsByClassName("input-back")[0];
        const resendBack = this.#verifyView.getElementsByClassName("resend-back")[0];
        const redoBack = this.#verifyView.getElementsByClassName("redo-back")[0];

        if (resend) {
            resend.addEventListener("click", async () => {
                window.location.href = `${baseUrl}/#verify/resend`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });
        };

        if (received) {
            received.addEventListener("click", async () => {
                window.location.href = `${baseUrl}/#verify/input`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });
        };

        if (inputBack) {
            inputBack.addEventListener("click", async () => {
                window.location.href = `${baseUrl}/#verify`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });
        };

        if (resendBack) {
            resendBack.addEventListener("click", async () => {
                window.location.href = `${baseUrl}/#verify`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });
        };

        if (redoBack) {
            redoBack.addEventListener("click", async () => {
                window.location.href = `${baseUrl}/#verify`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });
        };
    };

    /**
     * Send an email to a user.
     * @param {string} email - Email address of receiver.
     * @returns Status and pincode.
     * @async
     * @private
     */
    async #sendMail(email) {
        return await this.#verifyRepository.sendVerifyMail(email, "", await super.translateComponent("email-verify"), await super.translateComponent("email-general"));
    };

    /**
     * Verify all the inputs, and if it's correct,
     * verify the user in the database.
     * @param {HTMLCollection} - All 6 inputs.
     * @param {string} email - Email address of logged in user.
     * @async
     * @private
     */
    async #verifyInput(inputs, email) {
        const pinData = await this.#verifyRepository.getPin(email);
        const errorMessage = this.#verifyView.getElementsByClassName("error-message-container")[0];

        const dataPin = pinData.result[0].pin;
        let userPin = "";

        for (let i = 0; i < inputs.length; i++) {
            userPin += inputs[i].value;
        };

        if (userPin.length !== 6) {
            errorMessage.style.display = "flex";
            errorMessage.style.opacity = 1;
            errorMessage.style.transform = "scale(1)";
            errorMessage.childNodes[1].innerHTML = await super.translateComponent("verify-error-1");
            this.clearInputs(inputs);
        } else if (userPin == dataPin) {
            await this.#verifyRepository.verifyAccount(email);
            window.location.href = `${baseUrl}/#verify/succes`;
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        } else {
            errorMessage.style.display = "flex";
            errorMessage.style.opacity = 1;
            errorMessage.style.transform = "scale(1)";
            errorMessage.childNodes[1].innerHTML = await super.translateComponent("verify-error-2");
            this.clearInputs(inputs);
        };
    };

    /**
     * Clear all the inputs and focus the first input.
     */
    clearInputs(inputs) {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        };
        inputs[0].focus();
    };

    /**
     * Create a countdown.
     * @param {number} startTime - Time to start the countdown with.
     * @param {string} title - The inner HTML of the element.
     * @param {boolean} brackets - Brackets around countdown: (1s)
     * @param {element} element - The element to modify.
     * @param {boolean} cursor - Interact with the cursor.
     * @param {string} email - If this countdown is for sending email, provide an email address here to send to.
     * @param {boolean} redirect - To redirect to home page after countdown complete.
     * @returns - If the element is already disabled.
     * @async
     * @private
     */
    async #countdown(startTime, title, brackets, element, cursor, email, redirect) {
        if (cursor) {
            if (element.style.cursor === "not-allowed") return super.customAlert(null, `U moet nog ${this.#App.sessionManager.get("resend-button-timeout")} seconden wachten voordat u opnieuw kan versturen.`, null, null);
        };
        let time = startTime;
        const redirectMessage = await super.translateComponent("verify-redirect");
        const timer = setInterval(async function () {
            if (time <= 0) {
                clearInterval(timer);
                if (cursor) {
                    element.style.cursor = "pointer";
                };
                element.innerHTML = title;
            } else {
                if (cursor) {
                    element.style.cursor = "not-allowed";
                };
                if (brackets) {
                    element.innerHTML = `${title} (${time}s)`;
                } else {
                    element.innerHTML = `${title}${time}`;
                };
                if (time === 1) {
                    if (redirect) {
                        element.innerHTML = `${redirectMessage} . . .`
                        setTimeout(() => {
                            window.location.href = `${baseUrl}/#home`;
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                        }, 1000);
                    };
                };

                App.sessionManager.set("resend-button-timeout", time);
            };
            time -= 1;
        }, 1000);
        if (email && this.#App.sessionManager.get("resend-button-timeout") <= 1) await this.#sendMail(email);
    };
};