/**
 * Repository for Profile
 * @author Emir Bay
 */
import { NetworkManager } from "../framework/utils/networkManager.js";

export class ProfileRepository {

    #networkManager;
    #route;

    constructor() {
        this.#route = "/profile";
        this.#networkManager = new NetworkManager();
    }

    /**
     *
     * @param {string} username - Get data for the username in the URL
     * @returns {Promise<*>}
     */
    getUser(username) {
        return this.#networkManager.doRequest(`${this.#route}/${username}`, "GET")
    };

    /**
     *
     * @param {string} url - The URL of the story to remove.
     * @returns {Promise<*>}
     */
    deleteStory(url) {
        return this.#networkManager.doRequest(`${this.#route}/story-remove`, "DELETE", { "url": url })
    };

    /**
     * Delete a specific comment.
     * @param {number} id - The ID of the comment to delete.
     */
    deleteComment(id) {
        return this.#networkManager.doRequest(`${this.#route}/comment-remove`, "DELETE", { "id": id })
    };
};