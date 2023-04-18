import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../js/config.live.js";
const accountID = await FYSCloud.Session.get("userId");

function logOut() {
    //Remove everything from the session
    FYSCloud.Session.clear();
};

function handleForm(event) {
    event.preventDefault();
};

document.addEventListener("DOMContentLoaded", async function () {
    const currentPage = window.location.href.split(`${window.location.hostname}/`).pop();

    if (!FYSCloud.Session.get('loginstatus')) {
        if (currentPage == "admin.html") {
            window.location.href = "index.html";
        } else if (currentPage == "chat.htm") {
            window.location.href = "index.html";
        } else if (currentPage == "edit-account.html") {
            window.location.href = "index.html";
        }  else if (currentPage == "instellingen.html") {
            window.location.href = "index.html";
        }  else if (currentPage == "match.html") {
            window.location.href = "index.html";
        }  else if (currentPage == "other-profiel.html") {
            window.location.href = "index.html";
        }  else if (currentPage == "profiel.html") {
            window.location.href = "index.html";
        }  else if (currentPage == "upload-image.html") {
            window.location.href = "index.html";
        }  else if (currentPage == "zoek.html") {
            window.location.href = "index.html";
        };
    };

    //Add the header to the page
    const headerData = await FYSCloud.Utils.fetchAndParseHtml('components/nav.html');
    addHeader(headerData);

    //Add the footer to the page
    const footerData = await FYSCloud.Utils.fetchAndParseHtml("components/footer.html");
    addFooter(footerData);

    function addHeader(data) {
        const firstElement = data[0];

        checkLoggedIn(firstElement);

        document.body.insertBefore(firstElement, document.body.firstChild);
    };

    document.getElementsByClassName('inlog-button')[0].addEventListener('click', () => {
        window.location.href = "inlog.html";
    });

    document.getElementsByClassName('chaticon')[0].addEventListener('click', () => {
        window.location.href = "chat.html";
    });

    const content = document.getElementsByClassName('res-dropdown-content')[0];
    content.style.display = "none"
    document.getElementById('res-dropdown-button').addEventListener('click', () => {
        if (content.style.display == "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        };
    });

    // Position the dropdown higer/lower depending on log in status
    levelDropdown();
    window.addEventListener("resize", () => {
        levelDropdown();
    });

    function levelDropdown() {
        if (window.innerWidth <= 749) {
            if (FYSCloud.Session.get("isAdmin") == 1) {
                content.style.marginBottom = "-439px";
            } else {
                if (accountID == null || accountID == undefined) {
                    content.style.marginBottom = "-259px";
                } else {
                    content.style.marginBottom = "-439px";
                };
            };
        } else {
            if (accountID == null || accountID == undefined) {
                content.style.marginBottom = "-100px";
            } else {
                content.style.marginBottom = "-140px";
            };
        };
    };

    // Close button
    const contentClose = document.getElementById('res-dropdown-list-close');
    contentClose.addEventListener('click', () => {
        content.style.display = "none";
    });

    function addFooter(data) {
        const firstElement = data[0];

        checkLoggedIn(firstElement);

        document.body.appendChild(firstElement);
    };

    if (FYSCloud.Session.get("loginstatus")) {
        document.querySelectorAll("#js-loggedin-hide").forEach(e => e.style.display = "none");
    };

    if (window.href == "https://is110-3.fys.cloud/index.html" || "https://is110-3.fys.cloud/") {
        /// gebruikers
        await FYSCloud.API.queryDatabase(
            `SELECT COUNT(email) AS amount FROM account`
        ).then(function (data) {
            const amount = data[0].amount;
            if (document.getElementById('gebruiker-container-parent') == undefined) {
            } else {
                document.getElementById('gebruiker-container-parent').innerHTML = amount;
            };
        }).catch(function (reason) {
            console.log(reason);
        });
    };

    // Only do this when there is a verification in the session
    if (FYSCloud.Session.get("verification" && window.href == "https://is110-3.fys.cloud/index.html" || "https://is110-3.fys.cloud/")) {
        let verificationstatus = FYSCloud.Session.get("verification");
        if (verificationstatus == 1) {
            verificationstatus = "You need to verify your emailadres, check your inbox!"
        } else {
            verificationstatus = "";
        };
        document.getElementById("account_verification").innerHTML = verificationstatus;
    };

    if (FYSCloud.Session.get("acc-voornaam") == undefined) {
        document.getElementById("acc-naam").innerHTML = "test"
    } else {
        let accvoornaam = FYSCloud.Session.get("acc-voornaam");
        let acctussenvoegsel = FYSCloud.Session.get("acc-tussenvoegsel");
        if (acctussenvoegsel == undefined) {
            acctussenvoegsel = ""
        };
        let accachternaam = FYSCloud.Session.get("acc-achternaam");
        if (document.getElementById("acc-naam") == null) {
        } else {
            document.getElementById("acc-naam").innerHTML = accvoornaam + " " + acctussenvoegsel + " " + accachternaam;
        }
    };

    function logOut() {
        //Remove everything from the session
        FYSCloud.Session.clear();
    };

    function handleForm(event) {
        event.preventDefault();
    };

    if (document.querySelector(".logout") == null) {
    } else {
        let logoutButton = document.querySelector(".logout");
        logoutButton.addEventListener('click', handleForm);
        logoutButton.addEventListener('click', async () => {
            logOut();
            window.location.href = "index.html";
        });
    }

    if (document.getElementById("logout") == null) {
    } else {
        let logoutButton = document.getElementById("logout");
        logoutButton.addEventListener('click', handleForm);
        logoutButton.addEventListener('click', async () => {
            logOut();
            window.location.href = "index.html";
        });
    }

    document.querySelector(".prev")?.addEventListener("click", () => plusSlides(-1))
    document.querySelector(".next")?.addEventListener("click", () => plusSlides(+1))
    document.querySelectorAll(".dot")?.forEach(dot => dot.addEventListener("click", evt => currentSlide(evt.target.id)));
});

//NOTE: Global function so other JavaScript files can use this as well
export function checkLoggedIn(element) {
    if (FYSCloud.Session.get("loginstatus")) {
        element.querySelectorAll("#js-loggedin-show").forEach(e => e.style.display = "");
        element.querySelectorAll("#js-loggedin-showadmin").forEach(e => e.style.display = "none");
        if (FYSCloud.Session.get("isAdmin") == 1) {
            element.querySelectorAll("#js-loggedin-showadmin").forEach(e => e.style.display = "block");
        } else {
            element.querySelectorAll("#js-loggedin-showadmin").forEach(e => e.style.display = "none");
        };
        element.querySelectorAll("#js-loggedin-hide").forEach(e => e.style.display = "none");
        const queryProfilePicture = "SELECT url FROM foto WHERE profile_id = ? AND type = ?";
        const queryProfileValues = new Array(FYSCloud.Session.get("profileID"), "Profiel")

        FYSCloud.API.queryDatabase(
            queryProfilePicture, queryProfileValues
        ).then(function (test) {
            document.querySelector(".profile-picture").src = "https://is110-3.fys.cloud/uploads/" + test[0].url;
        }).catch(function (reason) {
            console.log(reason);
        });
    } else {
        element.querySelectorAll("#js-loggedin-show").forEach(e => e.style.display = "none");
        element.querySelectorAll("#js-loggedin-showadmin").forEach(e => e.style.display = "none");
        element.querySelectorAll("#js-loggedin-show").forEach(e => e.removeAttribute("width"));
        element.querySelectorAll("#js-loggedin-hide").forEach(e => e.style.display = "");
    };
};

// slide show van reviews

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
};

function currentSlide(n) {
    console.log(n)
    showSlides(slideIndex = n);
};

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (slides.length == 0) {
    } else {
        var dots = document.getElementsByClassName("dot");
        if (n > slides.length) { slideIndex = 1 };
        if (n < 1) { slideIndex = slides.length };
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        };
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        };
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
    };
};

if (document.getElementById(`review_1`) == null) {
} else {
    FYSCloud.API.queryDatabase(
        "SELECT review_inhoud FROM review LIMIT 3"
    ).then(function (data) {
        const review_amount = data.length;
        for (let i = 0; i < review_amount; i++) {
            const review_value = Object.values(data[i])[0];
            const review_container = document.getElementById(`review_${i + 1}`);
            review_container.innerHTML = review_value;
        };
    }).catch(function (reason) {
        console.log(reason);
    });
};
