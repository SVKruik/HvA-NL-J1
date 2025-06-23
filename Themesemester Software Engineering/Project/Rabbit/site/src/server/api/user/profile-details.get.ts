import { formatApiError } from "~/utils/format";
import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';

export default defineEventHandler(async (event): Promise<{
    description: string | null;
    socials: Array<{
        name: string;
        url: string;
    }>;
    avatar: string | null;
    banner: string | null;
    isNsfw: boolean;
}> => {
    try {
        const query = getQuery(event);
        const hopperId = parseInt(query.hopperId as string, 10);
        if (isNaN(hopperId)) throw new Error("Invalid Hopper ID", { cause: { statusCode: 1400 } });
        const connection: Pool = await database();

        // Update Hopper information
        const response: Array<{
            "description": string | null;
            "socials": Array<{
                "name": string;
                "url": string;
            }>;
            "avatar": string | null;
            "banner": string | null;
            "isNsfw": boolean;
        }> = await connection.query("SELECT description, avatar, banner, is_nsfw as isNsfw, socials FROM hopper WHERE id = ?", [hopperId]);
        if (!response.length) throw new Error("Hopper not found", { cause: { statusCode: 1404 } });

        await connection.end();
        return response[0];
    } catch (error: any) {
        throw formatApiError(error);
    }
});