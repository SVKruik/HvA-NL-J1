
class loginRoutes {
    #app;
    #databasehelper = require("../framework/utils/databaseHelper.js");
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #nodeMailer = require('nodemailer');

    constructor(app) {
        this.#app = app;

        // Activate all the methods.
        this.#verificationCode();
        this.#sendCodeMail();
    }

    /**
     * updates verifcation_code in deatabase based on user_email
     */
    #verificationCode() {
        this.#app.post("/login/verification-code", (req, res) => {
            try {
                const { email, verificationCode } = req.body;

                // Update the verification_pin table with the verification code based on the user's email
                this.#databasehelper.handleQuery({
                    query: "UPDATE user_data SET verification_pin = ? WHERE user_email = ?;",
                    values: [verificationCode, email]
                });

            } catch (error) {
                console.error(error);
                res.status(500).send("An error occurred");
            }
        });
    }

    /**
     * sends the user a mail with de verificationcode which is needed to change your password
     */
    #sendCodeMail() {
        this.#app.post("/login/mail", async (req, res) => {
            try {
                const code = req.body.verification_pin;

                const name = await this.#databasehelper.handleQuery({
                    query: `SELECT first_name, sur_name FROM user_info  WHERE email = '${req.body.email}';`,
                    values: []
                });
                if (!name[0]) return;
                const firstName = name[0].first_name;
                const surName = name[0].sur_name;
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
                            "name": firstName + " " + surName,
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
                         <p class="mail-main-text">${req.body.translationEdge["salutation"]} ${firstName + " " + surName},</p>
                            <br>
                           <p class="mail-main-text">${req.body.translation["1"]}</p>
                            <br>
                           <p class="mail-main-text">${req.body.translation["2"]} ${code}</p>
                            <br>
                           <p class="mail-main-text">${req.body.translationEdge["closing"]},</p>
                    
                           <p class="mail-main-text" style="margin-bottom: 60px;">${req.body.translationEdge["name"]}</p>
                        </div>
                        <div class="mail-footer">
                            <p class="mail-main-text">${req.body.translation["3"]}</p>
                            <p class="mail-small-text">${req.body.translationEdge["generated"]}</p>
                            <p class="mail-small-text"><a href="https://${req.body.env}flo-8.hbo-ict.cloud/#home">${req.body.translationEdge["link-home"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdge["link-support"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdge["link-privacy"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdge["link-copyright"]}</a></p>
                            <p class="mail-small-text">Community Florijn</p>
                        </div>
                    </div>`
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: [message] });

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

};

module.exports = loginRoutes;