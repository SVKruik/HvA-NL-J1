/**
 * Controller for footer loading.
 * @author Stefan Kruik
 */

import { App } from "../app.js";
import { FooterRepository } from "../repositories/footerRepository.js";
import { Controller } from "./controller.js";

export class FooterController extends Controller {
    #footerView;
    #footerRepository;

    constructor() {
        super();
        this.#setupView();
        this.#footerRepository = new FooterRepository();
    };

    async #setupView() {
        this.#footerView = await super.LoadHtmlIntoFooter("html_views/components/footer.html");
        super.translateView(true, "Footer");

        // Declaring all variables to work with DOM elements.
        const languageButton = this.#footerView.querySelector('.footer-dropdown-button');
        const languageSelection = this.#footerView.querySelector('.footer-dropdown-content');
        const countries = super.getValidLocales();
        const currentLanguage = App.sessionManager.get("viewLanguage");
        const loggedInUser = App.sessionManager.get("email");

        // Loop to add all valid locales to the footer language selection.
        countries.forEach(country => {
            // Creating the alias for all the country codes. (e.g. from nl-NL to NL)
            const alias = country.slice(-2).toUpperCase();

            // Creates a div element for every language option.
            const languageOption = document.createElement('div');
            languageOption.className = 'footer-language-option';
            languageOption.textContent = alias;

            // The current language will be loaded as the selected country in the selection.
            if (country === currentLanguage) {
                languageButton.innerHTML = `${currentLanguage.slice(-2).toUpperCase()} <img src="https://flagsapi.com/${currentLanguage.slice(-2).toUpperCase()}/flat/64.png"></img>`
                return;
            };

            // Event listener to change the country on click, and if logged in also update the database.
            languageOption.addEventListener("click", async () => {
                App.sessionManager.set("viewLanguage", country);
                App.sessionManager.set("scrollHeight", 0);

                if (loggedInUser) await this.#footerRepository.setLanguage(loggedInUser, country);

                window.location.reload();
            });

            // Create a image element for every country flag using FlagsAPI.
            const flagImg = document.createElement('img');
            flagImg.src = `https://flagsapi.com/${alias}/flat/64.png`;
            languageOption.appendChild(flagImg);


            // Append every country flag to the selection model.
            languageSelection.appendChild(languageOption);
        });
    };
};