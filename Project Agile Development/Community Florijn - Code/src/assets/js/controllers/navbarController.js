/**
 * Responsible for handling the actions happening on the navigation
 *
 * @author Donovan Tjokrodimedjo, Lennard Fonteijn & Pim Meijer
 */

import { App } from "../app.js";
import { Controller } from "./controller.js";
import { NavbarRepository } from "../repositories/navbarRepository.js";
import { SettingsRepository } from '../repositories/settingsRepository.js';

export class NavbarController extends Controller {
  #navbarView;
  #navbarRepository;
  #settingsRepository;

  constructor() {
    super();
    this.#setupView();
    this.#navbarRepository = new NavbarRepository();
    this.#settingsRepository = new SettingsRepository();
  }

  /**
   * Loads contents of desired HTML file into the index.html .navigation div
   * @returns {Promise<void>}
   * @private
   */
  async #setupView() {
    this.#navbarView = await super.loadHtmlIntoNavigation("html_views/components/navbar.html");

    // If no language was set revert to default language
    if (!App.sessionManager.get("viewLanguage")) {
      App.sessionManager.set("viewLanguage", "nl-NL");
    }

    this.#checkActiveLink();
    let { urlRoute } = this.#getCurrentController();
    await this.#setDocumentTitle(urlRoute);
    const storyElements = document.querySelectorAll('a.nav-link[href="#story"]');

    this.#checkLoggedIn();
    this.#initHamburger();
    this.#initDropdown();

    // Events for when the hash changes
    window.addEventListener("hashchange", async () => {
      const hashSplitted = window.location.hash.split('#')[1];

      if (!hashSplitted.includes("story-read")) this.removeAllAlerts();

      // Scrolls to the top of the page when the page is loaded.
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }, 100);

      if (hashSplitted.includes('/')) {
        this.#handleClickNavigationItem(hashSplitted.split('/')[0]);
      } else if (hashSplitted.includes('?')) {
        this.#handleClickNavigationItem(hashSplitted.split('?')[0]);

        storyElements.forEach(storyEl => {
          storyEl.setAttribute("href", `#story?${window.location.hash.split('?')[1]}`);
        });

      } else if (hashSplitted.includes('-')) {
        this.#handleClickNavigationItem(hashSplitted.split('-')[0]);
      }
      else {
        this.#handleClickNavigationItem(hashSplitted);
      }
    });

    super.translateView(true, "Navbar");
  }

  // Checks if a user is logged in and adds eventListeners to navigationbar elements
  async #checkLoggedIn() {
    const hiddenElements = document.querySelectorAll(".hidden");
    const logoutBtns = document.querySelectorAll(".logout-btn");
    const profileBtns = document.querySelectorAll('a[HREF="#profile"]');
    const storyElements = document.querySelectorAll('a.nav-link[href="#story"]');
    const userImg = this.#navbarView.querySelector(".nav-user-img");
    let sessionUser = App.sessionManager.get("email");
    const userData = await this.#navbarRepository.getUserData(sessionUser);
    const userSettings = (await this.#settingsRepository.getUserSettings(sessionUser)).result[0];
    const validLocales = super.getValidLocales();

    // Checks if there is a user logged in trough the session elements
    if (sessionUser) {

      // If a user is found in the session, but does not exist in the database (anymore), clears the session and reloads the page
      if (userData.length !== 1) {
        App.sessionManager.clear();
        window.location.reload();
      }

      App.sessionManager.set("autoTranslate", userSettings["auto_translate"] ? true : false)

      // Sets colorblindness or high contrast for when a user has one enabled
      if (userSettings["colorblind"]) document.documentElement.classList.value = userSettings["colorblind"];
      else if (userSettings["high_contrast"]) document.documentElement.classList.value = "high-contrast";

      // Define the default language as Dutch
      const defaultLanguage = "nl-NL";

      // Get the session view language
      const sessionViewLanguage = App.sessionManager.get("viewLanguage");

      // Get the user language from the database
      const databaseLanguage = userSettings.language;

      // If the session view language differs from the database language, update the session view language
      if (userSettings.language !== sessionViewLanguage) {
        // If the database language is valid, update the session view language with the database language
        if (validLocales.indexOf(databaseLanguage) !== -1) {
          App.sessionManager.set("viewLanguage", databaseLanguage);
        } else {
          // If the database language is not valid, reset the session view language to the default language
          App.sessionManager.set("viewLanguage", defaultLanguage);
          await this.#settingsRepository.setUserSettings(sessionUser, userSettings.interaction_mail, userSettings.sotw_mail, defaultLanguage, userSettings.auto_translate);
        }

        window.location.reload();
      }

      // If a user is logged in, toggle hidden elements (e.g. hiding login button, showing profile on navigation e.t.c.)
      NavbarController.toggleHiddenElements(hiddenElements);

      // Sets the currentPage as the href for the story page, to save the page where the user was
      storyElements.forEach(storyEl => {
        storyEl.setAttribute("href", `#story?${parseInt(App.sessionManager.get("currentPage"))}`)
      });

      // Trying to load the user image from the logged in user
      try {
        userImg.src = `${baseUrl}/uploads/profile/${userData[0].user_name}.jpg`;

        // On error when loading the profile image, load the default.svg
        userImg.addEventListener('error', () => {
          userImg.src = `${baseUrl}/assets/img/icons/default.svg`;
        }, { once: true });
      } catch (e) {
        userImg.src = `${baseUrl}/assets/img/icons/default.svg`;
      } finally {
        profileBtns.forEach(btn => {
          btn.href = `${baseUrl}/#profile/${userData[0].user_name}`;
        });
      }
    }

    // Adds events to all logout buttons
    logoutBtns.forEach((logoutBtn) => {
      logoutBtn.addEventListener("click", () => {
        const language = App.sessionManager.get("viewLanguage") || "nl-NL";
        App.sessionManager.clear();
        App.sessionManager.set("viewLanguage", language);
        NavbarController.toggleHiddenElements(hiddenElements);
        window.location.href = `${baseUrl}/#home`;
      });
    });
  }

  /**
  * Toggles the visibility of elements.
  * 
  * @param hiddenElements - The list of elements
  */
  static toggleHiddenElements(hiddenElements) {
    const loginBtns = document.querySelectorAll(".loginBtn");
    const invisItem = document.querySelector(".invis-item");

    document.querySelector('.nav-link[href^="#post"]').classList.toggle('marked');

    for (const hiddenElement of hiddenElements) {
      hiddenElement.classList.toggle("hidden");
    }

    if (invisItem) {
      invisItem.classList.toggle("hidden");
    }

    for (const loginBtn of loginBtns) {
      loginBtn.parentElement.classList.toggle("hidden");
    }
  }

  /**
   * Checks which link in the navigation bar is active 
   */
  #checkActiveLink() {
    let urlRoute = window.location.hash;
    const navLinks = document.querySelectorAll("#navigation li");

    // If current hash includes a dash, the first part of the dash is included in the current active anchor
    if (urlRoute.includes("-")) {
      urlRoute = urlRoute.split("-")[0];
    } else if (urlRoute.includes("/")) {
      urlRoute = urlRoute.split("/")[0];
    }

    for (const navLink of navLinks) {
      if (
        navLink.firstElementChild
          .getAttribute("href")
          .match(`${urlRoute}`)
      ) {
        navLink.classList.add("active");
      } else {
        navLink.classList.remove("active");
      }
    }
  }

  /**
  * Sets the document title depending on the current controller
  * @param controller
  */
  async #setDocumentTitle(controller) {
    let documentTitle;

    // Changes the document title and translating them
    if (controller.includes("profile")) {
      documentTitle = await super.translateComponent("page-title-profile");
    } else if (controller.includes("post")) {
      documentTitle = await super.translateComponent("page-title-post");
    } else if (controller.includes("about")) {
      documentTitle = await super.translateComponent("page-title-about");
    } else if (controller.includes("contact")) {
      documentTitle = await super.translateComponent("page-title-contact");
    } else if (controller.includes("story")) {
      documentTitle = await super.translateComponent("page-title-stories");
    } else if (controller.includes("verify")) {
      documentTitle = await super.translateComponent("page-title-verify");
    } else if (controller.includes("timeline")) {
      documentTitle = await super.translateComponent("page-title-timeline");
    } else if (controller.includes("support")) {
      documentTitle = await super.translateComponent("page-title-support");
    } else if (controller.includes("settings")) {
      documentTitle = await super.translateComponent("page-title-settings");
    } else if (controller.includes("home")) {
      documentTitle = await super.translateComponent("page-title-home");
    }

    if (documentTitle) {
      document.title = `Community Florijn | ${documentTitle}`;
    }
  }

  /**
  * Returns the current active controller, the base url and the active route
  */
  #getCurrentController() {
    // Finds the base URL of the current page, the current active controller and the route
    const baseUrl = location.href;
    const currentController = baseUrl.split("/");
    let urlRoute;

    // If the current controller has params, then the params are included in the last part of the url
    if (currentController.length <= 4) {
      urlRoute = currentController[currentController.length - 1].split("#")[1];
    } else {
      urlRoute = currentController[currentController.length - 2].split("#")[1];
      urlRoute += `/${currentController[currentController.length - 1]}`;
    }

    return {
      baseUrl,
      currentController,
      urlRoute,
    };
  }

  /**
   * Opens the hamburger menu on click when the hamburger menu is visible
   * @private
   */
  #initHamburger() {
    const hamburger = document.querySelector(".hamburger-icon");
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const hamburgerOverlay = document.querySelector(".hamburger-overlay");
    const closeHamburgerBtn = document.querySelector(".hamburger-close");
    const hamburgerLinks = document.querySelectorAll(".ham-item");
    let hamburgerOpen;

    function openHamburger() {
      hamburgerMenu.style.width = "50%";
      hamburgerMenu.style.border = null;
      hamburgerOverlay.style.opacity = "1";
      hamburgerOverlay.style.pointerEvents = "unset";

      setTimeout(() => {
        hamburgerOpen = true;
      }, 0);
    }

    function closeHamburger() {
      hamburgerOpen = false;
      hamburgerMenu.style.width = "0";
      hamburgerMenu.style.border = "unset";
      hamburgerOverlay.style.opacity = "0";
      hamburgerOverlay.style.pointerEvents = "none";
    }

    hamburgerLinks.forEach((hamburgerLink) => {
      hamburgerLink.addEventListener("click", () => {
        closeHamburger();
      })
    });

    hamburger.addEventListener("click", () => {
      openHamburger();
    });

    closeHamburgerBtn.addEventListener("click", () => {
      closeHamburger();
    });

    document.addEventListener("click", (event) => {
      if (!hamburgerMenu.contains(event.target) && hamburgerOpen) {
        closeHamburger();
      }
    });
  }

  /**
   * Initializes the dropdown functionality
   * @private
   */
  #initDropdown() {
    const dropdownBtn = document.querySelector('.nav-dropdown-btn');
    const dropdownList = document.querySelector('.nav-dropdown-list');
    const dropdownItem = document.querySelectorAll('.dropdown-item');

    dropdownBtn.addEventListener('click', () => { hideOrShowDropdown() });

    dropdownItem.forEach(item => {
      item.addEventListener("click", () => { hideOrShowDropdown() });
    });

    document.addEventListener('click', (e) => {
      if (!dropdownBtn.contains(e.target) && !dropdownList.contains(e.target) && dropdownList.classList.contains('show')) {
        hideOrShowDropdown();
      }
    });

    function hideOrShowDropdown() {
      if (dropdownList.classList.contains('show')) {
        dropdownList.classList.remove('show');
        dropdownList.classList.add('hide');
        dropdownBtn.classList.toggle('rotated');
      } else {
        dropdownList.classList.add('show');
        dropdownList.classList.remove('hide');
        dropdownBtn.classList.toggle('rotated');
      }
    }
  }

  /**
   * Reads data attribute on each .nav-link and then when clicked navigates to specific controller
   * @param event - clicked anchor event
   * @param setController - alternative controller
   * @returns {boolean} - to prevent reloading
   * @private
   */
  async #handleClickNavigationItem(setController) {

    const navLinks = document.querySelectorAll(".nav-link");
    let controller = setController;

    // Remove the "active" class from the current active link
    const activeLink = document.querySelector("#navigation .active");

    if (activeLink) {
      activeLink.classList.remove("active");
    }

    // Checks if there are navigation links that match the current controller
    for (const navLink of navLinks) {
      if (
        (navLink
          .getAttribute("href")
          .match(`#${controller}`) ||
          navLink
            .getAttribute("href")
            .match(`${controller}`)) ||
        navLink
          .getAttribute("href")
          .match(`${controller.split("/")[0]}`) ||
        navLink
          .getAttribute("href")
          .match(`${controller.split("-")[0]}`)
        && !navLink.parentElement.tagName.match('DIV')
      ) {
        navLink.parentElement.classList.add("active");
      } else {
        navLink.parentElement.classList.remove("active");
      }
    }

    await this.#setDocumentTitle(controller);

    // Return false to prevent reloading the page
    return false;
  }
}
