import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import { countryList } from "../data/country-list.js";
import "../config.live.js";

// function handleForm(event) {
//     event.preventDefault();
// };
let id = FYSCloud.Session.get("editID");
let inputs = document.querySelectorAll("input");
let values = new Array();

function handleForm(event) {
    event.preventDefault();
};

document.addEventListener("DOMContentLoaded", async function () {
    let form = document.querySelector(".edit-form");
    await FYSCloud.API.queryDatabase(
        "SELECT email, password, voornaam, tussenvoegsel, achternaam, land, geboortedatum, geslacht, email_verificatie, geblokkeerd, verwijder, usertype FROM account WHERE id = ?;", id
    ).then(function (test) {
        console.log(test[0]);
        for (const key in test[0]) {

            if (key == "geboortedatum") {
                let date = test[0][key];
                let changedDate = date.substring(0, 10);
                let input = document.createElement("input");
                input.type = "date";
                input.value = changedDate;
                input.className = key;
                console.log(`${key}: ${test[0][key]}`);
                let element = document.createElement("span");
                let br = document.createElement("br");
                element.innerText = key;
                form.appendChild(element);
                form.appendChild(input);
            }

            if (test[0][key] !== null && key !== "geboortedatum" && key !== "land" && key !== "verwijder") {
                let input = document.createElement("input");
                input.value = test[0][key];
                input.className = key;
                console.log(`${key}: ${test[0][key]}`);
                let element = document.createElement("span");
                let br = document.createElement("br");
                element.innerText = key;
                form.appendChild(element);
                form.appendChild(input);
            }

            if (key == "verwijder") {
                console.log(test);
                console.log(test[0[key]]);
                if (test[0][key] != null) {
                    let date = test[0][key];
                    let changedDate = date.substring(0, 10);
                    let input = document.createElement("input");
                    input.type = "date";
                    input.value = changedDate;
                    input.className = key;
                    let element = document.createElement("span");
                    let br = document.createElement("br");
                    element.innerText = "verwijder_datum";
                    form.appendChild(element);
                    form.appendChild(input);
                } else {
                    let input = document.createElement("input");
                    input.type = "date";
                    input.className = key;
                    console.log(`${key}: ${test[0][key]}`);
                    let element = document.createElement("span");
                    let br = document.createElement("br");
                    element.innerText = "verwijder_datum";
                    form.appendChild(element);
                    form.appendChild(input);
                }
            }

            if (key == "land") {
                console.log("land");
                let selector = document.createElement("select");
                selector.className = "land";
                selector.id = "landkeuze"
                // let option = document.createElement("select :disabled selected value");
                // option.textContent = "land";
                console.log(`${key}: ${test[0][key]}`);
                let element = document.createElement("span");
                let br = document.createElement("br");
                element.innerText = key;
                form.appendChild(element);
                form.appendChild(selector);
            }

        }

        landkeuze(countryList);

        function landkeuze() {
            let land_amount = Object.values(countryList).length;
            const land_options = document.getElementById("landkeuze");
            console.log(land_amount)
            const land_values = Object.values(countryList).sort();
            for (let i = 0; i < land_amount; i++) {
                const land_value = Object.values(land_values)[i];
                const add_optionland = document.createElement("option");
                add_optionland.setAttribute('id', `optionland_${i + 1}`);
                land_options.appendChild(add_optionland)
                const land_container = document.getElementById(`optionland_${i + 1}`);
                land_container.innerHTML = land_value;

            }
        };

        let submitButton = document.createElement("input");
        submitButton.value = "Update";
        submitButton.type = "submit";

        submitButton.addEventListener("click", handleForm);
        submitButton.addEventListener("click", async function () {
            updateAccount();
        });
        form.append(submitButton);

        selectQueried(test[0].land);

    }).catch(function (reason) {
        console.log(reason);
    });

});

function selectQueried(country) {
    let options = document.querySelectorAll("option");

    options.forEach(option => {
        if (option.innerText == country) {
            option.selected = "true";
        }
    });
}

function updateAccount() {
    let email = document.querySelector(".email").value;
    let password = document.querySelector(".password").value;
    let voornaam = document.querySelector(".voornaam").value;
    let tussenvoegsel = document.querySelector(".tussenvoegsel").value;
    let achternaam = document.querySelector(".achternaam").value;
    let land = document.querySelector(".land").options[document.getElementById("landkeuze").selectedIndex].text;
    let geboortedatum = document.querySelector(".geboortedatum").value;
    let geslacht = document.querySelector(".geslacht").value;
    let email_verificatie = document.querySelector(".email_verificatie").value;
    let geblokkeerd = document.querySelector(".geblokkeerd").value;
    let verwijder = document.querySelector(".verwijder").value;
    let usertype = document.querySelector(".usertype").value;

    if (verwijder == '') {
        let queryValues = new Array(email, password, voornaam, tussenvoegsel, achternaam, land, geboortedatum, geslacht, email_verificatie, geblokkeerd, usertype, id);
        let query = "UPDATE `account` SET `email` = ?, `password` = ?, `voornaam` = ?, `tussenvoegsel` = ?, `achternaam` = ?, `land` = ?, `geboortedatum` = ?, `geslacht` = ?, `email_verificatie` = ?, `geblokkeerd` = ? , `updated` = CURRENT_TIMESTAMP ,`verwijder` = null, `usertype` = ? WHERE id = ?;"
        FYSCloud.API.queryDatabase(
            query, queryValues
        ).then(function (test) {
            console.log(test);
            FYSCloud.Session.remove("editID");
            window.location.href = "admin.html";
        }).catch(function (reason) {
            console.log(query);
            console.log(reason);
        });
    } else {
        let queryValues = new Array(email, password, voornaam, tussenvoegsel, achternaam, land, geboortedatum, geslacht, email_verificatie, geblokkeerd, verwijder, usertype, id);
        let query = "UPDATE `account` SET `email` = ?, `password` = ?, `voornaam` = ?, `tussenvoegsel` = ?, `achternaam` = ?, `land` = ?, `geboortedatum` = ?, `geslacht` = ?, `email_verificatie` = ?, `geblokkeerd` = ?, `updated` = CURRENT_TIMESTAMP ,`verwijder` = ? , `usertype` = ? WHERE id = ?;"
        FYSCloud.API.queryDatabase(
            query, queryValues
        ).then(function (test) {
            FYSCloud.Session.remove("editID");
            window.location.href = "admin.html";
        }).catch(function (reason) {
            console.log(reason);
        });
    }


}