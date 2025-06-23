import { database } from "~/server/utils/database";
import type { Pool } from "mariadb";
import {
    PostTypes,
    type Post,
    type PostComponentProps,
} from "~/assets/customTypes";
import { formatApiError, formatTimeAgo } from "~/utils/format";

/**
 * Handles fetching posts from the database with optional sorting, filtering, and exclusion.
 *
 * @param event - The incoming event containing query parameters for sorting, filtering by burrow or username, and excluding post IDs.
 * @returns A promise that resolves to an array of `PostComponentProps` representing the posts.
 *
 * Query Parameters:
 * - `sort`: (optional) Sort order, either "new" (default) or "trending".
 * - `burrow`: (optional) Filter posts by burrow ID.
 * - `username`: (optional) Filter posts by username.
 * - `exclude`: (optional) Comma-separated list of post IDs to exclude from the results.
 */
export default defineEventHandler(
    async (event): Promise<Array<PostComponentProps>> => {
        try {
            const query = getQuery(event);
            const sort: string = (query.sort as string) || "new";
            const burrow: number | null =
                parseInt(query.burrow as string) || null;
            const username: string | null = (query.username as string) || null;
            const exclude: string = (query.exclude as string) || "";
            const praisedOnly: boolean = query.praisedOnly === "true";

            const hopperId = Number(query?.hopper); // target hopper
            const viewerId = Number(query?.viewer); // logged-in user
            const hasValidHopper = !isNaN(hopperId) && hopperId > 0;
            const hasValidViewer = !isNaN(viewerId) && viewerId > 0;
            const excludedIds: number[] = exclude
                .split(",")
                .map((id) => parseInt(id.trim()))
                .filter((id) => !isNaN(id));

            const connection: Pool = await database();

            const conditions: string[] = ["post.is_concept = 0"];
            conditions.push(
                "burrow.date_deleted IS NULL AND (hopper.is_banned = 0 OR hopper.is_banned IS NULL) AND (burrow.is_banned = 0 OR burrow.is_banned IS NULL)",
            );

            if (sort === "joined" && hasValidViewer) {
                conditions.push(`
        EXISTS (
            SELECT 1 FROM burrow_member
            WHERE burrow_member.burrow_id = post.burrow_id
              AND burrow_member.hopper_id = ${viewerId}
        )
    `);
            }

            if (sort === "trending")
                conditions.push(
                    "post.date_creation >= DATE_SUB(NOW(), INTERVAL 30 DAY)",
                );
            if (burrow) conditions.push(`post.burrow_id = ${burrow}`);
            if (username && !praisedOnly)
                conditions.push(
                    `hopper.username = ${connection.escape(username)}`,
                );
            if (excludedIds.length > 0)
                conditions.push(`post.id NOT IN (${excludedIds.join(",")})`);
            if (praisedOnly && hasValidHopper) {
                conditions.push(`EXISTS (
                SELECT 1 FROM hopper_praise
                WHERE hopper_praise.post_id = post.id
                  AND hopper_praise.hopper_id = ${hopperId}
                  AND hopper_praise.value != 0
            )`);
            }

            const whereClause =
                conditions.length > 0
                    ? `WHERE ${conditions.join(" AND ")}`
                    : "";

            const baseQuery = `
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
                hopper.date_creation as birthday,
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
            FROM
                post
                LEFT JOIN hopper ON post.hopper_id = hopper.id
                LEFT JOIN burrow ON post.burrow_id = burrow.id
            ${whereClause}
        `;

            let orderClause = "";
            if (praisedOnly) {
                orderClause = `ORDER BY (
        SELECT MAX(hp.date_creation)
        FROM hopper_praise hp
        WHERE hp.post_id = post.id
          AND hp.hopper_id = ${hopperId}
          AND hp.value != 0
    ) DESC`;
            } else if (sort === "trending") {
                orderClause =
                    "ORDER BY upvote_count DESC, post.date_creation DESC";
            } else {
                orderClause = "ORDER BY post.date_creation DESC";
            }

            let posts: Post[] = await connection.query(
                `${baseQuery} ${orderClause} LIMIT 10;`,
            );

            if (sort === "trending" && posts.length === 0 && !praisedOnly) {
                const fallbackConditions = [
                    "post.is_concept = 0",
                    "burrow.date_deleted IS NULL",
                    "(hopper.is_banned = 0 OR hopper.is_banned IS NULL)",
                    "(burrow.is_banned = 0 OR burrow.is_banned IS NULL)",
                ];

                if (burrow)
                    fallbackConditions.push(`post.burrow_id = ${burrow}`);
                if (username)
                    fallbackConditions.push(
                        `hopper.username = ${connection.escape(username)}`,
                    );
                if (excludedIds.length > 0)
                    fallbackConditions.push(
                        `post.id NOT IN (${excludedIds.join(",")})`,
                    );

                const fallbackWhere =
                    fallbackConditions.length > 0
                        ? `WHERE ${fallbackConditions.join(" AND ")}`
                        : "";

                posts = await connection.query(`
        ${baseQuery.replace(whereClause, fallbackWhere)}
        ORDER BY upvote_count DESC, post.date_creation DESC
        LIMIT 10;
    `);
            }

            let praiseMap: Record<number, number> = {};
            if (hasValidViewer && posts.length > 0) {
                const postIds = posts.map((p) => p.id).filter(Boolean);
                if (postIds.length > 0) {
                    const praiseRows = await connection.query(
                        `SELECT post_id, value FROM hopper_praise WHERE hopper_id = ? AND post_id IN (${postIds.join(",")})`,
                        [viewerId],
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
                praise: hasValidHopper ? (praiseMap[post.id] ?? 0) : 0,
                birthday: post.birthday,
            }));
        } catch (error: any) {
            throw formatApiError(error);
        }
    },
);
