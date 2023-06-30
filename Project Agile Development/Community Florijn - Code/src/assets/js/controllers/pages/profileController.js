/**
 * Controller for Profile
 * @author Emir Bay
 */

import { ProfileRepository } from "../../repositories/profileRepository.js";
import { Controller } from "../controller.js";
import { App } from "../../app.js";
import { FileRepository } from "../../repositories/fileRepository.js";

export class ProfileController extends Controller {
    #profileView;
    #profileRepository;
    #App;
    #fileRepository;

    constructor() {
        super();
        this.#profileRepository = new ProfileRepository();
        this.#fileRepository = new FileRepository();
        this.#App = App;
        this.#view();
    };

    /**
     * Load in view and display user info
     */
    async #view() {
        this.#profileView = await super.loadHtmlIntoContent("html_views/profile.html");
        super.translateView(true, "Profile");

        const profilePicture = this.#profileView.querySelector(".profilePicture");
        const profileMark = this.#profileView.querySelector(".profileMark");
        const profileName = this.#profileView.querySelector(".profileName");
        const profileUsername = this.#profileView.querySelector(".profileUserName");
        const profileAboutme = this.#profileView.querySelector(".profileAboutMe");
        const profilePosts = this.#profileView.querySelector(".profilePosts");
        const profileLikes = this.#profileView.querySelector(".profileLikes");
        const profileComments = this.#profileView.querySelector(".profileComments");
        const profileCredits = this.#profileView.querySelector(".profileCredits");
        const profileDate = this.#profileView.querySelector(".profileDate");
        const noPosts = this.#profileView.querySelector(".noPosts");
        const isEmpty = this.#profileView.querySelector(".isEmpty");
        const content = this.#profileView.querySelector(".userContent");
        const profileEdit = this.#profileView.querySelector(".profileEdit");
        profileEdit.onclick = () => window.location.href = "#settings/account";

        //Profile of user is shown
        const data = await this.#profileRepository.getUser(window.location.hash.replace("#profile/", ""));

        //If user doesn't exist redirect to Community Florijn profile
        if (data.result.length == 0) {
            window.location.href = "#profile/Community Florijn";
        }

        //Check if user is logged in
        let loggedIn = App.sessionManager.get("email");
        if (loggedIn === data.result[0].email) {
        } else profileEdit.style.display = "none";

        if (data.result[0].user_type > 2) {
            profilePicture.classList.add('markedProfile');
        } else {
            profileMark.remove();
        }

        //Converting database value to elements
        profilePicture.src = `uploads/profile/${data.result[0].user_name}.jpg`;

        // On image load error, load default profile picture
        profilePicture.addEventListener("error", () => {
            profilePicture.src = "/assets/img/icons/default.svg";
        }, { once: true });

        // Profile Info
        profileName.innerText = data.result[0].first_name + " " + Array.from(data.result[0].sur_name)[0] + ".";
        profileUsername.innerText = "@" + data.result[0].user_name;
        profileAboutme.innerText = data.result[0].biography;

        // Story Count
        let storyVisible = 0;
        for (let i = 0; i < data.result.length; i++) {
            if (data.result[i].id != null && data.result[i].anonymous == 0) storyVisible += 1;
        }

        profilePosts.innerHTML = `<i class="fa-solid fa-book"></i><p>${super.numberFormat(storyVisible)} ${await super.translateComponent("profile-tab-1")}</p>`;
        if (storyVisible === 1) profilePosts.innerHTML = `<i class="fa-solid fa-book"></i><p>1 ${await super.translateComponent("profile-story")}</p>`;

        // Like Count
        let likes = 0;
        for (let i = 0; i < data.result.length; i++) {
            if (data.result[i].likes !== null) likes += data.result[i].likes
        };
        profileLikes.innerHTML = `<i class="fa-solid fa-heart"></i><p>${super.numberFormat(likes)} ${await super.translateComponent("profile-tab-2")}</p>`;
        if (likes === 1) profileLikes.innerHTML = `<i class="fa-solid fa-heart"></i><p>1 ${await super.translateComponent("profile-like")}</p>`;

        // Comment Count
        profileComments.innerHTML = `<i class="bi bi-chat-right-text-fill"></i><p>${super.numberFormat(data.result3.length)} ${await super.translateComponent("profile-tab-3")}</p>`;
        if (data.result3.length == 1) profileComments.innerHTML = `<i class="bi bi-chat-right-text-fill"></i><p>1 ${await super.translateComponent("profile-comment")}</p>`;

        // Credit Count
        profileCredits.innerHTML = `<i class="fa-solid fa-fire"></i><p>${super.numberFormat(data.result[0].credits)} ${await super.translateComponent("profile-credits-plural")}</p>`;
        if (data.result[0].credits === 1) profileCredits.innerHTML = `<i class="fa-solid fa-spade"></i><p>1 ${await super.translateComponent("profile-credits-singular")}</p>`;

        // Creation date
        profileDate.innerText = `${await super.translateComponent("profile-creation-date")} ${await super.dateFormat(data.result[0].creationDate, "short")}`

        // Story Loading
        await this.showStories(noPosts, content, isEmpty, data, loggedIn);

        // Tab Switch
        this.#profileView.querySelector(".story").addEventListener("click", () => this.showStories(noPosts, content, isEmpty, data, loggedIn));
        this.#profileView.querySelector(".likes").addEventListener("click", () => this.showLikes(noPosts, isEmpty, data));
        this.#profileView.querySelector(".comments").addEventListener("click", () => this.showComments(noPosts, isEmpty, data, loggedIn));
        this.#profileView.querySelector(".achievements").addEventListener("click", () => this.showAchievements(noPosts, isEmpty, data));
    }

    /**
     *
     * @param noPosts = No content placeholder text
     * @param content = Content of user
     * @param isEmpty = No content placeholder image
     * @param data = Data of user
     * @param loggedIn = Check if user is on his own profile
     * @returns - All stories of user
     */
    async showStories(noPosts, content, isEmpty, data, loggedIn) {

        //Clear content
        const parent = this.#profileView.querySelector(".story-container");
        noPosts.innerText = "";
        isEmpty.style.display = "none";
        parent.innerHTML = "";

        //Switch button styling
        this.#profileView.querySelector(".story").classList.add("active");
        this.#profileView.querySelector(".story").setAttribute('disabled', 'disabled');
        this.#profileView.querySelector(".likes").setAttribute('disabled', 'disabled');
        this.#profileView.querySelector(".comments").setAttribute('disabled', 'disabled');
        this.#profileView.querySelector(".achievements").setAttribute('disabled', 'disabled');

        //Show scrollbar if content length is more than 1
        if (data.result.length === 1) {
            this.#profileView.querySelector(".userContent").style.overflowY = "hidden";
        } else this.#profileView.querySelector(".userContent").style.overflowY = "auto";

        //If there is no posts, show empty screen
        if (data.result[0].id === null) {
            noPosts.innerHTML = `@${data.result[0].user_name} ${await super.translateComponent("profile-placeholder-1")}`;
            isEmpty.style.display = "block";

        } else {

            // Title
            const title = document.createElement("h5");
            title.className = "user-content-title";
            title.innerHTML = `${await super.translateComponent("profile-title-posts")} @${data.result[0].user_name}`;
            parent.appendChild(title);

            //For each story, create story content
            for (let i = 0; i < data.result.length; i++) {

                const tagNames = data.result[i].tagname.split(', ');
                const tagId = data.result[i].tagid.split(', ');
                const tagData = { tagNames, tagId };

                if (data.result[i].anonymous === 1 && loggedIn !== data.result[0].email) {

                } else {
                    await super.constructStory(data.result[i], tagData, false);

                    if (data.result[0].email === loggedIn) {

                        if (document.getElementsByClassName("story active")) {
                            const dateContainer = document.getElementsByClassName("story-date-container")[i];
                            const foldOutButton = document.createElement('button');
                            foldOutButton.className = "story-control-toggle full-size";
                            const panelId = await this.#controlPanelConstructor(dateContainer.parentElement.parentElement.parentElement, data.result[i].url);

                            // Story Item Hover
                            const touchscreen = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
                            if (touchscreen) foldOutButton.style.opacity = 1;
                            dateContainer.parentElement.parentElement.addEventListener("mouseover", () => {
                                foldOutButton.style.opacity = 1;
                            });
                            dateContainer.parentElement.parentElement.addEventListener("mouseleave", () => {
                                if (!foldOutButton.classList.contains("toggle-on") || !touchscreen) foldOutButton.style.opacity = 0;
                            });

                            // Toggle
                            foldOutButton.addEventListener('click', () => {
                                const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                                if (foldOutButton.classList.contains("toggle-off") || foldOutButton.classList.length === 1) {
                                    foldOutButton.classList.remove("toggle-off");
                                    foldOutButton.classList.add("toggle-on");
                                    if (vw <= 820) {
                                        document.getElementById(panelId).style.width = "100%";
                                        document.getElementById(panelId).style.height = "100px";
                                    } else {
                                        document.getElementById(panelId).style.width = "100px"
                                        document.getElementById(panelId).style.height = "100%"
                                    };

                                    document.getElementById(panelId).style.opacity = "1";
                                    foldOutButton.style.opacity = 1;
                                } else {
                                    foldOutButton.classList.remove("toggle-on");
                                    foldOutButton.classList.add("toggle-off");
                                    if (vw <= 820) {
                                        document.getElementById(panelId).style.width = "100%";
                                        document.getElementById(panelId).style.height = "0px";
                                    } else {
                                        document.getElementById(panelId).style.width = "0px"
                                        document.getElementById(panelId).style.height = "100%"
                                    };
                                    document.getElementById(panelId).style.opacity = "0";
                                }

                            });

                            // Icon
                            const foldOutIcon = document.createElement('i');
                            foldOutIcon.className = "fa-solid fa-ellipsis-vertical";
                            foldOutButton.appendChild(foldOutIcon);
                            dateContainer.appendChild(foldOutButton);
                        };
                    };

                    const stories = this.#profileView.querySelector(".story-container");
                    content.appendChild(stories);
                };

                //Prevent switching tab while loading content during loop
                this.#profileView.querySelector(".story").setAttribute('disabled', 'disabled');
                this.#profileView.querySelector(".likes").setAttribute('disabled', 'disabled');
                this.#profileView.querySelector(".comments").setAttribute('disabled', 'disabled');
                this.#profileView.querySelector(".achievements").setAttribute('disabled', 'disabled');

            };
        };

        //Change switch button styling after loading content
        this.#profileView.querySelector(".likes").classList.remove("active");
        this.#profileView.querySelector(".likes").removeAttribute('disabled');
        this.#profileView.querySelector(".comments").classList.remove("active");
        this.#profileView.querySelector(".comments").removeAttribute('disabled');
        this.#profileView.querySelector(".achievements").classList.remove("active");
        this.#profileView.querySelector(".achievements").removeAttribute('disabled');

    };

    async #controlPanelConstructor(host, url, comment) {
        // Parent
        const container = document.createElement('div');
        if (url) {
            container.className = "story-control-panel";
        } else container.className = "comment-control-panel"

        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        container.id = randomNumber;

        // Remove
        const removeButton = document.createElement('button');
        if (url) {
            removeButton.className = "story-control-button story-remove-button";
        } else removeButton.className = "comment-control-button comment-remove-button";

        removeButton.addEventListener('click', async () => {

            if (url) {
                const dialog = await super.customAlert(null, await super.translateComponent("profile-message-1"), "choice");
                if (dialog) {
                    super.customAlert(null, await super.translateComponent("profile-message-2"), "confirmation", null);
                    document.getElementById(randomNumber).parentElement.remove();
                    this.#profileRepository.deleteStory(url);
                    this.#fileRepository.delete("story", url)
                };

            } else {
                const dialogComment = await super.customAlert(null, await super.translateComponent("profile-message-3"), "choice");
                if (dialogComment) {
                    super.customAlert(null, await super.translateComponent("profile-message-4"), "confirmation", null);
                    document.getElementById(randomNumber).parentElement.remove();
                    this.#profileRepository.deleteComment(comment);
                };
            }

        });

        const removeIcon = document.createElement('i');
        removeIcon.className = "fa-solid fa-trash";
        removeButton.appendChild(removeIcon);
        container.appendChild(removeButton);

        // Edit
        const editButton = document.createElement('button');
        editButton.className = "story-control-button story-edit-button";
        editButton.addEventListener('click', () => {
            window.location.href = `#post/edit?id=${url}`;
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
        const editIcon = document.createElement('i');
        editIcon.className = "fa-solid fa-pen";
        editButton.appendChild(editIcon);
        if (url) {
            container.appendChild(editButton);
        }

        // Append
        host.appendChild(container);
        return randomNumber;
    };

    /**
     * Show all liked story of user
     * @param noPosts = No content placeholder text
     * @param isEmpty = No content placeholder image
     * @param data = Data of user
     * @returns - Liked stories
     */
    async showLikes(noPosts, isEmpty, data) {

        //Clear content
        const parent = this.#profileView.querySelector(".story-container");
        noPosts.innerText = "";
        isEmpty.style.display = "none";
        parent.innerHTML = "";

        //Switch button styling
        this.#profileView.querySelector(".likes").classList.add("active");
        this.#profileView.querySelector(".likes").setAttribute('disabled', 'disabled');
        this.#profileView.querySelector(".story").setAttribute('disabled', 'disabled');
        this.#profileView.querySelector(".comments").setAttribute('disabled', 'disabled');
        this.#profileView.querySelector(".achievements").setAttribute('disabled', 'disabled');

        //Show scrollbar if content length is more than 1
        if (data.result2.length === 1) {
            this.#profileView.querySelector(".userContent").style.overflowY = "hidden"
        } else {
            this.#profileView.querySelector(".userContent").style.overflowY = "auto"
        }

        //If user has no likes, show empty screen
        if (data.result2.length === 0 || data.result2[0].id === -1) {
            noPosts.innerHTML = `@${data.result[0].user_name} ${await super.translateComponent("profile-placeholder-2")}`;
            isEmpty.style.display = "block";

        } else {

            // Title
            const title = document.createElement("h5");
            title.className = "user-content-title";
            title.innerHTML = `${await super.translateComponent("profile-title-likes-1")} @${data.result[0].user_name}
            ${await super.translateComponent("profile-title-likes-2")}`;
            parent.appendChild(title);

            //For each story, create story content
            for (let i = 0; i < data.result2.length; i++) {
                const tagNames = data.result2[i].tagname.split(', ');
                const tagId = data.result2[i].tagid.split(', ');
                const tagData = { tagNames, tagId };
                await super.constructStory(data.result2[i], tagData, false);

                //Prevent switching tab while loading content during loop
                this.#profileView.querySelector(".likes").setAttribute('disabled', 'disabled');
                this.#profileView.querySelector(".story").setAttribute('disabled', 'disabled');
                this.#profileView.querySelector(".comments").setAttribute('disabled', 'disabled');
                this.#profileView.querySelector(".achievements").setAttribute('disabled', 'disabled');
            };
        };

        //Change switch button styling after loading content
        this.#profileView.querySelector(".story").classList.remove("active");
        this.#profileView.querySelector(".story").removeAttribute('disabled');
        this.#profileView.querySelector(".comments").classList.remove("active");
        this.#profileView.querySelector(".comments").removeAttribute('disabled');
        this.#profileView.querySelector(".achievements").classList.remove("active");
        this.#profileView.querySelector(".achievements").removeAttribute('disabled');
    };

    /**
     * Show all comments of user
     * @param noPosts = No content placeholder text
     * @param isEmpty = No content placeholder image
     * @param data = Data of user
     * @returns - Comments of user
     */
    async showComments(noPosts, isEmpty, data, loggedIn) {

        //Clear content
        const parent = this.#profileView.querySelector(".story-container");
        noPosts.innerText = "";
        isEmpty.style.display = "none";
        parent.innerHTML = "";

        //Switch button styling
        this.#profileView.querySelector(".comments").classList.add("active");
        this.#profileView.querySelector(".comments").setAttribute('disabled', 'disabled');
        this.#profileView.querySelector(".story").setAttribute('disabled', 'disabled');
        this.#profileView.querySelector(".likes").setAttribute('disabled', 'disabled');
        this.#profileView.querySelector(".achievements").setAttribute('disabled', 'disabled');

        //Show scrollbar if content length is more than 1
        if (data.result3.length === 1) {
            this.#profileView.querySelector(".userContent").style.overflowY = "hidden"
        } else this.#profileView.querySelector(".userContent").style.overflowY = "auto";

        //If user has no comments, show empty screen
        if (data.result3.length == 0) {
            noPosts.innerHTML = `@${data.result[0].user_name} ${await super.translateComponent("profile-placeholder-3")}`;
            isEmpty.style.display = "block";
        } else {
            // Title
            const title = document.createElement("h5");
            title.className = "user-content-title";
            title.innerHTML = `${await super.translateComponent("profile-title-comments")} @${data.result[0].user_name}`;
            parent.appendChild(title);

            //For each user comment, create comment element
            let length = 0;
            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            for (let i = 0; i < data.result3.length; i++) {
                const commentWrapper = document.createElement("div");
                commentWrapper.className = "commentWrapper";

                const commentSection = document.createElement("div");
                commentSection.className = "commentSection";
                commentWrapper.appendChild(commentSection);

                // Profile Picture
                const userPicture = document.createElement("img");
                userPicture.className = "userPicture";
                userPicture.src = `uploads/profile/${data.result[0].user_name}.jpg`;
                commentSection.appendChild(userPicture);

                // Header
                const commentHeader = document.createElement("div");
                commentHeader.className = "commentHeader";

                const commentBox = document.createElement("div");
                commentBox.className = "commentBox";

                const commentInfoWrapper = document.createElement("div");
                commentInfoWrapper.className = "commentInfoWrapper";

                const commentInfo = document.createElement("p");
                commentInfo.className = "commentInfo";
                commentInfo.innerHTML = await super.translateComponent("profile-comment-reaction")

                const commentTitle = document.createElement("p");
                commentTitle.className = "commentTitle";
                commentTitle.innerText = data.result3[i].title;
                commentTitle.addEventListener("click", async () => {
                    window.location.href = `#story-read/${data.result3[i].url}`;
                });
                commentInfoWrapper.appendChild(commentInfo);
                commentInfoWrapper.appendChild(commentTitle);

                const commentDate = document.createElement("p");
                commentDate.className = "commentDate";

                if (vw <= 1320) {
                    commentDate.innerText = await super.dateFormat(data.result3[i].commentDate, "long");
                } else commentDate.innerText = `• ${await super.dateFormat(data.result3[i].commentDate, "long")}`;

                commentHeader.appendChild(commentInfoWrapper);
                commentHeader.appendChild(commentDate);
                commentBox.appendChild(commentHeader);

                // Comment Content
                const commentText = document.createElement("p");
                commentText.className = "commentText";
                commentText.innerText = data.result3[i].comment;
                commentBox.appendChild(commentText);
                commentSection.appendChild(commentBox);

                // Delete Comment
                const deleteButtonContainer = document.createElement("div");
                deleteButtonContainer.className = "deleteBox";
                if (data.result[0].email === loggedIn) {
                    if (document.getElementsByClassName("story active")) {
                        const foldOutButton = document.createElement('button');
                        foldOutButton.className = "story-control-toggle";
                        const panelId = await this.#controlPanelConstructor(commentWrapper, false, data.result3[i].commentID);

                        // Story Item Hover
                        const touchscreen = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
                        if (touchscreen) foldOutButton.style.opacity = 1;
                        commentSection.addEventListener("mouseover", () => {
                            foldOutButton.style.opacity = 1;
                        });
                        commentSection.addEventListener("mouseleave", () => {
                            if (!foldOutButton.classList.contains("toggle-on") || !touchscreen) foldOutButton.style.opacity = 0;
                        });


                        // Toggle
                        foldOutButton.addEventListener('click', () => {

                            if (foldOutButton.classList.contains("toggle-off") || foldOutButton.classList.length === 1) {
                                foldOutButton.classList.remove("toggle-off");
                                foldOutButton.classList.add("toggle-on");

                                length = this.#profileView.querySelectorAll(".comment-remove-button").length
                                for (let j = 0; j < length; j++) {
                                    this.#profileView.querySelectorAll(".comment-remove-button")[j].style.pointerEvents = "auto";
                                }
                                document.getElementById(panelId).style.width = "70px"
                                document.getElementById(panelId).style.opacity = "1";
                                foldOutButton.style.opacity = 1;
                            } else {
                                foldOutButton.classList.remove("toggle-on");
                                foldOutButton.classList.add("toggle-off");

                                length = this.#profileView.querySelectorAll(".comment-remove-button").length
                                for (let j = 0; j < length; j++) {
                                    this.#profileView.querySelectorAll(".comment-remove-button")[j].style.pointerEvents = "none";
                                }
                                document.getElementById(panelId).style.width = "0px";
                                document.getElementById(panelId).style.opacity = "0";
                            };
                        });

                        // Icon
                        const foldOutIcon = document.createElement('i');
                        foldOutIcon.className = "fa-solid fa-ellipsis-vertical";
                        foldOutButton.appendChild(foldOutIcon);
                        deleteButtonContainer.appendChild(foldOutButton);
                        commentSection.appendChild(deleteButtonContainer)
                    };
                };
                this.#profileView.querySelector(".story-container").appendChild(commentWrapper);

                //Prevent switching tab while loading content during loop
                this.#profileView.querySelector(".comments").setAttribute('disabled', 'disabled');
                this.#profileView.querySelector(".story").setAttribute('disabled', 'disabled');
                this.#profileView.querySelector(".likes").setAttribute('disabled', 'disabled');
                this.#profileView.querySelector(".achievements").setAttribute('disabled', 'disabled');
            };
        };

        //Change switch button styling after loading content
        this.#profileView.querySelector(".story").classList.remove("active");
        this.#profileView.querySelector(".story").removeAttribute('disabled');
        this.#profileView.querySelector(".likes").classList.remove("active");
        this.#profileView.querySelector(".likes").removeAttribute('disabled');
        this.#profileView.querySelector(".achievements").classList.remove("active");
        this.#profileView.querySelector(".achievements").removeAttribute('disabled');
    };

    async showAchievements(noPosts, isEmpty, data) {
        // Clear content
        const parent = this.#profileView.querySelector(".story-container");
        noPosts.innerText = "";
        isEmpty.style.display = "none";
        parent.innerHTML = "";

        // Switch button styling
        this.#profileView.querySelector(".achievements").classList.add("active");
        this.#profileView.querySelector(".achievements").setAttribute('disabled', 'disabled');
        this.#profileView.querySelector(".story").setAttribute('disabled', 'disabled');
        this.#profileView.querySelector(".likes").setAttribute('disabled', 'disabled');
        this.#profileView.querySelector(".comments").setAttribute('disabled', 'disabled');

        // Title
        const title = document.createElement("h5");
        title.className = "user-content-title";
        title.innerHTML = `${await super.translateComponent("profile-title-achievements")} @${data.result[0].user_name}`;
        parent.appendChild(title);

        // Achievement Parent
        const achievementContainer = document.createElement("section");
        achievementContainer.className = "achievement-container";
        parent.appendChild(achievementContainer);

        // Load Achievements
        let achieved = 0;
        const achievementCount = 10;
        for (const key in data.result[0]) {
            if (!/^(?:0[1-9]|10)$/.test(key.slice(0, 2))) continue;

            const achievementValue = data.result[0][key];
            this.#achievementConstructor(key.slice(0, 2), achievementContainer,
                await super.translateComponent(`profile-achievement-${key.slice(0, 2)}-title`),
                await super.translateComponent(`profile-achievement-${key.slice(0, 2)}-desc`),
                await super.dateFormat(achievementValue, "short"), achievementValue);

            if (achievementValue !== null) achieved++;
        };
        title.innerHTML += ` (${achieved}/${achievementCount})`;

        //Change switch button styling after loading content
        this.#profileView.querySelector(".story").classList.remove("active");
        this.#profileView.querySelector(".story").removeAttribute('disabled');
        this.#profileView.querySelector(".likes").classList.remove("active");
        this.#profileView.querySelector(".likes").removeAttribute('disabled');
        this.#profileView.querySelector(".comments").classList.remove("active");
        this.#profileView.querySelector(".comments").removeAttribute('disabled');
    };

    /**
     * Create and append an achievement container.
     * @param {number} index - The current achievement number.
     * @param {Element} host - Where to append to. Parent of the achievement.
     * @param {string} achievementTitle - Title of the achievement.
     * @param {string} achievementDescription - Description of the achievement.
     * @param {string} achievementDate - Date of achievement. Formatted with the 'dateFormat' function.
     * @param {boolean} earned - If the acievement has been earned already.
     */
    async #achievementConstructor(index, host, achievementTitle, achievementDescription, achievementDate, earned) {
        const container = document.createElement("div");
        container.className = "user-achievement";
        container.id = `user-achievement-${index}`;

        // Header
        const achievementHeader = document.createElement("section");
        achievementHeader.className = "user-achievement-header";

        const title = document.createElement("p");
        title.className = "user-achievement-title";
        title.innerHTML = achievementTitle;

        const image = document.createElement("img");
        image.className = "user-achievement-image";
        image.src = `assets/img/svg/trophy-solid.svg`

        // Content
        const achievementContent = document.createElement("section");
        achievementContent.className = "user-achievement-content";

        const description = document.createElement("p");
        description.className = "user-achievement-description";
        description.innerHTML = achievementDescription;

        const date = document.createElement("p");
        date.className = "user-achievement-date";
        date.innerHTML = `${await super.translateComponent("profile-achievements-date")} ${achievementDate}`;

        if (!earned) {
            container.classList.add("locked");
            image.src = "assets/img/svg/lock-solid.svg";
            date.innerHTML = ``;
        };

        // Append Children
        achievementHeader.appendChild(title);
        achievementHeader.appendChild(image);
        container.appendChild(achievementHeader);
        achievementContent.appendChild(description);
        achievementContent.appendChild(date);
        container.appendChild(achievementContent);

        // Append Parent
        if (!earned) {
            host.appendChild(container);
        } else host.prepend(container);
    };
};