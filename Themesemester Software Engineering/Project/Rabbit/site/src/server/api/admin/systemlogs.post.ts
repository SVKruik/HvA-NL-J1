import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import type { PaginatedEventLogTypes } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

export default defineEventHandler(
    async (event): Promise<PaginatedEventLogTypes> => {
        try {
            const body = await readBody(event);
            const [search, page] = body;
            const pageNum = Number(page);
            const page_size = 50;

            const searchQuery = search
                ? `%${search.replace(/[%_]/g, "\\$&")}%`
                : "%";

            const safePageNum = isNaN(pageNum) ? 1 : pageNum;
            const offset = (safePageNum - 1) * page_size;

            const connection: Pool = await database();

            const totalResult = await connection.query(
                `SELECT COUNT(*) as count FROM event_log WHERE (description LIKE ? ESCAPE '\\\\' OR object_type LIKE ? ESCAPE '\\\\' OR endpoint LIKE ? ESCAPE '\\\\')
              `,
                [searchQuery, searchQuery, searchQuery],
            );
            const totalCount = Number(totalResult[0].count);
            const total_pages = Math.ceil(totalCount / page_size);

            const rawResponse = await connection.query(
                `SELECT object_type, object_id, description, endpoint, date_creation
                 FROM event_log
                 WHERE (description LIKE ? ESCAPE '\\\\' OR object_type LIKE ? ESCAPE '\\\\' OR endpoint LIKE ? ESCAPE '\\\\')
                 ORDER BY date_creation DESC
                 LIMIT ? OFFSET ?`,
                [searchQuery, searchQuery, searchQuery, page_size, offset],
            );

            await connection.end();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = rawResponse.map((row: { object_id: any }) => ({
                ...row,
                object_id:
                    typeof row.object_id === "bigint"
                        ? Number(row.object_id)
                        : row.object_id,
            }));

            return {
                data: response,
                pagination: {
                    page: safePageNum,
                    total_pages: total_pages,
                },
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            throw formatApiError(error);
        }
    },
);
