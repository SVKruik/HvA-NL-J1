import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";
import { countryListReverse } from "../data/country-list-reverse.js";
import { mailMatch } from "../controllers/mail-match.js";
import { mailKlacht } from "../controllers/mail-klacht.js";
const imagePrefix = "https://is110-3.fys.cloud/uploads/";

// Session
const accountID = await FYSCloud.Session.get("userId");
const viewingAccountID = await FYSCloud.Session.get("otherUserID");

// Profile ID
let profileID = 0;
await FYSCloud.API.queryDatabase(
    "SELECT id FROM profiel WHERE account_id = ?", [accountID]
).then(function (data) {
    profileID = data[0].id;
}).catch(function (reason) {
    console.log("Record not yet existent.");
});

// Viewing viewingProfileID
let viewingProfileID = 0;
await FYSCloud.API.queryDatabase(
    "SELECT id FROM profiel WHERE account_id = ?", [viewingAccountID]
).then(function (data) {
    viewingProfileID = data[0].id;

    // Load Profile Info
    loadPP(); // profile picture
    loadPB(); // banner
    loadPN(); // name
    loadPA(); // age
    loadPC(); // nationality
    loadPS(); // status
    loadPM(); // matches
    loadPBI(); // biography
    loadPIN(); // interests
    loadPT(); // target interests
    loadPI(); // content image
    loadMS("a"); // match status
    loadMS("b");
    loadTMS("a"); // tooltip ms
    loadTMS("b");
}).catch(function (reason) {
    console.log("Record not yet existent.");
});

// Profile Picture
function loadPP() {
    FYSCloud.API.queryDatabase(
        "SELECT url FROM foto WHERE profile_id = ? AND type = 'Profiel'", [viewingProfileID]
    ).then(function (data) {
        const imageContainer = document.getElementById('profile-picture');
        const imageSrc = `${imagePrefix}${data[0].url}`;
        imageContainer.src = imageSrc;
    }).catch(function (reason) {
        console.log("No image found for type Profile. User does not have a Profile picture yet.");
    });
};

// Profile Banner
function loadPB() {
    FYSCloud.API.queryDatabase(
        "SELECT url FROM foto WHERE profile_id = ? AND type = 'Banner'", [viewingProfileID]
    ).then(function (data) {
        const imageContainer = document.getElementById('profile-banner');
        const imageSrc = `${imagePrefix}${data[0].url}`;
        imageContainer.src = imageSrc;
    }).catch(function (reason) {
        console.log("No image found for type Banner. User does not have a Banner image yet.");
    });
};

// Profile Name
function loadPN() {
    const name = document.getElementById('profile-name');
    if (accountID == undefined) {
        name.appendChild(document.createTextNode('Placeholder'));
    } else {
        // Account Data
        FYSCloud.API.queryDatabase(
            "SELECT voornaam, tussenvoegsel, achternaam FROM account WHERE id = ?", [viewingAccountID]
        ).then(function (data) {
            const voornaam = data[0].voornaam;
            let tussenvoegsel = data[0].tussenvoegsel;
            const achternaam = data[0].achternaam;
            if (tussenvoegsel == undefined) {
                tussenvoegsel = "";
            };
            name.appendChild(document.createTextNode(voornaam + " " + tussenvoegsel + " " + achternaam));
        }).catch(function (reason) {
            console.log(reason);
        });
    };
};

// Profile Nationality
let countryRaw = "Placeholder";
function loadPC() {
    FYSCloud.API.queryDatabase(
        "SELECT land FROM account WHERE id = ?", [viewingAccountID]
    ).then(function (data) {
        countryRaw = data[0].land;
        const country = countryListReverse[countryRaw].toLowerCase();
        const imageContainer = document.getElementById('hero-country');

        fetch(`https://countryflagsapi.com/png/${country}`)
            .then(async function (response) {
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                imageContainer.alt = country
                imageContainer.src = imageObjectURL;
            }).catch(function (reason) {
                console.log('CountryFlag API could not catch up.');
            });
    }).catch(function (reason) {
        console.log('Something went wrong retrieving the nationality.');
    });
};

// Profile Nationality - Tooltip
document.getElementById('hero-country').addEventListener('mouseover', () => {
    const toolTipID = "tooltiptext7-7";
    document.getElementById('tooltip7-7').innerHTML += `<div id="${toolTipID}" class="hero-country-container"><img class="child hero-country-blur"><div class="hero-image-text">${countryRaw}</div></div>`;

    // Blur Background
    const image = document.getElementById('hero-country').src;
    document.getElementsByClassName('hero-country-blur')[0].src = image;
});

function loadPS() {
    FYSCloud.API.queryDatabase(
        "SELECT email_verificatie AS em, geblokkeerd AS bl, usertype AS us FROM account WHERE id = ?", [viewingAccountID]
    ).then(function (data) {
        const status = document.getElementById('profile-status');
        const status_email = data[0].em;
        const status_block = data[0].bl;
        const status_usertype = data[0].us;

        // Non Verified Email
        if (status_usertype != 1 && status_block != 1 && status_email == 0) {
            status.innerHTML = `<i id="tooltip1-1" class="fa-solid fa-circle-xmark"></i>`;
            status.childNodes[0].style.color = "coral";
            status.childNodes[0].style.borderRadius = "50%";
            status.childNodes[0].style.backgroundColor = "white";
            status.childNodes[0].style.cursor = "pointer";
            status.addEventListener('click', () => {
                window.location.href = "verificatie.html";
            });
            status.childNodes[0].innerHTML = `<span id="tooltiptext1-1">Niet Geverifieerd</span>`;
            status.addEventListener('mouseover', () => {
                const tooltip = document.getElementById('tooltiptext1-1');
                tooltip.style.backgroundColor = "coral";
            });

            // Verified Email
        } else if (status_usertype != 1 && status_block != 1 && status_email == 1) {
            status.innerHTML = `<i id="tooltip1-1" class="fa-solid fa-circle-check"></i>`;
            status.childNodes[0].style.color = "mediumaquamarine";
            status.childNodes[0].style.borderRadius = "50%";
            status.childNodes[0].style.backgroundColor = "white";
            status.childNodes[0].innerHTML = `<span id="tooltiptext1-1">Geverifieerd</span>`;
            status.addEventListener('mouseover', () => {
                const tooltip = document.getElementById('tooltiptext1-1');
                tooltip.style.backgroundColor = "mediumaquamarine";
            });

            // Blocked
        } else if (status_block == 1) {
            status.innerHTML = `<i id="tooltip1-1" class="fa-solid fa-circle-exclamation"></i>`;
            status.childNodes[0].style.color = "indianred";
            status.childNodes[0].style.borderRadius = "50%";
            status.childNodes[0].style.backgroundColor = "white";
            status.childNodes[0].innerHTML = `<span id="tooltiptext1-1">Geblokkeerd</span>`;
            status.addEventListener('mouseover', () => {
                const tooltip = document.getElementById('tooltiptext1-1');
                tooltip.style.backgroundColor = "indianred";
            });

            // Admin
        } else if (status_usertype == 1) {
            status.innerHTML = `<i id="tooltip1-1" class="fa-solid fa-crown"></i>`;
            status.childNodes[0].style.color = "goldenrod";
            status.childNodes[0].innerHTML = `<span id="tooltiptext1-1">Administrator</span>`;
            status.addEventListener('mouseover', () => {
                const tooltip = document.getElementById('tooltiptext1-1');
                tooltip.style.backgroundColor = "goldenrod";
            });
        };
    }).catch(function (reason) {
        console.log(reason)
        console.log('Something went wrong retrieving the status.');
    });
};

// Profile Age
function loadPA() {
    FYSCloud.API.queryDatabase(
        "SELECT geboortedatum FROM account WHERE id = ?", [viewingAccountID]
    ).then(function (data) {
        const birthDate = new Date(data[0].geboortedatum);
        const currentDate = new Date();

        const difference = dateDifference(birthDate, currentDate);
        document.getElementsByClassName('hero-age')[0].innerHTML = difference;
    }).catch(function (reason) {
        console.log('Something went wrong retrieving the birthdate.');
    });
};

// Calculate Date Difference
const currentDate = new Date();
function dateDifference(a, b) {
    const msYear = 1000 * 60 * 60 * 24 * 365;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / msYear);
};

// Profile Report - Toggle Display
document.getElementById('close-profile-report').addEventListener('click', () => {
    document.getElementById('profile-report-container').style.display = "none";
});
document.getElementById('report-profile-button-a').addEventListener('click', () => {
    document.getElementById('profile-report-container').style.display = "block";
});
document.getElementById('report-profile-button-b').addEventListener('click', () => {
    document.getElementById('profile-report-container').style.display = "block";
});

// Profile Report - Tooltip
document.getElementsByClassName('hero-edit-button3-3')[0].addEventListener('mouseover', () => {
    document.getElementsByClassName('hero-edit-button3-3')[0].childNodes[0].innerHTML = `<span id="tooltiptext3-3">Rapporteren</span>`;
    const tooltip = document.getElementById('tooltiptext3-3');
    tooltip.style.backgroundColor = "var(--accent-b)";
});
document.getElementById('report-profile-button-b').addEventListener('mouseover', () => {
    document.getElementById('report-profile-button-b').childNodes[0].innerHTML = `<span id="tooltiptext4-4">Rapporteren</span>`;
    const tooltip = document.getElementById('tooltiptext4-4');
    tooltip.style.backgroundColor = "var(--accent-b)";
});

// Profile Report - Submit 
document.getElementById('submit-profile-report').addEventListener('click', () => {
    try {
        const value = document.getElementById('report-textarea').value;
        if (value == "" || value == " " || !value) {
            alert("Voer iets in, of klik op 'Annuleer'.")
        } else {
            FYSCloud.API.queryDatabase(
                "INSERT INTO klacht (account_id, verzender_id, rede, datum) VALUES (?, ?, ?, current_timestamp());", [viewingAccountID, accountID, value]
            ).catch(function (reason) {
                console.log(reason);
            });

            FYSCloud.API.queryDatabase(
                "SELECT voornaam, tussenvoegsel, achternaam FROM account WHERE id = ?", [viewingAccountID]
            ).then(function (data) {
                const v_voornaam = data[0].voornaam;
                let v_tussenvoegsel = data[0].tussenvoegsel;
                const v_achternaam = data[0].achternaam;
                if (v_tussenvoegsel == undefined) {
                    v_tussenvoegsel = "";
                };
                const v_naam = v_voornaam + " " + v_tussenvoegsel + " " + v_achternaam;
                FYSCloud.API.queryDatabase(
                    "SELECT voornaam, tussenvoegsel, achternaam FROM account WHERE id = ?", [accountID]
                ).then(function (data) {
                    const voornaam = data[0].voornaam;
                    let tussenvoegsel = data[0].tussenvoegsel;
                    const achternaam = data[0].achternaam;
                    if (tussenvoegsel == undefined) {
                        tussenvoegsel = "";
                    };
                    const naam = voornaam + " " + tussenvoegsel + " " + achternaam;

                    const tijd = currentDate;
                    mailKlacht(accountID, naam, viewingAccountID, v_naam, value, tijd);
                }).catch(function (reason) {
                    console.log(reason);
                });
            }).catch(function (reason) {
                console.log(reason);
            });

            document.getElementById('profile-report-container').style.display = "none";
            alert(`Succesvol verstuurd. We gaan kijken naar uw verzoek.`);
            document.getElementById('report-textarea').value = "";
        };
    } catch (err) {
        console.log(err);
    };
});

// Match Status
function loadMS(type) {
    const button = document.getElementById(`match-profile-button-${type}`);

    async function checkVerified(data, a, b) {
        var status;
        const matchID = data[0].id;
        await FYSCloud.API.queryDatabase(
            `SELECT verified_on FROM matches WHERE profiel_id_${a} = ? AND profiel_id_${b} = ? AND id = ?`, [profileID, viewingProfileID, matchID]
        ).then(function (data) {
            const date = data[0].verified_on;
            // Other user hasn't accepted yet.
            if (date === null) {
                status = "Match Pending";

                // Match is complete. Both parties have accepted.
            } else {
                status = "Match Completed"
            };
        }).catch(function (reason) {
            console.log(reason);
        });
        return status;
    };

    // Check if there is a record
    FYSCloud.API.queryDatabase(
        "SELECT id FROM matches WHERE profiel_id_a = ? AND profiel_id_b = ?", [profileID, viewingProfileID]
    ).then(async function (data) {
        const matchAmount = data.length;
        if (matchAmount < 1) {
            button.innerHTML = `<i class="fa-solid fa-user-plus"></i>`;
            FYSCloud.API.queryDatabase(
                "SELECT id FROM matches WHERE profiel_id_b = ? AND profiel_id_a = ?", [profileID, viewingProfileID]
            ).then(async function (data) {
                const matchAmount = data.length;
                if (matchAmount < 1) {
                    button.innerHTML = `<i class="fa-solid fa-user-plus"></i>`;
                } else {
                    const status = await checkVerified(data, "b", "a");
                    if (status == "Match Pending") {
                        button.innerHTML = `<a class="fa-solid fa-clock-l" href="https://is110-3.fys.cloud/match.html"><i class="fa-solid fa-clock"></i></a>`;
                    } else if (status == "Match Completed") {
                        button.style.display = "none";
                    } else {
                        console.log("Status Error.");
                    };
                }
            }).catch(function (reason) {
                console.log(reason);
            });
        } else {
            const status = await checkVerified(data, "a", "b");
            if (status == "Match Pending") {
                button.innerHTML = `<i class="fa-solid fa-clock"></i>`;
            } else if (status == "Match Completed") {
                button.style.display = "none";
            } else {
                console.log("Status Error.");
            };
        };
    }).catch(function (reason) {
        console.log(reason);
    });
};

// Profile Match - Request
document.getElementById('match-profile-button-a').addEventListener('click', () => {
    sendMQ("a")
});

document.getElementById('match-profile-button-b').addEventListener('click', () => {
    sendMQ("b")
});

async function sendMQ(type) {
    const button = document.getElementById(`match-profile-button-${type}`);

    if (button.childNodes[0].className == `fa-solid fa-user-plus`) {
        button.innerHTML = `<i class="fa-solid fa-clock"></i>`;

        // Get Sender Data
        await FYSCloud.API.queryDatabase(
            "SELECT CONCAT(voornaam, ' ', tussenvoegsel, ' ', achternaam) AS naam FROM account WHERE id = ?", [accountID]
        ).then(async function (data) {
            const naam_sender = data[0].naam.replace('  ', ' ');

            // Get Receiver Data
            await FYSCloud.API.queryDatabase(
                "SELECT CONCAT(voornaam, ' ', tussenvoegsel, ' ', achternaam) AS naam, email FROM account WHERE id = ?", [viewingAccountID]
            ).then(function (data) {
                const naam_receiver = data[0].naam.replace('  ', ' ');
                const email_receiver = data[0].email;
    
                mailMatch(naam_receiver, email_receiver, naam_sender);
                alert(`Match verzoek verstuurt naar ${naam_receiver}.`);
                FYSCloud.API.queryDatabase(
                    "INSERT INTO matches (profiel_id_a, profiel_id_b) VALUES (?, ?);", [profileID, viewingProfileID]
                ).catch(function (reason) {
                    console.log(reason);
                });
            }).catch(function (reason) {
                console.log(reason);
            });
        }).catch(function (reason) {
            console.log(reason);
        });
    } else if (button.childNodes[0].className == `fa-solid fa-clock`) {
        alert("U heeft al een match verzoek naar deze persoon verstuurd.");
    };
}

// Profile Match - Tooltip
function loadTMS(type) {
    document.getElementById(`match-profile-button-${type}`).addEventListener('mouseover', () => {
        let tooltipText = "Placeholder";
        let tooltipType = "5-5";
        if (type == "a") {
            tooltipType = "5-5";
        } else if (type == "b") {
            tooltipType = "6-6";
        };

        const buttonID = document.getElementById(`match-profile-button-${type}`);

        if (buttonID.childNodes[0].className == `fa-solid fa-user-plus`) {
            tooltipText = "Match";
        } else if (buttonID.childNodes[0].className == `fa-solid fa-clock` || buttonID.childNodes[0].className == `fa-solid fa-clock-l`) {
            tooltipText = "In Afwachting";
        };

        if (buttonID.childNodes[0].className == `fa-solid fa-clock-l`) {
            buttonID.childNodes[0].childNodes[0].innerHTML = `<span id="tooltiptext${tooltipType}">${tooltipText}</span>`;
        } else {
            buttonID.childNodes[0].innerHTML = `<span id="tooltiptext${tooltipType}">${tooltipText}</span>`;
        }
        const tooltip = document.getElementById(`tooltiptext${tooltipType}`);
        tooltip.style.backgroundColor = "var(--accent-b)";
    });
}

// Biography
function loadPBI() {
    FYSCloud.API.queryDatabase(
        "SELECT biografie FROM profiel WHERE account_id = ?", [viewingAccountID]
    ).then(function (data) {
        let biografie = data[0].biografie
        if (biografie == null) {
            biografie = "Deze persoon heeft nog geen biografie geschreven.";
        };
        const biography_content_container = document.createElement('p');
        biography_content_container.appendChild(document.createTextNode((biografie))); // render on page

        const biography_content_parent = document.querySelector('.profile-biography')
        biography_content_parent.appendChild(biography_content_container);
    }).catch(function (reason) {
        console.log("Record not yet existent.");
    });
};

// Matches - Query Call
function loadPM() {
    // Xmit
    queryMatchAccountAll('profiel_id_a', 'profiel_id_b', "alle");
    queryMatchAccountLocal('profiel_id_a', 'profiel_id_b', "lokaal");

    // Recv
    queryMatchAccountAll('profiel_id_b', 'profiel_id_a', "alle");
    queryMatchAccountLocal('profiel_id_b', 'profiel_id_a', "lokaal");
};

// Matches - Query Global
function queryMatchAccountAll(typeA, typeB, filter) {
    const query = `SELECT id FROM matches WHERE ${typeA} = ${viewingProfileID} AND verified_on IS NOT NULL`;
    FYSCloud.API.queryDatabase(
        query
    ).then(function (data) {
        const matchAmount = data.length;

        if (matchAmount > 0) {
            document.getElementsByClassName('match-placeholder')[0].style.display = "none"
        };

        for (let i = 0; i < matchAmount; i++) {
            const currentID = data[i].id;
            // Get Match viewingProfileID
            const query = `SELECT ${typeB} FROM matches WHERE id = ${currentID}`;
            FYSCloud.API.queryDatabase(
                query
            ).then(function (data) {
                const targetMatchviewingProfileID = Object.values(data[0])[0];
                const imageSrc = `${imagePrefix}${targetMatchviewingProfileID}/Profiel/profiel.png`;
                // Get Match accountID
                FYSCloud.API.queryDatabase(
                    `SELECT account_id FROM profiel WHERE id = ?`, [targetMatchviewingProfileID]
                ).then(function (data) {
                    // Get Name
                    const targetaccountID = data[0].account_id;
                    FYSCloud.API.queryDatabase(
                        `SELECT voornaam, tussenvoegsel, achternaam, geboortedatum, land FROM account WHERE id = ?`, [targetaccountID]
                    ).then(function (data) {
                        if (data[0] == null) {
                        } else {
                            getTargetMatchInfo(data, filter, imageSrc, targetaccountID)
                        };
                    }).catch(function (reason) {
                        console.log('Something went wrong retrieving the match data.');
                    });
                }).catch(function (reason) {
                    console.log('Something went wrong retrieving the match data.');
                });
            }).catch(function (reason) {
                console.log("Something went wrong retrieving the matches on the receiver's end.");
            });
        };
    }).catch(function (reason) {
        console.log('Something went wrong while collecting matches.');
    });
};

// Matches - Query Local
function queryMatchAccountLocal(typeA, typeB, filter) {
    const query = `SELECT id FROM matches WHERE ${typeA} = ${viewingProfileID} AND verified_on IS NOT NULL`;
    FYSCloud.API.queryDatabase(
        query
    ).then(function (data) {
        // Get Nationality
        let nationality = "XYZ";
        FYSCloud.API.queryDatabase(
            `SELECT land FROM account WHERE id = ?;`, [accountID]
        ).then(function (data) {
            nationality = data[0].land;
        }).catch(function (reason) {
            console.log('Something went wrong retrieving the nationality.');
        });

        const matchAmount = data.length;

        if (matchAmount > 0) {
            document.getElementsByClassName('match-placeholder')[1].style.display = "none"
        };

        for (let i = 0; i < matchAmount; i++) {
            const currentID = data[i].id;
            const query = `SELECT ${typeB} FROM matches WHERE id = ${currentID}`;
            // Get Match viewingProfileID
            FYSCloud.API.queryDatabase(
                query
            ).then(function (data) {
                const targetMatchviewingProfileID = Object.values(data[0])[0];
                const imageSrc = `${imagePrefix}${targetMatchviewingProfileID}/Profiel/profiel.png`;
                // Get Match accountID
                FYSCloud.API.queryDatabase(
                    `SELECT account_id FROM profiel WHERE id = ?`, [targetMatchviewingProfileID]
                ).then(function (data) {
                    // Get Name
                    const targetaccountID = data[0].account_id;
                    FYSCloud.API.queryDatabase(
                        `SELECT voornaam, tussenvoegsel, achternaam, geboortedatum, land FROM account WHERE id = ? AND land = ?`, [targetaccountID, nationality]
                    ).then(function (data) {
                        if (data[0] == null) {
                        } else {
                            getTargetMatchInfo(data, filter, imageSrc, targetaccountID)
                        };
                    }).catch(function (reason) {
                        console.log('Something went wrong retrieving the match data.');
                    });
                }).catch(function (reason) {
                    console.log('Something went wrong retrieving the match data.');
                });
            }).catch(function (reason) {
                console.log("Something went wrong retrieving the matches on the receiver's end.");
            });
        };
    }).catch(function (reason) {
        console.log('Something went wrong while collecting matches.');
    });
};

// Matches - Target Info
function getTargetMatchInfo(data, filter, imageSrc, id) {
    const voornaam = data[0].voornaam;
    const tussenvoegsel = data[0].tussenvoegsel;
    const achternaam = data[0].achternaam;
    const geboortedatum = new Date(data[0].geboortedatum);
    const land = data[0].land;

    const leeftijd = dateDifference(geboortedatum, currentDate);

    const naam = voornaam + " " + tussenvoegsel + " " + achternaam;
    const info = land + ", " + leeftijd;
    createMatchContainer(filter, naam, info, imageSrc, id);
};

// Matches - Constructor
function createMatchContainer(type, name, info, imageSrc, otherId) {
    let otherProfielID = otherId;
    const matchContainer = document.getElementById(`tab-${type}-container`);
    const matchContainerItem = document.createElement('div');
    matchContainerItem.className = "hero-tab-content-sub-profile";

    // Image
    const ItemProfileImage = document.createElement('img');
    ItemProfileImage.src = imageSrc;
    ItemProfileImage.className = "sub-content-profile-picture";
    ItemProfileImage.id = "match_profile_picture";
    ItemProfileImage.addEventListener("click", async function () {
        await FYSCloud.Session.remove("otherUserID");
        await FYSCloud.Session.set("otherUserID", otherProfielID);
        if (otherId == accountID) {
            window.location.href = "profiel.html";
        } else {
            window.location.href = "other-profiel.html";
        };
    });

    // UL Parent
    const ItemList = document.createElement('ul');
    ItemList.className = "sub-content-profile-info-list";

    // LI Child
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

    // Assemble Container
    matchContainerItem.appendChild(ItemProfileImage);
    matchContainerItem.appendChild(ItemList);
    matchContainer.appendChild(matchContainerItem);
};

// Interests
function loadPIN() {
    FYSCloud.API.queryDatabase(
        "SELECT interesses FROM profiel WHERE account_id = ?", [viewingAccountID]
    ).then(function (data) {
        let interesses = data[0].interesses;
        if (interesses == null) {
            interesses = "Deze persoon heeft nog geen interesses geschreven.";
        };
        const interests_content_container = document.createElement('p');
        interests_content_container.appendChild(document.createTextNode(interesses)); // render on page

        const interests_content_parent = document.querySelector('.profile-interesses');
        interests_content_parent.appendChild(interests_content_container);
    }).catch(function (reason) {
        console.log("Record not yet existent.")
    });
};

// Target Interests
function loadPT() {
    FYSCloud.API.queryDatabase(
        "SELECT land, reissoort FROM `target_interesse` WHERE profiel_id = ?", [viewingProfileID]
    ).then(function (data) {
        const land = data[0].land;
        const reissoort = data[0].reissoort;
        if (land == null && reissoort) {
            interesses = "Deze persoon heeft nog geen interesses opgegeven.";
        };
        const interests_content_container = document.createElement('p');
        interests_content_container.appendChild(document.createTextNode(`${land}, ${reissoort}`)); // render on page

        const interests_content_parent = document.querySelector('.profile-target-interesses');
        interests_content_parent.appendChild(interests_content_container);
    }).catch(function (reason) {
        console.log('Something went wrong retrieving the interests.');
    });
};

// Profile Content - Render
function loadPI() {
    FYSCloud.API.queryDatabase(
        "SELECT url FROM foto WHERE profile_id = ? AND type = 'Content'", [viewingProfileID]
    ).then(function (data) {
        const imagesAmount = data.length;
        const imagesContainer = document.getElementById('profile-photo-container');
        if (imagesAmount == 0) {
            const placeholder = document.createElement('p');
            placeholder.appendChild(document.createTextNode("Deze persoon heeft nog geen foto's geplaatst."));
            imagesContainer.appendChild(placeholder);
        } else {
            // Render images
            for (let i = 0; i < imagesAmount; i++) {
                const image = document.createElement('img');
                const imageWrapper = document.createElement('div');
                const removeImage = document.createElement('button');

                image.src = `${imagePrefix}${data[i].url}`;
                image.className = 'content-image';

                removeImage.id = 'remove-content-image';
                removeImage.innerHTML = '&#9587';
                removeImage.addEventListener("click", () => removeParentImage(image, data[i].url));
                imageWrapper.className = 'content-image-container';

                imageWrapper.appendChild(removeImage);
                imageWrapper.appendChild(image);
                imagesContainer.appendChild(imageWrapper);
            };
        };
    }).catch(function (reason) {
        console.log('Something went wrong retrieving the content images.');
    });
};
