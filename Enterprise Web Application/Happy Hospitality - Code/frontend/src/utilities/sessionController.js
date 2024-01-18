// const sessionKey = process.env.VUE_APP_SESSION_KEY;

/**
 * Session Controller
 * Easy CRUD to the Local Storage.
 * Encrypts and decrypts for security.
 *
 * @author Stefan Kruik
 */

/**
 * Get all keys from the Local Storage.
 * @returns {Storage}
 */
export function getAll() {
    return window.localStorage;
}

/**
 * Get an item from the Local Storage.
 * @param key The key to look for. Returns value of the pair.
 * @returns {string} The value of the key.
 */
export function getItem(key) {
    return window.localStorage.getItem(key);
}

/**
 * Update or create an item in the Local Storage.
 * @param key The key to look for.
 * @param value The new value of the key.
 */
export function setItem(key, value) {
    return window.localStorage.setItem(key, value);
}

/**
 * Delete an item from the Local Storage.
 * @param key The key to look for.
 */
export function deleteItem(key) {
    return window.localStorage.removeItem(key);
}

/**
 * Delete all items from the Local Storage.
 * Useful for log-out.
 */
export function clearItems() {
    return window.localStorage.clear();
}
