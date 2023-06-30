/**
 * Repository for the 'verify' entity.
 * @author Stefan Kruik
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class VerifyRepository {
    #networkManager;
    #route;

    /**
     * Constructor of the repository.
     */
    constructor() {
        this.#route = "/verify";
        this.#networkManager = new NetworkManager();
    };

    /**
     * Send an email that contains data and instructions to
     * verify the account.
     * @param {string} email - Email address of receiver.
     * @param {string} environment - Environment of the server. Dev or Live.
     * @param {object} translation - The complete script in the language of the user.
     * @param {object} translationEdge - The nav and footer of the email in the language of the user.
     * @returns {Promise<>}
     */
    sendVerifyMail(email, environment, translation, translationEdge) {
        return this.#networkManager.doRequest(`${this.#route}/mail`, "POST", { "email": email, "env": environment, "translation": translation, "translationEdge": translationEdge });
    };

    /**
     * Get the pincode of the user.
     * @param {string} email - Email address of the user.
     * @returns {Promise<>}
     */
    getPin(email) {
        return this.#networkManager.doRequest(`${this.#route}/pin?email=${email}`, "GET");
    };

    /**
     * Verify an account.
     * @param {string} email - Email address of the user.
     * @returns {Promise<>}
     */
    verifyAccount(email) {
        return this.#networkManager.doRequest(`${this.#route}/verify-account`, "PUT", { "email": email });
    };

    /**
     * Get the current verification status.
     * @param {string} email - Email address of the user.
     * @returns {Promise<>}
     */
    getStatus(email) {
        return this.#networkManager.doRequest(`${this.#route}/status?email=${email}`, "GET");
    };

    /**
     * Update user email.
     * @param {string} newEmail - New email address of the user.
     * @param {string} email - Email address of the user.
     * @returns {Promise<>}
     */
    updateEmail(newEmail, email) {
        return this.#networkManager.doRequest(`${this.#route}/email-update`, "PUT", { "newEmail": newEmail, "email": email });
    };
};