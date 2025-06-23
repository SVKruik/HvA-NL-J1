import type { Pool } from "mariadb";
import { database } from "../../utils/database";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Label } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

/**
 * @description This API endpoint retrieves labels associated with a specific burrow.
 * @param {number} burrowId - The ID of the burrow for which to retrieve labels.
 * @returns - A promise that resolves to an array of label objects, each containing an ID and name.
 * @throws {Error} - Throws an error if the burrowId is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<Array<Label>> => {
    try {
        const burrowId = Number(getQuery(event).burrowId);
        if (isNaN(burrowId)) {
            throw new Error("Invalid or missing burrowId", {
                cause: { statusCode: 1400 },
            });
        }

        const connection: Pool = await database();
        const response: Array<{ id: number; name: string; color: string }> =
            await connection.query(
                `
        SELECT id, name, color
        FROM burrow_label
        WHERE burrow_id = ? LIMIT 15
        `,
                [burrowId],
            );
        await connection.end();

        return response.map((label: Label) => ({
            id: label.id,
            name: label.name,
            color: label.color,
        }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
