/**
 * Repository for the 'timeline' entity.
 *
 * @author Stefan Kruik
 */
import { NetworkManager } from "../framework/utils/networkManager.js";

export class TimelineRepository {
    //# is a private field in Javascript
    #route;
    #networkManager;

    constructor() {
        this.#route = "/timeline";
        this.#networkManager = new NetworkManager();
    };

    /**
     * Get the amount of stories per year.
     * @returns {Promise<>}
     */
    storyCount() {
        return this.#networkManager.doRequest(`${this.#route}/count`, "GET");
    };
};