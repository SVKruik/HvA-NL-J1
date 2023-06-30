/**
 * Repository responsible for all navbar related data from server - CRUD
 * @author Donovan Tjokrodimedjo
 */
import { NetworkManager } from "../framework/utils/networkManager.js";

export class NavbarRepository {
    #route;
    #networkManager;

    constructor() {
        this.#route = "/navbar";
        this.#networkManager = new NetworkManager();
    }

    /**
     * Sends a GET request to the userData route and appends the email variable in the query string
     * @param {string} email - User email
     * @returns {Promise<>}
     */
    getUserData(email) {
        return this.#networkManager.doRequest(`${this.#route}/userData?email=${email}`, "GET");
    }
}