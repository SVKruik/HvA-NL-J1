import type { Pool } from "mariadb";
import { database } from "../../utils/database";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Burrow } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

/**
 * Fetches all entries from the burrow table with their id and name.
 *
 * @returns {Array<{ id: number, name: string, avatar: string }>} List of burrow entries.
 */
export default defineEventHandler(
    async (): Promise<Array<{ id: number; name: string; avatar: string | null | undefined, is_nsfw_allowed: boolean }>> => {
        try {
            const connection: Pool = await database();
            const response: Array<Burrow> = await connection.query(
                "SELECT id, name, avatar, is_nsfw_allowed FROM burrow",
            );
            await connection.end();

            return response.map((post: Burrow) => ({
                id: post.id,
                name: post.name,
                avatar: post.avatar,
                is_nsfw_allowed: post.is_nsfw_allowed,
            }));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            throw formatApiError(error);
        }
    },
);
