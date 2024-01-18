import axios from "axios";

const key = process.env.VUE_APP_API_KEY;
const baseUrl =
    location.hostname === "localhost"
        ? process.env.VUE_APP_API_HOST_LOCAL
        : process.env.VUE_APP_API_HOST;

/**
 * Network Controller
 * Collection of network related functions.
 *
 * @author Stefan Kruik
 */

/**
 * Use the Axios API to fetch from the backend.
 * @param {string} route - The route of the request.
 * @param {string} method - The method of the request. Choose from the standarized HTTP protocols.
 * @param {Object} data - The body of the request.
 * @param {boolean} absolute - If you want raw data, not processed or formatted.
 * @returns {Promise<*>}
 */
export async function fetchApi(route, method, data = {}, absolute = false) {
    const validMethods = ["GET", "PUT", "DELETE", "POST"];
    if (!validMethods.includes(method)) return "Invalid method provided.";

    const url = `${baseUrl}${route}`;
    try {
        const response = await axios({
            url: url,
            method: method,
            headers: {
                "X-API-Key": key,
                "Content-Type": "application/json"
            },
            data: data
        });
        if (absolute) {
            return response;
        } else return response.data;
    } catch (error) {
        return error;
    }
}

/**
 * Upload (post) a file to the SFTP server.
 * @param {FormData} file - The form data to be uploaded. Use `new FormData()` and `formData.append()`.
 * @param {string} type - The type of image. Choose from events, posts & users
 * @param {string} name - The generated ticket.
 * @returns {Promise<*>} - Returns a Promise that resolves with the response data or rejects with an error.
 */
export async function uploadFile(file, type, name) {
    const validTypes = ["events", "users", "posts"];
    if (!validTypes.includes(type)) return "Invalid type provided.";

    const fileRoute = `/files/upload/${type}/${name}`;
    const response = await axios({
        url: baseUrl + fileRoute,
        method: "POST",
        headers: {
            "X-API-Key": key,
            "Content-Type": "multipart/form-data"
        },
        data: file
    });

    return response.data;
}

/**
 * GitLab API specific requests.
 * For safety reasons, it only does GET requests.
 * @param route The endpoint of the API.
 * @return {Promise<*>} Data returned by the API.
 */
export async function fetchGitApi(route) {
    const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
    const authToken = process.env.VUE_APP_API_KEY_2;
    try {
        const response = await axios({
            url: apiBaseUrl + route,
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}
