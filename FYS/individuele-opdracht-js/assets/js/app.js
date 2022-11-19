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
    bericht.style = 'margin-left: 10px';

    delButton.appendChild(document.createTextNode("X"));
    delButton.className = 'bericht-delete';
    delButton.style = 'cursor: pointer';

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
