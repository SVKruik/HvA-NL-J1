/**
 * Repository responsible for all footer related data from the server
 *
 * @author Donovan Tjokrodimedjo
 */
import { NetworkManager } from "../framework/utils/networkManager.js";

export class FooterRepository {
    #route;
    #networkManager;

    constructor() {
        this.#route = "/footer";
        this.#networkManager = new NetworkManager();
    };

    /**
     * Sends a POST request to the setLanguage route to insert the new default language for the user
     * @param email     - user email
     * @param language  - current selected language
     * @returns {Promise<>}
     */
    setLanguage(email, language) {
        return this.#networkManager.doRequest(`${this.#route}/setLanguage`, "POST", { "email": email, "language": language });
    };
};