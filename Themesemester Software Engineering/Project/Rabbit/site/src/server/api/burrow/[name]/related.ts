import { database } from '~/server/utils/database';
import type { Pool } from 'mariadb';
import type { Burrow } from '~/assets/customTypes';
import { formatApiError } from '~/utils/format';

/**
 * API handler to fetch up to 3 related burrows based on shared tags by burrow name.
 *
 * @param event - The incoming API event containing route parameters.
 * @returns An array of related burrows.
 */
export default defineEventHandler(async (event): Promise<Burrow[]> => {
    try {
        const burrowName = getRouterParam(event, 'name');

        if (!burrowName) {
            throw createError({
                statusCode: 400,
                statusMessage: "Missing burrow name",
            });
        }

        const connection: Pool = await database();

        // First get ID of current burrow
        const [current] = await connection.query(
            `SELECT id FROM burrow WHERE name = ? LIMIT 1`,
            [burrowName]
        );

        if (!current) {
            await connection.end();
            return [];
        }

        const burrowId = Number(current.id);

        // Get tag IDs of current burrow
        const tags = await connection.query(
            `SELECT tag_id FROM burrow_tag WHERE burrow_id = ?`,
            [burrowId]
        );
        const tagIds = tags.map((t: any) => t.tag_id);

        if (tagIds.length === 0) {
            await connection.end();
            return [];
        }

        // Get max 3 other burrows sharing tags
        const related = await connection.query(`
            SELECT DISTINCT b.id, b.name, b.description, b.avatar, b.banner,
                b.rules, b.is_nsfw_allowed, b.date_creation, b.date_modified
            FROM burrow b
            JOIN burrow_tag bt ON b.id = bt.burrow_id
            WHERE bt.tag_id IN (${tagIds.join(",")})
            AND b.id != ?
            LIMIT 3
        `, [burrowId]);

        await connection.end();

        return related.map((b: any) => ({
            id: Number(b.id),
            name: b.name,
            description: b.description,
            avatar: b.avatar ?? null,
            banner: b.banner ?? null,
            rules: b.rules ?? null,
            is_nsfw_allowed: Boolean(b.is_nsfw_allowed),
            dateCreation: b.date_creation,
            dateModified: b.date_modified,
            memberCount: 0,
            keepers: [],
            tags: []
        }));
    } catch (error: any) {
        throw formatApiError(error);
    }
});