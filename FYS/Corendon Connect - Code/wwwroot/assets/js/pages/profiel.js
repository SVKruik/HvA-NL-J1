import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";
import { countryListReverse } from "../data/country-list-reverse.js";
const imagePrefix = "https://is110-3.fys.cloud/uploads/";
const placeholder = "Placeholder";

// Session
const accountID = await FYSCloud.Session.get("userId");

// ProfileID
let profileID = 0;
await FYSCloud.API.queryDatabase(
    "SELECT id FROM profiel WHERE account_id = ?", [accountID]
).then(function (data) {
    profileID = data[0].id;

    // Load Profile Info
    loadPP(); // profile picture
    loadPB(); // banner

    loadPN(); // name
    loadPA(); // age
    loadPC(); // nationality

    loadPS(); // status

    loadPBI(); // biography
    loadPM(); // matches
    loadPIN(); // interests
    loadPT(); // target interests
    loadPI(); // content image
}).catch(function (reason) {
    console.log("Something went wrong while retrieving the profile page.");
});

// Profile Picture
function loadPP() {
    FYSCloud.API.queryDatabase(
        "SELECT url FROM foto WHERE profile_id = ? AND type = 'Profiel'", [profileID]
    ).then(function (data) {
        const imageContainer = document.getElementById(`profile-image`);
        const imageSrc = `${imagePrefix}${data[0].url}`;
        imageContainer.src = imageSrc;
    }).catch(function (reason) {
        console.log("Something went wrong while retrieving the profile image.");
    });
};

// Profile Banner
function loadPB() {
    FYSCloud.API.queryDatabase(
        "SELECT url FROM foto WHERE profile_id = ? AND type = 'Banner'", [profileID]
    ).then(function (data) {
        const imageContainer = document.getElementById('profile-banner');
        const imageSrc = `${imagePrefix}${data[0].url}`;
        imageContainer.src = imageSrc;
    }).catch(function (reason) {
        console.log("Something went wrong while retrieving the profile banner.");
    });
};

// Profile Name
function loadPN() {
    try {
        const name = document.getElementById('profile-name');
        if (accountID == undefined) {
            name.appendChild(document.createTextNode(placeholder));
        } else {
            // Get data from session storage
            let voornaam = FYSCloud.Session.get("acc-voornaam");
            let tussenvoegsel = FYSCloud.Session.get("acc-tussenvoegsel");
            let achternaam = FYSCloud.Session.get("acc-achternaam");
            if (tussenvoegsel == undefined) {
                tussenvoegsel = "";
            };
            name.appendChild(document.createTextNode(voornaam + " " + tussenvoegsel + " " + achternaam));
        };
    } catch (error) {
        console.log("Something went wrong while retrieving the name.");
    };
};

// Profile Nationality
let countryRaw = placeholder;
function loadPC() {
    FYSCloud.API.queryDatabase(
        "SELECT land FROM account WHERE id = ?", [accountID]
    ).then(function (data) {
        countryRaw = data[0].land;
        const country = countryListReverse[countryRaw].toLowerCase();
        const imageContainer = document.getElementById('hero-country');

        fetch(`https://countryflagsapi.com/png/${country}`)
            .then(async function (response) {
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                imageContainer.alt = country;
                imageContainer.src = imageObjectURL;
            }).catch(function (reason) {
                console.log("CountryFlag API could not catch up.");
            });
    }).catch(function (reason) {
        console.log("Something went wrong while retrieving the nationality.");
    });
};

// Profile Nationality - Tooltip
document.getElementById('hero-country').addEventListener('mouseover', () => {
    const toolTipID = "tooltiptext8-8";
    document.getElementById('tooltip8-8').innerHTML += `<div id="${toolTipID}" class="hero-country-container"><img class="child hero-country-blur"><div class="hero-image-text">${countryRaw}</div></div>`;

    // Blur Background
    const image = document.getElementById('hero-country').src;
    document.getElementsByClassName('hero-country-blur')[0].src = image;
});

// Profile Status
function loadPS() {
    FYSCloud.API.queryDatabase(
        "SELECT email_verificatie AS em, geblokkeerd AS bl, usertype AS us FROM account WHERE id = ?", [accountID]
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
        console.log("Something went wrong while retrieving the status.");
    });
};

// Profile Age
function loadPA() {
    FYSCloud.API.queryDatabase(
        "SELECT geboortedatum FROM account WHERE id = ?", [accountID]
    ).then(function (data) {
        const birthDate = new Date(data[0].geboortedatum);
        const currentDate = new Date();

        const difference = dateDifference(birthDate, currentDate);
        document.getElementsByClassName('hero-age')[0].innerHTML = difference;
    }).catch(function (reason) {
        console.log("Something went wrong while retrieving the birthdate.");
    });
};

// Calculate Date Difference
const currentDate = new Date();
function dateDifference(a, b) {
    try {
        // Convert to milliseconds
        const msYear = 1000 * 60 * 60 * 24 * 365;

        // Formatting
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        // Return in years
        return Math.floor((utc2 - utc1) / msYear);
    } catch (error) {
        console.log("Something went wrong while calculating the age.");
    };
};

// Profile Edit - Picture Preview
document.getElementById('upload-profile-picture').addEventListener('change', () => {
    const input = document.getElementById('upload-profile-picture');
    const value = input.files[0];
    FYSCloud.Utils
        .getDataUrl(`#upload-profile-picture`)
        .then(function (data) {
            if (data.isImage) {
                // Check file size
                const fileSize = value.size / 1024 / 1024; // in MiB
                const maxFileSize = 3;
                if (fileSize > maxFileSize) {
                    alert(`Bestand is groter dan ${maxFileSize} MB. Selecteer een kleinere afbeelding.`);
                    input.value = null
                } else {
                    document.querySelector(`#upload-profile-preview`).src = data.url;
                    document.querySelector(`#upload-profile-preview`).className = "profile-picture-preview";
                };
            };
        }).catch(function (reason) {
            console.log("Something went wrong while showing the preview image.");
        });
});

// Profile Edit - Banner Preview
document.getElementById('upload-profile-banner').addEventListener('change', () => {
    const input = document.getElementById('upload-profile-banner');
    const value = input.files[0];
    FYSCloud.Utils
        .getDataUrl(`#upload-profile-banner`)
        .then(function (data) {
            if (data.isImage) {
                // Check file size
                const fileSize = value.size / 1024 / 1024; // in MiB
                const maxFileSize = 3;
                if (fileSize > maxFileSize) {
                    alert(`Bestand is groter dan ${maxFileSize} MB. Selecteer een kleinere afbeelding.`);
                    input.value = null
                } else {
                    document.querySelector(`#upload-banner-preview`).src = data.url;
                    document.querySelector(`#upload-banner-preview`).className = "profile-banner-preview";
                };
            };
        }).catch(function (reason) {
            console.log("Something went wrong while showing the preview image.");
        });
});

// Profile Edit - Visibility Close
document.getElementById('close-profile-edit').addEventListener('click', () => {
    document.getElementById('profile-edit-container').style.display = "none";
});

// Profile Edit - Visibility Open - Large Screens
document.getElementById('edit-profile-button-a').addEventListener('click', () => {
    document.getElementById('profile-edit-container').style.display = "block";

    // Load Current Data
    loadPBI_C();
    loadPIN_C();
    loadPT_C();
});

// Profile Edit - Visibility Open - Small Screens
document.getElementById('edit-profile-button-b').addEventListener('click', () => {
    document.getElementById('edit-profile-button-a').click();

    // Load Current Data
    loadPBI_C();
    loadPIN_C();
    loadPT_C();
});

// Profile Edit - Tooltip - Large Screens
document.getElementById('edit-profile-button-a').addEventListener('mouseover', () => {
    document.getElementsByClassName('hero-edit-button2-2')[0].childNodes[0].innerHTML = `<span id="tooltiptext2-2">Bewerken</span>`;
    const tooltip = document.getElementById('tooltiptext2-2');
    tooltip.style.backgroundColor = "var(--accent-b)";
});

// Profile Edit - Tooltip - Small Screens
document.getElementById('edit-profile-button-b').addEventListener('mouseover', () => {
    document.getElementsByClassName('hero-edit-button7-7')[0].childNodes[0].innerHTML = `<span id="tooltiptext7-7">Bewerken</span>`;
    const tooltip = document.getElementById('tooltiptext7-7');
    tooltip.style.backgroundColor = "var(--accent-b)";
});

// Profile Edit - Load Current Biography
function loadPBI_C() {
    FYSCloud.API.queryDatabase(
        "SELECT biografie FROM profiel WHERE id = ?;", [profileID]
    ).then(function (data) {
        document.getElementById('edit-biography-textarea').value = data[0].biografie;
    }).catch(function (reason) {
        console.log("Something went wrong while retrieving the biography.");
    });
};

// Profile Edit - Load Current Interests
function loadPIN_C() {
    FYSCloud.API.queryDatabase(
        "SELECT interesses FROM profiel WHERE id = ?;", [profileID]
    ).then(function (data) {
        document.getElementById('edit-interests-textarea').value = data[0].interesses;
    }).catch(function (reason) {
        console.log("Something went wrong while retrieving the interests.");
    });
};

// Profile Edit - Load Current Target Interests
function loadPT_C() {
    FYSCloud.API.queryDatabase(
        "SELECT land, reissoort FROM `target_interesse` WHERE profiel_id = ?;", [profileID]
    ).then(function (data) {
        document.getElementById("land").options[document.getElementById("land").selectedIndex].text = data[0].land;
        document.getElementById("soortreis").options[document.getElementById("soortreis").selectedIndex].text = data[0].reissoort;
    }).catch(function (reason) {
        console.log("Something went wrong while retrieving the target interests.");
    });
};

// Profile Edit - Submit 
document.getElementById('submit-profile-edit').addEventListener('click', async () => {
    // Profile Picture
    try {
        try {
            const value = document.getElementById('upload-profile-picture').files[0];
            if (value == undefined) {
            } else {
                const file_name = "profiel";
                const type = "Profiel"
                const input_id = "upload-profile-picture"
                uploadImage(value, type, file_name, input_id);

                // Load new image without refresh
                FYSCloud.Utils
                    .getDataUrl(`#upload-profile-picture`)
                    .then(function (data) {
                        // Nav
                        document.getElementsByClassName(`profile-picture`)[0].src = data.url;

                        // Main
                        document.getElementById(`profile-image`).src = data.url;
                    }).catch(function (reason) {
                        console.log(reason)
                        console.log("Something went wrong while showing the preview image.");
                    });
            };
        } catch (reason) {
            console.log("Something went wrong while while updating the profile image.");
        };

        // Profile Banner
        try {
            const value = document.getElementById('upload-profile-banner').files[0];
            if (value == undefined) {
            } else {
                const file_name = "banner";
                const type = "Banner"
                const input_id = "upload-profile-banner"
                uploadImage(value, type, file_name, input_id);

                // Load new image without refresh
                FYSCloud.Utils
                    .getDataUrl(`#upload-profile-banner`)
                    .then(function (data) {
                        document.getElementById(`profile-banner`).src = data.url;
                    }).catch(function (reason) {
                        console.log("Something went wrong while showing the preview image.");
                    });
            };
        } catch (reason) {
            console.log("Something went wrong while while updating the banner image.");
        };

        // Biography
        try {
            const value = document.getElementById('edit-biography-textarea').value;
            if (value == "" || value == " " || !value) {
            } else {
                FYSCloud.API.queryDatabase(
                    "UPDATE profiel SET biografie = ? WHERE id = ?;", [value, profileID]
                ).catch(function (reason) {
                    alert("Er ging iets mis! Probeer later nog een keer.");
                    console.log("Something went wrong while while uploading the biography.");
                });
                document.getElementsByClassName('profile-biography')[0].innerHTML = `<p>${value}</p>`;
            };
        } catch (reason) {
            console.log(reason)
            console.log("Something went wrong while while updating the biography.");
        };

        // Interests
        try {
            const value = document.getElementById('edit-interests-textarea').value;
            if (value == "" || value == " " || !value) {
            } else {
                FYSCloud.API.queryDatabase(
                    "UPDATE profiel SET interesses = ? WHERE id = ?;", [value, profileID]
                ).catch(function (reason) {
                    alert("Er ging iets mis! Probeer later nog een keer.");
                    console.log("Something went wrong while while uploading the interests.");
                });
                document.getElementsByClassName('profile-interesses')[0].innerHTML = `<p>${value}</p>`;
            };
        } catch (reason) {
            console.log("Something went wrong while while updating the interests.");
        };

        // Target Interests
        try {
            let voorkeursland = document.getElementById("land").options[document.getElementById("land").selectedIndex].text;
            let reissoort = document.getElementById("soortreis").options[document.getElementById("soortreis").selectedIndex].text;
            if (voorkeursland == "Selecteer een land" || reissoort == "Selecteer een reissoort") {
                alert("Kies een optie.");
                return;
            } else {
                FYSCloud.API.queryDatabase(
                    "UPDATE `target_interesse` SET land = ?, reissoort = ? WHERE profiel_id = ?;", [voorkeursland, reissoort, profileID]
                ).catch(function (reason) {
                    alert("Er ging iets mis! Probeer later nog een keer.");
                    console.log("Something went wrong while while updating the target interests.");
                });
                document.getElementsByClassName('profile-target-interesses')[0].innerHTML = `<p>${voorkeursland}, ${reissoort}</p>`;
            };
        } catch (reason) {
            console.log("Something went wrong while while updating the target interests.");
        };

        document.getElementById('profile-edit-container').style.display = "none";
        alert("Informatie is succesvol opgeslagen.");
    } catch (error) {
        console.log("Something went wrong while while updating the profile.");
    };
});

// Upload Image
function uploadImage(input, type, file_name, input_id) {
    // Check if there is an image selected
    if (input === undefined) {
        alert("Geen afbeelding geselecteerd.");
    } else {
        // Extract image from input
        FYSCloud.Utils
            .getDataUrl(document.querySelector(`#${input_id}`))
            .then(function (data) {
                FYSCloud.API.uploadFile(
                    `${profileID}/${type}/${file_name}.png`,
                    data.url,
                    true
                ).then(function (data) {
                    // Process data
                    const url = data.split(`${imagePrefix}`).pop();
                    let query = placeholder;
                    FYSCloud.API.queryDatabase(
                        "SELECT id FROM foto WHERE profile_id = ? AND type = ?", [profileID, type]
                    ).then(function (data) {
                        // Check Excisting
                        const currentAmount = data.length;
                        if (type == "Profiel" || type == "Banner") {
                            if (currentAmount > 0) {
                            } else if (currentAmount < 1) {
                                query = `INSERT INTO foto (profile_id, type, url) VALUES (${profileID}, '${type}', '${url}');`;
                            };
                        } else if (type == "Content") {
                            query = `INSERT INTO foto (profile_id, type, url) VALUES (${profileID}, '${type}', '${url}');`;
                        };

                        // Save Image to database
                        if (query == placeholder) {
                            return;
                        } else {
                            FYSCloud.API.queryDatabase(
                                query
                            ).catch(function (reason) {
                                alert("Er ging iets mis! Probeer later nog een keer.");
                                console.log("Something went wrong while while processing the image query.");
                            });
                        };
                    }).catch(function (reason) {
                        alert("Er ging iets mis! Probeer later nog een keer.");
                        console.log("Something went wrong while while processing the image data.");
                    });
                }).catch(function (reason) {
                    alert("Er ging iets mis! Probeer later nog een keer.");
                    console.log("Something went wrong while while processing the image data.");
                });
            }).catch(function (reason) {
                alert("Er ging iets mis! Probeer later nog een keer.");
                console.log("Something went wrong while retrieving the image URL.");
            });
    };
};

// Biography
function loadPBI() {
    FYSCloud.API.queryDatabase(
        "SELECT biografie FROM profiel WHERE account_id = ?", [accountID]
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
        console.log("Something went wrong while retrieving the biography.");
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
    const query = `SELECT id FROM matches WHERE ${typeA} = ${profileID} AND verified_on IS NOT NULL`;
    FYSCloud.API.queryDatabase(
        query
    ).then(function (data) {
        const matchAmount = data.length;

        if (matchAmount > 0) {
            document.getElementsByClassName('match-placeholder')[0].style.display = "none"
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
                    `SELECT account_id FROM profiel WHERE id = ?`, [targetMatchProfileID]
                ).then(function (data) {
                    // Get Name
                    const targetAccountID = data[0].account_id;
                    FYSCloud.API.queryDatabase(
                        `SELECT voornaam, tussenvoegsel, achternaam, geboortedatum, land FROM account WHERE id = ?`, [targetAccountID]
                    ).then(function (data) {
                        if (data[0] == null) {
                        } else {
                            getTargetMatchInfo(data, filter, imageSrc, targetAccountID);
                        };
                    }).catch(function (reason) {
                        console.log("Something went wrong while retrieving the match data.");
                    });
                }).catch(function (reason) {
                    console.log("Something went wrong while retrieving the match data.");
                });
            }).catch(function (reason) {
                console.log("Something went wrong while retrieving the matches on the receiver's end.");
            });
        };
    }).catch(function (reason) {
        console.log("Something went wrong while while collecting matches.");
    });
};

// Matches - Query Local
function queryMatchAccountLocal(typeA, typeB, filter) {
    const query = `SELECT id FROM matches WHERE ${typeA} = ${profileID} AND verified_on IS NOT NULL`;
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
            console.log("Something went wrong while retrieving the nationality.");
        });

        const matchAmount = data.length;

        for (let i = 0; i < matchAmount; i++) {
            const currentID = data[i].id;
            const query = `SELECT ${typeB} FROM matches WHERE id = ${currentID}`;
            // Get Match ProfileID
            FYSCloud.API.queryDatabase(
                query
            ).then(function (data) {
                const targetMatchProfileID = Object.values(data[0])[0];
                const imageSrc = `${imagePrefix}${targetMatchProfileID}/Profiel/profiel.png`;
                // Get Match AccountID
                FYSCloud.API.queryDatabase(
                    `SELECT account_id FROM profiel WHERE id = ?`, [targetMatchProfileID]
                ).then(function (data) {
                    // Get Name
                    const targetAccountID = data[0].account_id;
                    FYSCloud.API.queryDatabase(
                        `SELECT voornaam, tussenvoegsel, achternaam, geboortedatum, land FROM account WHERE id = ? AND land = ?`, [targetAccountID, nationality]
                    ).then(function (data) {
                        if (data[0] == null) {
                        } else {
                            document.getElementsByClassName('match-placeholder')[1].style.display = "none"
                            getTargetMatchInfo(data, filter, imageSrc, targetAccountID);
                        };
                    }).catch(function (reason) {
                        console.log("Something went wrong while retrieving the match data.");
                    });
                }).catch(function (reason) {
                    console.log("Something went wrong while retrieving the match data.");
                });
            }).catch(function (reason) {
                console.log("Something went wrong while retrieving the matches on the receiver's end.");
            });
        };
    }).catch(function (reason) {
        console.log("Something went wrong while while collecting matches.");
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
        console.log(otherProfielID);
        await FYSCloud.Session.remove("otherUserID");
        await FYSCloud.Session.set("otherUserID", otherProfielID);
        window.location.href = "other-profiel.html";
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
        "SELECT interesses FROM profiel WHERE account_id = ?", [accountID]
    ).then(function (data) {
        let interesses = data[0].interesses;
        if (interesses == null) {
            interesses = "Deze persoon heeft nog geen interesses opgegeven.";
        };
        const interests_content_container = document.createElement('p');
        interests_content_container.appendChild(document.createTextNode(interesses)); // render on page

        const interests_content_parent = document.querySelector('.profile-interesses');
        interests_content_parent.appendChild(interests_content_container);
    }).catch(function (reason) {
        console.log("Something went wrong while retrieving the interests.");
    });
};

// Target Interests
function loadPT() {
    FYSCloud.API.queryDatabase(
        "SELECT land, reissoort FROM `target_interesse` WHERE profiel_id = ?", [profileID]
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
        console.log("Something went wrong while retrieving the interests.");
    });
};

// Profile Content - Render
function loadPI() {
    FYSCloud.API.queryDatabase(
        "SELECT url FROM foto WHERE profile_id = ? AND type = 'Content'", [profileID]
    ).then(function (data) {
        const imagesAmount = data.length;
        const imagesContainer = document.getElementById('profile-photo-container');
        const placeholderContainer = document.getElementsByClassName('content-placeholder')[0];
        if (imagesAmount == 0) {
            placeholderContainer.style.display = "block";
        } else {
            // Render images
            for (let i = 0; i < imagesAmount; i++) {
                createContentContainer(imagesContainer, i, data, "load");
            };
        };
    }).catch(function (reason) {
        console.log("Something went wrong while retrieving the content images.");
    });
};

// Profile Content - Constructor
function createContentContainer(target, index, data, type) {
    const image = document.createElement('img');
    const imageWrapper = document.createElement('div');
    const removeImage = document.createElement('button');

    if (type == "load") {
        image.src = `${imagePrefix}${data[index].url}`;
    } else if (type == "add") {
        image.src = imagePrefix + data;
    };
    image.className = 'content-image';

    removeImage.id = 'remove-content-image';
    removeImage.innerHTML = '&#9587';

    // Format the classname, remove prefixes and suffixes
    if (data[index].url == undefined) {
        removeImage.className = data.replace(`${profileID}/Content/`, "").replace(".png", "");
    } else {
        removeImage.className = data[index].url.split(`${profileID}/Content/`).pop().replace(".png", "");
    };

    // Confirm delete overlay
    removeImage.addEventListener("click", () => {
        document.getElementById('profile-remove-container').style.display = "block";
        document.getElementById('profile-remove-container').className = removeImage.className;
    });

    imageWrapper.className = 'content-image-container';
    imageWrapper.appendChild(removeImage);
    imageWrapper.appendChild(image);
    target.appendChild(imageWrapper);
};

// Profile Content - Visibility
document.getElementsByClassName('profile-photo-add')[0].addEventListener('click', () => {
    document.getElementById('profile-content-container').style.display = "block"
    document.getElementById('upload-content-preview').className = "profile-content-preview";
    document.getElementById('upload-content-preview').id = "upload-content-preview";
    document.getElementById('upload-content-preview').src = "https://is110-3.fys.cloud/uploads/public/Placeholder.png";
});
document.getElementById('close-profile-content').addEventListener('click', () => {
    document.getElementById('profile-content-container').style.display = "none";
});

// Profile Content - File name
function randomNumber() {
    return Math.floor(Math.random() * (10000000000 - 1000000000 + 1) + 1000000000);
};

// Profile Content - Submit 
document.getElementById('submit-profile-content').addEventListener('click', () => {
    try {
        const value = document.getElementById('upload-profile-content').files[0];
        if (value === undefined) {
            alert("Geen afbeelding geselecteerd.");
        } else {
            const file_name_raw = randomNumber()
            const type = "Content"
            const input_id = "upload-profile-content"
            uploadImage(value, type, file_name_raw, input_id);
            alert("Informatie is succesvol opgeslagen.");
            document.getElementById('profile-content-container').style.display = "none";
            document.getElementsByClassName('content-placeholder')[0].style.display = "none";

            // Clear inputs and preview
            document.getElementById('upload-content-preview').src = "https://is110-3.fys.cloud/uploads/public/Placeholder.png";
            document.getElementById('upload-profile-content').value = "";

            // Buy some time for uploadImage()
            setTimeout(() => {
                const imagesContainer = document.getElementById('profile-photo-container');
                const file_name = `${profileID}/Content/${file_name_raw}.png`;
                createContentContainer(imagesContainer, 0, file_name, "add");
            }, "1000");
        };
    } catch (reason) {
        alert("Er ging iets mis! Probeer later nog een keer.");
        console.log("Something went wrong while while uploading the content image.");
    };
});

// Profile Content - Preview
document.getElementById('upload-profile-content').addEventListener('change', () => {
    const input = document.getElementById('upload-profile-content');
    const value = input.files[0];
    FYSCloud.Utils
        .getDataUrl(`#upload-profile-content`)
        .then(function (data) {
            if (data.isImage) {
                const fileSize = value.size / 1024 / 1024; // in MiB
                const maxFileSize = 3;
                if (fileSize > maxFileSize) {
                    alert(`Bestand is groter dan ${maxFileSize} MB. Selecteer een kleinere afbeelding.`);
                    input.value = null
                } else {
                    document.querySelector(`#upload-content-preview`).src = data.url;
                    document.querySelector(`#upload-content-preview`).className = "profile-content-preview";
                };
            };
        }).catch(function (reason) {
            console.log("Something went wrong while showing the preview image.");
        });
});

// Profile Remove - Visibility
document.getElementById('close-profile-remove').addEventListener('click', () => {
    document.getElementById('profile-remove-container').style.display = "none";
});

// Profile Remove - Confirm Remove Image
document.getElementById('submit-profile-remove').addEventListener('click', () => {
    document.getElementById('profile-remove-container').style.display = "none";
    removeParentImage(document.getElementById('profile-remove-container').className);
    document.getElementById('profile-remove-container').className = "";
});

// Profile Content - Remove Image
async function removeParentImage(removeContainer) {
    try {
        const parent = document.getElementsByClassName(removeContainer)[1].parentElement;
        const imageSrc = parent.childNodes[1].src;

        // Formatting - XX/Content/XXX...XXX
        const imageSrcProces = imageSrc.split(`${imagePrefix}`).pop();

        // SFTP
        await FYSCloud.API.deleteFile(imageSrcProces);

        // MySQL
        await FYSCloud.API.queryDatabase(
            "DELETE FROM foto WHERE url = ?", [imageSrcProces]
        ).then().catch(function (reason) {
            alert("Er ging iets mis! Probeer later nog een keer.");
            console.log("Something went wrong while removing the content image.");
        });

        // Placeholder
        await FYSCloud.API.queryDatabase(
            "SELECT url FROM foto WHERE profile_id = ? AND type = 'Content'", [profileID]
        ).then(function (data) {
            const imagesAmount = data.length;
            if (imagesAmount == 0) {
                const placeholderContainer = document.getElementsByClassName('content-placeholder')[0];
                placeholderContainer.style.display = "block";
            };
        }).catch(function (reason) {
            console.log("Something went wrong while retrieving the content images.");
        });

        parent.remove();
    } catch (reason) {
        console.log(reason)
        alert("Er ging iets mis! Probeer later nog een keer.");
        console.log("Something went wrong while removing the content image.");
    };
};
