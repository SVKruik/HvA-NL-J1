/**
 * This class contains ExpressJS routes specific for the users entity
 * this file is automatically loaded in app.js
 *
 * @author Pim Meijer
 */
const { hashPassword } = require("mysql/lib/protocol/Auth");

class UsersRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #databaseHelper = require("../framework/utils/databaseHelper");
    #cryptoHelper = require("../framework/utils/cryptoHelper");
    #app;

    /**
     * @param app - ExpressJS instance passed via app.js.
     */
    constructor(app) {
        this.#app = app;

        // Activate all the methods.
        this.#login();
    };

    /**
     * Checks if passed username and password are found in db, if so let the front-end know
     * @private
     */
    #login() {
        this.#app.post("/login", async (req, res) => {
            const email = req.body.email;

            const password = req.body.password;
            const hashPassword = this.#cryptoHelper.getHashedPassword(password);

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT user_name,email,password FROM user_info WHERE email = ? AND password = ?",
                    values: [email, hashPassword]
                });

                // If we found one record we know the user exists in users table
                if (data.length === 1) {
                    // Return just the username for now, never send password back!
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({ "email": data[0].email, "username": data[0].user_name, "data": data[0] });
                } else {
                    // Wrong username
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({ reason: "Wrong username or password" });
                };
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            };
        });
    };
};

module.exports = UsersRoutes;