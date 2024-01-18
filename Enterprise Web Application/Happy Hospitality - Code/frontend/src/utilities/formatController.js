/**
 * Format Controller
 * Easily format different strings to their desired output.
 *
 * @author Stefan Kruik
 */

/**
 * Format the date to: 01 January 2023
 * @param date The input date in the correct format.
 * @param locale The locale to be used. This automatically chooses language, structure and format.
 * @return {string} The formatted output.
 */
export function formatDateDMY(date, locale) {
    return new Date(date).toLocaleDateString(localeChecker(locale), {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

/**
 * Format the date to: 01 January 2023 at 01:00
 * @param date The input date in the correct format.
 * @param locale The locale to be used. This automatically chooses language, structure and format.
 * @return {string} The formatted output.
 */
export function formatDateTime(date, locale) {
    return new Date(date).toLocaleDateString(localeChecker(locale), {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

/**
 * Validates the input locale.
 * @param locale The locale to be checked.
 * @return {string} The same input locale if the input was correct or the fallback locale if it was not.
 */
export function localeChecker(locale) {
    let targetLocale = locale;
    const validLocales = ["nl-NL", "en-US"];
    if (!validLocales.includes(locale)) targetLocale = "nl-NL";
    return targetLocale;
}

/**
 * Limit the length of the string, and add '...' at the end when needed.
 * @param string The input string to be formatted.
 * @param limit The length limit.
 */
export function formatStringLimit(string, limit) {
    let outputString = string;
    outputString = outputString.substring(0, limit);
    if (outputString.length > limit - 1) outputString += "...";
    return outputString;
}

/**
 * Make the formatStringLimit function responsive.
 * @param threshold The width threshold in pixels. If the width <= threshold, B becomes active.
 * @param a The string limit when larger than the threshold.
 * @param b The string limit when smaller than the threshold.
 * @param input The input string to be formatted.
 * @return {string} The formatted string.
 */
export function getStringLimit(threshold, a, b, input) {
    if (screen.availWidth <= threshold) {
        return formatStringLimit(input, b);
    } else return formatStringLimit(input, a);
}

/**
 * Format large numbers and add the letter 'K' when applicable.
 * @return {string} The input number formatted.
 */
export function numberFormat(input) {
    if (typeof input !== "number") return input;
    if (input < 1e3) return input;
    if (input >= 1e3) return +(input / 1e3).toFixed(1) + "K";
}

/**
 * Sets the document title to the desired input with a prefix.
 * @param input The new document title.
 */
export function documentTitle(input) {
    document.title = `HHC | ${input}`;
}
