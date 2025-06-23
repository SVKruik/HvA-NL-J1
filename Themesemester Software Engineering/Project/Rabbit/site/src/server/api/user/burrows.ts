import type { Pool } from "mariadb";
import type { BurrowSideBar } from "~/assets/customTypes";
import { database } from "~/server/utils/database";
import { formatApiError } from "~/utils/format";

/**
 * Fetches burrow sidebar data for a given hopper ID.
 */
export default defineEventHandler(async (event): Promise<BurrowSideBar[]> => {
    try {
        const id: number = getQuery(event).hopper_id as number;

        const connection: Pool = await database();
        const response: Array<BurrowSideBar> = await connection.query(
            `SELECT name, avatar
            FROM burrow_member
            LEFT JOIN burrow ON burrow.id = burrow_member.burrow_id
            WHERE burrow_member.hopper_id = ? AND burrow.is_banned = 0
            LIMIT 0, 1000;
            `,
            [id],
        );

        // Return a success response
        await connection.end();
        return response;
    } catch (error: any) {
        throw formatApiError(error);
    }
});
