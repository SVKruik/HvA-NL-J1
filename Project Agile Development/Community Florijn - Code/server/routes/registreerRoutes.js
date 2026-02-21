class RegistreerRoutes {
    #databasehelper = require("../framework/utils/databaseHelper.js");
    #httpErrorCodes = require("../framework/utils/httpErrorCodes.js");
    #cryptoHelper = require('../framework/utils/cryptoHelper.js');
    #app;

    constructor(app) {
        this.#app = app;

        // Activate all the methods.
        this.#createAccount();
        this.#createAccountDetail();
        this.#checkEmail();
        this.#checkUsername();
    }

    /**
     * Checked if email is already in databse en returend een boolean
     */
    #checkEmail() {
        this.#app.post("/registreer/checkEmail", async (req, res) => {
            try {
                const data = await this.#databasehelper.handleQuery({
                    query: "SELECT * FROM user_info WHERE email = ? ",
                    values: [req.body.email]
                });

                if (data.length > 0) {
                    // Email already exists in the database
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).send(true);
                } else {
                    // Email does not exist in the database
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).send(false);
                }
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        })
    }

    /**
     * Checked of username in database staat en returend een boolean
     */
    #checkUsername() {
        this.#app.post("/registreer/checkUsername", async (req, res) => {
            try {
                const data = await this.#databasehelper.handleQuery({
                    query: "SELECT * FROM user_info WHERE user_name = ? ",
                    values: [req.body.user_name]
                });

                if (data.length > 0) {
                    // Email already exists in the database
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).send(true);
                } else {
                    // Email does not exist in the database
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).send(false);
                }
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        })

    }

    /**
     *  Inser alle user_info in juiste tabbel met juiste waardes
     */
    #createAccount() {
        this.#app.post("/registreer/info", async (req, res) => {
            try {
                const password = req.body.password;
                const hashedpassword = this.#cryptoHelper.getHashedPassword(password);

                const data = await this.#databasehelper.handleQuery({
                    query: "INSERT INTO user_info(email ,user_name , first_name, sur_name, password) VALUES (?,?,?,?,?)",
                    values: [req.body.email, req.body.user_name, req.body.first_name, req.body.sur_name, hashedpassword]
                });

                if (data.insertId) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({ id: data.insertId });
                }
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        })
    }

    /**
     * Inser alle user_data in juiste tabbel met juiste waardes
     * we stuuren user_type en email_verification niet wat die hebben een standaard waarde van 1 en 0
     * en voor creation date gebruiken we een CURRENT_TIMESTAMP functie
     */
    #createAccountDetail() {
        this.#app.post("/registreer/data", async (req, res) => {
            try {
                const user_data = await this.#databasehelper.handleQuery({
                    query: `INSERT INTO user_data(user_email,creation_date,gender,birthdate,biography,verification_pin) VALUES (?,CURRENT_TIMESTAMP,?,?,?,?)`,
                    values: [req.body.user_email, req.body.gender, req.body.birthdate, req.body.biography, req.body.verification_pin]
                });

                const user_settings = await this.#databasehelper.handleQuery({
                    query: `INSERT INTO user_settings(user_email, language) VALUES (?,?)`,
                    values: [req.body.user_email, req.body.language]
                });

                const user_achievements = await this.#databasehelper.handleQuery({
                    query: `INSERT INTO user_achievements(user_email) VALUES (?)`,
                    values: [req.body.user_email]
                });

                if (user_data.insertId) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({ id: user_data.insertId, data: user_settings, data2: user_achievements });
                }
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        })
    }

}
module.exports = RegistreerRoutes;
