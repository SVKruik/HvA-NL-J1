/**
 * Controller responsible for all events in the 'story-read' view.
 * @author Stefan Kruik & Donovan Tjokrodimedjo
 */

import { App } from "../../app.js";
import { SettingsRepository } from "../../repositories/settingsRepository.js";
import { StoryReadRepository } from "../../repositories/storyReadRepository.js";
import { StoryRepository } from "../../repositories/storyRepository.js";
import { VerifyRepository } from "../../repositories/verifyRepository.js";
import { Controller } from "../controller.js";
import * as achievementThresholds from "../../framework/utils/achievementThresholdHelper.js";

export class StoryReadController extends Controller {
    #storyReadView;
    #storyReadRepository;
    #verifyRepository;
    #storyRepository;
    #settingsRepository;
    #App;

    /**
     * Constructor of the view.
     */
    constructor() {
        super();
        this.#storyReadRepository = new StoryReadRepository();
        this.#verifyRepository = new VerifyRepository();
        this.#storyRepository = new StoryRepository();
        this.#settingsRepository = new SettingsRepository();
        this.#App = App;
        this.#setupView();
    };

    /**
     * Load all the elements and data into the view.
     * @async
     * @private
     */
    async #setupView() {
        // Initialize components
        this.#storyReadView = await super.loadHtmlIntoContent("html_views/storyRead.html");
        super.translateView(true, "StoryRead");

        // Data Collecting
        const email = this.#App.sessionManager.get("email");
        const url = window.location.hash.replace("#story-read/", "");

        // Defining Age
        let explicit = this.#App.sessionManager.get("explicit") || 1;
        const ageLimit = 16;
        if (email) {
            const userData = (await this.#storyReadRepository.userInfoEmail(email)).result[0];
            const age = super.getAge(userData.birthdate);
            if (age <= ageLimit) explicit = 0;
        };

        const storyData = await this.#storyRepository.loadStoryData(null, null, [], null, null, null, null, url, 1, 0);

        // Explicit Handling
        if (storyData.result[0] && storyData.result[0].explicit === 1 && explicit === 0) {
            this.#storyReadView.getElementsByClassName("story-read-placeholder-image")[0].src = "assets/img/svg/Exclamation.svg";
            this.#storyReadView.getElementsByClassName("story-read-placeholder")[0].innerHTML = await super.translateComponent("story-read-placeholder-4")
            this.#storyReadView.getElementsByClassName("story-read-placeholder")[0].setAttribute("data-translate", "story-read-placeholder-4");
            return this.#storyReadView.getElementsByClassName("story-content-wrapper")[0].style.display = "none";
        };

        // Wrong URL Handling
        if (storyData.result && storyData.result[0]) {
            this.#storyReadView.getElementsByClassName("story-placeholder")[0].style.display = "none";
        } else return this.#storyReadView.getElementsByClassName("story-content-wrapper")[0].style.display = "none";

        const tagNames = storyData.result[0].tagname.split(", ");
        const tagId = storyData.result[0].tagid.split(", ");
        const tagData = { tagNames, tagId };
        const spinner = this.#storyReadView.querySelector("#spinner");
        spinner.style.display = "flex";

        // Email Status
        let status = 0;
        const statusData = await this.#verifyRepository.getStatus(email);
        if (statusData.result.length !== 0) status = statusData.result[0].status;

        // View Loading
        await this.#loadStory(storyData, email, tagData, status);
        await this.#loadComments(storyData, email, "ORDER BY date ASC", status);
        await this.#commentHandler(storyData, email, status);

        // Get vote buttons
        const upvote = this.#storyReadView.querySelector("#upvote");
        const downvote = this.#storyReadView.querySelector("#downvote");
        if (upvote === null || downvote === null) return;

        // Load current vote status
        const voteData = await this.#storyReadRepository.checkLike(email, storyData.result[0].id, "Story");
        if (voteData.result.length !== 0) {
            if (voteData.result[0].value === 1) {
                this.#storyReadView.querySelector("#upvote").style.color = "rgb(196, 223, 170)";
            } else if (voteData.result[0].value === -1) {
                this.#storyReadView.querySelector("#downvote").style.color = "rgb(232, 119, 118)";
            };
        };

        // Click listeners on vote buttons
        upvote.addEventListener("click", () => {
            this.#storyVoteHandler(upvote, "rgb(196, 223, 170)", downvote, storyData, "rgb(232, 119, 118)", email);
        });
        downvote.addEventListener("click", () => {
            this.#storyVoteHandler(downvote, "rgb(232, 119, 118)", upvote, storyData, "rgb(196, 223, 170)", email);
        });

        if (storyData.result[0].disable_comments || status === 0) {
            // Input
            const input = this.#storyReadView.querySelector("#comment-input");
            input.disabled = true;
            input.style.cursor = "not-allowed";

            // Error Message
            let message = "";
            if (status === 0) {
                message = await super.translateComponent("story-read-verify");
            } if (storyData.result[0].disable_comments) message = await super.translateComponent("story-read-placeholder-2");
            input.placeholder = message;

            // Button
            const button = this.#storyReadView.querySelector("#place-story-icon");
            button.style.cursor = "not-allowed";

            // Button Click Message
            button.addEventListener("click", async () => {
                super.customAlert(null, message, null, null);
            });
        };

        // Story Edit Link
        const button = this.#storyReadView.getElementsByClassName("story-edit-button")[0];

        if (storyData.result[0].user_email === this.#App.sessionManager.get("email")) {
            button.style.opacity = "1";
            button.style.cursor = "pointer";
            button.addEventListener("click", () => {
                window.location.href = `#post/edit?id=${storyData.result[0].url}`;
            });
        } else button.style.display = "none";

        // Translate
        const title = this.#storyReadView.getElementsByClassName("story-title")[0];
        const content = this.#storyReadView.getElementsByClassName("story-content")[0];
        try {
            let translatedTitle = await this.#storyReadRepository.translateRequest(
                storyData.result[0].title.replace(/&nbsp;/g, ""),
                App.sessionManager.get("viewLanguage").slice(0, 2)
            );
            let translatedContent = await this.#storyReadRepository.translateRequest(
                storyData.result[0].content.replace(/&nbsp;/g, ""),
                App.sessionManager.get("viewLanguage").slice(0, 2)
            );

            function showSection() {
                document.querySelector('.story-translation-disclaimer').classList.remove("inactive-section");

                document.querySelector('.story-translate-button').classList.add('inactive');

                document.querySelectorAll('.story-translation-disclaimer *').forEach(child => {
                    if (!child.classList.contains('story-translate-button') && !child.parentElement.classList.contains('story-translate-button'))
                        child.classList.remove("inactive");
                });

                document.querySelector('.story-translate-button').classList.add('inactive');
            }

            function hideSection() {
                document.querySelector('.story-translation-disclaimer').classList.add("inactive-section");

                document.querySelector('.story-translate-button').classList.remove('inactive');

                document.querySelectorAll('.story-translation-disclaimer *').forEach(child => {
                    if (!child.classList.contains('story-translate-button') && !child.parentElement.classList.contains('story-translate-button'))
                        child.classList.add("inactive");
                });
            }

            // Adds event listener to the switch button to switch to the original text
            this.#storyReadView.querySelector('.story-translation-switch').addEventListener('click', () => {
                hideSection();

                title.innerHTML = storyData.result[0].title;
                content.innerHTML = storyData.result[0].content;
            });

            // Adds event listener to the translate button to translate the story
            this.#storyReadView.querySelector('.story-translate-button').addEventListener('click', () => {
                showSection();

                title.innerHTML = `<i class="bi bi-translate"></i> ` + App.sessionManager.get("translatedTitle");
                content.innerHTML = App.sessionManager.get("translatedStory");
            });

            App.sessionManager.set("translatedTitle", translatedTitle.result);
            App.sessionManager.set("translatedStory", translatedContent.result.replace("%n%", "</p><br><p>"));

            if (App.sessionManager.get("autoTranslate")) {
                this.#storyReadView.querySelector('.story-translate-button').classList.add('inactive');
                title.innerHTML = `<i class="bi bi-translate"></i> ` + translatedTitle.result;
                content.innerHTML = translatedContent.result.replace("%n%", "</p><br><p>");
                showSection();
            } else {
                title.innerHTML = storyData.result[0].title;
                content.innerHTML = storyData.result[0].content.replace("%n%", "</p><br><p>");
                hideSection();
            }

            this.#storyReadView.querySelector('.story-translation-disclaimer').style.display = "flex";
        } catch (e) {
            console.log(e);
            this.#storyReadView.querySelector('.story-translate-button').classList.remove('inactive');
            this.#storyReadView.querySelector('.story-translation-disclaimer').classList.remove("inactive-section");
            title.innerHTML = storyData.result[0].title;
            content.innerHTML = storyData.result[0].content.replace("%n%", "</p><br><p>");
        } finally {
            spinner.style.display = "none";
        }
    };

    /**
     * Load the story that matches with the URL.
     * @param {object} storyData - Unformatted story data from the database.
     * @param {string} email - Email of logged in user.
     * @param {object} tagData - The tagdata queried from the database.
     * @param {number} status - If the user has an verified account.
     * @async
     * @private
     */
    async #loadStory(storyData, email, tagData, status) {
        // Getting Displays
        const image = this.#storyReadView.getElementsByClassName("image-container")[0];
        const authorContainer = this.#storyReadView.getElementsByClassName("story-author-container")[0];
        const authorName = this.#storyReadView.getElementsByClassName("story-author-username")[0];
        const authorImage = this.#storyReadView.getElementsByClassName("story-author-image")[0];
        const likes = this.#storyReadView.getElementsByClassName("story-likes")[0];
        const comments = this.#storyReadView.getElementsByClassName("story-comments")[0];
        const date = this.#storyReadView.getElementsByClassName("story-date")[0];
        const share = this.#storyReadView.querySelector("#share");
        const timeline = this.#storyReadView.querySelector("#timeline");

        // Formatting Values
        const formattedDate = await super.dateFormat(storyData.result[0].date, "long");
        const like_threshold = achievementThresholds.STORY_VERIFY;

        // Remove elements if not logged in
        if (!email || status === 0) {
            this.#storyReadView.querySelector("#upvote").style.display = "none";
            this.#storyReadView.querySelector("#downvote").style.display = "none";
        };

        // Containers
        const tagContainer = this.#storyReadView.getElementsByClassName("story-tag-container")[0];
        const modifierContainerHost = this.#storyReadView.getElementsByClassName("story-modifier-container")[0];

        // Tag parsing
        for (let i = 0; i < tagData.tagNames.length; i++) {
            const tagId = tagData.tagId[i];
            const tagContent = await this.translateComponent(`story-tag-${tagId}`);
            super.createTag(tagContent, tagId, tagContainer);
        };

        // Modifiers
        if (storyData.result[0].verified > 0 || storyData.result[0].likes >= like_threshold) super.createModifier("Verified", modifierContainerHost);
        if (storyData.result[0].explicit > 0) super.createModifier("Explicit", modifierContainerHost);

        // Filling Content
        image.src = `uploads/story/${storyData.result[0].url}.jpg`;

        image.addEventListener("error", () => {
            image.src = "/assets/img/background/error.svg";
            image.style.filter = "brightness(0.5)";
        }, { once: true });

        const imageZoomButton = document.querySelector('.story-zoom-button');

        // Open Image
        imageZoomButton.addEventListener('click', () => {
            const imageUrl = document.querySelector('.image-container').src;
            showImageOverlay(imageUrl);
        });

        /**
         * Create an image overlay, to show the image full screen.
         * @param {string} imageUrl - Path to image.
         */
        function showImageOverlay(imageUrl) {
            // Create
            const overlay = document.createElement('div');
            overlay.classList.add('image-overlay');
            const enlargedImage = document.createElement('img');
            enlargedImage.src = imageUrl;

            // Append
            overlay.appendChild(enlargedImage);
            document.body.appendChild(overlay);

            // Close Image
            overlay.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
        };

        likes.innerHTML = super.numberFormat(storyData.result[0].likes || 0);
        comments.innerHTML = super.numberFormat(storyData.result[0].comments || 0);
        date.innerHTML = `${await super.translateComponent("story-read-author-1")} <a class="author-link" href="#profile/${storyData.result[0].user_name}">${storyData.result[0].user_name}</a>, ${await super.translateComponent("story-read-date-splitter")} ${formattedDate}.`;

        // Default Image
        authorImage.addEventListener("error", () => {
            authorImage.src = "/assets/img/icons/default.svg";
        }, { once: true });

        // Check for story configuration values
        if (storyData.result[0].anonymous === 1 && storyData.result[0].user_type !== 2) {
            authorName.innerHTML = await super.translateComponent("user-1");
            date.innerHTML = `${await super.translateComponent("story-read-author-2")} ${formattedDate}.`;
            authorImage.src = "/assets/img/icons/default.svg";
            authorContainer.style.cursor = "default";
        } else if (storyData.result[0].user_type === 2) {
            authorName.innerHTML = await super.translateComponent("user-2");
            date.innerHTML = `${await super.translateComponent("story-read-author-3")} ${formattedDate}.`;
            authorImage.src = "/assets/img/icons/default.svg";
            authorContainer.style.cursor = "default";
        } else {
            authorName.innerHTML = storyData.result[0].user_name;
            authorImage.src = `uploads/profile/${storyData.result[0].user_name}.jpg`;
            authorContainer.setAttribute("href", `#profile/${storyData.result[0].user_name}`);
        };
        if (storyData.result[0].edit_date) {
            const formattedEditDate = await super.dateFormat(storyData.result[0].edit_date, "long");
            date.innerHTML += `<br>${await super.translateComponent("story-read-edited")} ${formattedEditDate}.`;
            const modifier = await super.createModifier("Edited", modifierContainerHost);
            modifier.addEventListener("click", async () => {
                super.customAlert(null, `${await super.translateComponent("story-read-date-alert-3")} ${formattedEditDate}.`, "info", null);
            });
        };
        if (storyData.result[0].disable_votes > 0) {
            this.#storyReadView.getElementsByClassName("story-like-container")[0].style.display = "none";
        };
        if (storyData.result[0].disable_comments > 0) {
            this.#storyReadView.getElementsByClassName("story-comment-container")[0].style.display = "none";
        };

        // Timeline Link
        timeline.addEventListener("click", () => {
            this.#App.sessionManager.set("timelineYear", storyData.result[0].year);
            this.#App.sessionManager.set("timelineAnchor", `anchor-${storyData.result[0].url}`);
            window.location.href = `#timeline`;
        });

        super.updateCredits(email, "Achievement", false, 1);

        // Sharing
        share.addEventListener("click", async () => {
            share.style.color = "#FEBE8C";
            navigator.clipboard.writeText(`${window.location.href}`);
            setTimeout(() => {
                share.style.color = "var(--alt)"
            }, 400);

            // Achievement Handling
            super.registerAchievement("10", email);
        });

        // Comment Sorting
        const commentSort = this.#storyReadView.getElementsByClassName("comment-sort-selector")[0];
        commentSort.addEventListener("change", () => {
            let orderQuery;
            if (commentSort.value == "date ASC") {
                orderQuery = "ORDER BY comment.date ASC";
            } else if (commentSort.value == "date DESC") {
                orderQuery = "ORDER BY comment.date DESC";
            } else if (commentSort.value == "like ASC") {
                orderQuery = "ORDER BY SUM(user_like.value) ASC";
            } else if (commentSort.value == "like DESC") {
                orderQuery = "ORDER BY SUM(user_like.value) DESC";
            };

            this.#storyReadView.getElementsByClassName("comment-container")[0].innerHTML = "";
            this.#loadComments(storyData, email, orderQuery, status);
        });
    };

    /**
     * Load all the comments of the story in view.
     * @param {Array} storyData - Formatted story data from the database.
     * @param {string} email - Email of logged in user.
     * @param {string} sort - SQL ORDER BY clause.
     * @param {number} status - If the user has an verified account.
     * @async
     * @private
     */
    async #loadComments(storyData, email, sort, status) {
        const commentData = await this.#storyReadRepository.loadComments(storyData.result[0].id, sort);
        if (!commentData.result[0] || storyData.result[0].disable_comments) {
            return this.#createPlaceholder(storyData.result[0].disable_comments);
        };
        for (let i = 0; i < commentData.result.length; i++) {
            await this.#commentConstructor(commentData.result[i], "comment-container", email, "Comment", storyData, status);
        };
    };

    /**
     * Create and append a comment element.
     * @param {Array} commentData - Formatted comment data to render the comment with.
     * @param {string} host - Parent element to append to.
     * @param {string} email - Email of logged in user.
     * @param {string} type - New comment or reply.
     * @param {Array} storyData - Unformatted story data from the database.
     * @param {number} status - If the user has an verified account.
     * @async
     * @private
     */
    async #commentConstructor(commentData, host, email, type, storyData, status) {
        // Top Parents
        const commentContainer = document.createElement("div");
        commentContainer.className = "comment-container-item";
        const commentWrapper = document.createElement("div");
        commentWrapper.className = `comment-content-wrapper`;
        const commentReplyContainer = document.createElement("div");
        commentReplyContainer.className = "comment-reply-wrapper";
        commentReplyContainer.id = `comment-reply-container-${commentData.id}`;

        // Date
        const commentDateRaw = new Date(commentData.date);
        const monthNames = ["januari", "februari", "Maart", "april", "mei", "juni",
            "juli", "augustus", "september", "oktober", "november", "december"];
        let hours;
        if (("0" + (commentDateRaw.getHours() - 1)).slice(-2) == "-1") {
            hours = "23";
        } else {
            hours = ("0" + (commentDateRaw.getHours() - 1)).slice(-2);
        };
        let commentDate = `${("0" + commentDateRaw.getDate()).slice(-2)} ${monthNames[commentDateRaw.getMonth()]} ${commentDateRaw.getFullYear()} om ${hours}:${("0" + commentDateRaw.getMinutes()).slice(-2)}`;

        // Author
        const authorContainer = document.createElement("div");
        authorContainer.className = "comment-author-container";
        const authorSubContainer = document.createElement("div");
        authorSubContainer.className = "comment-sub-container";
        const authorImage = document.createElement("img");
        authorImage.className = "comment-author-image";
        authorImage.src = `uploads/profile/${commentData.user_name}.jpg`;

        // Default Image
        authorImage.addEventListener("error", () => {
            authorImage.src = "/assets/img/icons/default.svg";
        }, { once: true });

        const authorName = document.createElement("p");
        authorName.className = "comment-author-username";
        authorName.innerHTML = commentData.user_name;
        const date = document.createElement("p");
        date.className = "comment-date";
        date.innerHTML = commentDate;
        if (date.innerHTML == "aN undefined NaN om aN:aN") {
            date.innerHTML = commentData.date;
        };
        authorSubContainer.appendChild(authorImage);
        authorSubContainer.appendChild(authorName);
        authorContainer.appendChild(authorSubContainer);
        authorContainer.appendChild(date);

        // Content and Date
        const contentContainer = document.createElement("div");
        contentContainer.className = "comment-content-container";
        const content = document.createElement("p");
        content.className = "comment-content";
        content.innerHTML = commentData.content;
        contentContainer.appendChild(content);

        // Comment Footer
        const commentFooter = document.createElement("div");
        commentFooter.className = "comment-footer-container";
        const footerSplitter = document.createElement("div");
        footerSplitter.className = "comment-footer-splitter";

        // Votes
        const voteContainer = document.createElement("div");
        let display;
        voteContainer.className = "comment-vote-container";
        if (commentData.date !== await super.translateComponent("story-read-recent")) {
            const displayContainer = document.createElement("div");
            displayContainer.className = "comment-display-container";
            const displayLabel = document.createElement("i");
            displayLabel.className = "fa-solid fa-heart";
            display = document.createElement("p");
            display.className = `comment-display-${commentData.id}`;
            display.innerHTML = commentData.likes || 0;
            displayContainer.appendChild(displayLabel);
            displayContainer.appendChild(display);
            voteContainer.appendChild(displayContainer);
        };
        if (email && status === 1) {
            const upvote = document.createElement("i");
            upvote.className = "fa-solid fa-thumbs-up comment-upvote";
            upvote.id = "comment-upvote";
            const downvote = document.createElement("i");
            downvote.className = "fa-solid fa-thumbs-down comment-downvote";
            downvote.id = "comment-downvote";
            const vtcmSplitter = document.createElement("div");
            vtcmSplitter.className = "comment-vtcm-splitter";

            // Load current vote status
            const voteData = await this.#storyReadRepository.checkLike(email, commentData.id, "Comment");
            if (voteData.result.length !== 0) {
                if (voteData.result[0].value === 1) {
                    upvote.style.color = "rgb(196, 223, 170)";
                } else if (voteData.result[0].value === -1) {
                    downvote.style.color = "rgb(232, 119, 118)";
                };
            };

            // Click Listeners
            upvote.addEventListener("click", () => {
                this.#commentVoteHandler(upvote, "rgb(196, 223, 170)", downvote, commentData, "rgb(232, 119, 118)", email, display);
            });
            downvote.addEventListener("click", () => {
                this.#commentVoteHandler(downvote, "rgb(232, 119, 118)", upvote, commentData, "rgb(196, 223, 170)", email, display);
            });
            voteContainer.appendChild(vtcmSplitter);
            voteContainer.appendChild(upvote);
            voteContainer.appendChild(downvote);
        };
        commentFooter.appendChild(voteContainer);

        // Reply Input
        if (type !== "Reply") {
            const replyInputContainer = document.createElement("div");
            replyInputContainer.className = "reply-input-container";
            const replyInput = document.createElement("input");
            replyInput.className = "reply-input";
            replyInput.type = "text";
            replyInput.maxLength = 300;
            replyInput.placeholder = "Plaats een reactie";
            replyInput.addEventListener("keydown", event => {
                if (event.key === "Escape") return replyInput.style.display = "none";
                replyInput.style.border = "1px solid var(--gray)";
                this.#placeComment(replyInput, event, storyData, email, commentData.id, true, status);
            });
            replyInputContainer.appendChild(replyInput);

            // Reply Button
            if (email && !commentData.parent_comment_id && status !== 0) {
                const replyContainer = document.createElement("div");
                replyContainer.className = "comment-reply-container";
                const reply = document.createElement("i");
                reply.className = "fa-solid fa-reply";
                reply.addEventListener("click", () => {
                    commentReplyContainer.prepend(replyInputContainer);
                    reply.style.color = "#FEBE8C";
                    setTimeout(() => {
                        reply.style.color = "var(--alt)"
                    }, 400);
                });
                replyContainer.appendChild(reply);
                commentFooter.appendChild(footerSplitter);
                commentFooter.appendChild(replyContainer);
            };
        };

        // Append all children
        commentWrapper.appendChild(authorContainer);
        commentWrapper.appendChild(contentContainer);
        commentWrapper.appendChild(commentFooter);

        // Final Appending
        commentContainer.appendChild(commentWrapper);
        if (!commentData.parent_comment_id) commentContainer.appendChild(commentReplyContainer);
        if (commentData.parent_comment_id) {
            this.#storyReadView.querySelector(`#comment-reply-container-${commentData.parent_comment_id}`).prepend(commentContainer);
        } else this.#storyReadView.getElementsByClassName(host)[0].prepend(commentContainer);
    };

    /**
     * Comment handler for handling events that happen at the comment inputs.
     * @param {Array} storyData - Unformatted story data from the database.
     * @param {string} email - Email of logged in user. 
     * @param {number} status - If the user has an verified account.
     * @async
     * @private
     */
    async #commentHandler(storyData, email, status) {
        const commentInput = this.#storyReadView.querySelector("#comment-input");
        const charCounter = this.#storyReadView.getElementsByClassName("character-counter")[0];
        commentInput.addEventListener("keypress", async event => {
            commentInput.style.border = "1px solid var(--gray)";
            this.#placeComment(commentInput, event, storyData, email, null, null, status);
        });

        // Input Gets Focus
        commentInput.addEventListener("focus", async () => {
            charCounter.style.opacity = 1;
            charCounter.style.transform = "scale(1)";
            charCounter.innerHTML = `${commentInput.maxLength - commentInput.value.length} ${await super.translateComponent("input-remaining-chars")}`;
        });

        // Input Loses Focus
        commentInput.addEventListener("blur", () => {
            charCounter.style.opacity = 0;
            charCounter.style.transform = "scale(0)";
        });

        // Manual Commenting
        this.#storyReadView.querySelector("#place-story-icon").addEventListener("click", () => {
            commentInput.style.border = "1px solid var(--gray)";
            this.#placeComment(commentInput, "Press", storyData, email, null, null, status);
        });

        // Key Press Counter
        commentInput.addEventListener("keydown", event => {
            super.commentInputController(event, commentInput, charCounter, 30, "font-l");
        });
        // Paste listener
        commentInput.addEventListener("paste", event => {
            super.commentInputController(event, commentInput, charCounter, 30, "font-l");
        });
    };

    /**
     * Place a new comment under a story.
     * @param {Element} commentInput - Story place input.
     * @param {Object} event - Key press event.
     * @param {Array} storyData - Story data from the database.
     * @param {string} email - Email of logged in user.
     * @param {number} parentComment - ID of the parent comment if it's a reply.
     * @param {boolean} hide - Hide the input after pressing enter.
     * @returns - If there is a user error.
     * @async
     * @private
     */
    async #placeComment(commentInput, event, storyData, email, parentComment, hide, status) {
        if (status === 0) return;
        if (event.key == "Enter" || event == "Press") {
            // Faulty input handling
            if (commentInput.value.length === 0 || commentInput.value == " ") {
                if (storyData.result[0].disable_comments) return;
                commentInput.style.border = "1px solid var(--error)";
                commentInput.focus();
                return super.customAlert(null, await super.translateComponent("story-read-empty"), null, null);
            };

            // Processing Data
            await this.#storyReadRepository.placeComment(storyData.result[0].id, email, commentInput.value, parentComment);
            const userData = await this.#storyReadRepository.userInfoEmail(email);
            const commentDisplay = this.#storyReadView.getElementsByClassName("story-comments")[0];
            const commentCount = parseInt(this.#storyReadView.getElementsByClassName("story-comments")[0].innerHTML);
            let targetEmail = "";
            if (!parentComment) {
                targetEmail = storyData.result[0].user_email;
            } else targetEmail = (await this.#storyReadRepository.userCommentData(parentComment)).result[0].user_email;
            const emailSettings = (await this.#settingsRepository.getUserSettings(targetEmail)).result[0];
            const recvEmailSettings = (await this.#settingsRepository.getUserSettings(storyData.result[0].user_email)).result[0];
            const data = {
                date: await super.translateComponent("story-read-recent"),
                content: commentInput.value,
                user_name: userData.result[0].user_name,
                user_email: userData.result[0].user_email
            };

            // Remove placeholder and reset input
            if (this.#storyReadView.getElementsByClassName("comment-placeholder")[0]) this.#storyReadView.getElementsByClassName("comment-placeholder")[0].style.display = "none";
            commentInput.value = "";
            commentInput.blur();
            commentDisplay.innerHTML = commentCount + 1;

            // Remove input if it's a reply
            if (hide) {
                if (commentInput.parentElement.nextElementSibling) commentInput.parentElement.nextElementSibling.style.marginTop = "-20px";
                commentInput.parentElement.remove();
                await this.#commentConstructor(data, "comment-reply-wrapper");
            } else await this.#commentConstructor(data, "comment-container");

            // Update Credits
            super.updateCredits(email, "Comment", false, false);

            // Achievement Handling
            super.registerAchievement("02", email);
            const totalComments = (await this.#storyReadRepository.totalComments(email)).result[0].total;
            if (totalComments + 1 >= achievementThresholds.COMMENT_TOTAL) super.registerAchievement("07", email);

            // Mailing
            if (!parentComment) {
                if (emailSettings.interaction_mail === 0) return;
                this.#storyReadRepository.sendInteractionMail(storyData.result[0].user_email,
                    userData.result[0].user_name, (await super.translateComponent("profile-story", false, emailSettings.language)).toLowerCase(), data.content,
                    window.location.href, "", storyData.result[0].title, await super.translateComponent("email-interaction", emailSettings.language),
                    await super.translateComponent("email-general", emailSettings.language));
            } else {
                if (emailSettings.interaction_mail === 0) return;
                const commentData = await this.#storyReadRepository.commentData(parentComment);
                this.#storyReadRepository.sendInteractionMail(storyData.result[0].user_email,
                    userData.result[0].user_name, (await super.translateComponent("profile-comment", recvEmailSettings.language)).toLowerCase(), data.content,
                    window.location.href, "", commentData.result[0].content, await super.translateComponent("email-interaction", emailSettings.language),
                    await super.translateComponent("email-general", emailSettings.language));
            };
        };
    };

    /**
     * Handles colors and database voting for stories.
     * @param {element} element - Clicked element.
     * @param {string} color - RGB color to switch to/from.
     * @param {element} switchElement - Sibling element.
     * @param {Array} storyData - Unformatted story data from the database.
     * @param {string} switchColor - Color to switch to on click.
     * @param {string} email - Email of logged in user.
     * @async
     * @private
     */
    async #storyVoteHandler(element, color, switchElement, storyData, switchColor, email) {
        const voteDisplay = this.#storyReadView.getElementsByClassName("story-likes")[0];
        const voteDisplayValue = parseInt(voteDisplay.innerHTML);
        const type = "Story";
        const likeCount = (await this.#storyReadRepository.totalLikes(storyData.result[0].user_email)).result[0].total;
        const totalLikeCount = (await this.#storyReadRepository.totalLikesStory(this.#App.sessionManager.get("email"))).result[0].total;

        if (element.style.color === color) {
            element.style.color = "var(--alt)";

            // Database
            if (element.id === "upvote") {
                // Upvote to Neutral
                await this.#storyReadRepository.userLike(2, storyData.result[0].id, undefined, email, type);
                voteDisplay.innerHTML = voteDisplayValue - 1;
                await super.updateCredits(email, "Vote", true, false);
                if (storyData.result[0].likes - 1 < achievementThresholds.STORY_VERIFY && storyData.result[0].verified === 1) {
                    this.#storyReadRepository.verifyStory(storyData.result[0].url, 0);
                };
            } else {
                // Downvote to Neutral
                await this.#storyReadRepository.userLike(2, storyData.result[0].id, undefined, email, type);
                voteDisplay.innerHTML = voteDisplayValue + 1;
                await super.updateCredits(email, "Vote", true, false);
                if (storyData.result[0].likes + 1 >= achievementThresholds.STORY_VERIFY && storyData.result[0].verified !== 1) {
                    this.#storyReadRepository.verifyStory(storyData.result[0].url, 1);
                    super.registerAchievement("03", storyData.result[0].user_email);
                };
                if (storyData.result[0].likes + 1 >= achievementThresholds.VOTE_SINGLE) {
                    super.registerAchievement("05", storyData.result[0].user_email);
                };
                if (likeCount + 1 >= achievementThresholds.VOTE_TOTAL) {
                    super.registerAchievement("06", storyData.result[0].user_email);
                };
                if (totalLikeCount + 1 >= achievementThresholds.VOTE_OUT_TOTAL) {
                    super.registerAchievement("09", email);
                };
            };
        } else if (element.style.color !== color) {
            element.style.color = color;

            // Database
            if (element.id === "upvote") {
                if (switchElement.style.color === switchColor) {
                    // Downvote to Upvote
                    await this.#storyReadRepository.userLike(1, storyData.result[0].id, undefined, email, type);
                    voteDisplay.innerHTML = voteDisplayValue + 2;
                    await super.updateCredits(email, "Vote", false, 0);
                    if (storyData.result[0].likes + 2 >= achievementThresholds.STORY_VERIFY && storyData.result[0].verified !== 1) {
                        this.#storyReadRepository.verifyStory(storyData.result[0].url, 1);
                        super.registerAchievement("03", storyData.result[0].user_email);
                    };
                    if (storyData.result[0].likes + 1 >= achievementThresholds.VOTE_SINGLE) {
                        super.registerAchievement("05", storyData.result[0].user_email);
                    };
                    if (likeCount + 1 >= achievementThresholds.VOTE_TOTAL) {
                        super.registerAchievement("06", storyData.result[0].user_email);
                    };
                    if (totalLikeCount + 1 >= achievementThresholds.VOTE_OUT_TOTAL) {
                        super.registerAchievement("09", email);
                    };
                } else {
                    // Neutral to Upvote
                    await this.#storyReadRepository.userLike(1, storyData.result[0].id, undefined, email, type);
                    voteDisplay.innerHTML = voteDisplayValue + 1;
                    await super.updateCredits(email, "Vote", false, false);
                    if (storyData.result[0].likes + 1 >= achievementThresholds.STORY_VERIFY && storyData.result[0].verified !== 1) {
                        this.#storyReadRepository.verifyStory(storyData.result[0].url, 1);
                        super.registerAchievement("03", storyData.result[0].user_email);
                    };
                    if (storyData.result[0].likes + 1 >= achievementThresholds.VOTE_SINGLE) {
                        super.registerAchievement("05", storyData.result[0].user_email);
                    };
                    if (likeCount + 1 >= achievementThresholds.VOTE_TOTAL) {
                        super.registerAchievement("06", storyData.result[0].user_email);
                    };
                    if (totalLikeCount + 1 >= achievementThresholds.VOTE_OUT_TOTAL) {
                        super.registerAchievement("09", email);
                    };
                };
            } else {
                if (switchElement.style.color === switchColor) {
                    // Upvote to Downvote
                    await this.#storyReadRepository.userLike(0, storyData.result[0].id, undefined, email, type);
                    voteDisplay.innerHTML = voteDisplayValue - 2;
                    await super.updateCredits(email, "Vote", false, 0);
                    if (storyData.result[0].likes - 2 < achievementThresholds.STORY_VERIFY && storyData.result[0].verified === 1) {
                        this.#storyReadRepository.verifyStory(storyData.result[0].url, 0);
                    };
                } else {
                    // Neutral to Downvote
                    await this.#storyReadRepository.userLike(0, storyData.result[0].id, undefined, email, type);
                    voteDisplay.innerHTML = voteDisplayValue - 1;
                    await super.updateCredits(email, "Vote", false, false);
                    if (storyData.result[0].likes - 1 < achievementThresholds.STORY_VERIFY && storyData.result[0].verified === 1) {
                        this.#storyReadRepository.verifyStory(storyData.result[0].url, 0);
                    };
                };
            };
        };

        if (switchElement.style.color === switchColor) switchElement.style.color = "var(--alt)";
    };

    /**
     * Handles colors and database voting for comments.
     * @param {element} element - Clicked element.
     * @param {string} color - RGB color to switch to/from.
     * @param {element} switchElement - Sibling element.
     * @param {Array} commentData - Formatted comment data from the database.
     * @param {string} switchColor - Color to switch to on click.
     * @param {string} email - Email of logged in user.
     * @param {element} display - The like balance counter.
     * @async
     * @private
     */
    async #commentVoteHandler(element, color, switchElement, commentData, switchColor, email, display) {
        const voteDisplay = display;
        const voteDisplayValue = parseInt(voteDisplay.innerHTML);
        const type = "Comment";
        const userEmail = (await this.#storyReadRepository.userInfoUsername(commentData.user_name)).result[0].email;
        const likeCount = (await this.#storyReadRepository.totalLikes(userEmail)).result[0].total;

        if (element.style.color === color) {
            element.style.color = "var(--alt)";

            // Database
            if (element.id === "comment-upvote") {
                // From Upvote to Neutral
                await this.#storyReadRepository.userLike(2, undefined, commentData.id, email, type);
                voteDisplay.innerHTML = voteDisplayValue - 1;
                await super.updateCredits(email, "Vote", true, false);
            } else {
                // From Downvote to Neutral
                await this.#storyReadRepository.userLike(2, undefined, commentData.id, email, type);
                voteDisplay.innerHTML = voteDisplayValue + 1;
                await super.updateCredits(email, "Vote", true, false);
                if (likeCount + 1 >= achievementThresholds.VOTE_TOTAL) {
                    super.registerAchievement("06", userEmail);
                };
            };
        } else if (element.style.color !== color) {
            element.style.color = color;

            // Database
            if (element.id === "comment-upvote") {
                if (switchElement.style.color === switchColor) {
                    // From Downvote to Upvote
                    await this.#storyReadRepository.userLike(1, undefined, commentData.id, email, type);
                    voteDisplay.innerHTML = voteDisplayValue + 2;
                    await super.updateCredits(email, "Vote", false, 0);
                    if (likeCount + 1 >= achievementThresholds.VOTE_TOTAL) {
                        super.registerAchievement("06", userEmail);
                    };
                } else {
                    // From Neutral to Upvote
                    await this.#storyReadRepository.userLike(1, undefined, commentData.id, email, type);
                    voteDisplay.innerHTML = voteDisplayValue + 1;
                    await super.updateCredits(email, "Vote", false, false);
                    if (likeCount + 1 >= achievementThresholds.VOTE_TOTAL) {
                        super.registerAchievement("06", userEmail);
                    };
                };
            } else {
                if (switchElement.style.color === switchColor) {
                    // From Upvote to Downvote
                    await this.#storyReadRepository.userLike(0, undefined, commentData.id, email, type);
                    voteDisplay.innerHTML = voteDisplayValue - 2;
                    await super.updateCredits(email, "Vote", false, 0);
                } else {
                    // From Neutral to Downvote
                    await this.#storyReadRepository.userLike(0, undefined, commentData.id, email, type);
                    voteDisplay.innerHTML = voteDisplayValue - 1;
                    await super.updateCredits(email, "Vote", false, false);
                };
            };
        };

        if (switchElement.style.color === switchColor) switchElement.style.color = "var(--alt)";
    };

    /**
     * Create placeholder if no story comments are found.
     * @param {number} disable_comments - If comments are disabled/hidden. Changes the title of the placeholder.
     * @async
     * @private
     */
    async #createPlaceholder(disable_comments) {
        // Children
        let titleContent = await super.translateComponent("story-read-placeholder-1");
        if (disable_comments) titleContent = await super.translateComponent("story-read-placeholder-2");
        const title = document.createElement("h5");
        title.innerHTML = titleContent;
        const image = document.createElement("img");
        image.src = "../assets/img/svg/Empty.svg";

        // Parent
        const container = document.createElement("div");
        container.className = "comment-placeholder";
        container.appendChild(title);
        container.appendChild(image);

        // Append
        this.#storyReadView.getElementsByClassName("comment-container")[0].appendChild(container);
    };
};