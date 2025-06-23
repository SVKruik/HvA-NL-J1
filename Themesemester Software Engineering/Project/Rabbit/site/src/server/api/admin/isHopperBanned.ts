import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import { formatApiError } from "~/utils/format";

export default defineEventHandler(async (event): Promise<boolean> => {
    try {
        const body = await readBody(event);
        const [id] = body;

        const connection: Pool = await database();

        const response = await connection.query(
            "SELECT is_banned FROM hopper WHERE id = ?",
            [id],
        );

        await connection.end();

        return response[0]?.is_banned ? true : false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
