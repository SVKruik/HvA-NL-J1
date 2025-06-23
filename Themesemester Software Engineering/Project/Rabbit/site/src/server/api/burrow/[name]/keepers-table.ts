import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import type {
    KeeperTypes,
    PaginatedKeeperBurrowTypes,
} from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

/**
 * API handler to retrieve paginated burrow members with keeper and owner status.
 *
 * Searches for members in a specific burrow (by name), filters them by username,
 * and returns paginated results including metadata like keeper/owner roles.
 *
 * @param event - The incoming API event containing the route param (burrow name) and body ([search, page]).
 * @returns A paginated list of keepers along with role metadata.
 * @throws Returns a formatted error with appropriate HTTP status if the burrow is not found or on failure.
 */
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
            const ownerHopperId = burrowResult[0].hopper_id;

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

            const keepers = await connection.query(
                `SELECT 
    bm.hopper_id,
    h.username AS name,
    h.avatar,
    h.email,
    CASE WHEN bk.hopper_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_keeper,
    CASE WHEN bm.hopper_id = ? THEN TRUE ELSE FALSE END AS is_owner
FROM burrow_member bm
JOIN hopper h ON bm.hopper_id = h.id
JOIN burrow b ON bm.burrow_id = b.id
LEFT JOIN burrow_keeper bk ON bm.hopper_id = bk.hopper_id AND bm.burrow_id = bk.burrow_id
WHERE bm.burrow_id = ? AND h.username LIKE ?
ORDER BY 
    is_owner DESC,
    is_keeper DESC,
    h.username ASC
LIMIT ? OFFSET ?
`,
                [ownerHopperId, burrowId, searchQuery, pageSize, offset],
            );

            await connection.end();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: KeeperTypes[] = keepers.map((k: any) => ({
                id: k.hopper_id,
                name: k.name,
                avatar: k.avatar,
                email: k.email,
                owner: Boolean(k.is_owner),
                keeper: Boolean(k.is_keeper),
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
