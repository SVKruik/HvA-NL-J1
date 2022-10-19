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

function myFunction2() {
    console.log("Document loaded.")

    document.getElementById("link1").innerText = href="index.html"
    document.getElementById("link2").innerText = href="index.html"
    document.getElementById("link3").innerText = href="index.html"
    document.getElementById("link4").innerText = href="index.html"
    document.getElementById("link5").innerText = href="index.html"
}

document.addEventListener('DOMContentLoaded', myFunction2);

function linkAanpassen() {

}