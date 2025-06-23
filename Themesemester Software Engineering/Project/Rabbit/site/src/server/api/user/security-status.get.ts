import { formatApiError } from "~/utils/format";
import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';

export default defineEventHandler(async (event): Promise<{
    "date_verification": string | null,
    "date_2fa": string | null
}> => {
    try {
        const connection: Pool = await database();
        const query = getQuery(event);
        if (!query.hopperId) throw new Error("Hopper ID is required.", { cause: { statusCode: 1400 } });

        // Update Hopper status
        const response: Array<{
            "date_verification": string | null,
            "date_2fa": string | null
        }> = await connection.query("SELECT date_verification, date_2fa FROM hopper WHERE id = ?;", [parseInt(query.hopperId as string)]);
        if (!response.length) throw new Error("Hopper not found.", { cause: { statusCode: 1404 } });

        await connection.end();
        return response[0];
    } catch (error: any) {
        throw formatApiError(error);
    }
});