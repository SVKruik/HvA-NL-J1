import type { Pool } from "mariadb";
import type { BurrowSideBar } from "~/assets/customTypes";
import { database } from "~/server/utils/database";
import { formatApiError } from "~/utils/format";

/**
 * Fetches burrow sidebar data for a given hopper ID.
 */
export default defineEventHandler(async (): Promise<BurrowSideBar[]> => {
    try {
        const connection: Pool = await database();
        const response: Array<BurrowSideBar> = await connection.query(
            `SELECT 
    b.name, 
    b.avatar
FROM 
    burrow b 
JOIN 
    burrow_member bm ON b.id = bm.burrow_id
WHERE 
    b.is_banned = 0
GROUP BY 
    b.id, b.name, b.avatar 
ORDER BY 
    COUNT(bm.hopper_id) DESC 
LIMIT 5;
            `,
        );

        // Return a success response
        await connection.end();
        return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
