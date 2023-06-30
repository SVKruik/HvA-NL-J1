/**
 * Routes for the 'timeline' entity.
 * @author Stefan Kruik
 */

class TimelineRoutes {
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
        this.#storyCount();
    };

    /**
     * Get the amount of stories per year.
     * @private
     */
    #storyCount() {
        this.#app.get("/timeline/count", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT year, count(*) AS count FROM story GROUP BY year;`,
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

module.exports = TimelineRoutes;