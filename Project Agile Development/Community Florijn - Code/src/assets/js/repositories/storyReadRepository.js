/**
 * Repository for the 'stories' entity.
 * @author Stefan Kruik
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class StoryReadRepository {
    #networkManager;
    #route;

    /**
     * Constructor of the repository.
     */
    constructor() {
        this.#route = "/story-read";
        this.#networkManager = new NetworkManager();
    };

    /**
     * Translate a string with the API.
     * @param {string} text - THe text to translate
     * @param {string} language - The language to translate to.
     * @returns {Promise<>}
     */
    translateRequest(text, language) {
        return this.#networkManager.doRequest(`${this.#route}/translate?text=${encodeURIComponent(text)}&language=${encodeURIComponent(language)}`, "GET");
    };

    /**
     * Verify a story. This function can be triggered automatic or manually.
     * @param {string} url - The story to verify.
     * @param {number} value - 0 or 1, verification status.
     * @returns {Promise<>}
     */
    verifyStory(url, value) {
        return this.#networkManager.doRequest(`${this.#route}/verify`, "PUT", { "url": url, "value": value });
    };

    /**
     * Add a upvoted story to the user likes table.
     * @param {number} vote - 0 or 1, dislike or like. Use 2 for reset to neutral.
     * @param {number} storyId - What story to add/remove.
     * @param {number} commentId - What comment to add/remove.
     * @param {string} user_email - The user_email of the person that liked a story.
     * @param {string} type - Story or comment.
     * @returns {Promise<>}
     */
    userLike(vote, storyId, commentId, user_email, type) {
        return this.#networkManager.doRequest(`${this.#route}/user-like`, "POST", { "vote": vote, "storyId": storyId, "commentId": commentId, "user_email": user_email, "type": type });
    };

    /**
     * Check if user liked a story.
     * @param {string} userEmail - Email of logged in user.
     * @param {number} typeId - The ID of the comment or story.
     * @param {string} type - What type of interaction to check.
     * @returns {Promise<>}
     */
    checkLike(userEmail, typeId, type) {
        return this.#networkManager.doRequest(`${this.#route}/check-like?userEmail=${userEmail}&typeId=${typeId}&type=${type}`, "GET");
    };

    /**
     * Load all the comments under a story.
     * @param {number} storyId - What story to load comments of.
     * @param {string} sort - SQL ORDER BY clause.
     * @returns {Promise<>}
     */
    loadComments(storyId, sort) {
        return this.#networkManager.doRequest(`${this.#route}/comments?storyId=${storyId}&sort=${encodeURIComponent(sort)}`, "GET");
    };

    /**
     * Place a comment under a story.
     * @param {number} storyId - What story the comment belongs to.
     * @param {string} email - Email of the user that placed the comment.
     * @param {string} content - Content of the story.
     * @param {number} parentComment - ID of the parent comment if it's a reply.
     * @returns {Promise<>}
     */
    placeComment(storyId, email, content, parentComment) {
        return this.#networkManager.doRequest(`${this.#route}/place-comment`, "POST", { "storyId": storyId, "email": email, "content": content, "parentComment": parentComment });
    };

    /**
     * Get the user info of the user that placed the parent comment.
     * @param {number} parentComment - ID of the comment.
     * @returns 
     */
    userCommentData(parentComment) {
        return this.#networkManager.doRequest(`${this.#route}/user-comment-data?parentComment=${parentComment}`, "GET");
    };

    /**
     * Get user info from the database.
     * @param {string} email - Email of the user to retrieve data of.
     * @returns {Promise<>}
     */
    userInfoEmail(email) {
        return this.#networkManager.doRequest(`${this.#route}/user-info-email?email=${email}`, "GET");
    };

    /**
     * Get user info from the database.
     * @param {string} username - Username of the user to retrieve data of.
     * @returns {Promise<>}
     */
    userInfoUsername(username) {
        return this.#networkManager.doRequest(`${this.#route}/user-info-username?username=${username}`, "GET");
    };

    /**
     * Get total amount of likes a user has.
     * @param {string} email - Email of the user to retrieve data of.
     * @returns {Promise<>}
     */
    totalLikes(email) {
        return this.#networkManager.doRequest(`${this.#route}/total-likes?email=${email}`, "GET");
    };

    /**
     * Get total amount of comments a user has posted.
     * @param {string} email - Email of the user to retrieve data of.
     * @returns {Promise<>}
     */
    totalComments(email) {
        return this.#networkManager.doRequest(`${this.#route}/total-comments?email=${email}`, "GET");
    };

    /**
     * Get total amount of different stories a user has liked.
     * @param {string} email - Email of the user to retrieve data of.
     * @returns {Promise<>}
     */
    totalLikesStory(email) {
        return this.#networkManager.doRequest(`${this.#route}/total-likes-story?email=${email}`, "GET");
    };

    /**
    * Get comment info from the database.
    * @param {number} id - The ID of the comment.
    * @returns {Promise<>}
    */
    commentData(id) {
        return this.#networkManager.doRequest(`${this.#route}/comment-data?id=${id}`, "GET");
    };

    /**
     * Send an email when a user responds to your comment or story.
     * @param {string} email - Email address of receiver.
     * @param {string} authorName - Username of the respondent.
     * @param {string} type - What content got responded on: comment or story.
     * @param {string} content - What the respondent commented.
     * @param {string} url - URL to the story where the comment was placed.
     * @param {string} env - Environment of the server. Dev or Live.
     * @param {string} title - The title of the story or comment.
     * @param {object} translation - The complete script in the language of the user.
     * @param {object} translationEdge - The nav and footer of the email in the language of the user.
     * @returns {Promise<>}
     */
    sendInteractionMail(email, authorName, type, content, url, env, title, translation, translationEdge) {
        return this.#networkManager.doRequest(`${this.#route}/interaction-email`, "POST", { "email": email, "authorName": authorName, "type": type, "content": content, "url": url, "env": env, "title": title, "translation": translation, "translationEdge": translationEdge });
    };
};