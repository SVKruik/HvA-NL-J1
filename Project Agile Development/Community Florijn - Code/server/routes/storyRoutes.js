/**
 * Routes for the 'story' entity.
 * @author Stefan Kruik
 */

class StoryRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #databaseHelper = require("../framework/utils/databaseHelper.js");
    #app;

    /**
     * Constructor of the route.
     * @param {app} app - ExpressJS instance passed via app.js.
     */
    constructor(app) {
        this.#app = app;

        // Activate all the methods.
        this.#loadStoryData();
        this.#loadTag();
        this.#loadLeaderboard();
        this.#tagInfo();
    };

    /**
     * Load all story data.
     * @private
     */
    #loadStoryData() {
        this.#app.get("/story/story-info", async (req, res) => {
            try {
                // Body
                let sortColumn = req.query.sortColumn;
                if (sortColumn === "undefined" || sortColumn === "null") sortColumn = undefined;
                let sortType = req.query.sortType;
                if (sortType === "undefined" || sortType === "null") sortType = undefined;
                let tags = req.query.tagArray;
                if (tags === "undefined" || tags === "null") tags = undefined;
                let title = req.query.title;
                if (title === "undefined" || title === "null") title = undefined;
                let content = req.query.content;
                if (content === "undefined" || content === "null") content = undefined;
                let author = req.query.author;
                if (author === "undefined" || author === "null") author = undefined;
                let year = req.query.year;
                if (year === "undefined" || year === "null") year = undefined;
                let url = req.query.url;
                if (url === "undefined" || url === "null") url = undefined;
                let explicit = parseInt(req.query.explicit);
                if (explicit === "undefined" || explicit === "null") explicit = 1;
                let verified = parseInt(req.query.verified);
                if (verified === "undefined" || verified === "null") verified = 0;

                let orderQuery = "";
                let tagQuery = "";
                let inputQuery = "";

                if (!url) {
                    // Sorting
                    if (sortColumn !== undefined && sortType !== undefined) orderQuery = `ORDER BY ${sortColumn} ${sortType}`;

                    // Tags
                    tags = tags.split(",");
                    if (tags[0] === "") tags = [];
                    if (tags.length >= 1) {
                        const base = "(SELECT GROUP_CONCAT(tag.id ORDER BY tag.id SEPARATOR ', ') FROM story_tag LEFT JOIN tag ON story_tag.tag_id = tag.id WHERE story_tag.story_id = story.id ORDER BY tag.id LIMIT 3) LIKE '";
                        if (tags.length <= 3) tagQuery = "WHERE " + base;
                        if (tags.length === 3) {
                            tagQuery += "%";
                            for (let i = 0; i < tags.length; i++) {
                                tagQuery += `${parseInt(tags[i])}`;
                                if (i !== tags.length - 1) tagQuery += ", ";
                            };
                            tagQuery += "%'";
                        } else if (tags.length === 2) {
                            tagQuery += `${parseInt(tags[0])}%${parseInt(tags[1])}' OR ${base}%${parseInt(tags[0])}, ${parseInt(tags[1])}%'`;
                        } else if (tags.length === 1) {
                            if (parseInt(tags[0]) <= 5) {
                                tagQuery = `WHERE (SELECT GROUP_CONCAT(tag.id ORDER BY tag.id SEPARATOR ', ') FROM story_tag LEFT JOIN tag ON story_tag.tag_id = tag.id WHERE story_tag.story_id = story.id ORDER BY tag.id LIMIT 3) REGEXP CONCAT('(^|, )(${parseInt(tags[0])})(,|$)')`;
                            } else tagQuery += `%${tags[0]}%'`;
                        } else tagQuery = "WHERE story.id = -1";
                    };

                    // Text Inputs
                    if (title || content || author || year) {
                        if (tagQuery) {
                            if (title || content || author || year) inputQuery = " AND ";
                        } else inputQuery = "WHERE ";
                        if (title) {
                            inputQuery += `story.title LIKE '%${title}%'`;
                            if (content || author || year) inputQuery += ` AND `;
                        };
                        if (content) {
                            inputQuery += `story.content LIKE '%${content}%'`;
                            if (author || year) inputQuery += ` AND `;
                        };
                        if (author) {
                            inputQuery += `user_info.user_name LIKE '%${author}%' AND story.anonymous = 0`;
                            if (year) inputQuery += ` AND `;
                        };
                        if (year) inputQuery += `story.year = ${year}`;
                    };
                } else inputQuery = `WHERE story.url = '${url}'`;

                if (verified === 1 || explicit === 0) {
                    if (inputQuery || tagQuery) {
                        inputQuery += " AND ";
                    } else inputQuery = "WHERE ";

                    if (verified === 1) {
                        inputQuery += "story.verified = 1";
                        if (explicit === 0) inputQuery += " AND ";
                    };
                    if (explicit === 0) inputQuery += "story.explicit = 0";
                };

                const data = await this.#databaseHelper.handleQuery({
                    query: `
                SELECT 
                    story.*,
                    user_info.user_name,
                    user_data.user_type,
                    (SELECT COUNT(*) FROM comment WHERE comment.story_id = story.id) AS comments,
                    (SELECT SUM(IFNULL(user_like.value, 0)) FROM user_like WHERE user_like.story_id = story.id) AS likes,
                    (SELECT GROUP_CONCAT(tag.name ORDER BY tag.id SEPARATOR ', ') FROM story_tag LEFT JOIN tag ON story_tag.tag_id = tag.id WHERE story_tag.story_id = story.id ORDER BY tag.id LIMIT 3) AS tagname,
                    (SELECT GROUP_CONCAT(tag.id ORDER BY tag.id SEPARATOR ', ') FROM story_tag LEFT JOIN tag ON story_tag.tag_id = tag.id WHERE story_tag.story_id = story.id ORDER BY tag.id LIMIT 3) AS tagid
                FROM story
                LEFT JOIN user_info ON user_info.email = story.user_email
                LEFT JOIN user_data ON user_data.user_email = story.user_email
                LEFT JOIN story_tag ON story_tag.story_id = story.id
                LEFT JOIN comment ON comment.story_id = story.id
                LEFT JOIN user_like ON user_like.story_id = story.id
                ${tagQuery} 
                ${inputQuery}
                GROUP BY 
                      story.id
                ${orderQuery}`,
                    values: []
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Query tag count.
     * @private
     */
    #loadTag() {
        this.#app.get("/story/tag", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT story_tag.id, tag.name, tag.id, COUNT(IFNULL(story_tag.id, 0)) as count FROM tag LEFT JOIN story_tag ON story_tag.tag_id = tag.id GROUP BY tag.id;`,
                    values: []
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Get all information for the leaderboard.
     * @private
     */
    #loadLeaderboard() {
        this.#app.get("/story/leaderboard", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `
                SELECT 
                    ROW_NUMBER() OVER (ORDER BY credits DESC) AS position,
                    credits,
                    CONCAT('#profile/', user_name) AS link,
                    CONCAT('uploads/profile/', user_name, '.jpg') AS image,
                    CONCAT('@', user_name) AS username,
                    CONCAT(first_name, ' ', LEFT(sur_name, 1), '.') AS name
                FROM
                    user_info
                LEFT JOIN user_data ON user_data.user_email = user_info.email
                WHERE user_type != 2
                ORDER BY credits DESC;`,
                    values: []
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Query all tag info.
     * @private
     */
    #tagInfo() {
        this.#app.get("/story/tag-info", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT * FROM tag;`,
                    values: []
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };
};

module.exports = StoryRoutes;