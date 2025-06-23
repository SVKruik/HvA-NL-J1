import { getRouterParam } from "h3";
import { database } from "~/server/utils/database";
import { deleteFile } from "~/server/core/cdn/file";
import { FileTypes } from "~/assets/customTypes";
import type { Pool } from "mariadb";
import { formatApiError } from "~/utils/format";

/**
 * API handler to delete a post and its associated media file.
 *
 * @param event - The incoming API event containing the post ID as a route parameter.
 * @returns An object indicating whether the operation was successful.
 */
export default defineEventHandler(async (event) => {
    try {
        const postId = parseInt(getRouterParam(event, "id") ?? "", 10);
        if (isNaN(postId)) {
            throw createError({ statusCode: 400, statusMessage: "Invalid post ID" });
        }

        const connection: Pool = await database();

        const [post] = await connection.query(
            `
        SELECT media, type
        FROM post
        WHERE id = ?
        LIMIT 1
      `,
            [postId]
        );

        if (!post) {
            await connection.end();
            throw createError({ statusCode: 404, statusMessage: "Post not found" });
        }

        const { media, type } = post;

        await connection.query(
            `
        DELETE FROM post
        WHERE id = ?
      `,
            [postId]
        );

        await connection.end();

        if ((type === "image" || type === "video") && media) {
            const fileType: FileTypes = type === "image" ? FileTypes.postImage : FileTypes.postVideo;
            const extension = fileType === FileTypes.postImage ? ".webp" : ".mp4";
            try {
                await deleteFile(media + extension, fileType);
            } catch (err) {
                throw new Error("Something went wrong while deleting the media file.", { cause: { statusCode: 1500 } });
            }
        }

        return { success: true };
    } catch (error: any) {
        throw formatApiError(error);
    }
});