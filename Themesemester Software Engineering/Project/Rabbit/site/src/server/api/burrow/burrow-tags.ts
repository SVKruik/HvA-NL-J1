import type { Pool } from "mariadb";
import { database } from "../../utils/database";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Tag } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

/**
 * @description This API endpoint retrieves tags associated with a specific burrow.
 * @param {number} burrowId - The ID of the burrow for which to retrieve tags.
 * @returns - A promise that resolves to an array of tag objects, each containing an ID and name.
 * @throws {Error} - Throws an error if the burrowId is invalid or if there is a database error.
 */
export default defineEventHandler(
    async (event): Promise<Array<{ id: number; name: string }>> => {
        try {
            const burrowId = Number(getQuery(event).burrowId);
            if (isNaN(burrowId)) {
                throw new Error("Invalid or missing burrowId", {
                    cause: { statusCode: 1400 },
                });
            }

            const connection: Pool = await database();
            const response: Array<{ id: number; name: string }> =
                await connection.query(
                    `
        SELECT t.id, t.name
        FROM tag t
        JOIN burrow_tag bt ON bt.tag_id = t.id
        WHERE bt.burrow_id = ?
        `,
                    [burrowId],
                );
            await connection.end();

            return response.map((tag: Tag) => ({
                id: tag.id,
                name: tag.name,
            }));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            throw formatApiError(error);
        }
    },
);
