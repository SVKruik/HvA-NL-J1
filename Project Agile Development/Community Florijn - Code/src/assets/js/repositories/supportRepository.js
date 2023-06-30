/**
 * Repository for the 'support' entity.
 * @author Stefan Kruik
 */
import { NetworkManager } from "../framework/utils/networkManager.js";
export class SupportRepository {
    #networkManager;
    #route;
    constructor() {
        this.#route = "/support";
        this.#networkManager = new NetworkManager()
    }

    /**
     * Send a support request to the staff of Community Florijn.
     * An email will be sent and the request will also be stored in the database.
     * @param {string} email - The email of the sender.
     * @param {string} subject - User filled subject of the request.
     * @param {string} category - Subject/category of the request.
     * @param {string} message - The content of the request.
     * @param {string} env - Environment of the server. Dev or Live.
     * @param {string} date - Formatted date to a readable string.
     * @param {object} translationGeneral - The script that both the staff and user mail share.
     * @param {object} translationEdge - The nav and footer of the email in the language of the user.
     * @param {object} translationUser - The translation for the user specific mail.
     * @param {object} translationStaff - The translation for the staff specific mail.
     * @param {number} rawDate - Current timestamp. 
     * @param {object} translationGeneralStaff - The script that both the staff and user mail share, forces in staff language.
     * @param {object} translationEdgeStaff - The nav and footer of the email in the language of the staff.
     * @returns {Promise<>}
     */
    supportForm(email, subject, category, message, env, date, translationGeneral, translationEdge, translationUser, translationStaff, rawDate, translationGeneralStaff, translationEdgeStaff) {
        return this.#networkManager.doRequest(`${this.#route}/form`, "POST", {
            "email": email,
            "subject": subject, "category": category, "message": message, "env": env, "date": date,
            "translationGeneral": translationGeneral, "translationEdge": translationEdge,
            "translationUser": translationUser, "translationStaff": translationStaff, "rawDate": rawDate,
            "translationGeneralStaff": translationGeneralStaff, "translationEdgeStaff": translationEdgeStaff
        });
    };
};