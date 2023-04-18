import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";
import { mailAccepteer } from "../controllers/mail-accepteer.js";
const imagePrefix = "https://is110-3.fys.cloud/uploads/";

// AccountID
const accountID = await FYSCloud.Session.get("userId");

// ProfileID
let profileID = 0;
await FYSCloud.API.queryDatabase(
    "SELECT id FROM profiel WHERE account_id = ?", [accountID]
).then(function (data) {
    profileID = data[0].id;
}).catch(function (reason) {
    console.log("Record not yet existent.");
});

queryMatchAccountAll('profiel_id_a', 'profiel_id_b', "uitgaande-matches", "NULL");
queryMatchAccountAll('profiel_id_b', 'profiel_id_a', "inkomende-matches", "NULL");
queryMatchAccountAll('profiel_id_a', 'profiel_id_b', "geaccepteerde-matches", "NOT NULL");
queryMatchAccountAll('profiel_id_b', 'profiel_id_a', "geaccepteerde-matches", "NOT NULL");

function queryMatchAccountAll(typeA, typeB, filter, status) {
    const query = `SELECT id FROM matches WHERE ${typeA} = ${profileID} AND verified_on IS ${status}`;
    FYSCloud.API.queryDatabase(
        query
    ).then(function (data) {
        const matchAmount = data.length;

        if (matchAmount < 1 && filter != "geaccepteerde-matches") {
            createPlaceholderMatch(filter)
        } else if (matchAmount > 0 && filter == "geaccepteerde-matches") {
            if (document.getElementById('placeholder-match') == null) {
            } else {
                document.getElementById('placeholder-match').remove();
            };
        };

        for (let i = 0; i < matchAmount; i++) {
            const currentID = data[i].id;
            // Get Match ProfileID
            const query = `SELECT ${typeB} FROM matches WHERE id = ${currentID}`;
            FYSCloud.API.queryDatabase(
                query
            ).then(function (data) {
                const targetMatchProfileID = Object.values(data[0])[0];
                const imageSrc = `${imagePrefix}${targetMatchProfileID}/Profiel/profiel.png`;
                // Get Match AccountID
                FYSCloud.API.queryDatabase(
                    `SELECT account_id AS accID FROM profiel WHERE id = ?`, [targetMatchProfileID]
                ).then(function (data) {
                    // Get Name
                    const targetAccountID = Object.values(data[0])[0];
                    FYSCloud.API.queryDatabase(
                        `SELECT voornaam, tussenvoegsel, achternaam, geboortedatum, land FROM account WHERE id = ?`, [targetAccountID]
                    ).then(function (data) {
                        if (data[0] == null) {
                        } else {
                            getTargetMatchInfo(data, filter, imageSrc, targetAccountID, targetMatchProfileID)
                        };
                    }).catch(function (reason) {
                        console.log(reason);
                    });
                }).catch(function (reason) {
                    console.log(reason);
                });
            }).catch(function (reason) {
                console.log(reason);
            });
        };
    }).catch(function (reason) {
        console.log(reason);
    });
};

// Get Target Info
function getTargetMatchInfo(data, filter, imageSrc, AccountID, profielID) {
    const voornaam = data[0].voornaam;
    const tussenvoegsel = data[0].tussenvoegsel;
    const achternaam = data[0].achternaam;
    const geboortedatum = new Date(data[0].geboortedatum);
    const land = data[0].land;

    const leeftijd = dateDifference(geboortedatum, currentDate);

    const naam = voornaam + " " + tussenvoegsel + " " + achternaam;
    const info = land + ", " + leeftijd;
    createMatchContainer(filter, naam, info, imageSrc, AccountID, profielID);
};

// Match Container Builder
function createMatchContainer(type, name, info, imageSrc, otherId, profielID) {
    let otherProfielID = otherId;
    const matchContainer = document.getElementById(type);
    const matchContainerItem = document.createElement('div');
    matchContainerItem.className = "hero-tab-content-sub-profile";

    // Image
    const ItemProfileImage = document.createElement('img');
    ItemProfileImage.src = imageSrc;
    ItemProfileImage.className = "sub-content-profile-picture";
    ItemProfileImage.id = "match_profile_picture";
    ItemProfileImage.alt = "Profiel Foto"
    ItemProfileImage.addEventListener("click", async function () {
        console.log(otherProfielID);
        await FYSCloud.Session.remove("otherUserID");
        await FYSCloud.Session.set("otherUserID", otherProfielID);
        window.location.href = "other-profiel.html";
    });
    matchContainerItem.appendChild(ItemProfileImage);

    // List Parent Information
    const ItemList = document.createElement('ul');
    ItemList.className = "sub-content-profile-info-list";

    // List Child Information
    const ItemListName = document.createElement('li');
    const ItemListNamePara = document.createElement('p');
    ItemListNamePara.className = "sub-content-profile-name";
    ItemListNamePara.appendChild(document.createTextNode(name));
    ItemListName.appendChild(ItemListNamePara);
    ItemList.appendChild(ItemListName);

    const ItemListInfo = document.createElement('li');
    const ItemListInfoPara = document.createElement('p');
    ItemListInfoPara.className = "sub-content-profile-info";
    ItemListInfoPara.appendChild(document.createTextNode(info));
    ItemListInfo.appendChild(ItemListInfoPara);
    ItemList.appendChild(ItemListInfo);
    matchContainerItem.appendChild(ItemList);

    // List Parent controls
    const controlsList = document.createElement('ul');
    controlsList.className = "sub-content-profile-controls-list";

    const controlsListReject = document.createElement('li');
    const controlsListRejectButton = document.createElement('button');
    controlsListRejectButton.className = "sub-content-profile-reject";
    controlsListRejectButton.innerHTML = "&#10007";
    controlsListRejectButton.addEventListener('click', () => {
        handleMatch('reject', profielID, ItemProfileImage);
    });
    controlsListReject.appendChild(controlsListRejectButton);

    if (type == "uitgaande-matches") {
        controlsList.appendChild(controlsListReject);

        matchContainerItem.appendChild(controlsList);
    } else if (type == "inkomende-matches") {
        // List Child controls
        const controlsListAccept = document.createElement('li');
        const controlsListAcceptButton = document.createElement('button');
        controlsListAcceptButton.className = "sub-content-profile-accept";
        controlsListAcceptButton.innerHTML = "&#10003";
        controlsListAcceptButton.addEventListener('click', () => {
            handleMatch('accept', profielID, ItemProfileImage);
        });
        controlsListAccept.appendChild(controlsListAcceptButton);
        controlsList.appendChild(controlsListAccept);
        controlsList.appendChild(controlsListReject);
        matchContainerItem.appendChild(controlsList);

        matchContainerItem.appendChild(controlsList);
    } else if (type == "geaccepteerde-matches") {
        controlsList.appendChild(controlsListReject);

        matchContainerItem.appendChild(controlsList);
    };

    // Assemble Container
    matchContainer.appendChild(matchContainerItem);
};

// Accept or Decline
async function handleMatch(type, profielID, child) {
    child.parentElement.remove();

    if (type == "accept") {
        let targetAccountID = 0;
        await FYSCloud.API.queryDatabase(
            "SELECT account_id AS id FROM profiel WHERE id = ?", [profielID]
        ).then(function (data) {
            targetAccountID = data[0].id;
        }).catch(function (reason) {
            console.log(reason);
        });

        // Get Sender Data
        await FYSCloud.API.queryDatabase(
            "SELECT CONCAT(voornaam, ' ', tussenvoegsel, ' ', achternaam) AS naam FROM account WHERE id = ?", [accountID]
        ).then(async function (data) {
            const naam_sender = data[0].naam.replace('  ', ' ');

            // Get Receiver Data
            await FYSCloud.API.queryDatabase(
                "SELECT CONCAT(voornaam, ' ', tussenvoegsel, ' ', achternaam) AS naam, email FROM account WHERE id = ?", [targetAccountID]
            ).then(function (data) {
                const naam_receiver = data[0].naam.replace('  ', ' ');
                const email_receiver = data[0].email;

                mailAccepteer(naam_receiver, email_receiver, naam_sender);
                FYSCloud.API.queryDatabase(
                    "UPDATE matches SET verified_on = current_timestamp() WHERE profiel_id_a = ? AND profiel_id_b = ?", [profielID, profileID]
                ).catch(function (reason) {
                    console.log(reason);
                });
                alert(`Match verzoek van ${naam_receiver} geaccepteert!`);
                setTimeout(() => {
                    location.reload()
                }, "1000");    
            }).catch(function (reason) {
                console.log(reason);
            });
        }).catch(function (reason) {
            console.log(reason);
        });
    } else if (type == "reject") {
        FYSCloud.API.queryDatabase(
            "DELETE FROM matches WHERE profiel_id_b = ? AND profiel_id_a = ?", [profielID, profileID]
        ).then(function (data) {
            setTimeout(() => {
                location.reload()
            }, "1000");
        }).catch(function (reason) {
            console.log(reason);
        });
        FYSCloud.API.queryDatabase(
            "DELETE FROM matches WHERE profiel_id_a = ? AND profiel_id_b = ?", [profielID, profileID]
        ).then(function (data) {
            setTimeout(() => {
                location.reload()
            }, "1000");
        }).catch(function (reason) {
            console.log(reason);
        });
    };
};

// Placeholder Container Builder
function createPlaceholderMatch(type) {
    const matchContainer = document.getElementById(type);
    let emptyMessage = "Bad ID.";
    if (type == "inkomende-matches") {
        emptyMessage = "U heeft nog geen nieuwe matches ontvangen.";
    } else if (type == "uitgaande-matches") {
        emptyMessage = "U heeft nog geen nieuwe matches verzonden.";
    };
    const emptyMessageContainer = document.createElement('p');
    emptyMessageContainer.appendChild(document.createTextNode(emptyMessage));
    matchContainer.appendChild(emptyMessageContainer);
};

// Calculate Date Difference
const currentDate = new Date();
function dateDifference(a, b) {
    const msYear = 1000 * 60 * 60 * 24 * 365;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / msYear);
};
