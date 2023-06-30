/**
 * Repository for the 'settings' repository.
 * @author Donovan Tjokrodimedjo
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class SettingsRepository {
    #networkManager;
    #route;

    /**
     * Constructor of the repository.
     */
    constructor() {
        this.#route = "/settings";
        this.#networkManager = new NetworkManager();
    }

    /**
     * Sends a POST request to the insertData route
     * @returns {Promise<>}
     */
    insertData(type, firstname, lastname, email, username, biography, oldmail, password) {
        if (type == "password") {
            // If the request regards a password change
            return this.#networkManager.doRequest(`${this.#route}/insertData`, "POST", {
                "type": type,
                "password": password,
                "email": email
            });
        } else if (type == "userdata") {
            // Else perform full user data update request
            return this.#networkManager.doRequest(`${this.#route}/insertData`, "POST", {
                "type": type,
                "firstname": firstname,
                "lastname": lastname,
                "username": username,
                "biography": biography,
                "oldmail": oldmail,
                "email": email
            });
        }
    }

    /**
     * Sends a GET request to the checkPassword route
     * @returns {Promise<>}
     */
    checkPassword(password, email) {
        // If the request regards a password change
        return this.#networkManager.doRequest(`${this.#route}/checkPassword?password=${password}&email=${email}`, "GET");
    }

    /**
     * Sends a GET request to the checkDuplicates route
     * @returns {Promise<>}
     */
    checkDuplicates(newUsername, username, newEmail, email) {
        // If the request regards a password change
        return this.#networkManager.doRequest(`${this.#route}/checkDuplicates?newUsername=${newUsername}&username=${username}&newEmail=${newEmail}&email=${email}`, "GET");
    }

    /**
     * Sends a GET request to fetch user settings
     * @returns {Promise<>}
     */
    getUserSettings(email) {
        return this.#networkManager.doRequest(`${this.#route}/getUserSettings?email=${email}`, "GET");
    }

    /**
     * Sends a POST request to update user settings
     * @returns {Promise<>}
     */
    setUserSettings(email, interaction, sotw, language, auto_translate) {
        return this.#networkManager.doRequest(`${this.#route}/setUserSettings`, "POST", {
            "email": email,
            "interaction": interaction,
            "sotw": sotw,
            "language": language,
            "auto_translate": auto_translate,
        });
    }

    /**
     * Sends a POST request to update the user's accessibility settings
     * @returns {Promise<>}
     */
    setAccessSettings(email, colorblindness, high_contrast) {
        return this.#networkManager.doRequest(`${this.#route}/setAccessSettings`, "POST", {
            "email": email,
            "colorblind": colorblindness,
            "high_contrast": high_contrast,
        });
    }

    /**
     * Sends a POST request to the deleteUser route.
     * @returns {Promise<>}
     */
    deleteUser(email) {
        // If the request regards a password change
        return this.#networkManager.doRequest(`${this.#route}/deleteUser`, "DELETE", {
            "email": email,
        });
    }

    /**
     * Increase or decrease user credit amount.
     * @param {string} email - Email of the target user.
     * @param {number} credits - Positive or negative number to increase or decrease credit amount with.
     * @returns {Promise<>}
     */
    updateCredits(email, credits) {
        return this.#networkManager.doRequest(`${this.#route}/updateCredits`, "PUT", { "email": email, "credits": credits });
    }

    /**
     * Query the value of a specific achievement.
     * @param {string} email - Email of the user.
     * @param {string} id - ID of the achievement. 01 to 09 and 10.
     * @returns {Promise<*>}
     */
    getAchievement(email, id) {
        return this.#networkManager.doRequest(`${this.#route}/user-achievement?email=${email}&id=${id}`, "GET");
    }

    /**
     * Set the value of a specific achievement.
     * @param {string} email - Email of the user.
     * @param {string} id - ID of the achievement. 01 to 09 and 10.
     * @returns {Promise<*>}
     */
    setAchievement(email, id) {
        return this.#networkManager.doRequest(`${this.#route}/set-user-achievement`, "PUT", { "email": email, "id": id });
    }

    /**
     * Update the user_settings.show_explicit column.
     * @param {string} email - Email of logged in user.
     * @param {number} value - 0 or 1, explicit boolean.
     * @returns {Promise<>}
     */
    updateExplicit(email, value) {
        return this.#networkManager.doRequest(`${this.#route}/update-explicit`, "PUT", { "email": email, "value": value });
    }
}