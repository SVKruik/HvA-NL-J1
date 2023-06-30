/**
 * Routes for the 'story-read' entity.
 * @author Stefan Kruik
 */
class StoryReadRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #nodeMailer = require('nodemailer');
    #databaseHelper = require("../framework/utils/databaseHelper");
    #app;

    /**
     * Constructor of the route.
     * @param {app} app - ExpressJS instance passed via app.js.
     */
    constructor(app) {
        this.#app = app;

        // Activate all the methods.
        this.#translateRequest();
        this.#verifyStory();
        this.#userLike();
        this.#checkLike();
        this.#loadComments();
        this.#placeComment();
        this.#userInfoEmail();
        this.#userInfoUsername();
        this.#totalLikes();
        this.#totalComments();
        this.#totalLikesStory();
        this.#commentData();
        this.#sendInteractionEmail();
        this.#userCommentData();
    };

    #translateRequest() {
        this.#app.get("/story-read/translate", async (req, res) => {
            const translate = require('translatte');

            try {
                let result;

                await translate(req.query.text, { to: req.query.language }).then(translateOutput => {
                    result = translateOutput.text;
                }).catch(error => {
                    console.error(error);
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({ result });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * (Un) Verify a story. Changes verification status.
     * @private
     */
    #verifyStory() {
        this.#app.put("/story-read/verify", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `UPDATE story SET verified = ? WHERE url = ?;`,
                    values: [req.body.value, req.body.url]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Add or remove a story or comment to user likes list.
     * @private
     */
    #userLike() {
        this.#app.post("/story-read/user-like", async (req, res) => {
            try {
                const vote = req.body.vote;
                const storyId = req.body.storyId || -1;
                const commentId = req.body.commentId || -1;
                const user_email = req.body.user_email;
                const type = req.body.type;

                let likeType;
                let typeId;
                if (type == "Story") {
                    likeType = "story_id";
                    typeId = storyId;
                } else if (type == "Comment") {
                    likeType = "comment_id";
                    typeId = commentId;
                };

                const likeData = await this.#databaseHelper.handleQuery({
                    query: `SELECT id FROM user_like WHERE user_email = ? AND ${likeType} = ${typeId};`,
                    values: [req.body.user_email]
                });

                let query;
                // 1/-1 = vote = create/update
                if (likeData.length === 0) {
                    if (vote === 1) {
                        query = `INSERT INTO user_like (user_email, value, date, type, ${likeType}) VALUES ('${user_email}', 1, CURRENT_TIMESTAMP, '${type}', ${typeId});`
                    } else if (vote === 0) {
                        query = `INSERT INTO user_like (user_email, value, date, type, ${likeType}) VALUES ('${user_email}', -1, CURRENT_TIMESTAMP, '${type}', ${typeId});`;
                    };
                } else if (likeData[0].id) {
                    if (vote === 1) {
                        query = `UPDATE user_like SET value = 1, date = CURRENT_TIMESTAMP WHERE user_email = '${user_email}' AND ${likeType} = ${typeId};`;
                    } else if (vote === 0) {
                        query = `UPDATE user_like SET value = -1, date = CURRENT_TIMESTAMP WHERE user_email = '${user_email}' AND ${likeType} = ${typeId};`;
                    };
                };
                // 2 = neutral = delete
                if (vote === 2) {
                    query = `DELETE FROM user_like WHERE user_email = '${user_email}' AND ${likeType} = ${typeId};`;
                };

                let data = "";
                if (query !== undefined) {
                    data = await this.#databaseHelper.handleQuery({
                        query: query,
                        values: []
                    });
                };

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Check if logged-in user liked a story.
     * @private
     */
    #checkLike() {
        this.#app.get("/story-read/check-like", async (req, res) => {
            try {
                const type = req.query.type.toLowerCase() + "_id";
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT value FROM user_like WHERE user_email = ? AND ${type} = ? AND type = ?;`,
                    values: [req.query.userEmail, req.query.typeId, req.query.type]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Check if logged-in user liked a story.
     * @private3
     */
    #loadComments() {
        this.#app.get("/story-read/comments", async (req, res) => {
            try {
                const sort = req.query.sort || "ORDER BY date ASC";

                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT comment.id, comment.story_id, parent_comment_id, comment.content, comment.date, user_name, SUM(user_like.value) AS likes FROM comment LEFT JOIN user_data ON user_data.user_email = comment.user_email LEFT JOIN user_info ON user_info.email = user_data.user_email LEFT JOIN user_like ON user_like.comment_id = comment.id  WHERE comment.story_id = ? GROUP BY comment.id ${sort};`,
                    values: [req.query.storyId]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Create a new comment under a story.
     * @private
     */
    #placeComment() {
        this.#app.post("/story-read/place-comment", async (req, res) => {
            try {
                let parentColumn = "";
                let parentValue = "";
                if (req.body.parentComment) {
                    parentColumn = ", parent_comment_id"
                    parentValue = `, ${req.body.parentComment}`;
                };

                const data = await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO comment (story_id, user_email, content, date${parentColumn}) VALUES (?, ?, ?, CURRENT_TIMESTAMP${parentValue});`,
                    values: [req.body.storyId, req.body.email, req.body.content]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Get data of the comment.
     * @private
     */
    #userCommentData() {
        this.#app.get("/story-read/user-comment-data", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT * FROM comment WHERE parent_comment_id = ?;`,
                    values: [req.query.parentComment]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Get username from the database.
     * @private
     */
    #userInfoEmail() {
        this.#app.get("/story-read/user-info-email", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT * FROM user_info LEFT join user_data ON user_data.user_email = user_info.email WHERE email = ?;`,
                    values: [req.query.email]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Get user email from the database.
     * @private
     */
    #userInfoUsername() {
        this.#app.get("/story-read/user-info-username", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT * FROM user_info WHERE user_name = ?;`,
                    values: [req.query.username]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Get total amount of likes a user has.
     * @private
     */
    #totalLikes() {
        this.#app.get("/story-read/total-likes", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT IFNULL(SUM(user_like.value), 0) AS total
                            FROM user_like
                            LEFT JOIN comment ON comment.id = user_like.comment_id
                            LEFT JOIN story ON story.id = user_like.story_id
                            WHERE (comment.user_email = ? AND user_like.comment_id != -1)
                            OR (story.user_email = ? AND user_like.story_id != -1)
                            AND user_like.value IS NOT NULL;`,
                    values: [req.query.email, req.query.email]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Get total amount of comments a user has posted.
     * @private
     */
    #totalComments() {
        this.#app.get("/story-read/total-comments", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT COUNT(id) as total FROM comment WHERE user_email = ?;`,
                    values: [req.query.email]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Get total amount of different stories a user has liked.
     * @private
     */
    #totalLikesStory() {
        this.#app.get("/story-read/total-likes-story", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT COUNT(id) as total FROM user_like WHERE comment_id = -1 AND user_email = ?;`,
                    values: [req.query.email]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Get comment info from the database.
     * @private
     */
    #commentData() {
        this.#app.get("/story-read/comment-data", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT content FROM comment WHERE id = ?;`,
                    values: [req.query.id]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Send an email when a user responds to your comment or story.
     * @private
     */
    #sendInteractionEmail() {
        this.#app.post("/story-read/interaction-email", async (req, res) => {
            try {
                const userData = await this.#databaseHelper.handleQuery({
                    query: `SELECT concat(first_name, " ", sur_name) AS name FROM user_data INNER JOIN user_info ON email = user_email WHERE user_email = ?;`,
                    values: [req.body.email]
                });
                if (!userData[0]) return;
                const name = userData[0].name;

                // Log into our joint account.
                const transporter = this.#nodeMailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "community.florijn@gmail.com",
                        pass: "yncunmcqlpiolfls"
                    }
                });

                // Construct and send the message.
                const message = await transporter.sendMail({
                    "from": {
                        "name": "Community Florijn",
                        "address": "community.florijn@gmail.com"
                    },
                    "to": [
                        {
                            "name": name,
                            "address": req.body.email
                        }
                    ],
                    "subject": req.body.translation["title"],
                    "html": `
                    <style>
                    .mail-main-text {
                        font-size: 17px;
                    }

                    .mail-small-text {
                        font-size: 13px;
                    }

                    .logo-image {
                        filter: brightness(0%);
                    }
                    </style>
                    <div class="mail-content-container">
                        <div class="mail-header">
                            <img class="logo-image" src="https://i.imgur.com/JwT5kdo.png" width="300">
                        </div><br>
                        <div class="mail-body">
                            <p class="mail-main-text">${req.body.translationEdge["salutation"]} ${name},</p>
                            <br>
                    
                            <p class="mail-main-text">${req.body.translation["1"]} <strong>${req.body.authorName}</strong> ${req.body.translation["2"]} ${req.body.type}:</p>
                            <ul class="mail-main-text">
                                <li>${req.body.translation["8"]} ${req.body.type}: ${req.body.title}</li>
                                <li>${req.body.authorName}: ${req.body.content}</li>
                            </ul>
                    
                            <p class="mail-main-text">${req.body.translation["3"]} <a href="${req.body.url}" target="_blank">${req.body.translation["4"]}</a> ${req.body.translation["5"]}</p>
                    
                            <br><br>
                            <p class="mail-main-text">${req.body.translationEdge["closing"]},</p>
                    
                            <p class="mail-main-text" style="margin-bottom: 60px;">${req.body.translationEdge["name"]}</p>
                        </div>
                        <div class="mail-footer">
                            <p class="mail-small-text">${req.body.translationEdge["receiver-1"]} ${name}. ${req.body.translationEdge["receiver-2"]}</p>
                            <p class="mail-small-text">${req.body.translationEdge["generated"]}</p>
                            <p class="mail-small-text">${req.body.translation["6"]} <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#settings/account">${req.body.translation["7"]}</a>.</p>
                            <p class="mail-small-text"><a href="https://${req.body.env}flo-8.hbo-ict.cloud/#home">${req.body.translationEdge["link-home"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdge["link-support"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdge["link-privacy"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdge["link-copyright"]}</a></p>
                            <p class="mail-small-text">Community Florijn</p>
                        </div>
                    </div>`
                });

                if (message) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: message });
            } catch (error) {
                console.log(error);
                if (error.responseCode === 553) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: "Invalid Email" });
                } else {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
                };
            };
        });
    };
};

module.exports = StoryReadRoutes;