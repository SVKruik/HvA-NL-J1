/**
 * Route responsible for all events for the home repository
 * @author Donovan Tjokrodimedjo
 */

class homeRoutes {
  #errorCodes = require("../framework/utils/httpErrorCodes");
  #databaseHelper = require("../framework/utils/databaseHelper");
  #app;

  constructor(app) {
    this.#app = app;

    // Activate all the methods.
    this.#getSotw();
  };


  /**
   * Route for requesting the story of the week data, the most liked story, and the most liked story of the week
   * This function supports GET requests and does not require any parameters.
   * The data is returned as a JSON object.
   * @private
   */
  #getSotw() {
    this.#app.get("/home/storyOfTheWeek", async (req, res) => {
      try {
        const storyOfTheWeek = await this.#databaseHelper.handleQuery({
          query: `
                SELECT 
                    story.*,
                    user_info.user_name,
                    user_data.user_type,
                    (SELECT COUNT(id) FROM comment WHERE story_id = story.id) AS comments,
                    (SELECT SUM(value) FROM user_like WHERE user_like.story_id = story.id) AS likes,
                    (SELECT SUBSTRING_INDEX(GROUP_CONCAT(tag.name ORDER BY tag.id SEPARATOR ', '), ', ', 3)
                        FROM story_tag 
                        LEFT JOIN tag ON story_tag.tag_id = tag.id 
                        WHERE story_tag.story_id = story.id
                    ) AS tagname,
                    (SELECT SUBSTRING_INDEX(GROUP_CONCAT(tag.id ORDER BY tag.id SEPARATOR ', '), ', ', 3)
                        FROM story_tag 
                        LEFT JOIN tag ON story_tag.tag_id = tag.id 
                        WHERE story_tag.story_id = story.id) AS tagid
                FROM 
                    story
                    LEFT JOIN user_like ON user_like.story_id = story.id
                    LEFT JOIN user_info ON user_info.email = story.user_email
                    LEFT JOIN user_data ON user_data.user_email = story.user_email
                WHERE 
                    user_like.type = 'Story'
                    AND user_like.date > DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY 
                    story.id
                HAVING 
                    tagname NOT LIKE '%Vraag%'
                    AND likes > 0
                ORDER BY 
                    likes DESC
                LIMIT 1;
                `,
          values: []
        });

        if (storyOfTheWeek[0] && (storyOfTheWeek[0].tagname).split(',').length < 3) {
          res.status(this.#errorCodes.HTTP_OK_CODE).json({ "sotw": null });
        } else {
          res.status(this.#errorCodes.HTTP_OK_CODE).json({ "sotw": storyOfTheWeek });
        }
      } catch (e) {
        res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
      }
    });
  };
}

module.exports = homeRoutes;