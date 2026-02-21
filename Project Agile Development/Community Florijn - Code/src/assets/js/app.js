/**
 * Entry point front end application - there is also an app.js for the backend (server folder)!
 * @author Donovan Tjokrodimedjo & Stefan Kruik & Lennard Fonteijn & Pim Meijer
 */

import { SessionManager } from "./framework/utils/sessionManager.js";

// Components
import { NavbarController } from "./controllers/navbarController.js";
import { FooterController } from "./controllers/footerController.js";

// Pages
import { HomeController } from "./controllers/pages/homeController.js";
import { LoginController } from "./controllers/pages/loginController.js";
import { PostController } from "./controllers/pages/postController.js";
import { StoriesController } from "./controllers/pages/storyController.js";
import { StoryReadController } from "./controllers/pages/storyReadController.js";
import { ProfileController } from "./controllers/pages/profileController.js";
import { RegistreerController } from "./controllers/pages/registreerController.js";
import { SettingsController } from "./controllers/pages/settingsController.js";
import { SupportController } from "./controllers/pages/supportController.js";
import { VerifyController } from "./controllers/pages/verifyController.js";
import { TimelineController } from "./controllers/pages/timelineController.js";

export class App {
    // We only need one instance of the sessionManager, thus static use here
    // all classes should use this instance of sessionManager
    static sessionManager = new SessionManager();

    // Controller identifiers, add new controllers here
    static CONTROLLER_NAVBAR = "navbar";
    static CONTROLLER_FOOTER = "footer";

    static CONTROLLER_HOME = "home";
    static CONTROLLER_STORY = "story";
    static CONTROLLER_STORY_READ = "story-read";
    static CONTROLLER_POST = "post";
    static CONTROLLER_ABOUT = "about";
    static CONTROLLER_CONTACT = "contact";
    static CONTROLLER_PROFILE = "profile";
    static CONTROLLER_LOGIN = "login";
    static CONTROLLER_REGISTREER = "register";
    static CONTROLLER_SETTINGS = "settings";
    static CONTROLLER_SUPPORT = "support";
    static CONTROLLER_VERIFY = "verify";
    static CONTROLLER_TIMELINE = "timeline";

    constructor() {
        // Always load the navigation and footer
        App.loadController(App.CONTROLLER_NAVBAR);
        App.loadController(App.CONTROLLER_FOOTER);

        // Attempt to load the controller from the URL, if it fails, fall back to the home controller.
        App.loadControllerFromUrl(App.CONTROLLER_HOME);
    }

    /**
     * Loads a controller
     * @param name - name of controller - see static attributes for all the controller names
     * @param controllerData - data to pass from on controller to another - default empty object
     * @returns {boolean} - successful controller change
     */
    static loadController(name, controllerData) {
        console.log("Controller loaded: " + name);

        // Check for a special controller that shouldn't modify the URL
        switch (name) {
            case App.CONTROLLER_NAVBAR:
                new NavbarController();
                return true;
            case App.CONTROLLER_FOOTER:
                new FooterController();
                return true;
        }

        // Exception for the unique URL pages.
        if (window.location.href.includes("story-read")) {
            new StoryReadController();
        } else if (window.location.href.includes("post/")) {
            new PostController();
        } else if (window.location.href.includes("verify")) {
            new VerifyController();
        } else if (window.location.href.includes("profile")) {
            new ProfileController();
        } else if (window.location.href.includes("settings")) {
            new SettingsController();
        }

        // Otherwise, load any of the other controllers
        App.setCurrentController(name, controllerData);

        switch (name) {
            case App.CONTROLLER_LOGIN:
                App.setCurrentController(name);
                App.isLoggedIn(
                    () => {
                        new HomeController();
                    },
                    () => new LoginController()
                );
                break;

            case App.CONTROLLER_REGISTREER:
                App.setCurrentController(name);
                App.isLoggedIn(
                    () => {
                        new RegistreerController();
                    },
                    () => new RegistreerController()
                );
                break;

            case App.CONTROLLER_HOME:
                App.isLoggedIn(
                    () => {
                        new HomeController();
                    },
                    () => new HomeController()
                );
                break;

            case App.CONTROLLER_STORY:
                App.setCurrentController(name);
                App.isLoggedIn(
                    () => {
                        new StoriesController();
                    },
                    () => new StoriesController()
                );
                break;

            case App.CONTROLLER_STORY_READ:
                App.setCurrentController(name);
                App.isLoggedIn(
                    () => {
                        new StoryReadController();
                    },
                    () => new StoryReadController()
                );
                break;

            case App.CONTROLLER_POST:
                App.setCurrentController(name);
                App.isLoggedIn(
                    () => {
                        new PostController();
                    },
                    () => new PostController()
                );
                break;

            case App.CONTROLLER_PROFILE:
                App.setCurrentController(name);
                App.isLoggedIn()
                App.isLoggedIn(
                    () => {
                        new ProfileController();
                    },
                    () => new ProfileController()
                );
                break;

            case App.CONTROLLER_SETTINGS:
                App.setCurrentController(name);
                App.isLoggedIn(
                    () => {
                        new SettingsController();
                    },
                    () => new SettingsController()
                );
                break;

            case App.CONTROLLER_SUPPORT:
                App.setCurrentController(name);
                App.isLoggedIn(
                    () => {
                        new SupportController();
                    },
                    () => new SupportController()
                );
                break;

            case App.CONTROLLER_TIMELINE:
                App.setCurrentController(name);
                App.isLoggedIn(
                    () => {
                        new TimelineController();
                    },
                    () => new TimelineController()
                );
                break;

            default:
                return false;
        }
        return true;
    }

    /**
     * Alternative way of loading controller by url
     * @param fallbackController
     */
    static loadControllerFromUrl(fallbackController) {
        const currentController = App.getCurrentController();

        if (currentController) {
            if (!App.loadController(currentController.name, currentController.data)) {
                if (
                    window.location.hash.includes("story-read") || window.location.hash.includes("post") ||
                    window.location.hash.includes("profile") ||
                    window.location.hash.includes("verify") ||
                    window.location.hash.includes("settings")
                ) return;
                window.location.href = "#home";
            }
        } else App.loadController(fallbackController);
    }

    /**
     * Looks at current URL in the browser to get current controller name
     * @returns {string}
     */
    static getCurrentController() {
        const fullPath = location.hash.slice(1);

        if (!fullPath) return undefined;

        const queryStringIndex = fullPath.indexOf("?");

        let path;
        let queryString;

        if (queryStringIndex >= 0) {
            path = fullPath.substring(0, queryStringIndex);
            queryString = Object.fromEntries(
                new URLSearchParams(fullPath.substring(queryStringIndex + 1))
            );
        } else {
            path = fullPath;
            queryString = undefined;
        }

        return {
            name: path,
            data: queryString,
        };
    }

    /**
     * Sets current controller name in URL of the browser
     * @param name
     * @param controllerData
     */
    static setCurrentController(name, controllerData) {
        if (App.dontSetCurrentController) return;

        if (controllerData) {
            history.pushState(
                undefined,
                undefined,
                `#${name}?${new URLSearchParams(controllerData)}`
            );
        } else history.pushState(undefined, undefined, `#${name}`);
    }

    /**
     * Convenience functions to handle logged-in states
     * @param whenYes - function to execute when user is logged in
     * @param whenNo - function to execute when user is logged out
     */
    static async isLoggedIn(whenYes, whenNo) {
        await App.sessionManager.get("email");

        if (await App.sessionManager.get("email")) {
            whenYes();
        } else {
            whenNo();
        }
    }

    /**
     * Removes username via sessionManager and loads the login screen
     */
    static handleLogout() {
        App.sessionManager.remove("email");

        // Go to login screen
        App.loadController(App.CONTROLLER_LOGIN);
    }
}

window.addEventListener("hashchange", function () {
    App.dontSetCurrentController = true;
    App.loadControllerFromUrl(App.CONTROLLER_HOME);
    App.dontSetCurrentController = false;
});

// When the DOM is ready, kick off our application.
window.addEventListener("DOMContentLoaded", () => {
    new App();
});
