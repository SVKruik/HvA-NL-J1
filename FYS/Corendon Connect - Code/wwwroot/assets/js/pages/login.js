import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";
import { LoginCheck, emptyStyler } from "../controllers/field-validation.js";

function handleForm(event) {
    event.preventDefault();
};

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("input").forEach(item => {
        item.addEventListener("blur", function () {
            let element = this;
            emptyStyler(element);
        });
    });

    document.getElementsByClassName('text-wwvergeten')[0].addEventListener('click', () => {
        window.location.href = "wachtwoord.html";
    });

    let form = document.querySelector(".submit");
    form.addEventListener('click', handleForm);
    form.addEventListener('click', async () => {
        // Get data from form
        let email = document.querySelector(".email").value;
        let wachtwoord = document.querySelector(".wachtwoord").value;

        const queryLogin = "SELECT id, voornaam, achternaam, tussenvoegsel, password, geblokkeerd, usertype FROM account WHERE email = ?";

        await FYSCloud.API.queryDatabase(
            queryLogin, email
        ).then(function (test) {
            if (LoginCheck(email, wachtwoord)) {
                if (test[0].password == wachtwoord) {
                    if (test[0].geblokkeerd == 1) {
                        alert("U kunt helaas niet inloggen, uw account is geblokkeerd!")
                    } else {
                        if (test[0].usertype == 0) {
                            FYSCloud.Session.set("loginstatus", 1);
                            FYSCloud.Session.set("acc-voornaam", test[0].voornaam);
                            FYSCloud.Session.set("acc-tussenvoegsel", test[0].tussenvoegsel);
                            FYSCloud.Session.set("acc-achternaam", test[0].achternaam);
                            FYSCloud.Session.set("userId", test[0].id);

                            const queryProfileID = "SELECT id FROM profiel WHERE account_id = ?";

                            FYSCloud.API.queryDatabase(
                                queryProfileID, test[0].id
                            ).then(function (test) {
                                FYSCloud.Session.set("profileID", test[0].id);
                                window.location.href = "index.html";
                            }).catch(function (reason) {
                                console.log(reason);
                            });
                        } else {
                            FYSCloud.Session.set("loginstatus", 1);
                            FYSCloud.Session.set("acc-voornaam", test[0].voornaam);
                            FYSCloud.Session.set("acc-tussenvoegsel", test[0].tussenvoegsel);
                            FYSCloud.Session.set("acc-achternaam", test[0].achternaam);
                            FYSCloud.Session.set("userId", test[0].id);
                            FYSCloud.Session.set("isAdmin", test[0].usertype);

                            const queryProfileID = "SELECT id FROM profiel WHERE account_id = ?";

                            FYSCloud.API.queryDatabase(
                                queryProfileID, test[0].id
                            ).then(function (test) {
                                FYSCloud.Session.set("profileID", test[0].id);
                                window.location.href = "index.html";
                            }).catch(function (reason) {
                                console.log(reason);
                            });
                        };
                    };
                };
            } else {
                document.querySelectorAll("input").forEach(item => {
                    if (item.value.length < 1) {
                        item.style.border = "solid 1px red";
                    };
                    if (item.value.length >= 1) {
                        item.style.border = "solid 1px black";
                    };
                });
            };
        }).catch(function (reason) {
            if (reason) {
                alert("Uw email of wachtwoord was incorrect.")
            };
        });
    });


});