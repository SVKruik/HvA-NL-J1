import { LearningGoalEntry, LearningGoalEntryRaw, TableAllData, TableHeaderAllItem, TableHeaderType } from "~/assets/customTypes";
import mariadb, { Pool, PoolConfig } from 'mariadb';
import { getDate } from "~/utils/date";

export default defineEventHandler(async (): Promise<TableAllData> => {
    const runtimeConfig = useRuntimeConfig();
    const connection: Pool = mariadb.createPool(runtimeConfig.database as any as PoolConfig);
    const rawData: Array<LearningGoalEntryRaw> = await connection.query("SELECT *, ROUND((time_taken/time_planned) * 100) as time_taken_percentage FROM learning_goal_data ORDER BY week ASC;");
    connection.end();

    // Data Processing
    const data: Array<LearningGoalEntry> = rawData.map((entry: LearningGoalEntryRaw) => {
        return {
            weekNumber: entry.week,
            ticketNumber: entry.ticket,
            timePlanned: entry.time_planned,
            timeTaken: entry.time_taken,
            timeTakenPercentage: entry.time_taken_percentage,
            helpNeeded: entry.help_needed,
            qaIterations: entry.qa_iterations,
            incidents: entry.incidents,
            extras: entry.extras,
            type: entry.type,
            categories: entry.category,
            languages: entry.language,
            dateCreation: getDate(entry.date_creation).date,
            dateUpdated: getDate(entry.date_updated).date
        };
    });

    const tableHeaders: Array<TableHeaderAllItem> = [
        { id: 1, label: "Week Nr", value: "weekNumber", type: TableHeaderType.NUMBER },
        { id: 2, label: "Ticket Nr", value: "ticketNumber", type: TableHeaderType.NUMBER },
        { id: 3, label: "T Geplanned", value: "timePlanned", type: TableHeaderType.NUMBER },
        { id: 4, label: "T Nodig", value: "timeTaken", type: TableHeaderType.NUMBER },
        { id: 5, label: "T Nodig %", value: "timeTakenPercentage", type: TableHeaderType.PERCENTAGE },
        { id: 6, label: "Vragen", value: "helpNeeded", type: TableHeaderType.NUMBER },
        { id: 7, label: "QA", value: "qaIterations", type: TableHeaderType.NUMBER },
        { id: 8, label: "Incidenten", value: "incidents", type: TableHeaderType.NUMBER },
        { id: 9, label: "Extra's", value: "extras", type: TableHeaderType.NUMBER },
        { id: 10, label: "Type", value: "type", type: TableHeaderType.STRING },
        { id: 11, label: "Categorieën", value: "categories", type: TableHeaderType.STRING },
        { id: 12, label: "Talen", value: "languages", type: TableHeaderType.STRING },
        { id: 13, label: "Datum Creatie", value: "dateCreation", type: TableHeaderType.DATE },
        { id: 14, label: "Datum Update", value: "dateUpdated", type: TableHeaderType.DATE }
    ]

    return {
        "tableHeaders": tableHeaders,
        "points": data
    };
});