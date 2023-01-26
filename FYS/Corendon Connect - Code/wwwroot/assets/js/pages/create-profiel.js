// alert("Im here");
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js"

const imagePrefix = "https://is110-3.fys.cloud/uploads/";

//sesion
const accountID = await FYSCloud.Session.get("userId");
let profileID = 0;
await FYSCloud.API.queryDatabase(
    "SELECT id FROM profiel WHERE account_id = ?", [accountID]
).then(function (data) {
    profileID = data[0].id;
}).catch(function (reason) {
    console.log("Record not yet existent.");
});

function handleForm(event) {
    event.preventDefault();
};

document.addEventListener("DOMContentLoaded", function () {
    //Update the image preview if the file changes
    document.querySelector("#profilePicture").addEventListener("change", async function () {
        try {
            const dataUrl = await FYSCloud.Utils.getDataUrl(this);

            if (dataUrl.isImage) {
                updateProfilePreview(dataUrl.url);
            } else {
                updateProfilePreview();
            };
        } catch (reason) {
            console.log(reason);
        };
    });

    //Upload the file to the FYS.Cloud
    document.querySelector("#profileButton").addEventListener("click", async function () {
        try {
            const dataUrl = await FYSCloud.Utils.getDataUrl("#profilePicture");
            const result = await FYSCloud.API.uploadFile("profile.dat", dataUrl.url, true);

            console.log(result);

            alert("OK!");
        } catch (reason) {
            console.log(reason);
        };
    });

    function updateProfilePreview(url) {
        const previewElement = document.querySelector(".profilepreview");

        if (url) {
            previewElement.src = url;
            previewElement.style.display = "block";
        } else {
            previewElement.style.display = "none";
        };
    };
});

const tabs = document.querySelectorAll("button.step");
const contents = document.querySelectorAll(".tabcontent");
const nextTab = document.querySelectorAll("button.next");
const backTab = document.querySelectorAll("button.terug");

const removeActive = () => {
    tabs.forEach(t => {
        t.classList.remove("active");
    });
    contents.forEach((c) => {
        c.classList.remove("active");
    });
    nextTab.forEach((n) => {
        n.classList.remove("active");
    });
};

tabs.forEach((t, i) => {
    t.addEventListener("click", () => {
        removeActive();
        contents[i].classList.add("active");
        t.classList.add("active");
    });
});

nextTab.forEach((n, i) => {
    n.addEventListener("click", () => {
        removeActive();
        contents[i + 1].classList.add("active");
        n.classList.add("active");
        tabs[i + 1].classList.add("active");
    });
});

backTab.forEach((b, i) => {
    b.addEventListener("click", () => {
        removeActive();
        contents[i].classList.add("active");
        b.classList.add("active");
        tabs[i].classList.add("active");
    });
});


FYSCloud.API.queryDatabase(
    "SELECT land FROM target_land"
).then(function (data) {
    const land_amount = data.length;
    const land_options = document.getElementById("land");
    for (let i = 0; i < land_amount; i++) {
        const land_value = Object.values(data[i])[0];
        const add_option = document.createElement("option");
        add_option.setAttribute('id', `option_${i + 1}`);
        land_options.appendChild(add_option)
        const land_container = document.getElementById(`option_${i + 1}`);
        land_container.innerHTML = land_value;
    };
}).catch(function (reason) {
    console.log(reason);
});

FYSCloud.API.queryDatabase(
    "SELECT soort FROM target_reissoort"
).then(function (data) {
    const soort_amount = data.length;
    const soort_options = document.getElementById("soortreis");
    for (let i = 0; i < soort_amount; i++) {
        const soort_value = Object.values(data[i])[0];
        const add_optionsoort = document.createElement("option");
        add_optionsoort.setAttribute('id', `optionsoort_${i + 1}`);
        soort_options.appendChild(add_optionsoort)
        const soort_container = document.getElementById(`optionsoort_${i + 1}`);
        soort_container.innerHTML = soort_value;
    };
}).catch(function (reason) {
    console.log(reason);
});

document.querySelector("button.klaar").addEventListener("click", async () => {
    let biografie = document.getElementById("form-biografie-inhoud").value;
    let interesses = document.getElementById("form-interesses-inhoud").value;
    let voorkeursland = document.getElementById("land").options[document.getElementById("land").selectedIndex].text;
    if (voorkeursland == "selecteer een land") {
        alert("Kies een voorkeursland")
        return;
    };
    let reissoort = document.getElementById("soortreis").options[document.getElementById("soortreis").selectedIndex].text;
    if (reissoort == "selecteer een reissoort") {
        alert("Kies een reissoort")
        return;
    };

    console.log(biografie, interesses, voorkeursland, reissoort)

    const updatebio = "UPDATE `profiel` SET `biografie` = ?, `interesses` = ? WHERE `id` = ?";
    const updateValues = new Array(biografie, interesses, [profileID])
    await FYSCloud.API.queryDatabase(
        updatebio, updateValues
    ).then(function (data) {
        console.log(data);
    }).catch(function (reason) {
        console.log(reason);
    });

    const updatevoorkeur = "UPDATE `target_interesse` SET `land` = ?, `reissoort` = ? WHERE `id` = ?";
    const updateValuesvoorkeur = new Array(voorkeursland, reissoort, [profileID])

    await FYSCloud.API.queryDatabase(
        updatevoorkeur, updateValuesvoorkeur
    ).then(function (data) {
        console.log(data);
    }).catch(function (reason) {
        console.log(reason);
    });

    const value = document.getElementById('pfp_input_profiel').files[0];
    const file_name = "profiel";
    const type = "Profiel"
    const input_id = "pfp_input_profiel"
    uploadImage(value, type, file_name, input_id);

    const value_omslag = document.getElementById('pfp_input_omslag').files[0];
    const file_name_omslag = "banner";
    const type_omslag = "Banner"
    const input_id_omslag = "pfp_input_omslag"
    uploadImage(value_omslag, type_omslag, file_name_omslag, input_id_omslag);

    FYSCloud.Session.clear();
    setTimeout(() => {
        window.location.href = "inlog.html";
    }, "1000");
});

let input_id_profiel = "pfp_input_profiel"; // input type="file"
let preview_id_profiel = "pfp_preview_profiel"; // img src=data

// Preview

if (document.getElementById(input_id_profiel) == null) {
} else {
    document.getElementById(input_id_profiel).addEventListener('change', () => {
        FYSCloud.Utils
            .getDataUrl(`#${input_id_profiel}`)
            .then(function (data) {
                if (data.isImage) {
                    document.querySelector(`#${preview_id_profiel}`).src = data.url;
                };
            }).catch(function (reason) {
                console.log(reason);
            });
    });
};

let input_id_omslag = "pfp_input_omslag"; // input type="file"
let preview_id_omslag = "pfp_preview_omslag"; // img src=data

// Preview
if (document.getElementById(input_id_omslag) == null) {
} else {
    document.getElementById(input_id_omslag).addEventListener('change', () => {
        FYSCloud.Utils
            .getDataUrl(`#${input_id_omslag}`)
            .then(function (data) {
                if (data.isImage) {
                    document.querySelector(`#${preview_id_omslag}`).src = data.url;
                    document.getElementById("pfp_preview_omslag").classList.add("omslagblock");
                };
            }).catch(function (reason) {
                console.log(reason);
            });
    });
};

// Upload Image
function uploadImage(input, type, file_name, input_id) {
    // Check if there is an image selected
    if (input === undefined) {
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
                    console.log(data)
                    const url = data.split(`${imagePrefix}`).pop();
                    const placeholder = "placeholder"
                    let query = placeholder;
                    FYSCloud.API.queryDatabase(
                        "SELECT id FROM foto WHERE profile_id = ? AND type = ?", [profileID, type]
                    ).then(function (data) {
                        // Check Excisting
                        const currentAmount = data.length;
                        if (type == "Profiel" || type == "Banner") {
                            if (currentAmount > 0) {
                                console.log("Excisting image replaced in the database.");
                            } else if (currentAmount < 1) {
                                query = `INSERT INTO foto (profile_id, type, url) VALUES (${profileID}, '${type}', '${url}');`;
                                console.log("New image added to the database.");
                            };
                        };

                        // Save Image to database
                        if (query == placeholder) {
                        } else {
                            FYSCloud.API.queryDatabase(
                                query
                            ).then(function (data) {
                            }).catch(function (reason) {
                                console.log(reason);
                                alert("Profile ID is not yet existent. Generate a record first and try again.");
                            });
                        };
                    }).catch(function (reason) {
                        console.log(reason);
                        alert("SQL Syntax error: Image Amount. Check the query for errors.");
                    });
                }).catch(function (reason) {
                    console.log(reason);
                });
            }).catch(function (reason) {
                console.log(reason);
            });
    };
};
