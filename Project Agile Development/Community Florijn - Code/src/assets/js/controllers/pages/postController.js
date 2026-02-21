/**
 * Controller responsible for all events in the posting view
 * @author Donovan Tjokrodimedjo
 */
import { Controller } from "../controller.js";
import { PostRepository } from "../../repositories/postRepository.js";
import 'https://unpkg.com/maxlength-contenteditable@1.0.1/dist/maxlength-contenteditable.js';
import { App } from "../../app.js";
import { FileRepository } from "../../repositories/fileRepository.js";
import * as achievementThresholds from "../../framework/utils/achievementThresholdHelper.js";

export class PostController extends Controller {
    #postView;
    #postRepository;
    #fileRepository;

    constructor() {
        super();
        this.#postRepository = new PostRepository();
        this.#fileRepository = new FileRepository();
        this.tagData = null; // Declare the variable to store the data
        this.#setupView();
    };

    async #setupView() {
        this.#postView = await super.loadHtmlIntoContent("html_views/post.html");

        // Changes the content of the save button dynamically depending on the viewLanguage.
        let saveButton = this.#postView.querySelector("#button-save");
        saveButton.style.setProperty("--button-text", `'${await super.translateComponent("post-save-button")}'`);

        // Defining the hash of the current page
        const hash = window.location.hash.split("#post/")[1];
        let storyData;

        // Checking if the current hash matches the required hash
        if (window.location.hash.match(/^#post\/new$/) || window.location.hash.match(/^#post\/edit\?id=.+/)) {
            // Hash matches the desired formats
        } else {
            window.location.href = "#post/new";
            return;
        }

        // Calls all other functionals
        await this.#selectTags(false);
        this.#setEventListeners();
        this.#imgPreview(true, super.customAlert, super.translateComponent);
        this.#postButton();
        this.#richtext();
        super.translateView(true, "Post");
        maxlengthContentEditableModule.maxlengthContentEditable();

        // Switches the UI between new post and editing an existing story.
        if (hash.includes("new")) {
            let sessionData;
            App.sessionManager.set("storySaved", true);

            // Variables for checking the session storage.
            try {
                if (App.sessionManager.get("storyData")) sessionData = JSON.parse(App.sessionManager.get("storyData"));
                // If the user is writing a new story, and text is stored in the session it gets filled in.
                if (sessionData && hash.includes("new")) this.#fillFields(sessionData, "new");
            } catch {
                super.customAlert(null, await super.translateComponent("session-error"));
            }
        } else if (hash.includes("edit")) {
            // Switches all UI elements to the edit story version, and fills all the current story data into the fields
            const editStoryId = hash.split("edit?id=")[1];

            try {
                storyData = (await this.#postRepository.getStoryData(editStoryId)).story[0];

                if (!storyData.email == (App.sessionManager.get("email"))) throw new Error(await super.translateComponent("post-edit-error"));

                this.customAlert(await super.translateComponent("post-alert-header-1"), await super.translateComponent("post-edit-message"));
                this.#fillFields(storyData, "edit");

            } catch (error) {
                // Shows an permission error when the email of the story author does not match the current logged in user.
                await this.customAlert(`${await super.translateComponent("alert-msg-error-title")}`, error.toString().split("Error: ")[1]);
                window.location.href = "#post/new";
            }
        }

        // If a user is logged in, check for verification.
        if (App.sessionManager.get("email")) {
            const userVerified = await this.#postRepository.checkUser(App.sessionManager.get("email"));

            // User needs to verify before posting a story.
            if (userVerified[0].email_verification !== 1) {
                this.customAlert(null, await super.translateComponent("post-verification-error"), "error");
                window.location.href = "#verify";
            }
        }

        // If no user is logged in, the option to post a story anonymously gets removed
        if (!App.sessionManager.get("email")) {
            this.#postView.querySelector('input[value="anonymous"]').parentElement.remove();
        }
    }

    /**
     * Calls all repository functions with required data to communicate with the database.
     * @param {string} type - type of request (e.g. new story or edit story).
     * @param {string} email - Email of the user who posted the story.
     * @param {string} title - Title of the story.
     * @param {string} text - Text of the story.
     * @param {string} url - Unique URL of the story.
     * @param {boolean} anonymous - Indicates whether the story is posted anonymously or not.
     * @param {boolean} comments - Indicates whether comments are enabled for the story or not.
     * @param {boolean} votes - Indicates whether votes are enabled for the story or not.
     * @param {boolean} explicit - Indicates whether the story is explicit or not.
     * @param {number} tagId1 - ID of the first tag associated with the story.
     * @param {number} tagId2 - ID of the second tag associated with the story.
     * @param {number} tagId3 - ID of the third tag associated with the story.
     * @param {number} year - Year in which the story was posted.
     * @async
     * @private
     */
    async #sendQuery(type, email, title, text, url, anonymous, comments, votes, explicit, tagId1, tagId2, tagId3, year) {
        if (type.includes("edit") && App.sessionManager.get("storySaved")) {
            // If the user is editing a story and trying to save without making changes, show an error alert.
            await this.customAlert(null, await this.translateComponent("post-edit-nochanges"), "error");
            return false;
        }

        // Await the story related requests.
        await this.#postRepository.postStory(type, email, title, text, url, anonymous, comments, votes, explicit, year);
        const getStoryId = await this.#postRepository.getStoryId(url);
        await this.#postRepository.storyTags(type, getStoryId[0].id, tagId1, tagId2, tagId3);

        return true;
    }

    // Function to add all relevant event listeners.
    #setEventListeners() {
        // Declaring the needed variables of the document
        const navLinks = document.querySelectorAll('.nav-link, .ham-item:not(.logout-btn)');
        const saveSession = () => { this.#saveStoryToSession(); };
        const controller = new Controller();
        const postView = this.#postView;
        const hash = window.location.hash;

        // Handles navigation bar clicks when on the posting page.
        async function handleNavLinkClick(evt) {
            if (hash.includes("#post")) {
                evt.preventDefault();
                await saveBeforeLeavingPrompt();

                // Removes all alerts from the alert container after leaving the page.
                controller.removeAllAlerts();

                // Send user to the designated page
                if (evt.target.href !== undefined) window.location.href = evt.target.href;
                else window.location.href = evt.target.parentElement.href;
            }
        }

        // Warns user before leaving the page if changes have been made in their story.
        async function saveBeforeLeavingPrompt() {
            if (!App.sessionManager.get("storySaved")) {
                let saveBeforeLeaving = await controller.customAlert(null, await controller.translateComponent("post-leave-page-message"), "yesno", null);

                if (saveBeforeLeaving) {
                    if (hash.includes("new")) {
                        // Enters all storydata into the session for easy editing later on.
                        saveSession();
                    } else {
                        // If the user is editing a story, then click the save button when saving before leaving.
                        postView.querySelector('#button-save').click();
                    }
                }
            }
        }

        // Add event listeners to all navigation items and input fields
        async function addEventListeners() {
            navLinks.forEach(navlink => {

                // If navlink.href is not undefined
                if (navlink.href !== undefined) {
                    // check if navlink.href does not include '#post'
                    if (!navlink.href.includes('#post')) {
                        // then add an event listener
                        navlink.addEventListener('click', handleNavLinkClick);
                    }
                } else {
                    // If navlink.href is undefined
                    // then check if parent element's href does not include '#post'
                    if (!navlink.parentElement.href.includes("#post")) {
                        // then add an event listener
                        navlink.addEventListener('click', handleNavLinkClick);
                    }
                }
            });

            // Event listener that listens to the "CTRL + S" keybind to easyily save story changes.
            document.addEventListener("keydown", async (evt) => { await saveKeyListener(evt) });

            const inputFields = postView.querySelectorAll('input, .story-contentarea');

            // Loop that adds event listeners to all inputs.
            inputFields.forEach(function (inputField, index) {
                if (inputField.type === "checkbox") {
                    inputField.addEventListener('click', handleInputFieldClick);
                } else {
                    inputField.addEventListener('keyup', function (event) {
                        handleInputFieldEnter(event, index, inputField, inputFields);
                    });
                }
            });
        }

        // Remove all event listeners from all navigation items and input fields
        async function removeEventListeners() {
            navLinks.forEach(navlink => {
                // If navlink.href is not undefined
                if (navlink.href !== undefined) {
                    // check if navlink.href does not include '#post'
                    if (!navlink.href.includes('#post')) {
                        // then remove the event listener
                        navlink.removeEventListener('click', handleNavLinkClick);
                    }
                } else {
                    // If navlink.href is undefined
                    // then check if parent element's href does not include '#post'
                    if (!navlink.parentElement.href.includes("#post")) {
                        // then remove the event listener
                        navlink.removeEventListener('click', handleNavLinkClick);
                    }
                }
            });

            document.removeEventListener("keydown", async (evt) => { await saveKeyListener(evt) });

            const inputFields = postView.querySelectorAll('input, .story-contentarea');
            inputFields.forEach(function (inputField, index) {
                if (inputField.type === "checkbox") {
                    inputField.removeEventListener('click', handleInputFieldClick);
                } else {
                    inputField.removeEventListener('keydown', function (event) {
                        handleInputFieldEnter(event, index, inputField, inputFields);
                    });
                }
            });
        }

        function handleInputFieldEnter(event, index, inputField, inputFields) {
            if (inputField.classList.contains("invalid")) {
                if ((!inputField.value ? inputField.textContent.trim().length : inputField.value.trim().length) >= 1) {
                    inputField.classList.remove("invalid");
                }
            }

            // On enter, focus on next relevant input or textarea.
            if (event.key === 'Enter') {
                event.preventDefault();
                const nextField = inputFields[index + 1];
                if (nextField) {
                    nextField.focus();
                }
            }
            App.sessionManager.set("storySaved", false);
        }

        function handleInputFieldClick() {
            App.sessionManager.set("storySaved", false);
        }

        // CTRL + S to save the page, F5 to get the save before leaving prompt.
        async function saveKeyListener(event) {
            if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
                let saveButtons = postView.querySelectorAll('#button-save, #button-save-edit');
                saveButtons.forEach(btn => {
                    btn.click();
                })
            }

            if (event.key === "F5") {
                event.preventDefault();
                await saveBeforeLeavingPrompt();
                window.location.reload();
            }
        }

        // Adds the event listeners when the page is loaded
        addEventListeners();

        // When the hash changes the navlink event listeners get removed
        window.addEventListener('hashchange', () => {
            removeEventListeners();
        }, { once: true });

        // Date related variables
        const yearInput = this.#postView.querySelector('#story-year');
        const minValue = 1968;
        const maxValue = new Date().getFullYear();
        const maxLength = 4;

        // Event listener to ensure correct input in the field where the user can input the year of origin.
        yearInput.addEventListener('input', () => {
            let inputValue = yearInput.value;
            if (inputValue.length >= maxLength) {
                inputValue = inputValue.slice(0, 4);
                if (yearInput.length = 4 && inputValue > maxValue) {
                    inputValue = maxValue;
                } else if (yearInput.length = 4 && inputValue < minValue) {
                    inputValue = minValue;
                }
                yearInput.value = inputValue;
            }
        })

        // Dynamically changing the attributes accordingly to the current year.
        yearInput.value = maxValue;
        yearInput.setAttribute('max', maxValue);
        yearInput.setAttribute('placeholder', maxValue);
    }

    // Function to retrieve the tagdata from the database.
    async #getTagData() {
        if (this.tagData) { // Check if the data has already been fetched
            return this.tagData; // If so, return the saved data
        }

        const tagData = await this.#postRepository.getTags(); // Fetch the data
        this.tagData = tagData; // Save the data in the variable

        return tagData; // Return the fetched data
    }

    // Changes the image preview on change
    #imgPreview(addEventListeners) {
        const uploadBtn = this.#postView.querySelector('.story-upload');
        const imgField = this.#postView.querySelector('#story-image');
        const imgInput = this.#postView.querySelector('#story-img-input');
        const imgPreview = this.#postView.querySelector('#story-img-preview');
        const imgClearBtn = this.#postView.querySelector('#story-img-clear');
        const controller = new Controller();

        // Adding event listeners
        if (addEventListeners) {
            uploadBtn.addEventListener("click", () => {
                imgInput.click();
            });

            // Event listener for image input change
            imgInput.addEventListener('change', updatePreview);

            // Event listener for clear button click
            imgClearBtn.addEventListener('click', () => { clearImage(false) });

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
                imgInput.files = event.dataTransfer.files;
                updatePreview();
            });
        }

        // Updates the image source when the file changes
        async function updatePreview() {
            const file = imgInput.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) { // Check if file is not an image
                    await controller.customAlert(null, await controller.translateComponent("post-invalid-file-type-message"), "warning");
                    return;
                }
                if (file.size > 2 * 1024 * 1024) { // Check if file is larger than 2MB
                    await controller.customAlert(null, await controller.translateComponent("post-file-size-error-message"), "warning");
                    return;
                }

                // File reader reads the file and then sets the result as the image source
                const reader = new FileReader();
                reader.onload = () => {
                    imgClearBtn.classList.remove('inactive');
                    imgPreview.src = reader.result;
                    imgPreview.style.display = "block";
                    uploadBtn.style.opacity = "0";
                    uploadBtn.parentElement.style.display = "none";
                    imgField.style.border = '1px solid var(--gray)';
                };
                reader.readAsDataURL(file);
                App.sessionManager.set("storySaved", false);
            } else if (imgPreview.src) { // If an image already exists / was already uploaded (e.g. when editing or returning to a session saved story)
                imgClearBtn.classList.remove('inactive');
                imgPreview.style.display = "block";
                uploadBtn.style.opacity = "0";
                uploadBtn.parentElement.style.display = "none";
                imgField.style.border = '1px solid var(--gray)';
            }
        }

        // Clears the image source and changes the styling accordingly
        function clearImage(storySaved) {
            App.sessionManager.set("storySaved", storySaved || false);
            imgClearBtn.classList.add('inactive');
            imgInput.value = '';
            imgPreview.src = '';
            imgPreview.style.display = "none";
            uploadBtn.style.opacity = "1";
            uploadBtn.parentElement.style.display = "flex";
            imgField.style.border = '1px dashed var(--gray)';
        }

        return {
            updatePreview,
            clearImage
        };
    }

    // Initalizes the tag selector and the available story tags as options
    async #selectTags() {

        const tagData = await this.#getTagData();
        const tagsAdd = this.#postView.querySelector('.richtext-button.add');
        const tagsDropdown = this.#postView.querySelector('.story-tags-dropdown');

        // Fetches all tags from the query and appends them to the select container
        for (let i = 0; i < tagData.length; i++) {
            const tag = document.createElement('option');
            tag.setAttribute("value", tagData[i].id);
            tag.textContent = await super.translateComponent("story-tag-" + tagData[i].id, false, null) || tagData[i].name;

            if (tagsDropdown) {
                tagsDropdown.appendChild(tag);
            }
        }

        // Add tag button event listener to add the selected tag when clicked
        tagsAdd.addEventListener('click', async () => {
            if (tagsDropdown.value.includes("empty")) {
                await this.customAlert(null, await super.translateComponent("post-tag-select-error"), "error");
                return;
            }
            if (tagsAdd.classList.contains('invalid')) tagsAdd.classList.remove('invalid');
            if (tagsAdd.previousElementSibling.firstElementChild.classList.contains('invalid')) tagsAdd.previousElementSibling.firstElementChild.classList.remove('invalid');

            App.sessionManager.set("storySaved", false);
            await this.#constructTag(tagsDropdown.value, tagData);
        });
    }

    // Function to construct tags or simulate tag selection
    async #constructTag(tagId, tagData) {
        const storyTagsContainer = this.#postView.querySelector('.story-tags');
        const tagsAdd = this.#postView.querySelector('.richtext-button.add');
        const tagsDropdown = this.#postView.querySelector('.story-tags-dropdown');
        const addTagsContainer = this.#postView.querySelector('.story-add-tags');
        const selectedTag = tagData.find(tag => tag.id === parseInt(tagId));

        if (!selectedTag) return;

        let allTags = this.#postView.querySelectorAll('.story-tag');
        let tagsAmount = allTags.length;

        // Changes the styling when the tags amount is 0
        if (tagsAmount === 0) {
            storyTagsContainer.style.display = 'flex';
            addTagsContainer.style.flex = '1';
        }

        // If the tag is already added, return and do nothing
        const existingTag = Array.from(allTags).find(tag => tag.id === selectedTag.id);
        if (existingTag) return;

        // Create a new tag with the selected information
        const tag = document.createElement('p');
        tag.textContent = await this.translateComponent(`story-tag-${selectedTag.id}`, false, null) || selectedTag.name;
        tag.style.backgroundColor = `var(--tag-color-${selectedTag.id})`;
        tag.classList.add('story-tag');
        tag.id = selectedTag.id;

        // Create the remove tag button
        const removeTag = document.createElement('button');
        removeTag.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        removeTag.classList.add('remove');

        // Handle tag deletion
        removeTag.addEventListener('click', async () => {
            App.sessionManager.set("storySaved", false);
            if (removeTag.classList.contains('invalid')) removeTag.classList.remove('invalid');
            const index = Array.from(storyTagsContainer.children).indexOf(tag);
            tag.remove();
            tagsDropdown.options.add(new Option(await this.translateComponent(`story-tag-${selectedTag.id}`, false, null), selectedTag.id), index);

            allTags = this.#postView.querySelectorAll('.story-tag');
            tagsAmount = allTags.length;

            // Change styling when the tags amount is under the maximum amount
            if (tagsAmount < 3) {
                tagsAdd.style.display = 'block';
                storyTagsContainer.classList.remove('max');
                tagsDropdown.classList.remove('rounded');
                tagsDropdown.classList.remove('disabled');

                if (tagsDropdown.value == "full") {
                    tagsDropdown.selectedIndex = 0;
                }
            }

            if (tagsAmount === 0) {
                storyTagsContainer.style.display = 'none';
            }

            // Sorts the options alphabetically on removal
            sortDropdownOptions(tagsDropdown);
        });

        // Append the remove button to the tag
        tag.appendChild(removeTag);

        storyTagsContainer.appendChild(tag);
        tagsDropdown.focus();

        // Finds the selected option and removes it from the option list
        const selectedOption = tagsDropdown.querySelector(`option[value="${selectedTag.id}"]`)
        selectedOption.remove();

        // Sort the tag options alphabetically
        sortDropdownOptions(tagsDropdown);

        allTags = this.#postView.querySelectorAll('.story-tag');
        tagsAmount = allTags.length;

        // Change styling when tags amount reaches the max
        if (tagsAmount >= 3) {
            tagsAdd.style.display = 'none';
            storyTagsContainer.classList.add('max');
            tagsDropdown.classList.add('rounded');
            tagsDropdown.value = "full";
            tagsDropdown.classList.add('disabled');
            return;
        }

        // Sort the tag options alphabetically by comparing the text
        function sortDropdownOptions() {
            const options = Array.from(tagsDropdown.options);

            // Sort the options based on their text and ignore case sensitivity
            options.sort((a, b) => a.text.localeCompare(b.text, undefined, { sensitivity: 'base' }));

            // Remove all the options from the dropdown
            tagsDropdown.innerHTML = '';

            // Add the sorted options back to the dropdown
            options.forEach(option => {
                // Add the option to the dropdown if it's not disabled or hidden
                if (!option.disabled && !option.hidden) {
                    tagsDropdown.add(option);
                }
            });

            // Add the disabled options to the bottom of the dropdown
            options.forEach(option => {
                if (option.disabled || option.hidden) {
                    tagsDropdown.add(option);
                }
            });
        }
    }

    // Saves all story data to the session
    async #saveStoryToSession() {
        // Retrieve story data from the function
        const { title, content, image, settings, tags, year } = await this.#getStoryData();

        // If the elements are not empty or the story is not saved, save to the session
        if ((title.trim().length > 0 || content.trim().length > 0 || image.trim().length > 0 || tags.length > 0) || !App.sessionManager.get("storySaved")) {
            const storyData = { title, content, image, settings, tags, year };
            App.sessionManager.set('storyData', JSON.stringify(storyData));
            App.sessionManager.set('storySaved', true);
            super.customAlert(null, await super.translateComponent("post-save-success"), "confirmation");
        } else {
            super.customAlert(null, await super.translateComponent("post-edit-nochanges"), "warning");
        }
    };

    // Fills all input fields in with the given storydata
    async #fillFields(storyData, type) {
        // Declares the variables and required functionals to load the existing image
        App.sessionManager.set("storySaved", true);
        const { updatePreview, clearImage } = this.#imgPreview(false);
        const inputFields = this.#postView.querySelectorAll('input');
        const storyTitle = this.#postView.querySelector('#story-title');
        const storyText = this.#postView.querySelector('.story-contentarea');
        const storyImage = this.#postView.querySelector('#story-img-preview');

        if (type == "edit") {
            // Changing the source of the preview to the existing story image
            storyImage.src = `${baseUrl}/uploads/story/${storyData.url}.jpg`;

            // Event listener to remove the image on error
            storyImage.addEventListener("error", () => { clearImage(true); }, { once: true });
        } else {
            // If there is no image in the story data, then the source of the image gets cleared.
            storyImage.src = storyData ? storyData.image || '' : '';
        }

        if (storyImage.getAttribute('src') && storyImage.getAttribute('src').trim() !== '') {
            updatePreview();
        } else {
            clearImage(true);
        }

        // Changing the title and content to the selected story
        storyTitle.value = storyData ? storyData.title || "" : "";
        storyText.innerHTML = storyData ? storyData.content || "" : "";

        // Changing the input fields (e.g. settings and year of origin) to match the story data
        if (storyData) {
            let settingData = type === "new" ? storyData.settings : storyData;

            inputFields.forEach(inputField => {
                if (inputField.value !== '') {
                    if (inputField.id === "story-year") {
                        inputField.value = storyData.year;
                    } else {
                        switch (inputField.value) {
                            case "anonymous":
                                inputField.checked = settingData.anonymous === 1;
                                break;
                            case "disable-comments":
                                inputField.checked = settingData.disable_comments === 1;
                                break;
                            case "disable-votes":
                                inputField.checked = settingData.disable_votes === 1;
                                break;
                            case "explicit":
                                inputField.checked = settingData.explicit === 1;
                                break;
                        }
                    }
                }
            });
        } else {
            inputFields.forEach(inputField => {
                if (inputField.type === "checkbox") {
                    inputField.checked = false;
                }
            });
        }

        if (storyData && storyData.tags.length > 0) {
            // Selecting the tags from the storydata
            const tagData = await this.#getTagData();
            let tags = [];

            if (type == "edit") {
                tags = storyData.tags.split(", ");
            } else if (type == "new") {
                // Adds the ID of every tag from the session data to the tags array
                tags = storyData.tags.map(tag => tag.id);
            }

            // Constructs all tags in the tags array
            for await (const tag of tags) {
                await this.#constructTag(tag, tagData);
            };
        } else {
            const tags = this.#postView.querySelectorAll('.story-tag');
            tags.forEach(tag => tag.querySelector('.remove').click());
        }
    }

    // Returns all current story data from the input fields.
    async #getStoryData() {
        let email = App.sessionManager.get("email");
        const year = this.#postView.querySelector('#story-year').value;
        const title = this.#postView.querySelector('#story-title').value;
        const content = this.#postView.querySelector('#story-content').innerHTML;
        let image = this.#postView.querySelector('#story-img-preview').getAttribute("src");
        const options = this.#postView.querySelectorAll('.story-settings-options input[type=checkbox]');
        const settings = {
            "anonymous": 0,
            "disable_comments": 0,
            "disable_votes": 0,
            "explicit": 0
        };
        let url;

        if (!email) {
            email = "community.florijn@gmail.com";
        };

        if (image.includes("error.svg")) {
            image = "";
        }

        if (window.location.hash.includes("edit")) {
            url = window.location.hash.split("#post/edit?id=")[1];
        } else {
            url = (Math.random() + 1).toString(36).substring(2).toUpperCase().slice(0, 10);
        }

        // Loop through each object in the options array
        for (let i = 0; i < options.length; i++) {
            const option = options[i];

            // Set the corresponding property in the settings object based on the name and checked values
            switch (option.value) {
                case "anonymous":
                    settings.anonymous = option.checked ? 1 : 0;
                    break;
                case "disable-comments":
                    settings.disable_comments = option.checked ? 1 : 0;
                    break;
                case "disable-votes":
                    settings.disable_votes = option.checked ? 1 : 0;
                    break;
                case "explicit":
                    settings.explicit = option.checked ? 1 : 0;
                    break;
            }
        }

        const tagOptions = this.#postView.querySelectorAll('.story-tag');
        const tagData = await this.#getTagData();
        let tags = [];

        tagOptions.forEach(tag => {
            const tagId = tag.id;
            tagData.forEach(tagDataItem => {
                if (parseInt(tagId) === tagDataItem.id) {
                    let tagItem = {
                        "name": tagDataItem.name,
                        "id": tagDataItem.id,
                    };
                    tags.push(tagItem)
                }
            });
        });

        return { email, year, title, content, image, settings, tags, url }
    }

    async #validateInputs() {
        // Variables to keep track off inputs with invalid values
        let emptyFields = [];
        let errors = 0;

        // Select the input fields
        const titleInput = this.#postView.querySelector("#story-title");
        const contentInput = this.#postView.querySelector("#story-content");
        const yearInput = this.#postView.querySelector("#story-year");
        const tagsInputs = this.#postView.querySelector(".story-tags-dropdown");
        const invalidInputs = this.#postView.querySelectorAll('.invalid');
        const maxChars = [100, 5000, 4];
        const translateComponent = async (key, defaultValue, overwrite) => { return await this.translateComponent(key, defaultValue, overwrite) };

        invalidInputs.forEach(input => {
            input.classList.remove('invalid');
        })

        // Check the maxChars for the input fields
        if (titleInput.value.length > maxChars[0]) {
            this.customAlert(null, `${await this.translateComponent("story-header-title")} ${await this.translateComponent("error-max-chars")}`);
            setTimeout(() => {
                titleInput.classList.add("invalid", "no-shake");
            }, 10);
        }

        if (contentInput.textContent.length > maxChars[1]) {
            this.customAlert(null, `${await this.translateComponent("story-header-content")} ${await this.translateComponent("error-max-chars")}`);
            setTimeout(() => {
                contentInput.classList.add("invalid", "no-shake");
            }, 10);
        }

        if (yearInput.value.length > maxChars[2]) {
            this.customAlert(null, `${await this.translateComponent("post-legend-2")} ${await this.translateComponent("error-max-chars")}`);
            setTimeout(() => {
                yearInput.classList.add("invalid", "no-shake");
            }, 10);
        }

        // Check the validity of the input fields by checking if their empty
        if (!titleInput || titleInput.value.trim() === '') {
            errors++;
            emptyFields.push(await this.translateComponent("story-header-title"));
            setTimeout(() => {
                titleInput.classList.add("invalid", "no-shake");
            }, 10);
        }

        if (!contentInput || contentInput.textContent.trim() === '') {
            errors++;
            emptyFields.push(await this.translateComponent("story-header-content"));
            setTimeout(() => {
                contentInput.classList.add("invalid", "no-shake");
            }, 10);
        }

        if (!yearInput || yearInput.value.trim() === '' || yearInput.value.length < 4) {
            errors++;
            emptyFields.push(await this.translateComponent("post-legend-2"));
            setTimeout(() => {
                yearInput.classList.add("invalid", "no-shake");
            }, 10);
        }

        // Checks for three tags
        const tags = this.#postView.querySelectorAll('.story-tag');
        if (!tags[0] || !tags[1] || !tags[2]) {
            errors++;
            emptyFields.push(await this.translateComponent("post-label-3"));
            setTimeout(() => {
                tagsInputs.classList.add("invalid", "no-shake");
                tagsInputs.parentElement.nextElementSibling.classList.add("invalid", "no-shake");
            }, 10);
        }

        // If there are any errors found, the error message function gets called and the customAlert's are shown
        if (errors > 0) {
            const invalidInputs = await groupInvalidInputs(emptyFields);

            if (invalidInputs) {
                if (errors === 1 && invalidInputs != await this.translateComponent("post-label-3")) {
                    this.customAlert(null, `${invalidInputs} ${await this.translateComponent("error-required-single")}`);
                } else {
                    this.customAlert(null, `${invalidInputs} ${await this.translateComponent("error-required-multiple")}`);
                }
            }

            return false;
        }

        async function groupInvalidInputs(invalidInputs) {
            // Map each invalid input field to its name
            const fieldNames = invalidInputs.map(fieldName => {
                return fieldName;
            });
            const join = await translateComponent("error-required-join");

            // Generate the error message based on the number of invalid fields
            if (fieldNames.length > 2) {
                const lastFieldName = fieldNames.pop();
                const firstFieldName = fieldNames[0];
                const otherFieldNames = fieldNames.slice(1).map(fieldName => fieldName.toLowerCase());
                return `${firstFieldName}, ${otherFieldNames.join(', ')} ${join} ${lastFieldName.toLowerCase()}`; // Combine field names with commas and add "EN" before the last field
            } else if (fieldNames.length === 2) {
                return `${fieldNames[0]} ${join} ${fieldNames[1].toLowerCase()}`; // Return two field names separated by "EN"
            } else {
                return fieldNames[0]; // Return the single field name
            }
        }

        return true;
    }


    /**
     * Validates input values and posts the story
     */
    #postButton() {

        let submitButton = this.#postView.querySelector('#button-post');
        let cancelButton = this.#postView.querySelector('#button-cancel');
        let saveButton = this.#postView.querySelector('#button-save');
        let type;

        // Changes functionality depending on the type in the hash (e.g. edit or new)
        if (window.location.hash.includes("new")) {
            type = "new";
            saveButton.addEventListener("click", () => { this.#saveStoryToSession(); });
        } else if (window.location.hash.includes("edit")) {
            type = "edit";
            saveButton.style.display = "none";
            saveButton.classList.add = "disabled";
            saveButton.remove();
            submitButton.id = "button-save-edit";
            submitButton.setAttribute("data-translate", "post-save-button");
            submitButton.textContent = "Opslaan";
            submitButton = this.#postView.querySelector('#button-save-edit');
        }

        // Handles the cancel button
        cancelButton.addEventListener("click", async () => {
            if (type == "new") {
                if (App.sessionManager.get("storyData") || !App.sessionManager.get("storySaved")) {
                    const clearStory = await super.customAlert(await super.translateComponent("post-delete-header"), await super.translateComponent("post-delete-message"), "choice");
                    if (clearStory) {
                        super.customAlert(null, await super.translateComponent("post-delete-success"), "confirmation");
                        this.#fillFields(null, "new");
                        App.sessionManager.remove("storyData");
                        App.sessionManager.set("storySaved", true);
                    }
                } else {
                    window.location.href = "#home";
                }
            } else if (type == "edit") {
                history.back();
            }
        })

        // Listens to the post story button and validates inputs before posting the story
        submitButton.addEventListener("click", async () => {

            // Validating all input fields
            const allFieldsValid = await this.#validateInputs();

            if (!allFieldsValid) return;

            // Retrieving all story data
            const { email, year, title, content, image, settings, tags, url } = await this.#getStoryData();

            if (document.querySelector('.alert-container')) {
                document.querySelector('.alert-container').remove();
            }

            if (image) {
                // If an image is found an the source does not match the storyUrl, trigger new file upload
                if (!image.includes(url)) {
                    const dataURLtoBlob = (dataURL) => {
                        const arr = dataURL.split(',');
                        const mime = arr[0].match(/:(.*?);/)[1];
                        const bstr = atob(arr[1]);
                        let n = bstr.length;
                        const u8arr = new Uint8Array(n);
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        return new Blob([u8arr], { type: mime });
                    };

                    const imageBlob = dataURLtoBlob(image);
                    const formData = new FormData();
                    formData.append("upload-file", imageBlob, "image.png");
                    formData.append('location', "story");
                    formData.append("fileName", url);

                    // Uploading the image to the uploads folder using the fileRepository
                    await this.#fileRepository.upload(formData);
                }
            } else if (type == "edit") this.#fileRepository.delete("story", url);

            // Disables the post button, to prevent double posting by spamming the post button
            this.#postView.querySelector('.main-buttons').firstElementChild.classList.add("disabled");
            document.body.style.cursor = "wait";

            // Posting or saving the story through the sendQuery function
            const storyRequest = await this.#sendQuery(
                type,
                email,
                title,
                content,
                url,
                settings.anonymous,
                settings.disable_comments,
                settings.disable_votes,
                settings.explicit,
                tags[0].id,
                tags[1].id,
                tags[2].id,
                year
            );

            // Re-enabling the post button after the story has been posted
            this.#postView.querySelector('.main-buttons').firstElementChild.classList.remove("disabled");
            document.body.style.cursor = "unset";

            // If story posting failed return and show error alert
            if (!storyRequest) {
                this.customAlert(null, this.translateComponent("settings-save-error-message"), "error");
                return
            };

            if (type == "new") {
                // Credits & Achievement Handling
                await super.updateCredits(email, "Story", false, false);
                super.registerAchievement("01", email);

                // Checks the word count of the story, 
                // by first replacing multiple whitespace with singular spaces, 
                // then trimming the result, and finally splitting the array at each space
                const rawStoryContent = this.#postView.querySelector("#story-content").textContent.replace(/\s+/g, ' ').trim().split(" ");

                // The word count is the length of the array of words in the story
                const wordCount = rawStoryContent.length;

                if (wordCount > achievementThresholds.STORY_WORD) await super.registerAchievement("08", email);

                App.sessionManager.remove("storyData");
                App.sessionManager.remove("storySaved");
                this.customAlert(await super.translateComponent("post-save-success-header"), await super.translateComponent("post-save-success-new"), "confirmation");
                window.location.replace(`/#story-read/${url}`);

            } else if (type == "edit") {
                const redirect = await this.customAlert(await super.translateComponent("post-save-success-header"), await super.translateComponent("post-save-success-edit"), "yesno");
                if (redirect) window.location.replace(`/#story-read/${url}`);
            };
        });
    };

    /**
     * Initializes the richtextbuttons and makes them functional
     */
    async #richtext() {
        // Defines the paste event listener
        async function handlePaste(event) {
            event.preventDefault();
            const text = event.clipboardData.getData("text/plain");
            const cleanedText = text.replace(/<[^>]*>/g, '');

            // Get the current length of the contenteditable div
            const currentLength = textarea.textContent.length;

            // If the pasted text will exceed the maximum length, prevent pasting
            if (currentLength + cleanedText.length > maxChars) {
                this.customAlert(null, await this.translateComponent("post-max-length-error"));
                return;
            }

            // Otherwise, allow pasting the cleaned text
            const html = cleanedText.replace(/\n/g, '<br>');
            document.execCommand('insertHTML', false, html);
        }

        const richTextButtons = this.#postView.querySelectorAll('.richtext-button:not(.add)');
        const textarea = document.querySelector('.story-contentarea');
        const maxChars = 5000;

        // Add the event listener function to the event listener
        textarea.addEventListener("paste", handlePaste.bind(this));

        textarea.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                document.execCommand('insertHTML', false, '<br></br>');
            }
        });

        // Add event listeners to the buttons
        richTextButtons.forEach(button => {
            button.addEventListener('click', async () => {
                textarea.focus();

                const command = button.dataset.element;
                if (command === 'createLink') {
                    let url = prompt(await super.translateComponent("post-add-link-prompt"));
                    if (url) {
                        if (!url.startsWith('https://') && !url.startsWith('http://')) {
                            url = 'https://' + url;
                        }
                        const selection = document.getSelection().toString();
                        if (selection) document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${selection}</a>`);
                        else document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${url.replace("https://", "")}</a>`)
                    }
                } else if (command === 'bold') document.execCommand('bold');
                else if (command === 'italic') document.execCommand('italic');
                else if (command === 'underline') document.execCommand('underline');
                else if (command === 'strikethrough') document.execCommand('strikeThrough');
            });
        });
    }
}