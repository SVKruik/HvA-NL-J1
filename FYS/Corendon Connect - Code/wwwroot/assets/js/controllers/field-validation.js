let errorbox = document.querySelector(".field-validation");
let errorfield = document.querySelector(".field-validation p");

export function checkIfFilled(string) {
    if (string.length >= 1) {
        errorbox.style.display = "none";
        return true;
    } else {
        errorbox.style.display = "flex";
        errorfield.innerHTML = "Je hebt iets niet ingevuld, dit is wel noodzakelijk!";
        return false;
    };
};

export function isPasswordSame(wachtwoord, wachtwoordherhaling) {
    if (wachtwoord == wachtwoordherhaling) {
        errorbox.style.display = "none";
        return true;
    } else {
        errorbox.style.display = "flex";
        errorfield.innerHTML = "Het wachtwoord is niet hetzelfde, vul opnieuw in!";
        return false;
    };
};

export function isValidEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    };
    errorbox.style.display = "flex";
    errorfield.innerHTML = "U heeft een email ingevoerd met onjuiste karakters!"
    return (false);
};

export function geslachtIngevuld(geslacht) {
    if (geslacht != undefined) {
        errorbox.style.display = "none";
        return true;
    } else {
        errorbox.style.display = "flex";
        errorfield.innerHTML = "U heeft geen geslacht gekozen, dit is wel noodzakelijk!"
        return false;
    };
};

export function RegistrationCheck(voornaam, achternaam, land, geboortedatum, email, wachtwoord, wachtwoordherhaling, geslacht) {
    const functionResults = [
        checkIfFilled(geboortedatum),
        checkIfFilled(voornaam),
        checkIfFilled(achternaam),
        checkIfFilled(land),
        checkIfFilled(wachtwoord),
        geslachtIngevuld(geslacht),
        checkIfFilled(email),
        isValidEmail(email),
        isPasswordSame(wachtwoord, wachtwoordherhaling)
    ];

    let counter = 0;

    function allOkay() {
        functionResults.forEach(functionDone => {
            if (functionDone === false) {
                counter++;
            } else {
                return true;
            };
        });
    };

    allOkay();
    if (counter >= 2) {
        errorbox.style.display = "flex";
        errorfield.innerHTML = "Meerdere inputvelden zijn niet correct, check en verander die!"
        return false;
    };

    if (counter == 1) {
        errorbox.style.display = "flex";
        return false;
    };

    if (counter == 0) {
        errorbox.style.display = "none";
        return true;
    };
};

export function LoginCheck(email, wachtwoord) {
    const functionResults = [
        isValidEmail(email),
        checkIfFilled(email),
        checkIfFilled(wachtwoord),
    ];

    let counter = 0;

    function allOkay() {
        functionResults.forEach(functionDone => {
            if (functionDone === false) {
                counter++;
            } else {
                return true;
            };
        });
    };

    allOkay();
    if (counter >= 2) {
        errorbox.style.display = "flex";
        errorfield.innerHTML = "Meerdere inputvelden zijn niet correct, check en verander die!"
        return false;
    };

    if (counter == 1) {
        errorbox.style.display = "flex";
        return false;
    };

    if (counter == 0) {
        errorbox.style.display = "none";
        return true;
    };
};

export function emptyStyler(element) {
    if (element.value.length < 1) {
        element.style.border = "solid 1px red";
    };
    if (element.value.length >= 1) {
        element.style.border = "solid 1px black";
    };
};