/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Pool } from "mariadb";
import { database } from "../../utils/database";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FileTypes, PostData, PostTypes } from "~/assets/customTypes";
import { uploadFile } from "~/server/core/cdn/file";
import { formatApiError } from "~/utils/format";
import { Post } from "~/server/core/ges/post";

/**
 * Creates a new post in the database.
 *
 * @returns {object} Result or error
 */
export default defineEventHandler(async (event) => {
    let connection: Pool | null = null;

    try {
        const formData: FormData = await readFormData(event);
        if (!formData)
            throw new Error("no form data provided", {
                cause: { statusCode: 1400 },
            });

        const rawCreatePostPayload: string | null = formData.get(
            "createPostPayload",
        ) as string | null;
        if (!rawCreatePostPayload)
            throw new Error(
                "Please complete all required fields and try again.",
                { cause: { statusCode: 1400 } },
            );

        const createPostPayload: PostData = JSON.parse(rawCreatePostPayload);
        const {
            hopper_id,
            burrow_id,
            burrow_label_id,
            title,
            type,
            description,
        } = createPostPayload;

        if (!hopper_id || !burrow_id || !title || !type)
            throw new Error(
                "Please complete all required fields and try again.",
                { cause: { statusCode: 1400 } },
            );

        const file: File | null = formData.get("mediaFile") as File | null;
        const media: string | null = formData.get("fileNamePost") as
            | string
            | null;
        if (file && !media)
            throw new Error(
                "Something went wrong while uploading your file. Please try again later.",
                {
                    cause: { statusCode: 1400 },
                },
            );

        // Upload the media file to the SFTP server
        if (file && media) {
            if (type === "video")
                await uploadFile(media, FileTypes.postVideo, file);
            if (type === "image")
                await uploadFile(media, FileTypes.postImage, file);
        }

        connection = await database();

        const checkQuery = `
            SELECT id FROM post
            WHERE title = ?
              AND burrow_id = ?
              AND DATE(date_creation) = CURDATE()
            LIMIT 1
        `;
        const existing: Array<{
            id: number;
        }> = await connection.query(checkQuery, [title, burrow_id]);
        if (existing.length) {
            throw new Error(
                "A post with this title was already created today in this burrow.",
                { cause: { statusCode: 1400 } },
            );
        }
        if (createPostPayload.is_concept) {
            const checkConceptLimitQuery = `
            SELECT COUNT(*) >= 5 AS has_too_many_concepts
            FROM post
            WHERE hopper_id = ? AND is_concept = 1
        `;
            const count = await connection.query(checkConceptLimitQuery, [
                burrow_id,
            ]);

            if (count[0].has_too_many_concepts) {
                throw new Error(
                    "You can only have 5 unpublished concepts. Please review your other pending posts.",
                    {
                        cause: { statusCode: 1400 },
                    },
                );
            }
        }
        const checkVerivicationQuery = `
            SELECT date_verification FROM hopper WHERE id = ? LIMIT 1            `;
        const isAllowedToPost = await connection.query(checkVerivicationQuery, [
            hopper_id,
        ]);
        if (isAllowedToPost[0].date_verification === null) {
            throw new Error(
                "You are not allowed to post, you need to verify your account.",
                { cause: { statusCode: 1400 } },
            );
        }

        const query = `
            INSERT INTO post (
                hopper_id,
                burrow_id,
                burrow_label_id,
                title,
                description,
                type,
                is_nsfw,
                is_spoiler,
                is_concept,
                can_praise,
                can_comment,
                media,
                date_creation

            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            hopper_id,
            burrow_id,
            burrow_label_id,
            title,
            description || "",
            type,
            createPostPayload.is_nsfw || false,
            createPostPayload.is_spoiler || false,
            createPostPayload.is_concept || false,
            createPostPayload.can_praise || false,
            createPostPayload.can_comment || false,
            media || null,
            new Date(),
        ];

        const result = await connection.query(query, values);
        const post = new Post(
            result.insertId,
            hopper_id,
            null,
            burrow_id,
            PostTypes[type as keyof typeof PostTypes],
            connection,
        );
        await post.create();
        return { success: true, postId: result.insertId?.toString() };
    } catch (error: any) {
        throw formatApiError(error);
    } finally {
        if (connection) await connection.end();
    }
});
