import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";

window.addEventListener("DOMContentLoaded", initialize);

let account_id = FYSCloud.Session.get("userId");

let queryExtra = "SELECT account.id as 'accid', account.voornaam, account.tussenvoegsel, account.achternaam, account.land as 'accountland', account.geboortedatum, target_interesse.land, reissoort, profiel_id as 'proid' FROM target_interesse INNER JOIN profiel ON target_interesse.profiel_id = profiel.id INNER JOIN account ON account.id = profiel.account_id WHERE NOT account.id = " + account_id;

let kaartLand = await FYSCloud.Session.get("kaartTarget");
if (kaartLand == undefined) {
    kaartLand = "placeholder";
};

async function initialize() {
    let container = document.querySelector(".grid-profielen");
    let accountIDs = new Array();
    let accountNames = new Array();
    let accountCountries = new Array();
    let accountProIDs = new Array();
    let targetCountries = new Array();
    let reisSoorten = new Array();

    if (FYSCloud.Session.get("kaartTarget")) {

        let checker3 = "";

        let radios3 = document.querySelectorAll('input[name="Land"]');
        for (let i = 0; i < radios3.length; i++) {
            if (radios3[i].type === 'radio' && radios3[i].checked) {
                // get value, set checked flag or do whatever you need to
                checker3 = radios3[i].value;
            };
        };

        if (kaartLand == "be") {
            checker3 = "België";
        } else if (kaartLand == "de") {
            checker3 = "Duitsland";
        } else if (kaartLand == "eg") {
            checker3 = "Egypte";
        } else if (kaartLand == "gb") {
            checker3 = "Engeland";
        } else if (kaartLand == "gm") {
            checker3 = "Gambia";
        } else if (kaartLand == "nl") {
            checker3 = "Nederland";
        } else if (kaartLand == "at") {
            checker3 = "Oostenrijk";
        } else if (kaartLand == "pl") {
            checker3 = "Polen";
        } else if (kaartLand == "qa") {
            checker3 = "Qatar";
        } else if (kaartLand == "ro") {
            checker3 = "Roemenië";
        } else if (kaartLand == "ru") {
            checker3 = "Rusland";
        } else if (kaartLand == "es") {
            checker3 = "Spanje";
        } else if (kaartLand == "tr") {
            checker3 = "Turkije";
        } else if (kaartLand == "ch") {
            checker3 = "Zwitserland";
        } else if (kaartLand == "placeholder") {
            checker3 = "Placeholder";
        };

        if (checker3 != "Placeholder") {
            document.getElementsByClassName(checker3)[0].checked = true;
        }

        let currentQuery = queryExtra + " AND target_interesse.land = ?";

        await FYSCloud.API.queryDatabase(
            currentQuery, checker3
        ).then(function (test) {
            console.log(test);
            test.forEach(result => {
                accountIDs.push(result.accid);
                accountNames.push(result.voornaam + " " + result.tussenvoegsel + " " + result.achternaam);
                accountCountries.push(result.accountland);
                accountProIDs.push(result.proid);

                targetCountries.push(result.land);
                reisSoorten.push(result.reissoort)
            });

            FYSCloud.Session.remove("kaartTarget");

        }).catch(function (reason) {
            console.log(reason);
            console.log(currentQuery);
        });

        // console.clear();
        for (let index = 0; index < accountIDs.length; index++) {
            createCards(accountIDs[index], accountProIDs[index], accountNames[index], accountCountries[index], targetCountries[index], reisSoorten[index]);
        };
    } else {
        await FYSCloud.API.queryDatabase(
            queryExtra
        ).then(function (test) {
            console.log(test);
            test.forEach(result => {
                accountIDs.push(result.accid);
                accountNames.push(result.voornaam + " " + result.tussenvoegsel + " " + result.achternaam);
                accountCountries.push(result.accountland);
                accountProIDs.push(result.proid);

                targetCountries.push(result.land);
                reisSoorten.push(result.reissoort)
            });

        }).catch(function (reason) {
            console.log(queryExtra);
            console.log(reason);
        });

        // console.clear();
        for (let index = 0; index < accountIDs.length; index++) {
            createCards(accountIDs[index], accountProIDs[index], accountNames[index], accountCountries[index], targetCountries[index], reisSoorten[index]);
        };

    }

    async function createCards(accid, proid, naam, land, targetCountry, soortReis) {

        const queryFoto = "SELECT url FROM foto WHERE profile_id = ? AND type = ?";
        const queryFotoValues = new Array(proid, "profiel")

        let currentProfileURL;

        await FYSCloud.API.queryDatabase(
            queryFoto, queryFotoValues
        ).then(function (foto) {
            currentProfileURL = foto[0].url;
        }).catch(function (reason) {
            console.log("There was no image result for " + naam + ", site will display default image.")
        });

        let cardBox = document.createElement("div");
        cardBox.className = "grid-item";
        cardBox.addEventListener("click", async function () {
            await FYSCloud.Session.remove("otherUserID");
            await FYSCloud.Session.set("otherUserID", accid);
            window.location.href = "other-profiel.html";
        });
        let image = document.createElement("img");

        if (currentProfileURL === undefined) {
            image.src = "assets/img/icons/profile-picture.png";
        } else {
            image.src = "https://is110-3.fys.cloud/uploads/" + currentProfileURL;
        };

        let h2 = document.createElement("h2");
        let b = document.createElement("b");
        b.textContent = naam;
        let h1 = document.createElement("h1");
        h1.textContent = land;
        let p = document.createElement("p");
        p.textContent = "Ik wil graag een " + soortReis + " in " + targetCountry + " plannen.";

        cardBox.appendChild(image);
        cardBox.appendChild(h2);
        h2.appendChild(b);
        cardBox.appendChild(h1);
        cardBox.appendChild(p);

        container.appendChild(cardBox);
    };

    let filterInputs = document.querySelectorAll('input');
    filterInputs.forEach(filter => {
        filter.addEventListener('change', filterType);
    });

    // let checker3 = "";

    async function filterType() {
        queryExtra = "SELECT account.id as 'accid', account.voornaam, account.tussenvoegsel, account.achternaam, account.land as 'accountland', account.geboortedatum, target_interesse.land, reissoort, profiel_id as 'proid' FROM target_interesse INNER JOIN profiel ON target_interesse.profiel_id = profiel.id INNER JOIN account ON account.id = profiel.account_id WHERE NOT account.id = " + account_id;

        let checker = "";
        let checker2 = "";
        let checker3 = "";

        let radios = document.querySelectorAll('input[name="VakantieType"]');
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].type === 'radio' && radios[i].checked) {
                // get value, set checked flag or do whatever you need to
                checker = radios[i].value;
            };
        };

        let radios2 = document.querySelectorAll('input[name="Leeftijd"]');
        for (let i = 0; i < radios2.length; i++) {
            if (radios2[i].type === 'radio' && radios2[i].checked) {
                // get value, set checked flag or do whatever you need to
                checker2 = radios2[i].value;
            };
        };

        let radios3 = document.querySelectorAll('input[name="Land"]');
        for (let i = 0; i < radios3.length; i++) {
            if (radios3[i].type === 'radio' && radios3[i].checked) {
                // get value, set checked flag or do whatever you need to
                checker3 = radios3[i].value;
            };
        };

        if (checker == "" && checker2 != "" && checker3 == "") {
            let currentQuery = queryExtra + " AND geboortedatum > '?-00-00'";

            let thisyear = new Date().getFullYear();
            let ageSeperator;

            switch (checker2) {
                case "Tot 30":
                    ageSeperator = 30;
                    break;

                case "Tot 40":
                    ageSeperator = 40;
                    break;

                case "Tot 50":
                    ageSeperator = 50;
                    break;

                case "Tot 60":
                    ageSeperator = 60;
                    break;

                case "Tot 70":
                    ageSeperator = 70;
                    break;

                case "Ouder dan 70":
                    ageSeperator = 120;
                    break;

                default:
                    break;
            }

            let filterAges = thisyear - ageSeperator;

            console.log(currentQuery);
            document.querySelector(".grid-profielen").innerHTML = "";
            accountIDs = [];
            accountNames = [];
            accountCountries = [];
            accountProIDs = [];
            targetCountries = [];
            reisSoorten = [];

            await FYSCloud.API.queryDatabase(
                currentQuery, filterAges
            ).then(function (test) {
                console.log(test);
                test.forEach(result => {
                    accountIDs.push(result.accid);
                    accountNames.push(result.voornaam + " " + result.tussenvoegsel + " " + result.achternaam);
                    accountCountries.push(result.accountland);
                    accountProIDs.push(result.proid);

                    targetCountries.push(result.land);
                    reisSoorten.push(result.reissoort)
                });

            }).catch(function (reason) {
                console.log(reason);
            });

            // console.clear();
            for (let index = 0; index < accountIDs.length; index++) {
                createCards(accountIDs[index], accountProIDs[index], accountNames[index], accountCountries[index], targetCountries[index], reisSoorten[index]);
            };
        }

        if (checker == "" && checker2 != "" && checker3 != "") {
            let currentQuery = queryExtra + " AND geboortedatum > '?-00-00' AND target_interesse.land = ?";

            let thisyear = new Date().getFullYear();
            let ageSeperator;

            switch (checker2) {
                case "Tot 30":
                    ageSeperator = 30;
                    break;

                case "Tot 40":
                    ageSeperator = 40;
                    break;

                case "Tot 50":
                    ageSeperator = 50;
                    break;

                case "Tot 60":
                    ageSeperator = 60;
                    break;

                case "Tot 70":
                    ageSeperator = 70;
                    break;

                case "Ouder dan 70":
                    ageSeperator = 120;
                    break;

                default:
                    break;
            }

            let filterAges = thisyear - ageSeperator;

            console.log(currentQuery);
            document.querySelector(".grid-profielen").innerHTML = "";
            accountIDs = [];
            accountNames = [];
            accountCountries = [];
            accountProIDs = [];
            targetCountries = [];
            reisSoorten = [];

            let queryValues = new Array(filterAges, checker3);

            await FYSCloud.API.queryDatabase(
                currentQuery, queryValues
            ).then(function (test) {
                console.log(test);
                test.forEach(result => {
                    accountIDs.push(result.accid);
                    accountNames.push(result.voornaam + " " + result.tussenvoegsel + " " + result.achternaam);
                    accountCountries.push(result.accountland);
                    accountProIDs.push(result.proid);

                    targetCountries.push(result.land);
                    reisSoorten.push(result.reissoort)
                });

            }).catch(function (reason) {
                console.log(reason);
            });

            // console.clear();
            for (let index = 0; index < accountIDs.length; index++) {
                createCards(accountIDs[index], accountProIDs[index], accountNames[index], accountCountries[index], targetCountries[index], reisSoorten[index]);
            };
        }

        if (checker != "" && checker2 == "" && checker3 == "") {
            let currentQuery = queryExtra + " AND `reissoort` = ?";
            console.log(currentQuery);
            document.querySelector(".grid-profielen").innerHTML = "";
            accountIDs = [];
            accountNames = [];
            accountCountries = [];
            accountProIDs = [];
            targetCountries = [];
            reisSoorten = [];

            await FYSCloud.API.queryDatabase(
                currentQuery, checker
            ).then(function (test) {
                console.log(test);
                test.forEach(result => {
                    accountIDs.push(result.accid);
                    accountNames.push(result.voornaam + " " + result.tussenvoegsel + " " + result.achternaam);
                    accountCountries.push(result.accountland);
                    accountProIDs.push(result.proid);

                    targetCountries.push(result.land);
                    reisSoorten.push(result.reissoort)
                });

            }).catch(function (reason) {
                console.log(reason);
            });

            // console.clear();
            for (let index = 0; index < accountIDs.length; index++) {
                createCards(accountIDs[index], accountProIDs[index], accountNames[index], accountCountries[index], targetCountries[index], reisSoorten[index]);
            };
        }

        // if (checker2 != "" && checker3 == "") {
        //     console.log(checker2);
        //     filterAge(checker2, checker, checker3);
        // }

        // if (checker3 != "") {
        //     filterLand(checker3, checker2, checker);
        // }

        if (checker != "" && checker2 != "" && checker3 == "") {
            let currentQuery = queryExtra + " AND `reissoort` = ? AND geboortedatum > '?-00-00'";

            let thisyear = new Date().getFullYear();
            let ageSeperator;

            switch (checker2) {
                case "Tot 30":
                    ageSeperator = 30;
                    break;

                case "Tot 40":
                    ageSeperator = 40;
                    break;

                case "Tot 50":
                    ageSeperator = 50;
                    break;

                case "Tot 60":
                    ageSeperator = 60;
                    break;

                case "Tot 70":
                    ageSeperator = 70;
                    break;

                case "Ouder dan 70":
                    ageSeperator = 120;
                    break;

                default:
                    break;
            }

            let filterAges = thisyear - ageSeperator;

            console.log(currentQuery);
            document.querySelector(".grid-profielen").innerHTML = "";
            accountIDs = [];
            accountNames = [];
            accountCountries = [];
            accountProIDs = [];
            targetCountries = [];
            reisSoorten = [];

            let queryValues = new Array(checker, filterAges);

            await FYSCloud.API.queryDatabase(
                currentQuery, queryValues
            ).then(function (test) {
                console.log(test);
                test.forEach(result => {
                    accountIDs.push(result.accid);
                    accountNames.push(result.voornaam + " " + result.tussenvoegsel + " " + result.achternaam);
                    accountCountries.push(result.accountland);
                    accountProIDs.push(result.proid);

                    targetCountries.push(result.land);
                    reisSoorten.push(result.reissoort)
                });

            }).catch(function (reason) {
                console.log(reason);
            });

            // console.clear();
            for (let index = 0; index < accountIDs.length; index++) {
                createCards(accountIDs[index], accountProIDs[index], accountNames[index], accountCountries[index], targetCountries[index], reisSoorten[index]);
            };
        }

        if (checker == "" && checker2 == "" && checker3 != "") {
            let currentQuery = queryExtra + " AND target_interesse.land = ?";

            console.log(currentQuery);
            document.querySelector(".grid-profielen").innerHTML = "";
            accountIDs = [];
            accountNames = [];
            accountCountries = [];
            accountProIDs = [];
            targetCountries = [];
            reisSoorten = [];

            await FYSCloud.API.queryDatabase(
                currentQuery, checker3
            ).then(function (test) {
                console.log(test);
                test.forEach(result => {
                    accountIDs.push(result.accid);
                    accountNames.push(result.voornaam + " " + result.tussenvoegsel + " " + result.achternaam);
                    accountCountries.push(result.accountland);
                    accountProIDs.push(result.proid);

                    targetCountries.push(result.land);
                    reisSoorten.push(result.reissoort)
                });

            }).catch(function (reason) {
                console.log(reason);
            });

            // console.clear();
            for (let index = 0; index < accountIDs.length; index++) {
                createCards(accountIDs[index], accountProIDs[index], accountNames[index], accountCountries[index], targetCountries[index], reisSoorten[index]);
            };
        }

        if (checker != "" && checker2 != "" && checker3 != "") {
            let currentQuery = queryExtra + " AND `reissoort` = ? AND geboortedatum > '?-00-00' AND target_interesse.land = ?";

            let thisyear = new Date().getFullYear();
            let ageSeperator;

            switch (checker2) {
                case "Tot 30":
                    ageSeperator = 30;
                    break;

                case "Tot 40":
                    ageSeperator = 40;
                    break;

                case "Tot 50":
                    ageSeperator = 50;
                    break;

                case "Tot 60":
                    ageSeperator = 60;
                    break;

                case "Tot 70":
                    ageSeperator = 70;
                    break;

                case "Ouder dan 70":
                    ageSeperator = 120;
                    break;

                default:
                    break;
            }

            let filterAges = thisyear - ageSeperator;

            console.log(currentQuery);
            document.querySelector(".grid-profielen").innerHTML = "";
            accountIDs = [];
            accountNames = [];
            accountCountries = [];
            accountProIDs = [];
            targetCountries = [];
            reisSoorten = [];

            let queryValues = new Array(checker, filterAges, checker3);

            await FYSCloud.API.queryDatabase(
                currentQuery, queryValues
            ).then(function (test) {
                console.log(test);
                test.forEach(result => {
                    accountIDs.push(result.accid);
                    accountNames.push(result.voornaam + " " + result.tussenvoegsel + " " + result.achternaam);
                    accountCountries.push(result.accountland);
                    accountProIDs.push(result.proid);

                    targetCountries.push(result.land);
                    reisSoorten.push(result.reissoort)
                });

            }).catch(function (reason) {
                console.log(reason);
            });

            // console.clear();
            for (let index = 0; index < accountIDs.length; index++) {
                createCards(accountIDs[index], accountProIDs[index], accountNames[index], accountCountries[index], targetCountries[index], reisSoorten[index]);
            };
        }

        if (checker != "" && checker2 == "" && checker3 != "") {
            let currentQuery = queryExtra + " AND `reissoort` = ? AND target_interesse.land = ?";

            console.log(currentQuery);
            document.querySelector(".grid-profielen").innerHTML = "";
            accountIDs = [];
            accountNames = [];
            accountCountries = [];
            accountProIDs = [];
            targetCountries = [];
            reisSoorten = [];

            let queryValues = new Array(checker, checker3);

            await FYSCloud.API.queryDatabase(
                currentQuery, queryValues
            ).then(function (test) {
                console.log(test);
                test.forEach(result => {
                    accountIDs.push(result.accid);
                    accountNames.push(result.voornaam + " " + result.tussenvoegsel + " " + result.achternaam);
                    accountCountries.push(result.accountland);
                    accountProIDs.push(result.proid);

                    targetCountries.push(result.land);
                    reisSoorten.push(result.reissoort)
                });

            }).catch(function (reason) {
                console.log(reason);
            });

            // console.clear();
            for (let index = 0; index < accountIDs.length; index++) {
                createCards(accountIDs[index], accountProIDs[index], accountNames[index], accountCountries[index], targetCountries[index], reisSoorten[index]);
            };
        }
    };
};