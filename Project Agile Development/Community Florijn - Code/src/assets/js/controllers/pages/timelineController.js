/**
 * Controller responsible for all events in the 'timeline' view.
 * @author Stefan Kruik
 */

import { App } from "../../app.js";
import { Controller } from "../controller.js";
import { StoryRepository } from "../../repositories/storyRepository.js";
import { HomeRepository } from "../../repositories/homeRepository.js";
import { TimelineRepository } from "../../repositories/timelineRepository.js";

export class TimelineController extends Controller {
    #timelineView;
    #storyRepository;
    #homeRepository;
    #timelineRepository;
    #App;

    /**
     * Constructor of the view.
     */
    constructor() {
        super();
        this.#App = App;
        this.#storyRepository = new StoryRepository();
        this.#homeRepository = new HomeRepository();
        this.#timelineRepository = new TimelineRepository();
        this.#setupView();
    };

    /**
     * Load all the elements and data into the view.
     * @async
     * @private
     */
    async #setupView() {
        this.#timelineView = await super.loadHtmlIntoContent("html_views/timeline.html");
        super.translateView(true, "Timeline");
        const lowerBound = 1968;

        // Story of the Week
        const SotWData = await this.#homeRepository.getStoryOfTheWeek();
        let SotWURL = "No SotW yet.";
        if (SotWData.sotw.length > 0) SotWURL = SotWData.sotw[0].url;

        // Filling Timeline
        const oddTimeline = this.#timelineView.getElementsByClassName("timeline-odd")[0];
        const evenTimeline = this.#timelineView.getElementsByClassName("timeline-even")[0];
        const currentYear = new Date().getFullYear();
        const storyYear = this.#App.sessionManager.get("timelineYear") || currentYear;
        for (let i = currentYear; i >= lowerBound; i--) {
            if (this.#isOdd(i) === 1) {
                this.#yearConstructor(oddTimeline, i, SotWURL);
            } else {
                this.#yearConstructor(evenTimeline, i, SotWURL);
            };
        };

        // Story of the Week Mark
        if (SotWData.sotw.length > 0) {
            const SotWYear = SotWData.sotw[0].year;
            for (let i = 0; i < this.#timelineView.querySelector(`#year-${SotWYear}`).childNodes.length; i++) {
                this.#timelineView.querySelector(`#year-${SotWYear}`).childNodes[i].style.backgroundColor = "#F2D388";
            };
        };

        // Currently Selected Year
        for (let i = 0; i < this.#timelineView.querySelector(`#year-${storyYear}`).childNodes.length; i++) {
            this.#timelineView.querySelector(`#year-${storyYear}`).childNodes[i].classList.remove("empty", "inactive");
        };

        // Story Data Loading
        const storyLoading = await this.#loadStories("story.date", "DESC", [], undefined, undefined, undefined, storyYear, SotWURL);
        this.#timelineView.getElementsByClassName("current-year")[0].innerHTML = storyYear;
        await this.#storyCount();

        // Sorting
        const timelineSort = this.#timelineView.getElementsByClassName("story-sort-selector")[0];
        timelineSort.addEventListener("change", async () => {
            await this.#prepareStories(this.#App.sessionManager.get("timelineYear"), SotWURL);
        });

        // Count Dependent Coloring
        for (let i = 0; i < this.#timelineView.getElementsByClassName("year-item-connector").length; i++) {
            if (!this.#timelineView.getElementsByClassName("year-item-box")[i].innerHTML.includes(storyYear)) {
                if (this.#timelineView.getElementsByClassName("year-item-box")[i].textContent.length !== 4) {
                    this.#timelineView.getElementsByClassName("year-item-box")[i].classList.add("inactive");
                    this.#timelineView.getElementsByClassName("year-item-connector")[i].classList.add("inactive");
                    this.#timelineView.getElementsByClassName("year-item-bridge")[i].classList.add("inactive");
                } else {
                    this.#timelineView.getElementsByClassName("year-item-box")[i].classList.add("empty");
                    this.#timelineView.getElementsByClassName("year-item-connector")[i].classList.add("empty");
                    this.#timelineView.getElementsByClassName("year-item-bridge")[i].classList.add("empty");
                };
            };
        };

        // Scroll
        setTimeout(() => {
            const container = document.getElementsByClassName("story-container")[0];
            const scrollTarget = this.#App.sessionManager.get("timelineAnchor");
            if (!scrollTarget) return;
            const target = document.getElementById(scrollTarget);

            const offset = target.offsetTop - container.offsetTop;
            container.scrollTo({ top: offset, behavior: 'smooth' });
            this.#App.sessionManager.set("timelineAnchor", null);
        }, 400);
    };

    /**
     * Create and append a year container to the timeline.
     * @param {Element} timeline - Where to append.
     * @param {number} year - The year.
     * @param {string} SotWURL - The URL of the current SotW.
     * @async
     * @private
     */
    async #yearConstructor(timeline, year, SotWURL) {
        const yearContainer = document.createElement("div");
        yearContainer.className = `${timeline.className}-item`;
        yearContainer.id = `year-${year}`;

        const timelineConnector = document.createElement("div");
        timelineConnector.className = "year-item-connector";
        const timelineBridge = document.createElement("div");
        timelineBridge.className = "year-item-bridge";
        const timelineBox = document.createElement("div");
        timelineBox.className = "year-item-box";
        timelineBox.addEventListener("click", () => {
            if (!timelineBox.classList.contains("empty") && !timelineBox.classList.contains("inactive")) return;
            for (let i = 0; i < this.#timelineView.getElementsByClassName("year-item-connector").length; i++) {
                if (this.#timelineView.getElementsByClassName("year-item-box")[i].textContent.length == 4) {
                    this.#timelineView.getElementsByClassName("year-item-box")[i].classList.add("empty");
                    this.#timelineView.getElementsByClassName("year-item-connector")[i].classList.add("empty");
                    this.#timelineView.getElementsByClassName("year-item-bridge")[i].classList.add("empty");
                } else {
                    this.#timelineView.getElementsByClassName("year-item-box")[i].classList.add("inactive");
                    this.#timelineView.getElementsByClassName("year-item-connector")[i].classList.add("inactive");
                    this.#timelineView.getElementsByClassName("year-item-bridge")[i].classList.add("inactive");
                };
            };
            for (let i = 0; i < this.#timelineView.querySelector(`#year-${year}`).childNodes.length; i++) {
                this.#timelineView.querySelector(`#year-${year}`).childNodes[i].classList.remove("inactive", "empty");
            };
            this.#prepareStories(year, SotWURL);
            this.#timelineView.getElementsByClassName("current-year")[0].innerHTML = year;
        });
        const yearDisplay = document.createElement("p");
        yearDisplay.className = "year-display";
        yearDisplay.innerHTML = year;
        timelineBox.appendChild(yearDisplay);

        // Construct and append
        yearContainer.appendChild(timelineConnector);
        yearContainer.appendChild(timelineBridge);
        yearContainer.appendChild(timelineBox);
        timeline.appendChild(yearContainer);
    };

    /**
     * Story load preparing controller.
     * @param {number} year - The currently selected year to query.
     * @param {string} SotWURL - The URL of the current SotW.
     * @async
     * @private
     */
    async #prepareStories(year, SotWURL) {
        this.#App.sessionManager.set("timelineYear", year);
        const selectorValue = this.#timelineView.getElementsByClassName("story-sort-selector")[0].value;
        let sortColumn = selectorValue.slice(0, 4);
        const sortRow = selectorValue.substring(selectorValue.length - 4);

        if (sortColumn === "like") sortColumn = "SUM(IFNULL(user_like.value, 0))";
        const stories = await this.#loadStories(sortColumn, sortRow, [], undefined, undefined, undefined, year, SotWURL);
        if (stories) return true;
    };

    /**
     * Load the stories from the database.
     * @param {string} sortColumn - The database column to order by.
     * @param {string} sortType - The database sort order. Descending or ascending order.
     * @param {Array} tagArray - The tags that are allowed.
     * @param {string} title - The title of the story.
     * @param {string} content - The inner content of the story.
     * @param {string} author - The author of the story.
     * @param {number} year - The year to query.
     * @param {string} SotWURL - The URL of the current SotW.
     * @param {boolean} explicit - If explicit stories are allowed.
     * @async
     * @private
     */
    async #loadStories(sortColumn, sortType, tagArray, title, content, author, year, SotWURL, explicit) {
        const storyDataGlobal = await this.#storyRepository.loadStoryData(sortColumn, sortType, tagArray, title, content, author, year, null, explicit);

        // Construct and append the stories.
        this.#timelineView.getElementsByClassName("story-container")[0].innerHTML = "";
        if (storyDataGlobal.result.length === 0) return super.createStoryPlaceholder(await super.translateComponent("timeline-placeholder"), "Search", "story-container");
        for (let i = 0; i < storyDataGlobal.result.length; i++) {
            if (!storyDataGlobal.result[i].tagname.includes("Vraag")) {
                let SotWBoolean = false;
                if (storyDataGlobal.result[i].url === SotWURL) {
                    SotWBoolean = true;
                    for (let i = 0; i < this.#timelineView.querySelector(`#year-${year}`).childNodes.length; i++) {
                        this.#timelineView.querySelector(`#year-${year}`).childNodes[i].style.backgroundColor = "#F2D388";
                    };
                };
                const tagNames = storyDataGlobal.result[i].tagname.split(", ");
                const tagId = storyDataGlobal.result[i].tagid.split(", ");
                const tagData = { tagNames, tagId };
                super.constructStory(storyDataGlobal.result[i], tagData, SotWBoolean);
            };
        };
        return true;
    };

    /**
     * Check if a number is odd or even.
     * @param {number} number - Input number
     * @returns - 1 if odd, 0 if even.
     * @private
     */
    #isOdd(number) { return number % 2; };

    /**
     * Load the story count.
     * Suffix for every year: 2023 (1)
     * @async
     * @private
     */
    async #storyCount() {
        const countData = await this.#timelineRepository.storyCount();
        for (let i = 0; i < countData.result.length; i++) {
            this.#timelineView.querySelector(`#year-${countData.result[i].year}`).childNodes[2].childNodes[0].innerHTML += ` (${countData.result[i].count})`;
        };
    };
};