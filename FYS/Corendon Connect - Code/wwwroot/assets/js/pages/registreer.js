import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";
import { RegistrationCheck, emptyStyler } from "../controllers/field-validation.js";
import { countryList } from "../data/country-list.js";
import { mailVerificatie } from "../controllers/mail-verificatie.js";


// Function to stop default page behavior.
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

    let form = document.querySelector(".registreer");
    form.addEventListener('submit', handleForm);
    form.addEventListener('submit', async () => {

        // Get data from form
        let voornaam = document.querySelector(".voornaam").value.charAt(0).toUpperCase() + document.querySelector(".voornaam").value.slice(1).toLowerCase();
        let tussenvoegsel = document.querySelector(".tussenvoegsel").value;
        if (tussenvoegsel == undefined || tussenvoegsel == null) {
            tussenvoegsel = "";
        } else {
            tussenvoegsel = tussenvoegsel.toLowerCase();
        };
        let achternaam = document.querySelector(".achternaam").value.charAt(0).toUpperCase() + document.querySelector(".achternaam").value.slice(1).toLowerCase();
        let land = document.querySelector(".land").options[document.getElementById("landkeuze").selectedIndex].text;
        if (land == "land") {
            alert("Kies uw land")
            return;
        };
        let geboortedatum = document.querySelector(".geboortedatum").value;
        let email = document.querySelector(".email").value;
        let wachtwoord = document.querySelector(".wachtwoord").value;
        let wachtwoordherhaling = document.querySelector(".wachtwoordherhaling").value;
        let geslacht = document.querySelector('input[name="geslacht"]:checked').value;

        FYSCloud.API.queryDatabase(
            "SELECT id FROM account WHERE email = ?", [email]
        ).then(async function (data) {
            const amount = data.length;
            if (amount < 1) {
                if (RegistrationCheck(voornaam, achternaam, land, geboortedatum, email, wachtwoord, wachtwoordherhaling, geslacht)) {
                    function create2fa() {
                        let digitnumber = Math.floor(100000 + Math.random() * 900000);
                        return digitnumber;
                    };

                    const insertRegistration = "INSERT INTO `account`(`email`, `password`, `voornaam`, `tussenvoegsel`, `achternaam`, `land`, `geboortedatum`, `geslacht`, `creation`, `updated`, `email_verificatie`, `geblokkeerd`, `verwijder`) VALUES (?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,0,0,NULL)";
                    const insertValues = new Array(email, wachtwoord, voornaam, tussenvoegsel, achternaam, land, geboortedatum, geslacht, 'CURRENT_TIMESTAMP', 'CURRENT_TIMESTAMP', 0, 0, 'NULL')

                    await FYSCloud.API.queryDatabase(
                        insertRegistration, insertValues
                    ).catch(function (reason) {
                        console.log(reason);
                    });

                    const queryLastAccID = "SELECT id FROM account WHERE email = ?";
                    const queryLastAccValues = email;

                    let last_inserted = undefined;

                    await FYSCloud.API.queryDatabase(
                        queryLastAccID, queryLastAccValues
                    ).then(function (test) {
                        last_inserted = test[0].id;
                    }).catch(function (reason) {
                        console.log(reason);
                    });

                    const insertProfile = "INSERT INTO `profiel`(`account_id`) VALUES (?)";

                    await FYSCloud.API.queryDatabase(
                        insertProfile, last_inserted
                    ).catch(function (reason) {
                        console.log(reason);
                    });

                    const queryLastProID = "SELECT id FROM profiel WHERE account_id = ?";
                    const queryLastProValues = last_inserted;

                    let last_proID = undefined;

                    await FYSCloud.API.queryDatabase(
                        queryLastProID, queryLastProValues
                    ).then(function (test) {
                        last_proID = test[0].id;
                    }).catch(function (reason) {
                        console.log(reason);
                    });

                    const insertTargetInteresse = "INSERT INTO `target_interesse`(`profiel_id`, `land`, `reissoort`) VALUES (?,?,?)";
                    let targetLand = "PlaceholderL"
                    let targetReissoort = "PlaceholderR"
                    const insertData = new Array(last_proID, targetLand, targetReissoort);

                    await FYSCloud.API.queryDatabase(
                        insertTargetInteresse, insertData
                    ).catch(function (reason) {
                        console.log(reason);
                    });

                    const verifyCode = create2fa()

                    const insertVerify = "INSERT INTO `verificatie`(`verificatienummer`, `account_id`) VALUES ('?','?')";
                    const insertValuesVerification = new Array(verifyCode, last_inserted);

                    await FYSCloud.API.queryDatabase(
                        insertVerify, insertValuesVerification
                    ).catch(function (reason) {
                        console.log(reason);
                    });

                    console.log(last_inserted)
                    await FYSCloud.Session.set("userId", last_inserted);

                    if (tussenvoegsel == undefined || tussenvoegsel == null) {
                        tussenvoegsel = "";
                    };
                    const naam = voornaam + " " + tussenvoegsel + " " + achternaam;
                    mailVerificatie(verifyCode, naam, email);

                    setTimeout(() => {
                        window.location.href = "verificatie.html";
                    }, "1000");
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
            } else {
                alert("Dit account bestaat al!");
            };
        }).catch(function (reason) {
            console.log(reason);
        });
    });
});

landkeuze(countryList);

function landkeuze() {
    let land_amount = Object.values(countryList).length;
    const land_options = document.getElementById("landkeuze");
    const land_values = Object.values(countryList).sort();
    for (let i = 0; i < land_amount; i++) {
        const land_value = Object.values(land_values)[i];
        const add_optionland = document.createElement("option");
        add_optionland.setAttribute('id', `optionland_${i + 1}`);
        land_options.appendChild(add_optionland);
        const land_container = document.getElementById(`optionland_${i + 1}`);
        land_container.innerHTML = land_value;
    };
};
