import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";

// Variables
let type = "Profiel"; // sub folder - Profiel, Banner or Content
let file_name = "profiel"; // file name

let input_id = "pfp_input"; // input type="file"
let confirm_id = "pfp_confirm"; // button
let preview_id = "pfp_preview"; // img src=data
let overwrite = true; // overwrite existing files

let url_pop = "https://is110-3.fys.cloud/uploads/"; // root folder

// Get Dropdown Value
const dropdown = document.getElementById("type-dropdown");
let dropdown_value = dropdown.options[dropdown.selectedIndex].text;
console.log(`Image Type: ${dropdown_value}\n\n`);

document.getElementById("type-dropdown").addEventListener('change', () => {
    dropdown_value = dropdown.options[dropdown.selectedIndex].text;
    console.log(`\nImage Type: ${dropdown_value}`);
    if (dropdown_value == "Profiel") {
        type = "Profiel";
        file_name = "profiel";
        overwrite = true;
    } else if (dropdown_value == "Banner") {
        type = "Banner";
        file_name = "banner";
        overwrite = true;
    } else if (dropdown_value == "Content") {
        type = "Content";
        file_name = randomNumber();
        overwrite = false;
    };
});

// Get Profile ID
let profile_id = document.getElementById("profile_id").valueAsNumber;
console.log(`Profile ID: ${profile_id}`);
document.getElementById("profile_id").addEventListener('change', () => {
    profile_id = document.getElementById("profile_id").valueAsNumber;
    console.log(`Profile ID: ${profile_id}`);
});

// Get Random Number
function randomNumber() {
    return Math.floor(Math.random() * (10000000000 - 1000000000 + 1) + 1000000000);
};

// Get Type Content Images Count
async function getImagesAmount() {
    let imagesAmount = 0;
    const queryPhotos = `SELECT url FROM foto WHERE profile_id = '${profile_id}' AND type = 'Content'`;
    await FYSCloud.API.queryDatabase(
        queryPhotos
    ).then(function (data) {
        imagesAmount = Object.keys(data).length;
    }).catch(function (reason) {
        console.log(reason);
    });
    return imagesAmount;
};

// Confirm
document.getElementById(confirm_id).addEventListener('click', () => {
    try {
        const value = document.getElementById(input_id).files[0];
        if (type == "Profiel" || type == "Banner") {
            file_name = file_name;
            uploadImage(value, type, file_name);
        } else if (type == "Content") {
            file_name = randomNumber();
            getImagesAmount().then(ImagesAmountData => {
                uploadImage(value, type, file_name, ImagesAmountData);
            });
        };
    } catch (err) {
        console.log(err);
    };
});

// Preview
document.getElementById(input_id).addEventListener('change', () => {
    FYSCloud.Utils
        .getDataUrl(`#${input_id}`)
        .then(function (data) {
            if (data.isImage) {
                document.querySelector(`#${preview_id}`).src = data.url;
            };
        }).catch(function (reason) {
            console.log(reason);
        });
});

// Upload
function uploadImage(input, type, file_name, imagesAmount) {
    // Check if there is an image selected
    if (input === undefined) {
        alert("No image selected. Please select an image before clicking 'Upload'.");
    } else {
        // Check file size
        const fileSize = input.size / 1024 / 1024; // in MiB
        const maxFileSize = 3;
        if (fileSize > maxFileSize) {
            alert(`File size is larger than ${maxFileSize} MB. Please select a smaller image.`);
        } else {
            // Extract image from input
            FYSCloud.Utils
                .getDataUrl(document.querySelector(`#${input_id}`))
                .then(function (data) {
                    FYSCloud.API.uploadFile(
                        `${profile_id}/${type}/${file_name}.png`,
                        data.url,
                        overwrite
                    ).then(function (data) {
                        const url = data.split(`${url_pop}`).pop();
                        const placeholder = "placeholder"
                        let query = placeholder;
                        FYSCloud.API.queryDatabase(
                            "SELECT `type` FROM `foto` WHERE `profile_id` = ? AND `type` = ?", [profile_id, type]
                        ).then(function (data) {
                            // Check Excisting (type Profiel and Banner)
                            const currentAmount = data.length;
                            if (type == "Profiel" || type == "Banner") {
                                if (currentAmount >= 1) {
                                    console.log("Excisting image replaced in the database.");
                                } else if (currentAmount <= 1) {
                                    query = `INSERT INTO foto (profile_id, type, url) VALUES (${profile_id}, '${type}', '${url}');`;
                                    console.log("New image added to the database.");
                                };
                            } else if (type == "Content") {
                                query = `INSERT INTO foto (profile_id, type, url) VALUES (${profile_id}, '${type}', '${url}');`;
                                console.log("New image added to the database.");
                            };

                            // Save Image to database
                            if (query == placeholder) {
                                alert(`Image succesfully saved. File name: ${file_name}. Type: ${type}.`);
                                if (type == "Content") {
                                    const imgAmount = imagesAmount + 1
                                    console.log(`Amount type "Content" images: ${imgAmount}\n\n`);
                                };
                            } else {
                                FYSCloud.API.queryDatabase(
                                    query
                                ).then(function (data) {
                                    alert(`Image succesfully saved. File name: ${file_name}. Type: ${type}.`);
                                    if (type == "Content") {
                                        const imgAmount = imagesAmount + 1
                                        console.log(`Amount type "Content" images: ${imgAmount}\n\n`);
                                    };
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
};

// Clear Database
const clear_table_id = "foto-clear-table";
const clear_ftp_id = "foto-clear-ftp";

document.getElementById(clear_table_id).addEventListener('click', () => {
    FYSCloud.API.queryDatabase(
        "DELETE FROM foto WHERE profile_id = ?", [profile_id]
    ).then(function (data) {
        console.log(`\nDatabase cleared where Profile ID was ${profile_id}.\n\n`);
        alert(`Records succesvol verwijderd van Profiel ID ${profile_id}.`);
    }).catch(function (reason) {
        console.log(reason);
    });
});

// Clear FTP
document.getElementById(clear_ftp_id).addEventListener('click', () => {
    // Type Profile and Banner
    FYSCloud.API.deleteFile(`${profile_id}/Profiel/profiel.png`
    ).then(() => {
        FYSCloud.API.deleteFile(`${profile_id}/Banner/banner.png`)
    }).catch(function (reason) {
    });

    // Type Content
    const queryPhotos = `SELECT url FROM foto WHERE profile_id = '${profile_id}' AND type = 'Content'`;
    FYSCloud.API.queryDatabase(
        queryPhotos
    ).then(function (data) {
        const imagesAmount = Object.keys(data).length;
        for (let i = 0; i < imagesAmount; i++) {
            const imageSrcRawA = `Content/${(data[i].url)}`;
            const imageSrcRawB = imageSrcRawA.split(`${profile_id}/`).pop();
            const imageSrc = imageSrcRawB.split(`Content/`).pop()
            FYSCloud.API.deleteFile(`${profile_id}/Content/${imageSrc}`);
        };
    }).catch(function (reason) {
    });

    console.log(`\nFTP cleared where Profile ID was ${profile_id}.\n\n`);
    alert(`Bestanden succesvol verwijderd van Profiel ID ${profile_id}.`);
});
