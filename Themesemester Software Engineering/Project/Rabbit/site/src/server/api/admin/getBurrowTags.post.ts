import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import type { BurrowTags } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

export default defineEventHandler(async (): Promise<BurrowTags> => {
    try {
        const connection: Pool = await database();

        const response = await connection.query(
            `SELECT name FROM tag GROUP BY name`,
        );

        await connection.end();

        return response.map((row: { name: string }) => row.name as string);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
