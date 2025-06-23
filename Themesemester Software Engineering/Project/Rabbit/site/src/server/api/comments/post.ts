import { database } from "~/server/utils/database";
import { readBody } from "h3";
import type { Pool } from "mariadb";
import { formatApiError } from "~/utils/format";

/**
 * Creates a new comment on a post.
 * This endpoint allows users to add comments to posts.
 * @param event - The H3 event containing the request data.
 */
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { content, postId, hopperId, parentCommentId } = body;

        // Input validation
        if (!content || !postId || !hopperId) {
            throw createError({ statusCode: 400, statusMessage: "Missing required fields." });
        }

        // Validate content
        if (typeof content !== 'string' || content.trim().length === 0) {
            throw createError({ statusCode: 400, statusMessage: "Content must be a non-empty string." });
        }

        if (content.length > 2000) {
            throw createError({ statusCode: 400, statusMessage: "Content exceeds maximum length of 2000 characters." });
        }

        // Validate IDs are positive integers
        if (!Number.isInteger(postId) || postId <= 0) {
            throw createError({ statusCode: 400, statusMessage: "Invalid post ID." });
        }

        if (!Number.isInteger(hopperId) || hopperId <= 0) {
            throw createError({ statusCode: 400, statusMessage: "Invalid hopper ID." });
        }

        if (parentCommentId !== null && (!Number.isInteger(parentCommentId) || parentCommentId <= 0)) {
            throw createError({ statusCode: 400, statusMessage: "Invalid parent comment ID." });
        }

        // Sanitize content
        const sanitizedContent = content.trim()
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');

        const connection: Pool = await database();

        await connection.query(
            `INSERT INTO post_comment (content, post_id, hopper_id, comment_id, date_creation)
       VALUES (?, ?, ?, ?, NOW())`,
            [sanitizedContent, postId, hopperId, parentCommentId ?? null]
        );

        // Handle achievements for comments
        await handleCommentCD("add", hopperId, connection);

        await connection.end();

        return { success: true };
    } catch (error: any) {
        throw formatApiError(error);
    }
});