import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import type { PaginatedReports } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

export default defineEventHandler(async (event): Promise<PaginatedReports> => {
    try {
        const body = await readBody(event);
        const [search, page] = body;
        const pageNum = Number(page);
        const page_size = 20;

        const searchQuery = search
            ? `%${search.replace(/[%_]/g, "\\$&")}%`
            : "%";

        const connection: Pool = await database();

        const totalResult = await connection.query(
            `SELECT COUNT(*) as count FROM report WHERE (category LIKE ? ESCAPE '\\\\' OR description LIKE ? ESCAPE '\\\\')
              `,
            [searchQuery, searchQuery],
        );
        const totalCount = Number(totalResult[0].count);
        const total_pages = Math.ceil(totalCount / page_size);

        const safePageNum = isNaN(pageNum) ? 1 : pageNum;
        const offset = (safePageNum - 1) * page_size;

        const response = await connection.query(
            `SELECT category, description
                 FROM report
                 WHERE (category LIKE ? ESCAPE '\\\\' OR description LIKE ? ESCAPE '\\\\')
                 ORDER BY date_creation DESC
                 LIMIT ? OFFSET ?`,
            [searchQuery, searchQuery, page_size, offset],
        );

        await connection.end();

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
});
