/**
 * Routes for the 'timeline' entity.
 * @author Stefan Kruik
 */

class SupportRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #nodeMailer = require('nodemailer');
    #databaseHelper = require("../framework/utils/databaseHelper.js");
    #app;

    /**
     * Constructor of the route.
     * @param {app} app - ExpressJS instance passed via app.js.
     */
    constructor(app) {
        this.#app = app;

        // Activate all the methods.
        this.#supportForm();
    };

    /**
     * Get the amount of stories per year.
     * @private
     */
    #supportForm() {
        this.#app.post("/support/form", async (req, res) => {
            try {
                const supportData = await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO support (user_email, subject, type, content, date) VALUES (?, ?, ?, ?, FROM_UNIXTIME(?/1000));`,
                    values: [req.body.email, req.body.subject, req.body.category, req.body.message, req.body.rawDate]
                });
                const userData = await this.#databaseHelper.handleQuery({
                    query: `SELECT concat(first_name, " ", sur_name) AS name FROM user_info WHERE email = ?;`,
                    values: [req.body.email]
                });
                let name = "gebruiker van Community Florijn";
                if (userData[0]) name = userData[0].name;

                // Log into our joint account.
                const transporter = this.#nodeMailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "community.florijn@gmail.com",
                        pass: "yncunmcqlpiolfls"
                    }
                });

                // Construct and send the message.
                const userMessage = await transporter.sendMail({
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
                    "subject": req.body.translationUser["title"],
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
                    
                            <p class="mail-main-text">${req.body.translationUser["1"]}</p>
                            <p class="mail-main-text">${req.body.translationUser["2"]}</p>
                            <p class="mail-main-text">${req.body.translationUser["3"]}</p>
                            <br>
                            <p class="mail-main-text">${req.body.translationUser["4"]}</p>
                            <ul class="mail-main-text">
                                <li>${req.body.translationGeneral["subject"]}: ${req.body.subject}</li>
                                <li>${req.body.translationGeneral["category"]}: ${req.body.category}</li>
                                <li>${req.body.translationGeneral["message"]}: ${req.body.message}</li>
                                <li>${req.body.translationGeneral["date"]}: ${req.body.date}</li>
                            </ul>

                            <br><br>
                            <p class="mail-main-text">${req.body.translationEdge["closing"]},</p>
                    
                            <p class="mail-main-text" style="margin-bottom: 60px;">${req.body.translationEdge["name"]}</p>
                        </div>
                        <div class="mail-footer">
                            <p class="mail-small-text">${req.body.translationEdge["receiver-1"]} ${req.body.email}. ${req.body.translationEdge["receiver-2"]}</p>
                            <p class="mail-small-text">${req.body.translationEdge["generated"]}</p>
                            <p class="mail-small-text"><a href="https://${req.body.env}flo-8.hbo-ict.cloud/#home">${req.body.translationEdge["link-home"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdge["link-support"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdge["link-privacy"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdge["link-copyright"]}</a></p>
                            <p class="mail-small-text">Community Florijn</p>
                        </div>
                    </div>`
                });

                const staffMessage = await transporter.sendMail({
                    "from": {
                        "name": "Community Florijn",
                        "address": "community.florijn@gmail.com"
                    },
                    "to": [
                        {
                            "name": "Community Florijn",
                            "address": "community.florijn@gmail.com"
                        }
                    ],
                    "subject": req.body.translationStaff["title"],
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
                            <p class="mail-main-text">${req.body.email} ${req.body.translationStaff["1"]}</p>
                            <p class="mail-main-text">${req.body.translationStaff["2"]}</p>
                            <ul class="mail-main-text">
                                <li>${req.body.translationGeneralStaff["subject"]}: ${req.body.subject}</li>
                                <li>${req.body.translationGeneralStaff["category"]}: ${req.body.category}</li>
                                <li>${req.body.translationGeneralStaff["message"]}: ${req.body.message}</li>
                                <li>${req.body.translationGeneralStaff["date"]}: ${req.body.date}</li>
                            </ul>
                            <br>
                        </div>
                        <div class="mail-footer">
                            <p class="mail-small-text">${req.body.translationStaff["3"]} ${req.body.translationEdgeStaff["receiver-2"]}</p>
                            <p class="mail-small-text">${req.body.translationEdgeStaff["generated"]}</p>
                            <p class="mail-small-text"><a href="https://${req.body.env}flo-8.hbo-ict.cloud/#home">${req.body.translationEdgeStaff["link-home"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdgeStaff["link-support"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdgeStaff["link-privacy"]}</a> - <a href="https://${req.body.env}flo-8.hbo-ict.cloud/#support">${req.body.translationEdgeStaff["link-copyright"]}</a></p>
                            <p class="mail-small-text">Community Florijn</p>
                        </div>
                    </div>`
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: [userMessage, staffMessage, supportData, userData] });
            } catch (error) {
                console.log(error);
                if (error.responseCode === 553) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({ result: "Invalid Email" });
                } else {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: error });
                };
            };
        });
    };
};

module.exports = SupportRoutes;