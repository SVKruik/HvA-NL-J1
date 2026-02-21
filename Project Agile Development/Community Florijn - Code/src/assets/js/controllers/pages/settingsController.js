/**
 * Controller responsible for all events in the 'settings' view.
 * @author Donovan Tjokrodimedjo
 */
import { Controller } from "../controller.js";
import { SettingsRepository } from "../../repositories/settingsRepository.js";
import { App } from "../../app.js";
import { NavbarRepository } from "../../repositories/navbarRepository.js";
import { FileRepository } from "../../repositories/fileRepository.js";

export class SettingsController extends Controller {
    #settingsView;
    #settingsRepository;
    #fileRepository;

    /**
     * Constructor of the view.
     */
    constructor() {
        super();
        this.#settingsRepository = new SettingsRepository();
        this.#fileRepository = new FileRepository();
        this.#setupView();
    }

    /**
     * Load all the elements and data into the view.
     * @async
     * @private
     */
    async #setupView() {
        if (!App.sessionManager.get("userName")) {
            window.location.href = "#home"
            return;
        }

        this.#settingsView = await super.loadHtmlIntoContent("html_views/settings.html");

        // Declaring the document variables
        const navbarRepository = new NavbarRepository();
        const settingsRepository = this.#settingsRepository;
        const settingsView = this.#settingsView;
        const fileRepository = this.#fileRepository;
        const controller = new Controller();
        const navLinks = document.querySelectorAll('.nav-link');
        const supportTab = settingsView.querySelector('.settings-tab[title="support"]');
        const settingTabs = settingsView.querySelectorAll('.settings-tab:not([title="support"])');
        const settingSections = settingsView.querySelectorAll('.settings-section');
        const translateComponent = async (key) => { return await this.translateComponent(key) };
        let userData;
        let userAdvanced;

        document.addEventListener("keydown", (event) => {
            if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
                const saveButton = settingsView.querySelector('.selected-section button.save');
                saveButton.click();
            }
        });

        // Scrolls to the top of the page when the page is loaded
        setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }, 100);

        const accountToggle = settingTabs[0];
        const passwordToggle = settingTabs[1];
        const advancedToggle = settingTabs[2];
        const accessToggle = settingTabs[3]

        const accountSection = settingSections[0];
        const passwordSection = settingSections[1];
        const advancedSection = settingSections[2];
        const accessSection = settingSections[3];

        const mainInputs = settingsView.querySelectorAll('input[type="text"], input[type="email"], textarea[id="biography"]');
        const allInputs = settingsView.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], textarea[id="biography"]');
        const userButtons = settingsView.querySelectorAll('.user-buttons button, #account_delete');
        const passwordFields = settingsView.querySelectorAll('.password-field [id]');
        const biography = settingsView.querySelector('#biography');
        const profilePic = settingsView.querySelector('.account-profile-image');

        // Stores the max character limits of each element for validation to prevent user manupulation
        const maxChars = [];
        allInputs.forEach(element => {
            maxChars.push({ "maxlength": element.getAttribute("maxlength"), "input": element.id });
        });

        const colorblindOptions = settingsView.querySelectorAll("#colorblindmode option");
        const validColorblindOptions = [];

        // Storing the valid options to prevent user manipulation
        colorblindOptions.forEach(option => {
            validColorblindOptions.push(option.value);
        });

        // Obtaining the hash, and creating an array of all the sections
        const hash = window.location.hash.split("#settings/")[1];
        let sections = [accountSection, passwordSection, advancedSection, accessSection];
        let docTitle;

        // Switch case for the currently loaded settings tab, and for changing the document title accordingly
        switch (hash) {
            case "account": accountSection.classList.add('selected-section');
                accountToggle.classList.add('selected-tab');
                docTitle = await super.translateComponent("account-tab");
                break;
            case "password": passwordSection.classList.add('selected-section');
                passwordToggle.classList.add('selected-tab');
                docTitle = await super.translateComponent("password-tab");
                break;
            case "advanced":
                advancedSection.classList.add('selected-section');
                advancedToggle.classList.add('selected-tab');
                docTitle = await super.translateComponent("advanced-tab");
                break;
            case "accessibility":
                accessSection.classList.add('selected-section');
                accessToggle.classList.add('selected-tab');
                docTitle = await super.translateComponent("access-tab");
                break;
            default: window.location.href = "#settings/account";
        }

        document.title = "Community Florijn | " + docTitle || "Instellingen";

        // Calling all the functions that are needed as soon as the page loads
        const { updatePreview, clearImage } = this.#imgPreview(false, settingsView);
        await fillUserdata(true);
        await fillUserAdvanced(true);
        handleShowPassword(passwordFields);
        this.#imgPreview(true, settingsView);
        await addEventListeners();
        await inputEventListeners();
        super.translateView(true, "Setting");

        // When the hash changes the navlink event listeners get removed
        window.addEventListener('hashchange', () => {
            removeEventListeners();
        }, { once: true });

        // Function that adds all event listeners
        async function addEventListeners() {

            navLinks.forEach(navlink => {
                if (!navlink.href.includes('#settings')) {
                    navlink.addEventListener('click', handleNavLinkClick);
                }
            });

            supportTab.addEventListener("click", () => { window.location.href = "#support" });

            userButtons.forEach(btn => {
                const origin = btn.classList.value.split(" ")[0];
                const type = btn.classList.value.split(" ")[1];

                if (type.includes("save") || type.includes("cancel") || type.includes("send") || type.includes("delete")) {
                    btn.addEventListener("click", async () => {
                        document.body.style.cursor = "wait";
                        btn.classList.add("disabled");
                        await handleBtnClick(origin, type);
                        btn.classList.remove("disabled");
                        document.body.style.cursor = null;
                    })
                }
            });

            // Adds event listeners to all the available tabs to switch between them
            for (let i = 0; i < settingTabs.length; i++) {
                settingTabs[i].addEventListener('click', async () => {
                    document.title = "Community Florijn |" + settingTabs[i].textContent;

                    history.pushState(null, null, `#settings/${settingTabs[i].getAttribute("title").toLowerCase().trim()}`);
                    if (!sections[i].classList.contains('selected-section')) {
                        for (let j = 0; j < settingTabs.length; j++) {
                            settingTabs[j].classList.remove('selected-tab');
                            sections[j].classList.remove('selected-section');
                        }

                        settingTabs[i].classList.add('selected-tab');
                        sections[i].classList.add('selected-section');

                        switch (settingTabs[i].title) {
                            case "account": await fillUserdata();
                                break;
                            case "advanced": await fillUserAdvanced();
                                break;
                            case "access": await fillUserAdvanced(null, true);
                                break;
                        }
                    }
                });
            }

            App.sessionManager.set("reloadRequired", false);
        }

        // Function that checks if the titel and or text are filled in, if so warns user when attempting to leave the page without posting
        async function handleNavLinkClick(evt) {
            const fullHash = window.location.hash;

            if (fullHash.includes("#settings/advanced") && !App.sessionManager.get("advancedSynced") || fullHash.includes("#settings/account") && !App.sessionManager.get("accountSynced")) {
                evt.preventDefault();

                let saveBeforeLeaving = await controller.customAlert(null, await controller.translateComponent("post-leave-page-message"), "yesno", null);

                if (saveBeforeLeaving) {
                    const saveButton = settingsView.querySelector('.selected-section button.save');
                    saveButton.click();

                    setTimeout(() => { window.location.href = evt.target.href; }, 1000);
                } else {
                    // Send user to the designated page
                    window.location.href = evt.target.href;

                }
            }
        }

        function removeEventListeners() {
            navLinks.forEach(navlink => {
                if (!navlink.href.includes('#settings')) {
                    navlink.removeEventListener('click', handleNavLinkClick);
                }
            });
        }

        async function inputEventListeners(reload) {

            let accountInputs = accountSection.querySelectorAll('input, textarea');
            let advInputs = advancedSection.querySelectorAll('input, select');

            const accountListener = async () => {
                await checkAccountInputs();
            };

            const advListener = async () => {
                await checkAdvancedInputs();
            };

            // Helper function to check if all input values match their original saved values
            async function checkAllInputsMatchSaved(inputCollection, savedValues) {
                for (const input of inputCollection) {
                    if (input.type === 'checkbox') {
                        if (input.checked !== savedValues[input.id]) {
                            return false;
                        }
                    } else {
                        if (input.value !== savedValues[input.id] && input.type !== "file") {

                            if (input.id === "language") {
                                App.sessionManager.set("reloadRequired", true);
                            }

                            return false;
                        }
                        else if (input.type == "file") {
                            return false;
                        }
                    }
                }
                App.sessionManager.set("reloadRequired", false);
                return true;
            }

            // Save the original values of the input elements in the account section
            accountInputs = accountSection.querySelectorAll('input, textarea');
            let accountValues = {};
            accountInputs.forEach(input => {
                accountValues[input.id] = input.value;
            });
            let accountSynced = true;

            // Save the original values of the input elements in the advanced section
            advInputs = advancedSection.querySelectorAll('input, select');
            let advancedValues = {};
            advInputs.forEach(input => {
                advancedValues[input.id] = input.checked ?? input.value;
            });
            let advancedSynced = true;

            async function checkAccountInputs() {
                if (App.sessionManager.get("reloadRequired")) {
                    fillUserdata(true);
                    accountInputs.forEach(input => {
                        accountValues[input.id] = input.value;
                    });
                    App.sessionManager.set("reloadRequired", false)
                }

                // Check if all input values match their original saved values
                accountSynced = await checkAllInputsMatchSaved(accountInputs, accountValues);
                // Update the "accountSynced" session key based on the result
                App.sessionManager.set("accountSynced", accountSynced);
            }

            async function checkAdvancedInputs() {
                // Check if all input values match their original saved values
                advancedSynced = await checkAllInputsMatchSaved(advInputs, advancedValues);
                // Update the "advancedSynced" session key based on the result
                App.sessionManager.set('advancedSynced', advancedSynced);
            }

            if (reload) {
                // Remove event listeners for the `keyup` event on account inputs
                accountInputs.forEach(input => {
                    if (input.accountListener) {
                        const eventToUnbind = input.type === 'text' ? 'keyup' : 'change';
                        input.removeEventListener(eventToUnbind, input.accountListener);
                    }
                });

                // Remove event listeners for the `change` or `click` events on setting inputs
                advInputs.forEach(input => {
                    if (input.advListener) {
                        const eventToUnbind = input.type === 'checkbox' ? 'click' : 'change';
                        input.removeEventListener(eventToUnbind, input.advListener);
                    }
                });
            }

            // Add event listeners for the `keyup` event on account inputs
            accountInputs.forEach(input => {
                input.accountListener = accountListener;
                const eventToBind = input.type === 'text' ? 'keyup' : 'change';
                input.addEventListener(eventToBind, input.accountListener);
            });

            // Add event listeners for the `change` or `click` events on setting inputs
            advInputs.forEach(input => {
                input.advListener = advListener;
                const eventToBind = input.type === 'checkbox' ? 'click' : 'change';
                input.addEventListener(eventToBind, input.advListener);
            });

            return { checkAccountInputs, checkAdvancedInputs }
        }

        // Fills in all the userdata from the database into the account input fields
        async function fillUserdata(load) {
            if (App.sessionManager.get("accountSynced") && !load) {
                return;
            }

            userData = await navbarRepository.getUserData(App.sessionManager.get("email"));
            if (settingTabs[0].classList.contains('selected-tab') || load) {
                // Loops trough the inputfields, gets the id from them, compares them to the database values and assigns the values to the dedicated inputfields
                for (let i = 0; i < mainInputs.length; i++) {
                    let userDataValue = userData[0][mainInputs[i].id];
                    mainInputs[i].value = userDataValue;
                }

                // Assigns the value from the database from the biography to the biography textarea
                biography.value = userData[0].biography;
                profilePic.setAttribute("src", "/uploads/profile/" + App.sessionManager.get("userName") + ".jpg");
                updatePreview();

                profilePic.addEventListener("error", () => {
                    clearImage();
                }, { once: true });
            }

            App.sessionManager.set("accountSynced", true);

        };

        // Fills in all the userdata from the database into the account input fields
        async function fillUserAdvanced(load, access) {
            if (App.sessionManager.get("advancedSynced") && !load && !access) {
                return;
            }

            userAdvanced = (await settingsRepository.getUserSettings(App.sessionManager.get("email"))).result[0];

            if (!access || load) {
                const settingInputs = settingsView.querySelectorAll('.advanced-main input, .advanced-main select');

                settingInputs.forEach(input => {
                    const setting = userAdvanced[input.id];
                    if (input.type === 'checkbox') {
                        input.checked = (Number(setting) === 1);
                    } else if (input.type === 'select-one') {
                        const options = input.options;

                        for (let i = 0; i < options.length; i++) {
                            if (options[i].value === setting) {
                                input.selectedIndex = i;
                                break;
                            }
                        }

                    } else {
                        input.value = setting;
                    }
                });
                App.sessionManager.set('advancedSynced', true);
            }
            if (access || load) {
                userAdvanced["high_contrast"] === 1 ? document.querySelector('#high_contrast').checked = 1 : document.querySelector('#high_contrast').checked = 0;
                userAdvanced["colorblind"] !== null ? document.querySelector('#colorblind').checked = 1 : document.querySelector('#colorblind').checked = 0;
                if (userAdvanced["colorblind"] !== null) {
                    const options = document.querySelector('#colorblindmode').options;

                    for (let i = 0; i < options.length; i++) {
                        if (options[i].value.toLowerCase().includes(userAdvanced["colorblind"].toLowerCase())) {
                            document.querySelector('#colorblindmode').selectedIndex = i;
                            break;
                        }
                    }
                }
            }
        };

        function handleShowPassword(passwordFields) {
            passwordFields.forEach(field => {
                let passwordEye = field.nextSibling.nextSibling;

                passwordEye.addEventListener('click', () => {
                    if (field.getAttribute("type") == "password") {
                        field.setAttribute("type", "text");
                        passwordEye.classList.value = "bi bi-eye-slash-fill";
                    } else {
                        field.setAttribute("type", "password");
                        passwordEye.classList.value = "bi bi-eye-fill";
                    }
                })
            });
        }

        // Handles each button click for the save, send and cancel buttons
        async function handleBtnClick(origin, type) {
            controller.removeAllAlerts(true);

            const currentTab = settingsView.querySelector('.selected-section');
            const inputs = currentTab.querySelectorAll('input');

            switch (origin) {
                case "account":
                    if (type.includes("save")) {

                        // Function to capitalize the first letter of the given string
                        function capitalizeFirstLetter(str) {
                            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
                        }

                        // If all fields are valid, then continue with the database request to update userdata
                        const isValid = await checkInputFields(currentTab);

                        if (!isValid) {
                            document.body.cursor = "unset";
                            return;
                        }

                        if (App.sessionManager.get("accountSynced")) {
                            await controller.customAlert(null, await controller.translateComponent("settings-save-warning-message"), "warning");
                            return;
                        }

                        if (isValid) {
                            try {
                                // Defining importarnt variables and changing variables to the currently set input values
                                const username = App.sessionManager.get("userName");
                                const email = App.sessionManager.get("email");
                                const firstname = mainInputs[0].value;
                                const lastname = mainInputs[1].value;
                                const newEmail = mainInputs[2].value;
                                const newUsername = mainInputs[3].value;
                                const biography = mainInputs[4].value;

                                // Post request to check for duplicate entries in the database
                                const duplicates = await settingsRepository.checkDuplicates(newUsername, username, newEmail, email);

                                // If there are any users with the entered username or emailadress the user gets an error message
                                if (duplicates.checkDuplicates.length > 0) {
                                    if (duplicates.checkDuplicates[0].user_name == newUsername) {
                                        controller.customAlert(null, await controller.translateComponent("settings-username-in-use-message"));
                                        settingsView.querySelector('#user_name').classList.add('invalid');
                                    }

                                    if (duplicates.checkDuplicates[0].email == newEmail) {
                                        controller.customAlert(null, await controller.translateComponent("settings-email-in-use-message"));
                                        settingsView.querySelector('#email').classList.add('invalid');
                                    }
                                    return;
                                };

                                // Sending requests to the back-end to insert data and rename files to match the new userdata
                                await settingsRepository.insertData("userdata", capitalizeFirstLetter(firstname), capitalizeFirstLetter(lastname), newEmail, newUsername, biography, App.sessionManager.get("email"), null);

                                // Gets the uploaded image file
                                const fileInput = settingsView.querySelector('.account-profile-input');
                                let localProfileSrc;
                                let hasImage = !profilePic.src.includes('default.svg') || !profilePic.src == '';

                                if (fileInput.files[0]) {
                                    hasImage = true;
                                    localProfileSrc = profilePic.src;
                                    const formData = new FormData();
                                    formData.append("upload-file", fileInput.files[0], fileInput.files[0].name);
                                    formData.append('location', "profile");
                                    formData.append("fileName", username);

                                    await fileRepository.upload(formData);

                                    // If user did not have an image, and just uploaded one, the image gets loaded.
                                    if (profilePic.src.includes("default.svg")) {
                                        profilePic.src = localProfileSrc;
                                    }
                                } else if (!fileInput.files[0] && profilePic.src == '') {
                                    try {
                                        await fileRepository.delete("profile", username)
                                    } catch {
                                        controller.customAlert(null, await controller.translateComponent("settings-delete-error-message"), "error");
                                    }
                                }

                                // Gathering all username based images and url's
                                const usernameBasedLinks = document.querySelectorAll(`a[href*="${username}"]`);
                                const usernameBasedImages = document.querySelectorAll(".nav-user-img, .account-profile-image");

                                if (hasImage && username !== newUsername) {
                                    await fileRepository.rename("profile", username, newUsername);
                                }

                                document.body.style.cursor = "unset";


                                // Changing the session values accordingly
                                App.sessionManager.set("email", mainInputs[2].value);
                                App.sessionManager.set("userName", mainInputs[3].value);

                                // Changing every link and images including the username to include the new username
                                usernameBasedLinks.forEach(link => {
                                    link.href = link.href.replace(`${username}`, `${newUsername}`);
                                });

                                usernameBasedImages.forEach(img => {
                                    if (localProfileSrc) {
                                        img.setAttribute("src", `${localProfileSrc}`);

                                        img.addEventListener('error', () => { img.src = "./assets/img/icons/default.svg" }, { once: true })

                                    } else {
                                        img.setAttribute("src", `/uploads/profile/${newUsername}.jpg`);

                                        img.addEventListener('error', () => { img.src = "./assets/img/icons/default.svg" }, { once: true })
                                    }
                                });

                                App.sessionManager.set("reloadRequired", true);
                                App.sessionManager.set("accountSynced", true);

                                const reloadEventListeners = await inputEventListeners(true);
                                await reloadEventListeners.checkAccountInputs();

                                controller.customAlert(await controller.translateComponent("settings-success-title"), await controller.translateComponent("settings-success-save-message"), "confirmation");
                            } catch (e) {
                                fillUserdata(false);
                                controller.customAlert(null, await controller.translateComponent("settings-save-error-message"), "error");
                            }
                        }
                    } else {
                        // Else show error message
                        fillUserdata(false);
                        document.querySelector('.user-buttons').firstElementChild.classList.remove("disabled");
                        document.querySelectorAll('input').forEach(input => {
                            input.classList.remove('invalid');
                        })
                        document.body.style.cursor = null;
                        controller.customAlert(await controller.translateComponent("settings-cancel-title"), await controller.translateComponent("settings-cancel-message"));
                    }
                    break;
                case "password":
                    if (type.includes("save")) {
                        const isValid = await checkInputFields(currentTab);

                        if (isValid) {
                            const currentPass = currentTab.querySelector('#current-password');
                            const newPass = currentTab.querySelector('#new-password');
                            const repeatPass = currentTab.querySelector('#confirm-password');

                            const checkCurrentPass = await settingsRepository.checkPassword(currentPass.value, App.sessionManager.get("email"));

                            if (checkCurrentPass.data.length === 0) {
                                currentPass.classList.add('invalid');
                                controller.customAlert(await controller.translateComponent("settings-current-password-error-title"), await controller.translateComponent("settings-current-password-error-message"));
                                return;
                            }

                            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

                            if (currentPass.value == newPass.value) {
                                controller.customAlert(await controller.translateComponent("settings-new-password-error-title"), await controller.translateComponent("settings-new-password-current-error-message"));
                                currentPass.classList.add('invalid');
                                newPass.classList.add('invalid');
                            } else if (!passwordRegex.test(newPass.value)) {
                                controller.customAlert(await controller.translateComponent("settings-new-password-error-title"), await controller.translateComponent("settings-new-password-invalid-format-error-message"));
                                newPass.classList.add('invalid');
                                return;
                            } else if (newPass.value !== repeatPass.value) {
                                controller.customAlert(await controller.translateComponent("settings-new-password-error-title"), await controller.translateComponent("settings-new-password-match-error-message"));
                                newPass.classList.add('invalid');
                                repeatPass.classList.add('invalid');
                                return;
                            } else {
                                await settingsRepository.insertData("password", null, null, App.sessionManager.get("email"), null, null, null, newPass.value);
                                controller.customAlert(await controller.translateComponent("settings-new-password-success-title"), await controller.translateComponent("settings-new-password-success-message"));

                                inputs.forEach(input => {
                                    input.value = ''
                                });
                            };
                        }
                    } else {
                        document.querySelectorAll('input').forEach(input => {
                            input.classList.remove('invalid');
                        })
                        document.querySelector('.user-buttons').firstElementChild.classList.remove("disabled");
                        document.body.style.cursor = null;
                        controller.customAlert(await controller.translateComponent("settings-undo-title"), await controller.translateComponent("settings-undo-message"));
                    }
                    break;
                case "advanced":
                    if (type.includes("save")) {

                        if (App.sessionManager.get("advancedSynced")) {
                            controller.customAlert(null, await controller.translateComponent("settings-save-warning-message"), "warning");
                            return;
                        }

                        const isValid = checkInputFields(currentTab);
                        if (isValid) {
                            const advancedInputs = settingsView.querySelectorAll('.selected-section input[type="checkbox"], .selected-section select');
                            const userSettings = [];

                            advancedInputs.forEach(input => {
                                if (input.type === "checkbox") {
                                    userSettings.push({ "name": input.id, "value": input.checked ? 1 : 0 });
                                } else {
                                    userSettings.push({ "name": input.id, "value": input.value });
                                }
                            });

                            try {
                                if (controller.getValidLocales().indexOf(userSettings.find(setting => setting.name.match(/language/)).value) === -1) {
                                    throw new Error("Invalid locale");
                                }

                                await settingsRepository.setUserSettings(App.sessionManager.get("email"),
                                    userSettings.find(setting => setting.name.match(/interaction/)).value,
                                    userSettings.find(setting => setting.name.match(/sotw/)).value,
                                    userSettings.find(setting => setting.name.match(/language/)).value,
                                    userSettings.find(setting => setting.name.match(/auto_translate/)).value);

                                App.sessionManager.set("viewLanguage", userSettings.find(setting => setting.name.match(/language/)).value);
                                App.sessionManager.set("autoTranslate", userSettings.find(setting => setting.name.match(/auto_translate/)).value ? true : false);

                                App.sessionManager.set("advancedSynced", true);

                                if (App.sessionManager.get("reloadRequired")) {
                                    window.location.reload();
                                };

                                const reloadEventListeners = await inputEventListeners(true);
                                await reloadEventListeners.checkAdvancedInputs();

                                controller.customAlert(await controller.translateComponent("settings-advanced-success-title"), await controller.translateComponent("settings-advanced-success-message"), "confirmation", 3000);

                            } catch {
                                controller.customAlert(await controller.translateComponent("settings-save-error-title"), await controller.translateComponent("settings-save-error-message"));
                                return;
                            }
                        }
                    } else if (type.includes("delete")) {
                        const confirmDeletion = await controller.customAlert(null, await controller.translateComponent("settings-delete-confirm-message"), "choice");
                        if (confirmDeletion) {
                            settingsRepository.deleteUser(App.sessionManager.get("email"));
                            await controller.customAlert(null, await controller.translateComponent("settings-delete-success-message"), "confirmation");
                            controller.removeAllAlerts();
                            App.sessionManager.clear();
                            window.location.reload();
                            return;
                        }
                    } else if (type.includes("cancel")) {
                        fillUserAdvanced(false);
                        document.querySelector('.user-buttons').firstElementChild.classList.remove("disabled");
                        document.querySelectorAll('input').forEach(input => {
                            input.classList.remove('invalid');
                        })
                        document.body.style.cursor = null;
                        await controller.customAlert(await controller.translateComponent("settings-cancel-title"), await controller.translateComponent("settings-cancel-message"));
                    }

                    break;
                case "access":
                    const colorblind = settingsView.querySelector("#colorblind").checked;
                    const colorblindMode = settingsView.querySelector("#colorblindmode").value;
                    const highContrast = settingsView.querySelector("#high_contrast").checked;

                    if (type.includes("save")) {

                        if (highContrast && colorblind) {
                            await controller.customAlert(null, await translateComponent("settings-access-combine-error"));
                            return;
                        }

                        if (highContrast) document.documentElement.classList.value = 'high-contrast';
                        else if (colorblind) document.documentElement.classList.value = `${colorblindMode}`;
                        else document.documentElement.removeAttribute("class");

                        try {
                            if (validColorblindOptions.includes(colorblindMode)) {
                                await settingsRepository.setAccessSettings(App.sessionManager.get("email"), colorblind ? colorblindMode : null, highContrast ? 1 : null);
                                await controller.customAlert(null, await translateComponent("settings-access-success"), "confirmation");
                            } else {
                                throw new Error("Invalid colorblind mode!")
                            }

                        } catch (e) {
                            fillUserdata(false);
                            controller.customAlert(null, await controller.translateComponent("settings-save-error-message"), "error");
                        }

                    } else if (type.includes("cancel")) {
                        fillUserAdvanced(false, true);
                        document.querySelector('.user-buttons').firstElementChild.classList.remove("disabled");
                        document.body.style.cursor = null;
                        await controller.customAlert(await controller.translateComponent("settings-cancel-title"), await controller.translateComponent("settings-cancel-message"));
                    }
                    break;
            }

        };

        // Check input fields for validity
        async function checkInputFields(container) {
            const alphabetRegex = /^[a-zA-Z\u00C0-\u017F\s]*$/;

            // Variables to keep track off inputs with invalid values
            let emptyFields = [];
            let errors = 0;
            let inputs = container.querySelectorAll('input:not([type="file"]):not([type="checkbox"]):not(select)');

            if (inputs.length == 0) {
                return true;
            }

            // Loops trough the inputfields and checks for valid values, otherwise adds class "invalid" and adds to the invalid input field array
            for (const input of inputs) {
                const value = input.value.trim();
                input.classList.remove("invalid");

                // If one of the inputs exceeds the maximum character limit break off the rest of the validations until it is resolved.
                const inputCharLimit = maxChars.find(max => max.input === input.id);
                if (inputCharLimit && value.length > inputCharLimit.maxlength) {
                    await controller.customAlert(null, `${await controller.translateComponent((input.previousElementSibling && input.previousElementSibling.getAttribute("data-translate")) || (input.parentElement.parentElement.firstElementChild && input.parentElement.parentElement.firstElementChild.getAttribute("data-translate")))} ${await controller.translateComponent("error-max-chars")}`);
                    setTimeout(() => {
                        input.classList.add('invalid');
                    }, 10);
                    return;
                };

                if (value === '' && input.id != "biography") {
                    errors++;
                    emptyFields.push(await translateComponent(`settings-input-${(input.id).replace("_", "-")}`, false, null));

                    setTimeout(() => {
                        input.classList.add('invalid');
                    }, 10);
                } else if (input.id === 'email' && !isValidEmail(value)) {
                    await controller.customAlert(null, await controller.translateComponent("settings-invalid-email-message"), "error");
                    setTimeout(() => {
                        input.classList.add('invalid');
                    }, 10);
                    errors++;
                } else if (input.id !== 'email' && input.id !== 'biography' && !input.id.includes('password')) {
                    if (!alphabetRegex.test(value) && input.id !== 'user_name') {
                        await controller.customAlert(null, `${await controller.translateComponent(input.previousElementSibling.getAttribute("data-translate") || input.parentElement.parentElement.firstElementChild.getAttribute("data-translate"))} ${await controller.translateComponent("settings-input-letter-only-message")}`, "warning");
                        setTimeout(() => {
                            input.classList.add('invalid');
                        }, 10);
                        errors++;
                    }
                }
            };

            // If there are any errors found, the error message function gets called and the customAlert's are shown
            if (errors > 0) {

                const invalidInputs = await groupInvalidInputs(emptyFields);

                if (invalidInputs) {
                    if (errors === 1) {
                        await controller.customAlert(null, `${invalidInputs} ${await controller.translateComponent("settings-required-input-message-single")}`);
                    } else {
                        await controller.customAlert(null, `${invalidInputs} ${await controller.translateComponent("settings-required-input-message-mult")}`);
                    }
                }

                return false;
            }

            async function groupInvalidInputs(invalidInputs) {
                // Map each invalid input field to its name
                const fieldNames = invalidInputs.map(fieldName => {
                    return fieldName;
                });

                // Generate the error message based on the number of invalid fields
                if (fieldNames.length > 2) {
                    const lastFieldName = fieldNames.pop();
                    const firstFieldName = fieldNames[0];
                    const otherFieldNames = fieldNames.slice(1).map(fieldName => fieldName.toLowerCase());
                    return `${firstFieldName}, ${otherFieldNames.join(', ')} ${await translateComponent("error-required-join")} ${lastFieldName.toLowerCase()}`; // Combine field names with commas and add "EN" before the last field
                } else if (fieldNames.length === 2) {
                    return `${fieldNames[0]} ${await translateComponent("error-required-join")} ${fieldNames[1].toLowerCase()}`; // Return two field names separated by "EN"
                } else {
                    return fieldNames[0]; // Return the single field name
                }
            }

            return true;
        }

        function isValidEmail(email) {
            // Regex to check for a valid email address
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        }
    };

    // Changes the image preview on change
    #imgPreview(addEventListeners, settingsView) {
        const uploadBtn = this.#settingsView.querySelector('.account-profile-img-button');
        const imgField = settingsView.querySelector('.account-profile-span');
        const imgInput = settingsView.querySelector('.account-profile-input');
        const imgPreview = settingsView.querySelector('.account-profile-image');
        const imgClearBtn = settingsView.querySelector('.account-profile-img-remove-button');
        const controller = new Controller();

        // Function to update the image preview
        if (addEventListeners) {

            uploadBtn.addEventListener("click", () => {
                imgInput.click();
            });

            // Event listener for image input change
            imgInput.addEventListener('change', updatePreview);

            // Event listener for clear button click
            imgClearBtn.addEventListener('click', clearImage);

            // Event listeners for drag and drop
            imgField.addEventListener('dragover', (event) => {
                event.preventDefault();
                imgField.classList.add('dragover');
            });
            imgField.addEventListener('dragenter', (event) => {
                event.preventDefault();
                imgField.classList.add('dragover');
            });
            imgField.addEventListener('dragleave', (event) => {
                event.preventDefault();
                imgField.classList.remove('dragover');
            });
            imgField.addEventListener('drop', (event) => {
                event.preventDefault();
                imgField.classList.remove('dragover');
                const file = event.dataTransfer.files[0];
                imgInput.files = event.dataTransfer.files;
                updatePreview();
            });
        }

        async function updatePreview() {
            const file = imgInput.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) { // Check if file is not an image
                    await controller.customAlert(null, await controller.translateComponent("post-invalid-file-type-message"), "warning");
                    return;
                }
                if (file.size > 2 * 1024 * 1024) { // Check if file is larger than 2MB
                    await controller.customAlert(null, await controller.translateComponent("settings-image-size-message"), "warning");
                    return;
                }

                const reader = new FileReader();
                reader.onload = () => {
                    imgClearBtn.classList.remove('inactive');
                    imgPreview.setAttribute("src", reader.result);
                    imgPreview.style.display = "block";
                    imgField.classList.add('profile-image-exist');
                };
                reader.readAsDataURL(file);
                App.sessionManager.set("accountSynced", false);
            } else if (imgPreview.src) {
                imgClearBtn.classList.remove('inactive');
                imgPreview.style.display = "block";
                imgField.classList.add('profile-image-exist');
            }
        }

        function clearImage() {
            imgClearBtn.classList.add('inactive');
            imgInput.value = '';
            imgPreview.removeAttribute("src");
            imgInput.dispatchEvent(new Event('change'));
            imgPreview.style.display = "none";
            uploadBtn.style.opacity = "1";
            uploadBtn.parentElement.style.display = "flex";
            imgField.classList.remove('profile-image-exist');
        }

        return {
            updatePreview,
            clearImage
        };
    }
}