/**
 * Repository for the 'stories' entity.
 * @author Stefan Kruik
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class StoryRepository {
    #networkManager;
    #route;

    /**
     * Constructor of the repository.
     */
    constructor() {
        this.#route = "/story";
        this.#networkManager = new NetworkManager();
    };

    /**
     * Query all stories.
     * @param {string} sortColumn - Order by keyword. Database column.
     * @param {string} sortType - Descending or ascending order. Desc/asc.
     * @param {Array} tagArray - Array of filter tags.
     * @param {string} title - The title of the story.
     * @param {string} content - The content of the story.
     * @param {string} author - The author of the story.
     * @param {number} year - The year of the story.
     * @param {string} url - The URL of the story. Leave null/undefined if it's not for story-read.
     * @param {number} explicit - If explicit stories are allowed.
     * @param {number} verified - If non-verified stories are allowed.
     * @returns {Promise<>}
     */
    loadStoryData(sortColumn, sortType, tagArray, title, content, author, year, url, explicit, verified) {
        return this.#networkManager.doRequest(`${this.#route}/story-info?sortColumn=${sortColumn}&sortType=${sortType}&tagArray=${tagArray}&title=${title}&content=${content}&author=${author}&year=${year}&url=${url}&explicit=${explicit}&verified=${verified}`, "GET");
    };

    /**
     * Get the amount of stories per tag.
     * @returns {Promise<>}
     */
    loadTagData() {
        return this.#networkManager.doRequest(`${this.#route}/tag`, "GET");
    };

    /**
     * Get all information for the leaderboard.
     * @returns {Promise<>}
     */
    loadLeaderboard() {
        return this.#networkManager.doRequest(`${this.#route}/leaderboard`, "GET");
    };

    /**
     * Query all tag data.
     * @returns {Promise<>}
     */
    tagInfo() {
        return this.#networkManager.doRequest(`${this.#route}/tag-info`, "GET");
    };
};