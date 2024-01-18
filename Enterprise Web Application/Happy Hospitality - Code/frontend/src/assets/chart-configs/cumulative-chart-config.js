import { chartConfig, generateWeekNumbers, past } from "@/utilities/chartController";
import { fetchApi } from "@/utilities/networkController";

const chartColors = ["#FF7F0E", "#2CA02C", "#9467BD", "#1F77B4"];
let weekArray = generateWeekNumbers();
let postCount = Array(weekArray.length).fill(0);
let eventCount = Array(weekArray.length).fill(0);
let partnerCount = Array(weekArray.length).fill(0);
let entrepreneurCount = Array(weekArray.length).fill(0);

await chartDataConstructor();

/**
 * Generate all datasets for the chart.
 */
async function chartDataConstructor() {
    const data = await fetchApi("/superUsers/chart/cumulative", "GET");
    for (let i = 0; i < data.length; i++) {
        if (data[i].weekNumber < past) continue;
        const targetIndex = weekArray.indexOf(data[i].weekNumber);
        postCount.fill(data[i].postsCount, targetIndex);
        eventCount.fill(data[i].eventsCount, targetIndex);
        partnerCount.fill(data[i].partnersCount, targetIndex);
        entrepreneurCount.fill(data[i].entrepreneursCount, targetIndex);
    }
}

/**
 * Create a new dataset, which adds a new line to the chart.
 * @param name The name, label, of the line.
 * @param color The color of the line.
 * @param data The input data of the line.
 * @return {Object}
 */
function datasetConstructor(name, color, data) {
    return {
        label: name,
        backgroundColor: color,
        borderColor: color,
        data: data,
        tension: 0.3,
        pointRadius: 0
    };
}

// Automatically picked up by Charts.js.
export const data = {
    labels: generateWeekNumbers(),
    datasets: [
        datasetConstructor("Artikelen", chartColors[0], postCount),
        datasetConstructor("Evenementen", chartColors[1], eventCount),
        datasetConstructor("Partners", chartColors[2], partnerCount),
        datasetConstructor("Ondernemers", chartColors[3], entrepreneurCount)
    ]
};

// Automatically picked up by Charts.js.
export const options = chartConfig(18);
