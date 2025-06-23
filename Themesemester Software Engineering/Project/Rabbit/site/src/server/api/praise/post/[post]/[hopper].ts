import { database } from '~/server/utils/database';
import type { Pool } from 'mariadb';
import { formatApiError } from '~/utils/format';

/**
 * Updates or inserts the praise value for a specific post and hopper.
 * @param event - The server event containing the request parameters and body.
 * @return An object indicating success and the updated praise state.
 * * @throws {Error} If the post or hopper ID is invalid, or if the praise value is not -1, 0, or 1.
 * 
 */
export default defineEventHandler(async (event) => {
    try {
        const postId = Number(getRouterParam(event, 'post'));
        const hopperId = Number(getRouterParam(event, 'hopper'));

        if (isNaN(postId) || isNaN(hopperId)) {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid post or hopper ID",
            });
        }

        const body = await readBody(event);
        const value = Number(body?.value);

        if (![1, 0, -1].includes(value)) {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid praise value. Must be -1, 0, or 1.",
            });
        }

        const connection: Pool = await database();

        // Check if entry exists
        const [existing] = await connection.query(
            `SELECT 1 FROM hopper_praise WHERE hopper_id = ? AND post_id = ? LIMIT 1`,
            [hopperId, postId]
        );

        if (value === 0) {
            // Delete entry if exists
            if (existing) {
                await connection.query(
                    `DELETE FROM hopper_praise WHERE hopper_id = ? AND post_id = ?`,
                    [hopperId, postId]
                );
            }
        } else if (existing) {
            // Update existing
            await connection.query(
                `UPDATE hopper_praise SET value = ?, date_creation = NOW()
                 WHERE hopper_id = ? AND post_id = ?`,
                [value, hopperId, postId]
            );
        } else {
            // Insert new
            await connection.query(
                `INSERT INTO hopper_praise (hopper_id, post_id, value, date_creation)
                 VALUES (?, ?, ?, NOW())`,
                [hopperId, postId, value]
            );
        }

        // Handle praise achievements
        await handlePraiseCD(hopperId, connection);

        await connection.end();

        return {
            success: true,
            message: value === 0 ? "Praise entry deleted" : "Praise state updated",
            data: { postId, hopperId, value },
        };
    } catch (error: any) {
        throw formatApiError(error);
    }
});
