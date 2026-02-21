/**
 * Controller responsible for all events in the login view
 * @author Pim Meijer
 */

import { UsersRepository } from "../../repositories/usersRepository.js";
import { App } from "../../app.js";
import { Controller } from "../controller.js";
import { VerifyRepository } from "../../repositories/verifyRepository.js";
import { NavbarController } from "../navbarController.js";
import { StoryReadRepository } from "../../repositories/storyReadRepository.js";
import { RegistreerRepository } from "../../repositories/registreerRepository.js";
import { SettingsRepository } from "../../repositories/settingsRepository.js";

export class LoginController extends Controller {
    //# is a private field in Javascript
    #usersRepository;
    #verifyRepository;
    #loginView;
    #storyReadRepository;
    #registreerRepository;
    #settingsRepository;

    constructor() {
        super();
        this.#verifyRepository = new VerifyRepository();
        this.#usersRepository = new UsersRepository();
        this.#storyReadRepository = new StoryReadRepository();
        this.#registreerRepository = new RegistreerRepository();
        this.#settingsRepository = new SettingsRepository();
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<void>}
     */
    async #setupView() {
        //await for when HTML is loaded, never skip this method call in a controller
        this.#loginView = await super.loadHtmlIntoContent("html_views/login.html");
        super.translateView(true, "Login");

        this.#loginView.querySelector("#registreer").addEventListener("click", (event) => {
            event.preventDefault();
            App.loadController(App.CONTROLLER_REGISTREER);
        });

        const verification_pin = Math.floor(Math.random() * 900000) + 100000;

        this.#loginView.querySelector(".submit").addEventListener("click", event => this.#handleLogin(event));
        this.#loginView.querySelector("#forgot-password").addEventListener("click", event => this.#switch(event, verification_pin));

        const randomNumber = Math.floor(Math.random() * 4) + 1;
        const backgroundImg = document.getElementById("background-img");
        const imageUrls = [
            "./assets/img/background/authentication/FlorijnFlat.png",
            "./assets/img/background/authentication/RainbowFlat.png",
            "./assets/img/background/authentication/NightFlorijn.png",
            "./assets/img/background/authentication/CleanFlorijn.jpg"
        ];

        if (randomNumber >= 1 && randomNumber <= imageUrls.length) {
            backgroundImg.src = imageUrls[randomNumber - 1];
        } else {
            backgroundImg.src = imageUrls[0];
            console.error("Invalid random number generated");
        }

    };
    async #switch(event, verification_pin) {
        const loginBox = document.getElementsByClassName("login-box")[0];
        loginBox.style.display = "none";

        const new_login_box = document.getElementsByClassName("new-Login-box")[0];
        new_login_box.style.display = "flex";


        this.#loginView.querySelector("#change").addEventListener("click", event => this.#emailCheck(event, verification_pin));
    }
    async #emailCheck(event, verification_pin) {
        event.preventDefault();
        const loginBox = document.getElementsByClassName("login-box")[0];
        loginBox.style.display = "none";

        const new_login_box = document.getElementsByClassName("new-Login-box")[0];
        new_login_box.style.display = "flex";

        const email1 = this.#loginView.querySelector("#email1").value;

        if (!email1) {
            this.customAlert(null, await this.translateComponent("login-error-6", false, null));
            return;

        }

        const emailExists = await this.#registreerRepository.checkEmail(email1);
        if (!emailExists) {
            this.customAlert(null, await this.translateComponent("login-error-1", false, null));
            return;
        }
        //
        //update verify code with random 6 number digit and send and email to email
        this.#usersRepository.verificationCode(email1, verification_pin);

        await this.#usersRepository.sendCodeMail(email1, verification_pin, "dev", await super.translateComponent("email-update-password"), await super.translateComponent("email-general"));
        // emaik succesfully send popup
        this.customAlert("confirmation", await this.translateComponent("verify-description-1-1", false, null) + email1);

        // display none of current form
        const form2 = document.getElementsByClassName("mini-container2")[0];
        form2.style.display = "none";

        const form3 = document.getElementsByClassName("mini-container3")[0];
        form3.style.display = "flex";

        this.#loginView.querySelector("#codeCheck").addEventListener("click", event => this.#codeCheck(event, verification_pin, email1));

    }

    async #codeCheck(event, verification_pin, email1) {
        event.preventDefault();

        // check code with updates new verify code
        const code = this.#loginView.querySelector("#codeInput").value;

        if (!code) {
            this.customAlert(null, await this.translateComponent("login-code-empty", false, null));
            return;
        }

        const parsedCode = parseInt(code); // Convert code to an integer

        if (isNaN(parsedCode)) {
            this.customAlert(null, await this.translateComponent("login-code-wrong", false, null));
            return;
        }

        if (parsedCode === verification_pin) {
            const form3 = document.getElementsByClassName("mini-container3")[0];
            form3.style.display = "none";

            const form4 = document.getElementsByClassName("mini-container4")[0];
            form4.style.display = "flex";
        } else {
            this.customAlert(null, await this.translateComponent("login-code-false", false, null));
            return;
        }
        this.#loginView.querySelector("#updatePassword").addEventListener("click", event => this.#updatePassword(event, email1));

    }

    async #updatePassword(event, email1) {
        event.preventDefault();
        const password1 = this.#loginView.querySelector("#password1").value;
        const password2 = this.#loginView.querySelector("#password2").value;

        if (!password1 || !password2) {
            this.customAlert(null, await this.translateComponent("login-error-6", false, null));
            return;
        }
        const pattern2 = /^[a-zA-Z0-9_!\/]+$/;
        if (!pattern2.test(password1)) {
            await this.customAlert(null, await this.translateComponent("register-error-7", false, null));
            return;
        }
        //Checks if password length is < 5
        if (password1.length < 5) {
            await this.customAlert(null, await this.translateComponent("register-error-8", false, null));
            return;
        }
        //Checks if password matches herhaalPassword
        if (password1 !== password2) {
            await this.customAlert(null, await this.translateComponent("register-error-9", false, null));
            return;
        }
        await this.#settingsRepository.insertData("password", null, null, email1, null, null, null, password1);

        await this.customAlert("confirmation", await this.translateComponent("login-succes-2", false, null));

        //Reload the page after 2 seconds
        setTimeout(() => {
            location.reload();
        }, 2000);

    }

    async #handleLogin(event) {
        //prevent actual submit and page refresh
        event.preventDefault();

        //get the input field elements from the view and retrieve the value
        const email = this.#loginView.querySelector("#email").value;
        const password = this.#loginView.querySelector("#password").value;

        try {
            const user = await this.#usersRepository.login(email, password);
            const status = await this.#verifyRepository.getStatus(user.email);

            // Upload session data
            const viewLanguage = (await this.#settingsRepository.getUserSettings(user.email)).result[0].language;
            const foldState = {
                "tag": true,
                "story-title": true,
                "story-content": true,
                "author": true,
                "sort": true
            };
            App.sessionManager.set("email", user.email);
            App.sessionManager.set("sortColumn", "date");
            App.sessionManager.set("sortType", "DESC");
            App.sessionManager.set("userName", user.username);
            App.sessionManager.set("tagArray", []);
            App.sessionManager.set("currentPage", 1);
            App.sessionManager.set("timelineYear", new Date().getFullYear())
            App.sessionManager.set("titleQuery", "");
            App.sessionManager.set("contentQuery", "");
            App.sessionManager.set("emailSent", 0);
            App.sessionManager.set("authorQuery", "");
            App.sessionManager.set("viewLanguage", viewLanguage);
            App.sessionManager.set("foldState", foldState);

            if (status.result.length !== 0 && status.result[0].status === 0) {
                const hiddenElements = document.querySelectorAll(".hidden");
                NavbarController.toggleHiddenElements(hiddenElements);
                document.getElementsByClassName("nav-user-img")[0].parentElement.href = `#profile/${user.username}`;
                document.getElementsByClassName("nav-user-img")[0].src = `${baseUrl}/uploads/profile/${user.username}.jpg`;
                App.sessionManager.set("emailSent", 0);
                window.location.href = `#verify`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            } else if (status.result.length === 0) {
                await this.customAlert(null, await this.translateComponent("login-error-7"));
            } else {
                const hiddenElements = document.querySelectorAll(".hidden");
                NavbarController.toggleHiddenElements(hiddenElements);
                document.getElementsByClassName("nav-user-img")[0].parentElement.href = `#profile/${user.username}`;
                document.getElementsByClassName("nav-user-img")[0].src = `${baseUrl}/uploads/profile/${user.username}.jpg`;
                window.location.href = "#home";
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            };
        } catch (error) {
            //if unauthorized error code, show error message to the user
            if (error.code === 401) {
                await this.customAlert(null, await this.translateComponent("login-unauthorized"));
            } else {
                console.error(error);
            };
        };
    };
};