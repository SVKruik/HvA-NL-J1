/**
 * Repository for the 'file' entity.
 * @author Stefan Kruik & Donovan Tjokrodimedjo
 */
import { NetworkManager } from "../framework/utils/networkManager.js";

export class FileRepository {
    #networkManager;
    #route;
    constructor() {
        this.#route = "/file";
        this.#networkManager = new NetworkManager()
    }

    /**
     * Upload a file to the SFTP server.
     * @param formData - formData element that contains all image data
     * @returns {Promise<>}
     */
    upload(formData) {
        return this.#networkManager.doFileRequest(`${this.#route}/upload`, "POST", { formData: formData });
    };

    /**
     * Rename a specific file on the SFTP server.
     * @param {string} location - Folder of the file: story or profile.
     * @param {string} fileName - The current name of the file.
     * @param {string} newFileName - The new name for the file.
     * @returns {Promise<>}
     */
    rename(location, fileName, newFileName) {
        return this.#networkManager.doRequest(`${this.#route}/rename`, "POST", { "location": location, "fileName": fileName, "newFileName": newFileName });
    };


    /**
     * Delete a specific image from the SFTP server.
     * @param {string} location - Folder of the file: story or profile.
     * @param {string} fileName - The name of the file to delete.
     * @returns {Promise<>}
     */
    delete(location, fileName) {
        return this.#networkManager.doRequest(`${this.#route}/delete`, "DELETE", { "location": location, "fileName": fileName });
    };
};