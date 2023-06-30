/**
 * Repository responsible for all story posting related data from server - CRUD
 *
 * @author Donovan Tjokrodimedjo
 */
import { NetworkManager } from "../framework/utils/networkManager.js";

export class PostRepository {
    #route;
    #networkManager;

    constructor() {
        this.#route = "/post";
        this.#networkManager = new NetworkManager();
    };

    /**
     * Sends a POST request to the /postStory route with all the required variables
     *
     * @param type - the type of request, e.g., edit (to edit an existing post) or new to post a new story
     * @param email - user email
     * @param title - story title
     * @param text - story content
     * @param url - story URL
     * @param anonymous - boolean indicating if the story is posted anonymously
     * @param comments - boolean indicating if the story has comments
     * @param votes - boolean indicating if the story has votes enabled
     * @param explicit - boolean indicating if the story is explicit
     * @param year - year of the story
     * @returns {Promise<>}
     */
    postStory(type, email, title, text, url, anonymous, comments, votes, explicit, year) {
        return this.#networkManager.doRequest(`${this.#route}/postStory`, "POST",
            {
                "type": type,
                "email": email,
                "title": title,
                "content": text,
                "url": url,
                "anonymous": anonymous,
                "comments": comments,
                "votes": votes,
                "explicit": explicit,
                "year": year
            });
    };

    /**
     * Sends a POST request to the /storyTags route with all the required variables
     *
     * @param type - the type of request, e.g., edit (to edit existing posts' tags) or new (to add tags for a new post)
     * @param storyId - the story ID
     * @param tagid1 - the first story tag
     * @param tagid2 - the second story tag
     * @param tagid3 - the third story tag
     * @returns {Promise<*>}
     */
    storyTags(type, storyId, tagid1, tagid2, tagid3) {
        return this.#networkManager.doRequest(`${this.#route}/storyTags`, "POST",
            {
                "type": type,
                "storyId": storyId,
                "tagId1": tagid1,
                "tagId2": tagid2,
                "tagId3": tagid3
            });
    };

    /**
     * Sends a GET request to the getStoryId route with the specified URL as a query parameter
     * @param url - URL of a story
     * @returns {Promise<*>}
     */
    getStoryId(url) {
        return this.#networkManager.doRequest(`${this.#route}/getStoryId?url=${url}`, "GET");
    }

    /**
     * Sends a GET request to the getStoryData route with the specified URL as a query parameter
     * @param url - URL of a story
     * @returns {Promise<*>}
     */
    getStoryData(url) {
        return this.#networkManager.doRequest(`${this.#route}/getStoryData?url=${url}`, "GET");
    }

    /**
     * Sends a GET request to the getTags route
     * @returns {Promise<*>}
     */
    getTags() {
        return this.#networkManager.doRequest(`${this.#route}/getTags`, "GET");
    }

    /**
     * Sends a GET request to the checkUser route with the specified email as a query parameter
     * @param email - user email
     * @returns {Promise<*>}
     */
    checkUser(email) {
        return this.#networkManager.doRequest(`${this.#route}/checkUser?email=${email}`, "GET");
    }
};