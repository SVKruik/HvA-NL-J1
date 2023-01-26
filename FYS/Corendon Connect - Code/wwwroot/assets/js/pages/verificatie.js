import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";
import { mailCompleet } from "../controllers/mail-compleet.js";
import { mailVerificatie } from "../controllers/mail-verificatie.js";

const accountID = await FYSCloud.Session.get("userId");

// Get all the inputs
const input = [];
input[0] = document.getElementById("input-1");
input[1] = document.getElementById("input-2");
input[2] = document.getElementById("input-3");
input[3] = document.getElementById("input-4");
input[4] = document.getElementById("input-5");
input[5] = document.getElementById("input-6");

document.addEventListener('DOMContentLoaded', () => {
    // Enter - submit the numbers
    const lastInput = document.getElementById("input-6");
    lastInput.addEventListener("keypress", function (evt) {
        if (evt.key === "Enter") {
            checkForm();
        };
    });

    // Backspace - go back one input
    for (let i = 1; i < 6; i++) {
        input[i].addEventListener("keydown", function (evt) {
            if (evt.keyCode == 8) {
                if (input[i - 1].value != "") {
                    input[i - 1].value = "";
                };
                setTimeout(() => {
                    input[i - 1].focus();
                }, "10")
            };
        });
    };

    // Resend Verification Code
    document.getElementsByClassName('verify-resend')[0].addEventListener('click', () => {
        FYSCloud.API.queryDatabase(
            "SELECT CONCAT(voornaam, ' ', tussenvoegsel, ' ', achternaam) AS naam, email, `verificatie`.verificatienummer AS code FROM account INNER JOIN verificatie ON account.id = verificatie.account_id WHERE account.id = ?", [accountID]
        ).then(function (data) {
            const naam = data[0].naam.replace('  ', ' ');
            mailVerificatie(data[0].code, naam, data[0].email);
        }).catch(function (reason) {
            alert("Er ging iets fout tijdens het opnieuw verzenden van de verificatie mail. Probeer het later nog eens.")
        });
    });

    // Submit Verification Code
    document.getElementsByClassName('verify-submit')[0].addEventListener('click', () => {
        checkForm();
    });
});

function clearInputs() {
    for (let i = 0; i < 6; i++) {
        input[i].value = "";
    };
    input[0].focus();
};

// Check if input code equals database code
function checkForm() {
    // Concat to create 6 digit code
    const inputCode = `${input[0].value}${input[1].value}${input[2].value}${input[3].value}${input[4].value}${input[5].value}`;

    // Get correct code from database
    FYSCloud.API.queryDatabase(
        "SELECT verificatienummer AS code FROM verificatie WHERE account_id = ?", [accountID]
    ).then(function (data) {
        if (data.length != 1) {
            alert("Er ging iets fout tijdens het verifiëren. Probeer het later nog eens.");
            clearInputs();
        } else {
            const verifyCode = data[0].code;

            // Update if it is correct
            if (inputCode == verifyCode) {
                FYSCloud.API.queryDatabase(
                    "UPDATE account SET `email_verificatie` = 1 WHERE id = ?", [accountID]
                ).catch(function (reason) {
                    console.log(reason);
                });

                FYSCloud.API.queryDatabase(
                    "SELECT CONCAT(voornaam, ' ', tussenvoegsel, ' ', achternaam) AS naam, email FROM account WHERE account.id = ?", [accountID]
                ).then(function (data) {
                    const naam = data[0].naam.replace('  ', ' ');
                    mailCompleet(naam, data[0].email);
                }).catch(function (reason) {
                    console.log(reason);
                });

                // Link to profile page
                setTimeout(() => {
                    alert("Account verificatie is gelukt! U kunt nu uw profiel maken. Klik op de knop om door te gaan.");
                    window.location.href = "create-profiel.html";
                }, "500");

                // Input wrong, clear inputs and restart
            } else if (inputCode != verifyCode) {
                alert("De ingevoerde code is onjuist! Probeer opnieuw.");
                clearInputs();
            };
        };
    }).catch(function (reason) {
        console.log(reason);
    });
};

