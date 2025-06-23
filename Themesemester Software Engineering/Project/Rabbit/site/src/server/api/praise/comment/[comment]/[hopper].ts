import { database } from '~/server/utils/database';
import type { Pool } from 'mariadb';
import { formatApiError } from '~/utils/format';
import { getRouterParam, readBody } from 'h3';

/**
 * Handles praise updates for a comment by a hopper.
 * This endpoint allows a hopper to give praise (upvote, downvote, or remove praise) to a comment.
 * It checks if the hopper has already praised the comment and updates or inserts the praise accordingly.
 * @param commentId - The ID of the comment to be praised.
 * @param hopperId - The ID of the hopper giving the praise.
 * @param value - The praise value (-1 for downvote, 0 for remove praise, 1 for upvote).
 * 
 */
export default defineEventHandler(async (event) => {
    try {
        const commentId = Number(getRouterParam(event, 'comment'));
        const hopperId = Number(getRouterParam(event, 'hopper'));

        if (isNaN(commentId) || isNaN(hopperId)) {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid comment or hopper ID",
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

        const [existing] = await connection.query(
            `SELECT 1 FROM hopper_praise 
       WHERE hopper_id = ? AND comment_id = ? AND post_id IS NULL LIMIT 1`,
            [hopperId, commentId]
        );

        if (value === 0) {
            if (existing) {
                await connection.query(
                    `DELETE FROM hopper_praise 
           WHERE hopper_id = ? AND comment_id = ? AND post_id IS NULL`,
                    [hopperId, commentId]
                );
            }
        } else if (existing) {
            await connection.query(
                `UPDATE hopper_praise 
         SET value = ?, date_creation = NOW()
         WHERE hopper_id = ? AND comment_id = ? AND post_id IS NULL`,
                [value, hopperId, commentId]
            );
        } else {
            await connection.query(
                `INSERT INTO hopper_praise (hopper_id, post_id, comment_id, value, date_creation)
         VALUES (?, NULL, ?, ?, NOW())`,
                [hopperId, commentId, value]
            );
        }

        // Handle praise achievements
        await handlePraiseCD(hopperId, connection);

        await connection.end();

        return {
            success: true,
            message: value === 0 ? "Praise entry deleted" : "Praise state updated",
            data: { commentId, hopperId, value },
        };
    } catch (error: any) {
        throw formatApiError(error);
    }
});
