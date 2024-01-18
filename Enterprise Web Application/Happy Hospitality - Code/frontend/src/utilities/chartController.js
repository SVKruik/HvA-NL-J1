import { fetchApi } from "@/utilities/networkController.js";

export const past = currentWeekNumber() - 10;
let weekArray = generateWeekNumbers();

/**
 * Chart Controller
 * Easily and consistently style & configure Line graphs from Vue Chart.js.
 *
 * @author Stefan Kruik
 */

/**
 * Fill an array with a range of week numbers.
 * @return {Array}
 */
export function generateWeekNumbers() {
    const weeksArray = [];
    for (let i = past; i <= currentWeekNumber(); i++) {
        weeksArray.push(i);
    }
    return weeksArray;
}

/**
 * Return the current week number.
 * @return {number} The current week number.
 */
function currentWeekNumber() {
    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const pastDaysOfYear = (new Date() - firstDayOfYear) / 86400000; // milliseconds in a day
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Format incoming chart data.
 * @param type The chart information type.
 * @return {Array} The formatted data.
 */
async function chartDataConstructor(type) {
    let data = (await fetchApi("/superUsers/chart", "GET"))[type];

    const returnData = [];
    populateArray(returnData);

    for (let i = 0; i < data.length; i++) {
        returnData[weekArray.indexOf(data[i][0])] = data[i][1];
    }

    return returnData;
}

/**
 * Populate an array with zero values, but indexes corresponding to the weeks.
 * @param array The input array to fill.
 */
export function populateArray(array) {
    for (let i = past; i <= currentWeekNumber(); i++) {
        array.push(0);
    }
}

/**
 * Load all chart information.
 * @param chartColor The accent color of the chart.
 * @param name The plural label name.
 * @param type The chart information type. Choose from: “Events” & “Posts”.
 * @return {Promise<{*}>
 */
export async function chartSetup(chartColor, name, type) {
    return {
        labels: generateWeekNumbers(),
        datasets: [
            {
                label: `Nieuwe ${name}`,
                backgroundColor: chartColor,
                borderColor: chartColor,
                data: await chartDataConstructor(type),
                tension: 0.3,
                pointRadius: 0
            }
        ]
    };
}

/**
 * Load all chart settings.
 * @param max The max value on the Y axis.
 */
export function chartConfig(max) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false
        },
        scales: {
            y: {
                suggestedMax: max
            }
        }
    };
}
