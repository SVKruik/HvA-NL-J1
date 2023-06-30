/**
 * Routes for the 'verify' entity.
 * @author Stefan Kruik
 */

class verifyRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #nodeMailer = require('nodemailer');
    #databaseHelper = require("../framework/utils/databaseHelper");
    #app;

    /**
     * @param app - ExpressJS instance passed via app.js.
     */
    constructor(app) {
        this.#app = app;

        // Activate all the methods.
        this.#sendVerifyMail();
        this.#getPin();
        this.#verifyAccount();
        this.#getStatus();
        this.#updateEmail();
    };


    /**
     * Send a verification mail to said user.
     * @private
     */
    #sendVerifyMail() {
        this.#app.post("/verify/mail", async (req, res) => {
            try {
                const pinData = await this.#databaseHelper.handleQuery({
                    query: `SELECT concat(first_name, " ", sur_name) AS name, verification_pin AS pin FROM user_data INNER JOIN user_info ON email = user_email WHERE user_email = ?;`,
                    values: [req.body.email]
                });
                if (!pinData[0]) return;
                const pin = pinData[0].pin;
                const name = pinData[0].name;

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
                            <br><br>
                    
                            <p class="mail-main-text">${req.body.translation["1"]}</p>
                            <ul class="mail-main-text">
                                <li>${pin}</li>
                            </ul>
                    
                            <p class="mail-main-text">${req.body.translation["2"]}</p>
                    
                            <br><br>
                            <p class="mail-main-text">${req.body.translationEdge["closing"]},</p>
                    
                            <p class="mail-main-text" style="margin-bottom: 60px;">${req.body.translationEdge["name"]}</p>
                        </div>
                        <div class="mail-footer">
                            <p class="mail-small-text">${req.body.translationEdge["receiver-1"]} ${name}. ${req.body.translationEdge["receiver-2"]}</p>
                            <p class="mail-small-text">${req.body.translationEdge["generated"]}</p>
                            <p class="mail-small-text"><a href="https://${req.body.env}flo-8.hbo-ict.cloud/#home">${req.body.translationEdge["link-home"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdge["link-support"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdge["link-privacy"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdge["link-copyright"]}</a></p>
                            <p class="mail-small-text">Community Florijn</p>
                        </div>
                    </div>`
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: [message, pinData] });
            } catch (error) {
                console.log(error);
                if (error.responseCode === 553) {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ result: "Invalid Email" });
                } else {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
                };
            };
        });
    };

    /**
     * Get the pincode of a user.
     * @private
     */
    #getPin() {
        this.#app.get("/verify/pin", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT verification_pin AS pin FROM user_data WHERE user_email = ?;`,
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
     * Verify a user in the database.
     * @private
     */
    #verifyAccount() {
        this.#app.put("/verify/verify-account", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `UPDATE user_data SET email_verification = 1 WHERE user_email = ?;`,
                    values: [req.body.email]
                });

                if (data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: data });
            } catch (error) {
                console.log(error);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
            };
        });
    };

    /**
     * Get the current email verification status of the user.
     * @private
     */
    #getStatus() {
        this.#app.get("/verify/status", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT email_verification AS status FROM user_data WHERE user_email = ?;`,
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
     * Update the users email address.
     * @private
     */
    #updateEmail() {
        this.#app.put("/verify/email-update", async (req, res) => {
            try {
                const randomNumber = Math.floor(100000 + Math.random() * 900000);
                const emailData = await this.#databaseHelper.handleQuery({
                    query: `UPDATE user_info SET email = ? WHERE email = ?;`,
                    values: [req.body.newEmail, req.body.email]
                });

                const data = await this.#databaseHelper.handleQuery({
                    query: `UPDATE user_data SET verification_pin = ? WHERE user_email = ?;`,
                    values: [randomNumber, req.body.newEmail]
                });

                if (emailData && data) res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: emailData });
            } catch (error) {
                if (error.errno === 1761) {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ result: "Invalid Email" });
                } else {
                    console.log(error);
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
                };
            };
        });
    };
};

module.exports = verifyRoutes;