/**
 * Routes for the Profile
 * @author Emir Bay
 */

class ProfileRoutes {
    #app;
    #database = require("../framework/utils/databaseHelper");
    #errorCodes = require("../framework/utils/httpErrorCodes");

    constructor(app) {
        this.#app = app;

        // Activate all the methods.
        this.#getUser();
        this.#deleteStory();
        this.#deleteComment();
    };

    /**
     * Get user information and user's stories
     */
    #getUser() {
        this.#app.get("/profile/:username", async (req, res) => {

            //Gathering information of user with/without story
            try {
                const data = await this.#database.handleQuery({
                    query: `SELECT i.email,
                                       d.user_type,
                                       CONCAT(day(creation_date)," ", MONTHNAME(creation_date), " ", year(creation_date)) AS creationDate,
                                       i.user_name,
                                       i.first_name,
                                       i.sur_name,
                                       d.biography,
                                       s.id,
                                       s.url,
                                       s.title,
                                       s.content,
                                       s.date,
                                       s.anonymous,
                                       s.disable_votes,
                                       s.disable_comments,
                                       s.verified,
                                       s.explicit,
                                       s.sotw,
                                       d.credits,
                                       user_achievements.01_first_story,
                                       user_achievements.02_first_comment,
                                       user_achievements.03_story_verified,
                                       user_achievements.04_story_sotw,
                                       user_achievements.05_story_vote_threshold,
                                       user_achievements.06_vote_combined,
                                       user_achievements.07_comment_threshold,
                                       user_achievements.08_wordcount_threshold,
                                       user_achievements.09_vote_out_threshold,
                                       user_achievements.10_share,
                                       (SELECT COUNT(id) FROM comment WHERE story_id = s.id)   AS comments,
                                       (SELECT SUM(l.value) FROM user_like l WHERE l.story_id = s.id) AS likes,
                                       (SELECT GROUP_CONCAT(tag.name ORDER BY tag.id SEPARATOR ', ')
                                        FROM story_tag
                                                 LEFT JOIN tag ON story_tag.tag_id = tag.id
                                        WHERE story_tag.story_id = s.id
                                        ORDER BY tag.id  LIMIT 3) AS tagname,
                                        (SELECT GROUP_CONCAT(tag.id ORDER BY tag.id SEPARATOR ', ') FROM story_tag LEFT JOIN tag ON story_tag.tag_id = tag.id WHERE story_tag.story_id = s.id ORDER BY tag.id LIMIT 3) AS tagid
                                FROM user_info i LEFT JOIN user_data d
                                on i.email = d.user_email LEFT JOIN story s on i.email = s.user_email
                                LEFT JOIN user_achievements ON user_achievements.user_email = i.email
                                WHERE i.user_name = ?
                                ORDER BY s.date DESC;`,
                    values: [req.params.username]
                });

                //Gathering information of the liked stories of user
                const data2 = await this.#database.handleQuery({
                    query: `SELECT DISTINCT l.type,
                                                (SELECT user_name FROM user_info WHERE email = s.user_email)   AS user_name,
                                                s.url,
                                                s.title,
                                                s.content,
                                                s.date,
                                                s.verified,
                                                s.explicit,
                                                s.disable_comments,
                                                s.disable_votes,
                                                s.sotw,
                                                s.anonymous,
                                                l.story_id    AS id,
                                                l.id      AS likeID,
                                                (SELECT user_type
                                                 FROM user_data
                                                 WHERE user_data.user_email = s.user_email)     AS user_type,
                                                (SELECT COUNT(id) FROM comment WHERE story_id = s.id)          AS comments,
                                                (SELECT SUM(l.value) FROM user_like l WHERE l.story_id = s.id) AS likes,
                                                (SELECT GROUP_CONCAT(tag.name ORDER BY tag.id SEPARATOR ', ')
                                                 FROM story_tag
                                                          LEFT JOIN tag ON story_tag.tag_id = tag.id
                                                 WHERE story_tag.story_id = s.id
                                                 ORDER BY tag.id    LIMIT 3) AS tagname, 
                                   (SELECT GROUP_CONCAT(tag.id ORDER BY tag.id SEPARATOR ', ') FROM story_tag LEFT JOIN tag ON story_tag.tag_id = tag.id WHERE story_tag.story_id = s.id ORDER BY tag.id LIMIT 3) AS tagid
                                FROM user_info i LEFT JOIN user_data d
                                on i.email = d.user_email LEFT JOIN user_like l on i.email = l.user_email LEFT JOIN story s on s.id = l.story_id LEFT JOIN story_tag on story_tag.story_id = s.id
                                WHERE user_name = ? AND l.type = 'Story'
                                ORDER BY likeID DESC;`,
                    values: [req.params.username]
                });

                //Gathering information of the user comments
                const data3 = await this.#database.handleQuery({
                    query: `SELECT user_name,
       c.id AS commentID,
                                       c.story_id     AS id,
                                       c.user_email,
                                       c.content     AS comment,
                                       c.date        AS commentDate,
                                       s.url,
                                       s.title,
                                       s.content,
                                       s.date,
                                       s.verified,
                                       s.explicit,
                                       s.disable_comments,
                                       s.disable_votes,
                                       s.sotw,
                                       s.anonymous,
                                       (SELECT COUNT(id) FROM comment WHERE story_id = s.id)          AS comments,
                                       (SELECT SUM(l.value) FROM user_like l WHERE l.story_id = s.id) AS likes,
                                       (SELECT user_type
                                        FROM user_data
                                        WHERE user_data.user_email = s.user_email)                    AS user_type,
                                       (SELECT GROUP_CONCAT(tag.name ORDER BY tag.id SEPARATOR ', ')
                                        FROM story_tag
                                                 LEFT JOIN tag ON story_tag.tag_id = tag.id
                                        WHERE story_tag.story_id = s.id
                                        ORDER BY tag.id LIMIT 3) AS tagname, 
                                        (SELECT GROUP_CONCAT(tag.id ORDER BY tag.id SEPARATOR ', ') FROM story_tag LEFT JOIN tag ON story_tag.tag_id = tag.id WHERE story_tag.story_id = s.id ORDER BY tag.id LIMIT 3) AS tagid
                                FROM comment c LEFT JOIN story s
                                on story_id = s.id LEFT JOIN user_info on email = c.user_email


                                WHERE user_name = ?
                                ORDER BY commentDate DESC;`,
                    values: [req.params.username]
                });

                //Converting user data to JSON
                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    result: data,
                    result2: data2,
                    result3: data3
                });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            };
        });
    };

    /**
     * Delete selected story of user
     */
    #deleteStory() {
        this.#app.delete("/profile/story-remove", async (req, res) => {

            //Gathering information of user (Info, story, likes and comments)
            try {
                const id = (await this.#database.handleQuery({
                    query: "SELECT id FROM story WHERE url = ?",
                    values: [req.body.url]
                }));

                const data = await this.#database.handleQuery({
                    query: "DELETE FROM story WHERE url = ?",
                    values: [req.body.url]
                });

                const data2 = await this.#database.handleQuery({
                    query: "DELETE FROM user_like WHERE story_id = ?",
                    values: [id[0].id]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    result: [id, data, data2]
                });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }

    /**
     * Delete selected comment of user
     */
    #deleteComment() {
        this.#app.delete("/profile/comment-remove", async (req, res) => {
            try {
                const data = (await this.#database.handleQuery({
                    query: "DELETE FROM comment WHERE id = ?",
                    values: [req.body.id]
                }));

                //Converting user data to JSON
                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            };
        });
    };
};

module.exports = ProfileRoutes;
