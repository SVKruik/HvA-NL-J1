import type { ChartDataset } from "chart.js";
import { TableHeaderType, type ChartData, type LearningGoal0Result, type LearningGoal2Result, type LearningGoal4Result, type TableHeaderLearningGoal_Generic_Item, type TableDataLearningGoal_Generic, type TableDataLearningGoal_3_Item, type TableHeaderGenericItem, type TableDataLearningGoal_4_Item, type LearningGoal3Result } from "~/assets/customTypes";

/**
 * Format incoming data for Learning Goal 0.1 into Chart.JS format.
 * @param input The data to parse.
 * @returns The parsed data in Chart.JS format.
 */
export function graph_0_1_Parser(input: Array<LearningGoal0Result>): ChartData {
    return {
        labels: input.map((entry) => `Week ${entry.week}`),
        datasets: [
            {
                label: "Aantal",
                data: input.map((entry) => entry.week_count),
                backgroundColor: "#6EC20790"
            }
        ]
    }
}

/**
 * Format incoming data for Learning Goal 2.1 into Chart.JS format.
 * @param input The data to parse.
 * @returns The parsed data in Chart.JS format.
 */
export function graph_2_1_Parser(input: Array<LearningGoal2Result>): ChartData {
    return {
        labels: input.map((entry) => `Week ${entry.week}`),
        datasets: [
            {
                "label": "Percentage",
                "data": input.map((entry) => entry.avg_time_taken_percentage),
                "backgroundColor": "#FFFFFF",
                "borderColor": "#EF5A6F"
            }
        ]
    }
}

/**
 * Format incoming data for Learning Goal 2.2 into Chart.JS format.
 * @param input The data to parse.
 * @returns The parsed data in Chart.JS format.
 */
export function graph_2_2_Parser(input: Array<LearningGoal2Result>): ChartData {
    return {
        labels: input.map((entry) => `Week ${entry.week}`),
        datasets: [
            {
                "label": "QA Iteraties",
                "data": input.map((entry) => entry.avg_qa_iterations),
                "backgroundColor": "#FFFFFF",
                "borderColor": "#3572EF"
            }
        ]
    }
}

/**
 * Format incoming data for Learning Goal 2.3 into Chart.JS format.
 * @param input The data to parse.
 * @returns The parsed data in Chart.JS format.
 */
export function graph_2_3_Parser(input: Array<LearningGoal2Result>): ChartData {
    return {
        labels: input.map((entry) => `Week ${entry.week}`),
        datasets: [
            {
                "label": "Aantal vragen",
                "data": input.map((entry) => entry.avg_help_needed),
                "backgroundColor": "#FFFFFF",
                "borderColor": "#FF8225"
            }
        ]
    }
}

/**
 * Format incoming data for Learning Goal 3.1 into Chart.JS format.
 * @param input The data to parse.
 * @returns The parsed data in Chart.JS format.
 */
export function graph_3_1_Parser(input: Array<LearningGoal3Result>): ChartData {
    return {
        labels: input.map((entry) => `Week ${entry.week}`),
        datasets: [
            {
                "label": "Extra's",
                "data": input.map((entry) => entry.avg_extras),
                "backgroundColor": "#FFFFFF",
                "borderColor": "#EB5B00"
            },
            {
                "label": "Incidenten",
                "data": input.map((entry) => entry.avg_incidents),
                "backgroundColor": "#FFFFFF",
                "borderColor": "#6EC207"
            }
        ]
    }
}

/**
 * Format incoming data for Learning Goal 3.2 into Chart.JS format.
 * @param input The data to parse.
 * @returns The parsed data in Chart.JS format.
 */
export function graph_3_2_Parser(input: Array<LearningGoal3Result>): ChartData {
    return {
        labels: input.map((entry) => `Week ${entry.week}`),
        datasets: [
            {
                "label": "Tijd Geplanned",
                "data": input.map((entry) => entry.avg_time_planned),
                "backgroundColor": "#FFFFFF",
                "borderColor": "#FF8225"
            },
            {
                "label": "Tijd Besteed",
                "data": input.map((entry) => entry.avg_time_taken),
                "backgroundColor": "#FFFFFF",
                "borderColor": "#3572EF"
            }
        ]
    }
}

/**
 * Format incoming data for Learning Goal 4.1 into Chart.JS format.
 * @param input The data to parse.
 * @returns The parsed data in Chart.JS format.
 */
export function graph_4_1_Parser(input: LearningGoal4Result): Array<ChartData> {
    return [{
        labels: input.categoryNames,
        datasets: [
            {
                "label": "Volledig",
                "data": input.categoryCounts.total,
                "backgroundColor": "#D2FF7230",
                "borderColor": "#D2FF72",
                "fill": true
            },
            {
                "label": "Eerste Helft",
                "data": input.categoryCounts.firstHalf,
                "backgroundColor": "#6EC20730",
                "borderColor": "#6EC207",
                "fill": true
            },
            {
                "label": "Tweede Helft",
                "data": input.categoryCounts.secondHalf,
                "backgroundColor": "#11755430",
                "borderColor": "#117554",
                "fill": true
            }
        ]
    },
    {
        labels: input.languageNames,
        datasets: [
            {
                "label": "Volledig",
                "data": input.languageCounts.total,
                "backgroundColor": "#F5004F30",
                "borderColor": "#F5004F",
                "fill": true
            },
            {
                "label": "Eerste Helft",
                "data": input.languageCounts.firstHalf,
                "backgroundColor": "#EF5A6F30",
                "borderColor": "#EF5A6F",
                "fill": true
            },
            {
                "label": "Tweede Helft",
                "data": input.languageCounts.secondHalf,
                "backgroundColor": "#80000030",
                "borderColor": "#800000",
                "fill": true
            }
        ]
    }];
}

/**
 * Format incoming data for Learning Goal 4.2 into Chart.JS format.
 * @param input The data to parse.
 * @returns The parsed data in Chart.JS format.
 */
export function graph_4_2_Parser(input: LearningGoal4Result): Array<ChartData> {
    return [{
        labels: input.categoryNames,
        datasets: [
            {
                "label": "Volledig",
                "data": input.categoryHours.total,
                "backgroundColor": "#3ABEF930",
                "borderColor": "#3ABEF9",
                "fill": true
            },
            {
                "label": "Eerste Helft",
                "data": input.categoryHours.firstHalf,
                "backgroundColor": "#3572EF30",
                "borderColor": "#3572EF",
                "fill": true
            },
            {
                "label": "Tweede Helft",
                "data": input.categoryHours.secondHalf,
                "backgroundColor": "#01204E30",
                "borderColor": "#01204E",
                "fill": true
            }
        ]
    },
    {
        labels: input.languageNames,
        datasets: [
            {
                "label": "Volledig",
                "data": input.languageHours.total,
                "backgroundColor": "#FFDE4D30",
                "borderColor": "#FFDE4D",
                "fill": true
            },
            {
                "label": "Eerste Helft",
                "data": input.languageHours.firstHalf,
                "backgroundColor": "#FF822530",
                "borderColor": "#FF8225",
                "fill": true
            },
            {
                "label": "Tweede Helft",
                "data": input.languageHours.secondHalf,
                "backgroundColor": "#EB5B0030",
                "borderColor": "#EB5B00",
                "fill": true
            }
        ]
    }];
}

function getTableHeaders(type: TableHeaderType): Array<TableHeaderLearningGoal_Generic_Item> {
    return [{
        "label": "Week",
        "type": TableHeaderType.NUMBER,
        "key": 'week'
    }, {
        "label": "Waarde",
        "type": type,
        "key": 'value'
    }, {
        "label": "Verschil",
        "type": TableHeaderType.NUMBER,
        "key": 'delta'
    }];
}

/**
 * Parse a single dataset into a table format.
 * @param input The chart data to parse.
 * @param type The type of the table header.
 * @returns The parsed data in table single format.
 */
export function table_2_Parser(input: ChartData, type: TableHeaderType): TableDataLearningGoal_Generic {
    const dataset: Array<number> = input.datasets[0].data;

    return {
        "tableHeaders": getTableHeaders(type),
        "points": dataset.map((entry: number, index: number) => {
            return {
                "week": +input.labels[index].split(" ")[1],
                "value": entry,
                "delta": index === 0 ? 0 : +(entry - dataset[index - 1]).toFixed(2),
            }
        })
    };
}

/**
 * Parse a single dataset into a table format.
 * @param input The chart data to parse.
 * @param type The type of the table header.
 * @returns The parsed data in table multi format.
 */
export function table_3_Parser(input: ChartData): TableDataLearningGoal_3_Item {
    const datasetA: Array<number> = input.datasets[0].data;
    const datasetB: Array<number> = input.datasets[1].data;

    return {
        "tableHeaders": getTableHeaders(TableHeaderType.NUMBER),
        "setA": datasetA.map((entry: number, index: number) => {
            return {
                "week": +input.labels[index].split(" ")[1],
                "value": entry,
                "delta": index === 0 ? 0 : +(entry - datasetA[index - 1]).toFixed(2),
            }
        }),
        "setB": datasetB.map((entry: number, index: number) => {
            return {
                "week": +input.labels[index].split(" ")[1],
                "value": entry,
                "delta": index === 0 ? 0 : +(entry - datasetB[index - 1]).toFixed(2),
            }
        })
    };
}

/**
 * Parse a single dataset into a table format.
 * @param input The chart data to parse.
 * @param type The type of the table header.
 * @returns The parsed data in table multi format.
 */
export function table_4_Parser(input: Array<ChartData>, type: TableHeaderType): Array<TableDataLearningGoal_4_Item> {
    // In Count
    const countDataset_Category: Array<ChartDataset> = input[0].datasets;
    const countLabels_Category: Array<string> = input[0].labels;
    const countDataset_Language: Array<ChartDataset> = input[1].datasets;
    const countLabels_Language: Array<string> = input[1].labels;

    // In Hours
    const hoursLabels_Category: Array<ChartDataset> = input[2].datasets;
    const hoursDataset_Category: Array<string> = input[2].labels;
    const hoursDataset_Language: Array<ChartDataset> = input[3].datasets;
    const hoursLabels_Language: Array<string> = input[3].labels;

    return [{
        "label": "Werkzaamheden per categorie in aantal",
        "tableHeaders": headerMapper(countLabels_Category, type),
        "points": pointMapper(countDataset_Category, countLabels_Category.length)
    },
    {
        "label": "Werkzaamheden per categorie in uren",
        "tableHeaders": headerMapper(hoursDataset_Category, type),
        "points": pointMapper(hoursLabels_Category, hoursDataset_Category.length)
    },
    {
        "label": "Werkzaamheden per taal in aantal",
        "tableHeaders": headerMapper(countLabels_Language, type),
        "points": pointMapper(countDataset_Language, countLabels_Language.length)
    },
    {
        "label": "Werkzaamheden per taal in uren",
        "tableHeaders": headerMapper(hoursLabels_Language, type),
        "points": pointMapper(hoursDataset_Language, hoursLabels_Language.length)
    }]
}

/**
 * Extract the header labels from the chart data.
 * @param input The data to parse.
 * @param type The type of the header.
 * @returns The header labels in the correct format.
 */
function headerMapper(input: Array<string>, type: TableHeaderType): Array<TableHeaderGenericItem> {
    const labels: Array<TableHeaderGenericItem> = input.map((label: string) => {
        return {
            "label": label,
            "type": type
        }
    });
    labels.unshift({
        "label": "Stage Periode",
        "type": TableHeaderType.STRING
    });
    return labels;
}

/**
 * Extract the dataset data points from the chart data.
 * @param input The data to parse.
 * @param maxLength The maximum length of the data points.
 * @returns The data points in the correct format.
 */
function pointMapper(input: Array<ChartDataset>, maxLength: number): Array<any> {
    return input.map((dataset: ChartDataset) => {
        const dataPoints = [dataset.label, ...dataset.data];
        const paddedDataPoints = dataPoints.concat(Array(maxLength).fill(0)).slice(0, maxLength + 1);
        return paddedDataPoints;
    });
}