/**
 * Routes for the 'settings' entity.
 * @author Donovan Tjokrodimedjo
 */

class settingsRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #databaseHelper = require("../framework/utils/databaseHelper.js");
    #cryptoHelper = require("../framework/utils/cryptoHelper.js");
    #app;

    /**
     * Constructor of the route.
     * @param {app} app - ExpressJS instance passed via app.js.
     */
    constructor(app) {
        this.#app = app;


        // Activate all the methods.
        this.#insertData();
        this.#checkPassword();
        this.#checkDuplicates();
        this.#getUserSettings();
        this.#setUserSettings();
        this.#setAccessSettings();
        this.#deleteUser();
        this.#updateCredits();
        this.#getUserAchievement();
        this.#setUserAchievement();
        this.#updateExplicit();
    };

    /**
     * Route for updating user data.
     * This function supports POST requests and requires the following fields in the request body: 
     * type, password, email, firstname, lastname, username, oldmail, and biography. 
     * Depending on the type, different fields are updated in the database. 
     * A JSON object is returned with information about the data changes.
     * @private
     */
    #insertData() {
        this.#app.post("/settings/insertData", async (req, res) => {
            try {

                if (req.body.type == "password") {
                    await this.#databaseHelper.handleQuery({
                        query: `UPDATE user_info SET password = ? WHERE email LIKE ?`,
                        values: [this.#cryptoHelper.getHashedPassword(req.body.password), req.body.email]
                    });
                } else if (req.body.type == "userdata") {
                    await this.#databaseHelper.handleQuery({
                        query: `UPDATE user_info SET first_name = ?, sur_name = ?, user_name = ?, email = ? WHERE email LIKE ?`,
                        values: [req.body.firstname, req.body.lastname, req.body.username, req.body.email, req.body.oldmail]
                    });

                    await this.#databaseHelper.handleQuery({
                        query: `UPDATE user_data SET biography = ? WHERE user_email LIKE ?`,
                        values: [req.body.biography, req.body.email]
                    })
                }

                res.status(this.#errorCodes.HTTP_OK_CODE).send(true);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    };

    /**
     * Route for checking the user's password.
     * This function supports GET requests and requires the following query parameters: email and password.
     * A JSON object is returned with the results of the query.
     * @private
     */
    #checkPassword() {
        this.#app.get("/settings/checkPassword", async (req, res) => {

            try {
                let data = await this.#databaseHelper.handleQuery({
                    query: `SELECT password FROM user_info WHERE email = ? AND password = ?;`,
                    values: [req.query.email, this.#cryptoHelper.getHashedPassword(req.query.password)]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({ data });

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    };

    /**
     * Route for checking for duplicates in the username and email address.
     * This function supports GET requests and requires the following query parameters:
     * newUsername, newEmail, username, and email. 
     * A JSON object is returned with information about the duplicate records.
     * @private
     */
    #checkDuplicates() {
        this.#app.get("/settings/checkDuplicates", async (req, res) => {
            try {
                let checkDuplicates = await this.#databaseHelper.handleQuery({
                    query: `SELECT user_name, email FROM user_info WHERE (user_name = ? OR email = ?) AND user_name <> ? AND email <> ?;`,
                    values: [req.query.newUsername, req.query.newEmail, req.query.username, req.query.email]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({ checkDuplicates });

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    };


    /**
     * Route for fetching user settings.
     * This function supports GET requests and requires the "email" query parameter.
     * A JSON object is returned with information about the user settings.
     * @private
     */
    #getUserSettings() {
        this.#app.get("/settings/getUserSettings", async (req, res) => {
            try {
                const settings = await this.#databaseHelper.handleQuery({
                    query: `SELECT * FROM user_settings WHERE user_email LIKE ?;`,
                    values: [req.query.email]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({ "result": settings });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    };

    /**
     * Route for updating user settings.
     * This function supports POST requests and requires the following fields in the request body:
     * email, interaction, sotw, and language.
     * The user settings are updated in the database.
     * A JSON object is returned with information about the updated user settings.
     * @private
     */
    #setUserSettings() {
        this.#app.post("/settings/setUserSettings", async (req, res) => {
            try {
                const settings = await this.#databaseHelper.handleQuery({
                    query: `UPDATE user_settings SET sotw_mail = ?, interaction_mail = ?, language = ?, auto_translate = ? WHERE user_email LIKE ?;`,
                    values: [req.body.sotw, req.body.interaction, req.body.language, req.body.auto_translate, req.body.email]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({ settings });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    };

    /**
     * Route for updating user's accessibility settings.
     * This function supports POST requests and requires the following fields in the request body:
     * colorblindess, high contrast.
     * The user settings are updated in the database.
     * A JSON object is returned with information about the updated user settings.
     * @private
     */
    #setAccessSettings() {
        this.#app.post("/settings/setAccessSettings", async (req, res) => {
            try {
                const settings = await this.#databaseHelper.handleQuery({
                    query: `UPDATE user_settings SET colorblind = ?, high_contrast = ? WHERE user_email LIKE ?;`,
                    values: [req.body.colorblind, req.body.high_contrast, req.body.email]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({ settings });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    };

    /**
     * Route for deleting a user account.
     * This function supports POST requests and requires the following field in the request body:
     * email. 
     * The user account associated with the provided email will be deleted from the database.
     * @private
     */
    #deleteUser() {
        this.#app.delete("/settings/deleteUser", async (req, res) => {
            try {
                const result = await this.#databaseHelper.handleQuery({
                    query: `DELETE FROM user_info WHERE email = ?;`,
                    values: [req.body.email]
                });

                if (result.affectedRows > 0) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({ message: "User account deleted successfully." });
                } else {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: "User account not found." });
                }

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    };

    /**
     * Increase or decrease user credit amount.
     * @private
     */
    #updateCredits() {
        this.#app.put("/settings/updateCredits", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `UPDATE user_data SET credits = credits + ? WHERE user_email = ?;`,
                    values: [req.body.credits, req.body.email]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Query a specific user achievement.
     * @private
     */
    #getUserAchievement() {
        this.#app.get("/settings/user-achievement", async (req, res) => {
            try {
                if (!/^(?:0[1-9]|10)$/.test(req.query.id)) {
                    return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: "Invalid Achievement ID Provided." });
                };

                const data = await this.#databaseHelper.handleQuery({
                    query: `SET @query = (
                        SELECT GROUP_CONCAT(COLUMN_NAME)
                        FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_NAME = 'user_achievements' AND COLUMN_NAME LIKE '${req.query.id}\_%'
                      ); SET @query = CONCAT('SELECT ', @query, " FROM user_achievements WHERE user_email = '${req.query.email}'"); PREPARE stmt FROM @query; EXECUTE stmt;`,
                    values: []
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Set the value of a specific achievement.
     * @private
     */
    #setUserAchievement() {
        this.#app.put("/settings/set-user-achievement", async (req, res) => {
            try {
                if (!/^(?:0[1-9]|10)$/.test(req.body.id)) {
                    return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: "Invalid Achievement ID Provided." });
                };

                const data = await this.#databaseHelper.handleQuery({
                    query: `
                    SET @query = (
                        SELECT GROUP_CONCAT(CONCAT(COLUMN_NAME, ' = CURRENT_TIMESTAMP'))
                        FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_NAME = 'user_achievements' AND COLUMN_NAME LIKE '${req.body.id}_%'
                      );
                      SET @query = CONCAT(
                        'UPDATE user_achievements SET ',
                        @query,
                        " WHERE user_email = '${req.body.email}'"
                      );
                      PREPARE stmt FROM @query;
                      EXECUTE stmt;
                      `,
                    values: []
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Update the user_settings.show_explicit column.
     * @private
     */
    #updateExplicit() {
        this.#app.put("/settings/update-explicit", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `UPDATE user_settings SET show_explicit = ? WHERE user_email = ?;`,
                    values: [req.body.value, req.body.email]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };
};

module.exports = settingsRoutes;