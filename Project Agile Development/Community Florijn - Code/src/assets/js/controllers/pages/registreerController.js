import { Controller } from "../controller.js";
import { RegistreerRepository } from "../../repositories/registreerRepository.js";
import { PostRepository } from "../../repositories/postRepository.js";
import { App } from "../../app.js";
import { FileRepository } from "../../repositories/fileRepository.js";
import { NavbarController } from "../navbarController.js";
import { UsersRepository } from "../../repositories/usersRepository.js";
import { VerifyRepository } from "../../repositories/verifyRepository.js";
import { SettingsRepository } from "../../repositories/settingsRepository.js";


export class RegistreerController extends Controller {
    #registreerView;
    #usersRepository;
    #registreerRepository;
    #postRepository;
    #fileRepository;
    #verifyRepository;
    #settingsRepository;

    constructor() {
        super();
        this.#setupRegistreerView();
        this.#registreerRepository = new RegistreerRepository();
        this.#postRepository = new PostRepository();
        this.#fileRepository = new FileRepository();
        this.#verifyRepository = new VerifyRepository();
        this.#settingsRepository = new SettingsRepository();
        this.#usersRepository = new UsersRepository();
    }

    async #setupRegistreerView() {
        this.#registreerView = await super.loadHtmlIntoContent("html_views/registreer.html");
        super.translateView(true, "Registrer");

        const button = this.#registreerView.querySelector("#button");
        button.addEventListener('click', async (event) => {
            await this.#Handesubmit(event)
        });

        const today = new Date().toISOString().split("T")[0];
        document.getElementById("birthdate").setAttribute("max", today);

        const input = this.#registreerView.querySelector("#image");
        const preview = this.#registreerView.querySelector("#profileImage-preview");

        input.addEventListener('change', () => {
            const file = input.files[0];
            const reader = new FileReader();

            reader.addEventListener("load", () => {
                preview.src = reader.result;
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
        });

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
    }


    async #Handesubmit(event) {
        //Prevent default
        event.preventDefault();

        // get value of input fields
        const target = document.querySelector(".big-container");
        const email = target.querySelector('#email').value;
        const firstname = target.querySelector('#firstname').value;
        const lastname = target.querySelector('#lastname').value;
        const gender = target.querySelector('#gender').value;
        const birthdate = target.querySelector('#birthdate').value;
        const language = document.querySelector("#language").value;
        const password = target.querySelector('#password').value;
        const repeatpassword = target.querySelector('#repeat-password').value;
        const checkbox = document.getElementById('privacy-policy');

        // simple if check if everything is filled
        if (!firstname || !lastname || !gender || !birthdate || !email || !password || !repeatpassword) {
            return this.customAlert(null, await this.translateComponent("login-error-6"));
        }

        const pattern = /^[a-zA-Z]+$/;
        if (!pattern.test(firstname)) { return this.customAlert(null, await this.translateComponent("register-error-1")) }

        if (!pattern.test(lastname)) { return this.customAlert(null, await this.translateComponent("register-error-2")) }
        // ^ and $ are anchor characters that mark the start and end of the string to be matched, respectively.
        // [\w-.]+ matches one or more word characters (letters, digits, or underscores), hyphens, or periods.
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!email || !emailPattern.test(email)) {
            if (!email.includes("@")) {
                await this.customAlert(null, await this.translateComponent("register-error-3"));
            } else if (email.indexOf("@") === 0) {
                await this.customAlert(null, await this.translateComponent("register-error-4"));
            } else if (!email.match(/^[^@]+(\.[^@]+)*$/)) {
                await this.customAlert(null, await this.translateComponent("register-error-5"));
            } else if (!email.match(emailPattern)) {
                await this.customAlert(null, await this.translateComponent("register-error-6"));
            }
            return;
        }

        const pattern2 = /^[a-zA-Z0-9_!\/]+$/;
        if (!pattern2.test(password)) { return await this.customAlert(null, await this.translateComponent("register-error-7")) }
        //Checks if password length is < 5
        if (password.length < 5) { return await this.customAlert(null, await this.translateComponent("register-error-8")) }

        //Checks if password matches herhaalPassword
        if (password !== repeatpassword) {
            return await this.customAlert(null, await this.translateComponent("register-error-9"))
                ;
        }
        //Checks if chechbox is ticked
        if (!checkbox.checked) { return await this.customAlert(null, await this.translateComponent("register-error-10")) }

        //Checsk if email already exist in the database
        const emailExists = await this.#registreerRepository.checkEmail(email);
        if (emailExists) { return await this.customAlert(null, await this.translateComponent("register-error-11")) }


        //hide all elements and by looping through each and setting style to none
        const elements = document.getElementsByClassName("big-container");
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = "none";

        } document.getElementById("newcontainer").style.display = "flex";

        //makes the second submit button ready
        const button2 = this.#registreerView.querySelector("#newbutton");
        button2.addEventListener('click', async (event) => {
            await this.#HandleSecondSubmit(event, email, firstname, lastname, password, gender, birthdate, language)
        });
    };

    async #HandleSecondSubmit(event, email, firstname, lastname, password, gender, birthdate, language) {
        event.preventDefault();
        //picks value of these ids under here
        const target = document.querySelector(".newcontainer");
        const username = target.querySelector('#username').value;
        const image_input = this.#registreerView.querySelector('#image');
        const biography = target.querySelector("#biography").value;

        //check if image is null
        if (image_input.files.length === 0) { return await this.customAlert(null, await this.translateComponent("register-error-12")) }

        //checkt if username is null and a regex
        if (!username) { return await this.customAlert(null, await this.translateComponent("register-error-13")) }

        const pattern = /^[a-zA-Z0-9]+$/;
        if (!pattern.test(username)) { return await this.customAlert(null, await this.translateComponent("register-error-14")) }
        //checks if username is alreqady in database
        const usernameExists = await this.#registreerRepository.checkUsername(username);

        if (usernameExists) { return await this.customAlert(null, await this.translateComponent("register-error-15")) }
        //checks if biography is not null
        if (!biography) { return await this.customAlert(null, await this.translateComponent("register-error-16")) }

        // makes a verification pin which is a random 6 digit number
        const verification_pin = Math.floor(Math.random() * 900000) + 100000;

        //send Post request to user_info
        this.#registreerRepository.createAccount(
            email, username, firstname, lastname, password);

        //sends image and saves it as the username value becouse every image has to be uniqe and username is uniqe
        if (image_input.files[0]) {
            const formData = new FormData();
            formData.append("upload-file", image_input.files[0], image_input.files[0].name);
            formData.append('location', "profile");
            formData.append("fileName", username);
            this.#fileRepository.upload(formData);
        }

        // send Post request to user_data
        this.#registreerRepository.createAccountDetail(email, gender, birthdate, biography, verification_pin, language);
        // logs user in
        setTimeout(async () => {
            // Code to be executed after the delay
            await this.#handleLogin(event);
        }, 1000);

    }

    async #handleLogin(event) {
        //prevent actual submit and page refresh
        event.preventDefault();

        //get the input field elements from the view and retrieve the value
        const email = this.#registreerView.querySelector("#email").value;
        const password = this.#registreerView.querySelector("#password").value;

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
            App.sessionManager.set("foldState", foldState);
            App.sessionManager.set("viewLanguage", viewLanguage);

            if (status.result.length !== 0 && status.result[0].status === 0) {
                const hiddenElements = document.querySelectorAll(".hidden");
                NavbarController.toggleHiddenElements(hiddenElements);
                document.getElementsByClassName("nav-user-img")[0].parentElement.href = `#profile/${user.username}`;
                document.getElementsByClassName("nav-user-img")[0].src = `uploads/profile/${user.username}.jpg`;
                App.sessionManager.set("emailSent", 0);
                window.location.href = `#verify`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            } else if (status.result.length === 0) {
                await this.customAlert(null, await this.translateComponent("login-error-7"));
            } else {
                const hiddenElements = document.querySelectorAll(".hidden");
                NavbarController.toggleHiddenElements(hiddenElements);
                document.getElementsByClassName("nav-user-img")[0].parentElement.href = `#profile/${user.username}`;
                document.getElementsByClassName("nav-user-img")[0].src = `uploads/profile/${user.username}.jpg`;
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
    }
}