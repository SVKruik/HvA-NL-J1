/**
 * Repository for the 'login' entity.
 * @author Pim Meijer
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class UsersRepository {
    #route;
    #networkManager;

    constructor() {
        this.#route = "/login";
        this.#networkManager = new NetworkManager();
    };

    /**
     *  function that verify's and updated verificationcode
     * @param email - email user
     * @param verificationCode - random 6 digit generated number
     * @returns {Promise<*>}
     */
    verificationCode(email, verificationCode) {
        try {
            return this.#networkManager.doRequest("/login/verification-code", "POST", { email, verificationCode });
        } catch (error) {
            throw new Error("Failed to update verification code.");
        }
    }

    /**
     *
     * @param email - useremail
     * @param verification_pin - 6 digit random pin
     * @param environment - live or dev
     * @param translation - wich langueges user uses comes from session
     * @param translationEdge - second basic variable you can use in the email
     * @returns {Promise<*>}
     */
    sendCodeMail(email, verification_pin, environment, translation, translationEdge) {
        return this.#networkManager.doRequest("/login/mail", "POST", { email, verification_pin, environment, translation, translationEdge })
    };

    /**
     * Async function that sends username and password to network manager which will send it to our back-end to see
     * if a user is found with these credentials
     *
     * POST request, so send data as an object which will be added to the body of the request by the network manager
     * @param username - emial user
     * @param password - password
     * @returns {Promise<user>}
     */
    async login(username, password) {
        return await this.#networkManager.doRequest("/login", "POST", { email: username, password: password });
    };
};