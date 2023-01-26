import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import { countryList } from "../data/country-list.js";
import "../config.live.js";

// function handleForm(event) {
//     event.preventDefault();
// };
let id = FYSCloud.Session.get("showID");
let inputs = document.querySelectorAll("input");
let values = new Array();

function handleForm(event) {
    event.preventDefault();
};

document.addEventListener("DOMContentLoaded", async function () {
    let form = document.querySelector(".klachten");
    await FYSCloud.API.queryDatabase(
        "SELECT rede, datum, verzender_id FROM klacht WHERE account_id = ?;", id
    ).then(function (test) {
        console.log(test);
        test.forEach(account => {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            let table = document.querySelector("tbody");

            table.append(tr);

            let counter = 0;
            for (let index = 0; index < Object.keys(account).length; index++) {
                counter++;
                let td = tr.insertCell();
                let accountKey = String(Object.keys(account)[index]);

                if (accountKey == "datum") {
                    let text2 = account[accountKey].replace("00:00:00", " ");
                    text2 = text2.replace(".000Z", " ");
                    text2 = text2.replace("T", " ");
                    td.innerHTML = text2;
                } else {
                    td.innerHTML = account[accountKey];
                };

            };
        });

    }).catch(function (reason) {
        console.log(reason);
    });

});

