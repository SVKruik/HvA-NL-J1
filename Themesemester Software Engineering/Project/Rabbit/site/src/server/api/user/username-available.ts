import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { formatApiError } from '~/utils/format';

/**
 * Check if the username is taken or not.
 * 
 * @returns {boolean} If the username is available.
 */
export default defineEventHandler(async (event): Promise<boolean> => {
    try {
        const username: string = getQuery(event).username as string;
        if (!username || username.length < 3 || username.length > 20) return false;

        const connection: Pool = await database();
        const response: Array<number> = await connection.query("SELECT id FROM hopper WHERE username = ?", [username]);

        // Return a success response
        await connection.end();
        return response.length === 0;
    } catch (error: any) {
        throw formatApiError(error);
    }
});

