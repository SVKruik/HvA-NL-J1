import { database } from "~/server/utils/database";
import { getRouterParam } from "h3";
import { formatApiError } from "~/utils/format";
import type { Pool } from "mariadb";

/**
 * Deletes a comment by its ID.
 * This endpoint allows users to remove their comments.
 * @param event - The H3 event containing the request data.
 */
export default defineEventHandler(async (event) => {
    try {
        const commentId = getRouterParam(event, "comment");

        if (!commentId) {
            throw createError({ statusCode: 400, statusMessage: "Missing comment id." });
        }

        const connection: Pool = await database();

        const result = await connection.query(
            `DELETE FROM post_comment WHERE id = ?`,
            [commentId]
        );

        await connection.end();

        return { success: true, affectedRows: result.affectedRows };
    } catch (error: any) {
        throw formatApiError(error);
    }
});