import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";
import { mailVerwijder } from "../controllers/mail-verwijder.js";
import { mailBlokkeer } from "../controllers/mail-blokkeer.js";

document.addEventListener("DOMContentLoaded", function () {
    if (FYSCloud.Session.get("isAdmin")) {
        loadAccounts();
    } else {
        window.location.href = "index.html";
    }
});

function loadAccounts() {
    const queryAccounts = "SELECT * FROM account";

    FYSCloud.API.queryDatabase(
        queryAccounts
    ).then(function (test) {
        console.log("Queried the database for all accounts!");
        test.forEach(account => {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            let table = document.querySelector("tbody");

            let editButton = document.createElement("button");
            let deleteButton = document.createElement("button");
            let showButton = document.createElement("button");
            let blockButton = document.createElement("button");

            // Edit
            editButton.className = "editButton";
            editButton.innerText = "Edit";
            editButton.addEventListener("click", async function () {
                console.log(account.id);
                FYSCloud.Session.set("editID", account.id);
                window.location.href = "edit-account.html";
            });

            // Show Klachten
            showButton.className = "showKlachten";
            showButton.innerText = "Show Klachten";
            showButton.addEventListener("click", async function () {
                console.log(account.id);
                FYSCloud.Session.set("showID", account.id);
                window.location.href = "show-klachten.html";
            });

            // Delete
            deleteButton.className = "deleteButton";
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener("click", async function () {
                console.log("Deleting account: " + account.id);
                let isExecuted = confirm("Are you sure to execute this action?");

                console.log(isExecuted); // OK = true, Cancel = false
                if (isExecuted) {
                    FYSCloud.API.queryDatabase(
                        "SELECT CONCAT(voornaam, ' ', tussenvoegsel, ' ', achternaam) AS naam, email FROM account WHERE id = ?", [account.id]
                    ).then(function (data) {
                        const naam = data[0].naam.replace('  ', ' ');
                        mailVerwijder(naam, data[0].email);

                        // Delete after mail is sent
                        FYSCloud.API.queryDatabase(
                            "DELETE FROM account WHERE id = ?;", account.id
                        ).then(function (test) {
                            document.querySelector(".admin-content").innerHTML = "";
                            loadAccounts();
                        }).catch(function (reason) {
                            console.log(reason);
                        });
                    }).catch(function (reason) {
                        console.log(reason);
                    });
                } else {
                    console.log("Delete is cancelled.");
                };
            });

            // Block
            blockButton.className = "blockButton";
            blockButton.innerText = "Block";
            blockButton.addEventListener("click", async function () {
                console.log("Blocking account: " + account.id);
                let isExecuted = confirm("Are you sure to execute this action?");

                console.log(isExecuted); // OK = true, Cancel = false
                if (isExecuted) {
                    FYSCloud.API.queryDatabase(
                        "UPDATE account SET geblokkeerd = 1 WHERE id = ?", [account.id]
                    ).then(function () {
                        FYSCloud.API.queryDatabase(
                            "SELECT CONCAT(voornaam, ' ', tussenvoegsel, ' ', achternaam) AS naam, email FROM account WHERE id = ?", [account.id]
                        ).then(function (data) {
                            const naam = data[0].naam.replace('  ', ' ');
                            mailBlokkeer(naam, data[0].email);
                        }).catch(function (reason) {
                            console.log(reason);
                        });
                    }).catch(function (reason) {
                        console.log(reason);
                    });
                } else {
                    console.log("Block is cancelled.");
                };
            });

            table.append(tr);

            let counter = 0;
            for (let index = 0; index < Object.keys(account).length; index++) {
                counter++;
                let td = tr.insertCell();
                let accountKey = String(Object.keys(account)[index]);

                if (accountKey == "geboortedatum") {
                    let text2 = account[accountKey].replace("00:00:00", " ");
                    text2 = text2.replace(".000Z", " ");
                    text2 = text2.replace("T", " ");
                    td.innerHTML = text2;
                } else {
                    if (accountKey == "creation") {
                        let text = account[accountKey].replace("T", " ");
                        text = text.replace(".000Z", " ");
                        td.innerHTML = text;
                    } else {
                        if (accountKey == "updated") {
                            let text3 = account[accountKey].replace("T", " ");
                            text3 = text3.replace(".000Z", " ");
                            td.innerHTML = text3;
                        } else {
                            td.innerHTML = account[accountKey];
                        };
                    };
                };

                if (accountKey == "verwijder") {
                    if (account[accountKey] != null) {
                        let text2 = account[accountKey].replace("00:00:00", " ");
                        text2 = text2.replace(".000Z", " ");
                        text2 = text2.replace("T", " ");
                        td.innerHTML = text2;
                    };
                };

                let tdChecker = document.querySelectorAll("td");
                if (tdChecker[counter] == "") {
                    tdChecker[counter] = "test";
                };
            };

            // Add all the buttons to the table
            tr.append(editButton);
            tr.append(blockButton);
            tr.append(deleteButton);
            tr.append(showButton);
        });

        // Select all empty td elements on the page
        var tds = document.querySelectorAll('td:empty');

        // Loop through all td elements
        for (var i = 0; i < tds.length; i++) {
            // Get the current td element
            var td = tds[i];

            // Set the inner HTML of the td element to the default string
            td.innerHTML = 'NULL';
        };
    }).catch(function (reason) {
        console.log(reason);
    });
};
