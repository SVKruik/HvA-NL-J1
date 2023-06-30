/**
 * @author Donovan Tjokrodimedjo
 */
class footerRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #databaseHelper = require("../framework/utils/databaseHelper");
    #app;

    /**
     * @param app - ExpressJS instance passed via app.js.
     */
    constructor(app) {
        this.#app = app;

        // Activate all the methods.
        this.#setLanguage();
    };


    /**
     * Route for inserting the new selected language for a specific user
     * This function supports POST requests and requires the "email" and "language" query parameter.
     * The data is returned as a JSON object.
     * @private
     */
    #setLanguage() {
        this.#app.post("/footer/setLanguage", async (req, res) => {
            try {
                await this.#databaseHelper.handleQuery({
                    query: `UPDATE user_settings SET language = ? WHERE user_email = ?`,
                    values: [req.body.language, req.body.email]
                });

                // Returns true on succesful query on the database
                res.status(this.#errorCodes.HTTP_OK_CODE).json(true);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    };
}

module.exports = footerRoutes;