import type { Pool } from "mariadb";
import { database } from "../../utils/database";
import type { Tag } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

/**
 * Fetches all entries from the burrow table with their id and name.
 */
export default defineEventHandler(
    async (): Promise<Array<{ id: number; name: string }>> => {
        try {
            const connection: Pool = await database();
            const response: Array<Tag> = await connection.query(
                "SELECT id, name, category FROM tag",
            );
            await connection.end();

            return response.map((tag: Tag) => ({
                id: tag.id,
                name: tag.name,
                category: tag.category,
            }));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            throw formatApiError(error);
        }
    },
);
