import { formatApiError } from '~/utils/format';
import { database } from '~/server/utils/database';
import type { Pool } from 'mariadb';

export default defineEventHandler(async (event): Promise<{
    can_view_nsfw: boolean;
}> => {
    try {
        const query = getQuery(event);
        const hopperId = parseInt(query.hopperId as string, 10);
        if (isNaN(hopperId)) throw new Error("Invalid Hopper ID", { cause: { statusCode: 1400 } });
        const connection: Pool = await database();

        // Fetch feed settings
        const response: Array<{
            can_view_nsfw: boolean;
        }> = await connection.query("SELECT can_view_nsfw FROM hopper WHERE id = ?;", [hopperId]);

        if (!response.length) throw new Error("Hopper not found", { cause: { statusCode: 1404 } });

        const settings = response[0];
        await connection.end();
        return settings;
    } catch (error: any) {
        throw formatApiError(error);
    }
});