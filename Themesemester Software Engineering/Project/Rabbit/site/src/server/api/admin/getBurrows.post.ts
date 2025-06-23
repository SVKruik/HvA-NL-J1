import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import { formatApiError } from "~/utils/format";

export default defineEventHandler(async (): Promise<string[]> => {
    try {
        const connection: Pool = await database();
        const response = await connection.query(`SELECT name FROM burrow`);

        await connection.end();

        return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
