import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import type { PaginatedHoppers } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

export default defineEventHandler(async (event): Promise<PaginatedHoppers> => {
    try {
        const body = await readBody(event);
        const [search, page, burrowFilter] = body;
        const pageNum = Number(page);
        const page_size = 20;

        const searchQuery = search
            ? `%${search.replace(/[%_]/g, "\\$&")}%`
            : "%";

        const connection: Pool = await database();

        let countQuery = `
            SELECT COUNT(DISTINCT hopper.id) AS count
            FROM hopper
        `;
        let dataQuery = `
            SELECT DISTINCT hopper.id, hopper.email, hopper.username, hopper.avatar, hopper.is_banned
            FROM hopper
        `;
        const joins = [];
        const conditions = [
            `(hopper.email LIKE ? ESCAPE '\\\\' OR hopper.username LIKE ? ESCAPE '\\\\')`,
        ];
        const params = [searchQuery, searchQuery];

        if (burrowFilter && burrowFilter.trim() !== "") {
            joins.push(`
                JOIN burrow_member ON hopper.id = burrow_member.hopper_id
                JOIN burrow ON burrow_member.burrow_id = burrow.id
            `);
            conditions.unshift(`burrow.name = ?`);
            params.unshift(burrowFilter);
        }

        countQuery += joins.join(" ") + " WHERE " + conditions.join(" AND ");
        const totalResult = await connection.query(countQuery, params);
        const totalCount = Number(totalResult[0].count);
        const total_pages = Math.ceil(totalCount / page_size);
        const safePageNum = isNaN(pageNum) ? 1 : pageNum;
        const offset = (safePageNum - 1) * page_size;

        dataQuery += joins.join(" ") + " WHERE " + conditions.join(" AND ");
        dataQuery += ` ORDER BY hopper.date_creation DESC LIMIT ? OFFSET ?`;

        const dataParams = [...params, page_size, offset];
        const response = await connection.query(dataQuery, dataParams);

        await connection.end();

        return {
            data: response,
            pagination: {
                page: safePageNum,
                total_pages,
            },
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
