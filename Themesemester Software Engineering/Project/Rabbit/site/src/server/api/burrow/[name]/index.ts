import { database } from "~/server/utils/database";
import type { Pool } from "mariadb";
import type { Burrow } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

/**
 * API handler to fetch a burrow by its name.
 *
 * Retrieves burrow details from the database using the provided burrow name from the route parameter.
 * Returns the burrow information if found, otherwise returns null.
 * Handles errors and responds with appropriate HTTP status codes and messages.
 *
 * @param event - The incoming API event containing route parameters.
 * @returns An object with burrow details or null if not found.
 * @throws Returns an error with a relevant HTTP status code and message if something goes wrong.
 */
export default defineEventHandler(async (event): Promise<Burrow> => {
    try {
        const burrowName = getRouterParam(event, "name");
        if (!burrowName) {
            throw createError({
                statusCode: 400,
                statusMessage: "Missing burrow name",
            });
        }

        const connection: Pool = await database();

        const [burrow] = await connection.query(
            `
            SELECT 
                b.id,
                b.hopper_id,
                b.name,
                b.description,
                b.avatar,
                b.banner,
                b.rules,
                b.is_nsfw_allowed,
                b.date_creation,
                b.date_modified,
                b.is_banned,
                b.date_deleted,
                (
                    SELECT COUNT(*) 
                    FROM burrow_member bm 
                    WHERE bm.burrow_id = b.id
                ) AS member_count,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'username', h.username,
                            'avatar', h.avatar,
                            'email', h.email 

                        )
                    )
                    FROM burrow_keeper bk
                    JOIN hopper h ON h.id = bk.hopper_id
                    WHERE bk.burrow_id = b.id
                ) AS keepers,
                (
                    SELECT JSON_ARRAYAGG(t.name)
                    FROM burrow_tag bt
                    JOIN tag t ON t.id = bt.tag_id
                    WHERE bt.burrow_id = b.id
                ) AS tags
            FROM burrow b
            WHERE b.name = ?
        `,
            [burrowName],
        );

        await connection.end();

        if (!burrow)
            throw createError({
                statusCode: 404,
                statusMessage: "This burrow does not exist.",
            });

        return {
            id: Number(burrow.id),
            ownerId: burrow.hopper_id,
            name: burrow.name,
            description: burrow.description,
            avatar: burrow.avatar ?? null,
            banner: burrow.banner ?? null,
            rules: burrow.rules ?? null,
            is_nsfw_allowed: Boolean(burrow.is_nsfw_allowed),
            dateCreation: burrow.date_creation,
            dateModified: burrow.date_modified,
            memberCount: Number(burrow.member_count),
            keepers:
                typeof burrow.keepers === "string"
                    ? JSON.parse(burrow.keepers)
                    : (burrow.keepers ?? []),
            tags:
                typeof burrow.tags === "string"
                    ? JSON.parse(burrow.tags)
                    : (burrow.tags ?? []),
            is_banned: burrow.is_banned ? true : false,
            date_deleted: burrow.date_deleted,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
