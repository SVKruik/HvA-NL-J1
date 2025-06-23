import { database } from "~/server/utils/database";
import type { Pool } from "mariadb";
import { getRouterParam } from "h3";
import { formatApiError, formatTimeAgo } from "~/utils/format";
import {
    PostTypes,
    type Post,
    type PostComponentProps,
} from "~/assets/customTypes";

/**
 * Fetches all posts praised by a specific hopper (by username).
 *
 * @param event - The incoming API event containing the hopper username in the route.
 * @returns Array of PostComponentProps.
 */
export default defineEventHandler(
    async (event): Promise<PostComponentProps[]> => {
        try {
            const username = getRouterParam(event, "username");
            if (!username) {
                throw createError({
                    statusCode: 400,
                    statusMessage: "Invalid username",
                });
            }

            const connection: Pool = await database();

            // Zoek de hopper.id op basis van username
            const [hopper] = await connection.query(
                "SELECT id FROM hopper WHERE username = ? LIMIT 1",
                [username],
            );
            if (!hopper || !hopper.id) {
                await connection.end();
                throw createError({
                    statusCode: 404,
                    statusMessage: "User not found",
                });
            }
            const hopperId = hopper.id;

            const posts: Post[] = await connection.query(
                `
      SELECT
        post.id,
        post.burrow_id,
        post.hopper_id,
        post.title,
        post.description,
        post.date_creation,
        post.type,
        post.is_nsfw,
        post.is_spoiler,
        username,
        hopper.avatar,
        burrow.name AS burrow_name,
        burrow.avatar AS burrow_avatar,
        post.media,
        (
          SELECT COALESCE(SUM(value), 0)
          FROM hopper_praise
          WHERE post_id = post.id
        ) AS upvote_count,
        (
          SELECT COUNT(*)
          FROM post_comment
          WHERE post_comment.post_id = post.id
        ) AS comment_count,
        (
          SELECT JSON_OBJECT(
            'id', bl.id,
            'name', bl.name,
            'color', bl.color
          )
          FROM burrow_label bl
          WHERE bl.id = post.burrow_label_id
        ) AS burrow_label
      FROM hopper_praise
        LEFT JOIN post ON hopper_praise.post_id = post.id
        LEFT JOIN hopper ON post.hopper_id = hopper.id
        LEFT JOIN burrow ON post.burrow_id = burrow.id
      WHERE hopper_praise.hopper_id = ?
        AND post.is_concept = 0
        AND hopper_praise.value != 0
      ORDER BY post.date_creation DESC
      LIMIT 50;
    `,
                [hopperId],
            );

            // Fetch praise values for each post if hopperId is valid
            let praiseMap: Record<number, number> = {};
            if (hasValidHopper && posts.length > 0) {
                const postIds = posts.map((p) => p.id).filter(Boolean);
                if (postIds.length > 0) {
                    const praiseRows = await connection.query(
                        `SELECT post_id, value FROM hopper_praise WHERE hopper_id = ? AND post_id IN (${postIds.join(",")})`,
                        [hopperId],
                    );
                    for (const row of praiseRows) {
                        praiseMap[row.post_id] = row.value;
                    }
                }
            }

            await connection.end();

            return posts.map((post: Post) => ({
                id: Number(post.id),
                burrowId: Number(post.burrow_id),
                hopper_id: Number(post.hopper_id),
                username: post.username,
                avatar: post.avatar,
                burrow: "b/" + post.burrow_name.replace(/ /g, ""),
                burrowAvatar: post.burrow_avatar || null,
                timeAgo: formatTimeAgo(post.date_creation),
                title: post.title,
                description: post.description,
                media: post.media,
                label: post.burrow_label,
                imageAlt: post.title,
                upvotes: Number(post.upvote_count) || 0,
                comments: Number(post.comment_count) || 0,
                isNSFW: !!post.is_nsfw,
                isSpoiler: !!post.is_spoiler,
                member: false,
                type: PostTypes[post.type as keyof typeof PostTypes],
                birthday: post.birthday ?? null,
                praise: post.praise ?? 0,
            }));
        } catch (error: any) {
            throw formatApiError(error);
        }
    },
);
