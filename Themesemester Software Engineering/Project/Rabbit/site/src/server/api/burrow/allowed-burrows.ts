import type { Pool } from "mariadb";
import { database } from "../../utils/database";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Burrow } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

/**
 * @description This API endpoint retrieves allowed burrows for a specific burrow.
 * @param burrowId - The ID of the burrow for which to retrieve allowed burrows.
 * @returns - A promise that resolves to an array of allowed burrow objects, each containing an ID, name, avatar, and is_nsfw_allowed status.
 * @throws - Throws an error if the burrowId is invalid or if there is a database error.
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
            const response: Array<Burrow> = await connection.query(
                `
                SELECT b.id, b.name, b.avatar, b.is_nsfw_allowed
                FROM burrow b
                JOIN burrow_member bm ON b.id = bm.burrow_id
                LEFT JOIN burrow_blocked bb ON bb.burrow_id = b.id AND bb.hopper_id = ?
                WHERE bm.hopper_id = ?
                AND bb.id IS NULL;
        `,
                [burrowId, burrowId],
            );
            await connection.end();

            return response.map((burrow: Burrow) => ({
                id: burrow.id,
                name: burrow.name,
                avatar: burrow.avatar,
                is_nsfw_allowed: burrow.is_nsfw_allowed,
            }));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            throw formatApiError(error);
        }
    },
);
