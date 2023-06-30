/**
 * Controller responsible for all events in the home view
 * @author Donovan Tjokrodimedjo
 */

import { Controller } from "../controller.js";
import { HomeRepository } from "../../repositories/homeRepository.js";
import { App } from "../../app.js";
import { NavbarRepository } from "../../repositories/navbarRepository.js";

export class HomeController extends Controller {
    #homeView;
    #homeRepository;
    #navbarRepository;
    #App;

    constructor() {
        super();
        this.#App = App;
        this.#homeRepository = new HomeRepository();
        this.#navbarRepository = new NavbarRepository();
        this.#setupView();
    }

    async #setupView() {
        this.#homeView = await super.loadHtmlIntoContent("html_views/home.html");
        await this.#initializeStoryOfTheWeek();
        super.translateView(true, "Home");

        document.getElementsByClassName("home-start-button")[0].addEventListener('click', () => {
            const email = this.#App.sessionManager.get("email");
            if (email) {
                window.location.href = "#post/new";
            } else window.location.href = "#login";
        });
    }

    /**
     * Returns story of the week data after requesting through the home repository
     * @private
     * @returns {Promise<Object>} Promise object represents the data of the story of the week, including its tag names and tag colors
     */
    async #getStoryOfTheWeek() {
        const sotwData = (await this.#homeRepository.getStoryOfTheWeek())["sotw"][0];

        if (sotwData) {
            const tagnames = sotwData.tagname.split(", ");
            const tagids = sotwData.tagid.split(", ");
            return { sotwData, tagnames, tagids };
        }
    }

    /**
     * Creates all Story of the Week elements and appends them in the home view
     * @private
     */
    async #initializeStoryOfTheWeek() {
        const sotwHeader = this.#homeView.querySelector(".sotw-header");
        let sotwResult = await this.#getStoryOfTheWeek();
        const userData = (await this.#navbarRepository.getUserData(App.sessionManager.get("email")))[0];
        let userAge = 18;
        if (userData) userAge = super.getAge(userData["birthdate"]);
        const ageLimit = 16;

        if (userAge <= ageLimit) sotwResult = null;

        const sotwContainer = document.createElement("div");
        sotwContainer.classList.add("sotw-container");

        if (sotwResult) {
            // Adds the adequate achievement to the author of the new story of the week
            super.registerAchievement("04", sotwResult.sotwData.user_email);

            const sotw = sotwResult.sotwData;
            const sotwTagNames = sotwResult.tagnames;
            const sotwIds = sotwResult.tagids;

            // Creating a story info container and appending the title and description
            const sotwInfo = document.createElement("div");
            sotwInfo.classList.add("sotw-info");

            const sotwTitle = document.createElement("p");
            sotwTitle.textContent = `${sotw.title}`;
            sotwTitle.classList.add("sotw-title");

            const sotwDesc = document.createElement("p");
            const sotwContent = document.createElement("div");
            sotwContent.innerHTML = sotw.content;
            sotwDesc.textContent = sotwContent.textContent.slice(0, 250);
            sotwDesc.classList.add("sotw-desc");

            sotwInfo.appendChild(sotwTitle);
            sotwInfo.appendChild(sotwDesc);

            // Creating the image container, setting the image source and appending the image to the container
            const sotwImgContainer = document.createElement("div");
            sotwImgContainer.classList.add("sotw-img-container");

            const sotwImage = document.createElement("img");
            sotwImage.classList.add("sotw-image");
            sotwImage.src = `uploads/story/${sotw.url}.jpg`;

            sotwImage.addEventListener(
                "error",
                () => {
                    sotwImage.src = `assets/img/background/error.svg`;
                    sotwImage.style.filter = "brightness(50%)";
                },
                { once: true }
            );

            sotwImgContainer.appendChild(sotwImage);

            // Creating the profile and author element
            const sotwUserinfo = document.createElement("a");
            sotwUserinfo.classList.add("sotw-user-info");

            const sotwUserImg = document.createElement("img");
            sotwUserImg.classList.add("sotw-user-img");
            sotwUserImg.src = `/assets/img/icons/default.svg`;

            sotwUserImg.addEventListener('error', () => {
                sotwUserImg.src = `/assets/img/icons/default.svg`;
            }, { once: true });

            const sotwAuthor = document.createElement("p");
            sotwAuthor.classList.add("sotw-author");

            if (sotw.anonymous !== 0) {
                sotwAuthor.textContent = await super.translateComponent("user-1");
                sotwUserImg.src = `/assets/img/icons/default.svg`;
                sotwUserinfo.style.cursor = "default";
            } else {
                if (sotw.user_type == 2) {
                    sotwAuthor.textContent = await super.translateComponent("user-2");
                } else {
                    sotwAuthor.textContent = `${sotw.user_name}`;
                    sotwUserImg.src = `uploads/profile/${sotw.user_name}.jpg`;
                    sotwUserinfo.setAttribute("href", `#profile/${sotw.user_name}`);
                }
            }

            sotwUserinfo.appendChild(sotwUserImg);
            sotwUserinfo.appendChild(sotwAuthor);

            // Creating the date element and appending the element to the container
            const sotwDate = document.createElement("p");
            sotwDate.classList.add("sotw-date");
            sotwDate.textContent = `${await super.translateComponent("home-sotw-date")} ${await super.dateFormat(sotw.date, "short")}`;

            // Creating the tags div and requesting the tags from the database
            const sotwTags = document.createElement("div");
            sotwTags.classList.add("sotw-tags");

            for (let i = 0; i < sotwTagNames.length; i++) {
                const sotwInnerTagEl = document.createElement("p");
                sotwInnerTagEl.classList.add("sotw-tag");
                sotwInnerTagEl.textContent = await super.translateComponent(`story-tag-${sotwIds[i]}`);
                sotwInnerTagEl.style.backgroundColor = `var(--tag-color-${sotwIds[i]})`;
                sotwTags.appendChild(sotwInnerTagEl);
            }

            // Creating the Story of the Week stats elements (likes, comments) and appending them to sotwStats
            const sotwStats = document.createElement("div");
            sotwStats.classList.add("sotw-stats");

            const sotwLikes = document.createElement("p");
            sotwLikes.innerHTML =
                '<i class="fa-solid fa-heart"></i> ' +
                super.numberFormat(sotw.likes || 0);

            const sotwComments = document.createElement("p");
            sotwComments.innerHTML =
                '<i class="fa-solid fa-comment"></i> ' +
                super.numberFormat(sotw.comments || 0);

            sotwStats.appendChild(sotwLikes);
            sotwStats.appendChild(sotwComments);

            const sotwData = document.createElement("div");
            sotwData.classList.add("sotw-data");

            const sotwMainData = document.createElement("div");
            sotwMainData.classList.add("sotw-main-data");

            const sotwSideData = document.createElement("div");
            sotwSideData.classList.add("sotw-side-data");

            sotwMainData.appendChild(sotwTags);
            sotwMainData.appendChild(sotwStats);
            sotwSideData.appendChild(sotwDate);

            sotwData.appendChild(sotwMainData);
            sotwData.appendChild(sotwSideData);

            sotwContainer.addEventListener("click", () => {
                location.href = `/#story-read/${sotw.url}`;
            });

            // Appending all children to sotwContainer
            sotwContainer.appendChild(sotwImgContainer);
            sotwContainer.appendChild(sotwInfo);
            sotwContainer.appendChild(sotwUserinfo);
            sotwContainer.appendChild(sotwData);
        } else {
            const noSotw = document.createElement('p');
            noSotw.classList.add('sotw-error');

            if (userAge <= ageLimit) noSotw.textContent = await super.translateComponent("home-sotw-restricted");
            else noSotw.textContent = await super.translateComponent("home-sotw-error");
            sotwContainer.appendChild(noSotw);
        }

        sotwHeader.appendChild(sotwContainer);
    }
}