/**
 * Error Controller
 * Collection of error messages.
 * Uses the Window.alert() function to display messages.
 *
 * @author Stefan Kruik
 */

/**
 * General error message.
 */
export function errorGeneral() {
    alert("Er ging iets fout. Probeer later nog eens.");
}

/**
 * Custom error message.
 * @param message The text you would like to display.
 */
export function errorCustom(message) {
    alert(message);
}
