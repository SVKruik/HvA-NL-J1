import { database } from "~/server/utils/database";
import { getRouterParam, readBody } from "h3";
import type { Pool } from "mariadb";
import { formatApiError } from "~/utils/format";

/**
 * Updates a comment's content by its ID.
 * This endpoint allows users to edit their comments.
 * @param event - The H3 event containing the request data.
 */
export default defineEventHandler(async (event) => {
    try {
        const commentId = Number(getRouterParam(event, "comment"));
        const body = await readBody(event);
        const { content } = body;

        if (!commentId || isNaN(commentId)) {
            throw createError({ statusCode: 400, statusMessage: "Invalid or missing comment ID." });
        }

        if (!content) {
            throw createError({ statusCode: 400, statusMessage: "Missing required fields." });
        }

        // Validate content
        if (typeof content !== 'string' || content.trim().length === 0) {
            throw createError({ statusCode: 400, statusMessage: "Content must be a non-empty string." });
        }

        if (content.length > 2000) {
            throw createError({ statusCode: 400, statusMessage: "Content exceeds maximum length of 2000 characters." });
        }

        // Sanitize content
        const sanitizedContent = content.trim()
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');

        const connection: Pool = await database();

        const result = await connection.query(
            `UPDATE post_comment SET content = ?, date_modified = NOW() WHERE id = ?`,
            [sanitizedContent, commentId]
        );

        await connection.end();

        return { success: true, affectedRows: result.affectedRows };
    } catch (error: any) {
        throw formatApiError(error);
    }
});
