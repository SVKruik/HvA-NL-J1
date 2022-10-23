function myFunction() {
    let leeftijd = 17
    console.log(leeftijd)
    console.log(leeftijd.toString())

    const random = Math.floor(Math.random() * 6) + 1;
    console.log(random);

    console.log(`Mijn leeftijd is: ${leeftijd}.`)

    const FYSTeam = ["Stefan", "Rocco", "Skip", "Joep", "Anas", "Ronin"]
    console.log(FYSTeam.reverse());

    const student = {
        naam: "Stefan",
        studentnummer: 50089,
        email: "stefan.kruik@hva.nl"
    }

    console.log(student.email);
}

function linkEdit() {
    console.log("Document loaded.")

    document.getElementById("link")[0].href = "index.html";
    document.getElementById("link")[1].href = "info.html";
    document.getElementById("link")[2].href = "projects.html";
    document.getElementById("link")[3].href = "contact.html";
    document.getElementById("link")[4].href = "misc.html";
}


window.addEventListener('DOMContentLoaded', (event) => {
    linkEdit();
});

var input = document.getElementById("text-input");

function textLog() {
    const text = document.createElement('p');

    const messageBoard = document.querySelector('.message-board');

    text.appendChild(document.createTextNode("Hello world!"));

    messageBoard.appendChild(text);
}

function plaats() {
    const messageBoard = document.querySelector('.message-board');
    const berichtWaarde = document.querySelector("#text-input").value;

    const container = document.createElement('div');
    const bericht = document.createElement('p');
    const delButton = document.createElement('button');

    container.appendChild(bericht);
    container.appendChild(delButton);
    container.className = 'bericht-container';

    bericht.appendChild(document.createTextNode(berichtWaarde));
    bericht.className = 'bericht-waarde';

    delButton.appendChild(document.createTextNode("X"));
    delButton.className = 'bericht-delete';

    if (berichtWaarde.length == 0) {
        alert("Het bericht is leeg! Vul alsjeblieft iets in.");
    } else {
        messageBoard.appendChild(container);
        document.getElementById("text-input").value = ('');
    }

    delButton.onclick = function () {
        container.remove();
    }
}