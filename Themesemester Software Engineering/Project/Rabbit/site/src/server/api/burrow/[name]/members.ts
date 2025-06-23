import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import type { PaginatedKeeperBurrowTypes } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

export default defineEventHandler(
    async (event): Promise<PaginatedKeeperBurrowTypes> => {
        try {
            const burrowName = getRouterParam(event, "name");
            const body = await readBody(event);
            const [search, page] = body;
            const pageNum = Number(page);
            const pageSize = 50;

            const searchQuery = search
                ? `%${search.replace(/[%_]/g, "\\$&")}%`
                : "%";

            const connection: Pool = await database();

            const burrowResult = await connection.query(
                `SELECT id, hopper_id FROM burrow WHERE name = ?`,
                [burrowName],
            );

            if (!burrowResult.length) {
                throw createError({
                    statusCode: 404,
                    statusMessage: "Burrow not found",
                });
            }

            const burrowId = burrowResult[0].id;

            const countResult = await connection.query(
                `SELECT COUNT(*) as count
                 FROM burrow_member bk
                 JOIN hopper h ON h.id = bk.hopper_id
                 WHERE bk.burrow_id = ? AND h.username LIKE ? ESCAPE '\\\\'`,
                [burrowId, searchQuery],
            );
            const totalCount = Number(countResult[0].count);
            const totalPages = Math.ceil(totalCount / pageSize);
            const safePageNum = isNaN(pageNum) ? 1 : pageNum;
            const offset = (safePageNum - 1) * pageSize;

            const members = await connection.query(
                `SELECT h.id AS hopper_id, h.username AS name, h.avatar
                 FROM burrow_member bk
                 JOIN hopper h ON h.id = bk.hopper_id
                 WHERE bk.burrow_id = ? AND h.username LIKE ? ESCAPE '\\\\'
                 ORDER BY h.username
                 LIMIT ? OFFSET ?`,
                [burrowId, searchQuery, pageSize, offset],
            );

            await connection.end();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = members.map((k: any) => ({
                name: k.name,
                avatar: k.avatar,
            }));

            return {
                data: response,
                pagination: {
                    page: safePageNum,
                    total_pages: totalPages,
                },
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            throw formatApiError(error);
        }
    },
);
