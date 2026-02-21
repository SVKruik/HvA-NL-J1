import { App } from "../app.js";
import { SettingsRepository } from "../repositories/settingsRepository.js";
import * as userCredits from "../framework/utils/userCreditHelper.js";
import * as achievementThresholds from "../framework/utils/achievementThresholdHelper.js";


/**
 * Base controller with helper functions, mostly to load html into a given container
 *
 * @author Pim Meijer, Donovan Tjokrodimedjo & Stefan Kruik
 */
export class Controller {
    #contentViewHtml;
    #navigationViewHtml;
    #footerViewHtml;
    #settingsRepository;

    constructor() {
        // Within the templateContent the HTML will be loaded
        this.#contentViewHtml = document.querySelector(".content");
        this.#navigationViewHtml = document.querySelector(".navigation");
        this.#footerViewHtml = document.querySelector(".footer");
        this.#settingsRepository = new SettingsRepository();
    };

    /**
     * Load an html file specifically into .navigation of index.html
     * @param htmlFile - path to html file
     * @returns {Promise<*>}
     */
    async loadHtmlIntoNavigation(htmlFile) {
        return await this.#fetchHtmlView(htmlFile, 1);
    };

    /**
     * Load an html file specifically into .content of index.html
     * @param htmlFile - path to html file
     * @returns {Promise<*>}
     */
    async loadHtmlIntoContent(htmlFile) {
        return await this.#fetchHtmlView(htmlFile, -1);
    };

    /**
     * Load an html file specifically into .navigation of index.html
     * @param htmlFile - path to html file
     * @returns {Promise<*>}
     */
    async LoadHtmlIntoFooter(htmlFile) {
        return await this.#fetchHtmlView(htmlFile, 2);
    };

    /**
     * Load an html file into custom given DOM element
     * @param htmlFile - path to html file
     * @param element - DOM element to load the content of file into
     * @returns {Promise<*>}
     */
    async loadHtmlIntoCustomElement(htmlFile, element) {
        return await this.#fetchHtmlView(htmlFile, -1, element);
    };

    /**
     * Private helper function to load HTML, children can simply call super.fetchHtmlView and pass the path of the HTML file
     * HTML will be loaded into .content of the index.html
     * @param htmlFile - path to html file
     * @param loadIntoNavigation - whether the passed html file should be loaded into the .navigation div instead of .content
     * @param customElement - DOM element to load HTML file into, optional param
     * @returns {Promise<void>}
     * @async
     * @private
     */
    async #fetchHtmlView(htmlFile, loadLocation, customElement) {
        let loadInto = undefined;
        if (loadLocation === 1) {
            loadInto = this.#navigationViewHtml;
        } else if (loadLocation === 2) {
            loadInto = this.#footerViewHtml;
        } else {
            loadInto = this.#contentViewHtml;
        };

        // If a HTML DOM element to load the content into is passed, load it into there and give that back
        if (customElement instanceof Element) {
            console.log("Loaded html into custom element instead of index.html.");
            loadInto = customElement;
        };

        try {
            const response = await fetch(htmlFile);

            if (response.ok) {
                // Clear html and load htmlData from file
                loadInto.innerHTML = await response.text();
            } else {
                console.error(response.statusText);
                loadInto.innerHTML = "<p>Failed to load HTML file.</p>";
            };
        } catch (e) {
            console.error(e);
            loadInto.innerHTML = "<p>Failed to load HTML file.</p>";
        };

        return loadInto;
    };

    /**
     * Controller for max input length.
     * @param {Array} event - Keydown event.
     * @param {Element} input - Input element.
     * @param {Element} display - Display count element.
     * @param {number} warningThreshold - What character count to highlight with warning count.
     * @param {string} fontColor - Font color of the display. Choose a variable declared in the default.css.
     * @returns - Returns on wrong key.
     * @private
     */
    async commentInputController(event, input, display, warningThreshold, fontColor) {
        // Input Checks
        if (event.key === "Backspace" && input.value === "") return;
        if (event.key === "Shift" || event.key === "Alt" || event.key === "Control") return;
        if (event.key === "Enter" && input.value.length === 0) return;
        if (input.maxLength - input.value.length == 0 && event.key !== "Backspace") return;

        // Reset Warning Borders
        input.style.border = "1px solid var(--gray)";

        // Increment / Reduce Counter
        let remaining;
        if (event.key === "Backspace") {
            remaining = input.maxLength - input.value.length + 1;
        } else remaining = input.maxLength - input.value.length - 1
        if (event.clipboardData) {
            const pasteData = event.clipboardData.getData("text");
            remaining -= pasteData.length - 1;
        };

        // User Warnings
        if (remaining < warningThreshold) display.style.color = "var(--warning)";
        if (remaining === 0) display.style.color = "var(--error)";
        if (remaining > (warningThreshold - 1)) display.style.color = `var(--${fontColor})`;

        // Character Counter
        display.innerHTML = `${remaining} ${await this.translateComponent("input-remaining-chars")}`;
    };


    /**
    * Creates a popup message in the upper right corner of the screen with a specified title, content, type, and time delay. 
    * @param {string} title - The title of the popup message.
    * @param {string} content - The content of the popup message.
    * @param {string} type - The type of popup message. Choose from 'error', 'warning', 'confirmation', 'achievement' & 'info'.
    * @param {number} time - The time delay, in milliseconds, before the popup message is automatically removed. 
    * @default Alert time 3000 milliseconds (3 seconds)
    * @default Alert type 'error'.
    */
    async customAlert(title, content, type, time, stackable) {
        return new Promise(async (resolve, reject) => {
            let alertContainer = document.querySelector(".alert-container");

            // If the alert container is not present, add the alert container
            if (!alertContainer) {
                alertContainer = document.createElement('section');
                alertContainer.classList.add('alert-container');
            }

            // Construction of the alertbox
            const alertBox = document.createElement('div');
            alertBox.classList.add('alert-box');
            alertBox.classList.add('popup-animation');

            const alertWrapper = document.createElement('section');
            alertWrapper.classList.add('alert-wrapper');

            const alertContent = document.createElement('section');
            alertContent.classList.add('alert-content');

            const alertTitle = document.createElement('h5');
            alertTitle.classList.add('alert-title');

            const alertText = document.createElement('p');
            alertText.classList.add('alert-text');
            alertText.textContent = content;

            const alertGraphic = document.createElement('i');
            alertGraphic.classList.add('alert-graphic');

            const alertClose = document.createElement('i');
            alertClose.classList.add('alert-close', 'fa-solid', 'fa-xmark');
            alertClose.addEventListener("click", () => {
                resolve(false);
                removePopup(0);
            });

            const alertButtons = document.createElement('section');
            alertButtons.classList.add('alert-buttons');

            // Switch between the different types of alerts
            switch (type) {
                case "error":
                    alertGraphic.classList.add("fa-solid", "fa-circle-exclamation");
                    title = title || await this.translateComponent("custom-alert-error-title");
                    break;
                case "warning":
                    alertGraphic.classList.add("fa-solid", "fa-triangle-exclamation");
                    title = title || await this.translateComponent("custom-alert-warning-title");
                    break;
                case "confirmation":
                    alertGraphic.classList.add("fa-solid", "fa-circle-check");
                    title = title || await this.translateComponent("custom-alert-confirmation-title");
                    break;
                case "achievement":
                    alertGraphic.classList.add("fa-solid", "fa-trophy");
                    title = title || await this.translateComponent("custom-alert-achievement-title");
                    break;
                case "info":
                    alertGraphic.classList.add("fa-solid", "fa-circle-info");
                    title = title || await this.translateComponent("custom-alert-info-title");
                    break;
                case "yesno":
                case "choice":
                    alertGraphic.classList.add("bi", "bi-question-circle-fill");
                    title = title || await this.translateComponent("custom-alert-choice-title");

                    const alertConfirm = document.createElement('button');
                    alertConfirm.classList.add('alert-button', 'alert-confirm', 'inverted');
                    alertConfirm.textContent = await this.translateComponent("custom-alert-choice-1");
                    alertConfirm.addEventListener("click", () => {
                        resolve(true);
                        removePopup(0);
                    });

                    const alertCancel = document.createElement('button');
                    alertCancel.classList.add('alert-button', 'alert-cancel');
                    alertCancel.textContent = await this.translateComponent("custom-alert-choice-2");
                    alertCancel.addEventListener("click", () => {
                        resolve(false);
                        removePopup(0);
                    });

                    if (type == "yesno") {
                        alertConfirm.textContent = await this.translateComponent("custom-alert-yesno-1");
                        alertCancel.textContent = await this.translateComponent("custom-alert-yesno-2");
                    }

                    alertButtons.appendChild(alertConfirm);
                    alertButtons.appendChild(alertCancel);

                    break;
                case "input":
                    alertGraphic.classList.add("fa-solid", "fa-pen");
                    alertTitle.textContent = title || await this.translateComponent("custom-alert-input-title");

                    const inputField = document.createElement('input');
                    inputField.classList.add('alert-input');
                    inputField.setAttribute('type', 'text');
                    inputField.setAttribute('placeholder', `${await this.translateComponent("custom-alert-input-placeholder")}`);

                    const inputSubmit = document.createElement('button');
                    inputSubmit.classList.add('alert-button', `${await this.translateComponent("custom-alert-input-submit")}`);
                    inputSubmit.textContent = "Verzenden";
                    inputSubmit.addEventListener("click", () => {
                        const input = inputField.value.trim();
                        if (input !== '') {
                            resolve(input);
                            removePopup(0);
                        }
                    });

                    alertContent.appendChild(inputField);
                    alertContent.appendChild(inputSubmit);

                    break;
                default:
                    alertGraphic.classList.add("fa-solid", "fa-circle-exclamation");
                    title = title || await this.translateComponent("custom-alert-error-title");
                    break;
            };

            // Adds all content tot the alert popup
            alertTitle.textContent = title;

            alertContent.prepend(alertButtons);
            alertContent.prepend(alertText);
            alertContent.prepend(alertTitle);

            alertWrapper.appendChild(alertGraphic);
            alertWrapper.appendChild(alertContent);
            alertWrapper.appendChild(alertClose);

            alertBox.appendChild(alertWrapper);

            // If the alert container is not present in the body, append the alertcontainer to the body
            if (!document.body.contains(alertContainer)) {
                document.body.appendChild(alertContainer);
            } else if (!stackable) {
                // Else check if the alert is already shown, if that is the case return and don't show the alert again.
                let currentAlerts = alertContainer.children;
                for (let i = 0; i < currentAlerts.length; i++) {
                    const element = currentAlerts[i];
                    if (element.firstChild.childNodes[1].childNodes[0].textContent === title && element.firstChild.childNodes[1].childNodes[1].textContent === content ||
                        element.firstChild.childNodes[1].childNodes[0].textContent === null && title == null ||
                        element.firstChild.childNodes[1].childNodes[1].textContent === null && content == null) {
                        resolve(false);
                        return;
                    };
                };
            };

            // Appends the alert to the alert container
            alertContainer.appendChild(alertBox);

            const exceptions = ["choice", "input", "yesno"];

            // If the alert type is choice or input, the alert does not go away after 5 seconds, but after the user has interacted with the popup.
            if (!exceptions.includes(type)) {
                removePopup(time || 5000);
                resolve(true);
            } else if (time) {
                removePopup(time);
                resolve(false);
            }

            // Adds the remove animation, and removes the element from the body after 5 seconds or the given time
            function removePopup(time) {
                setTimeout(() => {
                    alertBox.classList.add('remove-animation');
                    setTimeout(() => {
                        if (alertContainer.contains(alertBox)) {
                            alertContainer.removeChild(alertBox);
                        };
                    }, 500);
                }, time)
            };
        })
    }

    /**
     * Function that removes all active custom alerts currently showing.
     */
    removeAllAlerts(instant) {
        const alertContainer = document.querySelector(".alert-container");
        if (alertContainer) {
            const alerts = alertContainer.querySelectorAll('.alert-box');
            for (const alertBox of alerts) {
                alertBox.classList.add('remove-animation');
                setTimeout(() => {
                    if (alertContainer.contains(alertBox)) {
                        alertContainer.removeChild(alertBox);
                    }
                }, instant ? 0 : 500);
            }
        }
    };

    /**
     * Calculate age of a user.
     * @param {date} dateString - Input date.
     * @returns 
     */
    getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    /**
     * Create a placeholder if there are no search results.
     * Used for the timeline and story view.
     * @param {string} displayTitle - The text for the placeholder.
     * @param {string} displayImage - The image from the SVG folder.
     * @param {string} classLocation - Where to append to. Classname of the parent.
     */
    createStoryPlaceholder(displayTitle, displayImage, classLocation) {
        // Children
        const titleContent = displayTitle;
        const title = document.createElement('h4');
        title.innerHTML = titleContent;
        const image = document.createElement('img');
        image.src = `${baseUrl}/assets/img/svg/${displayImage}.svg`;

        // Parent
        const container = document.createElement('div');
        container.className = "story-placeholder";
        container.appendChild(title);
        container.appendChild(image);

        // Append
        document.getElementsByClassName(`${classLocation}`)[0].appendChild(container);
    };

    /**
     * Format input number to add k if it's large enough.
     * @param {number} number - The number to format.
     * @returns - The input number formatted with 'K'.
     * @private
     */
    numberFormat(number) {
        if (number < 1e3) return number;
        if (number >= 1e3) return +(number / 1e3).toFixed(1) + "K";
    };

    /**
     * Register an achievement against the database.
     * Automatically checks if the user already earned
     * the targeted achievement, and adds it if needed.
     * @param {string} achievementId - ID of the achievement.
     * @param {string} email - Email of the user.
     * @returns - Console on error or true on succes.
     * @example registerAchievement("04", "a.example.com");
     * @example registerAchievement("10", "b.example.com");
     */
    async registerAchievement(achievementId, email) {
        if (!App.sessionManager.get("email")) return;
        if (!/^(?:0[1-9]|10)$/.test(achievementId)) {
            return console.error("Invalid Achievement ID Provided. Check the examples to see correct usage.");
        };

        const achievementCredits = userCredits[`CREDIT_ACHIEVEMENT_${achievementId}`];

        if (!Object.values((await this.#settingsRepository.getAchievement(email, achievementId)).result[3][0])[0]) {
            const data = await this.#settingsRepository.setAchievement(email, achievementId);
            if (data.result[3].affectedRows) {
                // Alert
                if (email === App.sessionManager.get("email")) {
                    this.customAlert(
                        null,
                        `${await this.translateComponent("profile-achievement-acquired")}: ${await this.translateComponent(`profile-achievement-${achievementId}-title`, false, null)}.`,
                        "achievement",
                        null
                    );
                };

                // Credits
                this.updateCredits(email, "Achievement", false, achievementCredits);
                return true;
            }
        } else return true;
    };

    /**
     * Create and append the HTML for a story.
     * @param {object} storyData - Queried story data.
     * @param {object} tagData - The tagdata from a separate query.
     * @param {boolean} - If the story that is being constructed is the current SotW.
     * @async
     */
    async constructStory(storyData, tagData, SotWBoolean) {
        // Constructing Parents
        const host = document.getElementsByClassName("story-container")[0];
        const containerWrapper = document.createElement('div');
        containerWrapper.className = "story-item-wrapper";
        containerWrapper.id = `anchor-${storyData.url}`;
        const container = document.createElement('div');
        container.className = "story-item";
        if (SotWBoolean) container.style.border = "2px solid #F2D388";

        // Image
        const imageContainer = document.createElement('div');
        imageContainer.className = "story-image-container";
        const image = document.createElement('img');
        image.className = "story-image";
        image.src = `${baseUrl}/uploads/story/${storyData.url}.jpg`;
        image.addEventListener('click', async () => {
            window.location.href = `${baseUrl}/#story-read/${storyData.url}`;
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
        image.addEventListener('error', () => {
            image.src = `${baseUrl}/assets/img/background/error.svg`;
            image.style.filter = 'brightness(50%)';
        });
        if (storyData.explicit === 1) {
            // Configuration
            const blurAmount = 10;
            const delayTimer = 5000;
            App.sessionManager.set("blurImageHover", false);
            image.style.filter = `blur(${blurAmount}px)`;

            // Blur Toggle Button
            const blurToggle = document.createElement("button");
            blurToggle.className = "blur-toggle";
            blurToggle.innerHTML = "<i class='fa-solid fa-eye'></i>";

            // Toggle Mechanic
            blurToggle.addEventListener("click", () => {
                if (blurToggle.classList.contains("active")) {
                    image.style.filter = `blur(${blurAmount}px)`;
                    blurToggle.innerHTML = "<i class='fa-solid fa-eye'></i>";
                    blurToggle.classList.remove("active");
                } else {
                    image.style.filter = "blur(0px)";
                    blurToggle.innerHTML = "<i class='fa-solid fa-eye-slash'></i>";
                    blurToggle.classList.add("active");
                };
            });

            // Automatic Blurring
            imageContainer.addEventListener("mouseenter", () => {
                App.sessionManager.set("blurImageHover", true);
            });
            imageContainer.addEventListener("mouseleave", () => {
                App.sessionManager.set("blurImageHover", false);
                setTimeout(() => {
                    if (!App.sessionManager.get("blurImageHover")) {
                        image.style.filter = `blur(${blurAmount}px)`;
                        blurToggle.innerHTML = "<i class='fa-solid fa-eye'></i>";
                        blurToggle.classList.remove("active");
                    };
                }, delayTimer);
            });

            imageContainer.appendChild(blurToggle);
        };
        imageContainer.appendChild(image);

        // Top Content
        const contentTopContainer = document.createElement('div');
        contentTopContainer.className = "story-content-container";
        const contentTopSubContainer = document.createElement('div');
        contentTopSubContainer.className = "story-info-container";

        // Title
        const titleContainer = document.createElement('div');
        titleContainer.className = "story-title-container";
        const title = document.createElement('h4');
        title.className = "story-title";
        title.innerHTML = storyData.title;
        const description = document.createElement('h6');
        description.className = "story-description";
        description.innerHTML = storyData.content.slice(0, 150);
        titleContainer.appendChild(title);
        titleContainer.appendChild(description);
        titleContainer.addEventListener('click', async () => {
            window.location.href = `${baseUrl}/#story-read/${storyData.url}`;
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });

        // Date
        const dateContainer = document.createElement('div');
        dateContainer.className = "story-date-container";
        const date = document.createElement('p');
        date.className = "story-date";
        date.addEventListener('click', async () => {
            window.location.href = `${baseUrl}/#story-read/${storyData.url}`;
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
        date.innerHTML = await this.dateFormat(storyData.date, "long");
        dateContainer.appendChild(date);

        // Top Content Container + Author seperate
        contentTopSubContainer.appendChild(titleContainer);
        contentTopContainer.appendChild(contentTopSubContainer);
        contentTopContainer.appendChild(dateContainer);

        // Author
        const authorContainer = document.createElement('a');
        authorContainer.className = "story-author-container";

        const authorImage = document.createElement('img');
        authorImage.className = "story-author-image";
        authorImage.src = `${baseUrl}/uploads/profile/${storyData.user_name}.jpg`;

        let authorUsername;
        if (storyData.anonymous === 0 && storyData.user_type !== 2) {
            authorUsername = storyData.user_name;
        } else if (storyData.anonymous === 1 && storyData.user_type !== 2) {
            authorUsername = await this.translateComponent("user-1");
        } else if (storyData.user_type === 2) {
            authorUsername = await this.translateComponent("user-2");
            authorImage.src = `${baseUrl}/assets/img/icons/default.svg`;
        };

        authorImage.addEventListener("error", () => {
            authorImage.src = `${baseUrl}/assets/img/icons/default.svg`;
        }, { once: true });

        if (storyData.anonymous > 0) authorImage.src = `${baseUrl}/assets/img/icons/default.svg`;

        const authorName = document.createElement('p');
        authorName.className = "story-author-name";
        authorName.innerHTML = authorUsername;

        if (storyData.anonymous === 0 && storyData.user_type !== 2) {
            authorContainer.setAttribute("href", `#profile/${storyData.user_name}`);
        } else authorContainer.style.cursor = "default";

        authorContainer.appendChild(authorImage);
        authorContainer.appendChild(authorName);
        contentTopSubContainer.appendChild(authorContainer);

        // Bottom Content
        const statisticContainer = document.createElement('div');
        statisticContainer.className = "story-stat-container";

        // Tags
        const tagContainer = document.createElement('div');
        tagContainer.className = "story-tag-container";
        statisticContainer.appendChild(tagContainer);

        for (let i = 0; i < tagData.tagNames.length; i++) {
            const tagId = tagData.tagId[i];
            const tagContent = await this.translateComponent(`story-tag-${tagId}`);
            this.createTag(tagContent, tagId, tagContainer);
        };

        // Statistics
        const statContainer = document.createElement('div');
        statContainer.className = "story-vtcm-container";
        const statSplitter = document.createElement('div');
        statSplitter.className = "story-stat-splitter";
        statContainer.appendChild(statSplitter);
        if (tagData.tagNames.length === 0) statSplitter.style.display = "none";
        if (storyData.disable_votes < 1) {
            const voteContainer = document.createElement('div');
            voteContainer.className = "story-vote-container";
            const votes = document.createElement('p');
            votes.className = "story-votes";
            votes.innerHTML = this.numberFormat(storyData.likes) || 0;
            const voteIcon = document.createElement('i');
            voteIcon.className = "fa-solid fa-heart";
            voteContainer.appendChild(votes);
            voteContainer.appendChild(voteIcon);
            statContainer.appendChild(voteContainer);
        };

        if (storyData.disable_comments < 1) {
            const commentContainer = document.createElement('div');
            commentContainer.className = "story-comment-container";
            commentContainer.addEventListener('click', async () => {
                window.location.href = `${baseUrl}/#story-read/${storyData.url}`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });

            const comments = document.createElement('p');
            comments.className = "story-comments";
            comments.innerHTML = this.numberFormat(storyData.comments);
            const commentIcon = document.createElement('i');
            commentIcon.className = "fa-solid fa-comment";
            commentContainer.appendChild(comments);
            commentContainer.appendChild(commentIcon);
            statContainer.appendChild(commentContainer);
        };
        if (storyData.disable_votes > 0 && storyData.disable_comments > 0) statSplitter.style.display = "none";

        // Modifiers
        const modifierHost = document.createElement('div');
        modifierHost.className = "story-modifier-container";
        if (storyData.verified > 0 || storyData.likes >= achievementThresholds.STORY_VERIFY) this.createModifier("Verified", modifierHost);
        if (storyData.explicit > 0) this.createModifier("Explicit", modifierHost);

        const statisticContainerParent = document.createElement('div');
        statisticContainerParent.className = "statistics-container-parent";
        statisticContainer.appendChild(statContainer);
        statisticContainerParent.appendChild(statisticContainer);
        statisticContainerParent.appendChild(modifierHost);

        // Combine and append
        container.appendChild(imageContainer)
        container.appendChild(contentTopContainer);
        container.appendChild(statisticContainerParent);
        containerWrapper.appendChild(container);
        if (host) host.appendChild(containerWrapper)
    };

    /**
     * Story modifier constructor.
     * Creates and appends a modifier at the specified host.
     * @param {string} type - Type of modifier. Choose from 'Verified', 'Explicit' and 'Edited'. This will automatically determine the color.
     * @param {Element} host - Where to append to.
     */
    async createModifier(type, host) {
        // Validation
        const validTypes = ["Verified", "Explicit", "Edited"];
        if (validTypes.indexOf(type) === -1) return console.error("Incorrect type provided.");

        // Configuration
        let color = "000000";
        let content = "X";
        let tooltipText = "X";
        if (type === validTypes[0]) {
            color = "709FB0";
            content = "V";
            tooltipText = await this.translateComponent("modifier-verified");
        } else if (type === validTypes[1]) {
            color = "9D5353";
            content = "E";
            tooltipText = await this.translateComponent("modifier-explicit");
        } else if (type === validTypes[2]) {
            color = "008080";
            content = "B";
            tooltipText = await this.translateComponent("modifier-edited");
        };

        // Content - Tooltip
        const tooltip = document.createElement('span');
        tooltip.innerHTML = tooltipText;
        tooltip.className = "tooltip-text";
        tooltip.style.backgroundColor = `#${color}`;

        // Container
        const modifierContainer = document.createElement('div');
        modifierContainer.className = "story-modifier tooltip";
        modifierContainer.style.backgroundColor = `#${color}`;
        modifierContainer.addEventListener("click", async () => {
            if (type === validTypes[0]) {
                this.customAlert(null, await this.translateComponent("story-read-date-alert-1"), "info", null)
            } else if (type === validTypes[1]) {
                this.customAlert(null, await this.translateComponent("story-read-date-alert-2"), "info", null)
            };
        });
        modifierContainer.addEventListener("mouseenter", () => {
            tooltip.style.display = "block";
        });
        modifierContainer.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });

        // Content
        const modifierContent = document.createElement('p');
        modifierContent.className = "story-modifier-content";
        modifierContent.innerHTML = content;

        // Append
        modifierContainer.appendChild(modifierContent);
        modifierContainer.appendChild(tooltip);
        host.appendChild(modifierContainer);
        return modifierContainer;
    };

    /**
     * Tag constructor.
     * Creates and appends a tag at the specified host.
     * @param {string} name - Text in te tag.
     * @param {number} id - ID of the tag.
     * @param {Element} host - Where to append to.
     */
    createTag(content, id, host) {
        const tagBody = document.createElement('div');
        tagBody.className = "story-tag";
        tagBody.style.backgroundColor = `var(--tag-color-${id})`;
        const tagName = document.createElement('p');
        tagName.className = "story-tag-name";
        tagName.innerHTML = content;
        tagBody.appendChild(tagName);
        host.appendChild(tagBody);
    };

    /**
     * Simple retrieval of the valid locales.
     * @returns - The list of current valid locales.
     */
    getValidLocales() {
        return ["ru-RU", "en-US", "nl-NL", "es-ES", "zh-CN", "pt-PT", "fr-FR", "de-DE", "ja-JP", "ar-MA"];
    };

    /**
     * Load all the translations into the view, overwriting the current text.
     * This will only overwrite the HTML elements, not  the JavaScript constructed elements.
     * @param {boolean} allowDefault - Set this to true if you are overwriting HTML (e.g. placeholder inputs or H1). Set it to false if you have a backup-value (||), and it's a pure JavaScript generated component. For example: `await ..("Value", false) || "Backup"`.
     * @param {string} view - The view that called this function. For example: 'Profile' or 'Login'.
     * @returns - On error
     */
    translateView(allowDefault, view) {
        const validLocales = this.getValidLocales();
        const sessionLanguage = App.sessionManager.get("viewLanguage");
        const targetLanguage = sessionLanguage || "nl-NL";
        if (validLocales.indexOf(targetLanguage) === -1 || !allowDefault) return;
        const languageFile = `assets/locales/${targetLanguage}.json`;
        console.log(`Language loaded: ${targetLanguage}@${view || "View"}`);
        fetch(languageFile)
            .then(response => response.json())
            .then(data => {
                if (data.reason) return "Error while loading translation" + data.reason;
                document.querySelectorAll("[data-translate]").forEach(element => {
                    const key = element.getAttribute("data-translate");
                    if (element.tagName === "INPUT") {
                        element.placeholder = data[key];
                    } else element.textContent = data[key];
                });
                if (targetLanguage === "ar-MA") document.getElementsByClassName("page-title")[0].style.alignItems = "flex-end";
            }).catch(error => {
                return "Error while loading translation - " + error;
            });
    };

    /**
     * Get a specific translation of a key.
     * @param {string} key - The specific JSON key to return the value of.
     * @param {string} overwriteLanguage - Overwrite the session with a language. Forces the system to use the specified language.
     * @returns - On error or the value of the key.
     */
    async translateComponent(key, overwriteLanguage) {
        const validLocales = this.getValidLocales();
        const sessionLanguage = App.sessionManager.get("viewLanguage");
        const targetLanguage = overwriteLanguage || sessionLanguage || "nl-NL";

        if (validLocales.indexOf(targetLanguage) === -1) return;

        const languageFile = `assets/locales/${targetLanguage}.json`;
        let value;

        try {
            const response = await fetch(languageFile);
            const data = await response.json();

            if (data.reason) return "Error while loading translation" + data.reason;
            value = data[key];
        } catch (error) {
            return "Error while loading translation - " + error;
        };

        if (!value) {
            console.log(`404 Not Found - Check if this JSON key exists: ${key}`);
            return undefined;
        };

        return value;
    };

    /**
     * Formats input date to a string. Automatically looks at the session to see what language to format.
     * Example output: May 3, 2023 at 6:08 AM (EN@long) / May 3, 2023 (EN@short).
     * @param {Date} date - The input date in the DATETIME format.
     * @param {string} length - Short form or long form output. See the example output.
     * @returns - The formatted date in the selected length.
     */
    async dateFormat(date, length) {
        const dateRaw = new Date(date);
        let options;
        if (length === "long") {
            options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        } else if (length === "short") {
            options = { day: "numeric", month: "long", year: "numeric" };
        } else return "Wrong 'length' keyword provided. Check the JSDoc.";
        const timeZoneOffset = dateRaw.getTimezoneOffset() / 60;
        dateRaw.setHours(dateRaw.getHours() + timeZoneOffset);
        const formatter = new Intl.DateTimeFormat(App.sessionManager.get("viewLanguage") || "nl-NL", options);

        return formatter.format(dateRaw);
    };

    /**
     * Update the amount of credits a user has.
     * Select the type of interaction, and set 'inverted' to true
     * if you are decreasing.
     * @param {string} email - Email of the target user.
     * @param {string} type - The type of interaction. You can choose from: 'Story', 'Comment', 'Vote' & 'Achievement'.
     * @param {boolean} inverted - If true, the number will be multiplied by '-1'.
     * @param {number} customValue - Optional force value. Overwrites pre-programmed values and the inverted parameter.
     * @example updateCredits("a.example.com", "Achievement", false, userCredits.CREDIT_ACHIEVEMENT_10);
     * @example updateCredits("b.example.com", "Story", false, false);
     */
    async updateCredits(email, type, inverted, customValue) {
        let amount = 0;
        if (type === "Achievement" && !customValue)
            return console.error("When using type 'Achievement', you have to provide a positive customValue. Check the userCreditHelper for these values.");
        if (type === "Story") {
            amount = userCredits.CREDIT_STORY;
        } else if (type === "Comment") {
            amount = userCredits.CREDIT_COMMENT;
        } else if (type === "Vote") {
            amount = userCredits.CREDIT_VOTE;
        } else if (type === "Achievement") {
            amount = customValue;
        } else return console.error("Wrong interaction type provided. You can choose from: 'Story', 'Comment', 'Vote' & 'Achievement'.");
        if (inverted) amount *= -1;
        if (customValue === 0 || customValue) amount = customValue;
        return await this.#settingsRepository.updateCredits(email, amount);
    };
};
