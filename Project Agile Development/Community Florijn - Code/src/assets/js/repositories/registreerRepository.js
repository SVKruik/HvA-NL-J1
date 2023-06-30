import { NetworkManager } from "../framework/utils/networkManager.js";

export class RegistreerRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/registreer";
        this.#networkManager = new NetworkManager();
    }

    /**
     *
     * @param email - user email
     * @returns {Promise<*>} return a boolean either false or true
     */
    checkEmail(email) {
        return this.#networkManager.doRequest(`${this.#route}/checkEmail`, "POST", {
            email: email
        })
    }

    /**
     *
     * @param username user username
     * @returns {Promise<*>} returns a boolean false or true
     */
    checkUsername(username) {
        return this.#networkManager.doRequest(`${this.#route}/checkUsername`, "POST", {
            user_name: username
        })
    }

    /**
     *
     * @param email - user email
     * @param username - user username
     * @param voornaam - user Voornaam
     * @param achternaam - user Achternaam
     * @param password - user Password
     */
    createAccount(email, username, voornaam, achternaam, password) {
        this.#networkManager.doRequest(`${this.#route}/info`, "POST", {
            email: email, user_name: username, first_name: voornaam,
            sur_name: achternaam, password: password
        })
    }

    /**
     *
     * @param email - user Email
     * @param geslacht - user Geslacht
     * @param geboortedatum - user Geboortedatum
     * @param biography - user Biografie
     * @param verification_pin - user Verification_pin is a 6 digit random code
     * @param language - The view language of the user.
     */
    createAccountDetail(email, geslacht, geboortedatum, biography, verification_pin, language) {
        this.#networkManager.doRequest(`${this.#route}/data`, "POST", {
            user_email: email,
            gender: geslacht,
            birthdate: geboortedatum,
            biography: biography,
            verification_pin: verification_pin,
            language: language
        })
    }
}