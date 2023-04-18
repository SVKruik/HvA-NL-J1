import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";

window.addEventListener("DOMContentLoaded", initialize);

let sender;
var match_id = 0;
let acc_id = FYSCloud.Session.get("userId");
let profile_id = FYSCloud.Session.get("profileID");
let otherPerson = new Array();
let otherPersonAcc = new Array();
let allMatches = new Array();
let currentChatMessages = new Array();
let currentChatMessageChecker = new Array();
let completeChatName;
let checkerAcc;

// Function to get the all the messages from a match you are in and pushes the last message in an array.
function getLastMessages(currentVoornaam, currentProfileURL, index) {
    const queryMessages = "SELECT * FROM bericht WHERE match_id = ?";
    const queryMessageID = allMatches[index];

    FYSCloud.API.queryDatabase(
        queryMessages, queryMessageID
    ).then(async function (test) {
        let lastMessage = test[test.length - 1];
        if (lastMessage === undefined) {
            lastMessage = { waarde: "Er zijn nog geen berichten." }
            currentChatMessages.push(lastMessage);
        } else {
            currentChatMessages.push(lastMessage);
        };
        displayMatch(currentVoornaam, currentProfileURL, allMatches[index], currentChatMessages[index]);
    }).catch(function (reason) {
        console.log(reason);
    });
};

// Function that checks the last message of the current chat and appends it to the match box.
function currentChatChecker() {
    let lastChatValues = document.querySelectorAll(".chat-sub-profile-info");

    for (let index = 0; index < allMatches.length; index++) {
        const queryMessages = "SELECT waarde FROM `bericht` WHERE match_id = ? ORDER BY ID DESC LIMIT 1";
        const queryMessageID = allMatches[index];
        FYSCloud.API.queryDatabase(
            queryMessages, queryMessageID
        ).then(function (test) {
            lastChatValues[index].textContent = test[0].waarde;
        }).catch(function (reason) {
            console.log(reason);
        });
    };
};

// Chat Controls - Link
document.getElementById('chat-link').addEventListener('click', () => {
    window.open('https://www.corendon.nl/', '_blank');
});

document.querySelector(".chat-send-icon").addEventListener("click", evt => submitMessage(evt))

/**
 * Initializes all javascript on the page.
 */

async function initialize() {
    await initializeMatches();
    initializeMessageBoard();
    document.querySelector(".chat-profile-picture").src = "https://is110-3.fys.cloud/uploads/" + otherPerson[0] + "/Profiel/profiel.png";
    let chatName = document.querySelector(".chat-profile-name");

    let queryNameFirst = "Select voornaam, tussenvoegsel, achternaam FROM account where id = ?"
    FYSCloud.API.queryDatabase(
        queryNameFirst, otherPersonAcc[0]
    ).then(function (test) {
        let voornaam = test[0].voornaam;
        let tussenvoegsel = test[0].tussenvoegsel;
        let achternaam = test[0].achternaam;
        chatName.textContent = voornaam + " " + tussenvoegsel + " " + achternaam;
    }).catch(function (reason) {
        console.log(reason);
    });

    setInterval(function () {
        initializeMessageBoard();
        currentChatChecker();
    }, 5000);
};

// Function to get all matches that your accid is connected to and pushes them in a array, and sets the first match of the array as the current match_id for display.
async function initializeMatches() {
    const queryMatches = "SELECT DISTINCT `m`.`id`,`profiel_id_a`,`profiel_id_b` FROM `matches` AS `m` INNER JOIN `profiel` AS `p` ON `m`.`profiel_id_a` = ? OR `m`.`profiel_id_b` = ? WHERE verified_on IS NOT NULL";
    const queryValues = new Array(profile_id, profile_id)
    await FYSCloud.API.queryDatabase(
        queryMatches, queryValues
    ).then(function (test) {
        test.forEach(match => {
            if (match.profiel_id_a == profile_id) {
                otherPerson.push(match.profiel_id_b);
                allMatches.push(match.id);
            } else {
                otherPerson.push(match.profiel_id_a);
                allMatches.push(match.id);
            };
        });
        match_id = test[0].id;
    }).catch(function (reason) {
        console.log(reason);
    });

    for (let index = 0; index < otherPerson.length; index++) {

        let currentVoornaam;
        let currentTussenvoegsel;
        let currentAchternaam;
        let currentProfileURL;
        let currentAccID;

        const queryMatches2 = "SELECT DISTINCT`a`.`id`,`voornaam`,`tussenvoegsel`,`achternaam` FROM `account` AS `a` INNER JOIN `profiel` AS `p` ON `a`.`id` = `p`.`account_id` WHERE `p`.`id` = ?";
        const queryValues2 = otherPerson[index];
        await FYSCloud.API.queryDatabase(
            queryMatches2, queryValues2
        ).then(function (test) {
            currentVoornaam = test[0].voornaam;
            currentTussenvoegsel = test[0].tussenvoegsel;
            currentAchternaam = test[0].achternaam;

            completeChatName = currentVoornaam + " " + currentTussenvoegsel + " " + currentAchternaam;


            currentAccID = test[0].id;
            otherPersonAcc.push(currentAccID);
        }).catch(function (reason) {
            console.log(reason);
        });
        const queryFoto = "SELECT url FROM foto WHERE profile_id = ? AND type = ?";
        const queryFotoValues = new Array(otherPerson[index], "profiel")
        await FYSCloud.API.queryDatabase(
            queryFoto, queryFotoValues
        ).then(function (foto) {
            currentProfileURL = foto[0].url;
        }).catch(function (reason) {
            console.log(reason);
        });

        getLastMessages(completeChatName, currentProfileURL, index);
    };
};

/* Message functions */
/**
 * Initializes the message board. Adds functionality to submit button.
 * todo: Load messages from db and append to page.
 */
function initializeMessageBoard() {
    const queryMessages = "SELECT * FROM bericht WHERE match_id = ? ORDER BY id DESC";
    const queryMessageID = match_id;

    FYSCloud.API.queryDatabase(
        queryMessages, queryMessageID
    ).then(async function (test) {
        document.querySelector(".chat").innerHTML = "";
        test.forEach(message => {
            let dbMessage = message.waarde;
            let dbMessageTime = message.tijd_verstuurd;
            let dbSender = message.account_id;
            if (dbSender == acc_id) {
                sender = "me";
            } else {
                sender = "the other";
            };
            displayMessage(dbMessage, sender, dbMessageTime);
        });
    }).catch(function (reason) {
        console.log(reason);
    });
};

/**
 * Creates HTML elements, inserts the match and appends it to the page.
 *
 * @param messageText message to be appended
 */

function displayMatch(matchNaam, profileImage, matchID, lastMessage) {
    let matchProfileLink = document.createElement("div");
    let isMessageUndefined = 0;
    if (lastMessage === undefined) {
        isMessageUndefined = 1;
    };

    if (isMessageUndefined === 1) {
        let matchContainer = createMatch(matchNaam, profileImage, matchID, "There is no message.");
        matchProfileLink.append(matchContainer);
        document.querySelector(".my-box").appendChild(matchProfileLink);
    } else {
        let matchContainer = createMatch(matchNaam, profileImage, matchID, lastMessage);
        matchProfileLink.append(matchContainer);
        document.querySelector(".my-box").appendChild(matchProfileLink);
    };
};

/**
 * Create and return container for match text with text inserted.
 *
 * @param messageText text to be inserted in element
 * @returns {HTMLParagraphElement} p element with text
 */
function createMatch(matchNaam, profileImageURL, matchID, lastMessage) {
    let matchBox = document.createElement("div");
    matchBox.className = "chat-sub-profile";
    matchBox.addEventListener("click", async function () {
        let chatName = document.querySelector(".chat-profile-name");
        chatName.textContent = matchNaam;
        let chatProImage = document.querySelector(".chat-profile-picture");
        chatProImage.addEventListener("click", async function () {
            console.log(otherProfielID);
            await FYSCloud.Session.remove("otherUserID");
            await FYSCloud.Session.set("otherUserID", otherProfielID);
            window.location.href = "other-profiel.html";
        });
        if (profileImageURL === undefined) {
            chatProImage.src = "https://is110-3.fys.cloud/assets/img/icons/profile-picture.png";
        } else {
            chatProImage.src = "https://is110-3.fys.cloud/uploads/" + profileImageURL;
        };
        match_id = matchID;
        initializeMessageBoard();
    });

    let matchBox2 = document.createElement("img");
    matchBox2.className = "chat-sub-profile-picture";
    if (profileImageURL === undefined) {
        matchBox2.src = "https://is110-3.fys.cloud/assets/img/icons/profile-picture.png";
    } else {
        matchBox2.src = "https://is110-3.fys.cloud/uploads/" + profileImageURL;
    };
    let matchBoxUl = document.createElement("ul");
    matchBoxUl.className = "chat-sub-profile-list";
    let li1 = document.createElement("li");
    let li1p = document.createElement("p");
    li1p.className = "chat-sub-profile-name";

    li1p.innerHTML = matchNaam;

    let li2 = document.createElement("li");
    let li2p = document.createElement("p");
    li2p.className = "chat-sub-profile-info";
    li2p.innerHTML = lastMessage.waarde;
    currentChatMessageChecker.push({ id: matchID, waarde: lastMessage.waarde });

    matchBox.appendChild(matchBox2);
    matchBox.appendChild(matchBoxUl);
    matchBoxUl.appendChild(li1);
    li1.appendChild(li1p);
    matchBoxUl.appendChild(li2);
    li2.appendChild(li2p);

    return matchBox;
};

/**
 * Prevents default behaviour of button. Gets the message from the input element and displays on the page.
 * todo: Insert message in db, on successful insertion append to the page.
 *
 * @param evt event that uses function
 */

function submitMessage(evt) {
    evt.preventDefault();
    let messageText = document.querySelector(".chat-message-balk").value;

    displayMessage(messageText);
    const insertMessage = "INSERT INTO `bericht`(`match_id`, `account_id`, `tijd_verstuurd`, `waarde`) VALUES (?,?,CURRENT_TIMESTAMP,?)";
    if (checkerAcc === undefined) {
        const messageValues = new Array(match_id, acc_id, messageText);

        FYSCloud.API.queryDatabase(
            insertMessage, messageValues
        ).then(async function (data) {
            document.querySelector(".chat-message-balk").value = "";
            initializeMessageBoard();
        }).catch(function (reason) {
            console.log(reason);
        });

    } else {
        const messageValues = new Array(match_id, checkerAcc, messageText);

        FYSCloud.API.queryDatabase(
            insertMessage, messageValues
        ).then(async function (data) {
            document.querySelector(".chat-message-balk").value = "";
            initializeMessageBoard();
        }).catch(function (reason) {
            console.log(reason);
        });
    };

    for (let index = 0; index < otherPersonAcc.length; index++) {
        if (otherPersonAcc[index] == checkerAcc) {
            let allMatchBoxes = document.querySelectorAll(".chat-sub-profile-info");
            allMatchBoxes[index].innerHTML = messageText;
            break;
        };
    };

};

/**
 * Creates HTML elements, inserts the message and appends it to the page.
 *
 * @param messageText message to be appended
 */

function displayMessage(messageText, sender, tijd) {
    let messageElement = document.createElement("div");
    if (sender == "me") {
        messageElement.className = "chat-ik";
    }
    if (sender == "the other") {
        messageElement.className = "chat-moniek";
    };

    let timestamp = tijd;
    let dateFormat = new Date(timestamp);
    let showThis = dateFormat.getUTCDate() +
        "/" + (dateFormat.getUTCMonth() + 1) +
        "/" + dateFormat.getFullYear() +
        " " + (dateFormat.getUTCHours()) +
        ":" + dateFormat.getMinutes() +
        ":" + dateFormat.getSeconds();

    let timeElement = document.createElement("span");
    timeElement.textContent = showThis;

    let messageBox = createMessage(messageText);

    messageElement.append(messageBox);
    messageElement.append(timeElement);
    document.querySelector(".chat").appendChild(messageElement);
};

/**
 * Create and return container for message text with text inserted.
 *
 * @param messageText text to be inserted in element
 * @returns {HTMLParagraphElement} p element with text
 */
function createMessage(messageText) {
    let messageBox = document.createElement("h1");
    messageBox.innerHTML = messageText;
    return messageBox;
};
