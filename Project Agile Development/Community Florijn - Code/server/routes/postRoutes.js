/**
 * Routes responsible for handling story posting related operations.
 * These routes are used to handle CRUD operations for stories.
 * 
 * @author Donovan Tjokrodimedjo
 */
class postRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #databaseHelper = require("../framework/utils/databaseHelper");
    #app;

    constructor(app) {
        this.#app = app;

        // Activate all the methods.
        this.#postStory();
        this.#getTags();
        this.#storyTags();
        this.#getStoryId();
        this.#getStoryData();
        this.#checkUser();
    }

    /**
     * Inserts a new story into the database.
     * This is a POST request, and the data is sent by the client via the request body.
     * @private
     */
    #postStory() {
        this.#app.post("/post/postStory", async (req, res) => {
            let story;

            try {
                if (req.body.type.includes("new")) {
                    story = await this.#databaseHelper.handleQuery({
                        query: `INSERT INTO story 
                        (user_email, 
                            url, 
                            title, 
                            content, 
                            date, 
                            anonymous, 
                            disable_comments, 
                            disable_votes, 
                            explicit, 
                            year) 
                        VALUES (?, ?, ?, ?, now(), ?, ?, ?, ?, ?);`,
                        values: [req.body.email, req.body.url, req.body.title, req.body.content, req.body.anonymous, req.body.comments, req.body.votes, req.body.explicit, req.body.year]
                    });
                } else if (req.body.type.includes("edit")) {
                    story = await this.#databaseHelper.handleQuery({
                        query: `UPDATE story 
                            SET title = ?, 
                                content = ?, 
                                anonymous = ?, 
                                disable_comments = ?, 
                                disable_votes = ?, 
                                explicit = ?,
                                edit_date = now()
                            WHERE user_email = ? AND url = ?`,
                        values: [req.body.title, req.body.content, req.body.anonymous, req.body.comments, req.body.votes, req.body.explicit, req.body.email, req.body.url]
                    });
                }

                // Just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(story);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }

    /**
     * Inserts the tags of the new story into the dedicated database table.
     * This is a POST request, and the data is sent by the client via the request body.
     * @private
     */
    #storyTags() {
        this.#app.post("/post/storyTags", async (req, res) => {
            let storyTags;

            try {
                if (req.body.type.includes("new")) {
                    storyTags = await this.#databaseHelper.handleQuery({
                        query: `INSERT INTO story_tag (story_id, tag_id) VALUES (?, ?), (?, ?), (?, ?);`,
                        values: [req.body.storyId, req.body.tagId1, req.body.storyId, req.body.tagId2, req.body.storyId, req.body.tagId3]
                    });
                } else if (req.body.type.includes("edit")) {
                    storyTags = await this.#databaseHelper.handleQuery({
                        query: `
                        UPDATE story_tag
                        SET tag_id = CASE id 
                            WHEN (SELECT id FROM (SELECT id FROM story_tag WHERE story_id = ? ORDER BY id LIMIT 1) t1) THEN ? 
                            WHEN (SELECT id FROM (SELECT id FROM story_tag WHERE story_id = ? ORDER BY id LIMIT 1,1) t2) THEN ? 
                            WHEN (SELECT id FROM (SELECT id FROM story_tag WHERE story_id = ? ORDER BY id LIMIT 2,1) t3) THEN ? 
                            ELSE tag_id 
                        END 
                        WHERE story_id = ?;
                            `,
                        values: [req.body.storyId, req.body.tagId1, req.body.storyId, req.body.tagId2, req.body.storyId, req.body.tagId3, req.body.storyId]
                    });
                }

                // Just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(storyTags);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }

    /**
     * Route for requesting the ID from a specific story URL.
     * This function supports GET requests and requires the "url" query parameter.
     * The ID of the story is returned as a JSON object.
     * @private
     */
    #getStoryId() {
        this.#app.get("/post/getStoryId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT id FROM story WHERE url = ?;`,
                    values: [req.query.url]
                });

                // Just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }

    /**
     * Route for requesting all the data from a specific story URL.
     * This function supports GET requests and requires the "url" query parameter.
     * All the known data of the story is returned as a JSON object.
     * @private
     */
    #getStoryData() {
        this.#app.get("/post/getStoryData", async (req, res) => {
            try {
                const storyData = await this.#databaseHelper.handleQuery({
                    query: `SELECT 
                        first_name,
                        sur_name,
                        title,
                        content,
                        url,
                        email,
                        user_name,
                        verified,
                        anonymous,
                        disable_comments,
                        disable_votes,
                        explicit,
                        year,
                        (SELECT COUNT(id) FROM comment WHERE story_id = story.id) AS comments,
                        SUM(user_like.value) AS likes, 
                        (SELECT GROUP_CONCAT(tag.id ORDER BY tag.id SEPARATOR ', ') 
                        FROM story_tag 
                        LEFT JOIN tag ON story_tag.tag_id = tag.id 
                        WHERE story_tag.story_id = story.id
                        ORDER BY tag.id 
                        LIMIT 3) AS tags
                    FROM 
                        story
                        LEFT JOIN user_like ON user_like.story_id = story.id
                        LEFT JOIN user_info ON user_info.email = story.user_email
                        LEFT JOIN user_data ON user_data.user_email = story.user_email
                    WHERE url = ?;
                    `,
                    values: [req.query.url]
                });

                // Just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json({ "story": storyData });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }

    /**
     * Route for requesting the data of all available tags.
     * This function supports GET requests.
     * All available tags are returned as a JSON object.
     * @private
     */
    #getTags() {
        this.#app.get("/post/getTags", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT * FROM tag WHERE name NOT LIKE '%Geverifieerd%' ORDER BY name ASC;`,
                });

                // Just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }

    /**
     * Route for requesting if the user is verified or not.
     * This function supports GET requests and requires the "email" query parameter.
     * The verification status of the user is returned as a JSON object.
     * @private
     */
    #checkUser() {
        this.#app.get("/post/checkUser", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT email_verification FROM user_data WHERE user_email LIKE ?;`,
                    values: [req.query.email]
                });

                // Just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }
}

module.exports = postRoutes;