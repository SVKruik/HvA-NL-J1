import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";
//test
console.dir("TESTATS")

//tabs voor navigatie

const tabs = document.querySelectorAll("button.tablinks");
const contents = document.querySelectorAll(".tab-content");

const removeActive = () => {
    tabs.forEach(t => {
        t.classList.remove("active");
    });
    contents.forEach((c) => {
        c.classList.remove("active");
    });
};

tabs.forEach((t, i) => {
    t.addEventListener("click", () => {
        removeActive();
        contents[i].classList.add("active");
        t.classList.add("active");
    });
});

// Aangemaakte session inladen (accountID)

const accountID = await FYSCloud.Session.get("userId");
//check om te kijken of de juiste id is in geladen.

console.log(`Logged in with accountID ${accountID}.`);
//importeren van gegevens gebruiker voor de Account tab-content
// email
FYSCloud.API.queryDatabase(
    "SELECT email FROM account WHERE id = ?", [accountID]
).then(function (data) {
    const naam_value = Object.values(data[0])[0];
    console.log(naam_value)
    const email_container = document.getElementById("account-email");
    document.getElementById("email").value = naam_value
    email_container.innerHTML = "Email: " + naam_value;
    console.log(data);
}).catch(function (reason) {
    console.log(reason);
});

let data = {
    geboortedatum: new Date(),
    geslacht: 'm'
};

// geboortedatum importeren
let geboorte = ""
FYSCloud.API.queryDatabase(
    "SELECT geboortedatum  FROM account WHERE id =?", [accountID]
).then(function (data) {
    console.log(data[0])
    let geboortedatum = data[0]['geboortedatum']
    geboorte = String(geboortedatum).slice(0, 10);
    document.getElementById('account-geboortedatum').value = geboorte;
    console.log(geboorte)
    const email_container = document.getElementById("account-geboortedatum");
    email_container.innerHTML = "Geboortedatum: " + geboorte;
    document.getElementById("birthday").value = geboorte
    console.log(data);
}).catch(function (reason) {
    console.log(reason);
});


const land = FYSCloud.API.queryDatabase(
    "SELECT land FROM account WHERE id =?", [accountID]
).then(function (data) {
    const naam_value = Object.values(data[0])[0];
    console.log(naam_value)
    const email_container = document.getElementById("account-land");
    email_container.innerHTML = "Land: " + naam_value;
    document.getElementById("land").value = naam_value
    console.log(data);
}).catch(function (reason) {
    console.log(reason);
});


// Get data from session storage
let voornaam = FYSCloud.Session.get("acc-voornaam");
let tussenvoegsel = FYSCloud.Session.get("acc-tussenvoegsel");
let achternaam = FYSCloud.Session.get("acc-achternaam");
if (tussenvoegsel == undefined) {
    tussenvoegsel = " \t  ";
}


document.getElementById("account-voornaam").innerHTML = "Voornaam: " + voornaam
document.getElementById("account-achternaam").innerHTML = "Achternaam: " + achternaam
document.getElementById("account-tussen").innerHTML = "Tussenvoegsel: " + tussenvoegsel


document.getElementById('submit').addEventListener('click', (event) => {
    event.preventDefault();
    let voornaamText = document.getElementById("voornaam").value;
    const isLeeg = "LEEG"
    const achternaamtext = document.getElementById("achternaam").value;
    const tussenvoegseltext = document.getElementById("tussenvoegsel").value;
    const landtext = document.getElementById("land").value;
    const emailtext = document.getElementById("email").value;
    console.log("TEST")
    const geboortedatum = document.getElementById("birthday").value;
    const timestamp =
    console.log(geboortedatum);
    console.log(voornaamText)
    console.log(timestamp)
// update functie

    FYSCloud.API.queryDatabase(
        "UPDATE account SET updated = CURRENT_TIMESTAMP() WHERE id = ?", [accountID]
    )

    if (voornaamText !== "") {
        FYSCloud.API.queryDatabase(
            "UPDATE account SET voornaam = ? WHERE id = ?", [voornaamText, accountID],
        )
    }
    if (achternaamtext !== "") {
        FYSCloud.API.queryDatabase(
            "UPDATE account SET achternaam = ? WHERE id = ?", [achternaamtext, accountID]
        )
    }
    if (tussenvoegseltext !== "") {
        FYSCloud.API.queryDatabase(
            "UPDATE account SET tussenvoegsel = ? WHERE id = ?", [tussenvoegseltext, accountID]
        )
    }
    if (emailtext !== "") {
        FYSCloud.API.queryDatabase(
            "UPDATE account SET email = ? WHERE id = ?", [emailtext, accountID]
        )
    }
    if (geboortedatum !== "") {
        FYSCloud.API.queryDatabase(
            "UPDATE account SET geboortedatum = ? WHERE id = ?", [geboortedatum, accountID]
        )
    }
    if (landtext !== "") {
        FYSCloud.API.queryDatabase(
            "UPDATE account SET land = ? WHERE id = ?", [landtext, accountID]
        ).then(function (data) {
            console.log(data);

        }).catch(function (reason) {
            debugger
            console.log(reason);
        });
    }
    window.location.reload();
    alert("Uw account is succesvol geupdated!")
})

console.dir("TEst");

// delete button
document.getElementById('delete').addEventListener('click', (event) => {
    event.preventDefault();
    FYSCloud.API.queryDatabase(
        "DELETE FROM account WHERE id =?", [accountID]
    ).then(function (data) {
        document.getElementById('delete').addEventListener("click", function () {
            alert("U account is succesvol verwijdert!");
        });
        console.log(data);
    }).catch(function (reason) {
        console.log(reason);
    });
});

// wachtwoord update
FYSCloud.API.queryDatabase(
    "select password from account  WHERE id = ?", [accountID],
)

document.getElementById('opslaan').addEventListener('click', (event) => {
    const wwOud = document.getElementById("wachtwoord-oud").value;
    const wwNieuw = document.getElementById("wachtwoord-nieuw").value;
    const wwHerhaal = document.getElementById("wachtwoord-herhaal").value;
    const foutMelding = "Uw oude wachtwoord is verkeerd!";
    const goed = "gelukt uw wachtwoord is aangepast!"


    const ww = FYSCloud.API.queryDatabase(
        "select password from account  WHERE id = ?", [accountID],
    ).then(function (data) {
        const ww2 = String(Object.values(data[0]));
        console.log(data);
        console.log(ww2)
        if (ww2 === wwOud) {
            console.log(goed)
            console.log(wwOud)
            if (wwNieuw === wwHerhaal) {
                console.log(goed)
                alert(goed)
                FYSCloud.API.queryDatabase(
                    "UPDATE account SET password = ? WHERE id = ?", [wwHerhaal, accountID]
                ).then(function (data) {
                    console.log(data);
                    window.location.reload();
                }).catch(function (reason) {
                    console.log(reason);
                });
            } else alert("U herhaalde en nieuwe wachtwoord komt niet overeen!")
        } else alert(foutMelding)

    }).catch(function (reason) {
        console.log(reason);
    });
    event.preventDefault();
    console.log(goed)
})

console.log(geboorte)
console.log(email)
// placeholder replace
document.getElementById("voornaam").value = voornaam;
document.getElementById("achternaam").value = achternaam;
document.getElementById("tussenvoegsel").value = tussenvoegsel;



// data[0].geboortedatum.toDateString()
//
// let value = values(data[0])
//
// function values(obj) {
//     values = []
//     for (let key in obj.keys()) {
//
//         values.append(obj[key])
//     };
//     return values
// };
// let eersteIndexVanData = {geboortedatum: new Date()}.geboortedatum
// let datum = eersteIndexVanData.


//const email = document?.getElementById("email")?.text;
//const achternaamtext = document.getElementsByClassName("achternaam").value;
//const wachtwoord = document.getElementsByClassName("wachtwoord").value;
//"UPDATE account SET email = ? , voornaam = ?, achternaam = ?, wachtwoord = ? WHERE id = ?", email,voornaamtext,achternaamtext,wachtwoord, [accountID]

// Ik pak een value die waarschijnlijk leeg is.
// check uitvoeren om te kijken of het leeg is.
// kijken of link-up goed is.


// Je gebruikt hier FluentAPI
// Wat betekent dat?
// Je hebt een object... in dit geval "document"
// Daarop roep jij "getElementById" aan, welke op zijn beurt een object teruggeeft...
// DIT object, roep jij "addEventListener" op aan
// Wat doet dat vraagteken dan?!?!
// Nou, ALS getElementById `null` of `undefined` teruggeeft (oftewijl: er is géén knop gevonden)...
// dan zorgt het vraagteken ervoor dat je GEEN error krijgt, dat je code gewoon doorgaat.
// Het is dus veiligheid, ingebouwd in JavaScript
// Dit ding heet een nullability question mark / operation

//click event submit Button.
