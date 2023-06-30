/**
 * Repository responsible for all home related data from server - CRUD
 * @author Donovan Tjokrodimedjo
 */
import { NetworkManager } from "../framework/utils/networkManager.js";

export class HomeRepository {
    #route;
    #networkManager;

    constructor() {
        this.#route = "/home";
        this.#networkManager = new NetworkManager();
    };

    /**
     * Sends a GET request to the storyOfTheWeek route
     * @returns {Promise<>}
     */
    getStoryOfTheWeek() {
        return this.#networkManager.doRequest(`${this.#route}/storyOfTheWeek`, "GET");
    }
}