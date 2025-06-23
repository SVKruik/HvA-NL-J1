import { database } from "~/server/utils/database";
import { getRouterParam, getQuery } from "h3";
import { formatApiError, formatTimeAgo } from "~/utils/format";
import type { Pool } from "mariadb";
import type { Comment } from "~/assets/customTypes";

/**
 * Fetches comments associated with a specific post.
 * If a viewerId is provided, it will also include comments made by that user.
 * @param postId - The ID of the post whose comments are to be fetched.
 * @param viewerId - Optional ID of the viewer to include their comments as well.
 * 
 */
export default defineEventHandler(async (event): Promise<Comment[]> => {
  try {
    const postId = Number(getRouterParam(event, "post"));
    const viewerId = Number(getQuery(event)?.viewerId);
    const hasValidViewer = !isNaN(viewerId) && viewerId > 0;

    if (isNaN(postId)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid post ID" });
    }

    const connection: Pool = await database();

    const comments = await connection.query(`
      SELECT
        pc.id AS comment_id,
        pc.content,
        pc.date_creation,
        pc.comment_id AS parent_comment_id,
        pc.date_modified,
        p.id AS post_id,
        p.title AS post_title,
        b.name AS burrow_name,
        b.avatar AS burrow_avatar,
        h.username AS username,
        h.avatar AS hopper_avatar,
        COALESCE((
          SELECT SUM(value)
          FROM hopper_praise
          WHERE comment_id = pc.id
        ), 0) AS upvote_count,
        ${hasValidViewer
        ? `(SELECT value FROM hopper_praise WHERE hopper_id = ${viewerId} AND comment_id = pc.id LIMIT 1) AS praise_value`
        : `NULL AS praise_value`
      }
      FROM post_comment pc
      LEFT JOIN post p ON pc.post_id = p.id
      LEFT JOIN burrow b ON p.burrow_id = b.id
      LEFT JOIN hopper h ON pc.hopper_id = h.id
      WHERE pc.post_id = ?
      ORDER BY pc.date_creation DESC
      LIMIT 100;
    `, [postId]);

    await connection.end();

    return comments.map((row: any) => ({
      id: row.comment_id,
      username: row.username,
      avatar: row.hopper_avatar,
      content: row.content,
      timeAgo: formatTimeAgo(row.date_creation),
      dateModified: row.date_modified ? formatTimeAgo(row.date_modified) : null,
      postId: row.post_id,
      postTitle: row.post_title,
      postBurrow: "b/" + (row.burrow_name?.replace(/ /g, "") ?? ""),
      postBurrowAvatar: row.burrow_avatar,
      isReply: !!row.parent_comment_id,
      commentId: row.parent_comment_id || 0,
      upvotes: Number(row.upvote_count) || 0,
      praise: hasValidViewer ? row.praise_value ?? 0 : 0,
    }));
  } catch (error: any) {
    throw formatApiError(error);
  }
});