import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";
import { mailWachtwoord } from "../controllers/mail-wachtwoord.js";

document.getElementsByClassName('password-submit')[0].addEventListener('click', () => {
    // Get the email
    const email = document.getElementsByClassName('password-input')[0].value;

    // Check if this email exists in the database
    FYSCloud.API.queryDatabase(
        "SELECT id FROM account WHERE email = ?", [email]
    ).then(function(data) {
        const amount = data.length;

        // It was not found
        if (amount < 1) {
            alert(`Er is geen account gevonden met het emailadres '${email}'. Check voor typfouten en probeer opnieuw.`);

            // Email address found, send the password email
        } else {
            const accountID = data[0].id
            FYSCloud.API.queryDatabase(
                "SELECT CONCAT(voornaam, ' ', tussenvoegsel, ' ', achternaam) AS naam, password FROM account WHERE id = ?", [accountID]
            ).then(function (data) {
                const naam = data[0].naam.replace('  ', ' ');
                mailWachtwoord(data[0].password, naam, email);
            }).catch(function (reason) {
                console.log(reason);
            });

            alert(`Gelukt! Er is een email verzonden naar '${email}'. Check uw inbox.`);
        };
    }).catch(function(reason) {
        console.log(reason);
    });
});
