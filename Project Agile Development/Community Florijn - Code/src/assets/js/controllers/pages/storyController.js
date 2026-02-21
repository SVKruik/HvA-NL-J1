/**
 * Controller responsible for all events in the 'story' view.
 * @author Stefan Kruik & Donovan Tjokrodimedjo
 */

import { StoryRepository } from "../../repositories/storyRepository.js";
import { Controller } from "../controller.js";
import { App } from "../../app.js"
import { StoryReadRepository } from "../../repositories/storyReadRepository.js";
import { SettingsRepository } from "../../repositories/settingsRepository.js";

export class StoriesController extends Controller {
    #storyView;
    #storyRepository;
    #storyReadRepository;
    #settingsRepository;
    #App

    /**
     * Constructor of the view.
     */
    constructor() {
        super();
        this.#storyRepository = new StoryRepository();
        this.#storyReadRepository = new StoryReadRepository();
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
        this.#storyView = await super.loadHtmlIntoContent("html_views/story.html");

        // Tab Session
        const urlPage = parseInt(window.location.hash.slice(7));
        if (window.location.hash.match(/^#story\?\d+$/)) {
            window.location.href = `${baseUrl}/#story?${urlPage}`;
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            this.#App.sessionManager.set("currentPage", urlPage);
        } else if (parseInt(this.#App.sessionManager.get("currentPage"))) {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            return window.location.href = `${baseUrl}/#story?${parseInt(this.#App.sessionManager.get("currentPage"))}`;
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            return window.location.href = `${baseUrl}/#story?1`;
        };

        // Initiate
        super.translateView(true, "Story");
        const tagData = (await this.#storyRepository.tagInfo()).result;
        this.#loadLeaderboard();

        // Age Restriction
        const email = this.#App.sessionManager.get("email");
        let settingData;
        let explicit = this.#App.sessionManager.get("explicit") ?? 1;
        const ageLimit = 16;
        if (email) {
            settingData = (await this.#settingsRepository.getUserSettings(email)).result[0];
            const userData = (await this.#storyReadRepository.userInfoEmail(email)).result[0];
            const age = super.getAge(userData.birthdate);
            const modifierInput = this.#storyView.querySelector("#modifier-2");
            if (age <= ageLimit) {
                explicit = 0;
                modifierInput.disabled = true;
                modifierInput.checked = false;
                modifierInput.parentElement.style.opacity = "0.3";
                modifierInput.parentElement.style.cursor = "not-allowed";
                modifierInput.style.cursor = "not-allowed";
                modifierInput.nextElementSibling.style.cursor = "not-allowed";
            } else {
                // Explicit Filtering
                if (settingData.show_explicit === 1) {
                    this.#App.sessionManager.set("explicit", 1);
                    explicit = 1;
                } else {
                    this.#App.sessionManager.set("explicit", 0);
                    explicit = 0;
                };
            };
        };

        // Filter Container Fold
        this.#storyView.querySelector("#filter-tag-fold").addEventListener("click", () => this.#toggleFold("tag", null));
        this.#storyView.querySelector("#filter-story-title-fold").addEventListener("click", () => this.#toggleFold("story-title", null));
        this.#storyView.querySelector("#filter-story-content-fold").addEventListener("click", () => this.#toggleFold("story-content", null));
        this.#storyView.querySelector("#filter-author-fold").addEventListener("click", () => this.#toggleFold("author", null));
        this.#storyView.querySelector("#filter-sort-fold").addEventListener("click", () => this.#toggleFold("sort", null));
        this.#storyView.querySelector("#filter-modifier-fold").addEventListener("click", () => this.#toggleFold("modifier", null));
        const foldState = this.#App.sessionManager.get("foldState") || {
            "tag": true,
            "story-title": true,
            "story-content": true,
            "author": true,
            "sort": true,
            "modifier": true,
        };
        if (!this.#App.sessionManager.get("foldState")) this.#App.sessionManager.set("foldState", foldState);
        for (let i = 0; i < Object.keys(foldState).length; i++) {
            this.#toggleFold(Object.keys(foldState)[i], Object.values(foldState)[i]);
        };

        // Tag Filters
        const tags = document.getElementsByName("tag");
        for (let i = 0; i < tags.length; i++) {
            tags[i].addEventListener("click", () => {
                this.#queryFilters(tagData);
            });
        };

        // Sort Filters
        const radios = document.getElementsByName("sort");
        if (this.#App.sessionManager.get("sortColumn") && this.#App.sessionManager.get("sortType")) {
            const rawSortColumn = this.#App.sessionManager.get("sortColumn").toLowerCase();
            const rawSortType = this.#App.sessionManager.get("sortType").toLowerCase();
            let checkValue;
            if (rawSortColumn.includes("sum") && rawSortType.includes("desc")) {
                checkValue = "like-desc";
            } else if (rawSortColumn.includes("sum") && rawSortType.includes("asc")) {
                checkValue = "like-asc";
            } else if (rawSortColumn.includes("count") && rawSortType.includes("desc")) {
                checkValue = "comm-desc";
            } else if (rawSortColumn.includes("count") && rawSortType.includes("asc")) {
                checkValue = "comm-asc";
            } else if (rawSortColumn.includes("date") && rawSortType.includes("desc")) {
                checkValue = "date-desc";
            } else if (rawSortColumn.includes("date") && rawSortType.includes("asc")) {
                checkValue = "date-asc";
            };
            radios.forEach(radio => {
                if (radio.value === checkValue) radio.checked = true;
                radio.addEventListener("change", () => {
                    this.#queryFilters(tagData);
                });
            });
        } else {
            radios.forEach(radio => {
                radio.addEventListener("change", () => {
                    this.#queryFilters(tagData);
                });
            });
        };

        // Modifier Filters
        const verified = this.#App.sessionManager.get("verified") || 0;
        const modifiers = document.getElementsByName("modifier");
        for (let i = 0; i < modifiers.length; i++) {
            modifiers[i].addEventListener("click", () => {
                this.#queryFilters(tagData);
            });
        };
        const explicitInput = this.#storyView.querySelector("#modifier-2");
        explicitInput.addEventListener("click", () => {
            if (!email) return;
            let value;
            if (explicitInput.checked) {
                value = 1;
            } else value = 0;
            this.#settingsRepository.updateExplicit(email, value);
        });

        // Title Filter
        const titleInput = this.#storyView.querySelector("#title-input");
        const titleSearch = this.#storyView.querySelector("#title-search");
        titleInput.addEventListener("keyup", async event => {
            if (event.key === "Shift" || event.key === "Alt" || event.key === "Control") return;
            if (titleInput.value.length === titleInput.maxLength) return;
            if (titleInput.value.length === 0 && event.key === "Backspace") {
                if (this.#App.sessionManager.get("titleQuery").length === 0) {
                    this.#App.sessionManager.set("currentPage", 1);
                    return this.#App.sessionManager.set("titleQuery", "");
                };
            };
            this.#queryFilters(tagData);
        });
        titleSearch.addEventListener("click", async () => {
            if (titleInput.value.length === 0) return;
            this.#queryFilters(tagData);
        });

        // Content Filter
        const contentInput = this.#storyView.querySelector("#content-input");
        const contentSearch = this.#storyView.querySelector("#content-search");
        contentInput.addEventListener("keyup", async event => {
            if (event.key === "Shift" || event.key === "Alt" || event.key === "Control") return;
            if (contentInput.value.length === contentInput.maxLength) return;
            if (contentInput.value.length === 0 && event.key === "Backspace") {
                if (this.#App.sessionManager.get("contentQuery").length === 0) {
                    this.#App.sessionManager.set("currentPage", 1);
                    return this.#App.sessionManager.set("contentQuery", "");
                };
            };
            this.#queryFilters(tagData);
        });
        contentSearch.addEventListener("click", async () => {
            if (contentInput.value.length === 0) return;
            this.#queryFilters(tagData);
        });

        // Author Filter
        const authorInput = this.#storyView.querySelector("#author-input");
        const authorSearch = this.#storyView.querySelector("#author-search");
        authorInput.addEventListener("keyup", async event => {
            if (event.key === "Shift" || event.key === "Alt" || event.key === "Control") return;
            if (authorInput.value.length === authorInput.maxLength) return;
            if (authorInput.value.length === 0 && event.key === "Backspace") {
                if (this.#App.sessionManager.get("authorQuery").length === 0) {
                    this.#App.sessionManager.set("currentPage", 1);
                    return this.#App.sessionManager.set("authorQuery", "");
                };
            };
            this.#queryFilters(tagData);
        });
        authorSearch.addEventListener("click", async () => {
            if (authorInput.value.length === 0) return;
            this.#queryFilters(tagData);
        });

        // Filter Toggle
        const filterOverlay = this.#storyView.querySelector("#filter-spec-overlay");
        const openFilterButton = this.#storyView.querySelector("#filter-open");
        const closeFilterButton = this.#storyView.querySelector("#filter-close");
        const filterContainer = this.#storyView.getElementsByClassName("filter-container")[0];

        openFilterButton.addEventListener("click", () => {
            filterContainer.style.height = "100%";
            filterOverlay.style.opacity = "1";
            filterOverlay.style.display = "block";
        });
        closeFilterButton.addEventListener("click", () => {
            filterContainer.style.height = "0%";
            filterOverlay.style.opacity = "0";
            setTimeout(() => {
                filterOverlay.style.display = "none";
            }, 1000);
        });
        filterOverlay.addEventListener("click", () => {
            filterContainer.style.height = "0%";
            filterOverlay.style.opacity = "0";
            setTimeout(() => {
                filterOverlay.style.display = "none";
            }, 1000);
        });

        // Leaderboard Toggle
        const openLeaderboardButton = this.#storyView.querySelector("#leaderboard-open");
        const closeLeaderboardButton = this.#storyView.querySelector("#leaderboard-close");
        const leaderBoardContainer = this.#storyView.getElementsByClassName("leaderboard-container")[0];
        const leaderboardOverlay = this.#storyView.querySelector("#leaderboard-spec-overlay");

        openLeaderboardButton.addEventListener("click", () => {
            leaderBoardContainer.style.display = "block";
            leaderBoardContainer.style.height = "100%";
            leaderboardOverlay.style.opacity = "1";
            leaderboardOverlay.style.display = "block";
        });
        closeLeaderboardButton.addEventListener("click", () => {
            leaderBoardContainer.style.height = "0%";
            leaderboardOverlay.style.opacity = "0";
            setTimeout(() => {
                leaderboardOverlay.style.display = "none";
            }, 1000);
        });
        leaderboardOverlay.addEventListener("click", () => {
            leaderBoardContainer.style.height = "0%";
            leaderboardOverlay.style.opacity = "0";
            setTimeout(() => {
                leaderboardOverlay.style.display = "none";
            }, 1000);
        });

        // Fetch Stories
        const titleQuery = this.#App.sessionManager.get("titleQuery") || "";
        titleInput.value = titleQuery;
        const contentQuery = this.#App.sessionManager.get("contentQuery") || "";
        contentInput.value = contentQuery;
        const authorQuery = this.#App.sessionManager.get("authorQuery") || "";
        authorInput.value = authorQuery;
        const sortColumn = this.#App.sessionManager.get("sortColumn") || "story.date";
        const sortQuery = this.#App.sessionManager.get("sortType") || "DESC";
        const tagQuery = this.#App.sessionManager.get("tagArray") || [];
        if (verified === 1) {
            this.#storyView.querySelector("#modifier-1").checked = true;
        } else this.#storyView.querySelector("#modifier-1").checked = false;
        if (explicit === 1) {
            this.#storyView.querySelector("#modifier-2").checked = true;
        } else this.#storyView.querySelector("#modifier-2").checked = false;
        for (let i = 0; i < tagQuery.length; i++) {
            this.#storyView.querySelector(`#tagChk-${this.#App.sessionManager.get("tagArray")[i]}`).checked = true;
        };
        await this.#loadStories(sortColumn, sortQuery, tagQuery, titleQuery, contentQuery, authorQuery, tagData, explicit, verified);

        // Clear Filters
        if (this.#storyView.getElementsByClassName("filter-clear-button")[0]) {
            this.#storyView.getElementsByClassName("filter-clear-button")[0].addEventListener("click", async () => {
                await this.#loadStories("story.date", "DESC", [], "", "", "", tagData, this.#App.sessionManager.get("explicit") ?? 1, 0);

                // Inputs
                this.#storyView.querySelector("#title-input").value = "";
                this.#App.sessionManager.set("titleQuery", "");
                this.#storyView.querySelector("#content-input").value = "";
                this.#App.sessionManager.set("contentQuery", "");
                this.#storyView.querySelector("#author-input").value = "";
                this.#App.sessionManager.set("authorQuery", "");
                this.#App.sessionManager.set("verified", 0);

                // Sort
                for (let i = 1; i < 7; i++) {
                    this.#storyView.querySelector(`#sortRadio${i}`).checked = false;
                };
                this.#storyView.querySelector(`#sortRadio5`).checked = true;
                this.#App.sessionManager.set("sortColumn", "date");
                this.#App.sessionManager.set("sortType", "DESC");

                // Tags
                this.#App.sessionManager.set("tagArray", []);
                for (let i = 0; i < tags.length; i++) {
                    tags[i].checked = false;
                };

                // Modifiers
                this.#storyView.querySelector("#modifier-1").checked = false;
            });
        }

        // Scroll To Top
        const scrollButton = this.#storyView.querySelector(".scroll-button");
        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            scrollButton.classList.add("scroll-button-hidden");
            this.#App.sessionManager.set("scrollHeight", 0);
        });
        window.onscroll = () => {
            const scrollHeight = document.documentElement.scrollTop
            if (scrollHeight > 250) {
                this.#App.sessionManager.set("scrollHeight", scrollHeight);
                scrollButton.classList.remove("scroll-button-hidden");
            } else {
                scrollButton.classList.add("scroll-button-hidden");
                this.#App.sessionManager.set("scrollHeight", 0);
            };
        };

        // Scroll Height
        const targetScrollHeight = this.#App.sessionManager.get("scrollHeight") || 0;
        if (targetScrollHeight > 0) window.scrollTo({ top: targetScrollHeight, left: 0, behavior: 'smooth' });
    };

    /**
     * Load the stories from the database.
     * @param {string} sortColumn - The database column to order by.
     * @param {string} sortType - The database sort order. Descending or ascending order.
     * @param {Array} tagArray - The tags that are allowed.
     * @param {string} title - The title of the story.
     * @param {string} content - The inner content of the story.
     * @param {string} author - The author of the story.
     * @param {Array} tagData - Tag info.
     * @param {number} explicit - If explicit stories are allowed.
     * @param {number} verified - If non-verified stories are allowed.
     * @returns - The story data.
     * @async
     * @private
     */
    async #loadStories(sortColumn, sortType, tagArray, title, content, author, tagData, explicit, verified) {
        // Data
        const storyDataGlobal = await this.#storyRepository.loadStoryData(sortColumn, sortType, tagArray, title, content, author, null, null, explicit, verified);
        const storyCount = storyDataGlobal.result.length;
        const storyCountPerTab = 6;
        const tabCount = Math.ceil(storyCount / storyCountPerTab);
        const container = this.#storyView.getElementsByClassName("story-container")[0];
        const urlPage = parseInt(window.location.hash.slice(7));

        // Construct
        container.innerHTML = "";
        this.#loadTagColors(storyDataGlobal.result, tagData);
        if (storyDataGlobal.result.length === 0) return super.createStoryPlaceholder(await super.translateComponent("story-placeholder"), "Search", "story-container");
        if (urlPage > tabCount) return window.location.href = `${baseUrl}/#story?${tabCount}`;
        if (urlPage === 0) return window.location.href = `${baseUrl}/#story?1`;
        for (let i = urlPage * storyCountPerTab - storyCountPerTab; i < urlPage * storyCountPerTab; i++) {
            if (storyDataGlobal.result[i]) {
                const tagNames = storyDataGlobal.result[i].tagname.split(", ");
                const tagId = storyDataGlobal.result[i].tagid.split(", ");
                const tagData = { tagNames, tagId };
                await super.constructStory(storyDataGlobal.result[i], tagData, false);
            };
        };

        // After Rendering
        this.#paginationConstructor(tabCount);
        return storyDataGlobal.result;
    };

    /**
     * Fill the leaderboard with data.
     * @private
     */
    async #loadLeaderboard() {
        const data = await this.#storyRepository.loadLeaderboard();
        const nameSuffix = await super.translateComponent("story-leaderboard-match");

        // General Loading
        for (let i = 0; i < data.result.length; i++) {
            const length = document.querySelectorAll(`#leaderboard-${i + 1}-image`).length;
            let name = data.result[i].name;
            if (`@${this.#App.sessionManager.get("userName")}` === data.result[i].username) name += ` (${nameSuffix})`;

            for (let j = 0; j < length; j++) {
                document.querySelectorAll(`#leaderboard-${i + 1}-image`)[j].src = data.result[i].image;

                document.querySelectorAll(`#leaderboard-${i + 1}-image`)[j].addEventListener('error', () => {
                    document.querySelectorAll(`#leaderboard-${i + 1}-image`)[j].src = `${baseUrl}/assets/img/icons/default.svg`;
                }, { once: true });

                document.querySelectorAll(`#leaderboard-${i + 1}-name`)[j].innerHTML = name;
                document.querySelectorAll(`#leaderboard-${i + 1}-username`)[j].innerHTML = data.result[i].username;
                document.querySelectorAll(`#leaderboard-${i + 1}-count`)[j].innerHTML = super.numberFormat(data.result[i].credits);
                document.querySelectorAll(`#leaderboard-item-${i + 1}`)[j].href = data.result[i].link;
                if (i + 1 > 3 && name.includes(nameSuffix)) document.querySelectorAll(`#leaderboard-item-${i + 1}`)[j].style.border = "2px solid var(--fill)";
            };
        };

        // Logged-in Position Loading
        const usernameRaw = this.#App.sessionManager.get("userName") || undefined;
        if (!usernameRaw) return;
        const username = `@${usernameRaw}`;
        const match = data.result.find(obj => obj.username === username);

        if (match.position > 10) {
            const length = document.querySelectorAll(`#leaderboard-10-image`).length;
            this.#storyView.querySelector(".position-splitter").style.display = "block";
            for (let j = 0; j < length; j++) {
                document.querySelectorAll(`#leaderboard-10-image`)[j].src = match.image;
                document.querySelectorAll(`#leaderboard-10-name`)[j].innerHTML = `${match.name} (${nameSuffix})`;
                document.querySelectorAll(`#leaderboard-10-username`)[j].innerHTML = match.username;
                document.querySelectorAll(`#leaderboard-10-count`)[j].innerHTML = super.numberFormat(match.credits);
                document.querySelectorAll(`#leaderboard-10-position`)[j].innerHTML = `#${match.position}`;
                document.querySelectorAll(`#leaderboard-item-10`)[j].href = match.link;
                document.querySelectorAll(`#leaderboard-item-10`)[j].style.border = "2px solid var(--fill)";
            };
        };
    };

    /**
     * Constructor for pagination system.
     * @param {number} tabCount - The amount of pagination elements to add.
     * @async
     * @private
     */
    async #paginationConstructor(tabCount) {
        const urlPage = parseInt(window.location.hash.slice(7));
        const container = document.createElement("div");
        container.className = "story-tab-container";

        // Previous
        const previousButton = document.createElement("button");
        previousButton.className = "story-tab-button";
        previousButton.innerHTML = "<i class='fa-solid fa-angle-left'></i>";
        previousButton.id = "story-tab-previous";
        previousButton.addEventListener("click", () => {
            if (urlPage > 1) window.location.href = `${baseUrl}/#story?${urlPage - 1}`;
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });

        if (urlPage === 1) {
            previousButton.classList.add("disabled");
        } else previousButton.classList.remove("disabled");

        // Numbers
        const numberContainer = document.createElement("div");
        numberContainer.className = "story-tab-numbers";
        for (let i = 1; i < tabCount + 1; i++) {
            const number = document.createElement("div");
            number.className = "story-tab-number";
            number.innerHTML = i;
            number.id = `story-tab-${i}`;
            number.addEventListener("click", () => {
                window.location.href = `${baseUrl}/#story?${i}`;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            });
            numberContainer.appendChild(number);
        };

        // Next
        const nextButton = document.createElement("button");
        nextButton.className = "story-tab-button";
        nextButton.innerHTML = "<i class='fa-solid fa-angle-right'></i>";
        nextButton.id = "story-tab-next";
        nextButton.addEventListener("click", () => {
            if (urlPage !== tabCount) window.location.href = `${baseUrl}/#story?${urlPage + 1}`;
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });

        if (urlPage === tabCount) {
            nextButton.classList.add("disabled");
        } else nextButton.classList.remove("disabled");

        // Append
        container.appendChild(previousButton);
        container.appendChild(numberContainer);
        container.appendChild(nextButton);
        this.#storyView.getElementsByClassName("story-container")[0].appendChild(container);

        // Active Page
        if (!this.#storyView.querySelector(`#story-tab-${urlPage}`)) return;
        this.#storyView.querySelector(`#story-tab-${urlPage}`).style.backgroundColor = "var(--fill)";
        this.#storyView.querySelector(`#story-tab-${urlPage}`).addEventListener("mouseover", () => {
            this.#storyView.querySelector(`#story-tab-${urlPage}`).style.backgroundColor = "var(--alt)";
        });
        this.#storyView.querySelector(`#story-tab-${urlPage}`).addEventListener("mouseleave", () => {
            this.#storyView.querySelector(`#story-tab-${urlPage}`).style.backgroundColor = "var(--fill)";
        });
    };

    /**
     * Search filter collapsible.
     * @param {string} container - What filter container to fold in/fold out.
     * @param {boolean} target - Target rotation. True for folded out, false for folded in.
     * @private
     */
    #toggleFold(container, target) {
        const content = this.#storyView.getElementsByClassName(`filter-${container}`)[0];
        const foldBtn = this.#storyView.querySelector(`#filter-${container}-fold`);
        if (target || content.style.maxHeight) {
            content.style.maxHeight = null;
            foldBtn.style.rotate = "0deg";

            // Session
            let session = JSON.parse(localStorage.getItem("session"));
            session.foldState[container] = true;
            localStorage.setItem("session", JSON.stringify(session));
        } else if (!target || !content.style.maxHeight) {
            content.style.maxHeight = "75px";
            foldBtn.style.rotate = "90deg";

            // Session
            let session = JSON.parse(localStorage.getItem("session"));
            session.foldState[container] = false;
            localStorage.setItem("session", JSON.stringify(session));
        };
    };

    /**
     * Fetch all filter values and query the database with this data.
     * @param {Array} tagData - Tag info.
     * @async
     * @private
     */
    async #queryFilters(tagData) {
        this.#storyView.getElementsByClassName("story-container")[0].innerHTML = "";

        // Get Filters
        const radios = document.getElementsByName("sort");
        const tags = document.getElementsByName("tag");
        const verifiedInput = this.#storyView.querySelector("#modifier-1");
        const explicitInput = this.#storyView.querySelector("#modifier-2");
        const titleInput = this.#storyView.querySelector("#title-input");
        const contentInput = this.#storyView.querySelector("#content-input");
        const authorInput = this.#storyView.querySelector("#author-input");

        let sortColumn;
        let sortType;
        let tagArray = [];
        let titleQuery = "";
        let contentQuery = "";
        let authorQuery = "";
        let verifiedValue = 0;
        let explicitValue = 0;

        // Tags
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].checked === true) {
                tagArray.push(tags[i].defaultValue);
            } else {
                const index = tagArray.indexOf(tags[i].defaultValue);
                if (index > -1) tagArray.splice(index, 1);
            };
        };

        // Modifiers
        if (verifiedInput.checked) verifiedValue = 1;
        const verified = verifiedValue;
        if (explicitInput.checked) explicitValue = 1;
        const explicit = explicitValue;

        // Sort
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked === true) {
                const value = radios[i].defaultValue;
                sortColumn = value.slice(0, 4);
                sortType = value.slice(value.length - 4);

                // Format for database query
                if (sortColumn === "like") {
                    sortColumn = "SUM(IFNULL(user_like.value, 0))";
                } else if (sortColumn === "comm") sortColumn = "COUNT(comment.id)";

                if (sortType === "desc") {
                    sortType = "DESC";
                } else if (sortType === "-asc") sortType = "ASC";
            };
        };

        // Uploading to session
        this.#App.sessionManager.set("sortColumn", sortColumn);
        this.#App.sessionManager.set("sortType", sortType);
        this.#App.sessionManager.set("tagArray", tagArray);
        this.#App.sessionManager.set("titleQuery", titleInput.value);
        this.#App.sessionManager.set("contentQuery", contentInput.value);
        this.#App.sessionManager.set("authorQuery", authorInput.value);
        this.#App.sessionManager.set("verified", verified);
        this.#App.sessionManager.set("explicit", explicit);

        // Title
        titleQuery = this.#App.sessionManager.get("titleQuery") || titleInput.value;

        // Content
        contentQuery = this.#App.sessionManager.get("contentQuery") || contentInput.value;

        // Author
        authorQuery = this.#App.sessionManager.get("authorQuery") || authorInput.value;

        await this.#loadStories(sortColumn, sortType, tagArray, titleQuery, contentQuery, authorQuery, tagData, explicit, verified);
    };

    /**
     * Load the color and tag count for each tag filter.
     * @param {Array} storyData - Array of stories.
     * @param {Array} tagData - Tag info.
     * @async
     * @private
     */
    async #loadTagColors(storyData, tagData) {
        const language = this.#App.sessionManager.get("viewLanguage") || "nl-NL";

        // Merge Tags
        const tagArray = [];
        for (let i = 0; i < storyData.length; i++) {
            const storyArray = storyData[i].tagid.split(", ");
            tagArray.push(...storyArray);
        };

        // Count
        const tagCountObject = {};
        for (let i = 0; i < tagArray.length; i++) {
            const value = tagArray[i];
            if (tagCountObject[value]) {
                tagCountObject[value]++;
            } else tagCountObject[value] = 1;
        };

        // Display
        for (let i = 0; i < tagData.length; i++) {
            let labelName = "";
            if (language === "nl-NL") {
                labelName = tagData[i].name;
            } else labelName = await super.translateComponent(`story-tag-${i + 1}`);

            const id = tagData[i].id;
            if (!this.#storyView.querySelector(`#tagLbl-${id}`) && !this.#storyView.querySelector(`#tagNr-${id}`)) return;
            this.#storyView.querySelector(`#tagLbl-${id}`).innerHTML = labelName;
            if (tagCountObject[id]) {
                this.#storyView.querySelector(`#tagLbl-${id}`).innerHTML += ` (${tagCountObject[id]})`;
                this.#storyView.querySelector(`#tagNr-${id}`).style.backgroundColor = `var(--tag-color-${tagData[i].id})`;
                this.#storyView.querySelector(`#tagLbl-${id}`).style.color = "var(--alt)";
                this.#storyView.querySelector(`#tagChk-${id}`).style.border = "1px solid var(--alt)";
            } else {
                this.#storyView.querySelector(`#tagLbl-${id}`).style.color = "var(--border)";
                this.#storyView.querySelector(`#tagNr-${id}`).style.backgroundColor = "var(--fill)";
                this.#storyView.querySelector(`#tagChk-${id}`).style.border = "1px solid var(--border)";
            };
        };
    };
};