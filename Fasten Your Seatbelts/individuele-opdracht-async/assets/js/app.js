import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "./config.js";

FYSCloud.API.queryDatabase(
    "SELECT * FROM message"
).then(function (data) {
    console.log(data);
}).catch(function (reason) {
    console.log(reason);
});

initializeMessageBoard()


function initializeMessageBoard() {

    //werking van de submit knop
    document.querySelector(".text-submit-button").addEventListener("click", evt => submitMessage(evt))

    //inladen en tonen van berichten
    loadMessages();
}

function loadMessages() {
    FYSCloud.API.queryDatabase(
        "SELECT * FROM message")
        .then(messages => {
            for (const messageJson of messages) {
                let message = convertDbJson(messageJson)
                displayMessage(message);
            }
        })
        .catch(function (reason) {
            console.error(reason);
        });
}

function displayMessage(message) {
    let messageElement = document.createElement("div");
    messageElement.id = message.id;
    let messageBox = createMessage(message.message);
    let deleteBtn = createDeleteBtn();
    messageElement.className = "bericht-container"

    messageElement.append(messageBox, deleteBtn);
    document.querySelector(".message-board").appendChild(messageElement);
}

function createMessage(messageText) {
    let messageBox = document.createElement("p");
    messageBox.innerText = messageText;
    return messageBox;
}

function createDeleteBtn() {
    let deleteBtn = document.createElement("a");
    deleteBtn.appendChild(document.createTextNode("X"));
    deleteBtn.addEventListener("click", () => deleteMessage(deleteBtn));
    deleteBtn.className = "bericht-delete";
    return deleteBtn;
}

function deleteMessage(button) {
    const messageID = button.parentElement.id;
    button.parentElement.remove();

    FYSCloud.API.queryDatabase(
        "DELETE FROM `message` WHERE idmessage = ?", [messageID]
    ).then(function (data) {
        console.log('Message deleted.')
    }).catch(function (reason) {
        console.error(reason);
    });
}

function Message(id, timestamp, message) {
    this.id = id;
    this.timestamp = timestamp;
    this.message = message;
}

function convertDbJson(messageJson) {
    return new Message(messageJson['idmessage'],
        messageJson['timestamp'],
        messageJson['message']);
}

function submitMessage(evt) {
    evt.preventDefault();
    let messageText = document.querySelector(".text-area").value;
    let timestamp = new Date();
    let message = new Message(null,
        timestamp.toISOString().slice(0, 19).replace('T', ' '),
        messageText);
    console.log(message);
    insertMessageDb(message);
}

function insertMessageDb(message) {
    FYSCloud.API.queryDatabase(
        "INSERT INTO `message` (`timestamp`, `message`) VALUES (?, ?);",
        [message.timestamp, message.message]
    ).then(response => {
        message.id = response.insertId;
        displayMessage(message);
    }).catch(function (reason) {
        console.error(reason);
    });
}