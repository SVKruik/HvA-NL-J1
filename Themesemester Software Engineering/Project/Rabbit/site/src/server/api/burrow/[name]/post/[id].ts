import { database } from "~/server/utils/database";
import type { Pool } from "mariadb";
import { PostTypes, type PostComponentProps } from "~/assets/customTypes";
import { formatApiError, formatTimeAgo } from "~/utils/format";

/**
 * API handler to fetch a single post by ID.
 *
 * @param event - The incoming API event containing route parameters for burrow name and post ID.
 * @returns A promise that resolves to a single PostComponentProps object representing the post.
 */
export default defineEventHandler(
    async (event): Promise<PostComponentProps | null> => {
        try {
            const burrowName = getRouterParam(event, "name");
            const postId = parseInt(getRouterParam(event, "id") ?? "", 10);
            const query = getQuery(event);
            const hopperId = Number(query?.hopper);
            const hasValidHopper = !isNaN(hopperId) && hopperId > 0;

            if (!burrowName || isNaN(postId)) {
                throw createError({
                    statusCode: 400,
                    statusMessage: "Missing or invalid burrow name or post ID",
                });
            }

            const connection: Pool = await database();

            const [post] = await connection.query(
                `
          SELECT
            post.id,
            post.hopper_id,
            post.burrow_id,
            post.title,
            post.description,
            post.media,
            post.type,
            post.date_creation,
            post.is_nsfw,
            post.is_spoiler,
            hopper.date_creation as birthday,
            hopper.email,
            hopper.avatar,
            hopper.username,
            burrow.name AS burrow_name,
            (
              SELECT COALESCE(SUM(value), 0) FROM hopper_praise WHERE post_id = post.id
            ) AS upvote_count,
            (
              SELECT COUNT(*) FROM post_comment WHERE post_id = post.id
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
          FROM post
          LEFT JOIN hopper ON post.hopper_id = hopper.id
          LEFT JOIN burrow ON post.burrow_id = burrow.id
          WHERE post.id = ? AND burrow.name = ?
          LIMIT 1
        `,
                [postId, burrowName],
            );

            if (!post) {
                await connection.end();
                return null;
            }

            let praiseValue = 0;
            if (hasValidHopper) {
                const [praise] = await connection.query(
                    `SELECT value FROM hopper_praise WHERE hopper_id = ? AND post_id = ? LIMIT 1`,
                    [hopperId, postId],
                );
                praiseValue = praise?.value ?? 0;
            }

            await connection.end();

            return {
                id: Number(post.id),
                burrowId: Number(post.burrow_id),
                hopper_id: Number(post.hopper_id),
                username: post.username,
                birthday: post.birthday,
                avatar: post.avatar || "",
                burrow: "b/" + post.burrow_name.replace(/ /g, ""),
                timeAgo: formatTimeAgo(post.date_creation),
                title: post.title,
                description: post.description,
                media: post.media,
                imageAlt: post.title,
                upvotes: Number(post.upvote_count) || 0,
                comments: Number(post.comment_count) || 0,
                isNSFW: !!post.is_nsfw,
                isSpoiler: !!post.is_spoiler,
                member: false,
                type: PostTypes[post.type as keyof typeof PostTypes],
                praise: praiseValue,
                label: post.burrow_label
            };
        } catch (error: any) {
            throw formatApiError(error);
        }
    },
);
