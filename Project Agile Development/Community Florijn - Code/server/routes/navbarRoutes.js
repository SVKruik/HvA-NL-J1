/**
 * Route responsible for all events for the navbar repository
 * @author Donovan Tjokrodimedjo
 */
class navbarRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #databaseHelper = require("../framework/utils/databaseHelper");
    #app;

    constructor(app) {
        this.#app = app;

        // Activate all the methods.
        this.#getUserData();
    }

    /**
     * Route for requesting all data from a specific user
     * This function supports GET requests and requires the "email" query parameter.
     * The data is returned as a JSON object.
     * @private
     */
    #getUserData() {
        this.#app.get("/navbar/userData", async (req, res) => {
            try {
                const userData = await this.#databaseHelper.handleQuery({
                    query: `SELECT * FROM user_data LEFT JOIN user_info ON user_data.user_email = user_info.email WHERE user_data.user_email = ?`,
                    values: [req.query.email]
                });

                // Gives all data back in JSON format
                res.status(this.#errorCodes.HTTP_OK_CODE).json(userData);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }
}

module.exports = navbarRoutes;
