import { formatApiError } from "~/utils/format";
import { isValidIndex, masterEngine } from "./searchEngine";
import { Index } from "meilisearch";

// Batching Memory
// [0] - Current amount of items
// [1] - Maximum amount of items
let rabbit_burrow: Array<number> = [0, 1];
let rabbit_hopper: Array<number> = [0, 1];
let rabbit_post: Array<number> = [0, 2];
let rabbit_comment: Array<number> = [0, 5];
let rabbit_report: Array<number> = [0, 1];
let rabbit_tag: Array<number> = [0, 1];

/**
 * Lookup the corresponding database table name for a given index.
 * @param index The index to check.
 * @returns The database table name.
 */
function indexTableLookup(index: string): { "name": string, "clause": string | null } {
    switch (index) {
        case "rabbit_burrow":
            return {
                "name": "burrow",
                "clause": "WHERE date_deleted IS NULL AND is_banned = 0",
            };
        case "rabbit_hopper":
            return {
                "name": "hopper",
                "clause": "WHERE status = 'active' AND is_banned = 0",
            };
        case "rabbit_post":
            return {
                "name": "post",
                "clause": "WHERE is_concept = 0 AND date_deleted IS NULL",
            };
        case "rabbit_comment":
            return {
                "name": "post_comment",
                "clause": null,
            };
        case "rabbit_report":
            return {
                "name": "report",
                "clause": null,
            };
        case "rabbit_tag":
            return {
                "name": "tag",
                "clause": null,
            };
        default:
            throw new Error("Invalid index");
    }
}

function attributeTableLookup(table: string): Array<string> {
    switch (table) {
        case "burrow":
            return ["name", "description"];
        case "hopper":
            return ["username"];
        case "post":
            return ["title", "description"];
        case "post_comment":
            return ["content"];
        case "report": // Admin page
            return ["category", "description"];
        case "tag": // Onboarding
            return ["name", "category"];
        default:
            throw new Error("Invalid table");
    }
}

/**
 * Dynamic Search Index (DSI) Generation
 * Generate and update the index when new data is added to the database.
 * Do not use this function directly, use registerDSI instead.
 * @param index The index to generate and update.
 * @returns Status of the operation.
 */
export async function generateIndex(indexName: string): Promise<boolean> {
    try {
        if (!isValidIndex(indexName)) throw new Error("Invalid index");
        const connection = await database();
        const search = await masterEngine();

        // Prepare the query
        const table: { "name": string, "clause": string | null } = indexTableLookup(indexName);
        const columns: Array<string> = attributeTableLookup(table.name);
        const query: string = `SELECT id, ${columns.join(", ")} FROM ${table.name}${table.clause ? " " + table.clause : ""};`;

        // Retrieve the data from the database
        const data = await connection.query(query);
        if (data.length === 0) return false;

        // Upload the data to the index
        const index: Index = await search.getIndex(indexName);
        await index.addDocuments(data, { primaryKey: "id" });
        await index.updateSettings({
            searchableAttributes: columns,
            filterableAttributes: columns,
        });

        connection.end();
        return true;
    } catch (error: any) {
        throw formatApiError(error);
    }
}

/**
 * Instead of immediately generating the index, we can register it for batch processing.
 * Comments don't need to be indexed immediately.
 * @param index The index to register.
 * @returns Status of the operation.
 */
export async function registerDSI(index: string): Promise<boolean> {
    try {
        if (!isValidIndex(index)) throw new Error("Invalid index");

        const batchMemory: Record<string, Array<number>> = {
            rabbit_burrow,
            rabbit_hopper,
            rabbit_post,
            rabbit_comment,
            rabbit_report,
            rabbit_tag,
        };

        batchMemory[index][0] += 1;
        if (batchMemory[index][0] >= batchMemory[index][1]) {
            await generateIndex(index);
            batchMemory[index][0] = 0;
        }

        return true;
    } catch (error: any) {
        throw formatApiError(error);
    }
}