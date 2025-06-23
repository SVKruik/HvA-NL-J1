import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import type { PaginatedAllBurrows } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

export default defineEventHandler(
    async (event): Promise<PaginatedAllBurrows> => {
        try {
            const body = await readBody(event);
            const [search, page, tag] = body;
            const pageNum = Number(page);

            const page_size = 50;

            const searchQuery = search
                ? `%${search.replace(/[%_]/g, "\\$&")}%`
                : "%";

            const connection: Pool = await database();

            const totalResult = await connection.query(
                `SELECT COUNT(DISTINCT b.id) as count
                FROM burrow b
                LEFT JOIN burrow_tag bt ON bt.burrow_id = b.id
                LEFT JOIN tag t ON t.id = bt.tag_id
                WHERE b.name LIKE ? ESCAPE '\\\\' ${tag ? "AND t.name = ?" : ""}`,
                tag ? [searchQuery, tag] : [searchQuery],
            );
            const totalCount = Number(totalResult[0].count);
            const total_pages = Math.ceil(totalCount / page_size);

            const safePageNum = isNaN(pageNum) ? 1 : pageNum;
            const offset = (safePageNum - 1) * page_size;

            const filterTagClause = tag ? "AND t.name = ?" : "";
            const queryParams = tag
                ? [searchQuery, tag, page_size, offset]
                : [searchQuery, page_size, offset];

            const response: Array<{
                name: string;
                avatar: string;
                is_nsfw_allowed: number;
                date_creation: Date;
                is_banned: number;
                tags: string | null;
                date_deleted: Date | null;
            }> = await connection.query(
                `SELECT b.name, b.avatar, b.is_nsfw_allowed, b.date_creation, b.is_banned, b.date_deleted, 
                GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ',') AS tags
                FROM burrow b
                LEFT JOIN burrow_tag bt ON bt.burrow_id = b.id
                LEFT JOIN tag t ON t.id = bt.tag_id
                WHERE b.name LIKE ? ESCAPE '\\\\' ${filterTagClause}
                GROUP BY b.id
                ORDER BY b.date_creation DESC
                LIMIT ? OFFSET ?`,
                queryParams,
            );

            await connection.end();

            return {
                data: response.map((row) => ({
                    name: row.name,
                    avatar: row.avatar,
                    is_nsfw_allowed: Boolean(row.is_nsfw_allowed),
                    dateCreation:
                        row.date_creation instanceof Date
                            ? row.date_creation.toISOString()
                            : String(row.date_creation),
                    tag: row.tags ? row.tags.split(",") : [],
                    is_banned: row.is_banned ? true : false,
                    date_deleted: row.date_deleted,
                })),
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
